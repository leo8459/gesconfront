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
                Verificar Correspondencia
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>

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
                      <tr v-for="(m, i) in paginatedData" :key="m?.id ?? i">

                        <td class="py-0 px-1">
                          {{ currentPage * itemsPerPage + i + 1 }}
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
                          {{ m?.fecha_envio_regional ?? 'SIN FECHA' }}
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
          <button class="btn btn-primary" @click="recibirTodosLosPaquetes">Recibir todos los paquetes</button>

          <h5>Paquetes seleccionados para recibir</h5>

          <div class="table-responsive">
            <table class="table table-sm table-bordered">
              <thead>
                <tr>
                  <th class="py-0 px-1">#</th>
                  <th class="py-0 px-1">Guía</th>
                  <th class="py-0 px-1">Peso_r (Kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in selectedForDelivery" :key="index">
                  <td class="py-0 px-1">{{ index + 1 }}</td>
                  <td class="py-0 px-1">{{ item.guia }}</td>
                  <td class="py-0 px-1">{{ item.peso_r }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Botón para recibir todos los paquetes -->
        </div>
      </div>
    </AdminTemplate>

    <!-- Modal para añadir peso_r -->
    <b-modal v-model="isModalVisible" :title="modalTitle" hide-backdrop hide-footer @shown="focusPesoInput">
      <div v-for="item in selectedItemsData" :key="item.id" class="form-group">
        <!-- Contenido del modal con los campos de peso -->
        <label :for="'peso_r-' + item.id" class="mt-2">Peso oficina destino (Kg)</label>
        <input type="text" :id="'peso_r-' + item.id" v-model="item.peso_r" class="form-control" ref="pesoInput"
          placeholder="000.001" step="0.001" min="0.001" />
      </div>
      <!-- Botón para agregar el paquete a la lista -->
      <button class="btn btn-secondary" @click="handleAgregarPaquetes">Agregar a la lista</button>
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
    modalTitle() {
      if (this.selectedItemsData.length > 0) {
        const estado = this.selectedItemsData[0].estado;
        if (estado === 12) {
          return 'Recibir Reencaminamiento';
        } else if (estado === 8) {
          return 'Recibir Enviados Regional';
        }
      }
      return 'Asignar Peso Correos (Kg)';
    },
    filteredData() {
      const searchTerm = this.searchTerm.toLowerCase();
      const departamento = this.user?.user?.departamento;

      if (!departamento) {
        return [];
      }

      // Filtrado y ordenación
      return this.list
        .filter(item => {
          const matchesReencaminamiento = item.reencaminamiento && item.reencaminamiento === departamento;
          const matchesDepartamento = item.tarifa?.departamento === departamento;

          const matchesSearchTerm = Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm)
          );

          return (matchesReencaminamiento || matchesDepartamento) && matchesSearchTerm && (item.estado === 8 || item.estado === 12);
        })
        .sort((a, b) => {
          const dateA = new Date(a.fecha_envio_regional);
          const dateB = new Date(b.fecha_envio_regional);
          return dateB - dateA; // Orden descendente
        });
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

    handleAgregarPaquetes() {
      if (this.selectedItemsData.length > 0) {
        const estado = this.selectedItemsData[0].estado;
        if (estado === 8) {
          this.agregarPaquetesALista();
        } else if (estado === 12) {
          this.devolverPaquete();
        } else {
          // Opcional: manejar otros estados o mostrar un mensaje
          this.$swal.fire({
            icon: 'warning',
            title: 'Estado no manejado',
            text: `El estado ${estado} no es manejado por esta acción.`,
          });
        }
      }
    },
    agregarALista(item) {
      this.updatePrice(item);
      const existe = this.selectedForDelivery.find(p => p.id === item.id);
      if (!existe) {
        this.selectedForDelivery.push({ ...item });
        console.log('Paquete agregado:', item);
        this.list = this.list.filter(p => p.id !== item.id);
      } else {
        console.log('Paquete ya existe en la lista');
      }
      this.isModalVisible = false;
    },
    agregarPaquetesALista() {
      this.selectedItemsData.forEach(item => {
        this.formatPesoR(item);
        this.agregarALista(item);
      });
      this.searchTerm = '';
    },
    async recibirTodosLosPaquetes() {
      this.load = true;
      try {
        const carteroId = this.user.user.id;
        for (let item of this.selectedForDelivery) {
          await this.$encargados.$put(`recibirpaquetes5/${item.id}`, {
            encargado_regional_id: carteroId,
            peso_r: item.peso_r,
            nombre_d: item.nombre_d
          });
        }
        this.$swal.fire({
          icon: 'success',
          title: 'Paquetes recibidos',
          text: 'Todos los paquetes seleccionados han sido recibidos.',
        });
        this.selectedForDelivery = [];
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
    formatPesoR(item) {
      let value = parseFloat(item.peso_r);
      if (isNaN(value)) {
        item.peso_r = '0.001';
      } else {
        if (value > 25) {
          value = 25;
        }
        item.peso_r = value.toFixed(3);
      }
    },
    focusPesoInput() {
      if (this.$refs.pesoInput && this.$refs.pesoInput.length > 0) {
        this.$refs.pesoInput[0].focus();
      } else {
        console.error('No se pudo encontrar el campo pesoInput');
      }
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
      const peso = parseFloat(item.peso_r.replace(',', '.'));
      item.precio = this.calculatePrice(item.tarifa_id, peso);
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
        const precio = this.calculatePrice(item.tarifa_id, item.peso_r);
        return {
          id: item.id,
          guia: item.guia,
          sucursale: item.sucursale,
          peso_r: item.peso_r !== undefined && item.peso_r !== null && item.peso_r !== 0 ? item.peso_r : '',
          tarifa_id: item.tarifa_id,
          tarifa: this.getTarifaLabel(item.tarifa_id),
          nombre_d: precio,
          precio: precio,
          peso_v: item.peso_v,
          peso_o: item.peso_o,
          estado: item.estado // Incluir 'estado' aquí
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
          peso_r: item.peso_r || 0,
          peso_v: item.peso_v || 0,
          peso_o: item.peso_o,
          tarifa_id: item.tarifa_id,
          tarifa: this.getTarifaLabel(item.tarifa_id),
          precio: this.calculatePrice(item.tarifa_id, item.peso_r),
          estado: item.estado // Incluir 'estado' aquí
        }];
        this.isModalVisible = true;
      }
    },
    confirmAssignSelected() {
      this.selectedForAssign = [...this.selectedForAssign, ...this.selectedItemsData.map(item => {
        let peso = parseFloat(item.peso_r);
        if (isNaN(peso) || peso < 0.001) {
          peso = 0.001;
        } else if (peso > 25.000) {
          peso = 25.000;
        }
        item.peso_r = peso.toFixed(3);
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
            peso_r: item.peso_r,
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
    async devolverPaquete() {
      this.load = true;
      try {
        const item = this.selectedItemsData[0];
        const carteroId = this.user.user.id;

        await this.$encargados.$put(`reencaminadorecibido5/${item.id}`, {
          encargado_regional_id: carteroId,
          peso_r: item.peso_r,
          nombre_d: item.nombre_d
        });

        this.$swal.fire({
          icon: 'success',
          title: 'Paquete Devuelto',
          text: 'El paquete ha sido marcado como devuelto.',
        });

        this.list = this.list.filter(p => p.id !== item.id);

        this.selected = {};
        this.selectedItemsData = [];
        this.selectedForDelivery = [];

        this.isModalVisible = false;
      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al devolver el paquete.',
        });
      } finally {
        this.load = false;
      }
    },
    async recibirPaquetes() {
      this.load = true;
      try {
        const item = this.selectedItemsData[0];
        const carteroId = this.user.user.id;

        if (item) {
          await this.$encargados.$put(`recibirpaquetes5/${item.id}`, {
            encargado_regional_id: carteroId,
            peso_r: item.peso_r,
            nombre_d: item.nombre_d
          });
        }

        this.$swal.fire({
          icon: 'success',
          title: 'Paquete recibido',
          text: 'El paquete seleccionado ha sido marcado como recibido.',
        });

        this.list = this.list.filter(p => p.id !== item.id);
        this.selected = {};
        this.selectedItemsData = [];
        this.selectedForDelivery = [];
        this.isModalVisible = false;

      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al recibir el paquete.',
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
