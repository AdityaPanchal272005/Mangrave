const swaggerJsdoc = require('swagger-jsdoc');

const options = {
	definition: {
		openapi: '3.0.3',
		info: {
			title: 'Mangrave Watch Community API',
			version: '1.0.0',
			description: 'REST API for Firestore collections with Firebase Auth',
		},
		servers: [
			{ url: 'http://localhost:8080/api' }
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT'
				}
			}
		},
		security: [{ bearerAuth: [] }]
	},
	apis: []
};

const spec = swaggerJsdoc(options);

module.exports = spec;


