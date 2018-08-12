import axios from 'axios'

const service = axios.create({
  baseURL: process.env.API_SERVER,
  timeout: 5000
})

// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  response => response,
  error => {
    console.log('err' + error)
    return Promise.reject(error)
  }
)

export default service
