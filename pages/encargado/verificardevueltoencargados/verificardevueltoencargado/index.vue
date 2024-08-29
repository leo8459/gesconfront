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
            <div class="table-responsive">
              <table class="table table-sm table-bordered">
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
                    <td class="py-0 px-1">{{ m.guia }}</td>
                    <td class="py-0 px-1">{{ m.peso_o }}</td>
                    <td class="py-0 px-1">{{ m.peso_v }}</td>
                    <td class="py-0 px-1">{{ m.remitente }}</td>
                    <td class="py-0 px-1">{{ m.direccion.direccion_especifica }}</td>
                    <!-- Mostrar la dirección específica -->
                    <td class="py-0 px-1">{{ m.direccion.zona }}</td> <!-- Mostrar la zona -->
                    <td class="py-0 px-1">
                      <a v-if="isCoordinates(m.direccion.direccion)"
                        :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion.direccion"
                        target="_blank" class="btn btn-primary btn-sm">
                        Ver mapa
                      </a>
                      <span v-else>{{ m.direccion.direccion }}</span>
                    </td>
                    <td class="py-0 px-1">{{ m.telefono }}</td>
                    <td class="py-0 px-1">{{ m.contenido }}</td>
                    <td class="py-0 px-1">{{ m.fecha }}</td>
                    
                    <td class="py-0 px-1">{{ m.destinatario }}</td>
                    <td class="py-0 px-1">{{ m.telefono_d }}</td>
                    <td class="py-0 px-1">
                      <a v-if="isCoordinates(m.direccion_d)"
                        :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d" target="_blank"
                        class="btn btn-primary btn-sm">
                        Ver mapa
                      </a>
                      <span v-else>{{ m.direccion_d }}</span>
                    </td>
                    <td class="py-0 px-1">{{ m.ciudad }}</td>
                    <td class="py-0 px-1">{{ m.direccion_especifica_d }}</td>
                    <td class="py-0 px-1">{{ m.zona_d }}</td>

                    <td class="py-0 px-1">
                      <img v-if="m.firma_d" :src="m.firma_d" alt="Firma Destino" width="100" />
                    </td>
                    <td class="py-0 px-1">{{ m.fecha_d }}</td>
                    <td class="py-0 px-1">{{ m.estado === 3 ? 'Entregado' : m.estado }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <button class="btn btn-secondary" :disabled="currentPage === 1" @click="prevPage">Anterior</button>
              <span>Página {{ currentPage }} de {{ totalPages }}</span>
              <button class="btn btn-secondary" :disabled="currentPage === totalPages"
                @click="nextPage">Siguiente</button>
            </div>
            <div class="pagination-controls">
              <ul class="pagination">
                <li :class="['page-item', { active: currentPage === pageNumber }]" v-for="pageNumber in totalPagesArray"
                  :key="pageNumber">
                  <button class="page-link" @click="goToPage(pageNumber)">{{ pageNumber }}</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>
    <!-- Modal para añadir peso_v -->
    <b-modal v-model="isModalVisible" title="Asignar Peso Correos (Kg)" hide-backdrop>
      <div v-for="item in selectedItemsData" :key="item.id" class="form-group">
        <label :for="'peso_v-' + item.id">{{ item.guia }} - {{ item.sucursale.nombre }}</label>
        <input type="number" :id="'peso_v-' + item.id" v-model="item.peso_v" class="form-control" />
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-secondary" @click="isModalVisible = false">Cancelar</button>
        <button class="btn btn-primary ml-2" @click="confirmAssignSelected">Asignar</button>
      </div>
    </b-modal>
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
  return this.list.filter(item =>
    (item.estado === 11 ) && // Incluir elementos con estado 3 o 10
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm)
    )
  );
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
          console.error('Los datos recuperados no son un array:', res);
        }
      } catch (e) {
        console.error('Error al obtener los datos:', e);
      }
    },






    async markSelectedAsVerified() {
      this.load = true;
      try {
        const selectedIds = Object.keys(this.selected).filter(key => this.selected[key]);
        for (let id of selectedIds) {
          await this.$encargados.$put(`verificarreturn5/${id}`);
        }
        await this.GET_DATA(this.apiUrl); // Forzar actualización de la lista
        this.$swal.fire({
          icon: 'success',
          title: 'Solicitudes verificadas',
          text: 'Todas las solicitudes seleccionadas han sido marcadas como verificadas.',
        });
        this.selected = {}; // Limpiar la selección después de verificar
      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al verificar las solicitudes.',
        });
      } finally {
        this.load = false;
      }
    },
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
      let user = localStorage.getItem('userAuth');
      if (user) {
        this.user = JSON.parse(user);
        console.log('Usuario cargado:', this.user);
      } else {
        console.error('No se encontró el usuario en el almacenamiento local');
        this.user = { cartero: null };
      }

      try {
        const data = await this.GET_DATA(this.apiUrl);
        if (Array.isArray(data)) {
          this.list = data;
          console.log('Datos cargados:', this.list);
        } else {
          console.error('Los datos recuperados no son un array:', data);
        }
      } catch (e) {
        console.error('Error al obtener los datos:', e);
      } finally {
        this.load = false;
      }
    });
  },
};
</script>

<style scoped>
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
