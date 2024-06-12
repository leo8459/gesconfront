<template>
  <main class="main-content mt-0 ps">
    <section>
      <div class="page-header min-vh-100"> <!-- Aumenta la altura al 100% -->
        <div class="container">
          <div class="row">
            <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div class="card card-plain mt-8">
                <div class="card-header pb-0 text-start">
                  <h3 class="font-weight-bolder text-info text-gradient">
                    Bienvenido
                  </h3>
                  <p class="mb-0">Ingresa tu email y tu password para iniciar.</p>
                </div>
               
                    <div class="text-center">
                      <div class="text-center mt-2">
                        <button @click="redirectToWelcome" class="btn btn-sm bg-gradient-info w-75 mt-4 mb-0">ADMIN</button>
                      </div>
                      <div class="text-center mt-2">
                        <button @click="redirectToWelcome2" class="btn btn-sm bg-gradient-info w-75 mt-4 mb-0">CAJEROS</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

    </section>
    <div class="ps__rail-x" style="left: 0px; bottom: 0px">
      <div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px"></div>
    </div>
    <div class="ps__rail-y" style="top: 0px; right: 0px">
      <div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 0px"></div>
    </div>
  </main>
</template>

<style scoped>
.main-content {
  background-image: url('/assets/img/curved-images/curved.png');
  background-size: 80% auto;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  /* Evita que la imagen de fondo se repita */
  height: 100vh;
}
</style>



<script>
export default {
  
  methods: {
    redirectToWelcome() {
      this.$router.push('/admin/auth/login');
    },
   
  }
}
</script>