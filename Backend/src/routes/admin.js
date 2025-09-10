const express = require('express');
const { verifyFirebaseIdToken } = require('../middleware/auth');
const FirestoreService = require('../services/firestoreService');

const router = express.Router();

// Authenticated profile endpoints (stored in users collection by uid)
router.get('/profile', verifyFirebaseIdToken, async (req, res, next) => {
	try {
		const uid = req.user.uid;
		const svc = new FirestoreService('users');
		const doc = await svc.getById(uid);
		res.json(doc || { id: uid });
	} catch (e) { next(e); }
});

router.put('/profile', verifyFirebaseIdToken, async (req, res, next) => {
	try {
		const uid = req.user.uid;
		const svc = new FirestoreService('users');
		const updated = await svc.update(uid, req.body || {});
		res.json(updated);
	} catch (e) { next(e); }
});

// Dashboard stats - optimized with caching and aggregation
router.get('/dashboard/stats', async (req, res, next) => {
	try {
		const incidentsSvc = new FirestoreService('incidents');
		const usersSvc = new FirestoreService('users');
		
		// Use optimized aggregation methods
		const [incidentStats, userStats] = await Promise.all([
			incidentsSvc.getAggregatedStats(),
			usersSvc.getAggregatedStats()
		]);
		
		// Calculate additional metrics
		const resolvedReports = incidentStats.byStatus.resolved || 0;
		const pendingReports = incidentStats.total - resolvedReports;
		const newIncidentsThisWeek = incidentStats.recentCount || 0;
		
		res.json({
			totalReports: incidentStats.total,
			resolvedReports,
			pendingReports,
			newIncidentsThisWeek,
			activeUsers: userStats.total,
			categoriesBreakdown: incidentStats.byType,
			statusBreakdown: incidentStats.byStatus,
			lastUpdated: new Date().toISOString()
		});
	} catch (e) { next(e); }
});

// Incidents list - optimized with filtering and pagination
router.get('/incidents', async (req, res, next) => {
	try {
		const { status, type, limit = 50, page = 1 } = req.query;
		const svc = new FirestoreService('incidents');
		
		// Build filters
		const filters = {};
		if (status && status !== 'all') filters.status = status;
		if (type && type !== 'all') filters.type = type;
		
		// Calculate pagination
		const offset = (parseInt(page) - 1) * parseInt(limit);
		
		const incidents = await svc.list({ 
			limit: parseInt(limit),
			filters,
			orderBy: 'createdAt',
			orderDirection: 'desc'
		});
		
		// Get total count for pagination
		const totalStats = await svc.getAggregatedStats();
		
		res.json({ 
			incidents, 
			total: totalStats.total,
			page: parseInt(page),
			totalPages: Math.ceil(totalStats.total / parseInt(limit)),
			filters: { status, type }
		});
	} catch (e) { next(e); }
});

// Update incident status
router.put('/incidents/:id/status', verifyFirebaseIdToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		const { status } = req.body || {};
		const svc = new FirestoreService('incidents');
		const updated = await svc.update(id, { status });
		res.json({ success: true, data: updated });
	} catch (e) { next(e); }
});

// Users list
router.get('/users', async (req, res, next) => {
	try {
		const svc = new FirestoreService('users');
		const users = await svc.list({ limit: 100 });
		res.json({ users });
	} catch (e) { next(e); }
});

// Gamification data - optimized with caching
router.get('/gamification', async (req, res, next) => {
	try {
		const leaderboardSvc = new FirestoreService('leaderboard');
		const usersSvc = new FirestoreService('users');
		
		// Get leaderboard data
		const leaderboard = await leaderboardSvc.list({ 
			limit: 100,
			orderBy: 'points',
			orderDirection: 'desc'
		});
		
		// Get user stats
		const userStats = await usersSvc.getAggregatedStats();
		
		const totalPointsAwarded = leaderboard.reduce((sum, u) => sum + (u.points || 0), 0);
		
		res.json({ 
			totalPointsAwarded, 
			totalUsers: userStats.total,
			leaderboard, 
			averagePointsPerUser: leaderboard.length ? totalPointsAwarded / leaderboard.length : 0,
			lastUpdated: new Date().toISOString()
		});
	} catch (e) { next(e); }
});

// Manual point award endpoint
router.post('/gamification/award-points', verifyFirebaseIdToken, async (req, res, next) => {
	try {
		const { userId, points, reason } = req.body;
		
		if (!userId || !points || !reason) {
			return res.status(400).json({
				success: false,
				message: 'userId, points, and reason are required'
			});
		}
		
		if (points <= 0 || points > 1000) {
			return res.status(400).json({
				success: false,
				message: 'Points must be between 1 and 1000'
			});
		}
		
		const leaderboardSvc = new FirestoreService('leaderboard');
		const usersSvc = new FirestoreService('users');
		
		// Get current user data
		const user = await usersSvc.getById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found'
			});
		}
		
		// Update user points
		const currentPoints = user.points || 0;
		const newPoints = currentPoints + points;
		
		await usersSvc.update(userId, { points: newPoints });
		
		// Create or update leaderboard entry
		const leaderboardEntry = {
			userId,
			name: user.name || user.displayName || user.email?.split('@')[0],
			points: newPoints,
			type: user.type || 'Individual',
			lastAwarded: new Date().toISOString(),
			awardReason: reason,
			awardedBy: req.user.uid
		};
		
		await leaderboardSvc.update(userId, leaderboardEntry);
		
		// Log the award
		const awardsSvc = new FirestoreService('point_awards');
		await awardsSvc.create({
			userId,
			points,
			reason,
			awardedBy: req.user.uid,
			awardedAt: new Date().toISOString(),
			previousPoints: currentPoints,
			newPoints: newPoints
		});
		
		res.json({
			success: true,
			message: `Successfully awarded ${points} points to ${leaderboardEntry.name}`,
			data: {
				userId,
				pointsAwarded: points,
				newTotalPoints: newPoints,
				reason
			}
		});
	} catch (e) { next(e); }
});

// Settings get/update
router.get('/settings', async (req, res, next) => {
	try {
		const svc = new FirestoreService('settings');
		const items = await svc.list({ limit: 1 });
		res.json(items[0] || {});
	} catch (e) { next(e); }
});

router.put('/settings', verifyFirebaseIdToken, async (req, res, next) => {
	try {
		const svc = new FirestoreService('settings');
		// store single settings doc with fixed id 'default'
		const updated = await svc.update('default', req.body || {});
		res.json(updated);
	} catch (e) { next(e); }
});

// Auth verify endpoint
router.post('/auth/verify', async (req, res, next) => {
	try {
		const { idToken } = req.body || {};
		if (!idToken) return res.status(400).json({ message: 'idToken required' });
		const { getAuth } = require('../config/firebase');
		const decoded = await getAuth().verifyIdToken(idToken);
		res.json({ uid: decoded.uid, email: decoded.email, roles: decoded.roles || [] });
	} catch (e) { next(e); }
});

module.exports = router;


