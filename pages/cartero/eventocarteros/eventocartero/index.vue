<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end">
          
          <!-- Input de búsqueda -->
          <div class="col-12 mb-3">
            <input
              v-model="searchTerm"
              type="text"
              class="form-control"
              placeholder="Buscar..."
            />
          </div>

          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                EVENTOS
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead class="bg-primary text-white">
                      <tr>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Guia</th>
                        <th class="py-0 px-1">Accion</th>
                        <th class="py-0 px-1">Descripcion</th>
                        <th class="py-0 px-1">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedData" :key="i">
                        <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                        <td class="py-0 px-1">{{ m.codigo }}</td>
                        <td class="py-0 px-1">{{ m.accion }}</td>
                        <td class="py-0 px-1">{{ m.descripcion }}</td>
                        <td class="py-0 px-1">{{ m.fecha_hora }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Paginación -->
        <div class="row justify-content-center">
          <nav aria-label="Page navigation">
            <ul class="pagination justify-content-between">
              <li class="page-item" :class="{ disabled: currentPage === 0 }">
                <button class="page-link" @click="previousPage" :disabled="currentPage === 0">
                  &lt;
                </button>
              </li>
              <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page - 1 }">
                <button class="page-link" @click="goToPage(page - 1)">
                  {{ page }}
                </button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                <button class="page-link" @click="nextPage" :disabled="currentPage >= totalPages - 1">
                  &gt;
                </button>
              </li>
            </ul>
          </nav>
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
      list: [], // Aquí estarán los datos completos
      searchTerm: '', // Término de búsqueda
      apiUrl: 'eventos',
      page: 'Eventos',
      modulo: 'AGBC',
      currentPage: 0, // Página actual
      itemsPerPage: 10, // Elementos por página
    };
  },
  computed: {
    filteredList() {
      // Filtrar la lista según el término de búsqueda
      return this.list.filter(item => {
        const searchTerm = this.searchTerm.toLowerCase();
        return (
          item.codigo.toLowerCase().includes(searchTerm) ||
          item.accion.toLowerCase().includes(searchTerm) ||
          item.descripcion.toLowerCase().includes(searchTerm) ||
          item.fecha_hora.toLowerCase().includes(searchTerm)
        );
      });
    },
    paginatedData() {
      // Datos paginados
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredList.length / this.itemsPerPage);
    },
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$api.$get(path);
      return res;
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
        await Promise.all([this.GET_DATA(this.apiUrl)]).then((v) => {
          this.list = v[0]; // Almacenar la lista completa
        });
      } catch (e) {
        console.log(e);
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
  text-align: center;
}

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}

.table {
  text-align: center;
  vertical-align: middle;
  border-collapse: collapse;
}

.table th, .table td {
  font-size: 18px; /* Ajuste de tamaño de fuente para hacerla más grande */
  text-align: center;
  padding: 12px; /* Aumenta el padding para darle más espacio a las celdas */
  border: 1px solid #dee2e6;
}

.table th {
  background-color: #34447C;
  color: #FFFFFF;
  white-space: nowrap;
}

.table td {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.table-hover tbody tr:hover {
  background-color: #f2f2f2;
}

.table .btn-primary {
  background-color: #34447C;
  border-color: #34447C;
  font-size: 12px;
  padding: 5px 10px;
}

.table .btn-primary:hover {
  background-color: #293963;
}
</style>
