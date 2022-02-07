import axios from 'axios'

const http = axios.create({
  baseURL: 'http://127.0.0.1:5500/vue3/data/testData/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});

http.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  console.log(response,'response')
  return response.data;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});



export default http