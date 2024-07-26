//plugins/sucursale.js

export default function ({ $axios, store, redirect }, inject) {
    const sucursales = $axios.create({
      headers: {
        common: {
          Accept: 'text/plain, */*'
        }
      }
    });
  
    const url = 'http://localhost/backgescon/public/sucursales/';
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
  