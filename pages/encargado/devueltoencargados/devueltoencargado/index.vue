<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">

        </div>
        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                DEVUELTOS
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>
                        <th class="py-0 px-1">Guía</th>
                        <th class="py-0 px-1">Observación</th>
                        <th class="py-0 px-1">Foto</th>
                        <th class="py-0 px-1">Fecha devolucion</th>
                        <th class="py-0 px-1">Foto</th>

                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedList" :key="m?.id ?? i">
                        <td class="py-0 px-1">
                          {{ (currentPage - 1) * itemsPerPage + i + 1 }}
                        </td>

                        <td class="p-1">
                          {{ m?.sucursale?.nombre ?? 'SIN SUCURSAL' }}
                        </td>

                        <td class="py-0 px-1">
                          {{ m?.guia ?? '-' }}
                        </td>

                        <td class="py-0 px-1">
                          {{ m?.observacion ?? '-' }}
                        </td>

                        <!-- Foto (imagen original) -->
                        <td class="py-0 px-1">
                          <div class="d-flex flex-column align-items-center">
                            <button v-if="m?.imagen" @click="downloadImage(m.imagen)"
                              class="btn btn-sm btn-primary mt-1 align-self-start">
                              Descargar
                            </button>
                            <span v-else>-</span>
                          </div>
                        </td>

                        <td class="py-0 px-1">
                          {{ m?.fecha_devolucion ?? '-' }}
                        </td>

                        <!-- Foto (imagen devolucion) -->
                        <td class="py-0 px-1">
                          <div class="d-flex flex-column align-items-center">
                            <button v-if="m?.imagen_devolucion" @click="downloadImage(m.imagen_devolucion)"
                              class="btn btn-sm btn-primary mt-1 align-self-start">
                              Descargar
                            </button>
                            <span v-else>-</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>

                  </table>
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
                      <button class="page-link" @click="nextPage"
                        :disabled="currentPage >= totalPages">&gt;</button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>
  </div>
</template>

<script>
import { BCollapse } from 'bootstrap-vue';

export default {
  name: "IndexPage",
  components: {
    BCollapse
  },
  data() {
    return {
      load: true,
      list: [],
      apiUrl: 'solicitudes-devuelto',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/sucursal/sucursales/sucursal/nuevo',
      url_editar: '/sucursal/sucursales/sucursal/editar/',
      user: {
        sucursale: []
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
    sortedList() {
      return this.filteredData;
    },
    paginatedList() {
      return this.sortedList;
    },
    totalPages() {
      return Number(this.pagination?.last_page || 1);
    }
  },
  methods: {
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
    buildListPath(page = this.currentPage) {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('per_page', this.itemsPerPage);
      return `${this.apiUrl}?${params.toString()}`;
    },
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

    async GET_DATA(path) {
      const res = await this.$encargados.$get(path);
      return res;
    },
    async fetchList(page = this.currentPage) {
      const payload = await this.GET_DATA(this.buildListPath(page));
      this.list = this.normalizeArrayPayload(payload);
      this.applyPaginationPayload(payload);
      return this.list;
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$encargados.$delete(this.apiUrl + '/' + id);
        await this.fetchList();
      } catch (e) {
        console.log(e);
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
          const item = this.list.find(m => m.id === id);
          if (item) {
            item.estado = 3; // Cambiar estado a 3 (Entregado)
            await this.$encargados.$put(this.apiUrl + '/' + id, item);
          await this.fetchList();
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },
    getEstadoLabel(estado) {
      switch (estado) {
        case '1':
          return 'Solicitudes';
        case '2':
          return 'En camino';
        case '3':
          return 'Entregados';
        case '5':
          return 'Pendientes';
        case '0':
          return 'Cancelados';
        default:
          return 'Otro estado';
      }
    },
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
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
