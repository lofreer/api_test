const localHost = 'http://127.0.0.1:3001'
const windowHost = window.location.host
const isLocal = !!~windowHost.indexOf('localhost') || !!~windowHost.indexOf('127.0.0.1') || !!~windowHost.indexOf('192.168.')

export default {
    PREFIX: '/api/v1',
    REQUEST_DEFAULT_OPTIONS: {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    },
    SKONE_ACCESS_TOKEN: 'SKONE_ACCESS_TOKEN',
    SKONE_USER_INFO: 'SKONE_USER_INFO',
    
    NETWORK_ERROR: '', 
    URL_ERROR: '',
    HOST: isLocal ? localHost : JSON.parse(__ORIGIN__ || '')
}
