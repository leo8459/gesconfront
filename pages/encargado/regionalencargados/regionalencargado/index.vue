<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-3" v-if="selectedForAssign.length > 0">
            <button @click="confirmAllAssignments" class="btn btn-primary btn-sm w-100">
              <i class="fas fa-truck"></i> Asignar todos los seleccionados
            </button>
          </div>
          <div class="col-3" v-if="hasSelectedItems">
            <button @click="recibirPaquetes" class="btn btn-success btn-sm w-100">
              <i class="fas fa-box"></i> Recibir Paquetes
            </button>
          </div>
          <div class="col-3">
            <input v-model="searchTerm" @keypress.enter="handleSearchEnter" type="text" class="form-control"
              placeholder="Buscar..." />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th class="py-0 px-1">
                      <input type="checkbox" @click="selectAll($event, paginatedData)" />
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
                  <tr v-for="(m, i) in paginatedData" :key="i">
                    <td class="py-0 px-1">
                      <input type="checkbox" v-model="selected[m.id]" />
                    </td>
                    <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                    <td class="p-1">{{ m.sucursale.nombre }}</td>
                    <td class="py-0 px-1">{{ m.guia }}</td>
                    <td class="py-0 px-1">{{ m.remitente }}</td>
                    <td class="py-0 px-1">{{ m.direccion.direccion_especifica }}</td>
                    <td class="py-0 px-1">{{ m.direccion.zona }}</td>
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

        <!-- Nueva tabla para mostrar los paquetes seleccionados para entregar -->
        <div v-if="selectedForDelivery.length > 0" class="mt-4">
          <h5>Paquetes para entregar</h5>
          <div class="table-responsive">
            <table class="table table-sm table-bordered">
              <thead>
                <tr>
                  <th class="py-0 px-1">#</th>
                  <th class="py-0 px-1">Guía</th>
                  <th class="py-0 px-1">Sucursal</th>
                  <th class="py-0 px-1">Tarifa</th>
                  <th class="py-0 px-1">Peso Correos (Kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in selectedForDelivery" :key="index">
                  <td class="py-0 px-1">{{ index + 1 }}</td>
                  <td class="py-0 px-1">{{ item.guia }}</td>
                  <td class="py-0 px-1">{{ item.sucursale.nombre }}</td>
                  <td class="py-0 px-1">{{ item.tarifa }}</td>
                  <td class="py-0 px-1">{{ item.peso_v }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminTemplate>

    <!-- Modal para añadir peso_v -->
    <b-modal v-model="isModalVisible" title="Asignar Peso Correos (Kg)" hide-backdrop @shown="focusPesoInput">
      <div v-for="item in selectedItemsData" :key="item.id" class="form-group">
        <label :for="'peso_v-' + item.id">{{ item.guia }} - {{ item.sucursale.nombre }} - {{ item.tarifa }}</label>
        <label :for="'peso_v-' + item.id" class="mt-2">Peso (Kg)</label>
        <input type="text" :id="'peso_v-' + item.id" v-model="item.peso_v" class="form-control"
          @input="updatePrice(item)" placeholder="000.001" step="0.001" min="0.001" ref="pesoInput" />
        <label :for="'nombre_d-' + item.id" class="d-none">Nombre Destinatario</label>
        <input type="text" :id="'nombre_d-' + item.id" v-model="item.nombre_d" class="form-control d-none" readonly />
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
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    }
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
      tarifas: [],
      collapseState: {},
      isModalVisible: false,
      currentId: null,
      selected: {},
      selectedItemsData: [],
      selectedForAssign: [],
      selectedForDelivery: [],
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
    const departamento = this.user?.user?.departamento; // Usamos 'departamento'

    if (!departamento) {
      // Si el departamento no está definido, no hay datos que mostrar
      return [];
    }

    return this.list.filter(item =>
      item.estado === 8 &&
      item.tarifa?.departamento === departamento && // Filtrar por el departamento del encargado
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
    focusPesoInput() {
      this.$refs.pesoInput[0].focus();
    },
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    getTarifaLabel(tarifa_id) {
      if (!this.tarifas) {
        return 'Tarifas no cargadas';
      }
      const tarifa = this.tarifas.find(t => t.id === tarifa_id);
      return tarifa ? tarifa.departamento : 'Tarifa no encontrada';
    },
    calculatePrice(tarifa_id, peso_v) {
      const tarifa = this.tarifas.find(t => t.id === tarifa_id);
      if (tarifa) {
        const basePrice = tarifa.precio ? parseFloat(tarifa.precio) : 0;
        const extraPrice = tarifa.precio_extra ? parseFloat(tarifa.precio_extra) : 0;
        const peso = parseFloat(peso_v);
        if (isNaN(peso)) {
          return '';
        }
        if (peso > 1) {
          const pesoAdicional = Math.ceil(peso - 1);
          return basePrice + pesoAdicional * extraPrice;
        } else {
          return basePrice;
        }
      }
      return '';
    },
    updatePrice(item) {
      const peso = parseFloat(item.peso_v);
      item.precio = this.calculatePrice(item.tarifa_id, item.peso_v);
      item.nombre_d = item.precio;
    },
    async GET_DATA(path) {
      const res = await this.$encargados.$get(path);
      return res;
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$encargados.$delete(this.apiUrl + '/' + id);
        await Promise.all([this.GET_DATA(this.apiUrl)]).then((v) => {
          this.list = v[0];
        });
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },
    openAssignModal() {
      this.selectedItemsData = this.list.filter(item => this.selected[item.id]).map(item => {
        const precio = this.calculatePrice(item.tarifa_id, item.peso_v);
        return {
          id: item.id,
          guia: item.guia,
          sucursale: item.sucursale,
          peso_v: item.peso_v !== undefined && item.peso_v !== null && item.peso_v !== 0 ? item.peso_v : '',
          tarifa_id: item.tarifa_id,
          tarifa: this.getTarifaLabel(item.tarifa_id),
          nombre_d: precio,
          precio: precio
        };
      });
      this.isModalVisible = true;
    },
    handleSearchEnter() {
      const filteredItems = this.filteredData;
      if (filteredItems.length > 0) {
        const item = filteredItems[0];
        this.selectedItemsData = [{
          id: item.id,
          guia: item.guia,
          sucursale: item.sucursale,
          peso_v: item.peso_v || 0,
          tarifa_id: item.tarifa_id,
          tarifa: this.getTarifaLabel(item.tarifa_id),
          precio: this.calculatePrice(item.tarifa_id, item.peso_v)
        }];
        this.isModalVisible = true;
      }
    },
    confirmAssignSelected() {
      this.selectedForAssign = [...this.selectedForAssign, ...this.selectedItemsData.map(item => {
        let peso = parseFloat(item.peso_v);
        if (isNaN(peso) || peso < 0.001) {
          peso = 0.001;
        } else if (peso > 25.000) {
          peso = 25.000;
        }
        item.peso_v = peso.toFixed(3);
        item.nombre_d = item.precio;
        return item;
      })];
      this.selectedForDelivery = [...this.selectedForAssign];
      this.list = this.list.filter(item => !this.selectedForAssign.some(selectedItem => selectedItem.id === item.id));
      this.isModalVisible = false;
      this.selected = {};
      this.searchTerm = '';
    },
    async confirmAllAssignments() {
      this.load = true;
      try {
        const carteroId = this.user.user.id;
        for (let item of this.selectedForAssign) {
          await this.$encargados.$put(`encaminoregional5/${item.id}`, {
            encargado_id: carteroId,
            peso_v: item.peso_v,
            fecha_envio_regional: item.fecha_envio_regional,
            precio: item.precio,
            nombre_d: item.nombre_d
          });
        }
        await this.GET_DATA(this.apiUrl);
        this.$swal.fire({
          icon: 'success',
          title: 'Carteros asignados',
          text: 'Todos los carteros seleccionados han sido asignados.',
        });
        this.selectedForAssign = [];
        this.selectedForDelivery = [];
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
    async recibirPaquetes() {
  this.load = true;
  try {
    const carteroId = this.user.user.id; // Obtener el ID del cartero logueado
    for (let itemId in this.selected) {
      if (this.selected[itemId]) {
        await this.$encargados.$put(`recibirpaquetes5/${itemId}`, {
          encargado_regional_id: carteroId, // Registrar el encargado_id
          // Puedes agregar otros campos aquí si es necesario
        });
      }
    }
    await this.GET_DATA(this.apiUrl); // Forzar actualización de la lista
    this.$swal.fire({
      icon: 'success',
      title: 'Paquetes recibidos',
      text: 'Todos los paquetes seleccionados han sido marcados como recibidos.',
    });
    this.selected = {}; // Limpiar la selección después de recibir
  } catch (e) {
    console.error(e);
    this.$swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al recibir los paquetes.',
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
        const tarifas = await this.GET_DATA('getTarifas');
        if (Array.isArray(tarifas)) {
          this.tarifas = tarifas;
          console.log('Tarifas cargadas:', tarifas);
        } else {
          console.error('Las tarifas recuperadas no son un array:', tarifas);
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
