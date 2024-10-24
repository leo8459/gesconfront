<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-12 col-md-3 search-input-container">
            <div class="col-12 col-md-3 search-input-container">
              <div class="position-relative">
                <input v-model="searchTerm" @keypress.enter="handleSearchEnter" type="text" class="form-control search-input"
                  placeholder="Buscar..." />
                <i class="fas fa-search search-icon" @click="handleSearchEnter"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                Recogidos
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>
                        <th class="py-0 px-1">Guía</th>
                        <th class="py-0 px-1">Peso</th>
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
                        <!-- Nueva columna para la acción -->
                        <th class="py-0 px-1">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedData" :key="i">
                        <td class="py-0 px-1" data-label="Nº">{{ currentPage * itemsPerPage + i + 1 }}</td>
                        <td class="p-1" data-label="Sucursal">{{ m.sucursale.nombre }}</td>
                        <td class="py-0 px-1" data-label="Guía">{{ m.guia }}</td>
                        <td class="py-0 px-1" data-label="Guía">{{ m.peso_o }}</td>

                        <td class="py-0 px-1" data-label="Remitente">{{ m.remitente }}</td>
                        <td class="py-0 px-1" data-label="Detalles de Domicilio">{{ m.direccion.direccion_especifica }}</td>
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
                        <td class="py-0 px-1" data-label="Fecha Solicitud">{{ m.fecha_recojo_c }}</td>
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
                        <!-- Botón para abrir el modal de observación -->
                        <td class="py-0 px-1" data-label="Acción">
                          <button @click="openObservationModal(m.id)" class="btn btn-warning btn-sm w-100">
                            <i class="fas fa-undo"></i> Devolver a Origen
                          </button>
                        </td>
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
        </div>

        <!-- Nueva tabla para mostrar los paquetes seleccionados para entregar -->
        <div v-if="selectedForDelivery.length > 0" class="mt-4">
          <div class="card border-rounded">
            <div class="card-header">
              Paquetes para entregar
            </div>
            <div class="card-body p-2">
              <div class="table-responsive">
                <table class="table table-sm table-bordered table-hover">
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
                      <td class="py-0 px-1" data-label="Nº">{{ index + 1 }}</td>
                      <td class="py-0 px-1" data-label="Guía">{{ item.guia }}</td>
                      <td class="py-0 px-1" data-label="Sucursal">{{ item.sucursale.nombre }}</td>
                      <td class="py-0 px-1" data-label="Tarifa">{{ item.tarifa }}</td>
                      <td class="py-0 px-1" data-label="Peso">{{ item.peso_v }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Botón para asignar todos los seleccionados -->
        <div class="row justify-content-end mb-3 mt-3">
          <div class="col-3" v-if="selectedForAssign.length > 0">
            <button @click="confirmAllAssignments" class="btn btn-primary btn-sm w-100">
              <i class="fas fa-truck"></i> Asignar todos los seleccionados
            </button>
          </div>
        </div>
      </div>
    </AdminTemplate>

    <!-- Modal para añadir peso_v -->
    <b-modal v-model="isModalVisible" title="Asignar Peso Correos (Kg)" hide-backdrop hide-footer @shown="focusPesoInput">
      <div v-for="item in selectedItemsData" :key="item.id" class="form-group">
        <label :for="'peso_v-' + item.id">{{ item.guia }} - {{ item.sucursale.nombre }} - {{ item.tarifa }}</label>

        <!-- Campo de entrada con ref para enfoque directo -->
        <label :for="'peso_v-' + item.id" class="mt-2">Peso (Kg)</label>
        <input type="text" :id="'peso_v-' + item.id" v-model="item.peso_v" class="form-control"
          @input="updatePrice(item)" placeholder="000.001" step="0.001" min="0.001" ref="pesoInput" />

        <!-- Campo oculto para nombre_d -->
        <label :for="'nombre_d-' + item.id" class="d-none">Nombre Destinatario</label>
        <input type="text" :id="'nombre_d-' + item.id" v-model="item.nombre_d" class="form-control d-none" readonly />
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-secondary" @click="isModalVisible = false">Cancelar</button>
        <button class="btn btn-primary ml-2" @click="confirmAssignSelected">Asignar</button>
      </div>
    </b-modal>

    <!-- Modal para añadir observación e imagen -->
    <b-modal v-model="isObservationModalVisible" title="Agregar Observación" hide-backdrop hide-footer>
      <div class="form-group">
        <label for="observacion">Observación</label>
        <textarea id="observacion" v-model="observacion" class="form-control" rows="3" placeholder="Ingrese la observación..."></textarea>
      </div>
      <div class="form-group">
        <label for="capturephoto">Subir Foto</label>
        <input type="file" accept="image/*" id="capturephoto" class="form-control-file" @change="handleImageUpload">
        <img v-if="uploadedImage" :src="uploadedImage" class="img-fluid mt-2" />
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-secondary" @click="isObservationModalVisible = false">Cancelar</button>
        <button class="btn btn-primary ml-2" @click="confirmRechazar">Guardar</button>
      </div>
    </b-modal>
  </div>
</template>



<script>
import { BCollapse, BModal } from 'bootstrap-vue';
import Pica from 'pica'; // Importamos Pica para optimizar imágenes

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
      page: 'Enviar Paquetes',
      modulo: 'Enviar Paquetes',
      url_nuevo: '/admin/solicitudesj/solicitudej/nuevo',
      url_editar: '/admin/solicitudescartero/solicitudecartero/editar/',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      tarifas: [], // Inicializamos tarifas como un array vacío
      collapseState: {},
      isModalVisible: false,
      currentId: null,
      selected: {},
      selectedItemsData: [],
      selectedForAssign: [],
      selectedForDelivery: [], // Nueva propiedad para almacenar los paquetes seleccionados para entregar
      user: {
        cartero: []
      },
      currentPage: 0,
      itemsPerPage: 10,
      // Nuevas propiedades para la observación y la imagen
      isObservationModalVisible: false,
      observacion: '',
      uploadedImage: '',
      selectedSolicitudeId: null,
    };
  },
  computed: {
    filteredData() {
      const searchTerm = this.searchTerm.toLowerCase();

      // Asegúrate de que this.user y this.user.user existen
      if (!this.user || !this.user.user || !this.user.user.departamento_cartero) {
        return [];  // Retornar un array vacío si no existe el departamento_cartero
      }

      const departamentoCartero = this.user.user.departamento_cartero;

      const filtered = this.list
        .filter(item => 
          item.estado === 5 && 
          item.sucursale.origen === departamentoCartero &&
          Object.values(item).some(value => 
            String(value).toLowerCase().includes(searchTerm)
          )
        )
        .sort((a, b) => {
          return new Date(b.fecha_recojo_c) - new Date(a.fecha_recojo_c);
        });

      return filtered;
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
      this.$refs.pesoInput[0].focus(); // Asegúrate de que el campo de entrada esté enfocado
    },
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    // Método para manejar la carga de imágenes
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    // Método para abrir el modal de observación
    openObservationModal(id) {
      this.selectedSolicitudeId = id;
      this.isObservationModalVisible = true;
    },
    // Método para confirmar el rechazo y enviar los datos al servidor
    async confirmRechazar() {
      this.load = true;

      try {
        const originalImage = this.uploadedImage;
        const optimizedImage = await this.optimizeImage(originalImage);
        const formattedDate = this.getFormattedDate();

        await this.$api.$put(`rechazado/${this.selectedSolicitudeId}`, {
          observacion: this.observacion,
          fecha_d: formattedDate,
          imagen: optimizedImage,
          imagen_original: originalImage,
        });

        await this.GET_DATA(this.apiUrl);
        this.showSuccessMessage();
        this.resetForm();
      } catch (e) {
        console.error(e);
        this.showErrorMessage();
      } finally {
        this.load = false;
      }
    },
    // Método para optimizar la imagen
    async optimizeImage(imageDataUrl) {
      const pica = Pica();
      const img = new Image();
      img.src = imageDataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = 750;
      canvas.height = img.height * (750 / img.width);

      await pica.resize(img, canvas);
      const optimizedImageDataUrl = canvas.toDataURL('image/webp', 0.3);
      return optimizedImageDataUrl;
    },
    // Método para obtener la fecha formateada
    getFormattedDate() {
      const now = new Date();
      const options = { timeZone: 'America/La_Paz' };
      return now.toLocaleDateString('es-ES', options) + ' ' + now.toLocaleTimeString('es-ES', options);
    },
    // Mostrar mensaje de éxito
    showSuccessMessage() {
      this.$swal.fire({
        icon: 'success',
        title: 'Solicitud ha sido Retornada',
        text: 'La solicitud ha sido marcada como "Devuelta a destino" con la observación.',
      });
    },
    // Mostrar mensaje de error
    showErrorMessage() {
      this.$swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al devolver la solicitud a destino.',
      });
    },
    // Resetear el formulario
    resetForm() {
      this.isObservationModalVisible = false;
      this.observacion = '';
      this.uploadedImage = '';
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
    getTarifaLabel(tarifa_id) {
      if (!this.tarifas || this.tarifas.length === 0) {
        return 'Tarifas no cargadas';
      }
      const tarifa = this.tarifas.find(t => t.id === tarifa_id);
      if (!tarifa) {
        console.error(`Tarifa con ID ${tarifa_id} no encontrada.`);
        return 'Tarifa no encontrada';
      }
      return tarifa.departamento;
    },
    calculatePrice(tarifa_id, peso_v) {
      const tarifa = this.tarifas.find(t => t.id === tarifa_id);
      if (tarifa) {
        const basePrice = tarifa.precio ? parseFloat(tarifa.precio) : 0;
        const extraPrice = tarifa.precio_extra ? parseFloat(tarifa.precio_extra) : 0;
        const peso = parseFloat(peso_v);
        if (isNaN(peso)) {
          return ''; // No mostrar nada si el peso está vacío
        }
        if (peso > 1) {
          const pesoAdicional = Math.ceil(peso - 1); // Redondea hacia arriba para cada 1.01, 2.01, etc.
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
      item.nombre_d = item.precio; // Actualiza nombre_d con el precio calculado
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
    openAssignModal() {
      this.selectedItemsData = this.list.filter(item => this.selected[item.id]).map(item => {
        const precio = this.calculatePrice(item.tarifa_id, item.peso_v);
        return {
          id: item.id,
          guia: item.guia,
          sucursale: item.sucursale,
          peso_v: item.peso_v !== undefined && item.peso_v !== null && item.peso_v !== 0 ? item.peso_v : '', // Asegúrate de que peso_v esté vacío inicialmente
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
        const item = filteredItems[0]; // Seleccionar el primer elemento filtrado
        this.selectedItemsData = [{
          id: item.id,
          guia: item.guia,
          sucursale: item.sucursale,
          peso_v: item.peso_v || 0,
          tarifa_id: item.tarifa_id,
          tarifa: this.getTarifaLabel(item.tarifa_id), // Añadir la tarifa al objeto
          precio: this.calculatePrice(item.tarifa_id, item.peso_v) // Calcular el precio inicial
        }];
        this.isModalVisible = true;
      }
    },
    confirmAssignSelected() {
      this.selectedForAssign = [...this.selectedForAssign, ...this.selectedItemsData.map(item => {
        // Validación final
        let peso = parseFloat(item.peso_v);
        if (isNaN(peso) || peso < 0.001) {
          peso = 0.001;
        } else if (peso > 25.000) {
          peso = 25.000;
        }
        item.peso_v = peso.toFixed(3); // Ajustar y formatear el valor
        item.nombre_d = item.precio; // Asegúrate de que nombre_d tenga el mismo valor que precio
        return item;
      })];
      
      // Actualizar la lista de paquetes para entregar
      this.selectedForDelivery = [...this.selectedForAssign];
      
      // Remover los elementos seleccionados de la lista original (tabla de arriba)
      this.list = this.list.filter(item => !this.selectedForAssign.some(selectedItem => selectedItem.id === item.id));
    
      this.isModalVisible = false;
      this.selected = {}; // Limpiar la selección después de asignar
    
      // Limpiar el campo de búsqueda
      this.searchTerm = '';
    },
    async confirmAllAssignments() {
      this.load = true;
      try {
        const carteroId = this.user.user.id;
        for (let item of this.selectedForAssign) {
          await this.$api.$put(`solicitudesentrega/${item.id}`, {
            cartero_entrega_id: carteroId,
            peso_v: item.peso_v,
            precio: item.precio,
            nombre_d: item.nombre_d // Incluir nombre_d en el envío
          });
        }
        await this.GET_DATA(this.apiUrl); // Forzar actualización de la lista
        this.$swal.fire({
          icon: 'success',
          title: 'Carteros asignados',
          text: 'Todos los carteros seleccionados han sido asignados.',
        });
        this.selectedForAssign = []; // Limpiar la selección después de asignar
        this.selectedForDelivery = []; // Limpiar la lista de paquetes para entregar después de asignar
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
        
        if (this.user.user.departamento_cartero) {
          // Lógica adicional si es necesario
        } else {
          // Lógica adicional si es necesario
        }
      } else {
        // Manejar el caso en que no hay usuario
      }
  
      try {
        const data = await this.GET_DATA(this.apiUrl);
        if (Array.isArray(data)) {
          this.list = data;
        } else {
          // Manejar el caso en que los datos no son un array
        }
        
        // Obtener tarifas para los nombres de tarifa
        const tarifas = await this.GET_DATA('getTarifas');
        if (Array.isArray(tarifas)) {
          this.tarifas = tarifas;
        } else {
          // Manejar el caso en que las tarifas no son un array
        }
      } catch (e) {
        // Manejar errores en la obtención de datos
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

.card-header {
  background-color: #34447C;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
}

/* Estilos generales de la tabla */
.table-responsive {
  max-width: 100%;
  overflow-x: auto !important; /* Asegura el scroll horizontal */
  white-space: nowrap; /* Mantiene el texto en una línea */
}

.table {
  width: 100%;
  table-layout: auto;
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

/* Estilos para los botones */
.btn-primary {
  background-color: #34447C;
  border-color: #34447C;
}

.btn-primary:hover {
  background-color: #4a5a7a;
}

.btn {
  width: 100%;
  margin-bottom: 5px;
  font-size: 14px;
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

/* Para pantallas pequeñas (móviles) */
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
    border: none;
    border-bottom: 1px solid #ddd;
  }

  .table td::before {
    content: attr(data-label);
    flex: 1;
    font-weight: bold;
    color: #34447C;
    text-align: left;
    padding-right: 5px;
    font-size: 14px;
  }

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
.search-input-container {
  position: relative;
}
/* Contenedor de la búsqueda */
.search-input-container {
  position: relative;
}

/* Ajustes para el input */
.search-input {
  background-color: transparent;
  border: 1px solid #ccc;
  padding-right: 35px; /* Espacio para el ícono dentro del input */
}

/* Estilos para el ícono de lupa */
.search-icon {
  position: absolute;
  top: 50%;
  right: 10px; /* Ajusta la posición del ícono dentro del campo */
  transform: translateY(-50%);
  cursor: pointer;
  color: #34447C;
  font-size: 1.2rem;
}

.search-icon:hover {
  color: #6c7a89;
}

</style>

