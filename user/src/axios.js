import axios from "axios";


const BASE_URL = "https://hospital-management-xv96.onrender.com/api" 

const axiosInstance=axios.create({
    baseURL:BASE_URL,
});

export default axiosInstance;   