const path = require('path');
const fs = require('fs');

// Load .env from Backend first, then project root as fallback
const backendEnvPath = path.resolve(__dirname, '../../.env');
const rootEnvPath = path.resolve(__dirname, '../../../.env');
if (fs.existsSync(backendEnvPath)) {
	require('dotenv').config({ path: backendEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
	require('dotenv').config({ path: rootEnvPath });
} else {
	require('dotenv').config();
}

function getEnv(name, options = {}) {
	const { required = true, transform } = options;
	let value = process.env[name];
	if (value && transform) {
		value = transform(value);
	}
	if (required && (value === undefined || value === '')) {
		throw new Error(`Missing required env var: ${name}`);
	}
	return value;
}

module.exports = {
	port: Number(getEnv('PORT', { required: false })) || 8080,
	firebase: {
		projectId: getEnv('FIREBASE_PROJECT_ID', { required: false }),
		clientEmail: getEnv('FIREBASE_CLIENT_EMAIL', { required: false }),
		privateKey: getEnv('FIREBASE_PRIVATE_KEY', {
			required: false,
			transform: (v) => v.replace(/\\n/g, '\n')
		}),
		databaseURL: getEnv('FIREBASE_DATABASE_URL', { required: false })
	}
};


