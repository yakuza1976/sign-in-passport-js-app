import envSettings from '../globals/envSettings'

export default {
    baseURL: envSettings.API_BASEURL,
    timeout: 5000,
    crossdomain: true,
    withCredentials: true,
    responseType: 'json',
    responseEncoding: 'utf8'
  };