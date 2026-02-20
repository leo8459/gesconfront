//plugins/administrador.js

export default function ({ $axios, store, redirect }, inject) {
    const gestores = $axios.create({
      headers: {
        common: {
          Accept: 'text/plain, */*'
        }
      }
    });
          // let url ='http://172.65.10.52:8450/gestores/'
          let url ='http://172.65.10.33:8459/gestores/'

    // const url = 'http://localhost/backgescon2/public/gestores/';
        // const url = 'http://gescon.correos.gob.bo/gestores/';
        // const url = 'https://gescon.correos.gob.bo/gestores/';

    gestores.setBaseURL(url);
  
    gestores.interceptors.request.use(config => {
      if (process.client) {
        const token = store.state.auth.token;
        if (token) {
          config.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    });
  
    gestores.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          store.dispatch('auth/logout');
          redirect('/admin/auth/login');
        }
        return Promise.reject(error);
      }
    );
  
    inject('gestores', gestores);
  }
  