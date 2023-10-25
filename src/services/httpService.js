import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

function setToken(token){
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const http = {
    get: axios.get,
    post: axios.post,
    patch: axios.patch,
    put: axios.put,
    delete: axios.delete,
    option: axios,
    setToken,
};

export default http;