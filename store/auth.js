export const state = () => ({
    token: null,
    user: null,
    userType: null, // Agregado para diferenciar entre cartero y sucursal
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
    setUserType(state, userType) {
      state.userType = userType;
    },
    clearUserType(state) {
      state.userType = null;
    },
  };
  
  export const actions = {
    loadAuthFromStorage({ commit }) {
      if (process.client) {
        const userAuth = localStorage.getItem('userAuth');
        if (userAuth) {
          const authData = JSON.parse(userAuth);
          commit('setToken', authData.token);
          commit('setUser', authData.user);
          commit('setUserType', authData.userType);
        }
      }
    },
    login({ commit }, { token, user, userType }) {
      if (process.client) {
        localStorage.setItem('userAuth', JSON.stringify({ token, user, userType }));
        commit('setToken', token);
        commit('setUser', user);
        commit('setUserType', userType);
      }
    },
    logout({ commit }) {
      if (process.client) {
        localStorage.removeItem('userAuth');
        commit('clearToken');
        commit('clearUser');
        commit('clearUserType');
      }
    }
  };
  
  export const getters = {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    currentUserType: state => state.userType
  };
  