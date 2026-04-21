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
    }
};

module.exports = publicRatingModel;
