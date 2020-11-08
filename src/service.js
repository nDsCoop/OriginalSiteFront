import axios from 'axios';
const apiURL = "http://localhost:8080";
export default class Service{
    get(endpoint, options = null){
        const url = `${apiURL}/${endpoint}`;
        return axios.get(url, options);

    }
    post(endpoint = "", data = {}, options = {headers: {
        'Content-Type': 'application/json',
        'enctype': "multipart/form-data",
}}){
        const url = `${apiURL}/${endpoint}`;
        return axios.post(url, data, options);
    }
}