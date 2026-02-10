<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-12 col-md-2">
            <nuxtLink to="/admin/cartero/provincia" class="btn btn-info btn-sm w-100">
              Ver Transportes
            </nuxtLink>
          </div>
          <div class="col-12 col-md-3">
            <input
              v-model="searchTerm"
              @keypress.enter="currentPage = 0"
              type="text"
              class="form-control"
              placeholder="Buscar..."
            />
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th class="py-0 px-1">#</th>
                    <th class="py-0 px-1">Codigo</th>
                    <th class="py-0 px-1">Evento</th>
                    <th class="py-0 px-1">Observacion</th>
                    <th class="py-0 px-1">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(e, i) in paginatedData" :key="e?.id ?? i">
                    <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                    <td class="py-0 px-1">{{ e?.codigo ?? e?.codigo_id ?? e?.codigo?.codigo ?? '-' }}</td>
                    <td class="py-0 px-1">{{ e?.evento ?? e?.accion ?? e?.estado ?? '-' }}</td>
                    <td class="py-0 px-1">{{ e?.observacion ?? e?.descripcion ?? '-' }}</td>
                    <td class="py-0 px-1">{{ e?.created_at ?? e?.fecha ?? '-' }}</td>
                  </tr>
                  <tr v-if="!paginatedData.length">
                    <td colspan="5" class="text-center">No hay eventos registrados.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <nav aria-label="Page navigation">
              <ul class="pagination justify-content-between">
                <li class="page-item" :class="{ disabled: currentPage === 0 }">
                  <button class="page-link" @click="previousPage" :disabled="currentPage === 0">&lt;</button>
                </li>
                <li class="page-item" v-for="pageNum in totalPages" :key="pageNum" :class="{ active: currentPage === pageNum - 1 }">
                  <button class="page-link" @click="goToPage(pageNum - 1)">{{ pageNum }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                  <button class="page-link" @click="nextPage" :disabled="currentPage >= totalPages - 1">&gt;</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </AdminTemplate>
  </div>
</template>

<script>
export default {
  name: 'AdminCarteroEventosIndex',
  data() {
    return {
      load: true,
      list: [],
      searchTerm: '',
      apiUrl: 'eventos1',
      page: 'Eventos',
      modulo: 'Eventos',
      currentPage: 0,
      itemsPerPage: 100,
    };
  },
  computed: {
    filteredData() {
      const term = (this.searchTerm || '').toLowerCase();
      return this.list.filter(item => JSON.stringify(item || {}).toLowerCase().includes(term));
    },
    paginatedData() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
  },
  methods: {
    extractArrayPayload(res) {
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.eventos)) return res.eventos;
      return [];
    },
    async GET_DATA(path) {
      const res = await this.$administrador.$get(path);
      this.list = this.extractArrayPayload(res);
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
    },
  },
  mounted() {
    this.$nextTick(async () => {
      try {
        await this.GET_DATA(this.apiUrl);
      } catch (e) {
        console.error('Error al obtener eventos:', e);
      } finally {
        this.load = false;
      }
    });
  },
};
</script>
