import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

API.interceptors.request.use((config) => {
    const auth = localStorage.getItem("auth");
    if (auth) {
        const { accessToken } = JSON.parse(auth);
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }
    return config;
});

export default API;