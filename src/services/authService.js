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
    const userTypes = ['','user','admin'];
    if (getToken() && userTypes.indexOf(role) == getRole()) {
        http.setToken(getToken());
        return true;
    }
    if(getToken() && !role){
        http.setToken(getToken());
        return true;
    }
    return false;
}