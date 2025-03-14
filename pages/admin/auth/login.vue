<template>
  <main class="main-content mt-0 ps">
    <section>
      <div class="page-header d-flex flex-column flex-lg-row">
        <!-- Imagen en la mitad izquierda -->
        <div class="col-12 col-lg-6 d-flex align-items-center justify-content-center p-0">
          <img ref="image" src="@/pages/admin/auth/img/contratos.webp" alt="Logo"
            class="img-fluid w-100 h-100 rounded shadow-lg">
        </div>

        <!-- Contenedor principal de formularios -->
        <div class="col-12 col-lg-6 d-flex align-items-center justify-content-center">
          <div class="container">
            <div class="row justify-content-center">
              <div ref="formContainer" class="col-xl-8 col-lg-10 col-md-12 d-flex flex-column">
                <div class="card card-plain mt-8 shadow-lg rounded bg-white">
                  <div class="card-header pb-0 text-start">
                    <h3 ref="typingTitle" class="font-weight-bolder text-info text-gradient typing">
                      Sistema Gescon AGBC
                    </h3>
                    <p ref="typingSubtitle" class="mb-0 typing">Ingresa tu email y tu password para iniciar.</p>
                  </div>

                  <!-- Formulario de Inicio de Sesión -->
                  <div v-if="!showChangePasswordForm" class="card-body fade-in">
                    <div role="form" class="text-start">
                      <label>Tipo de Usuario</label>
                      <label>Email</label>
                      <div class="mb-3" data-intro="Introduce tu email aquí." data-step="1">
                        <input type="text" v-model="model.email" class="form-control rounded shadow-sm"
                          placeholder="Email" aria-label="Email" />
                      </div>
                      <label>Password</label>
                      <div class="mb-3 position-relative" data-intro="Escribe tu contraseña aquí." data-step="2">
                        <input :type="showPassword ? 'text' : 'password'" v-model="model.password"
                          class="form-control rounded shadow-sm" placeholder="Password" aria-label="Password" />
                        <button type="button"
                          class="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 icon-button"
                          @click="togglePassword" aria-label="Mostrar/Ocultar contraseña">
                          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        </button>
                      </div>

                      <div class="mb-3">
                        <div id="recaptcha" class="g-recaptcha"></div>
                      </div>
                      <div class="text-center">
                        <!-- Botón para iniciar sesión -->
                        <button ref="loginButton" type="button" class="btn btn-custom-gradient w-100 mt-4 mb-0"
                          @click="Login()">
                          Ingresar
                        </button>

                        <!-- Botón para mostrar el tutorial manualmente -->
                        <button type="button" class="btn btn-outline-secondary w-100 mt-4 mb-0" @click="showTutorial">
                          Mostrar Tutorial
                        </button>


                        <button type="button" class="btn btn-custom-password w-100 mt-3"
                          @click="toggleChangePasswordForm">
                          Cambiar Contraseña
                        </button>

                      </div>
                    </div>
                  </div>

                  <!-- Formulario de Cambio de Contraseña -->
                  <div v-if="showChangePasswordForm" class="card-body fade-in mt-5">
                    <h5>Cambiar Contraseña</h5>
                    <label>Email</label>
                    <div class="mb-3">
                      <input type="text" v-model="changePasswordModel.email" class="form-control rounded shadow-sm"
                        placeholder="Email" aria-label="Email" />
                    </div>
                    <label>Nueva Contraseña</label>
                    <div class="mb-3 position-relative">
                      <input :type="showNewPassword ? 'text' : 'password'" v-model="changePasswordModel.newPassword"
                        class="form-control rounded shadow-sm" placeholder="Nueva Contraseña"
                        aria-label="Nueva Contraseña" />
                      <button type="button"
                        class="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 icon-button"
                        @click="toggleNewPassword" aria-label="Mostrar/Ocultar nueva contraseña">
                        <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                    <label>Confirmar Nueva Contraseña</label>
                    <div class="mb-3 position-relative">
                      <input :type="showConfirmPassword ? 'text' : 'password'"
                        v-model="changePasswordModel.newPassword_confirmation" class="form-control rounded shadow-sm"
                        placeholder="Confirmar Nueva Contraseña" aria-label="Confirmar Nueva Contraseña" />
                      <button type="button"
                        class="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 icon-button"
                        @click="toggleConfirmPassword" aria-label="Mostrar/Ocultar confirmación de contraseña">
                        <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>

                    <button type="button" class="btn btn-custom-password w-100 mt-3" @click="changePassword">
                      Cambiar Contraseña
                    </button>

                    <!-- Botón para volver al formulario de inicio de sesión -->
                    <button type="button" class="btn btn-outline-secondary w-100 mt-3"
                      @click="toggleChangePasswordForm">
                      Volver al Inicio de Sesión
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>





<script>
import api from '@/plugins/api';
import sucursalesApi from '@/plugins/sucursales';
import administradorApi from '@/plugins/administrador';
import gestoresApi from '@/plugins/gestores'; // Importar el plugin gestores
import contratosApi from '@/plugins/contratos'; // Importar el plugin contratos
const anime = require('animejs/lib/anime.js'); // Usando la versión CommonJS de anime.js
import 'intro.js/introjs.css';
import introJs from 'intro.js';

export default {
  data() {
    return {
      model: {
        email: '',
        password: '',
        userType: '' // Valor por defecto
      },
      changePasswordModel: {
        email: '',
        newPassword: '',
        newPassword_confirmation: ''
      },
      isPaused: false, // Controla el estado de la animación
      animationImage: null,
      animationText: null,
      showPassword: false, // Estado para mostrar/ocultar contraseña
      showNewPassword: false, // Controla visibilidad de Nueva Contraseña
      showConfirmPassword: false, // Controla visibilidad de Confirmar Nueva Contraseña
      showChangePasswordForm: false, // Controla la visibilidad del formulario de cambio de contraseña

    }
  },

  mounted() {
    this.animateImage();
    this.animateText();
    this.loadRecaptcha();
    this.animateImage();
    this.animateText();
    this.loadRecaptcha();
    this.startIntro();  // El tour solo se mostrará si no se ha mostrado antes

  },
  methods: {
    async changePassword() {
      try {
        const { email, newPassword, newPassword_confirmation } = this.changePasswordModel;

        // Validar que todos los campos estén llenos
        if (!email || !newPassword || !newPassword_confirmation) {
          this.$swal.fire({
            title: "Por favor, completa todos los campos",
            confirmButtonText: "Ok",
          });
          return;
        }

        // Validar que las contraseñas coincidan
        if (newPassword !== newPassword_confirmation) {
          this.$swal.fire({
            title: "Las contraseñas no coinciden",
            text: "Por favor, asegúrate de que ambas contraseñas sean iguales",
            confirmButtonText: "Ok",
          });
          return;
        }

        // Petición al endpoint de cambio de contraseña
        const response = await this.$sucursales.post('/sucursales/change-password', {
          email: email,
          newPassword: newPassword,
          newPassword_confirmation: newPassword_confirmation
        });

        // Notificación de éxito
        this.$swal.fire({
          title: response.data.message || "Contraseña actualizada correctamente",
          confirmButtonText: "Ok",
        });

        // Limpia los campos después de actualizar la contraseña
        this.changePasswordModel.email = '';
        this.changePasswordModel.newPassword = '';
        this.changePasswordModel.newPassword_confirmation = '';
      } catch (error) {
        console.error(error);
        this.$swal.fire({
          title: "Error al cambiar la contraseña",
          text: error.response?.data?.message || "Hubo un problema al actualizar la contraseña",
          confirmButtonText: "Ok",
        });
      }
    },
    toggleChangePasswordForm() {
      this.showChangePasswordForm = !this.showChangePasswordForm;
    },
    toggleNewPassword() {
      this.showNewPassword = !this.showNewPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    startIntro() {
      if (!localStorage.getItem('introShown')) {
        introJs().start();
        localStorage.setItem('introShown', 'true');
      }
    },
    toggleAnimation() {
      // Pausar o reanudar la animación
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        this.animationImage.pause();
        this.animationText.pause();
      } else {
        this.animationImage.play();
        this.animationText.play();
      }
    },
    animateImage() {
      this.animationImage = anime({
        targets: this.$refs.image,
        scale: [0, 1],
        duration: 2500,
        easing: 'easeInOutExpo',
        autoplay: true // Se reproduce automáticamente
      });
    },
    animateText() {
      this.animationText = anime({
        targets: [this.$refs.typingTitle, this.$refs.typingSubtitle],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeInOutQuad',
        delay: anime.stagger(250, { start: 250 }),
        autoplay: true // Se reproduce automáticamente
      });
    },
    showTutorial() {
      const intro = introJs();

      intro.onchange((targetElement) => {
        // Simula la escritura del email cuando el tutorial apunta al campo de email
        if (targetElement.querySelector('input[type="text"]')) {
          this.typeText('email', 'bnblp@gmail.com'); // Simula la escritura en el campo de email
        }

        // Simula la escritura de la contraseña cuando el tutorial apunta al campo de password
        if (targetElement.querySelector('input[type="password"]')) {
          this.typeText('password', '12345678'); // Simula la escritura en el campo de password
        }
      });

      intro.oncomplete(() => {
        // Simula el clic en el botón de ingresar después de finalizar el tutorial
        this.simulateClick('loginButton');  // Simula el clic en el botón de Ingresar
      });

      intro.start();  // Inicia el tutorial de Intro.js
    },

    // Función que simula el clic en un botón por su referencia
    simulateClick(buttonRef) {
      const button = this.$refs[buttonRef];
      if (button) {
        button.click();  // Simula un clic en el botón de Ingresar
      }
    },

    // Función que simula la animación de escritura letra por letra
    typeText(field, text) {
      let i = 0;
      this.model[field] = '';  // Limpiamos el campo antes de empezar a escribir
      const interval = setInterval(() => {
        if (i < text.length) {
          this.model[field] += text.charAt(i);  // Agrega una letra por vez
          i++;
        } else {
          clearInterval(interval);  // Detiene la animación cuando el texto está completo
        }
      }, 100);  // Velocidad de la animación (100 ms entre letras)
    },

    // Función que simula el clic en un botón por su referencia
    simulateClick(buttonRef) {
      const button = this.$refs[buttonRef];
      if (button) {
        button.click();  // Simula un clic en el botón de Ingresar
      }
    },

    // Función que simula la animación de escritura letra por letra
    typeText(field, text) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          this.model[field] += text.charAt(i);  // Agrega una letra por vez
          i++;
        } else {
          clearInterval(interval);  // Detiene la animación cuando el texto está completo
        }
      }, 100);  // Velocidad de la animación (100 ms entre letras)
    },

    regresarBienvenida() {
      this.$router.push('/auth/welcome');
    },
    loadRecaptcha() {
      if (!document.querySelector('script[src="https://www.google.com/recaptcha/api.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit';
        script.async = true;
        script.defer = true;
        window.onloadCallback = this.renderRecaptcha;
        document.head.appendChild(script);
      } else {
        this.renderRecaptcha();
      }
    },
    renderRecaptcha() {
      if (window.grecaptcha) {
        window.grecaptcha.render('recaptcha', {
          sitekey: '6LcxkvQqAAAAAMh5cGf9aoZ9KMizce3x2jG9RtSs'
        });
      }
    },








    async Login() {
      const recaptchaResponse = window.grecaptcha.getResponse();

      if (!recaptchaResponse) {
        this.$swal.fire({
          title: "Por favor, verifica que no eres un robot",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok"
        });
        return;
      }

      let apiClient = this.$administrador;
      let loginUrl = 'login';

      try {
        const res = await apiClient.post(loginUrl, {
          email: this.model.email,
          password: this.model.password,
          recaptcha: recaptchaResponse
        });

        console.log('API Response:', res);

        if (res.status !== 200 || !res.data.token) {
          this.$swal.fire({
            title: "Credenciales incorrectas",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "Ok"
          });
          return;
        }

        const userType = res.data.userType;
        const user = res.data.user;

        localStorage.setItem('userAuth', JSON.stringify({ token: res.data.token, user, userType }));
        this.$store.dispatch('auth/login', { token: res.data.token, user, userType });

        let redirectPath = '';
        if (userType === 'administrador') {
          redirectPath = '/admin';
        } else if (userType === 'sucursal') {
          redirectPath = '/sucursal';
        } else if (userType === 'cartero') {
          redirectPath = '/cartero';
        } else if (userType === 'Gestore') {
          redirectPath = '/gestore';
        } else if (userType === 'encargado') {
          redirectPath = '/encargado';
        } else if (userType === 'contratos') {
          redirectPath = '/contrato';
        } else if (userType === 'empresas') {
          redirectPath = '/empresa';
        }

        this.$router.push(redirectPath);
      } catch (e) {
        console.log(e);
        this.$swal.fire({
          title: "No se pudo iniciar sesión",
          text: e.message,
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok"
        });
      }
    },










    animateImage() {
      anime({
        targets: this.$refs.image,
        scale: [0, 1],
        duration: 2500,
        easing: 'easeInOutExpo'
      });
    },
    animateText() {
      anime({
        targets: [this.$refs.typingTitle, this.$refs.typingSubtitle],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeInOutQuad',
        delay: anime.stagger(250, { start: 250 })
      });
    }
  }
}
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.main-content {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  overflow-y: auto;
}

.page-header {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  /* Centra verticalmente */
}

.col-12.col-lg-6.d-flex.align-items-center.justify-content-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-fluid {
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  max-height: 40vh;
}

.card {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.typing {
  overflow: hidden;
  border-right: .15em solid rgb(0, 21, 255);
  white-space: nowrap;
  margin: 0 auto;
  letter-spacing: .15em;
  animation:
    typing 3.5s steps(40, end),
    blink-caret .75s step-end infinite;
}

@keyframes typing {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}

@keyframes blink-caret {

  from,
  to {
    border-color: transparent;
  }

  50% {
    border-color: orange;
  }
}

.fade-in {
  opacity: 0;
  animation: fadeIn 2s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.card {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.form-control {
  border-radius: 10px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn {
  border-radius: 25px;
}

/* Estilos para pantallas grandes (computadora) */
@media (min-width: 992px) {
  .page-header {
    flex-direction: row;
    /* Mantiene la disposición de dos columnas en computadoras */
  }

  .img-fluid {
    max-height: 100vh;
    /* Mantiene la imagen en su tamaño completo en pantallas grandes */
  }
}

/* Media Queries para móviles */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    /* En móviles, la imagen y el formulario estarán uno debajo del otro */
  }

  .card {
    margin: 2rem 0;
  }

  .typing {
    font-size: 1.5rem;
  }

  .form-control {
    font-size: 1rem;
  }

  .btn {
    font-size: 1rem;
  }

  .img-fluid {
    max-height: 30vh;
    /* Reduce la altura de la imagen en móviles */
  }

  .pause-play-btn {
    background: none;
    border: none;
    font-size: 2rem;
    color: #344767;
    cursor: pointer;
    margin-top: 20px;
    transition: transform 0.2s ease;
  }

  .pause-play-btn:hover {
    transform: scale(1.1);
  }
}

/* Estilos adicionales para el icono de mostrar/ocultar contraseña */
.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

.top-50 {
  top: 50%;
}

.end-0 {
  right: 0;
}

.translate-middle-y {
  transform: translateY(-50%);
}

.icon-button i {
  font-size: 1rem;
  /* Ajusta el tamaño del icono aquí */
}

.fade-in {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.fade-in-enter-active,
.fade-in-leave-active {
  opacity: 1;
}

.btn-custom-password {
  background: linear-gradient(135deg, #1e3c72, #a28c5f);
  /* Gradiente azul a dorado */
  color: #ffffff;
  /* Color de texto blanco */
  border: none;
  /* Sin borde */
  border-radius: 25px;
  /* Bordes redondeados */
  padding: 10px 20px;
  font-weight: bold;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  /* Animación suave */
}

.btn-custom-password:hover {
  transform: scale(1.05);
  /* Efecto de agrandamiento al pasar el mouse */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  /* Sombra al pasar el mouse */
}

.btn-custom-gradient {
  background: linear-gradient(135deg, #1e3c72, #a28c5f);
  /* Gradiente azul a dorado */
  color: #ffffff;
  /* Color de texto blanco */
  border: none;
  /* Sin borde */
  border-radius: 25px;
  /* Bordes redondeados */
  padding: 10px 20px;
  font-weight: bold;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  /* Animación suave */
}

.btn-custom-gradient:hover {
  transform: scale(1.05);
  /* Efecto de agrandamiento al pasar el mouse */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  /* Sombra al pasar el mouse */
}
</style>
