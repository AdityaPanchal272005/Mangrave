async function verifyFirebaseIdToken(req, res, next) {
	try {
		const authHeader = req.headers.authorization || '';
		const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
		if (!token) {
			return res.status(401).json({ success: false, message: 'Missing Authorization header' });
		}
		const { getAuth } = require('../config/firebase');
		const decoded = await getAuth().verifyIdToken(token);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ success: false, message: 'Invalid or expired token' });
	}
}

function requireRole(roles = []) {
	return (req, res, next) => {
		if (!roles.length) return next();
		const userRoles = req.user?.roles || [];
		const hasRole = roles.some((r) => userRoles.includes(r));
		if (!hasRole) return res.status(403).json({ success: false, message: 'Forbidden' });
		next();
	};
}

module.exports = { verifyFirebaseIdToken, requireRole };


