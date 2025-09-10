const asyncHandler = require('../utils/asyncHandler');
const httpStatus = require('http-status');

class CrudController {
	constructor(service) {
		this.service = service;
		this.list = asyncHandler(this.list.bind(this));
		this.get = asyncHandler(this.get.bind(this));
		this.create = asyncHandler(this.create.bind(this));
		this.update = asyncHandler(this.update.bind(this));
		this.remove = asyncHandler(this.remove.bind(this));
	}

	async list(req, res) {
		const { limit, startAfter } = req.query;
		const items = await this.service.list({ limit: Number(limit) || 50, startAfter });
		res.json({ success: true, data: items });
	}

	async get(req, res) {
		const { id } = req.params;
		const item = await this.service.getById(id);
		if (!item) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Not found' });
		res.json({ success: true, data: item });
	}

	async create(req, res) {
		const created = await this.service.create(req.body);
		res.status(httpStatus.CREATED).json({ success: true, data: created });
	}

	async update(req, res) {
		const { id } = req.params;
		const updated = await this.service.update(id, req.body);
		res.json({ success: true, data: updated });
	}

	async remove(req, res) {
		const { id } = req.params;
		await this.service.remove(id);
		res.status(httpStatus.NO_CONTENT).send();
	}
}

module.exports = CrudController;


