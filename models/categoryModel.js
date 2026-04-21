const { supabase, supabaseAdmin } = require('../config/db');

const TABLE = 'categories';

const categoryModel = {
    async findAll() {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .order('name');
        if (error) throw error;
        return data;
    },

    async findById(id) {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async create(name) {
        const { data, error } = await supabaseAdmin
            .from(TABLE)
            .insert([{ name }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async update(id, name) {
        const { data, error } = await supabaseAdmin
            .from(TABLE)
            .update({ name })
            .eq('id', id)
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
    }
};

module.exports = categoryModel;