<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <!-- Buscador -->
        <div class="row justify-content-end mb-3">
          <div class="col-12 col-md-3 search-input-container">
            <input v-model="searchTerm" @keypress.enter="handleSearchEnter" type="text" class="form-control"
              placeholder="Buscar..." />
          </div>
        </div>

        <!-- Tabla de solicitudes en camino -->
        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                EN CAMINO
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">
                          <!-- Checkbox para seleccionar todo -->
                          <input type="checkbox" @change="toggleSelectAll($event)" />
                        </th>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>
                        <th class="py-0 px-1">Guía</th>
                        <th class="py-0 px-1">Remitente</th>
                        <th class="py-0 px-1">Detalles de Domicilio</th>
                        <th class="py-0 px-1">Zona</th>
                        <th class="py-0 px-1">Dirección maps</th>
                        <th class="py-0 px-1">Teléfono</th>
                        <th class="py-0 px-1">Contenido</th>
                        <th class="py-0 px-1">Fecha Solicitud</th>
                        <th class="py-0 px-1">Destinatario</th>
                        <th class="py-0 px-1">Teléfono D</th>
                        <th class="py-0 px-1">Dirección Destinatario</th>
                        <th class="py-0 px-1">Municipio/Provincia</th>
                        <th class="py-0 px-1">Zona Destinatario</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedData" :key="m.id">

                        <!-- Checkbox -->
                        <td class="py-0 px-1">
                          <input type="checkbox" :checked="selectedForDelivery.some(x => x.id === m.id)"
                            @change="toggleSelection(m)" />
                        </td>

                        <!-- Nº -->
                        <td class="py-0 px-1" data-label="Nº">
                          {{ currentPage * itemsPerPage + i + 1 }}
                        </td>

                        <!-- Sucursal -->
                        <td class="p-1" data-label="Sucursal">
                          {{ m?.sucursale?.nombre ?? 'SIN SUCURSAL' }}
                        </td>

                        <!-- Guía -->
                        <td class="py-0 px-1" data-label="Guía">
                          {{ m?.guia ?? '-' }}
                        </td>

                        <!-- Remitente -->
                        <td class="py-0 px-1" data-label="Remitente">
                          {{ m?.remitente ?? '-' }}
                        </td>

                        <!-- Dirección específica -->
                        <td class="py-0 px-1" data-label="Detalles de Domicilio">
                          {{ m?.direccion?.direccion_especifica ?? 'SIN DIRECCIÓN' }}
                        </td>

                        <!-- Zona -->
                        <td class="py-0 px-1" data-label="Zona">
                          {{ m?.direccion?.zona ?? '-' }}
                        </td>

                        <!-- Dirección Maps -->
                        <td class="py-0 px-1" data-label="Dirección maps">
                          <a v-if="m?.direccion?.direccion && isCoordinates(m.direccion.direccion)"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion.direccion"
                            target="_blank" class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>
                            {{ m?.direccion?.direccion ?? 'No disponible' }}
                          </span>
                        </td>

                        <!-- Teléfono -->
                        <td class="py-0 px-1" data-label="Teléfono">
                          {{ m?.telefono ?? '-' }}
                        </td>

                        <!-- Contenido -->
                        <td class="py-0 px-1" data-label="Contenido">
                          {{ m?.contenido ?? '-' }}
                        </td>

                        <!-- Fecha -->
                        <td class="py-0 px-1" data-label="Fecha Solicitud">
                          {{ m?.fecha ?? '-' }}
                        </td>

                        <!-- Destinatario -->
                        <td class="py-0 px-1" data-label="Destinatario">
                          {{ m?.destinatario ?? '-' }}
                        </td>

                        <!-- Teléfono Destinatario -->
                        <td class="py-0 px-1" data-label="Teléfono D">
                          {{ m?.telefono_d ?? '-' }}
                        </td>

                        <!-- Dirección Destinatario -->
                        <td class="py-0 px-1" data-label="Dirección Destinatario">
                          <a v-if="m?.direccion_d && isCoordinates(m.direccion_d)"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d" target="_blank"
                            class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>
                            {{ m?.direccion_d ?? 'No disponible' }}
                          </span>
                        </td>

                        <!-- Municipio -->
                        <td class="py-0 px-1" data-label="Municipio/Provincia">
                          {{ m?.ciudad ?? '-' }}
                        </td>

                        <!-- Zona Destinatario -->
                        <td class="py-0 px-1" data-label="Zona Destinatario">
                          {{ m?.zona_d ?? '-' }}
                        </td>

                      </tr>
                    </tbody>

                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mostrar la lista y el botón solo si hay elementos seleccionados -->
        <div v-if="selectedForDelivery.length > 0">
          <!-- Lista de seleccionados -->
          <h5>Seleccionados para entrega:</h5>

          <div class="table-responsive">
            <button @click="startDelivery" class="btn btn-primary btn-sm mb-3">
              <i class="fas fa-truck"></i> Empezar Entrega
            </button>
            <table class="table table-sm table-bordered">
              <thead>
                <tr>
                  <th class="py-0 px-1">#</th>
                  <th class="py-0 px-1">Guía</th>
                  <th class="py-0 px-1">Sucursal</th>
                  <th class="py-0 px-1">Departamento de Destino</th>
                  <th class="py-0 px-1">Peso Correos (Kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in selectedForDelivery" :key="index">
                  <td class="py-0 px-1" data-label="Nº">{{ index + 1 }}</td>
                  <td class="py-0 px-1" data-label="Guía">{{ (item.guia ?? '-') }}</td>
                  <td class="py-0 px-1" data-label="Sucursal">{{ item?.sucursale?.nombre ?? 'SIN SUCURSAL' }}</td>
                  <td class="py-0 px-1" data-label="Departamento">{{ item?.tarifa?.departamento ?? 'SIN TARIFA' }}</td>

                  <td class="py-0 px-1" data-label="Peso Correos (Kg)">{{ (item.peso_r ?? '-') }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Botón para iniciar la entrega -->

        </div>
      </div>
    </AdminTemplate>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      load: true,
      list: [],
      searchTerm: '',
      apiUrl: 'solicitudes',
      page: 'Enviar Paquetes',
      modulo: 'Enviar Paquetes',
      url_nuevo: '/admin/solicitudesj/solicitudej/nuevo',
      url_editar: '/admin/solicitudescartero/solicitudecartero/editar/',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      tarifas: [],
      collapseState: {},
      isModalVisible: false,
      currentId: null,
      selected: {},
      selectedItemsData: [],
      selectedForAssign: [],
      selectedForDelivery: [], // Lista para las solicitudes seleccionadas
      user: {
        user: {
          departamento_cartero: '',
        }
      },
      currentPage: 0,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredData() {
      const departamentoCartero = this.user?.user?.departamento_cartero;
      if (!departamentoCartero) {
        return [];
      }

      const searchTerm = this.searchTerm.toLowerCase();

      return this.list.filter(item => {
        const matchesDepartamento = item.tarifa && item.tarifa.departamento === departamentoCartero;
        const matchesReencaminamiento = item.reencaminamiento && item.reencaminamiento === departamentoCartero;

        const matchesSearchTerm = Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm)
        );

        return item.estado === 10 && (matchesDepartamento || matchesReencaminamiento) && matchesSearchTerm;
      });
    },
    paginatedData() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    }
  },
  methods: {
    toggleSelection(item) {
      const index = this.selectedForDelivery.indexOf(item);
      if (index === -1) {
        // Añadir a la lista de seleccionados
        this.selectedForDelivery.push(item);
      } else {
        // Quitar de la lista de seleccionados
        this.selectedForDelivery.splice(index, 1);
      }
    },
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedForDelivery = [...this.paginatedData];
      } else {
        this.selectedForDelivery = [];
      }
    },
    async startDelivery() {
      const cartero_entrega_id = this.user?.user?.id || null;
      try {
        for (const item of this.selectedForDelivery) {
          await this.$api.$put(`/encaminoregional/${item.id}`, {
            cartero_entrega_id,
          });
        }

        // Mostrar la alerta con SweetAlert cuando todos los envíos estén en camino
        Swal.fire({
          icon: 'success',
          title: 'Envíos en camino',
          text: 'Todos los envíos seleccionados han sido marcados como en camino.',
          confirmButtonText: 'OK'
        }).then(() => {
          // Recargar la página una vez que se cierre la alerta
          location.reload();
        });

      } catch (error) {
        console.error(`Error entregando la solicitud:`, error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al intentar enviar las solicitudes.',
          confirmButtonText: 'OK'
        });
      }
    }
    ,

    handleSearchEnter() {
      const filteredItems = this.filteredData;
      if (!filteredItems || filteredItems.length === 0) return;

      const item = filteredItems[0];

      // evita duplicados
      const exists = this.selectedForDelivery.some(x => x.id === item.id);
      if (!exists) this.selectedForDelivery.push(item);

      this.searchTerm = '';
    },

    async GET_DATA(path) {
      const res = await this.$api.$get(path);
      return res;
    },
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
      }
    },
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      let user = localStorage.getItem('userAuth');
      if (user) {
        this.user = JSON.parse(user);

        if (this.user && this.user.user && this.user.user.departamento_cartero) {
          const departamentoCartero = this.user.user.departamento_cartero;
        }

        try {
          const data = await this.GET_DATA(this.apiUrl);
          if (Array.isArray(data)) {
            this.list = data;
          }
          const tarifas = await this.GET_DATA('getTarifas');
          if (Array.isArray(tarifas)) {
            this.tarifas = tarifas;
          }
        } catch (e) {
        } finally {
          this.load = false;
        }
      }
    });
  },
};
</script>

<style scoped>
/* Estilos para la tabla y la página */
.card.border-rounded {
  border-radius: 15px;
  border: 1px solid #000000;
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
  overflow-x: auto !important;
  white-space: nowrap;
}

.table {
  width: 100%;
  text-align: center;
  vertical-align: middle;
}

.table th,
.table td {
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
}

.table-hover tbody tr:hover {
  background-color: #F8F9FA;
}

/* Ajustes responsivos */
@media (max-width: 768px) {
  .table-responsive {
    overflow-x: unset;
  }

  .table thead {
    display: none;
  }

  .table tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
  }

  .table td {
    display: flex;
    justify-content: space-between;
    padding: 5px;
    border-bottom: 1px solid #ddd;
  }

  .table td::before {
    content: attr(data-label);
    flex: 1;
    font-weight: bold;
    color: #34447C;
    text-align: left;
    padding-right: 5px;
  }
}

/* Para pantallas aún más pequeñas */
@media (max-width: 360px) {
  .table td {
    font-size: 12px;
    padding: 4px;
  }

  .table td::before {
    font-size: 12px;
  }
}
</style>
