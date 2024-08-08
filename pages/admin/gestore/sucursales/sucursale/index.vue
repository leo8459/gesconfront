<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end">
          <div class="col-2">
            <nuxtLink :to="url_nuevo" class="btn btn-dark btn-sm w-100">
              <i class=""></i> Agregar Contrato
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
                    <th class="py-0 px-1">Sucursal</th>
                    <th class="py-0 px-1">Departamento Origen</th>
                    <th class="py-0 px-1">Inicio Contrato</th>
                    <th class="py-0 px-1">Fin Contrato</th>
                    <th class="py-0 px-1">Límite Presupuestario</th>
                    <th class="py-0 px-1">Cobertura</th>
                    <th class="py-0 px-1">Dirección</th>
                    <th class="py-0 px-1">Acuerdos</th>
                    <th class="py-0 px-1">Contrato</th>
                    <th class="py-0 px-1">Contacto</th>
                    <th class="py-0 px-1"></th>
                  </thead>
                  <tbody>
                    <tr v-for="(m, i) in paginatedList" :key="i">
                      <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                      <td class="py-0 px-1">{{ m.nombre }}</td>
                      <td class="py-0 px-1">{{ m.origen }}</td>
                      <td class="py-0 px-1">{{ m.ini_vigencia }}</td>
                      <td class="py-0 px-1">{{ m.fin_vigencia }}</td>
                      <td class="py-0 px-1">{{ m.limite }}</td>
                      <td class="py-0 px-1">{{ m.cobertura }}</td>
                      <td class="py-0 px-1">{{ m.direccion }}</td>
                      <td class="py-0 px-1">{{ m.acuerdos }}</td>
                      <td class="py-0 px-1">{{ m.codigo_cliente }}</td>
                      <td class="py-0 px-1">{{ m.contacto_administrativo }}</td>
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
                    <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page - 1 }">
                      <button class="page-link" @click="goToPage(page - 1)">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                      <button class="page-link" @click="nextPage" :disabled="currentPage >= totalPages - 1">&gt;</button>
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
      list: [],
      apiUrl: 'sucursales3',
      page: 'Sucursales',
      modulo: 'AGBC',
      url_nuevo: '/admin/gestore/sucursales/sucursale/nuevo',
      url_editar: '/admin/gestore/sucursales/sucursale/editar/',
      busqueda: "", // término de búsqueda
      resultados: [], // datos filtrados
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
    async GET_DATA(path) {
      const res = await this.$gestores.$get(path);
      return res;
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$gestores.$delete(this.apiUrl + '/' + id);
        await Promise.all([this.GET_DATA(this.apiUrl)]).then((v) => {
          this.list = v[0];
        });
        this.goToPage(0); // Resetear a la primera página después de eliminar
        this.buscar(); // Actualizar los resultados después de eliminar
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
        const data = await this.GET_DATA(this.apiUrl);
        if (Array.isArray(data)) {
          this.list = data;
          this.buscar(); // Llamar a buscar para cargar todos los datos al principio
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
