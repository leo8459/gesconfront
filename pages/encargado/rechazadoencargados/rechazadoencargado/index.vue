<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-3">
            <input v-model="searchTerm" type="text" class="form-control" placeholder="Buscar..." />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                RECHAZADOS
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>
                        <th class="py-0 px-1">Guía</th>
                        <th class="py-0 px-1">Cartero</th>
                        <th class="py-0 px-1">Observación</th>
                        <th class="py-0 px-1">Foto</th>

                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedData" :key="m?.id ?? i">
                        <!-- # -->
                        <td class="py-0 px-1">
                          {{ (currentPage - 1) * itemsPerPage + i + 1 }}
                        </td>

                        <!-- Sucursal (si es EMS y viene null => EMS GLOBAL) -->
                        <td class="p-1">
                          {{
                            m?.sucursale?.nombre ??
                            (((m?.tipo_correspondencia ?? '') + '').toUpperCase() === 'EMS'
                              ? 'EMS GLOBAL'
                          : 'SIN SUCURSAL')
                          }}
                        </td>

                        <!-- Guía -->
                        <td class="py-0 px-1">
                          {{ m?.guia ?? 'SIN GUÍA' }}
                        </td>

                        <!-- Cartero -->
                        <td class="p-1">
                          {{ m?.cartero_entrega?.nombre ?? 'Por asignar' }}
                        </td>

                        <!-- Observación -->
                        <td class="py-0 px-1">
                          {{ m?.observacion ?? 'SIN OBSERVACIÓN' }}
                        </td>

                        <!-- Foto -->
                        <td class="py-0 px-1">
                          <button v-if="m?.imagen" @click="downloadImage(m.imagen)" class="btn btn-sm btn-primary mt-1">
                            Descargar
                          </button>
                          <span v-else>SIN FOTO</span>
                        </td>
                      </tr>
                    </tbody>

                  </table>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-3">
              <button class="btn btn-secondary" :disabled="currentPage === 1" @click="prevPage">Anterior</button>
              <span>Página {{ (currentPage ?? '-') }} de {{ (totalPages ?? '-') }}</span>
              <button class="btn btn-secondary" :disabled="currentPage === totalPages"
                @click="nextPage">Siguiente</button>
            </div>
            <div class="pagination-controls">
              <ul class="pagination">
                <li :class="['page-item', { active: currentPage === pageNumber }]" v-for="pageNumber in totalPagesArray"
                  :key="pageNumber">
                  <button class="page-link" @click="goToPage(pageNumber)">{{ (pageNumber ?? '-') }}</button>
                </li>
              </ul>
            </div>
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
  data() {
    return {
      load: true,
      list: [],
      searchTerm: '',
      apiUrl: 'solicitudes-rechazado',
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
    totalPagesArray() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    },
    hasSelectedItems() {
      return Object.keys(this.selected).some(key => this.selected[key]);
    }
  },
  methods: {
    generateThumbnail(base64Image) {
      const img = new Image();
      img.src = base64Image;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Ajustar la resolución del thumbnail
      const MAX_WIDTH = 100; // Ajustar según sea necesario
      const MAX_HEIGHT = 100; // Ajustar según sea necesario

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

      // Aquí no es necesario comprimir el thumbnail en exceso si queremos mostrar una imagen más clara
      return canvas.toDataURL('image/jpeg', 0.1);
    },


    downloadImage(base64Image) {
      const link = document.createElement('a');
      link.href = base64Image; // Aquí estás usando la imagen original almacenada
      link.download = 'imagen_capturada.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
    async prevPage() {
      if (this.currentPage > 1) {
        await this.fetchList(this.currentPage - 1);
      }
    },
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        await this.fetchList(this.currentPage + 1);
      }
    },
    async goToPage(pageNumber) {
      await this.fetchList(pageNumber);
    },
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    async GET_DATA(path) {
      try {
        const res = await this.$encargados.$get(path);
        return res;
      } catch (e) {
        throw e;
      }
    },
    async fetchList(page = this.currentPage, searchOverride = null) {
      const payload = await this.GET_DATA(this.buildListPath(page, searchOverride));
      this.list = this.normalizeArrayPayload(payload);
      this.applyPaginationPayload(payload);
      return this.list;
    },








  },
  mounted() {
    this.$nextTick(async () => {
      let user = localStorage.getItem('userAuth');
      if (user) {
        this.user = JSON.parse(user);
        console.log('Usuario cargado:', this.user);
      } else {
        console.error('No se encontró el usuario en el almacenamiento local');
        this.user = { cartero: null };
      }

      try {
        await this.fetchList();
        console.log('Datos cargados:', this.list);
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
