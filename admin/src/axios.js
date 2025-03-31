import axios from "axios";


// const BASE_URL_PROD = "https://hospital-management-xv96.onrender.com/api" 
const BASE_URL_DEV = "http://localhost:5000/api" // For local development

const axiosInstance=axios.create({
    baseURL: BASE_URL_DEV,
});

export default axiosInstance;   