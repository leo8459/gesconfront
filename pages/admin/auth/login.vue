<template>
  <main class="main-content mt-0 ps">
    <section>
      <div class="page-header d-flex flex-column flex-lg-row">
        <!-- Imagen en la mitad izquierda -->
        <div class="col-12 col-lg-6 d-flex align-items-center justify-content-center p-0">
          <img ref="image" src="@/pages/admin/auth/img/contratos.webp" alt="Logo"
            class="img-fluid w-100 h-100 rounded shadow-lg">
        </div>
        <!-- Formulario de inicio de sesión en la mitad derecha -->
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
                  <div ref="formBody" class="card-body">
                    <div role="form" class="text-start">
                      <label>Tipo de Usuario</label>
                      <label>Email</label>
                      <div class="mb-3" data-intro="Introduce tu email aquí." data-step="1">
                        <input type="text" v-model="model.email" class="form-control rounded shadow-sm"
                          placeholder="Email" aria-label="Email" />
                      </div>
                      <label>Password</label>
                      <div class="mb-3" data-intro="Escribe tu contraseña aquí." data-step="2">
                        <input type="password" v-model="model.password" class="form-control rounded shadow-sm"
                          placeholder="Password" aria-label="Password" />
                      </div>
                      <div class="mb-3">
                        <div id="recaptcha" class="g-recaptcha"></div>
                      </div>
                      <div class="text-center">
                        <!-- Botón para iniciar sesión -->
                        <button ref="loginButton" type="button"
                          class="btn bg-gradient-info w-100 mt-4 mb-0 rounded shadow" @click="Login()">
                          Ingresar
                        </button>


                        <!-- Nuevo botón para mostrar el tutorial manualmente -->
                        <button type="button" class="btn btn-outline-secondary w-100 mt-4 mb-0" @click="showTutorial">
                          Mostrar Tutorial
                        </button>
                      </div>
                    </div>
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
      isPaused: false, // Controla el estado de la animación
      animationImage: null,
      animationText: null
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
          sitekey: '6LetfTwqAAAAAG0mLlOtwBEkJZ922QoplIXgIsmq'
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
  /* Permite que el contenido crezca más allá de la pantalla */
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  overflow-y: auto;
  /* Asegura que el contenido sea desplazable si es más alto que la pantalla */
}

.page-header {
  display: flex;
  width: 100%;
  flex-direction: column;
}

.img-fluid {
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  max-height: 40vh;
  /* Reduce la altura de la imagen en móviles */
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
</style>
