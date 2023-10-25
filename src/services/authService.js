import http from './httpService';

export const  login = async ({ email, password }) => {
    return http.post('/api/auth/login', { email, password });
}

export const register = async (data) => {
    return http.post('/api/auth/register', data);
}

export const setToken = (token) => {
    localStorage.setItem('token', token);
    http.setToken(token);
}

export const getToken = () => {
    return localStorage.getItem('token');
}

export const logout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
}

export const setRole = (role) => {
    localStorage.setItem('role', role);
}

export const getRole = () => {
    return localStorage.getItem('role');
}

export const isLoggedIn = (role) => {
    if (getToken() && getRole() === role) {
        return true;
    }
    if(getToken() && !role){
        return true;
    }
    return false;
}