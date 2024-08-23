<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="d-flex justify-content-between">
            <a href="https://ips.correos.gob.bo/CDS.Web/Operational/andeclaration.aspx" class="btn btn-dark btn-sm ml-2" target="_blank">
    <i class=""></i> Crear solicitud de Correspondencia Internacional
  </a>
  <nuxtLink :to="url_nuevo" class="btn btn-dark btn-sm">
    <i class=""></i> Crear solicitud de Correspondencia Local/Nacional
  </nuxtLink>
 
</div>
</div>


        <!-- Campo para buscar por código de barras -->
        <div class="row mb-3">
          <div class="col-6">
            <input v-model="codigoBarras" @keyup.enter="buscarPorCodigoBarras" class="form-control"
              placeholder="Buscar por código de barras">
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                Solicitudes
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>
                        <th class="py-0 px-1">Número de Guía</th>
                        <th class="py-0 px-1">Código de Barras</th>
                        <th class="py-0 px-1">Nombre</th> <!-- Nueva columna para el nombre -->
                        <th class="py-0 px-1">Dirección Específica</th>

                        <!-- Nueva columna para la dirección específica -->
                        <th class="py-0 px-1">Zona</th> <!-- Nueva columna para la zona -->
                        <th class="py-0 px-1">Dirección maps</th>
                        <th class="py-0 px-1">Peso (Kg)</th>
                        <th class="py-0 px-1">Remitente</th>
                        <!-- <th class="py-0 px-1">Dirección</th> -->
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
                        <td class="py-0 px-1">
                          <img v-if="m.codigo_barras" :src="'data:image/png;base64,' + m.codigo_barras"
                            alt="Código de Barras" width="200" height="100" />
                        </td>
                        <td class="py-0 px-1">{{ m.direccion.nombre }}</td> <!-- Mostrar el nombre -->
                        <td class="py-0 px-1">{{ m.direccion.direccion_especifica }}</td>
                        <!-- Mostrar la dirección específica -->
                        <td class="py-0 px-1">{{ m.direccion.zona }}</td> <!-- Mostrar la zona -->
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
                        <!-- <td class="py-0 px-1">
                          <a v-if="isCoordinates(m.direccion)"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion" target="_blank"
                            class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ m.direccion }}</span>
                        </td>
                        <td class="py-0 px-1">{{ m.direccion_especifica }}</td> -->
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
      page: 'solicitudes',
      modulo: 'solicitudes',
      tarifas: [], // Inicializamos tarifas como un array vacío
      codigoBarras: '', // Para almacenar el código de barras ingresado
      url_nuevo: '/sucursal/sucursales/sucursal/nuevo',
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
  border: 1px solid #dee2e6;
  margin-bottom: 1.5rem;
  overflow: hidden;
  /* Para asegurar que los bordes redondeados se apliquen correctamente */
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
}

.table th {
  min-width: 100px;
  /* Ajusta este valor según sea necesario */
}

.table th:first-child,
.table td:first-child {
  min-width: 30px;
  /* Ajusta este valor según sea necesario */
}

td img {
  max-width: 100px;
  /* Ajusta el tamaño según tus necesidades */
  height: auto;
}
</style>
