<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <!-- Sección de las tarjetas de resumen -->
        <div class="row mb-4">
          <!-- Tarjeta para Correspondencias Solicitadas -->
          <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4" v-for="(card, index) in resumenTarjetas" :key="index">
            <div class="card">
              <div class="card-body p-3">
                <div class="row">
                  <div class="col-8">
                    <div class="numbers">
                      <p class="text-sm mb-0 text-capitalize">
                        <strong>{{ (card.titulo ?? '-') }}</strong>
                      </p>
                      <h6 class="text-center text-lg font-weight-bolder text-black">
                        {{ (card.total ?? '-') }}
                      </h6>
                    </div>
                  </div>
                  <div class="col-4 text-end">
                    <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                      <i :class="card.icono" class="text-lg opacity-10" aria-hidden="true"></i>
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
      page: "Dashboard",
      modulo: "Dashboard",
      load: false,
      // Datos para las solicitudes por categoría
      solicitadasHoy: [],
      recogidasHoy: [],
      entregadasHoy: [],
      // Datos para las tarjetas de resumen
      resumenTarjetas: [
        {
          titulo: 'Correspondencias Solicitadas Hoy',
          total: 0,
          icono: 'fas fa-info-circle',
        },
        {
          titulo: 'Correspondencias Recogidas Hoy',
          total: 0,
          icono: 'fas fa-info-circle',
        },
        {
          titulo: 'Correspondencias Entregadas Hoy',
          total: 0,
          icono: 'fas fa-info-circle',
        },
      ],
    };
  },
  methods: {
    async fetchDashboardData() {
      try {
        const response = await this.$contratos.$get('/solicitudes/filtro');

        // Asignar los datos a cada categoría
        this.solicitadasHoy = response.solicitadas_hoy || [];
        this.recogidasHoy = response.recogidas_hoy || [];
        this.entregadasHoy = response.entregadas_hoy || [];

        // Actualizar los totales en las tarjetas de resumen
        this.resumenTarjetas[0].total = this.solicitadasHoy.length;
        this.resumenTarjetas[1].total = this.recogidasHoy.length;
        this.resumenTarjetas[2].total = this.entregadasHoy.length;
      } catch (error) {
        console.error('Error al actualizar el dashboard:', error);
      }
    },
    getEstado(estado) {
      switch (estado) {
        case 1:
          return 'SOLICITADA';
        case 2:
          return 'EN CAMINO';
        case 3:
        case 4:
          return 'ENTREGADA';
        case 5:
          return 'RECOGIDA';
        case 7:
          return 'DEVUELTA';
        default:
          return 'DESCONOCIDO';
      }
    },
  },
  mounted() {
    this.$nextTick(async () => {
      this.load = true;
      await this.fetchDashboardData();
      this.load = false;
    });
  },
};
</script>

<style scoped>
.card.border-rounded {
  border-radius: 15px;
  border: 1px solid #dee2e6;
  margin-bottom: 1.5rem;
  overflow: hidden;
}
.card-header {
  background-color: #34447C;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
}
.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}
.icon.icon-shape {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  color: #fff;
}
.bg-gradient-primary {
  background: linear-gradient(87deg, #5e72e4 0, #825ee4 100%) !important;
}
.bg-gradient-info {
  background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important;
}
</style>
