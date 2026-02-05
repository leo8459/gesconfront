<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end">
          <div class="col-2"></div>
          <div class="col-12">
            <div class="card">
              <nuxtLink :to="url_nuevo" class="btn btn-dark btn-sm w-100">
                <i class=""></i> Registar entidad contratante
              </nuxtLink>
              <div class="card-body">
                <!-- Campo de búsqueda -->
                <input type="text" v-model="busqueda" class="form-control" placeholder="Buscar por nombre"
                  @keyup.enter="buscar" @input="buscar" />
                <br>
                <!-- Contenedor con barra de desplazamiento horizontal -->
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th class="py-0 px-1" :key="'header-' + index" v-for="(header, index) in headers">{{ dash(header) }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedResultados" :key="m.id">
                        <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                        <td class="py-0 px-1">{{ dash(m.nombre) }}</td>
                        <td class="py-0 px-1">{{ dash(m.nit) }}</td>
                        <td class="py-0 px-1" :class="m.estado === 1 ? 'activo' : 'inactivo'">
                          {{ m.estado === 1 ? 'Activo' : 'Inactivo' }}
                        </td>
                        <td class="py-0 px-1">
                          <div class="btn-group">
                            <nuxtLink :to="url_editar + m.id" class="btn btn-info btn-sm py-1 px-2">
                              <i class="fas fa-pen"></i>
                            </nuxtLink>

                            <button type="button" @click="Eliminar(m.id)" class="btn btn-danger btn-sm py-1 px-2">
                              <i class="fas fa-trash trash-icon"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- Paginación -->
                <nav aria-label="Page navigation">
                  <ul class="pagination justify-content-between">
                    <li class="page-item" :class="{ disabled: currentPage === 0 }">
                      <button class="page-link" @click="previousPage" :disabled="currentPage === 0">&lt;</button>
                    </li>
                    <li class="page-item" v-for="page in totalPages" :key="page"
                      :class="{ active: currentPage === page - 1 }">
                      <button class="page-link" @click="goToPage(page - 1)">{{ dash(page) }}</button>
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
  head() {
    return {
      title: this.modulo,
    };
  },
  data() {
    return {
      load: true,
      list: [], // tus datos originales
      apiUrl: "empresas3",
      page: "Empresas",
      modulo: "AGBC",
      url_nuevo: "/gestore/empresas/empresa/nuevo",
      url_editar: "/gestore/empresas/empresa/editar/",
      busqueda: "", // término de búsqueda
      resultados: [], // datos filtrados
      headers: ['#', 'Nombre entidad contratante', 'NIT', 'Estado', ' '],
      currentPage: 0,
      itemsPerPage: 10,
    };
  },
  computed: {
    paginatedResultados() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.resultados.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.resultados.length / this.itemsPerPage);
    }
  },
  methods: {
    async GET_DATA(path) {
      try {
        const res = await this.$gestores.$get(path);
        return res;
      } catch (error) {
        console.error(error);
      }
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$gestores.$delete(this.apiUrl + "/" + id);
        console.log(res);
        const [data] = await Promise.all([this.GET_DATA(this.apiUrl)]);
        this.list = data;
        this.buscar(); // Actualizar los resultados después de eliminar
      } catch (e) {
        console.error(e);
      } finally {
        this.load = false;
      }
    },
    Eliminar(id) {
      let self = this;
      this.$swal
        .fire({
          title: "¿Deseas desactivar la cuenta?",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Confirmar",
          cancelButtonText: `Cancelar`,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            await self.EliminarItem(id);
          }
        });
    },
    buscar() {
      this.resultados = this.list.filter((item) =>
        item.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
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
    }
  },
  mounted() {
    this.$nextTick(async () => {
      try {
        const [data] = await Promise.all([this.GET_DATA(this.apiUrl)]);
        this.list = data;
        this.buscar(); // Llamar a buscar para cargar todos los datos al principio
      } catch (e) {
        console.error(e);
      } finally {
        this.load = false;
      }
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
