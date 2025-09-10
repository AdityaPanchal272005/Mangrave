const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const routes = require('./routes');
const errorHandler = require('./middleware/error');

const app = express();

// Security middleware
app.use(helmet({
	crossOriginResourcePolicy: { policy: 'cross-origin' },
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			scriptSrc: ["'self'"],
			imgSrc: ["'self'", "data:", "https:"],
		},
	},
	hsts: {
		maxAge: 31536000,
		includeSubDomains: true,
		preload: true
	}
}));

// CORS configuration
app.use(cors({
	origin: process.env.NODE_ENV === 'production' 
		? ['https://yourdomain.com'] 
		: ['http://localhost:3000', 'http://localhost:8081'],
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression middleware
app.use(compression({
	level: 6,
	threshold: 1024,
	filter: (req, res) => {
		if (req.headers['x-no-compression']) {
			return false;
		}
		return compression.filter(req, res);
	}
}));

// Rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
	message: {
		error: 'Too many requests from this IP, please try again later.',
		retryAfter: '15 minutes'
	},
	standardHeaders: true,
	legacyHeaders: false,
	skip: (req) => {
		// Skip rate limiting for health checks
		return req.path === '/health';
	}
});

// Speed limiting for API endpoints
const speedLimiter = slowDown({
	windowMs: 15 * 60 * 1000, // 15 minutes
	delayAfter: 50, // allow 50 requests per 15 minutes, then...
	delayMs: 500 // begin adding 500ms of delay per request above 50
});

app.use(limiter);
app.use('/api', speedLimiter);

// Body parsing middleware with size limits
app.use(express.json({ 
	limit: '10mb',
	verify: (req, res, buf) => {
		// Add request timestamp for monitoring
		req.requestTime = Date.now();
	}
}));
app.use(express.urlencoded({ 
	extended: true, 
	limit: '10mb' 
}));

// Logging middleware with better formatting
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
	skip: (req, res) => {
		// Skip logging for health checks
		return req.path === '/health';
	}
}));

// Request timing middleware
app.use((req, res, next) => {
	const start = Date.now();
	
	res.on('finish', () => {
		const duration = Date.now() - start;
		if (duration > 1000) { // Log slow requests
			console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
		}
	});
	
	next();
});

// Health check endpoint with detailed status
app.get('/health', async (req, res) => {
	try {
		const healthStatus = {
			status: 'ok',
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			memory: process.memoryUsage(),
			version: process.env.npm_package_version || '1.0.0',
			environment: process.env.NODE_ENV || 'development'
		};

		// Check database connectivity
		try {
			const FirestoreService = require('./services/firestoreService');
			const testService = new FirestoreService('health_check');
			await testService.healthCheck();
			healthStatus.database = 'connected';
		} catch (error) {
			healthStatus.database = 'disconnected';
			healthStatus.databaseError = error.message;
		}

		res.json(healthStatus);
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: 'Health check failed',
			error: error.message
		});
	}
});

// API routes
app.use('/api', routes);

// 404 handler
app.use('*', (req, res) => {
	res.status(404).json({
		error: 'Not Found',
		message: `Route ${req.originalUrl} not found`,
		timestamp: new Date().toISOString()
	});
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
	console.log('SIGTERM received, shutting down gracefully');
	process.exit(0);
});

process.on('SIGINT', () => {
	console.log('SIGINT received, shutting down gracefully');
	process.exit(0);
});

module.exports = app;


