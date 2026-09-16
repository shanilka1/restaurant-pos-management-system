import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-livid-six-38.vercel.app/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            const path = window.location.pathname;
            if (path !== '/login' && path !== '/register') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

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

export const tableService = {
    getAll: (params) => api.get('/tables', { params }),
    create: (data) => api.post('/tables', data),
    update: (id, data) => api.put(`/tables/${id}`, data),
    switchTable: (data) => api.post('/tables/switch', data),
    delete: (id) => api.delete(`/tables/${id}`),
};

export const shiftService = {
    getCurrent: () => api.get('/shifts/current'),
    open: (data) => api.post('/shifts/open', data),
    close: (id, data) => api.post(`/shifts/${id}/close`, data),
    cashMovement: (data) => api.post('/shifts/cash-movement', data),
    getHistory: () => api.get('/shifts/history'),
};

export const kitchenService = {
    getQueue: () => api.get('/kitchen/queue'),
    updateOrderStatus: (id, kitchenStatus) => api.put(`/kitchen/orders/${id}/status`, { kitchen_status: kitchenStatus }),
    updateItemStatus: (itemId, itemStatus) => api.put(`/kitchen/items/${itemId}/status`, { item_status: itemStatus }),
};

export const reservationService = {
    getAll: (params) => api.get('/reservations', { params }),
    create: (data) => api.post('/reservations', data),
    updateStatus: (id, status) => api.put(`/reservations/${id}/status`, { status }),
    delete: (id) => api.delete(`/reservations/${id}`),
};

export const ingredientService = {
    getAll: () => api.get('/ingredients'),
    create: (data) => api.post('/ingredients', data),
    update: (id, data) => api.put(`/ingredients/${id}`, data),
    delete: (id) => api.delete(`/ingredients/${id}`),
    getRecipes: (productId) => api.get(`/products/${productId}/recipes`),
    saveRecipes: (productId, recipes) => api.post(`/products/${productId}/recipes`, { recipes }),
};

export const heldOrderService = {
    getAll: () => api.get('/held-orders'),
    create: (data) => api.post('/held-orders', data),
    delete: (id) => api.delete(`/held-orders/${id}`),
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
