const appProtocol = window.location.protocol
const appHost = window.location.host
const domain = window.location.hostname
const PRODUCTION_DOMAIN = 'oxfordpremium.oupe.es'
const PRODUCTION_DOMAIN_PLUS = 'oxfordplus.oupe.es'
const PREMIUM = 'oxfordpremium'
const PLUS = 'oxfordplus'

const app_baseUrl = `${appProtocol}//${appHost}`

console.log(process.env)
//const api_baseUrl = process.env.REACT_APP_API || `${appProtocol}//api.${appHost}`.replace(PLUS, PREMIUM)
const api_baseUrl = 'http://localhost:8080'
const app_basepath = '/app'

export const isProductionEnv = () => domain === PRODUCTION_DOMAIN || domain === PRODUCTION_DOMAIN_PLUS

export const isPreProEnv = () => /\.prepro2\./.test(domain)

export const isDevelopmentEnv = () => /\.dev\./.test(domain)

export const isLocalEnv = () => /\.local\./.test(domain)

export const isPlusPortal = () => new RegExp(PLUS).test(domain)

const currentUrl = window.location.href;

const logoutUrl = () => {

  /*localStorage.removeItem('customerData');
  localStorage.removeItem('internalData');
  localStorage.removeItem('latestActions');*/

  const returnDomain = `${appProtocol}//${domain}`

  if (isLocalEnv(domain)) {
    return `${api_baseUrl}/logout`
  }

  return `${appProtocol}//login.${isDevelopmentEnv() ? 'dev.' : ''}${isPreProEnv() ? 'prepro2.' : ''}oupe.es/cas/logout?service=${encodeURIComponent(returnDomain)}&returnTo=${encodeURIComponent(returnDomain)}`

}

const staticUrl = () => {

  if (isLocalEnv()) {
    return ''
  }

  return `${appProtocol}//static.${isDevelopmentEnv() ? 'dev.' : ''}${isPreProEnv() ? 'prepro2.' : ''}oupe.es`

}

const recaptchaKey = () => {
  if(isProductionEnv()) return "6LdDhLoUAAAAANPZ5KtQeEZ1Ypnqt_SxLdAi_U1M"
  if(isPreProEnv()) return "6Lft1bIUAAAAAPWi_-DBJbV1bm35QQJWaX3MxBLv"
  if(isDevelopmentEnv()) return "6Lft1bIUAAAAAPWi_-DBJbV1bm35QQJWaX3MxBLv"
  if(isLocalEnv()) return "6Le4xbAUAAAAAKEwYYUdBDIKPhdT95fjEb04kKm4"
  return "6LdDhLoUAAAAANPZ5KtQeEZ1Ypnqt_SxLdAi_U1M"
}

export default Object.assign(process.env, {
  DOMAIN: domain,
  APP_BASEURL: app_baseUrl + app_basepath,
  APP_BASEPATH: app_basepath,
  API_BASEURL: api_baseUrl,
  AUTH_URL: `${api_baseUrl}/user?returnTo=${encodeURIComponent(currentUrl)}`,
  LOGIN_URL: `${api_baseUrl}/login?returnTo=${encodeURIComponent(currentUrl)}`,
  LOGOUT_URL: logoutUrl(),
  STATIC_URL:  staticUrl(),
  CONTENT_URL: `${api_baseUrl}/content`,
  CONTACT_URL: `${app_basepath}/contact`,
  COUNTRY_ESP_ID: 1131,
  RECAPTCHA_CLIENT_ID: recaptchaKey()
})