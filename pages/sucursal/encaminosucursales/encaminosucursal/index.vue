<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-2">

          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                ENVIOS EN CAMINO
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Sucursal</th>
                        <th>Guía</th>
                        <th>Peso (Kg)</th>
                        <th>Remitente</th>
                        <th>Dirección maps</th>
                        <th>Teléfono</th>
                        <th>Contenido</th>
                        <th>Fecha de recojo paquete</th>
                        <th>Destinatario</th>
                        <th>Teléfono Destinatario</th>
                        <th>Dirección Destinatario maps</th>
                        <th>Dirección Destinatario</th>
                        <th>Municipio/Provincia</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedList" :key="m?.id ?? i">

                        <td>
                          {{ currentPage * itemsPerPage + i + 1 }}
                        </td>

                        <td>
                          {{ m?.sucursale?.nombre ?? 'SIN SUCURSAL' }}
                        </td>

                        <td>
                          {{ m?.guia ?? 'SIN GUÍA' }}
                        </td>

                        <td>
                          {{ (m?.peso_r ?? m?.peso_v) ?? '0' }}
                        </td>

                        <td>
                          {{ m?.remitente ?? 'SIN REMITENTE' }}
                        </td>

                        <td>
                          <a v-if="m?.direccion?.direccion && isCoordinates(String(m.direccion.direccion))"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion.direccion"
                            target="_blank" class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>
                            {{ m?.direccion?.direccion ?? 'SIN DIRECCIÓN' }}
                          </span>
                        </td>

                        <td>
                          {{ m?.telefono ?? 'SIN TELÉFONO' }}
                        </td>

                        <td>
                          {{ m?.contenido ?? 'SIN CONTENIDO' }}
                        </td>

                        <td>
                          {{ m?.fecha_recojo_c ?? 'SIN FECHA' }}
                        </td>

                        <td>
                          {{ m?.destinatario ?? 'SIN DESTINATARIO' }}
                        </td>

                        <td>
                          {{ m?.telefono_d ?? 'SIN TELÉFONO' }}
                        </td>

                        <td>
                          <a v-if="m?.direccion_d && isCoordinates(String(m.direccion_d))"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d" target="_blank"
                            class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>
                            {{ m?.direccion_d ?? 'SIN DIRECCIÓN' }}
                          </span>
                        </td>

                        <td>
                          {{ m?.direccion_especifica_d ?? 'SIN DETALLE' }}
                        </td>

                        <td>
                          {{ m?.ciudad ?? 'SIN CIUDAD' }}
                        </td>

                      </tr>
                    </tbody>

                  </table>
                </div>
                <!-- Paginación -->
                <nav aria-label="Page navigation">
                  <ul class="pagination justify-content-between">
                    <!-- Botón de página anterior -->
                    <li class="page-item" :class="{ disabled: currentPage === 0 }">
                      <button class="page-link" @click="goToPage(currentPage - 1)"
                        :disabled="currentPage === 0">&lt;</button>
                    </li>

                    <!-- Páginas dinámicas -->
                    <li v-for="page in totalPagesArray" :key="page"
                      :class="['page-item', { active: page === currentPage + 1 }]">
                      <button v-if="page !== '...'" class="page-link" @click="goToPage(page - 1)">
                        {{ page }}
                      </button>
                      <span v-else class="page-link">...</span>
                    </li>

                    <!-- Botón de página siguiente -->
                    <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                      <button class="page-link" @click="goToPage(currentPage + 1)"
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
      apiUrl: 'solicitudes2',
      page: 'Envios en Camino',
      modulo: 'Envios en Camino',
      url_nuevo: '/admin/sucursal/sucursales/sucursal/nuevo',
      url_editar: '/admin/sucursal/sucursales/sucursal/editar/',
      user: {
        sucursale: []
      },
      currentPage: 0,
      itemsPerPage: 10,
    };
  },
  computed: {
    totalPagesArray() {
      const totalPages = this.totalPages;
      const currentPage = this.currentPage + 1; // 1-based index for user-friendly display
      const maxPagesToShow = 3;

      const pages = [];

      // Mostrar los primeros 3 números
      for (let i = 1; i <= Math.min(maxPagesToShow, totalPages); i++) {
        pages.push(i);
      }

      // Mostrar puntos suspensivos si hay más páginas
      if (currentPage > maxPagesToShow + 1) {
        pages.push('...');
      }

      // Mostrar las páginas alrededor de la página actual
      const startPage = Math.max(currentPage - 1, maxPagesToShow + 1);
      const endPage = Math.min(currentPage + 1, totalPages - maxPagesToShow);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Mostrar puntos suspensivos si hay más páginas después
      if (currentPage < totalPages - maxPagesToShow) {
        pages.push('...');
      }

      // Mostrar los últimos 3 números
      for (let i = Math.max(totalPages - maxPagesToShow + 1, endPage + 1); i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    },
    filteredList() {
      const userId = this.user?.user?.id;
      if (!userId) return [];

      const estados = [2, 5, 8, 9, 10];

      return this.list.filter(item =>
        item?.sucursale?.id === userId &&
        estados.includes(Number(item?.estado))
      );
    },

    sortedList() {
      return this.filteredList.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },
    paginatedList() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.sortedList.length / this.itemsPerPage);
    }
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$sucursales.$get(path);
      return res;
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$sucursales.$delete(this.apiUrl + '/' + id);
        await Promise.all([this.GET_DATA(this.apiUrl)]).then((v) => {
          this.list = v[0];
        });
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
          await this.$sucursales.$put(this.apiUrl + '/' + id, item);
          await Promise.all([this.GET_DATA(this.apiUrl)]).then((v) => {
            this.list = v[0];
          });
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
    goToPage(page) {
      if (page >= 0 && page < this.totalPages) {
        this.currentPage = page;
      }
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
  },
  mounted() {
    this.$nextTick(async () => {
      const userStr = localStorage.getItem('userAuth');
      this.user = userStr ? JSON.parse(userStr) : { user: null };

      if (!this.user?.user?.id) {
        this.load = false;
        this.list = [];
        this.$swal?.fire?.({
          icon: 'warning',
          title: 'Sin sesión',
          text: 'No se encontró usuario logueado (userAuth).',
        });
        return;
      }

      try {
        const data = await this.GET_DATA(this.apiUrl);
        if (Array.isArray(data)) {
          this.list = data;
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
.card.border-rounded {
  border-radius: 15px;
  border: 1px solid #34447C;
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

.table th,
.table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  vertical-align: middle;
}

.table th {
  background-color: #6c7a89;
  color: #FFFFFF;
  border-bottom: 2px solid #34447C;
}

.table-hover tbody tr:hover {
  background-color: #F8F9FA;
}

.pagination .page-item.active .page-link {
  background-color: #ffffff;
  border-color: #ffffff;
}

.pagination .page-item .page-link {
  color: #343A40;
}

.btn-warning {
  background-color: #ffcc00;
  border-color: #ffcc00;
  color: #000;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-primary {
  background-color: #e50580;
  border-color: #e50580;
}

.btn-primary:hover {
  background-color: #34447C;
  border-color: #34447C;
}

.btn-dark {
  background-color: #343a40;
  border-color: #343a40;
}
</style>
