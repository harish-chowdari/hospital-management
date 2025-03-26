import axios from "axios";


const BASE_URL = "http://localhost:5000/api" 

const axiosInstance=axios.create({
    baseURL:BASE_URL,
});

export default axiosInstance;   