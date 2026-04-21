const { supabase, supabaseAdmin } = require('../config/db');

const TABLE = 'public_ratings';

const publicRatingModel = {
    async create(data) {
        const { share_link_id, category_id, client_name, rating, comment } = data;
        const { data: result, error } = await supabase
            .from(TABLE)
            .insert([{
                share_link_id,
                category_id,
                client_name,
                rating,
                comment,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();
        if (error) throw error;
        return result;
    },

    async findByLink(shareLinkId) {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .eq('share_link_id', shareLinkId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async getStatsByLink(shareLinkId) {
        const { data, error } = await supabase
            .from(TABLE)
            .select('rating')
            .eq('share_link_id', shareLinkId);
        if (error) throw error;

        const total = data?.length || 0;
        const avg = total > 0
            ? data.reduce((sum, r) => sum + r.rating, 0) / total
            : 0;
        return { total, average: avg };
    },

    async getAll() {
        const { data, error } = await supabaseAdmin
            .from(TABLE)
            .select(`
                *,
                category:categories(name)
            `)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getStats() {
        const { data, error } = await supabaseAdmin
            .from(TABLE)
            .select('rating');
        if (error) throw error;

        const total = data?.length || 0;
        const avg = total > 0
            ? data.reduce((sum, r) => sum + r.rating, 0) / total
            : 0;
        return { total, average: avg };
    },

    async getStatsByCategory() {
        const { data, error } = await supabaseAdmin
            .from(TABLE)
            .select(`
                category_id,
                rating,
                category:categories(name)
            `);
        if (error) throw error;

        const grouped = {};
        data?.forEach(r => {
            const catId = r.category_id;
            if (!grouped[catId]) {
                grouped[catId] = { category_id: catId, name: r.category?.name, total: 0, sum: 0 };
            }
            grouped[catId].total++;
            grouped[catId].sum += r.rating;
        });

        return Object.values(grouped).map(g => ({
            category_id: g.category_id,
            name: g.name,
            total: g.total,
            average: g.total > 0 ? g.sum / g.total : 0
        }));
    },

    async getRecent(limit = 10) {
        const { data, error } = await supabaseAdmin
            .from(TABLE)
            .select(`
                *,
                category:categories(name)
            `)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data || [];
    }
};

module.exports = publicRatingModel;
