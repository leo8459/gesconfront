<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-3" v-if="hasSelectedItems">
            <button @click="markSelectedAsVerified" class="btn btn-success btn-sm w-100">
              <i class="fas fa-check"></i> Verificar seleccionados
            </button>
          </div>
          <div class="col-3">
            <input v-model="searchTerm" type="text" class="form-control" placeholder="Buscar..." />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                PAQUETES POR VERIFICAR
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">
                          <input type="checkbox" @change="selectAll($event, paginatedData)" />
                        </th>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>
                        <th class="py-0 px-1">Cartero Recogida</th>
                        <th class="py-0 px-1">Cartero Entrega</th>
                        <th class="py-0 px-1">Guia</th>
                        <th class="py-0 px-1">Peso Empresa (Kg)</th>
                        <th class="py-0 px-1">Peso Correos (Kg)</th>
                        <th class="py-0 px-1">Remitente</th>
                        <th class="py-0 px-1">Detalles de Domicilio</th>

                        <!-- Nueva columna para la dirección específica -->
                        <th class="py-0 px-1">Zona</th> <!-- Nueva columna para la zona -->
                        <th class="py-0 px-1">Dirección maps</th>
                        <th class="py-0 px-1">Teléfono</th>
                        <th class="py-0 px-1">Contenido</th>
                        <th class="py-0 px-1">Fecha</th>
                        <th class="py-0 px-1">Destinatario</th>
                        <th class="py-0 px-1">Teléfono D</th>
                        <th class="py-0 px-1">Dirección Destinatario</th>
                        <th class="py-0 px-1">Municipio/Provincia</th>
                        <th class="py-0 px-1">Detalles domoicilio destinatario</th>
                        <th class="py-0 px-1">zona destinatario</th>

                        <th class="py-0 px-1">Firma Destinatario</th>
                        <th class="py-0 px-1">Fecha Destinatario</th>
                        <th class="py-0 px-1">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedData" :key="m.id">
                        <td class="py-0 px-1">
                          <input type="checkbox" v-model="selected[m.id]" />
                        </td>
                        <td class="py-0 px-1">{{ i + 1 + (currentPage - 1) * itemsPerPage }}</td>
                        <td class="p-1">{{ m.sucursale ? m.sucursale.nombre : '' }}</td>
                        <td class="p-1">{{ m.cartero_recogida ? m.cartero_recogida.nombre : 'Por asignar' }}</td>
                        <td class="p-1">{{ m.cartero_entrega ? m.cartero_entrega.nombre : 'Por asignar' }}</td>
                        <td class="py-0 px-1">{{ dash(m.guia) }}</td>
                        <td class="py-0 px-1">{{ dash(m.peso_o) }}</td>
                        <td class="py-0 px-1">{{ dash(m.peso_v) }}</td>
                        <td class="py-0 px-1">{{ dash(m.remitente) }}</td>
                        <td class="py-0 px-1">
                          {{ m?.direccion?.direccion_especifica ?? 'NULL' }}
                        </td>
                        <!-- Mostrar la dirección específica -->
                        <td class="py-0 px-1">
                          {{ m?.direccion?.zona ?? 'NULL' }}
                        </td>
                        <td class="py-0 px-1">
                          {{ m?.direccion?.direccion ?? 'NULL' }}
                        </td>
                        <td class="py-0 px-1">{{ dash(m.telefono) }}</td>
                        <td class="py-0 px-1">{{ dash(m.contenido) }}</td>
                        <td class="py-0 px-1">{{ dash(m.fecha) }}</td>

                        <td class="py-0 px-1">{{ dash(m.destinatario) }}</td>
                        <td class="py-0 px-1">{{ dash(m.telefono_d) }}</td>
                        <td class="py-0 px-1">
                          <a v-if="isCoordinates(m.direccion_d)"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d" target="_blank"
                            class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ dash(m.direccion_d) }}</span>
                        </td>
                        <td class="py-0 px-1">{{ dash(m.ciudad) }}</td>
                        <td class="py-0 px-1">{{ dash(m.direccion_especifica_d) }}</td>
                        <td class="py-0 px-1">{{ dash(m.zona_d) }}</td>

                        <td class="py-0 px-1">
                          <img v-if="m.firma_d" :src="m.firma_d" alt="Firma Destino" width="100" />
                        </td>
                        <td class="py-0 px-1">{{ dash(m.fecha_d) }}</td>
                        <td class="py-0 px-1">{{ m.estado === 3 ? 'Entregado' : m.estado }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-3">
              <button class="btn btn-secondary" :disabled="currentPage === 1" @click="prevPage">Anterior</button>
              <span>Página {{ dash(currentPage) }} de {{ dash(totalPages) }}</span>
              <button class="btn btn-secondary" :disabled="currentPage === totalPages"
                @click="nextPage">Siguiente</button>
            </div>
            <div class="pagination-controls">
              <ul class="pagination">
                <li :class="['page-item', { active: currentPage === pageNumber }]" v-for="pageNumber in totalPagesArray"
                  :key="pageNumber">
                  <button class="page-link" @click="goToPage(pageNumber)">{{ dash(pageNumber) }}</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>

  </div>
</template>

<script>
import { BCollapse, BModal } from 'bootstrap-vue';

export default {
  name: "IndexPage",
  components: {
    BCollapse,
    BModal
  },
  data() {
    return {
      load: true,
      list: [],
      searchTerm: '',
      apiUrl: 'solicitudes5',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/admin/solicitudesj/solicitudej/nuevo',
      url_editar: '/admin/solicitudescartero/solicitudecartero/editar/',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      collapseState: {},
      isModalVisible: false,
      currentId: null,
      selected: {},
      selectedItemsData: [],
      user: {
        cartero: []
      },
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredData() {
      const searchTerm = this.searchTerm.toLowerCase();

      if (typeof window !== 'undefined' && localStorage.getItem('userAuth')) {
        const user = JSON.parse(localStorage.getItem('userAuth'));
        const userDepartment = user && user.user ? user.user.departamento : null;


        const filteredList = this.list.filter(item => {
          const isEstadoValid = item.estado === 3 || item.estado === 10;
          const hasCarteroEntrega = item.cartero_entrega;
          const isDepartmentMatch = hasCarteroEntrega && item.cartero_entrega.departamento_cartero === userDepartment;
          const isSearchTermMatch = Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm)
          );


          // Devuelve verdadero solo si todos los criterios se cumplen
          return isEstadoValid && isDepartmentMatch && isSearchTermMatch;
        });

        return filteredList;
      }

      return [];
    },

    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    totalPagesArray() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    },
    hasSelectedItems() {
      return Object.keys(this.selected).some(key => this.selected[key]);
    }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
    goToPage(pageNumber) {
      this.currentPage = pageNumber;
    },
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    async GET_DATA(path) {
      try {
        const res = await this.$encargados.$get(path);
        if (Array.isArray(res)) {
          this.list = res;
        } else {
        }
      } catch (e) {
      }
    },






    async markSelectedAsVerified() {
      this.load = true;

      try {
        const selectedIds = Object.keys(this.selected).filter(key => this.selected[key]);

        for (let id of selectedIds) {

          // Pasar el encargado_id como parte del payload
          const response = await this.$encargados.$put(`verificarsolicitudes5/${id}`, { encargado_id: this.user.user.id });

        }

        await this.GET_DATA(this.apiUrl);

        this.$swal.fire({
          icon: 'success',
          title: 'Solicitudes verificadas',
          text: 'Todas las solicitudes seleccionadas han sido marcadas como verificadas.',
        });

        this.selected = {};

      } catch (e) {
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al verificar las solicitudes.',
        });
      } finally {
        this.load = false;
      }
    }
    ,
    selectAll(event, group) {
      const isChecked = event.target.checked;
      group.forEach(item => {
        this.$set(this.selected, item.id, isChecked);
      });
    },
    toggleCollapse(estado) {
      this.$set(this.collapseState, estado, !this.collapseState[estado]);
    }
  },
  mounted() {
    this.$nextTick(async () => {
      if (typeof window !== 'undefined') { // Verificar si estamos en el navegador
        const user = localStorage.getItem('userAuth');
        if (user) {
          this.user = JSON.parse(user);
        } else {
          this.user = { cartero: null };
        }
      }

      try {
        const data = await this.GET_DATA(this.apiUrl);
        if (Array.isArray(data)) {
          this.list = data;
        } else {
        }
      } catch (e) {
      } finally {
        this.load = false;
      }
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

.pagination-controls .pagination {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.pagination-controls .page-item {
  margin: 0 2px;
}

.pagination-controls .page-item .page-link {
  cursor: pointer;
}

.pagination-controls .page-item.active .page-link {
  font-weight: bold;
  background-color: #007bff;
  color: white;
}
</style>
