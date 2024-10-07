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
                      <tr v-for="(m, i) in paginatedList" :key="i">
                        <td>{{ currentPage * itemsPerPage + i + 1 }}</td>
                        <td>{{ m.sucursale.nombre }}</td>
                        <td>{{ m.guia }}</td>
                        <td>{{ m.peso_r ? m.peso_r : m.peso_v }}</td>
                        <td>{{ m.remitente }}</td>
                        <td>
                          <a v-if="isCoordinates(m.direccion.direccion)"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion.direccion"
                            target="_blank" class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ m.direccion.direccion }}</span>
                        </td>
                        <td>{{ m.telefono }}</td>
                        <td>{{ m.contenido }}</td>
                        <td>{{ m.fecha_recojo_c }}</td>
                        <td>{{ m.destinatario }}</td>
                        <td>{{ m.telefono_d }}</td>
                        <td>
                          <a v-if="isCoordinates(m.direccion_d)"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d" target="_blank"
                            class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ m.direccion_d }}</span>
                        </td>
                        <td>{{ m.direccion_especifica_d }}</td>
                        <td>{{ m.ciudad }}</td>
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
    filteredList() {
      return this.list.filter(item => item.sucursale.id === this.user.user.id && (item.estado === 2 || item.estado === 5 || item.estado === 8 || item.estado === 10 || item.estado === 9));
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
      let user = localStorage.getItem('userAuth');
      this.user = JSON.parse(user);
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
