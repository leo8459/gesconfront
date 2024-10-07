<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="d-flex justify-content-between">
           
            <div class="d-flex align-items-center">
              <!-- Updated select dropdown button -->
              <select @change="handleSelectChange" class="btn btn-green btn-sm mr-3">
                <option value="" disabled selected>Crear solicitud de Correspondencia</option>
                <option value="url_nuevo2">Boleta Digital</option>
                <option value="url_nuevo">Boleta fisica</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Campo para buscar por código de barras -->
        <div class="row mb-3">
          <div class="col-6">
            <input v-model="codigoBarras" @keyup.enter="buscarPorCodigoBarras" class="form-control"
              placeholder="Buscar">
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                Solicitudes Pendientes
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>
                        <th class="py-0 px-1">Número de Guía</th>
                        <th class="py-0 px-1">Nombre</th>
                        <th class="py-0 px-1">Dirección Específica</th>
                        <th class="py-0 px-1">Zona</th>
                        <th class="py-0 px-1">Dirección maps</th>
                        <th class="py-0 px-1">Peso (Kg)</th>
                        <th class="py-0 px-1">Remitente</th>
                        <th class="py-0 px-1">Teléfono</th>
                        <th class="py-0 px-1">Contenido</th>
                        <th class="py-0 px-1">Fecha de Solicitud</th>
                        <th class="py-0 px-1">Destinatario</th>
                        <th class="py-0 px-1">Teléfono Destinatario</th>
                        <th class="py-0 px-1">Dirección Destinatario maps</th>
                        <th class="py-0 px-1">Dirección Destinatario</th>
                        <th class="py-0 px-1">Ciudad/Departamento</th>
                        <th class="py-0 px-1">Tarifa</th>
                        <th class="py-0 px-1"></th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="(m, i) in paginatedList" :key="i">
                        <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                        <td class="p-1">{{ m.sucursale.nombre }}</td>
                        <td class="py-0 px-1">{{ m.guia }}</td>
                        <td class="py-0 px-1">{{ m.direccion.nombre }}</td>
                        <td class="py-0 px-1">{{ m.direccion.direccion_especifica }}</td>
                        <td class="py-0 px-1">{{ m.direccion.zona }}</td>
                        <td class="py-0 px-1">
                          <a v-if="isCoordinates(m.direccion.direccion)"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion.direccion"
                            target="_blank" class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ m.direccion.direccion }}</span>
                        </td>
                        <td class="py-0 px-1">{{ m.peso_o }}</td>
                        <td class="py-0 px-1">{{ m.remitente }}</td>
                        <td class="py-0 px-1">{{ m.telefono }}</td>
                        <td class="py-0 px-1">{{ m.contenido }}</td>
                        <td class="py-0 px-1">{{ m.fecha }}</td>
                        <td class="py-0 px-1">{{ m.destinatario }}</td>
                        <td class="py-0 px-1">{{ m.telefono_d }}</td>
                        <td class="py-0 px-1">
                          <a v-if="isCoordinates(m.direccion_d)"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d" target="_blank"
                            class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ m.direccion_d }}</span>
                        </td>
                        <td class="py-0 px-1">{{ m.direccion_especifica_d }}</td>
                        <td class="py-0 px-1">{{ m.ciudad }}</td>
                        <td class="py-0 px-1">{{ getTarifaLabel(m.tarifa_id) }}</td>
                        <td class="py-0 px-1">
                          <div class="btn-group">
                            <button type="button" @click="Eliminar(m.id)" class="btn btn-danger btn-sm py-1 px-2">
                              <i class="fas fa-trash trash-icon"></i>
                            </button>
                            <nuxtLink :to="url_editar + m.id" class="btn btn-info btn-sm py-1 px-2">
                              <i class="fas fa-pen"></i>
                            </nuxtLink>
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
      page: 'Solicitudes Pendientes',
      modulo: 'Solicitudes Pendientes',
      tarifas: [], // Inicializamos tarifas como un array vacío
      codigoBarras: '', // Para almacenar el código de barras ingresado
      url_nuevo: '/sucursal/sucursales/sucursal/nuevo',
      url_nuevo2: '/sucursal/sucursales/sucursal/nuevo2',
      url_editar: '/sucursal/sucursales/sucursal/editar/',
      user: {
        sucursale: []
      },
      currentPage: 0,
      itemsPerPage: 10,
      direcciones: [], // Agregar aquí la propiedad para almacenar las direcciones

    };
  },
  computed: {
    filteredList() {
      return this.list.filter(item => item.sucursale.id === this.user.user.id && (item.estado === 1));
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
    handleSelectChange(event) {
      const selectedValue = event.target.value;
      if (this[selectedValue]) {
        this.$router.push(this[selectedValue]);
      } else {
        console.error('URL no definida para la opción seleccionada.');
      }
    },
    getDireccionLabel(direccion_id) {
      if (!this.direcciones) {
        return 'Direcciones no cargadas';
      }
      const direccion = this.direcciones.find(d => d.id === direccion_id);
      return direccion ? `${direccion.nombre} - ${direccion.direccion_especifica}` : 'Dirección no encontrada';
    },

    async GET_DATA(path) {
      const res = await this.$sucursales.$get(path);
      return res;
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        await this.$sucursales.$put(`${this.apiUrl}/${id}/destroy`);
        this.list = await this.GET_DATA(this.apiUrl);
        this.$swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Solicitud eliminada correctamente.',
        });
      } catch (e) {
        console.log(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al eliminar la solicitud.',
        });
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
    async buscarPorCodigoBarras() {
      try {
        const res = await this.$sucursales.$get('/solicitudes/buscar-por-codigo-barras', {
          params: {
            codigo_barras: this.codigoBarras
          }
        });

        if (res) {
          this.list = [res]; // Muestra solo la solicitud encontrada
        } else {
          this.$swal.fire({
            icon: 'error',
            title: 'No encontrado',
            text: 'No se encontró ninguna solicitud con ese código de barras.',
          });
        }
      } catch (e) {
        console.error('Error al buscar la solicitud:', e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al buscar la solicitud.',
        });
      }
    },
    getTarifaLabel(tarifa_id) {
      if (!this.tarifas) {
        return 'Tarifas no cargadas';
      }
      const tarifa = this.tarifas.find(t => t.id === tarifa_id);
      return tarifa ? tarifa.departamento : 'Tarifa no encontrada';
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

        // Obtener tarifas para los nombres de tarifa
        const tarifas = await this.GET_DATA('getTarifas2');
        if (Array.isArray(tarifas)) {
          this.tarifas = tarifas;
        } else {
          console.error('Las tarifas recuperadas no son un array:', tarifas);
        }

        // Obtener direcciones para los nombres de dirección
        const direcciones = await this.GET_DATA('direcciones', { sucursale_id: this.user.user.id });
        if (Array.isArray(direcciones)) {
          this.direcciones = direcciones;
        } else {
          console.error('Las direcciones recuperadas no son un array:', direcciones);
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
.btn-green {
  background-color: #22C55E; /* Green color */
  color: white;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}



/* Styling for select dropdown options */
select.btn-green {
  background-color: #22C55E;
  color: white;
}


select.btn {
  background-color: #22C55E; /* Este es el color del botón principal */
  color: white;
  padding: 20px 25px;
  border: none;
}

select.btn option {
  background-color:  #ffffff; /* Elimina el fondo */
  color: black; /* Cambia el color de las letras a negro */
  font-weight: bold;
}

select option[disabled] {
  display: none;
}

</style>