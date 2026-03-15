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
            <div class="card border-rounded">
              <div class="card-header">
                Recibidos
              </div>
              <div class="card-body p-2">
                <div v-if="alertsCercaLimite.length > 0" class="mb-2">
                  <div v-for="(a, idx) in alertsCercaLimite" :key="idx" class="alert alert-warning py-1 px-2 mb-1">
                    Faltan {{ a.horasRestantes }} horas para llegar al límite verde. Código de rastreo: {{ a.guia }}.
                  </div>
                </div>
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
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
                      <tr v-for="(m, i) in paginatedData" :key="m?.id ?? i" :class="rowStatusClass(m)">

                        <!-- Checkbox -->
                        <td class="py-0 px-1">
                          <input type="checkbox" :disabled="!m?.id" :checked="!!selected[m?.id]"
                            @change="m?.id && $set(selected, m.id, $event.target.checked)" />
                        </td>

                        <td class="py-0 px-1">
                          {{ i + 1 + (currentPage - 1) * itemsPerPage }}
                        </td>

                        <td class="p-1">
                          {{ m?.sucursale?.nombre ?? 'SIN SUCURSAL' }}
                        </td>

                        <td class="py-0 px-1">
                          {{ m?.guia ?? 'SIN GUÍA' }}
                        </td>

                        <td class="py-0 px-1">
                          {{ m?.remitente ?? 'SIN REMITENTE' }}
                        </td>

                        <td class="py-0 px-1">
                          {{ m?.direccion?.direccion_especifica ?? 'SIN DETALLE' }}
                        </td>

                        <td class="py-0 px-1">
                          {{ m?.direccion?.zona ?? 'SIN ZONA' }}
                        </td>

                        <td class="py-0 px-1">
                          <a v-if="m?.direccion?.direccion && isCoordinates(String(m.direccion.direccion))"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion.direccion"
                            target="_blank" class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>
                            {{ m?.direccion?.direccion ?? 'SIN DIRECCIÓN' }}
                          </span>
                        </td>

                        <td class="py-0 px-1">
                          {{ m?.telefono ?? 'SIN TELÉFONO' }}
                        </td>

                        <td class="py-0 px-1">
                          {{ m?.contenido ?? 'SIN CONTENIDO' }}
                        </td>

                        <td class="py-0 px-1">
                          {{ m?.fecha ?? 'SIN FECHA' }}
                        </td>

                        <td class="py-0 px-1">
                          {{ m?.destinatario ?? 'SIN DESTINATARIO' }}
                        </td>

                        <td class="py-0 px-1">
                          {{ m?.telefono_d ?? 'SIN TELÉFONO' }}
                        </td>

                        <td class="py-0 px-1">
                          <a v-if="m?.direccion_d && isCoordinates(String(m.direccion_d))"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d" target="_blank"
                            class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>
                            {{ m?.direccion_d ?? 'SIN DIRECCIÓN' }}
                          </span>
                        </td>

                        <td class="py-0 px-1">
                          {{ m?.ciudad ?? 'SIN MUNICIPIO/PROV.' }}
                        </td>

                        <td class="py-0 px-1">
                          {{ m?.zona_d ?? 'SIN ZONA' }}
                        </td>

                      </tr>
                    </tbody>

                  </table>
                </div>
              </div>
            </div>


            <!-- Paginación -->
            <nav aria-label="Page navigation">
              <ul class="pagination justify-content-between">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="previousPage" :disabled="currentPage === 1">&lt;</button>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page"
                  :class="{ active: currentPage === page }">
                  <button class="page-link" @click="goToPage(page)">{{ (page ?? '-') }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
                  <button class="page-link" @click="nextPage" :disabled="currentPage >= totalPages">&gt;</button>
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
                  <td class="py-0 px-1">{{ (item.guia ?? '-') }}</td>
                  <td class="py-0 px-1">{{ (item.sucursale.nombre ?? '-') }}</td>
                  <td class="py-0 px-1">{{ (item.tarifa ?? '-') }}</td>
                  <td class="py-0 px-1">{{ (item.peso_v ?? '-') }}</td>
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
        <label :for="'peso_v-' + item.id">{{ (item.guia ?? '-') }} - {{ (item.sucursale.nombre ?? '-') }} - {{ (item.tarifa ?? '-') }}</label>
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
      apiUrl: 'solicitudes-recibido-regional',
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
      currentPage: 1,
      itemsPerPage: 10,
      pagination: { current_page: 1, last_page: 1, total: 0, per_page: 10 },
    };
  },
  computed: {
    filteredData() {
      return Array.isArray(this.list) ? this.list : [];
    },

    paginatedData() {
      return this.filteredData;
    },
    totalPages() {
      return Number(this.pagination?.last_page || 1);
    },
    hasSelectedItems() {
      return Object.keys(this.selected).some(key => this.selected[key]);
    },
    alertsCercaLimite() {
      const result = [];
      (this.filteredData || []).forEach(item => {
        const horasRestantes = Number(item?.horas_restantes_alerta);
        if (horasRestantes <= 10 && horasRestantes > 0) {
          result.push({
            guia: item?.guia ?? 'SIN GUIA',
            horasRestantes,
          });
        }
      });
      return result;
    }
  },
  methods: {
    focusPesoInput() {
      const ref = this.$refs.pesoInput;
      if (Array.isArray(ref) && ref.length > 0) ref[0].focus();
      else if (ref) ref.focus();
    },

    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    rowStatusClass(item) {
      return item?.row_status_class || '';
    },
    getTarifaLabel(tarifa_id) {
      if (!this.tarifas) {
        return 'Tarifas no cargadas';
      }
      const tarifa = this.tarifas.find(t => t.id === tarifa_id);
      return tarifa?.departamento || 'SIN TARIFA';
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
      this.currentPage = pagination.current_page;
    },
    buildListPath(page = this.currentPage, searchOverride = null) {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('per_page', this.itemsPerPage);
      const search = searchOverride !== null
        ? String(searchOverride || '').trim()
        : String(this.searchTerm || '').trim();
      if (search) {
        params.set('search', search);
      }
      return `${this.apiUrl}?${params.toString()}`;
    },
    async GET_DATA(path) {
      const res = await this.$encargados.$get(path);
      return res;
    },
    async fetchList(page = this.currentPage, searchOverride = null) {
      const payload = await this.GET_DATA(this.buildListPath(page, searchOverride));
      this.list = this.normalizeArrayPayload(payload);
      this.applyPaginationPayload(payload);
      return this.list;
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        await this.$encargados.$delete(this.apiUrl + '/' + id);
        await this.fetchList();
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
    async handleSearchEnter() {
      const filteredItems = await this.fetchList(1, this.searchTerm);
      if (!filteredItems || filteredItems.length === 0) return;

      const item = filteredItems[0];

      this.selectedItemsData = [{
        id: item?.id,
        guia: item?.guia ?? '',
        sucursale: item?.sucursale ?? { nombre: 'SIN SUCURSAL' }, // 🔥 aquí
        peso_v: item?.peso_v || 0,
        tarifa_id: item?.tarifa_id,
        tarifa: this.getTarifaLabel(item?.tarifa_id),
        precio: this.calculatePrice(item?.tarifa_id, item?.peso_v),
        estado: item?.estado
      }];

      this.isModalVisible = true;
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
        await this.fetchList();
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
        for (let itemId in this.selected) {
          if (this.selected[itemId]) {
            await this.$encargados.$put(`recibirpaquetes5/${itemId}`);
          }
        }
        await this.fetchList();
        this.$swal.fire({
          icon: 'success',
          title: 'Paquetes recibidos',
          text: 'Todos los paquetes seleccionados han sido marcados como recibidos.',
        });
        this.selected = {};
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
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        await this.fetchList(this.currentPage + 1);
      }
    },
    async previousPage() {
      if (this.currentPage > 1) {
        await this.fetchList(this.currentPage - 1);
      }
    },
    async goToPage(page) {
      await this.fetchList(page);
    }
  },
  mounted() {
    this.$nextTick(async () => {
      let user = localStorage.getItem('userAuth');
      this.user = JSON.parse(user);
      try {
        await this.fetchList();
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
  watch: {
    searchTerm() {
      this.fetchList(1, this.searchTerm);
    },
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
  background-color: #1f6f8b;
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

.row-green {
  background-color: #d4edda !important;
}

.row-orange {
  background-color: #fff3cd !important;
}

.row-red {
  background-color: #f8d7da !important;
}
</style>
