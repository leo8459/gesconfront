//plugins/administrador.js

export default function ({ $axios, store, redirect }, inject) {
    const administrador = $axios.create({
      headers: {
        common: {
          Accept: 'text/plain, */*'
        }
      }
    });
    let url ='http://172.65.10.52:8450/administrador/'
    // let url ='http://172.65.10.33:8459/administrador/'

    // const url = 'http://localhost/backgescon2/public/administrador/';
    administrador.setBaseURL(url);
  
    administrador.interceptors.request.use(config => {
      if (process.client) {
        const token = store.state.auth.token;
        if (token) {
          config.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    });
  
    administrador.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          store.dispatch('auth/logout');
          redirect('/admin/auth/login');
        }
        return Promise.reject(error);
      }
    );
  
    inject('administrador', administrador);
  }
  