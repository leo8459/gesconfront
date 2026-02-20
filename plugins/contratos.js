//plugins/contratos.js

export default function ({ $axios, store, redirect }, inject) {
    const contratos = $axios.create({
      headers: {
        common: {
          Accept: 'text/plain, */*'
        }
      }
    });
    // let url ='http://172.65.10.52:8450/contratos/'
    let url ='http://172.65.10.33:8459/contratos/'

    // const url = 'http://localhost/backgescon2/public/contratos/';
        // const url = 'http://gescon.correos.gob.bo/contratos/';
        // const url = 'https://gescon.correos.gob.bo/contratos/';

    contratos.setBaseURL(url);
  
    contratos.interceptors.request.use(config => {
      if (process.client) {
        const token = store.state.auth.token;
        if (token) {
          config.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    });
  
    contratos.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          store.dispatch('auth/logout');
          redirect('/admin/auth/login');
        }
        return Promise.reject(error);
      }
    );
  
    inject('contratos', contratos);
  }
  