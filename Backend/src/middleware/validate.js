const { z } = require('zod');

function validate(schema) {
	return (req, res, next) => {
		try {
			const result = schema.parse({
				params: req.params,
				query: req.query,
				body: req.body
			});
			req.validated = result;
			return next();
		} catch (err) {
			return res.status(400).json({ success: false, message: 'Validation failed', errors: err.errors });
		}
	};
}

const idParamSchema = z.object({
	params: z.object({ id: z.string().min(1) }),
});

module.exports = { validate, idParamSchema };


