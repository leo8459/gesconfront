<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-12 col-md-4">
            <input
              v-model.trim="searchTerm"
              type="text"
              class="form-control"
              placeholder="Buscar por guía, destinatario o sucursal..."
            />
          </div>
        </div>

        <div class="card border-rounded">
          <div class="card-header">Dar De Baja Paquetes</div>
          <div class="card-body p-2">
            <div class="table-responsive">
              <table class="table table-sm table-bordered table-hover">
                <thead>
                  <tr>
                    <th class="py-0 px-1">#</th>
                    <th class="py-0 px-1">Sucursal</th>
                    <th class="py-0 px-1">Guía</th>
                    <th class="py-0 px-1">Destinatario</th>
                    <th class="py-0 px-1">Teléfono</th>
                    <th class="py-0 px-1">Dirección</th>
                    <th class="py-0 px-1">Provincia</th>
                    <th class="py-0 px-1">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in paginatedData" :key="item?.id ?? index">
                    <td class="py-0 px-1">{{ currentPage * itemsPerPage + index + 1 }}</td>
                    <td class="py-0 px-1">{{ item?.sucursale?.nombre ?? 'SIN SUCURSAL' }}</td>
                    <td class="py-0 px-1">{{ item?.guia ?? '-' }}</td>
                    <td class="py-0 px-1">{{ item?.destinatario ?? '-' }}</td>
                    <td class="py-0 px-1">{{ item?.telefono_d ?? '-' }}</td>
                    <td class="py-0 px-1">{{ item?.direccion_especifica_d ?? item?.direccion_d ?? '-' }}</td>
                    <td class="py-0 px-1">{{ item?.ciudad ?? '-' }}</td>
                    <td class="py-0 px-1">
                      <button class="btn btn-danger btn-sm w-100" @click="openDarBajaModal(item)">
                        Dar baja
                      </button>
                    </td>
                  </tr>
                  <tr v-if="!paginatedData.length">
                    <td colspan="8" class="text-center">No hay paquetes asignados para dar de baja.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <nav aria-label="Page navigation" v-if="totalPages > 1">
              <ul class="pagination justify-content-between">
                <li class="page-item" :class="{ disabled: currentPage === 0 }">
                  <button class="page-link" @click="previousPage" :disabled="currentPage === 0">
                    <
                  </button>
                </li>
                <li
                  class="page-item"
                  v-for="pageNumber in totalPages"
                  :key="pageNumber"
                  :class="{ active: currentPage === pageNumber - 1 }"
                >
                  <button class="page-link" @click="goToPage(pageNumber - 1)">
                    {{ pageNumber }}
                  </button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                  <button class="page-link" @click="nextPage" :disabled="currentPage >= totalPages - 1">
                    >
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </AdminTemplate>

    <b-modal v-model="isDarBajaModalVisible" title="Dar de baja paquete" hide-backdrop hide-footer>
      <div v-if="selectedPackage">
        <div class="form-group">
          <label>Código del paquete</label>
          <input class="form-control" :value="selectedPackage?.guia ?? '-'" disabled>
        </div>
        <div class="form-group">
          <label>Recibido por</label>
          <input
            v-model.trim="darBajaForm.recibidoPor"
            class="form-control"
            type="text"
            placeholder="Nombre de quien recibe"
          >
        </div>
        <div class="form-group">
          <label>Foto</label>
          <input
            type="file"
            accept="image/*"
            class="form-control-file"
            @change="handleImageUpload"
          >
          <img v-if="darBajaForm.imagen" :src="darBajaForm.imagen" class="img-fluid mt-2 preview-image" />
        </div>
        <div class="form-group">
          <label>Observación</label>
          <textarea
            v-model.trim="darBajaForm.observacion"
            class="form-control"
            rows="3"
            placeholder="Observación opcional"
          ></textarea>
        </div>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-secondary" @click="closeDarBajaModal">Cancelar</button>
        <button class="btn btn-danger ml-2" @click="submitDarBaja">Confirmar baja</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { BModal } from 'bootstrap-vue';

export default {
  name: 'DarBajaPaqueteCarteroPage',
  components: {
    BModal,
  },
  data() {
    return {
      load: true,
      list: [],
      searchTerm: '',
      page: 'Dar de baja paquetes',
      modulo: 'Dar de baja paquetes',
      currentPage: 0,
      itemsPerPage: 10,
      user: {},
      isDarBajaModalVisible: false,
      selectedPackage: null,
      darBajaForm: {
        recibidoPor: '',
        observacion: '',
        imagen: '',
      },
    };
  },
  computed: {
    filteredData() {
      const term = String(this.searchTerm || '').toLowerCase();
      const userId = Number(this.user?.user?.id || 0);

      return (this.list || [])
        .filter((item) => {
          const carteroEntregaId = Number(item?.cartero_entrega_id ?? item?.cartero_entrega?.id ?? 0);
          const mismaAsignacion = carteroEntregaId === userId;
          const estadoActual = Number(item?.estado ?? 0);
          const estadoVisible = ![3, 4].includes(estadoActual);
          const matchesSearch =
            String(item?.guia ?? '').toLowerCase().includes(term) ||
            String(item?.destinatario ?? '').toLowerCase().includes(term) ||
            String(item?.sucursale?.nombre ?? '').toLowerCase().includes(term) ||
            String(item?.direccion_especifica_d ?? '').toLowerCase().includes(term);

          return mismaAsignacion && estadoVisible && matchesSearch;
        })
        .sort((a, b) => Number(b?.id || 0) - Number(a?.id || 0));
    },
    paginatedData() {
      const start = this.currentPage * this.itemsPerPage;
      return this.filteredData.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$api.$get(path);
      return Array.isArray(res) ? res : [];
    },
    openDarBajaModal(item) {
      this.selectedPackage = item;
      this.darBajaForm = {
        recibidoPor: item?.nombre_d ?? '',
        observacion: item?.observacion ?? '',
        imagen: '',
      };
      this.isDarBajaModalVisible = true;
    },
    closeDarBajaModal() {
      this.isDarBajaModalVisible = false;
      this.selectedPackage = null;
      this.darBajaForm = {
        recibidoPor: '',
        observacion: '',
        imagen: '',
      };
    },
    handleImageUpload(event) {
      const file = event?.target?.files?.[0];
      if (!file) {
        this.darBajaForm.imagen = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.darBajaForm.imagen = e?.target?.result || '';
      };
      reader.readAsDataURL(file);
    },
    async optimizeImage(imageDataUrl) {
      if (!imageDataUrl) {
        return null;
      }

      const img = new Image();
      img.src = imageDataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const maxWidth = 1600;
      const maxHeight = 1600;

      let width = img.width;
      let height = img.height;

      if (width > height && width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      } else if (height >= width && height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      return canvas.toDataURL('image/webp', 0.45);
    },
    getFormattedDate() {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    },
    async submitDarBaja() {
      if (!this.selectedPackage?.id) {
        this.$swal.fire('Paquete inválido', 'No se encontró el paquete seleccionado.', 'error');
        return;
      }

      if (!this.darBajaForm.recibidoPor) {
        this.$swal.fire('Recibido por requerido', 'Debe indicar quién recibió el paquete.', 'warning');
        return;
      }

      if (!this.darBajaForm.imagen) {
        this.$swal.fire('Foto requerida', 'Debe subir una foto para dar de baja el paquete.', 'warning');
        return;
      }

      this.load = true;
      try {
        const optimizedImage = await this.optimizeImage(this.darBajaForm.imagen);
        const payload = {
          estado: 3,
          fecha_d: this.getFormattedDate(),
          nombre_d: this.darBajaForm.recibidoPor,
          observacion: this.darBajaForm.observacion || null,
          imagen: optimizedImage,
        };

        await this.$api.$put(`solicitudes/${this.selectedPackage.id}`, payload);
        this.list = await this.GET_DATA('solicitudes');
        this.$swal.fire('Paquete dado de baja', `Código: ${this.selectedPackage?.guia ?? '-'}`, 'success');
        this.closeDarBajaModal();
      } catch (e) {
        console.error('Error al dar de baja el paquete:', e);
        this.$swal.fire(
          'Error al dar de baja',
          e?.response?.data?.message || e?.response?.data?.error || 'No se pudo dar de baja el paquete.',
          'error'
        );
      } finally {
        this.load = false;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage += 1;
      }
    },
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage -= 1;
      }
    },
    goToPage(pageNumber) {
      this.currentPage = pageNumber;
    },
  },
  mounted() {
    this.$nextTick(async () => {
      const rawUser = localStorage.getItem('userAuth');
      this.user = rawUser ? JSON.parse(rawUser) : {};

      try {
        this.list = await this.GET_DATA('solicitudes');
      } catch (e) {
        console.error('Error al cargar paquetes asignados:', e);
        this.$swal.fire('Error', 'No se pudieron cargar los paquetes asignados.', 'error');
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

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}

.preview-image {
  max-height: 220px;
  object-fit: contain;
}
</style>
