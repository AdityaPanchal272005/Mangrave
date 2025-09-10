const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../docs/swagger');
const buildCrudRouter = require('./crud');
const adminRouter = require('./admin');

const router = express.Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Frontend compatibility routes expected by the app
router.use('/admin', adminRouter);

// Example collections: users, incidents, gamification, settings
router.use('/users', buildCrudRouter('users'));
router.use('/incidents', buildCrudRouter('incidents'));
router.use('/gamification', buildCrudRouter('gamification'));
router.use('/settings', buildCrudRouter('settings'));

module.exports = router;


