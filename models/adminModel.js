const { supabase, supabaseAdmin } = require('../config/db');
const bcrypt = require('bcryptjs');

const TABLE = 'admins';

const adminModel = {
    async findByUsername(username) {
        const { data, error } = await supabaseAdmin
            .from(TABLE)
            .select('*')
            .eq('username', username)
            .single();
        if (error) throw error;
        return data;
    },

    async findById(id) {
        const { data, error } = await supabaseAdmin
            .from(TABLE)
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async create(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const { data, error } = await supabaseAdmin
            .from(TABLE)
            .insert([{ username, password: hashedPassword }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async verifyPassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
};

module.exports = adminModel;