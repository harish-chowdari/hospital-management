import axios from "axios";


const BASE_URL_PROD = "https://hospital-management-xv96.onrender.com/api" 
const BASE_URL_DEV = "http://localhost:5000/api"

const timeOutMessage = "Request took too long to complete. Please try again later.";

const axiosInstance=axios.create({
    baseURL:BASE_URL_DEV,
    timeout: 100000,
    timeoutErrorMessage: timeOutMessage,
});

export default axiosInstance;   