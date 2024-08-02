import { App, inject } from "vue"
import axios from "axios"

let http;

interface AxiosOptions {
    headers?: Record<string, string>
}

const injectionKey = Symbol('axios')

export const useAxios = () => {
    const axios = inject(injectionKey)
    
    if (!axios) {
        throw new Error('useAxios() is called without provider.')
    }
    
    return axios
    }

export const setDefaultHeaders = (headers: Record<string, string>) => {
    http.defaults.headers = {
        ...http.defaults.headers,
        ...headers,
    }
    console.log('http.defaults.headers: ', http.defaults.headers)
}

export default {
    install: (app: App, options: AxiosOptions = {}) => {
        http = axios.create({
            baseURL: '/api',
            headers: options.headers,
        })
        app.provide(injectionKey, http)

        app.config.globalProperties.$axios = http
    }
}