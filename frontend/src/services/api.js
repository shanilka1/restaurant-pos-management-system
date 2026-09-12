import axios from 'axios';

const api = axios.create({
    baseURL: 'https://minipos-backend-123.loca.lt/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Bypass-Tunnel-Reminder': 'true',
        'ngrok-skip-browser-warning': 'true'
    },
    // Required for Sanctum CSRF protection if SPA and API are on same domain,
    // but since we're using tokens directly, withCredentials isn't strictly necessary for token-based,
    // but it's good practice for stateful Sanctum.
    // withCredentials: true 
});

// Request interceptor to attach the bearer token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle global errors like 401 Unauthorized
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            // Avoid looping if already on login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Services exports
export const authService = {
    register: (data) => api.post('/register', data),
    login: (credentials) => api.post('/login', credentials),
    logout: () => api.post('/logout'),
    getUser: () => api.get('/user'),
};

export const categoryService = {
    getAll: (params) => api.get('/categories', { params }),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

export const productService = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

export const customerService = {
    getAll: (params) => api.get('/customers', { params }),
    getById: (id) => api.get(`/customers/${id}`),
    create: (data) => api.post('/customers', data),
    update: (id, data) => api.put(`/customers/${id}`, data),
    delete: (id) => api.delete(`/customers/${id}`),
};

export const orderService = {
    getAll: (params) => api.get('/orders', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post('/orders', data),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const stockService = {
    getAll: (params) => api.get('/stock-movements', { params }),
    getById: (id) => api.get(`/stock-movements/${id}`),
    create: (data) => api.post('/stock-movements', data),
};

export const dashboardService = {
    getStats: () => api.get('/dashboard')
};

export const reportService = {
    getSales: (params) => api.get('/reports/sales', { params }),
    getProducts: (params) => api.get('/reports/products', { params })
};

export default api;
