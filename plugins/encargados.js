//plugins/encargados.js

export default function ({ $axios, store, redirect }, inject) {
    const encargados = $axios.create({
      headers: {
        common: {
          Accept: 'text/plain, */*'
        }
      }
    });
        // let url ='http://172.65.10.52:8450/encargados/'
        let url ='http://172.65.10.33:8459/encargados/'


    // const url = 'http://localhost/backgescon2/public/encargados/';
    encargados.setBaseURL(url);
  
    encargados.interceptors.request.use(config => {
      if (process.client) {
        const token = store.state.auth.token;
        if (token) {
          config.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    });
  
    encargados.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          store.dispatch('auth/logout');
          redirect('/admin/auth/login');
        }
        return Promise.reject(error);
      }
    );
  
    inject('encargados', encargados);
  }
  