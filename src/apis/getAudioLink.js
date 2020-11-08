import axios from 'axios';

export default axios.create({
   baseURL: 'http://localhost:9150/',
  // baseURL: 'https://server.ylight.xyz',
});
