<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end">
          <div class="col-2">
            <nuxtLink :to="url_nuevo" class="btn btn-dark btn-sm w-100">
              <i class="fas fa-plus"></i> Agregar
            </nuxtLink>
            <!-- <button @click="generarReporteClientes" class="btn btn-sm btn-primary">
              <i class="fas fa-print fa-lg"></i>
            </button> -->
          </div>
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="row mb-3">
                  <div class="col-12">
                    <input type="text" class="form-control" placeholder="Buscar..." v-model="searchQuery">
                  </div>
                </div>
                <table class="table">
                  <thead>
                    <th class="py-0 px-1">#</th>
                    <th class="py-0 px-1">Nombre Completo</th>
                    <th class="py-0 px-1">email</th>
                    <th class="py-0 px-1">carnet</th>
                    <th class="py-0 px-1">direccion</th>
                    <th class="py-0 px-1">telefono</th>
                    <th class="py-0 px-1">estado</th>
                    <th class="py-0 px-1"></th>
                  </thead>
                  <tbody>
                    <tr v-for="(m, i) in paginatedList" :key="m.id">
                      <td class="py-0 px-1">{{ (currentPage - 1) * pageSize + i + 1 }}</td>
                      <td class="py-0 px-1">{{ m.nombre }}</td>
                      <td class="py-0 px-1">{{ m.email }}</td>
                      <td class="py-0 px-1">{{ m.carnet }}</td>
                      <td class="py-0 px-1">{{ m.direccion }}</td>
                      <td class="py-0 px-1">{{ m.telefono }}</td>
                      <td class="py-0 px-1"
                        :class="m.estado === 1 ? 'activo' : (m.estado === 3 ? 'CERRADO' : 'Mantenimiento')">
                        {{ m.estado === 1 ? 'Activo' : (m.estado === 3 ? 'CERRADO' : 'Mantenimiento') }}
                      </td>
                      <td class="py-0 px-1">
                        <div class="btn-group">
                          <nuxtLink :to="url_editar + m.id" class="btn btn-info btn-sm py-1 px-2">
                            <i class="fas fa-pen"></i>
                          </nuxtLink>
                          <button type="button" @click="Eliminar(m.id)" class="btn btn-danger btn-sm py-1 px-2">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="pagination justify-content-between mt-3">
                  <button
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="btn btn-sm btn-transparent"
                    style="border-radius: 0;"
                  >
                    Anterior
                  </button>
                  <span class="align-self-center">
                    Página {{ currentPage }} de {{ totalPages }}
                    <span v-for="page in displayedPages" :key="page">
                      <button
                        v-if="page === currentPage || page === currentPage + 1 || page === currentPage + 2 || page === currentPage + 3 || page === currentPage + 4"
                        @click="changePage(page)"
                        :class="{ 'btn-primary': page === currentPage, 'btn-transparent': page !== currentPage }"
                        class="btn btn-sm"
                        style="border-radius: 0;"
                      >
                        {{ page }}
                      </button>
                    </span>
                  </span>
                  <button
                    @click="currentPage++"
                    :disabled="currentPage * pageSize >= filteredList.length"
                    class="btn btn-sm btn-transparent"
                    style="border-radius: 0;"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>
  </div>
</template>

<script>
export default {
  name: "IndexPage",
  data() {
    return {
      load: true,
      list: [],
      apiUrl: 'clientes',
      page: 'clientes',
      modulo: 'agbc',
      url_nuevo: '/admin/clientes/cliente/nuevo',
      url_editar: '/admin/clientes/cliente/editar/',
      currentPage: 1,
      pageSize: 10,
      searchQuery: '',
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredList.length / this.pageSize);
    },
    filteredList() {
      if (!this.searchQuery) return this.list;
      return this.list.filter(item => {
        return Object.values(item).some(value => {
          return String(value).toLowerCase().includes(this.searchQuery.toLowerCase());
        });
      });
    },
    paginatedList() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredList.slice(startIndex, endIndex);
    },
    displayedPages() {
      const pageCount = Math.ceil(this.filteredList.length / this.pageSize);
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    },
  },
  methods: {
    changePage(pageNum) {
      this.currentPage = pageNum;
    },
    async fetchData() {
      try {
        const res = await this.$api.$get(this.apiUrl);
        this.list = res;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.load = false;
      }
    },
    async Eliminar(id) {
      try {
        await this.$api.$delete(`${this.apiUrl}/${id}`);
        await this.fetchData();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
    async generarReporteClientes() {
      try {
        // Generar reporte aquí
      } catch (error) {
        console.error("Error generating report:", error);
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
/* Estilos para los botones transparentes */
.btn-transparent {
  background-color: transparent;
  color: #000000; /* Cambia el color del texto según tus preferencias */
  border-color: transparent; /* Opcional: elimina el borde si lo deseas */
}

/* Estilos para el botón activo */
.btn-primary {
  background-color: #0d3662;
  color: #fff;
}
</style>
