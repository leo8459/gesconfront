  <template>
    <div>
      <JcLoader :load="load"></JcLoader>
      <AdminTemplate :page="page" :modulo="modulo">
        <div slot="body">
          <div class="row">

            <!-- Tarjetas para las solicitudes totales por estado -->
            <div class="row">
              
              <!-- Tarjeta para solicitudes en estado 1 -->
              <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div class="card">
                  <div class="card-body p-3">
                    <div class="row">
                      <div class="col-8">
                        <div class="numbers">
                          <p class="text-sm mb-0 text-capitalize">
                            <strong>Correspondencias Solicitadas</strong>
                          </p>
                          <h6 class="text-center text-lg font-weight-bolder text-black">
                            {{ dashboard.totalSolicitudesEstado1 }}
                          </h6>
                        </div>
                      </div>
                      <div class="col-4 text-end">
                        <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                          <i class="fas fa-info-circle text-lg opacity-10" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Tarjeta para solicitudes en estado 5 -->
              <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div class="card">
                  <div class="card-body p-3">
                    <div class="row">
                      <div class="col-8">
                        <div class="numbers">
                          <p class="text-sm mb-0 text-capitalize">
                            <strong>Correspondencias Recogidas</strong>
                          </p>
                          <h6 class="text-center text-lg font-weight-bolder text-black">
                            {{ dashboard.totalSolicitudesEstado5 }}
                          </h6>
                        </div>
                      </div>
                      <div class="col-4 text-end">
                        <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                          <i class="fas fa-info-circle text-lg opacity-10" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Tarjeta para solicitudes en estado 2 -->
              <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div class="card">
                  <div class="card-body p-3">
                    <div class="row">
                      <div class="col-8">
                        <div class="numbers">
                          <p class="text-sm mb-0 text-capitalize">
                            <strong>Correspondencias en camino</strong>
                          </p>
                          <h6 class="text-center text-lg font-weight-bolder text-black">
                            {{ dashboard.totalSolicitudesEstado2 }}
                          </h6>
                        </div>
                      </div>
                      <div class="col-4 text-end">
                        <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                          <i class="fas fa-info-circle text-lg opacity-10" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tarjeta para solicitudes en estado 3 -->
              <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div class="card">
                  <div class="card-body p-3">
                    <div class="row">
                      <div class="col-8">
                        <div class="numbers">
                          <p class="text-sm mb-0 text-capitalize">
                            <strong>Correspondencias Entregadas</strong>
                          </p>
                          <h6 class="text-center text-lg font-weight-bolder text-black">
                            {{ dashboard.totalSolicitudesEstado3 }}
                          </h6>
                        </div>
                      </div>
                      <div class="col-4 text-end">
                        <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                          <i class="fas fa-info-circle text-lg opacity-10" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>

            <!-- Tarjetas para las solicitudes de hoy por estado -->
            <div class="row mt-4">
              <!-- Tarjeta para solicitudes de hoy en estado 1 -->
              <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div class="card bg-light">
                  <div class="card-body p-3">
                    <div class="row">
                      <div class="col-8">
                        <div class="numbers">
                          <p class="text-sm mb-0 text-capitalize">
                            <strong>Correspondencias solicitadas hoy </strong>
                          </p>
                          <h6 class="text-center text-lg font-weight-bolder text-black">
                            {{ dashboard.totalSolicitudesEstado1Hoy }}
                          </h6>
                        </div>
                      </div>
                      <div class="col-4 text-end">
                        <div class="icon icon-shape bg-gradient-info shadow text-center border-radius-md">
                          <i class="fas fa-calendar-day text-lg opacity-10" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Tarjeta para solicitudes de hoy en estado 5 -->
              <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div class="card bg-light">
                  <div class="card-body p-3">
                    <div class="row">
                      <div class="col-8">
                        <div class="numbers">
                          <p class="text-sm mb-0 text-capitalize">
                            <strong>Correspondencias recogidas hoy</strong>
                          </p>
                          <h6 class="text-center text-lg font-weight-bolder text-black">
                            {{ dashboard.totalSolicitudesEstado5Hoy }}
                          </h6>
                        </div>
                      </div>
                      <div class="col-4 text-end">
                        <div class="icon icon-shape bg-gradient-info shadow text-center border-radius-md">
                          <i class="fas fa-calendar-day text-lg opacity-10" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Tarjeta para solicitudes de hoy en estado 2 -->
              <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div class="card bg-light">
                  <div class="card-body p-3">
                    <div class="row">
                      <div class="col-8">
                        <div class="numbers">
                          <p class="text-sm mb-0 text-capitalize">
                            <strong>Correspondencias en camino hoy</strong>
                          </p>
                          <h6 class="text-center text-lg font-weight-bolder text-black">
                            {{ dashboard.totalSolicitudesEstado2Hoy }}
                          </h6>
                        </div>
                      </div>
                      <div class="col-4 text-end">
                        <div class="icon icon-shape bg-gradient-info shadow text-center border-radius-md">
                          <i class="fas fa-calendar-day text-lg opacity-10" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tarjeta para solicitudes de hoy en estado 3 -->
              <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                <div class="card bg-light">
                  <div class="card-body p-3">
                    <div class="row">
                      <div class="col-8">
                        <div class="numbers">
                          <p class="text-sm mb-0 text-capitalize">
                            <strong>Correspondencias entregadas hoy</strong>
                          </p>
                          <h6 class="text-center text-lg font-weight-bolder text-black">
                            {{ dashboard.totalSolicitudesEstado3Hoy }}
                          </h6>
                        </div>
                      </div>
                      <div class="col-4 text-end">
                        <div class="icon icon-shape bg-gradient-info shadow text-center border-radius-md">
                          <i class="fas fa-calendar-day text-lg opacity-10" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>

          </div>
        </div>
      </AdminTemplate>
    </div>
  </template>

<script>
export default {
  name: "IndexPage",
  data() {
    return {
      user: {
        cartero: {
          id: null
        }
      },
      variableInt: null,
      page: "Menu Principal",
      modulo: "Menu Principal",
      url_nuevo: '/sucursal/sucursales/sucursal/nuevo',
      url_nuevo2: '/sucursal/sucursales/sucursal/nuevo2',
      load: false,
      dashboard: {
        alquileres: 10,
        users: 10,
        clientes: 10,
        casillas: 10,
        totalSolicitudes: 0,
        totalGastado: 0,
        totalSolicitudesHoy: 0,
        totalSolicitudesEstado1: 0,
        totalSolicitudesEstado2: 0,
        totalSolicitudesEstado3: 0,
        totalSolicitudesEstado5: 0,
        totalSolicitudesEstado0: 0,
        totalSolicitudesEstado1Hoy: 0, // Definido para solicitudes de hoy en estado 1
        totalSolicitudesEstado2Hoy: 0, // Definido para solicitudes de hoy en estado 2
        totalSolicitudesEstado3Hoy: 0, // Definido para solicitudes de hoy en estado 3
        totalSolicitudesEstado5Hoy: 0  // Definido para solicitudes de hoy en estado 5
      },
    };
  },
  methods: {
    async GET_DATA(path, params = {}) {
      const res = await this.$api.$get(path, { params });
      return res;
    },
    async fetchDashboardData() {
      try {
        const carteroId = this.user.user.id;
        const totalSolicitudesData = await this.GET_DATA('/Ctodas-solicitudes', { cartero_entrega_id: carteroId });
        const totalGastadoData = await this.GET_DATA('/CtotalNombreD', { cartero_entrega_id: carteroId });
        const totalSolicitudesHoyData = await this.GET_DATA('/Csolicitudes-hoy', { cartero_entrega_id: carteroId });
        const totalSolicitudesEstado1 = await this.GET_DATA('/Csolicitudes-estado-1', { cartero_entrega_id: carteroId });
        const totalSolicitudesEstado2 = await this.GET_DATA('/Csolicitudes-estado-2', { cartero_entrega_id: carteroId });
        const totalSolicitudesEstado3 = await this.GET_DATA('/Csolicitudes-estado-3', { cartero_entrega_id: carteroId });
        const totalSolicitudesEstado5 = await this.GET_DATA('Csolicitudes-por-cartero-recogida', { cartero_recogida_id: carteroId });
        const totalSolicitudesEstado0 = await this.GET_DATA('/Csolicitudes-estado-0', { cartero_entrega_id: carteroId });

        // Nuevas solicitudes para hoy
        const totalSolicitudesEstado1Hoy = await this.GET_DATA('/Csolicitudes-estado-1-hoy', { cartero_entrega_id: carteroId });
        const totalSolicitudesEstado2Hoy = await this.GET_DATA('/Csolicitudes-estado-2-hoy', { cartero_entrega_id: carteroId });
        const totalSolicitudesEstado3Hoy = await this.GET_DATA('/Csolicitudes-estado-3-hoy', { cartero_entrega_id: carteroId });
        const totalSolicitudesEstado5Hoy = await this.GET_DATA('/Csolicitudes-estado-5-hoy', { cartero_recogida_id: carteroId });

        this.dashboard.totalSolicitudes = totalSolicitudesData.total;
        this.dashboard.totalGastado = totalGastadoData.total_gastado;
        this.dashboard.totalSolicitudesHoy = totalSolicitudesHoyData.total;
        this.dashboard.totalSolicitudesEstado1 = totalSolicitudesEstado1.total;
        this.dashboard.totalSolicitudesEstado2 = totalSolicitudesEstado2.total;
        this.dashboard.totalSolicitudesEstado3 = totalSolicitudesEstado3.total;
        this.dashboard.totalSolicitudesEstado5 = totalSolicitudesEstado5.total;
        this.dashboard.totalSolicitudesEstado0 = totalSolicitudesEstado0.total;
        // Nuevos datos para hoy
        this.dashboard.totalSolicitudesEstado1Hoy = totalSolicitudesEstado1Hoy.total;
        this.dashboard.totalSolicitudesEstado2Hoy = totalSolicitudesEstado2Hoy.total;
        this.dashboard.totalSolicitudesEstado3Hoy = totalSolicitudesEstado3Hoy.total;
        this.dashboard.totalSolicitudesEstado5Hoy = totalSolicitudesEstado5Hoy.total;
      } catch (error) {
        console.error('Error al actualizar el dashboard:', error);
      }
    }
  },
  mounted() {
    this.$nextTick(async () => {
      this.load = true;
      let user = localStorage.getItem('userAuth');
      this.user = JSON.parse(user);
      await this.fetchDashboardData();
      this.load = false;
    });
  },
};
</script>

<style scoped>
.logo-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.text-color-ganadores {
  color: #FFA500;
}

.fs-4 {
  font-size: 1.5rem;
}

.ganador-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
