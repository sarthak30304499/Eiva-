// services/supabaseService.js
// Supabase admin client + auth helpers — lazy initialization

const { createClient } = require('@supabase/supabase-js');

let _client = null;

function getClient() {
    if (_client) return _client;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || url.startsWith('YOUR_') || !key || key.startsWith('YOUR_')) return null;
    _client = createClient(url, key);
    return _client;
}

async function verifyToken(authHeader) {
    const client = getClient();
    if (!client || !authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.replace('Bearer ', '');
    const { data, error } = await client.auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user;
}

async function getUserPlan(userId) {
    const client = getClient();
    if (!client) return 'free';
    const { data } = await client.from('profiles').select('plan').eq('id', userId).single();
    return data?.plan || 'free';
}

async function logUsage(userId, tool) {
    const client = getClient();
    if (!client) return;
    await client.from('usage_logs').insert({ user_id: userId, tool });
}

async function getMonthlyUsage(userId, tool) {
    const client = getClient();
    if (!client) return 0;
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const { count } = await client
        .from('usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('tool', tool)
        .gte('created_at', startOfMonth.toISOString());
    return count || 0;
}

module.exports = { getClient, verifyToken, getUserPlan, logUsage, getMonthlyUsage };
