const analyticsService = require('../services/analyticsService');

exports.getDashboard = async (req, res) => {
    try {
        const dashboard = await analyticsService.getDashboardData();
        res.json(dashboard);
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};

exports.getOverview = async (req, res) => {
    try {
        const overview = await analyticsService.getOverview();
        res.json(overview);
    } catch (error) {
        console.error('Overview error:', error);
        res.status(500).json({ error: 'Failed to fetch overview' });
    }
};

exports.getCategoryAnalytics = async (req, res) => {
    try {
        const analytics = await analyticsService.getCategoryAnalytics();
        res.json(analytics);
    } catch (error) {
        console.error('Category analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch category analytics' });
    }
};

exports.getRecentActivity = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const activity = await analyticsService.getRecentActivity(parseInt(limit));
        res.json(activity);
    } catch (error) {
        console.error('Recent activity error:', error);
        res.status(500).json({ error: 'Failed to fetch recent activity' });
    }
};