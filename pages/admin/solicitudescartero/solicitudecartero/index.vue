<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-2">
            <nuxtLink :to="url_nuevo" class="btn btn-dark btn-sm w-100">
              <i class="fas fa-plus"></i> Agregar
            </nuxtLink>
          </div>
          <div class="col-2">
            <nuxtLink :to="url_asignar" class="btn btn-dark btn-sm w-100">
              <i class="fas fa-plus"></i> Asignar Carteros
            </nuxtLink>
          </div>
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
          <div v-for="(group, estado) in filteredData" :key="estado" class="col-12">
            <div class="card border-rounded">
              <div class="card-header" @click="toggleCollapse(estado)">
                {{ estado === '1' ? 'Solicitudes' : estado === '2' ? 'En camino' : estado === '3' ? 'Entregados' :
                  estado === '0' ? 'Cancelados' : 'Otro estado' }}
              </div>
              <b-collapse :id="'collapse-' + estado" v-model="collapseState[estado]">
                <div class="card-body p-2">
                  <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                      <thead>
                        <tr>
                          <th class="py-0 px-1" v-if="estado === '1'">
                            <input type="checkbox" @change="selectAll($event, group)" />
                          </th>
                          <th class="py-0 px-1">#</th>
                          <th class="py-0 px-1">Sucursal</th>
                          <th class="py-0 px-1">Cartero</th>
                          <th class="py-0 px-1">Cartero</th>
                          <th class="py-0 px-1">Guia</th>
                          <th class="py-0 px-1">Peso Empresa (Kg)</th>
                          <th class="py-0 px-1">Peso Correos (Kg)</th>
                          <th class="py-0 px-1">Remitente</th>
                          <th class="py-0 px-1">Dirección</th>
                          <th class="py-0 px-1">Teléfono</th>
                          <th class="py-0 px-1">Contenido</th>
                          <th class="py-0 px-1">Fecha</th>
                          <th class="py-0 px-1">Firma Remitente</th>
                          <th class="py-0 px-1">Destinatario</th>
                          <th class="py-0 px-1">Teléfono D</th>
                          <th class="py-0 px-1">Dirección Destinatario</th>
                          <th class="py-0 px-1">Ciudad</th>
                          <th class="py-0 px-1">Firma Destinatario</th>
                          <th class="py-0 px-1">Nombre Destinatario</th>
                          <th class="py-0 px-1">CI Destinatario</th>
                          <th class="py-0 px-1">Fecha Destinatario</th>
                          <th class="py-0 px-1">Estado</th>
                          <th class="py-0 px-1"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(m, i) in group" :key="i">
                          <td class="py-0 px-1" v-if="estado === '1'">
                            <input type="checkbox" v-model="selected[m.id]" />
                          </td>
                          <td class="py-0 px-1">{{ i + 1 }}</td>
                          <td class="p-1">{{ m.sucursale.nombre }}</td>
                          <td class="p-1">{{ m.cartero_recogida ? m.cartero_recogida.nombre : 'Por asignar' }}</td>
                          <td class="p-1">{{ m.cartero_entrega ? m.cartero_entrega.nombre : 'Por asignar' }}</td>
                          <td class="py-0 px-1">{{ m.guia }}</td>
                          <td class="py-0 px-1">{{ m.peso_o }}</td>
                          <td class="py-0 px-1">{{ m.peso_v }}</td>
                          <td class="py-0 px-1">{{ m.remitente }}</td>
                          <td class="py-0 px-1">{{ m.direccion }}</td>
                          <td class="py-0 px-1">{{ m.telefono }}</td>
                          <td class="py-0 px-1">{{ m.contenido }}</td>
                          <td class="py-0 px-1">{{ m.fecha }}</td>
                          <td class="py-0 px-1">
                            <img v-if="m.firma_o" :src="m.firma_o" alt="Firma Origen" width="100" />
                          </td>
                          <td class="py-0 px-1">{{ m.destinatario }}</td>
                          <td class="py-0 px-1">{{ m.telefono_d }}</td>
                          <td class="py-0 px-1">{{ m.direccion_d }}</td>
                          <td class="py-0 px-1">{{ m.ciudad }}</td>
                          <td class="py-0 px-1">
                            <img v-if="m.firma_d" :src="m.firma_d" alt="Firma Destino" width="100" />
                          </td>
                          <td class="py-0 px-1">{{ m.nombre_d }}</td>
                          <td class="py-0 px-1">{{ m.ci_d }}</td>
                          <td class="py-0 px-1">{{ m.fecha_d }}</td>
                          <td class="py-0 px-1">{{ m.estado === 1 ? 'Solicitud' : m.estado === 2 ? 'En camino' :
                            m.estado === 3 ? 'Entregado' : m.estado === 0 ? 'Cancelado' : m.estado }}</td>
                          <td class="py-0 px-1" v-if="m.estado === 1 || m.estado === 2">
                            <div class="btn-group">
                              <nuxtLink :to="url_editar + m.id" class="btn btn-info btn-sm py-1 px-2">
                                <i class="fas fa-pen"></i>
                              </nuxtLink>
                              <button v-if="m.estado !== 2" type="button" @click="Eliminar(m.id)"
                                class="btn btn-danger btn-sm py-1 px-2">
                                <i class="fas fa-trash"></i>
                              </button>
                              <button v-if="m.estado === 2" type="button" @click="DarDeBaja(m.id)"
                                class="btn btn-warning btn-sm py-1 px-2">
                                <i class="fas fa-ban"></i> Dar de Baja
                              </button>
                            
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </b-collapse>
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
      }
    };
  },
  computed: {
    groupedData() {
      const grouped = {};
      this.list.forEach(item => {
        if (!grouped[item.estado]) {
          grouped[item.estado] = [];
        }
        grouped[item.estado].push(item);
      });
      return grouped;
    },
    hasSelectedItems() {
      return Object.keys(this.selected).some(key => this.selected[key]);
    },
    filteredData() {
      const searchTerm = this.searchTerm.toLowerCase();
      const filtered = {};
      Object.keys(this.groupedData).forEach(estado => {
        filtered[estado] = this.groupedData[estado].filter(item =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm)
          )
        );
      });
      return filtered;
    }
  },
  methods: {
    async markAsEnCamino(solicitudeId) {
      this.load = true;
      try {
        const carteroId = this.user.cartero.id;
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
        const carteroId = this.user.cartero.id;
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
      this.selectedItemsData = [];
      Object.keys(this.filteredData).forEach(estado => {
        if (estado === '1') { // Only for items "En camino"
          this.selectedItemsData = this.selectedItemsData.concat(this.filteredData[estado]);
        }
      });
      if (this.selectedItemsData.length > 0) {
        this.isModalVisible = true;
      }
    },
    async confirmAssignSelected() {
      this.load = true;
      try {
        const carteroId = this.user.cartero.id;
        for (let item of this.selectedItemsData) {
          await this.$api.$put(`solicitudesentrega/${item.id}`, { cartero_entrega_id: carteroId, peso_v: item.peso_v });
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
