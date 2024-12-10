//plugins/empresas.js

export default function ({ $axios, store, redirect }, inject) {
    const empresas = $axios.create({
      headers: {
        common: {
          Accept: 'text/plain, */*'
        }
      }
    });
      // let url ='http://172.65.10.52:8450/empresas/'
      let url ='http://172.65.10.33:8459/empresas/'

    // const url = 'http://localhost/backgescon2/public/empresas/';
    empresas.setBaseURL(url);
  
    empresas.interceptors.request.use(config => {
      if (process.client) {
        const token = store.state.auth.token;
        if (token) {
          config.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    });
  
    empresas.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          store.dispatch('auth/logout');
          redirect('/admin/auth/login');
        }
        return Promise.reject(error);
      }
    );
  
    inject('empresas', empresas);
  }
  