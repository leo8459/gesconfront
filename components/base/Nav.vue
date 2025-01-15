<template>
  <nav
    class="navbar navbar-main navbar-expand-lg position-sticky mt-4 top-1 px-0 mx-4 shadow-none border-radius-xl z-index-sticky blur shadow-blur"
    id="navbarBlur" data-scroll="true">
    <div class="container-fluid py-1 px-3 d-flex align-items-center justify-content-between">
      <nav aria-label="breadcrumb" class="d-flex align-items-center">
        <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
          <!-- Resto del breadcrumb -->
        </ol>
        <h6 class="font-weight-bolder mb-0">{{ modulo }}</h6>
      </nav>
      
      <!-- Mensaje de Bienvenida -->
      <div class="d-flex justify-content-center align-items-center">
        <span class="welcome-message">
          <template v-if="user.nombre">
            {{ user.nombre }}
          </template>
          <template v-else>
            {{ userType }}
          </template>
        </span>
      </div>

      <!-- Opciones de Usuario (Cambiar Contraseña y Cerrar Sesión) -->
      <ul class="navbar-nav justify-content-end flex-row align-items-center gap-3">
        <li class="nav-item">
          <a href="javascript:void(0);" @click="togglePasswordModal" class="nav-link text-body font-weight-bold px-0 change-password-link">
            Cambiar Contraseña
          </a>
        </li>
        <li class="nav-item">
          <a href="javascript:void(0);" class="nav-link text-body font-weight-bold px-0" @click="Logout()">
            <i class="fa fa-user me-sm-1"></i>
            <span class="d-sm-inline d-none">Cerrar sesión</span>
          </a>
        </li>
        <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
          <a href="javascript:;" class="nav-link text-body p-0" @click="hideSideNav()" id="iconNavbarSidenav">
            <div class="sidenav-toggler-inner">
              <i class="sidenav-toggler-line"></i>
              <i class="sidenav-toggler-line"></i>
              <i class="sidenav-toggler-line"></i>
            </div>
          </a>
        </li>
        <li class="nav-item px-3 d-flex align-items-center">
          <a href="javascript:;" @click="DarkMode()" class="nav-link text-body p-0">
            <i v-if="theme == 'light-version'" class="fa fa-moon fixed-plugin-button-nav cursor-pointer"></i>
            <i v-else class="fa fa-sun fixed-plugin-button-nav cursor-pointer"></i>
          </a>
        </li>
      </ul>

      <!-- Modal Cambiar Contraseña -->
      <div v-if="showPasswordModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Cambiar Contraseña</h5>
            <button type="button" class="close" @click="togglePasswordModal">&times;</button>
          </div>
          <div class="modal-body">
            <label>Email</label>
            <input type="text" v-model="changePasswordModel.email" class="form-control mb-3" placeholder="Email" />

            <label>Nueva Contraseña</label>
            <div class="mb-3 position-relative">
              <input :type="showNewPassword ? 'text' : 'password'" v-model="changePasswordModel.newPassword"
                class="form-control" placeholder="Nueva Contraseña" />
              <button type="button" class="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2"
                @click="toggleNewPassword">
                <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>

            <label>Confirmar Nueva Contraseña</label>
            <div class="mb-3 position-relative">
              <input :type="showConfirmPassword ? 'text' : 'password'" v-model="changePasswordModel.newPassword_confirmation"
                class="form-control" placeholder="Confirmar Nueva Contraseña" />
              <button type="button" class="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2"
                @click="toggleConfirmPassword">
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-custom-gradient" @click="changePassword">Cambiar Contraseña</button>
            <button type="button" class="btn btn-secondary" @click="togglePasswordModal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>


<script>
export default {
  props: {
    page: {
      type: String,
      default: ''
    },
    modulo: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      theme: 'light-version',
      user: {},
      token: '',
      userType: '',
      showPasswordModal: false, // Controla la visibilidad del modal
    changePasswordModel: {
      email: '',
      newPassword: '',
      newPassword_confirmation: ''
    },
    showNewPassword: false,
    showConfirmPassword: false
    }
  },
  methods: {
    togglePasswordModal() {
    this.showPasswordModal = !this.showPasswordModal;
  },
  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  },
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  },
  async changePassword() {
    try {
      const { email, newPassword, newPassword_confirmation } = this.changePasswordModel;

      // Validación de campos
      if (!email || !newPassword || !newPassword_confirmation) {
        this.$swal.fire({
          title: "Campos incompletos",
          text: "Por favor, completa todos los campos.",
          icon: "warning",
          confirmButtonText: "Aceptar",
        });
        return;
      }

      if (newPassword !== newPassword_confirmation) {
        this.$swal.fire({
          title: "Error",
          text: "Las contraseñas no coinciden. Por favor, asegúrate de que ambas contraseñas sean iguales.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }

      // Llamada a la API para cambiar la contraseña usando this.$sucursales
      const response = await this.$sucursales.post('/sucursales/change-password', {
        email: email,
        newPassword: newPassword,
        newPassword_confirmation: newPassword_confirmation
      });

      // Mostrar mensaje de éxito con SweetAlert2
      this.$swal.fire({
        title: "Éxito",
        text: response.data.message || "Contraseña actualizada correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      this.togglePasswordModal(); // Cerrar el modal
    } catch (error) {
      // Mostrar mensaje de error con SweetAlert2
      this.$swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Hubo un problema al actualizar la contraseña.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      console.error(error);
    }
  },
    getUserInfo() {
      // Recuperar el objeto del usuario desde el localStorage o API
      let userData = JSON.parse(localStorage.getItem('userAuth'));
      if (userData) {
        this.user = userData.user || {}; // Recuperar user o un objeto vacío
        this.token = userData.token || ''; // Recuperar token o cadena vacía
        this.userType = userData.userType || ''; // Recuperar userType o cadena vacía
      } else {
        this.user = {
          nombre: '',
          apellidos: ''
        };
        this.token = '';
        this.userType = '';
      }
    },
    SideToggle() {
      let body = document.body
      body.classList.add("g-sidenav-show", "bg-gray-100");
      body.classList.contains("g-sidenav-hidden") ? body.classList.remove("g-sidenav-hidden") : body.classList.add("g-sidenav-hidden");
    },
    hideSideNav() {
      let side = document.getElementById('sidenav-main')
      side.classList.contains("d-none") ? side.classList.remove("d-none") : side.classList.add("d-none");
      document.getElementById('sidenav-main').classList.remove(this.theme == 'dark-version' ? 'bg-white' : 'bg-dark')
      document.getElementById('sidenav-main').classList.add(this.theme == 'dark-version' ? 'bg-dark' : 'bg-white')
    },
    DarkMode() {
      let theme = localStorage.getItem('theme.pos')
      let body = document.body
      if (theme != null) {
        if (body.classList.contains("dark-version")) {
          body.classList.remove("dark-version")
          theme = "light-version"
          localStorage.setItem('theme.pos', theme)
        } else {
          body.classList.remove("light-version")
          theme = "dark-version"
          localStorage.setItem('theme.pos', theme)
        }
        this.theme = theme
        body.classList.add(theme)
        document.getElementById('sidenav-main').classList.remove(this.theme == 'dark-version' ? 'bg-white' : 'bg-dark')
        document.getElementById('sidenav-main').classList.add(this.theme == 'dark-version' ? 'bg-dark' : 'bg-white')
      } else {
        localStorage.setItem('theme.pos', "dark-version")
      }
    },
    Logout() {
      localStorage.removeItem('userAuth');
      this.$router.push('/');
    }
  },
  mounted() {
    this.getUserInfo(); // Llamar a la función para obtener la información del usuario cuando el componente se monta

    this.$nextTick(() => {
      let body = document.body;

      let sidenavMain = document.getElementById('sidenav-main');
      if (sidenavMain) {
        sidenavMain.classList.remove('d-none');
        sidenavMain.classList.remove(this.theme == 'dark-version' ? 'bg-white' : 'bg-dark');
        sidenavMain.classList.add(this.theme == 'dark-version' ? 'bg-dark' : 'bg-white');
      }

      let theme = localStorage.getItem('theme.pos');
      if (theme != null) {
        body.classList.add(theme);
        this.theme = theme;
      }

      if (window.innerWidth <= 767) {
        let navbar = document.getElementById('navbar');
        let iconSidenav = document.getElementById('iconSidenav');
        if (navbar && iconSidenav) {
          navbar.classList.add('collapse-nb');
          body.classList.add('g-sidenav-pinned');
          iconSidenav.classList.remove('d-none');
        }

        if (sidenavMain) {
          sidenavMain.classList.add('d-none', this.theme == 'dark-version' ? 'bg-dark' : 'bg-white');
        }
      }
    });
  }
}
</script>

<style>
.side_togle {
  cursor: pointer;
}

.navbar-vertical.navbar-expand-xs .navbar-collapse {
  overflow: hidden;
}

.navbar-vertical.navbar-expand-xs.fixed-start {
  overflow: hidden;
}

.flex-row {
  flex-direction: row;
}

.collapse-nb {
  display: block !important;
}

#iconNavbarSidenav {
  cursor: pointer;
}

.welcome-message {
  font-weight: bold;
  font-size: 26px; /* Ajusta el tamaño de la letra */
  color: #000000;
  white-space: nowrap; /* Evita que el texto se rompa en varias líneas */
  text-align: center;
}
.change-password-link a {
  color: #1e3c72; /* Color del enlace */
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s;
}

.change-password-link a:hover {
  color: #a28c5f; /* Color en hover */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.modal-title {
  margin: 0;
}

.modal-body {
  padding-top: 10px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 10px;
}

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.btn-custom-gradient {
  background: linear-gradient(135deg, #1e3c72, #a28c5f);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn-custom-gradient:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background-color: #ddd;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
}
</style>
