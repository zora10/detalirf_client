import axios from 'axios'

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

const $bx = axios.create({
    baseURL: process.env.REACT_APP_BX_URL
})

export {$host, $bx}