const API_BASE = '/api/v1'

const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`
        const config = {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        }

        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body)
        }

        const res = await fetch(url, config)
        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error || 'Request failed')
        }

        return data
    },

    login: (credentials) => api.request('/admin/login', { method: 'POST', body: credentials }),
    logout: () => api.request('/admin/logout', { method: 'POST' }),
    verify: () => api.request('/admin/verify'),

    getCategories: () => api.request('/categories'),
    createCategory: (name) => api.request('/categories', { method: 'POST', body: { name } }),
    updateCategory: (id, name) => api.request(`/categories/${id}`, { method: 'PUT', body: { name } }),
    deleteCategory: (id) => api.request(`/categories/${id}`, { method: 'DELETE' }),

    submitRating: (data) => api.request('/rating', { method: 'POST', body: data }),
    getRatings: (params) => api.request(`/rating?${new URLSearchParams(params)}`),
    getCategoryStats: () => api.request('/rating/category-stats'),
    getRecentRatings: (limit) => api.request(`/rating/recent?limit=${limit}`),

    getDashboard: () => api.request('/dashboard'),
    getOverview: () => api.request('/overview'),
    getActivity: (limit) => api.request(`/activity?limit=${limit}`),

    getShareLinks: () => api.request('/share-links'),
    createShareLink: (data) => api.request('/share-links', { method: 'POST', body: data }),
    deleteShareLink: (id) => api.request(`/share-links/${id}`, { method: 'DELETE' }),
    getPublicLink: (slug) => api.request(`/rate/${slug}`),
    submitPublicRating: (slug, data) => api.request(`/rate/${slug}`, { method: 'POST', body: data })
}

export default api