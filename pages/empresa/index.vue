<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <!-- Barra superior con botón de Agregar y Cerrar Sesión -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          
        </div>

        <div class="row">
          <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
            <div class="card">
              <div class="card-body p-3">
                <div class="row">
                  <div class="col-8">
                    <div class="numbers">
                      <p class="text-sm mb-0 text-capitalize">
                        <strong>Total Solicitudes Contrato</strong>
                      </p>
                      <h6 class="text-center text-lg font-weight-bolder text-black">
                        {{ dashboard.totalSolicitudes }}
                      </h6>
                    </div>
                  </div>
                  <div class="col-4 text-end">
                    <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                      <i class="fas fa-file-alt text-lg opacity-10" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
            <div class="card">
              <div class="card-body p-3">
                <div class="row">
                  <div class="col-8">
                    <div class="numbers">
                      <p class="text-sm mb-0 text-capitalize">
                        <strong>Total Gastado</strong>
                      </p>
                      <h6 class="text-center text-lg font-weight-bolder text-black">
                        {{ dashboard.totalGastado }}
                      </h6>
                    </div>
                  </div>
                  <div class="col-4 text-end">
                    <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                      <i class="fas fa-dollar-sign text-lg opacity-10" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
            <div class="card">
              <div class="card-body p-3">
                <div class="row">
                  <div class="col-8">
                    <div class="numbers">
                      <p class="text-sm mb-0 text-capitalize">
                        <strong>Solicitudes de Hoy</strong>
                      </p>
                      <h6 class="text-center text-lg font-weight-bolder text-black">
                        {{ dashboard.totalSolicitudesHoy }}
                      </h6>
                    </div>
                  </div>
                  <div class="col-4 text-end">
                    <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                      <i class="fas fa-calendar-day text-lg opacity-10" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
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

            <!-- Tarjeta para solicitudes en estado 2 -->
            <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
              <div class="card">
                <div class="card-body p-3">
                  <div class="row">
                    <div class="col-8">
                      <div class="numbers">
                        <p class="text-sm mb-0 text-capitalize">
                          <strong> Correspondencias En Camino</strong>
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

            <!-- Tarjeta para solicitudes en estado 4 -->
            <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
              <div class="card">
                <div class="card-body p-3">
                  <div class="row">
                    <div class="col-8">
                      <div class="numbers">
                        <p class="text-sm mb-0 text-capitalize">
                          <strong>Correspondencias Canceladas</strong>
                        </p>
                        <h6 class="text-center text-lg font-weight-bolder text-black">
                          {{ dashboard.totalSolicitudesEstado0 }}
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
        empresas: {
          id: null
        }
      },
      variableInt: null,
      page: "Dashboard",
      modulo: "Dashboard",
      load: false,
      dashboard: {
        alquileres: 10,
        users: 10,
        clientes: 10,
        casillas: 10,
        totalSolicitudes: 0,
        totalGastado: 0
      },
      url_nuevo: '/sucursal/empresas/sucursal/nuevo', // Aquí defines la URL del nuevo botón
      url_nuevo2: '/sucursal/empresas/sucursal/nuevo2' // Aquí defines la URL del nuevo botón

    };
  },
  methods: {
    handleSelectChange(event) {
      const selectedValue = event.target.value;
      if (this[selectedValue]) {
        this.$router.push(this[selectedValue]);
      } else {
        console.error('URL no definida para la opción seleccionada.');
      }
    },
    async GET_DATA(path, params = {}) {
      const res = await this.$empresas.$get(path, { params });
      return res;
    },
    async fetchDashboardData() {
      try {
        const sucursalId = this.user.user.id;
        const totalSolicitudesData = await this.GET_DATA('/todas-solicitudes', { sucursal_id: sucursalId });
        const totalGastadoData = await this.GET_DATA('/totalNombreD', { sucursal_id: sucursalId });
        const totalSolicitudesHoyData = await this.GET_DATA('/solicitudes-hoy', { sucursal_id: sucursalId });
        const totalSolicitudesEstado1 = await this.GET_DATA('/solicitudes-estado-1', { sucursal_id: sucursalId });
        const totalSolicitudesEstado2 = await this.GET_DATA('/solicitudes-estado-2', { sucursal_id: sucursalId });
        const totalSolicitudesEstado3 = await this.GET_DATA('/solicitudes-estado-3', { sucursal_id: sucursalId });
        const totalSolicitudesEstado0 = await this.GET_DATA('/solicitudes-estado-0', { sucursal_id: sucursalId });

        this.dashboard.totalSolicitudes = totalSolicitudesData.total;
        this.dashboard.totalGastado = totalGastadoData.total_gastado;
        this.dashboard.totalSolicitudesHoy = totalSolicitudesHoyData.total;
        this.dashboard.totalSolicitudesEstado1 = totalSolicitudesEstado1.total;
        this.dashboard.totalSolicitudesEstado2 = totalSolicitudesEstado2.total;
        this.dashboard.totalSolicitudesEstado3 = totalSolicitudesEstado3.total;
        this.dashboard.totalSolicitudesEstado0 = totalSolicitudesEstado0.total;
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

.mr-3 {
  margin-right: 1rem;
}
</style>
