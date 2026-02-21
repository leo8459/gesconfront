//plugins/sucursale.js

export default function ({ $axios, store, redirect }, inject) {
    const sucursales = $axios.create({
      headers: {
        common: {
          Accept: 'text/plain, */*'
        }
      }
    });
            // let url ='http://172.65.10.52:8450/sucursales/'
            // let url ='http://172.65.10.33:8459/sucursales/'
let url ='https://gescon.correos.gob.bo:8459/sucursales/'

    // const url = 'http://localhost/backgescon2/public/sucursales/';
        // const url = 'http://gescon.correos.gob.bo/sucursales/';
        // const url = 'https://gescon.correos.gob.bo/sucursales/';

    sucursales.setBaseURL(url);
  
    sucursales.interceptors.request.use(config => {
      if (process.client) {
        const token = store.state.auth.token;
        if (token) {
          config.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    });
  
    sucursales.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          store.dispatch('auth/logout');
          redirect('/admin/auth/login');
        }
        return Promise.reject(error);
      }
    );
  
    inject('sucursales', sucursales);
  }
  