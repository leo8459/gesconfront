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
          <div class="col-12 col-md-3 search-input-container">
      <input v-model="searchTerm" @keypress.enter="handleSearchEnter" type="text" class="form-control search-input" placeholder="Buscar..." />
    </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                En Camino
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
                        <th class="py-0 px-1">Teléfono</th>
                        <th class="py-0 px-1">Contenido</th>
                        <th class="py-0 px-1">Destinatario</th>
                        <th class="py-0 px-1">Teléfono Destinatario</th>
                        <th class="py-0 px-1">Dirección Destinatario Maps</th>
                        <th class="py-0 px-1">Dirección Destinatario</th>
                        <th class="py-0 px-1">Municipio/Provincia</th>
                        <th class="py-0 px-1">Zona Destinatario</th>
                        <th class="py-0 px-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedData" :key="i">
                        <td class="py-0 px-1" data-label="Nº">{{ currentPage * itemsPerPage + i + 1 }}</td>
                        <td class="py-0 px-1" data-label="Sucursal">{{ m.sucursale.nombre }}</td>
                        <td class="py-0 px-1" data-label="Guía">{{ m.guia }}</td>
                        <td class="py-0 px-1" data-label="Remitente">{{ m.remitente }}</td>
                        <td class="py-0 px-1" data-label="Teléfono">{{ m.telefono }}</td>
                        <td class="py-0 px-1" data-label="Contenido">{{ m.contenido }}</td>
                        <td class="py-0 px-1" data-label="Destinatario">{{ m.destinatario }}</td>
                        <td class="py-0 px-1" data-label="Teléfono Destinatario">{{ m.telefono_d }}</td>
                        <td class="py-0 px-1" data-label="Dirección Destinatario Maps">
                          <a v-if="isCoordinates(m.direccion_d)" :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d" target="_blank" class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ m.direccion_d }}</span>
                        </td>
                        <td class="py-0 px-1" data-label="Dirección">{{ m.direccion_especifica_d }}</td>
                        <td class="py-0 px-1" data-label="Municipio/Provincia">{{ m.ciudad }}</td>
                        <td class="py-0 px-1" data-label="Zona">{{ m.zona_d }}</td>
                        <td class="py-0 px-1" data-label="Acción">
                          <div class="btn-group">
                            <nuxtLink :to="url_editar + m.id" class="btn btn-info btn-sm py-1 px-2 w-100">
                              <i class="fas fa-ban"></i> Entregar Correspondencia
                            </nuxtLink>
                          </div>
                        </td>
                        <td class="py-0 px-1" data-label="Devolver">
                          <button @click="openObservationModal(m.id)" class="btn btn-warning btn-sm w-100">
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
    
    <!-- Modal para añadir observación -->
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

    <!-- Modal para añadir peso_v -->
    <b-modal v-model="isModalVisible" title="Asignar Peso Correos (Kg)" hide-backdrop hide-footer>
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
import Pica from 'pica';
import heic2any from "heic2any";

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
      uploadedImage: '',
    };
  },
  computed: {
    filteredData() {
      const searchTerm = this.searchTerm.toLowerCase();
      return this.list.filter(item =>
        item.estado === 2 && 
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
    async handleImageUpload(event) {
    const file = event.target.files[0];
    
    if (file) {
      // Verifica si el archivo es HEIC
      if (file.type === 'image/heic' || file.type === 'image/heif') {
        try {
          // Convierte HEIC a JPEG o PNG
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg', // Puedes usar 'image/png' si prefieres PNG
          });
          
          // Usa FileReader para mostrar la imagen convertida
          const reader = new FileReader();
          reader.onload = (e) => {
            this.uploadedImage = e.target.result;
          };
          reader.readAsDataURL(convertedBlob);
        } catch (error) {
          console.error("Error al convertir imagen HEIC:", error);
        }
      } else {
        // Si no es HEIC, simplemente procesa la imagen como antes
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  },
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
        await this.GET_DATA(this.apiUrl); 
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
          const response = await this.$api.$put(`solicitudesentrega/${id}`, { cartero_entrega_id: carteroId, peso_v: item.peso_v });
          Object.assign(item, response); 
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
        await this.GET_DATA(this.apiUrl);
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
  .search-input-container {
    width: 100%;
    margin-bottom: 10px;
  }

  .search-input {
    width: 100%;
  }

  .table-responsive {
    overflow-x: scroll;
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
    font-size: 14px;
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

  #observacion {
    width: 100%;
    resize: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }
}

/* Ajustes para pantallas más pequeñas */
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
