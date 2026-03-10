<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-md-4">
            <input
              v-model="searchTerm"
              type="text"
              class="form-control"
              placeholder="Buscar por codigo, guia, destinatario o justificacion"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                PAQUETES JUSTIFICADOS
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Sucursal</th>
                        <th>Codigo</th>
                        <th>Guia</th>
                        <th>Destinatario</th>
                        <th>Justificacion</th>
                        <th>PDF Justificacion</th>
                        <th>Imagen Justificacion</th>
                        <th>Imagen Devolucion</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedList" :key="m?.id ?? i">
                        <td>{{ currentPage * itemsPerPage + i + 1 }}</td>
                        <td>{{ m?.sucursale?.nombre ?? '-' }}</td>
                        <td>{{ m?.codigo ?? '-' }}</td>
                        <td>{{ m?.guia ?? '-' }}</td>
                        <td>{{ m?.destinatario ?? '-' }}</td>
                        <td>{{ m?.justificacion ?? '-' }}</td>
                        <td>
                          <button
                            v-if="m?.pdf_justificacion"
                            @click="downloadPDF(m.pdf_justificacion, `justificacion-${m?.codigo || m?.guia || m?.id || 'paquete'}.pdf`)"
                            class="btn btn-sm btn-primary"
                          >
                            Descargar
                          </button>
                          <span v-else>Sin PDF</span>
                        </td>
                        <td>
                          <button
                            v-if="m?.imagen_justificacion"
                            @click="downloadImage(m.imagen_justificacion, `justificacion-${m?.codigo || m?.guia || m?.id || 'paquete'}.jpg`)"
                            class="btn btn-sm btn-primary"
                          >
                            Descargar
                          </button>
                          <span v-else>Sin imagen</span>
                        </td>
                        <td>
                          <button
                            v-if="m?.imagen_devolucion"
                            @click="downloadImage(m.imagen_devolucion, `devolucion-${m?.codigo || m?.guia || m?.id || 'paquete'}.jpg`)"
                            class="btn btn-sm btn-primary"
                          >
                            Descargar
                          </button>
                          <span v-else>Sin imagen</span>
                        </td>
                        <td>{{ m?.fecha_d ?? m?.fecha_devolucion ?? m?.fecha ?? '-' }}</td>
                      </tr>
                      <tr v-if="paginatedList.length === 0">
                        <td colspan="10" class="text-center">No hay paquetes justificados para esta sucursal.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <nav aria-label="Page navigation">
                  <ul class="pagination justify-content-between">
                    <li class="page-item" :class="{ disabled: currentPage === 0 }">
                      <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 0">
                        &lt;
                      </button>
                    </li>

                    <li
                      v-for="pageNumber in totalPagesArray"
                      :key="pageNumber"
                      :class="['page-item', { active: pageNumber === currentPage + 1 }]"
                    >
                      <button
                        v-if="pageNumber !== '...'"
                        class="page-link"
                        @click="goToPage(pageNumber - 1)"
                      >
                        {{ pageNumber }}
                      </button>
                      <span v-else class="page-link">...</span>
                    </li>

                    <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                      <button
                        class="page-link"
                        @click="goToPage(currentPage + 1)"
                        :disabled="currentPage >= totalPages - 1"
                      >
                        &gt;
                      </button>
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
  name: 'IndexPage',
  components: {
    BCollapse
  },
  data() {
    return {
      load: true,
      list: [],
      searchTerm: '',
      apiUrl: 'solicitudes2',
      page: 'Paquetes Justificados',
      modulo: 'Paquetes Justificados',
      currentPage: 0,
      itemsPerPage: 10,
      user: {
        sucursale: []
      }
    };
  },
  watch: {
    searchTerm() {
      this.currentPage = 0;
    }
  },
  computed: {
    filteredList() {
      const userId = this.user?.user?.id;
      const term = String(this.searchTerm || '').toLowerCase().trim();

      if (!userId) {
        return [];
      }

      return this.list.filter(item => {
        const belongsToSucursal = item?.sucursale?.id === userId;
        const hasJustification = Boolean(item?.justificacion) && Boolean(item?.imagen_justificacion);

        if (!belongsToSucursal || !hasJustification) {
          return false;
        }

        if (!term) {
          return true;
        }

        return (
          String(item?.codigo ?? '').toLowerCase().includes(term) ||
          String(item?.guia ?? '').toLowerCase().includes(term) ||
          String(item?.destinatario ?? '').toLowerCase().includes(term) ||
          String(item?.justificacion ?? '').toLowerCase().includes(term)
        );
      });
    },
    sortedList() {
      return [...this.filteredList].sort((a, b) => {
        const dateA = new Date(a?.fecha_d || a?.fecha_devolucion || a?.fecha || 0).getTime();
        const dateB = new Date(b?.fecha_d || b?.fecha_devolucion || b?.fecha || 0).getTime();
        return dateB - dateA;
      });
    },
    paginatedList() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.sortedList.length / this.itemsPerPage);
    },
    totalPagesArray() {
      const totalPages = this.totalPages;
      const currentPage = this.currentPage + 1;
      const maxPagesToShow = 3;
      const pages = [];

      for (let i = 1; i <= Math.min(maxPagesToShow, totalPages); i++) {
        pages.push(i);
      }

      if (currentPage > maxPagesToShow + 1) {
        pages.push('...');
      }

      const startPage = Math.max(currentPage - 1, maxPagesToShow + 1);
      const endPage = Math.min(currentPage + 1, totalPages - maxPagesToShow);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - maxPagesToShow) {
        pages.push('...');
      }

      for (let i = Math.max(totalPages - maxPagesToShow + 1, endPage + 1); i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$sucursales.$get(path);
      return res;
    },
    downloadImage(base64Image, fileName = 'imagen.jpg') {
      const link = document.createElement('a');
      link.href = base64Image;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    downloadPDF(pdfDataUrl, fileName = 'justificacion.pdf') {
      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    goToPage(page) {
      if (page >= 0 && page < this.totalPages) {
        this.currentPage = page;
      }
    }
  },
  mounted() {
    this.$nextTick(async () => {
      const userStr = localStorage.getItem('userAuth');
      this.user = userStr ? JSON.parse(userStr) : { user: null };

      try {
        const data = await this.GET_DATA(this.apiUrl);
        this.list = Array.isArray(data) ? data : [];
      } catch (e) {
        console.error('Error al cargar paquetes justificados:', e);
        this.list = [];
      } finally {
        this.load = false;
      }
    });
  }
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
</style>
