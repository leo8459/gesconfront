<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
         <!-- Mensaje de bienvenida -->
         <div class="text- mb-4">
          <h2>Bienvenidos al sistema GESCON</h2>
        </div>
        <!-- Mensaje de advertencia si se excede el límite -->
        <div v-if="limiteTotal > 0 && totalNombreD >= limiteTotal" class="alert alert-custom" role="alert">
  Ha alcanzado o sobrepasado su límite presupuestario y no puede Solicitar nuevos envíos. Por favor, comuníquese con la Agencia Boliviana de Correos.
</div>



        <!-- Barra superior con botones de Agregar solo si no se ha excedido el límite -->
        <div v-else class="d-flex justify-content-between align-items-center mb-4">
          <div class="d-flex align-items-center">
            <!-- Botón para crear solicitud de Correspondencia -->
            <select @change="handleSelectChange" class="btn btn-dark btn-sm mr-3">
              <option value="" disabled selected>Crear solicitud de Correspondencia</option>
              <option value="url_nuevo2">Boleta Digital</option>
              <option value="url_nuevo">Boleta fisica</option>
            </select>

            <!-- Botón de Correspondencia Internacional -->
            <a href="https://ips.correos.gob.bo/CDS.Web/Operational/andeclaration.aspx" class="btn btn-dark btn-sm mr-3"
              target="_blank">
              <i class=""></i> Crear solicitud de Correspondencia Internacional
            </a>
          </div>
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
                        {{ dash(dashboard.totalSolicitudes) }}
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
                        {{ dash(dashboard.totalGastado) }}
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
                        {{ dash(dashboard.totalSolicitudesHoy) }}
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
                          {{ dash(dashboard.totalSolicitudesEstado1) }}
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
                          {{ dash(dashboard.totalSolicitudesEstado2) }}
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
                          {{ dash(dashboard.totalSolicitudesEstado3) }}
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
                          {{ dash(dashboard.totalSolicitudesEstado0) }}
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
      saldoRestante: null,
    limiteTotal: null,
    totalNombreD: null,
      user: {
        sucursale: {
          id: null
        },
      
      },
      variableInt: null,
      page: "Sucursal",
      modulo: "Inicio",
      load: false,
      dashboard: {
        alquileres: 10,
        users: 10,
        clientes: 10,
        casillas: 10,
        totalSolicitudes: 0,
        totalGastado: 0
      },
      url_nuevo: '/sucursal/sucursales/sucursal/nuevo', // Aquí defines la URL del nuevo botón
      url_nuevo2: '/sucursal/sucursales/sucursal/nuevo2' // Aquí defines la URL del nuevo botón

    };
  },
  methods: {
    async fetchSaldoData() {
  try {
    const res = await this.$sucursales.$get('/restantesaldo2');
    // Asigna los valores de la respuesta a las variables reactivas
    this.saldoRestante = Number(res.saldo_restante);
    this.limiteTotal = Number(res.limite_total);
    this.totalNombreD = Number(res.total_nombre_d);
  } catch (error) {
    console.error('Error al obtener saldo:', error);
  }
},
    handleSelectChange(event) {
      const selectedValue = event.target.value;
      if (this[selectedValue]) {
        this.$router.push(this[selectedValue]);
      } else {
        console.error('URL no definida para la opción seleccionada.');
      }
    },
    async GET_DATA(path, params = {}) {
      const res = await this.$sucursales.$get(path, { params });
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
    
    // Llamar a la función para obtener los datos
    await this.fetchSaldoData();
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




.card {
  background: linear-gradient(145deg, #f0f0f0, #ffffff);
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-bottom: 20px;
  /* Incrementa el espacio entre tarjetas */
  padding: 20px;
  /* Aumenta el padding dentro de cada card */
}

.card:hover {
  transform: scale(1.02);
}

.icon-shape {
  background: linear-gradient(45deg, #6a82fb, #fc5c7d);
  border-radius: 50%;
  color: white;
}

.numbers h6 {
  font-size: 1.2rem;
  /* Ajusta el tamaño de texto */
  margin-bottom: 10px;
}

.numbers p {
  font-size: 1rem;
  /* Ajusta el tamaño del texto en las descripciones */
  color: #666;
  /* Color de texto más suave */
}

.row {
  margin-top: 20px;
  /* Espacio superior a las filas */
}

.col-xl-3,
.col-sm-6 {
  padding: 15px;
  /* Espacio entre las columnas */
}

button.btn {
  background-color: #22C55E;
  color: white;
  border-radius: 10px;
  padding: 10px 20px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-weight: bold;
  /* Hace que el texto sea más grueso */
}



button.btn:hover {
  background-color: #22C55E;
  transform: scale(1.05);
  font-weight: bold;
  /* Mantiene el texto grueso también en el hover */
}

select.btn {
  background-color: #22C55E; /* Este es el color del botón principal */
  color: white;
  padding: 20px 25px;
  border: none;
}

select.btn option {
  background-color:  #ffffff; /* Elimina el fondo */
  color: black; /* Cambia el color de las letras a negro */
  font-weight: bold;
}

select option[disabled] {
  display: none;
}
.alert-custom {
  background-image: linear-gradient(to right, #fffb00de, #ddd905); /* Degradado de azul oscuro a dorado */
  color: black; /* Color del texto */
  border: 1px solid #b2954b; /* Borde dorado */
  border-radius: 5px; /* Bordes redondeados */
  padding: 15px;
}

</style>
