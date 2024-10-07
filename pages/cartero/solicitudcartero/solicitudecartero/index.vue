<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-12 col-md-3" v-if="hasSelectedItems">
            <button @click="openSelectedModal" class="btn btn-primary btn-sm w-100">
              <i class="fas fa-truck"></i> Mostrar Seleccionados
            </button>
          </div>
          <div class="col-12 col-md-3">
            <input v-model="searchTerm" @keypress.enter.prevent="handleSearchEnter" type="text" class="form-control"
              placeholder="Buscar..." />
          </div>
          <div class="col-12 col-md-3">
            <select v-model="selectedSucursal" class="form-control" @change="handleSucursalChange">
              <option value="">Seleccione Sucursal</option>
              <option v-for="sucursal in uniqueSucursalesInTable" :key="sucursal.id" :value="sucursal.id">
                {{ sucursal.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                Solicitudes Recientes
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">
                          <input type="checkbox" @change="selectAll($event)" />
                        </th>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>
                        <th class="py-0 px-1">Guía</th>
                        <th class="py-0 px-1">Acuerdo de Recojo</th>
                        <th class="py-0 px-1">Peso Empresa (Kg)</th>
                        <th class="py-0 px-1">Remitente</th>
                        <th class="py-0 px-1">Detalles de Domicilio</th>
                        <th class="py-0 px-1">Zona</th>
                        <th class="py-0 px-1">Dirección maps</th>
                        <th class="py-0 px-1">Teléfono</th>
                        <th class="py-0 px-1">Contenido</th>
                        <th class="py-0 px-1">Fecha</th>
                        <th class="py-0 px-1">Departamento origen</th>
                        <th class="py-0 px-1">Departamento destino</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedData" :key="i">
                        <td class="py-0 px-1" data-label="Seleccionar">
                          <input type="checkbox" v-model="selected[m.id]" />
                        </td>
                        <td class="py-0 px-1" data-label="Nº">{{ currentPage * itemsPerPage + i + 1 }}</td>
                        <td class="p-1" data-label="Sucursal">{{ m.sucursale ? m.sucursale.nombre : '' }}</td>
                        <td class="py-0 px-1" data-label="Guía">{{ m.guia }}</td>
                        <td class="py-0 px-1" data-label="Acuerdo de Recojo">{{ m.sucursale.acuerdos }}</td>
                        <td class="py-0 px-1" data-label="Peso Empresa">{{ m.peso_o }}</td>
                        <td class="py-0 px-1" data-label="Remitente">{{ m.remitente }}</td>
                        <td class="py-0 px-1" data-label="Detalles de Domicilio">{{ m.direccion.direccion_especifica }}</td>
                        <td class="py-0 px-1" data-label="Zona">{{ m.direccion.zona }}</td>
                        <td class="py-0 px-1" data-label="Dirección Maps">
                          <a v-if="isCoordinates(m.direccion.direccion)"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion.direccion"
                            target="_blank" class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ m.direccion.direccion }}</span>
                        </td>
                        <td class="py-0 px-1" data-label="Teléfono">{{ m.telefono }}</td>
                        <td class="py-0 px-1" data-label="Contenido">{{ m.contenido }}</td>
                        <td class="py-0 px-1" data-label="Fecha">{{ m.fecha }}</td>
                        <td class="py-0 px-1" data-label="Departamento Origen">{{ m.sucursale.origen }}</td>
                        <td class="py-0 px-1" data-label="Departamento Destino">{{ m.tarifa.departamento }}</td>
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
           <!-- Modal para mostrar seleccionados -->
    <b-modal v-model="isSelectedModalVisible" title="Resultados de la Búsqueda" hide-backdrop hide-footer>
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
    <!-- Modal para mostrar seleccionados con checklist -->
    <b-modal v-model="isSelectedSimpleModalVisible" title="Resultados de los seleccionados" hide-backdrop hide-footer>
      <div v-for="(item, index) in selectedItemsData" :key="item.id"
        class="form-group d-flex justify-content-between align-items-center">
        <input type="checkbox" v-model="selectedForPickup" :value="item.id">
        <label class="ml-2">{{ item.sucursale.nombre }} - {{ item.guia }}</label>
        <button @click="removeItem(index)" class="btn btn-danger btn-sm">Eliminar</button>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" @click="collectSelected">Recoger</button>
        <button class="btn btn-secondary ml-2" @click="isSelectedSimpleModalVisible = false">Cancelar</button>
      </div>
    </b-modal>
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
      selectedSucursal: '',
      sucursales: [],
      filteredSucursales: [],
      apiUrl: 'solicitudes',
      page: 'Recoger Envio',
      modulo: 'Recoger Envio',
      url_nuevo: '/admin/solicitudesj/solicitudej/nuevo',
      url_editar: '/admin/solicitudescartero/solicitudecartero/editar/',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      collapseState: {},
      isModalVisible: false,
      isSelectedModalVisible: false,
      currentId: null,
      selected: {},
      selectedItemsData: [],
      isSelectedSimpleModalVisible: false,
      selectedForPickup: [], // Aquí se guardarán los IDs seleccionados para recoger

      user: {
        cartero: []
      },
      currentPage: 0,
      itemsPerPage: 10,
    };
  },
  computed: {
    uniqueSucursalesInTable() {
      const sucursalIds = new Set();
      const uniqueSucursales = [];

      this.filteredData.forEach(item => {
        if (item.sucursale && !sucursalIds.has(item.sucursale.id)) {
          sucursalIds.add(item.sucursale.id);
          uniqueSucursales.push(item.sucursale);
        }
      });

      return uniqueSucursales;
    },
    hasSelectedItems() {
      return Object.keys(this.selected).some(key => this.selected[key]);
    },
    filteredData() {
      const searchTerm = this.searchTerm.toLowerCase();
      const departamentoCartero = this.user.departamento_cartero;
      return this.list.filter(item =>
        item.estado === 1 &&
        item.sucursale &&
        item.sucursale.origen === departamentoCartero &&
        (
          (this.selectedSucursal ? item.sucursale.id === this.selectedSucursal : true) && // Filtra por sucursal seleccionada
          (Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm)
          ) ||
            (item.sucursale.nombre && item.sucursale.nombre.toLowerCase().includes(searchTerm)))
        )
      ).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
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
    handleSucursalChange() {
      this.selectedItemsData = this.filteredData; // Actualiza los datos filtrados al cambiar de sucursal
      this.currentPage = 0; // Reinicia a la primera página

      if (this.selectedItemsData.length > 0) {
        this.isSelectedSimpleModalVisible = true; // Abre el modal si hay resultados
      } else {
        this.$swal.fire({
          icon: 'info',
          title: 'Sin resultados',
          text: 'No se encontraron elementos en la sucursal seleccionada.',
        });
      }
    },
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
      this.load = true;  // Comienza la carga
      try {
        const res = await this.$api.$get(path);
        this.list = res;
        this.filteredSucursales = this.getUniqueSucursales(this.list.filter(item => item.estado === 1));
      } catch (error) {
      } finally {
        this.load = false;  // Termina la carga
      }
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
      } finally {
        this.load = false;
      }
    },
    openSelectedModal() {
      this.selectedItemsData = this.list.filter(item => this.selected[item.id]);

      if (this.selectedItemsData.length > 0) {
        this.isSelectedSimpleModalVisible = true; // Abre el modal sin el botón de eliminar
      } else {
        this.$swal.fire({
          icon: 'info',
          title: 'No hay elementos seleccionados',
          text: 'Selecciona al menos un elemento para continuar.',
        });
      }
    },

    async collectSelected() {
      this.load = true;
      try {
        // Convertir this.user en un objeto plano
        const plainUser = JSON.parse(JSON.stringify(this.user));

        console.log('Verificando plainUser:', plainUser); // Log para verificar el estado de plainUser

        if (!plainUser || !plainUser.id) {
          console.error('Estado de plainUser en error:', plainUser); // Otro log si hay un error
          throw new Error('El ID del cartero no está disponible.');
        }

        const carteroId = plainUser.id;

        console.log('ID del cartero:', carteroId); // Log para verificar que el ID está disponible

        // Si no hay ningún elemento seleccionado en el checklist, seleccionar todos los que están en el modal
        const itemsToCollect = this.selectedForPickup.length > 0 ? this.selectedForPickup : this.selectedItemsData.map(item => item.id);

        for (let itemId of itemsToCollect) {
          await this.$api.$put(`marcarrecogido/${itemId}`, { cartero_recogida_id: carteroId });
        }

        await this.GET_DATA(this.apiUrl); // Forzar actualización de la lista
        this.$swal.fire({
          icon: 'success',
          title: 'Recogido',
          text: 'Los elementos seleccionados han sido recogidos.',
        });
        this.isSelectedSimpleModalVisible = false;
        this.selected = {}; // Limpiar la selección después de recoger
        this.selectedForPickup = []; // Limpiar los elementos seleccionados para recoger
      } catch (e) {
        console.error(e); // Esto mostrará el error detallado en la consola del navegador
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Hubo un error al recoger los elementos seleccionados. Detalles: ${e.message}`,
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


    filterBySucursal() {
      const selectedSucursalId = this.selectedSucursal;
      this.filteredData = this.list.filter(item =>
        item.estado === 1 && item.sucursale && (item.sucursale.id === selectedSucursalId)
      );
    },
    selectAll(event) {
      const isChecked = event.target.checked;
      this.paginatedData.forEach(item => {
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
      let userAuth = localStorage.getItem('userAuth');
      if (userAuth) {
        let parsedUser = JSON.parse(userAuth);

        if (parsedUser.user && parsedUser.user.departamento_cartero) {
          this.user = parsedUser.user;
          await this.GET_DATA(this.apiUrl);
        } else {
          console.error("El usuario o departamento del cartero no está definido.");
        }
      } else {
        console.error("No se pudo encontrar la información del usuario en localStorage.");
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

/* Scroll horizontal habilitado */
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

.table th {
  background-color: #6c7a89;
  color: #FFFFFF;
  border-bottom: 2px solid #34447C;
  font-size: 16px;
  text-align: center;
  white-space: nowrap;
}

.table td {
  font-size: 16px;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.table-hover tbody tr:hover {
  background-color: #F8F9FA;
}

.pagination .page-item.active .page-link {
  background-color: #ffffff;
  border-color: #ffffff;
}

.pagination .page-item .page-link {
  color: #343A40;
}

.btn-primary {
  background-color: #34447C;
  border-color: #34447C;
}

.btn-primary:hover {
  background-color: #4a5a7a;
}

/* Ajuste para pantallas móviles */
@media (max-width: 768px) {
  .table-responsive {
    overflow-x: unset; /* El scroll horizontal se desactiva en pantallas pequeñas */
  }

  .table thead {
    display: none; /* Ocultar encabezado de la tabla en pantallas pequeñas */
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
    border: none;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
  }

  .table td::before {
    content: attr(data-label); /* Muestra el nombre de la columna */
    flex: 1;
    font-weight: bold;
    color: #34447C;
    text-align: left;
    padding-right: 5px;
    font-size: 14px;
  }

  /* Ajuste para los botones */
  .btn {
    font-size: 14px;
    padding: 8px 12px;
  }

  .btn i {
    margin-right: 5px;
  }

  .search-input-container {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }
}

/* Ajuste para pantallas aún más pequeñas */
@media (max-width: 360px) {
  .table td {
    font-size: 12px;
    padding: 4px;
  }

  .table td::before {
    font-size: 12px;
  }

  .btn {
    font-size: 12px;
    padding: 4px 8px;
  }

  .btn i {
    margin-right: 4px;
  }

  .search-input {
    width: 100%;
  }
}
</style>
