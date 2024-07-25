export default function ({ $axios, store, redirect }, inject) {
  const api = $axios.create({
    headers: {
      common: {
        Accept: 'text/plain, */*'
      }
    }
  });

  const url = 'http://localhost/backgescon/public/carteros/';
  api.setBaseURL(url);

  api.interceptors.request.use(config => {
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
