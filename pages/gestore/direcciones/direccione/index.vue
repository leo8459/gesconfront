<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end">
          <div class="col-md-2">
            <nuxtLink :to="url_nuevo" class="btn btn-dark btn-sm w-100">
              <i class=""></i> Crear direccion para sucursal
            </nuxtLink>
          </div>
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <!-- Campo de búsqueda -->
                <input type="text" v-model="busqueda" class="form-control" placeholder="Buscar por nombre"
                  @keyup.enter="buscar" @input="buscar" />
                <br>
                <table class="table">
                  <thead>
                    <th class="py-0 px-1">#</th>
                    <th class="py-0 px-1">Sucursal</th> <!-- Nueva columna para Sucursal -->
                    <th class="py-0 px-1">Nombre</th> <!-- Nueva columna para Sucursal -->
                    <th class="py-0 px-1">Maps</th>
                    <th class="py-0 px-1">Dirección Específica</th>
                    <th class="py-0 px-1">Zona</th>
                    <th class="py-0 px-1"></th>
                  </thead>
                  <tbody>
                    <tr v-for="(m, i) in paginatedList" :key="i">
                      <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                      <td class="py-0 px-1">{{ m.sucursale?.nombre || 'N/A' }}</td>
                      <td class="py-0 px-1">{{ m.nombre || 'N/A' }}</td>

                      <td class="py-0 px-1">
                        <a v-if="isCoordinates(m.direccion)"
                          :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion" target="_blank"
                          class="btn btn-primary btn-sm">
                          Ver mapa
                        </a>
                        <span v-else>{{ m.direccion }}</span>
                      </td>
                      <td class="py-0 px-1">{{ m.direccion_especifica }}</td>
                      <td class="py-0 px-1">{{ m.zona }}</td>
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
                      <button class="page-link" @click="nextPage"
                        :disabled="currentPage >= totalPages - 1">&gt;</button>
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
export default {
  name: "IndexPage",
  data() {
    return {
      load: true,
      list: [], // Aquí almacenarás las direcciones
      apiUrls: 'direcciones3', // URL para recuperar las direcciones
      page: 'Direcciones',
      modulo: 'AGBC',
      url_nuevo: '/gestore/direcciones/direccione/nuevo',
      url_editar: '/gestore/direcciones/direccione/editar/',
      busqueda: "",
      resultados: [],
      currentPage: 0,
      itemsPerPage: 10,
    };
  },
  computed: {
    paginatedList() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.resultados.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.resultados.length / this.itemsPerPage);
    }
  },
  methods: {
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    async GET_DATA(path) {
      const res = await this.$gestores.$get(path);
      return res;
    },
    async fetchAllData() {
      try {
        // Recuperar las direcciones desde el backend
        const direccionesData = await this.GET_DATA(this.apiUrls);

        // Almacenar las direcciones
        this.list = direccionesData;
        this.buscar(); // Actualizar la búsqueda con la lista de direcciones
      } catch (e) {
        console.error('Error al obtener los datos:', e);
      } finally {
        this.load = false;
      }
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$gestores.$delete(this.apiUrls + '/' + id);
        await this.fetchAllData(); // Volver a cargar todos los datos después de eliminar
        this.goToPage(0);
        this.buscar();
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
    buscar() {
      this.resultados = this.list.filter((item) =>
        item.direccion?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        item.direccion_especifica?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        item.zona?.toLowerCase().includes(this.busqueda.toLowerCase())
      );
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
      await this.fetchAllData();
    });
  },
};
</script>

<style scoped>
.activo {
  color: blue;
}

.inactivo {
  color: red;
}

.pagination {
  display: flex;
  justify-content: space-between;
}

.pagination .page-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
