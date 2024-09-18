<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-12 col-md-3">
            <select v-model="selectedSucursal" class="form-control" @change="handleSucursalChange">
              <option value="">Todas las Sucursales</option>
              <option v-for="sucursal in uniqueSucursalesInTable" :key="sucursal.id" :value="sucursal.id">
                {{ sucursal.nombre }}
              </option>
            </select>
          </div>
          <div class="col-3" v-if="hasSelectedItems">
            <button @click="openAssignModal" class="btn btn-primary btn-sm w-100">
              <i class="fas fa-truck"></i> Asignar todos los seleccionados
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
                EN CAMINO
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
                        <th class="py-0 px-1">Observación</th>
                        <th class="py-0 px-1">Imagen</th>
                        <th class="py-0 px-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedData" :key="i">
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
                        <td class="py-0 px-1" data-label="Fecha Solicitud">{{ m.fecha_recojo_c }}</td>
                        <td class="py-0 px-1" data-label="Observación">{{ m.observacion }}</td>
                        <td class="py-0 px-1" data-label="Imagen">
                          <div class="d-flex flex-column align-items-center">
                            <button v-if="m.imagen" @click="downloadImage(m.imagen)"
                              class="btn btn-sm btn-primary mt-1 align-self-start">
                              Descargar
                            </button>
                          </div>
                        </td>
                        <td class="py-0 px-1">
                          <button @click="openObservationModal(m.id)" class="btn btn-warning btn-sm">
                            <i class="fas fa-undo"></i> Devolver a destino
                          </button>
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
                  <button class="page-link" @click="previousPage" :disabled="currentPage === 0">
                    <</button>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page"
                  :class="{ active: currentPage === page - 1 }">
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

    <b-modal v-model="isObservationModalVisible" title="Agregar Observación" @shown="initializeSignaturePad" hide-backdrop hide-footer>
  <div class="form-group">
    <label for="capturephoto">Subir Foto</label>
    <input type="file" accept="image/*" id="capturephoto" class="form-control-file" @change="handleImageUpload">
    <img v-if="uploadedImage" :src="uploadedImage" class="img-fluid mt-2" />
  </div>
  
  <!-- Firma del Operador -->
  <div class="form-group">
    <label for="firma_o">Firma Operador</label>
    <input type="text" v-model.trim="model.firma_o" class="form-control d-none" id="firma_o">
    <div class="position-relative">
      <canvas id="canvas_firma_o" class="border border-2 rounded-3 bg-white" width="350px" height="250px"></canvas>
      <div class="btn-canvas">
        <button type="button" id="guardar_firma_o" class="btn btn-primary">Guardar</button>
        <button type="button" id="limpiar_firma_o" class="btn btn-secondary">Limpiar</button>
      </div>
    </div>
  </div>

  <div class="d-flex justify-content-end">
    <button class="btn btn-secondary" @click="isObservationModalVisible = false">Cancelar</button>
    <button class="btn btn-primary ml-2" @click="confirmRechazar">Guardar</button>
  </div>
</b-modal>


   
  </div>
</template>


<script>
import Pica from 'pica'; // Importa Pica para redimensionar y comprimir imágenes
import { BCollapse, BModal } from 'bootstrap-vue';
import SignaturePad from 'signature_pad';
import Swal from 'sweetalert2';

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
      sucursales: [], // Almacena la lista de sucursales
      selectedSucursal: '', // Almacena la sucursal seleccionada
      apiUrl: 'solicitudes',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/admin/solicitudesj/solicitudej/nuevo',
      url_editar: '/admin/cartero/editar/',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      collapseState: {},
      isModalVisible: false,
      currentId: null,
      selected: {},
      selectedItemsData: [],
      user: {},
      currentPage: 0,
      itemsPerPage: 10,
      isObservationModalVisible: false,
      observacion: '',
      uploadedImage: '', // Añadido para manejar la imagen subida
      model: {
      firma_o: '',  // Firma del operador
      firma_d: '',  // Firma del destinatario
      observacion: '',
      imagen: '', // Para la imagen subida
      fecha_devolucion: '', // Agrega esta si también la usas
      user: {
        cartero: []
      },
    },
    };
  },
  computed: {
    filteredData() {
      const searchTerm = this.searchTerm.toLowerCase();
      return this.list.filter(item => {
        // Filtrar por estado (6 o 13)
        const isCorrectState = item.estado === 6 || item.estado === 13;

        // Filtrar por término de búsqueda
        const matchesSearchTerm = Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm)
        );

        // Filtrar por sucursal seleccionada (si hay alguna seleccionada)
        const matchesSucursal = this.selectedSucursal
          ? item.sucursale.id === this.selectedSucursal
          : true; // Si no hay sucursal seleccionada, mostrar todas

        return isCorrectState && matchesSearchTerm && matchesSucursal;
      });
    },

    uniqueSucursalesInTable() {
      const sucursalIds = new Set();
      const uniqueSucursales = [];

      this.list.forEach(item => {
        if (item.sucursale && !sucursalIds.has(item.sucursale.id)) {
          sucursalIds.add(item.sucursale.id);
          uniqueSucursales.push(item.sucursale);
        }
      });

      return uniqueSucursales;
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
    initializeSignaturePad() {
    const canvasFirmaO = document.getElementById('canvas_firma_o');
    
    if (canvasFirmaO) {
      const signaturePadFirmaO = new SignaturePad(canvasFirmaO);
      const clearButtonFirmaO = document.getElementById('limpiar_firma_o');
      const generateButtonFirmaO = document.getElementById('guardar_firma_o');

      clearButtonFirmaO.addEventListener('click', () => {
        signaturePadFirmaO.clear();
        this.model.firma_o = "";
      });

      generateButtonFirmaO.addEventListener('click', () => {
        const firmaO = signaturePadFirmaO.toDataURL();
        this.model.firma_o = firmaO;
        
        // Verificar si la firma fue capturada correctamente
        if (this.model.firma_o) {
          // Mostrar mensaje de éxito con SweetAlert
          Swal.fire({
            icon: 'success',
            title: 'Firma registrada',
            text: 'Firma del operador registrada exitosamente.'
          });
        } else {
          // Mostrar mensaje de error si no hay firma
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo registrar la firma. Inténtalo de nuevo.'
          });
        }
      });
    } else {
      console.error("Canvas para firma del operador no encontrado.");
    }
  },
    handleSucursalChange() {
      this.currentPage = 0; // Reiniciar la paginación cuando se selecciona una nueva sucursal
    },
      async confirmRechazar() {
    this.load = true;

    try {
      const optimizedImage = await this.optimizeImage(this.uploadedImage);
      const formattedDate = this.getFormattedDate();
      const carteroId = this.user.user.id;

      await this.$api.$put(`devolucion/${this.selectedSolicitudeId}`, {
        fecha_devolucion: formattedDate,
        observacion: this.observacion,
        imagen_devolucion: optimizedImage,
        cartero_entrega_id: carteroId,
        firma_o: this.model.firma_o // Incluye la firma del operador
      });

      this.showSuccessMessage();
      this.resetForm();
    } catch (e) {
      console.error(e);
      this.showErrorMessage();
    } finally {
      this.load = false;
    }
  }
  ,

    async optimizeImage(imageDataUrl) {
      const pica = Pica();
      const img = new Image();
      img.src = imageDataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const MAX_WIDTH = 1000;
      const MAX_HEIGHT = 1000;

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const optimizedImageDataUrl = canvas.toDataURL('image/webp', 0.4); // Convertir a WebP con calidad 70%
      return optimizedImageDataUrl;
    },

    getFormattedDate() {
      const now = new Date();
      const options = { timeZone: 'America/La_Paz' };
      return now.toLocaleDateString('es-ES', options) + ' ' + now.toLocaleTimeString('es-ES', options);
    },

    showSuccessMessage() {
      this.$swal.fire({
        icon: 'success',
        title: 'Solicitud ha sido Retornada',
        text: `La solicitud ha sido marcada como 'Devuelta a destino' con la observación.`,
      });
    },

    showErrorMessage() {
      this.$swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al devolver la solicitud a destino.',
      });
    },

    resetForm() {
      this.isObservationModalVisible = false;
      this.observacion = '';
      this.uploadedImage = '';
    },

    generateThumbnail(base64Image) {
      const img = new Image();
      img.src = base64Image;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const MAX_WIDTH = 100;
      const MAX_HEIGHT = 100;

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      return canvas.toDataURL('image/jpeg', 0.7);
    },

    downloadImage(base64Image) {
      const link = document.createElement('a');
      link.href = base64Image;
      link.download = 'imagen_capturada.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

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

    openObservationModal(id) {
      this.selectedSolicitudeId = id;
      this.isObservationModalVisible = true;
    },

    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },

    async markAsEnCamino(solicitudeId) {
      this.load = true;
      try {
        const carteroId = this.user.user.id;
        await this.$api.$put(`solicitudesrecojo/${solicitudeId}`, { cartero_recogida_id: carteroId });
        await this.GET_DATA(this.apiUrl);
        this.$swal.fire({
          icon: 'success',
          title: 'Cartero asignado',
          text: `La solicitud ${solicitudeId} ha sido marcada como 'En camino'.`,
        });
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
      this.list = Array.isArray(res) ? res : [];
    },

    async EliminarItem(id) {
      this.load = true;
      try {
        await this.$api.$delete(this.apiUrl + '/' + id);
        await this.GET_DATA(this.apiUrl);
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
        const carteroId = this.user.user.id;
        const item = this.list.find(m => m.id === id);
        if (item) {
          await this.$api.$put(`solicitudesentrega/${id}`, { cartero_entrega_id: carteroId, peso_v: item.peso_v });
          await this.GET_DATA(this.apiUrl);
        }
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
          if (item && item.id) {
            await this.$api.$put(`solicitudesentrega/${item.id}`, { cartero_entrega_id: carteroId, peso_v: item.peso_v });
          } else {
            console.error('Item inválido:', item);
          }
        }
        await this.GET_DATA(this.apiUrl);
        this.$swal.fire({
          icon: 'success',
          title: 'Carteros asignados',
          text: 'Todos los carteros seleccionados han sido asignados.',
        });
        this.isModalVisible = false;
        this.selected = {};
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
      this.user = JSON.parse(user);    try {
      await this.GET_DATA(this.apiUrl);
    } catch (e) {
      console.error(e);
    } finally {
      this.load = false;
    }

    // Código relacionado con la firma (sin cambios)
    var canvas2 = document.getElementById('canvas2');
    var signaturePad2 = new SignaturePad(canvas2);
    var clearButton2 = document.getElementById('limpiar2');
    var generateButton2 = document.getElementById('guardar2');

    clearButton2.addEventListener('click', () => {
      signaturePad2.clear();
      this.model.firma_d = "";
    });

    generateButton2.addEventListener('click', () => {
      var firma2 = signaturePad2.toDataURL();
      this.model.firma_d = firma2;
      Swal.fire({
        icon: 'success',
        title: 'Firma registrada',
        text: 'Firma registrada exitosamente.'
      });
    });

    // Manejo de la captura de foto con límite de tamaño muy bajo
    var fileInput = document.getElementById('capturephoto');

    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Definir una resolución baja
            const maxWidth = 1750; // Ancho máximo
            const maxHeight = 1750; // Alto máximo

            let width = img.width;
            let height = img.height;

            // Escalar la imagen a las dimensiones más pequeñas posibles
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Comprimir la imagen en formato WebP lo máximo posible
            let quality = 0.4; // Calidad baja
            let dataurl = canvas.toDataURL('image/webp', quality);

            // Intentar reducir el tamaño por debajo de 1 KB
            while (dataurl.length > 100000 && quality > 0.01) {
              quality -= 0.01;
              dataurl = canvas.toDataURL('image/webp', quality);
            }

            this.model.imagen = dataurl; // Guardar la imagen comprimida en el modelo

            // Mostrar alerta cuando se sube una foto
            Swal.fire({
              icon: 'success',
              title: 'Foto registrada',
              text: 'La foto se ha subido exitosamente.'
            });
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
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
  overflow-x: auto;
}

.table {
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

/* Responsive styles */
@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
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
