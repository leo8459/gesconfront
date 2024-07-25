export const state = () => ({
    token: null,
    user: null,
  });
  
  export const mutations = {
    setToken(state, token) {
      state.token = token;
    },
    clearToken(state) {
      state.token = null;
    },
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = null;
    },
  };
  
 export const actions = {
    loadAuthFromStorage({ commit }) {
        if (process.client) {
            const userAuth = localStorage.getItem('userAuth');
            if (userAuth) {
                const authData = JSON.parse(userAuth);
                commit('setToken', authData.token);
                commit('setUser', authData.cartero || authData.sucursale);
            }
        }
    },
    login({ commit }, { token, user }) {
        if (process.client) {
            localStorage.setItem('userAuth', JSON.stringify({ token, user }));
            commit('setToken', token);
            commit('setUser', user);
        }
    },
    logout({ commit }) {
        if (process.client) {
            localStorage.removeItem('userAuth');
            commit('clearToken');
            commit('clearUser');
        }
    }
};
