<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-12 col-md-3 search-input-container">
            <input v-model="searchTerm" @keypress.enter="handleSearchEnter" type="text" class="form-control"
              placeholder="Buscar..." />
          </div>
        </div>
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
                          <input type="checkbox" @change="selectAll($event, paginatedData)">
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
                        <td class="py-0 px-1" data-label="Seleccionar">
                          <input type="checkbox" :checked="selected[m.id]" @change="toggleSelect(m.id)">
                        </td>
                        <td class="py-0 px-1" data-label="Nº">{{ currentPage * itemsPerPage + i + 1 }}</td>
                        <td class="p-1" data-label="Sucursal">{{ m.sucursale.nombre }}</td>
                        <td class="py-0 px-1" data-label="Guía">{{ m.guia }}</td>
                        <td class="py-0 px-1" data-label="Remitente">{{ m.remitente }}</td>
                        <td class="py-0 px-1" data-label="Detalles de Domicilio">{{ m.direccion.direccion_especifica }}
                        </td>
                        <td class="py-0 px-1" data-label="Zona">{{ m.direccion.zona }}</td>
                        <td class="py-0 px-1" data-label="Dirección maps">
                          <a v-if="isCoordinates(m.direccion.direccion)"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion.direccion"
                            target="_blank" class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ m.direccion.direccion }}</span>
                        </td>
                        <td class="py-0 px-1" data-label="Teléfono">{{ m.telefono }}</td>
                        <td class="py-0 px-1" data-label="Contenido">{{ m.contenido }}</td>
                        <td class="py-0 px-1" data-label="Fecha Solicitud">{{ m.fecha }}</td>
                        <td class="py-0 px-1" data-label="Destinatario">{{ m.destinatario }}</td>
                        <td class="py-0 px-1" data-label="Teléfono D">{{ m.telefono_d }}</td>
                        <td class="py-0 px-1" data-label="Dirección Destinatario">
                          <a v-if="isCoordinates(m.direccion_d)"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d" target="_blank"
                            class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ m.direccion_d }}</span>
                        </td>
                        <td class="py-0 px-1" data-label="Municipio/Provincia">{{ m.ciudad }}</td>
                        <td class="py-0 px-1" data-label="Zona Destinatario">{{ m.zona_d }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-between">
            <li class="page-item" :class="{ disabled: currentPage === 0 }">
              <button class="page-link" @click="previousPage" :disabled="currentPage === 0">&lt;</button>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page - 1 }">
              <button class="page-link" @click="goToPage(page - 1)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
              <button class="page-link" @click="nextPage" :disabled="currentPage >= totalPages - 1">&gt;</button>
            </li>
          </ul>
        </nav>

        <!-- Nueva tabla para mostrar los paquetes seleccionados para entregar -->
        <div v-if="selectedForDelivery.length > 0" class="mt-4">
          <button @click="startDelivery" class="btn btn-primary btn-sm mb-3">
            <i class="fas fa-truck"></i> Empezar Entrega
          </button>
          <div class="table-responsive">
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
                  <td class="py-0 px-1" data-label="Guía">{{ item.guia }}</td>
                  <td class="py-0 px-1" data-label="Sucursal">{{ item.sucursale.nombre }}</td>
                  <td class="py-0 px-1" data-label="Departamento">{{ item.tarifa.departamento }}</td>
                  <td class="py-0 px-1" data-label="Peso Correos (Kg)">{{ item.peso_r }}</td>

                </tr>
              </tbody>
            </table>
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
      apiUrl: 'solicitudes',
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

      return this.list.filter(item =>
        item.estado === 10 &&
        item.tarifa &&
        item.tarifa.departamento === departamentoCartero &&
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
    }
  },
  methods: {
    handleSearchEnter() {
      // Encuentra el primer elemento que coincida con el término de búsqueda
      const filteredItems = this.filteredData;
      if (filteredItems.length > 0) {
        const item = filteredItems[0]; // Selecciona el primer elemento filtrado
        this.selected[item.id] = true; // Marca el elemento como seleccionado
        this.updateSelectedItems(); // Actualiza la lista de elementos seleccionados

        // Limpia el término de búsqueda después de mover el elemento
        this.searchTerm = '';
      }
    },
    iniciarFiltrado() {
      const departamentoCartero = this.user.departamento_cartero;
    },
    focusPesoInput() {
      this.$refs.pesoInput[0].focus();
    },
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
        await this.GET_DATA(this.apiUrl);
      } catch (e) {
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al asignar el cartero.',
        });
      } finally {
        this.load = false;
      }
    },
    getTarifaLabel(tarifa_id) {
      if (!this.tarifas) {
        return 'Tarifas no cargadas';
      }
      const tarifa = this.tarifas.find(t => t.id === tarifa_id);
      return tarifa ? tarifa.departamento : 'Tarifa no encontrada';
    },
    calculatePrice(tarifa_id, peso_r) {
      const tarifa = this.tarifas.find(t => t.id === tarifa_id);
      if (tarifa) {
        const basePrice = tarifa.precio ? parseFloat(tarifa.precio) : 0;
        const extraPrice = tarifa.precio_extra ? parseFloat(tarifa.precio_extra) : 0;
        const peso = parseFloat(peso_r);
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
      const peso = parseFloat(item.peso_r);
      item.precio = this.calculatePrice(item.tarifa_id, item.peso_r);
      item.nombre_d = item.precio;
    },
    async GET_DATA(path) {
      const res = await this.$api.$get(path);
      return res;
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
    updateSelectedItems() {
      // Mover los elementos seleccionados a la tabla inferior
      this.selectedForAssign = this.paginatedData.filter(item => this.selected[item.id]);

      // Actualizar la lista de paquetes para entregar
      this.selectedForDelivery = [...this.selectedForAssign];
    },

    toggleSelect(itemId) {
      // Este método se llamará cuando se seleccione o deseleccione un elemento individual
      this.selected[itemId] = !this.selected[itemId];
      this.updateSelectedItems();
    },

    selectAll(event, group) {
      const isChecked = event.target.checked;
      group.forEach(item => {
        this.$set(this.selected, item.id, isChecked);
      });
      this.updateSelectedItems(); // Llamar a la función después de seleccionar todos
    },
    async startDelivery() {
      this.load = true;
      try {
        const carteroId = this.user.user.id;
        for (let item of this.selectedForDelivery) {
          await this.$api.$put(`encaminoregional/${item.id}`, {
            cartero_entrega_id: carteroId,
            peso_r: item.peso_r,
            fecha_d: item.fecha_d,
            precio: item.precio,
            nombre_d: item.nombre_d
          });
        }

        this.selectedForDelivery = [];

        this.$swal.fire({
          icon: 'success',
          title: 'Entrega Iniciada',
          text: 'Todos los carteros seleccionados han sido marcados como en camino.',
        });
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
  watch: {
    selected: {
      handler() {
        // Aquí estamos asegurándonos de que solo estamos moviendo los elementos seleccionados sin modificar `selected`
        this.updateSelectedItems();
      },
      deep: true
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

/* Responsive adjustments */
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

/* Even smaller screens */
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
