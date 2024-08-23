<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-3" v-if="hasSelectedItems">
            <button @click="openSelectedModal" class="btn btn-primary btn-sm w-100">
              <i class="fas fa-truck"></i> Mostrar Seleccionados
            </button>
          </div>
          <div class="col-3">
            <input v-model="searchTerm" @keypress.enter.prevent="handleSearchEnter" type="text" class="form-control"
              placeholder="Buscar..." />
          </div>
          <div class="col-3">
            <select v-model="selectedSucursal" class="form-control" @change="handleSucursalChange">
              <option value="">Seleccione Sucursal</option>
              <option v-for="sucursal in filteredSucursales" :key="sucursal.id" :value="sucursal.id">
                {{ sucursal.nombre }}
              </option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th class="py-0 px-1">
                      <input type="checkbox" @change="selectAll($event)" />
                    </th>
                    <th class="py-0 px-1">#</th>
                    <th class="py-0 px-1">Sucursal</th>
                    <th class="py-0 px-1">Guía</th>
                    <th class="py-0 px-1">Peso Empresa (Kg)</th>
                    <th class="py-0 px-1">Remitente</th>
                    <th class="py-0 px-1">Dirección</th>
                    <th class="py-0 px-1">Zona</th>
                    <th class="py-0 px-1">Teléfono</th>
                    <th class="py-0 px-1">Contenido</th>
                    <th class="py-0 px-1">Fecha</th>
                    <th class="py-0 px-1">Destinatario</th>
                    <th class="py-0 px-1">Teléfono D</th>
                    <th class="py-0 px-1">Dirección Destinatario</th>
                    <th class="py-0 px-1">Municipio/Provincia</th>
                    <th class="py-0 px-1">Zona Destino</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(m, i) in paginatedData" :key="i">
                    <td class="py-0 px-1">
                      <input type="checkbox" v-model="selected[m.id]" />
                    </td>
                    <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                    <td class="p-1">{{ m.sucursale ? m.sucursale.nombre : '' }}</td>
                    <td class="py-0 px-1">{{ m.guia }}</td>
                    <td class="py-0 px-1">{{ m.peso_o }}</td>
                    <td class="py-0 px-1">{{ m.remitente }}</td>
                    <td class="py-0 px-1">
                      <a v-if="isCoordinates(m.direccion)"
                        :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion" target="_blank"
                        class="btn btn-primary btn-sm">
                        Ver mapa
                      </a>
                      <span v-else>{{ m.direccion }}</span>
                    </td>
                    <td class="py-0 px-1">{{ m.zona_r }}</td>
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
                    <td class="py-0 px-1">{{ m.zona_d }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Paginación -->
            <nav aria-label="Page navigation">
              <ul class="pagination justify-content-between">
                <li class="page-item" :class="{ disabled: currentPage === 0 }">
                  <button class="page-link" @click="previousPage" :disabled="currentPage === 0">&lt;</button>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page"
                  :class="{ active: currentPage === page - 1 }">
                  <button class="page-link" @click="goToPage(page - 1)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                  <button class="page-link" @click="nextPage" :disabled="currentPage >= totalPages - 1">&gt;</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </AdminTemplate>

    <!-- Modal para mostrar seleccionados -->
    <b-modal v-model="isSelectedModalVisible" title="Resultados de la Búsqueda" hide-backdrop>
      <div v-for="(item, index) in selectedItemsData" :key="item.id"
        class="form-group d-flex justify-content-between align-items-center">
        <label>{{ item.sucursale.nombre }} - {{ item.guia }}</label>
        <button @click="removeItem(index)" class="btn btn-danger btn-sm">Eliminar</button>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" @click="collectSelected">Recoger</button>
        <button class="btn btn-secondary ml-2" @click="isSelectedModalVisible = false">Cancelar</button>
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
      selectedSucursal: '',
      sucursales: [],
      filteredSucursales: [],
      apiUrl: 'solicitudes',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/admin/solicitudesj/solicitudej/nuevo',
      url_editar: '/admin/solicitudescartero/solicitudecartero/editar/',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      collapseState: {},
      isModalVisible: false,
      isSelectedModalVisible: false,
      currentId: null,
      selected: {},
      selectedItemsData: [],
      user: {
        cartero: []
      },
      currentPage: 0,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredData() {
      const searchTerm = this.searchTerm.toLowerCase();
      return this.list.filter(item =>
        item.estado === 1 && (
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm)
          ) ||
          (item.sucursale && item.sucursale.nombre && item.sucursale.nombre.toLowerCase().includes(searchTerm)) ||
          (this.selectedSucursal && item.sucursale && item.sucursale.id === this.selectedSucursal)
        )
      ).sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Ordenar del más nuevo al más antiguo
    },
    paginatedData() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    hasSelectedItems() {
      return Object.keys(this.selected).some(key => this.selected[key]);
    }
  },
  methods: {
    async markAsEnCamino(solicitudeId) {
      this.load = true;
      try {
        const carteroId = this.user.user.id;
        const response = await this.$api.$put(`solicitudesrecojo/${solicitudeId}`, { cartero_recogida_id: carteroId });
        await this.GET_DATA(this.apiUrl);
        this.$swal.fire({
          icon: 'success',
          title: 'Cartero asignado',
          text: `La solicitud ${solicitudeId} ha sido marcada como 'En camino'.`,
        });
        await this.GET_DATA(this.apiUrl); // Forzar actualización de la lista
      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al asignar el cartero.',
        });
      } finally {
        this.load = false;
      }
    },
    async GET_DATA(path) {
      const res = await this.$api.$get(path);
      this.list = res;
      this.filteredSucursales = this.getUniqueSucursales(this.list.filter(item => item.estado === 1));
    },
    getUniqueSucursales(data) {
      const uniqueSucursales = [];
      const sucursalIds = new Set();
      data.forEach(item => {
        if (item.sucursale && !sucursalIds.has(item.sucursale.id)) {
          uniqueSucursales.push(item.sucursale);
          sucursalIds.add(item.sucursale.id);
        }
      });
      return uniqueSucursales;
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$api.$delete(this.apiUrl + '/' + id);
        await Promise.all([this.GET_DATA(this.apiUrl)]).then((v) => {
          this.list = v[0];
        });
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },
    Eliminar(id) {
      this.$swal.fire({
        title: '¿Deseas eliminar?',
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.EliminarItem(id);
        }
      });
    },
    async DarDeBaja(id) {
      this.load = true;
      try {
        const carteroId = this.user.user.id;
        const item = this.list.find(m => m.id === id);
        if (item) {
          const response = await this.$api.$put(`solicitudesentrega/${id}`, { cartero_entrega_id: carteroId, peso_v: item.peso_v });
          item.estado = response.estado; // Actualizar estado desde la respuesta
          item.cartero_entrega_id = response.cartero_entrega_id; // Actualizar cartero de entrega desde la respuesta
          item.peso_v = response.peso_v; // Actualizar peso desde la respuesta
          await this.GET_DATA(this.apiUrl);
        }
        await this.GET_DATA(this.apiUrl); // Forzar actualización de la lista
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },
    openSelectedModal() {
      this.isSelectedModalVisible = true;
    },
    async collectSelected() {
      this.load = true;
      try {
        const carteroId = this.user.user.id;
        for (let item of this.selectedItemsData) {
          await this.$api.$put(`marcarrecogido/${item.id}`, { cartero_recogida_id: carteroId });
        }
        await this.GET_DATA(this.apiUrl); // Forzar actualización de la lista
        this.$swal.fire({
          icon: 'success',
          title: 'Recogido',
          text: 'Todos los elementos seleccionados han sido recogidos.',
        });
        this.isSelectedModalVisible = false;
        this.selected = {}; // Limpiar la selección después de recoger
      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al recoger los elementos seleccionados.',
        });
      } finally {
        this.load = false;
      }
    },
    handleSearchEnter() {
      if (this.selectedSucursal) {
        this.selectedItemsData = this.list.filter(item => item.estado === 1 && item.sucursale && item.sucursale.id === this.selectedSucursal).map(item => ({
          id: item.id,
          guia: item.guia,
          sucursale: item.sucursale
        }));
        if (this.selectedItemsData.length > 0) {
          this.openSelectedModal();
        }
      }
    },
    handleSucursalChange() {
      if (this.selectedSucursal) {
        this.selectedItemsData = this.list.filter(item => item.estado === 1 && item.sucursale && item.sucursale.id === this.selectedSucursal).map(item => ({
          id: item.id,
          guia: item.guia,
          sucursale: item.sucursale
        }));
        if (this.selectedItemsData.length > 0) {
          this.openSelectedModal();
        }
      }
    },
    filterBySucursal() {
      const selectedSucursalId = this.selectedSucursal;
      this.filteredData = this.list.filter(item =>
        item.estado === 1 && item.sucursale && (item.sucursale.id === selectedSucursalId)
      );
    },
    selectAll(event) {
      const isChecked = event.target.checked;
      this.filteredData.forEach(item => {
        this.$set(this.selected, item.id, isChecked);
      });
    },
    removeItem(index) {
      this.selectedItemsData.splice(index, 1);
    },
    toggleCollapse(estado) {
      this.$set(this.collapseState, estado, !this.collapseState[estado]);
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
      this.user = JSON.parse(user);
      try {
        const data = await this.GET_DATA(this.apiUrl);
        if (Array.isArray(data)) {
          this.list = data;
        } else {
          console.error('Los datos recuperados no son un array:', data);
        }
        const sucursales = await this.$api.$get('sucursales');
        this.sucursales = sucursales;
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
.card.border-rounded {
  border-radius: 15px;
  border: 1px solid #000000;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}
</style>
