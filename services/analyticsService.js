const ratingModel = require('../models/ratingModel');
const categoryModel = require('../models/categoryModel');

const analyticsService = {
    async getDashboardData() {
        const [overview, categoryStats, recentActivity] = await Promise.all([
            this.getOverview(),
            this.getCategoryAnalytics(),
            this.getRecentActivity(10)
        ]);

        return { overview, categoryStats, recentActivity };
    },

    async getOverview() {
        const stats = await ratingModel.getStats();
        const categories = await categoryModel.findAll();

        const topRated = await this.getCategoryAnalytics();

        return {
            totalRatings: stats.total,
            averageRating: stats.average,
            totalCategories: categories?.length || 0,
            topRatedCategory: topRated[0] || null
        };
    },

    async getCategoryAnalytics() {
        return ratingModel.getStatsByCategory();
    },

    async getRecentActivity(limit = 10) {
        return ratingModel.getRecent(limit);
    }
};

module.exports = analyticsService;