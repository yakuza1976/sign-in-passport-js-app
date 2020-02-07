import axios from 'axios'
import axiosConfig from '../config/axios'
import envSettings from '../globals/envSettings'

const axiosInstance = axios.create(axiosConfig)
const REACT_APP_API = envSettings.API_BASEURL

function getApiCall(url) {
    console.log('getApiCall', url)
    return axiosInstance.get(url).then((response) => {
        return response;
    }).catch((err) => {
        console.log('error: ', err);
        throw err
    })
}

const connectWithAccount = (accountName) =>  { console.log('connectWithAccount: ', accountName, ' ', `${REACT_APP_API}`)
    return getApiCall(`${REACT_APP_API}/auth/${accountName}`)
    //return getApiCall(`${REACT_APP_API}/prueba`)
}

export { connectWithAccount } 