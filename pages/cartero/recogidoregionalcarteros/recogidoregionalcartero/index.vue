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
      apiUrl: 'solicitudes10',
      page: 'Enviar Paquetes',
      modulo: 'Enviar Paquetes',
      url_nuevo: '/admin/solicitudesj/solicitudej/nuevo',
      url_editar: '/admin/solicitudescartero/solicitudecartero/editar/',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
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
      pagination: { current_page: 1, last_page: 1, total: 0, per_page: 10 },
    };
  },
  computed: {
    filteredData() {
      return this.list;
    },
    paginatedData() {
      return this.filteredData;
    },
    totalPages() {
      return Number(this.pagination?.last_page || 1);
    }
  },
  methods: {
    normalizeArrayPayload(payload) {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      if (Array.isArray(payload?.solicitudes)) return payload.solicitudes;
      return [];
    },
    normalizePaginationPayload(payload) {
      return {
        current_page: Number(payload?.current_page || 1),
        last_page: Number(payload?.last_page || 1),
        total: Number(payload?.total || this.normalizeArrayPayload(payload).length || 0),
        per_page: Number(payload?.per_page || this.itemsPerPage || 10),
      };
    },
    applyPaginationPayload(payload) {
      const pagination = this.normalizePaginationPayload(payload);
      this.pagination = pagination;
      this.itemsPerPage = pagination.per_page;
      this.currentPage = Math.max(0, pagination.current_page - 1);
    },
    buildListPath(search = '', page = this.currentPage + 1) {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('per_page', this.itemsPerPage);
      const normalizedSearch = String(search || '').trim();
      if (normalizedSearch) {
        params.set('search', normalizedSearch);
      }
      const query = params.toString();
      return query ? `${this.apiUrl}?${query}` : this.apiUrl;
    },
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
        }).then(async () => {
          this.selectedForDelivery = [];
          await this.fetchList();
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

    async handleSearchEnter() {
      const term = String(this.searchTerm || '').trim();
      if (!term) {
        this.searchTerm = '';
        return;
      }

      this.load = true;
      let filteredItems = [];
      try {
        filteredItems = await this.fetchList(term);
      } catch (e) {
        console.error('Error buscando recogido regional:', e);
      } finally {
        this.load = false;
      }

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
    async fetchList(search = '', page = this.currentPage + 1) {
      const payload = await this.GET_DATA(this.buildListPath(search, page));
      this.list = this.normalizeArrayPayload(payload);
      this.applyPaginationPayload(payload);
      return this.list;
    },
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    async nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        await this.fetchList(this.searchTerm, this.currentPage + 2);
      }
    },
    async previousPage() {
      if (this.currentPage > 0) {
        await this.fetchList(this.searchTerm, this.currentPage);
      }
    },
    async goToPage(page) {
      await this.fetchList(this.searchTerm, page + 1);
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
          await this.fetchList();
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
