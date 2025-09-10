const admin = require('firebase-admin');
const { firebase } = require('./env');

let app;

function initializeFirebaseAdmin() {
	if (admin.apps.length) {
		app = admin.app();
		return app;
	}

	if (!firebase.projectId || !firebase.clientEmail || !firebase.privateKey) {
		throw new Error('Firebase Admin credentials are not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.');
	}

	app = admin.initializeApp({
		credential: admin.credential.cert({
			projectId: firebase.projectId,
			clientEmail: firebase.clientEmail,
			privateKey: firebase.privateKey
		}),
		databaseURL: firebase.databaseURL
	});

	return app;
}

function getFirestore() {
	if (!app) initializeFirebaseAdmin();
	return admin.firestore();
}

function getAuth() {
	if (!app) initializeFirebaseAdmin();
	return admin.auth();
}

module.exports = { initializeFirebaseAdmin, getFirestore, getAuth };


