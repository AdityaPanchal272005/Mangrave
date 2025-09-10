const NodeCache = require('node-cache');

class FirestoreService {
	constructor(collectionName) {
		this.collectionName = collectionName;
		this.collection = null;
		// Cache with 5 minute TTL for read operations
		this.cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
	}

	getCollection() {
		if (!this.collection) {
			const { getFirestore } = require('../config/firebase');
			this.collection = getFirestore().collection(this.collectionName);
		}
		return this.collection;
	}

	// Optimized list with caching and better query handling
	async list({ limit = 50, startAfter, orderBy = 'createdAt', orderDirection = 'desc', filters = {} } = {}) {
		const cacheKey = `list_${this.collectionName}_${limit}_${startAfter || 'start'}_${orderBy}_${orderDirection}_${JSON.stringify(filters)}`;
		
		// Check cache first
		const cached = this.cache.get(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			let query = this.getCollection().orderBy(orderBy, orderDirection).limit(limit);
			
			// Apply filters
			Object.entries(filters).forEach(([field, value]) => {
				if (value !== undefined && value !== null) {
					query = query.where(field, '==', value);
				}
			});
			
			if (startAfter) {
				query = query.startAfter(startAfter);
			}
			
			const snapshot = await query.get();
			const results = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
			
			// Cache the results
			this.cache.set(cacheKey, results);
			
			return results;
		} catch (error) {
			console.error(`Error in FirestoreService.list for ${this.collectionName}:`, error);
			throw error;
		}
	}

	// Optimized getById with caching
	async getById(id) {
		const cacheKey = `get_${this.collectionName}_${id}`;
		
		// Check cache first
		const cached = this.cache.get(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			const doc = await this.getCollection().doc(id).get();
			if (!doc.exists) return null;
			
			const result = { id: doc.id, ...doc.data() };
			
			// Cache the result
			this.cache.set(cacheKey, result);
			
			return result;
		} catch (error) {
			console.error(`Error in FirestoreService.getById for ${this.collectionName}:`, error);
			throw error;
		}
	}

	// Optimized create with transaction support
	async create(data) {
		try {
			const now = new Date().toISOString();
			const payload = { 
				...data, 
				createdAt: now, 
				updatedAt: now,
				// Add indexing fields for better query performance
				_indexedAt: Date.now()
			};
			
			const ref = await this.getCollection().add(payload);
			const created = await ref.get();
			const result = { id: created.id, ...created.data() };
			
			// Invalidate related caches
			this.invalidateCache();
			
			return result;
		} catch (error) {
			console.error(`Error in FirestoreService.create for ${this.collectionName}:`, error);
			throw error;
		}
	}

	// Optimized update with better error handling
	async update(id, data) {
		try {
			const now = new Date().toISOString();
			const updateData = { 
				...data, 
				updatedAt: now,
				_indexedAt: Date.now()
			};
			
			await this.getCollection().doc(id).set(updateData, { merge: true });
			const updated = await this.getCollection().doc(id).get();
			const result = { id: updated.id, ...updated.data() };
			
			// Invalidate related caches
			this.invalidateCache();
			this.cache.del(`get_${this.collectionName}_${id}`);
			
			return result;
		} catch (error) {
			console.error(`Error in FirestoreService.update for ${this.collectionName}:`, error);
			throw error;
		}
	}

	// Optimized remove with cache invalidation
	async remove(id) {
		try {
			await this.getCollection().doc(id).delete();
			
			// Invalidate related caches
			this.invalidateCache();
			this.cache.del(`get_${this.collectionName}_${id}`);
			
			return { id };
		} catch (error) {
			console.error(`Error in FirestoreService.remove for ${this.collectionName}:`, error);
			throw error;
		}
	}

	// Batch operations for better performance
	async batchCreate(items) {
		try {
			const batch = this.getCollection().firestore.batch();
			const now = new Date().toISOString();
			const results = [];

			items.forEach((item, index) => {
				const ref = this.getCollection().doc();
				const payload = {
					...item,
					createdAt: now,
					updatedAt: now,
					_indexedAt: Date.now()
				};
				batch.set(ref, payload);
				results.push({ id: ref.id, ...payload });
			});

			await batch.commit();
			
			// Invalidate cache
			this.invalidateCache();
			
			return results;
		} catch (error) {
			console.error(`Error in FirestoreService.batchCreate for ${this.collectionName}:`, error);
			throw error;
		}
	}

	// Aggregation queries for dashboard stats
	async getAggregatedStats() {
		const cacheKey = `stats_${this.collectionName}`;
		
		// Check cache first
		const cached = this.cache.get(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			const snapshot = await this.getCollection().get();
			const docs = snapshot.docs.map(d => d.data());
			
			const stats = {
				total: docs.length,
				byStatus: {},
				byType: {},
				recentCount: 0
			};

			const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

			docs.forEach(doc => {
				// Count by status
				if (doc.status) {
					stats.byStatus[doc.status] = (stats.byStatus[doc.status] || 0) + 1;
				}
				
				// Count by type
				if (doc.type) {
					stats.byType[doc.type] = (stats.byType[doc.type] || 0) + 1;
				}
				
				// Count recent items
				if (doc.createdAt && new Date(doc.createdAt) > oneWeekAgo) {
					stats.recentCount++;
				}
			});

			// Cache the results
			this.cache.set(cacheKey, stats);
			
			return stats;
		} catch (error) {
			console.error(`Error in FirestoreService.getAggregatedStats for ${this.collectionName}:`, error);
			throw error;
		}
	}

	// Invalidate all caches for this collection
	invalidateCache() {
		const keys = this.cache.keys();
		keys.forEach(key => {
			if (key.startsWith(`list_${this.collectionName}_`) || 
				key.startsWith(`stats_${this.collectionName}`)) {
				this.cache.del(key);
			}
		});
	}

	// Health check method
	async healthCheck() {
		try {
			await this.getCollection().limit(1).get();
			return { status: 'healthy', collection: this.collectionName };
		} catch (error) {
			return { status: 'unhealthy', collection: this.collectionName, error: error.message };
		}
	}
}

module.exports = FirestoreService;


