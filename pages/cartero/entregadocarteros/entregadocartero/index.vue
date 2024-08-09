<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-3" v-if="hasSelectedItems">
            <button @click="openAssignModal" class="btn btn-primary btn-sm w-100">
              <i class="fas fa-truck"></i> Asignar todos los seleccionados
            </button>
          </div>
          <div class="col-3">
            <input v-model="searchTerm" @keypress.enter="handleSearchEnter" type="text" class="form-control" placeholder="Buscar..." />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th class="py-0 px-1">#</th>
                    <th class="py-0 px-1">Sucursal</th>
                    <th class="py-0 px-1">Cartero</th>
                    <th class="py-0 px-1">Guia</th>
                    <th class="py-0 px-1">Peso Empresa (Kg)</th>
                    <th class="py-0 px-1">Peso Correos (Kg)</th>
                    <th class="py-0 px-1">Remitente</th>
                    <th class="py-0 px-1">Dirección</th>
                    <th class="py-0 px-1">Zona Remitente</th>
                    <th class="py-0 px-1">Teléfono</th>
                    <th class="py-0 px-1">Contenido</th>
                    <th class="py-0 px-1">Fecha</th>
                    <th class="py-0 px-1">Destinatario</th>
                    <th class="py-0 px-1">Teléfono D</th>
                    <th class="py-0 px-1">Dirección Destinatario</th>
                    <th class="py-0 px-1">Ciudad</th>
                    <th class="py-0 px-1">Zona Destinatario</th>
                    <th class="py-0 px-1">Firma Destinatario</th>
                    <th class="py-0 px-1">Precio (Bs)</th>
                    <th class="py-0 px-1">Fecha Destinatario</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(m, i) in paginatedData" :key="i">
                    <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                    <td class="p-1">{{ m.sucursale.nombre }}</td>
                    <td class="p-1">{{ m.cartero_entrega ? m.cartero_entrega.nombre : 'Por asignar' }}</td>
                    <td class="py-0 px-1">{{ m.guia }}</td>
                    <td class="py-0 px-1">{{ m.peso_o }}</td>
                    <td class="py-0 px-1">{{ m.peso_v }}</td>
                    <td class="py-0 px-1">{{ m.remitente }}</td>
                    <td class="py-0 px-1">
                      <a v-if="isCoordinates(m.direccion)" :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion" target="_blank" class="btn btn-primary btn-sm">
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
                      <a v-if="isCoordinates(m.direccion_d)" :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d" target="_blank" class="btn btn-primary btn-sm">
                        Ver mapa
                      </a>
                      <span v-else>{{ m.direccion_d }}</span>
                    </td>
                    <td class="py-0 px-1">{{ m.ciudad }}</td>
                    <td class="py-0 px-1">{{ m.zona_d }}</td>
                    <td class="py-0 px-1">
                      <img v-if="m.firma_d" :src="m.firma_d" alt="Firma Destino" width="100" />
                    </td>
                    <td class="py-0 px-1">{{ m.nombre_d }}</td>
                    <td class="py-0 px-1">{{ m.fecha_d }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Paginación -->
            <nav aria-label="Page navigation">
              <ul class="pagination justify-content-between">
                <li class="page-item" :class="{ disabled: currentPage === 0 }">
                  <button class="page-link" @click="previousPage" :disabled="currentPage === 0"><</button>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page - 1 }">
                  <button class="page-link" @click="goToPage(page - 1)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                  <button class="page-link" @click="nextPage" :disabled="currentPage >= totalPages - 1">></button>
                </li>
              </ul>
            </nav>
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
      apiUrl: 'solicitudes',
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
      currentPage: 0,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredData() {
      const searchTerm = this.searchTerm.toLowerCase();
      return this.list.filter(item =>
        item.estado === 3 && 
        item.cartero_entrega && item.cartero_entrega.id === this.user.user.id &&
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
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
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    async markAsEnCamino(solicitudeId) {
      this.load = true;
      try {
        const carteroId = this.user.id;
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
      try {
        const res = await this.$api.$get(path);
        if (Array.isArray(res)) {
          this.list = res;
        } else {
          console.error('Los datos recuperados no son un array:', res);
        }
      } catch (e) {
        console.error('Error al obtener los datos:', e);
      }
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
        title: 'Deseas Eliminar?',
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
        const carteroId = this.user.id;
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
    openAssignModal() {
      this.selectedItemsData = this.list.filter(item => this.selected[item.id]).map(item => ({
        id: item.id,
        guia: item.guia,
        sucursale: item.sucursale,
        peso_v: item.peso_v || 0
      }));
      this.isModalVisible = true;
    },
    handleSearchEnter() {
      this.selectedItemsData = this.filteredData;
      if (this.selectedItemsData.length > 0) {
        this.isModalVisible = true;
      }
    },
    async confirmAssignSelected() {
      this.load = true;
      try {
        const carteroId = this.user.user.id;
        for (let item of this.selectedItemsData) {
          if (item && item.id) { // Verificación adicional
            await this.$api.$put(`solicitudesentrega/${item.id}`, { cartero_entrega_id: carteroId, peso_v: item.peso_v });
          } else {
            console.error('Item inválido:', item);
          }
        }
        await this.GET_DATA(this.apiUrl); // Forzar actualización de la lista
        this.$swal.fire({
          icon: 'success',
          title: 'Carteros asignados',
          text: 'Todos los carteros seleccionados han sido asignados.',
        });
        this.isModalVisible = false;
        this.selected = {}; // Limpiar la selección después de asignar
        await this.GET_DATA(this.apiUrl); // Forzar actualización de la lista
      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al asignar los carteros.',
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
.card.border-rounded {
  border-radius: 15px;
  border: 1px solid #dee2e6;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}
</style>
