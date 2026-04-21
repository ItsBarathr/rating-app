const { supabase, supabaseAdmin } = require('../config/db');

const TABLE = 'share_links';

function generateSlug() {
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

const shareLinkModel = {
    async findAll() {
        const { data, error } = await supabaseAdmin
            .from(TABLE)
            .select(`
                *,
                category:categories(name)
            `)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async findBySlug(slug) {
        const { data, error } = await supabase
            .from(TABLE)
            .select(`
                *,
                category:categories(name)
            `)
            .eq('slug', slug)
            .eq('is_active', true)
            .single();
        if (error) throw error;
        return data;
    },

    async create(categoryId, title, description, expiresAt) {
        const slug = generateSlug();
        const { data, error } = await supabaseAdmin
            .from(TABLE)
            .insert([{
                category_id: categoryId,
                slug,
                title,
                description,
                expires_at: expiresAt,
                is_active: true
            }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabaseAdmin
            .from(TABLE)
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    async toggleActive(id, isActive) {
        const { data, error } = await supabaseAdmin
            .from(TABLE)
            .update({ is_active: isActive })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};

module.exports = shareLinkModel;
