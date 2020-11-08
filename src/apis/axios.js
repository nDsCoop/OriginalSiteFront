import axios from 'axios';

const instance = axios.create({
    baseURL: "http://localhost:9150",
});
export default instance