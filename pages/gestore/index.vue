<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row">

          <!-- Tarjetas para las solicitudes totales por estado -->
          <div class="row">
            <!-- Tarjeta para sucursales en estado 1 (Con contrato) -->
            <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
              <div class="card">
                <div class="card-body p-3">
                  <div class="row">
                    <div class="col-8">
                      <div class="numbers">
                        <p class="text-sm mb-0 text-capitalize">
                          <strong>Sucursales Con Contrato</strong>
                        </p>
                        <h6 class="text-center text-lg font-weight-bolder text-black">
                          {{ dashboard.totalSucursalesConContrato }}
                        </h6>
                      </div>
                    </div>
                    <div class="col-4 text-end">
                      <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                        <i class="fas fa-file-contract text-lg opacity-10" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Tarjeta para sucursales en estado 0 (Sin contrato) -->
            <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
              <div class="card">
                <div class="card-body p-3">
                  <div class="row">
                    <div class="col-8">
                      <div class="numbers">
                        <p class="text-sm mb-0 text-capitalize">
                          <strong>Sucursales Sin Contrato</strong>
                        </p>
                        <h6 class="text-center text-lg font-weight-bolder text-black">
                          {{ dashboard.totalSucursalesSinContrato }}
                        </h6>
                      </div>
                    </div>
                    <div class="col-4 text-end">
                      <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                        <i class="fas fa-exclamation-circle text-lg opacity-10" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tarjeta para total de nombre_d sumado -->
            <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
              <div class="card">
                <div class="card-body p-3">
                  <div class="row">
                    <div class="col-8">
                      <div class="numbers">
                        <p class="text-sm mb-0 text-capitalize">
                          <strong>Total recaudado</strong>
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
      page: "Dashboard",
      modulo: "AGBC",
      load: false,
      dashboard: {
        totalSucursalesConContrato: 0,
        totalSucursalesSinContrato: 0,
        totalGastado: 0,
      },
    };
  },
  methods: {
    async GET_DATA(path, params = {}) {
      const res = await this.$gestores.$get(path, { params });
      return res;
    },
    async fetchDashboardData() {
      try {
        const totalSucursalesConContrato = await this.GET_DATA('/GsucursalesConContrato');
        const totalSucursalesSinContrato = await this.GET_DATA('/GsucursalesSinContrato');
        const totalGastado = await this.GET_DATA('/GtotalNombreD');

        this.dashboard.totalSucursalesConContrato = totalSucursalesConContrato.length;
        this.dashboard.totalSucursalesSinContrato = totalSucursalesSinContrato.length;
        this.dashboard.totalGastado = totalGastado.total_gastado;
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
