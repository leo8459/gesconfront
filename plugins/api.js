//plugins/api.js
export default function ({ $axios, store, redirect }, inject) {
  const api = $axios.create({
    headers: {
      common: {
        Accept: 'application/json'
      }
    }
  });
  // let url ='http://172.65.10.52:8450/carteros/'
  // let url ='http://172.65.10.33:8459/carteros/'
let url ='https://gescon.correos.gob.bo:8459/carteros/'
  // const url = 'http://localhost/backgescon2/public/carteros/';
        // const url = 'https://gescon.correos.gob.bo/carteros/';

  api.setBaseURL(url);

  api.interceptors.request.use(config => {
    config.headers.common['Accept'] = 'application/json';
    if (process.client) {
      const token = store.state.auth.token;
      if (token) {
        config.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  });

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        store.dispatch('auth/logout');
        redirect('/admin/auth/login');
      }
      return Promise.reject(error);
    }
  );

  inject('api', api);
}
