const express = require('express');
const CrudController = require('../controllers/crudController');
const FirestoreService = require('../services/firestoreService');
const { verifyFirebaseIdToken } = require('../middleware/auth');
const { validate, idParamSchema } = require('../middleware/validate');

function buildCrudRouter(collectionName) {
	const router = express.Router();
	const controller = new CrudController(new FirestoreService(collectionName));

	router.get('/', controller.list);
	router.get('/:id', validate(idParamSchema), controller.get);
	router.post('/', verifyFirebaseIdToken, controller.create);
	router.put('/:id', verifyFirebaseIdToken, validate(idParamSchema), controller.update);
	router.delete('/:id', verifyFirebaseIdToken, validate(idParamSchema), controller.remove);

	return router;
}

module.exports = buildCrudRouter;


