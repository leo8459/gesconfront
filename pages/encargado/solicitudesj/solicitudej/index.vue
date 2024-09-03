<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-2">
            <nuxtLink :to="url_nuevo" class="btn btn-dark btn-sm w-100">
              <i class="fas fa-plus"></i> Agregar
            </nuxtLink>
          </div>
          <div class="col-2">
            <nuxtLink :to="url_asignar" class="btn btn-dark btn-sm w-100">
              <i class="fas fa-plus"></i> Asignar Carteros
            </nuxtLink>
          </div>
        </div>
        <div class="row">
          {{ user }}
          <div v-for="(group, estado) in paginatedData" :key="estado" class="col-12">
            <div class="card border-rounded">
              <div class="card-header" @click="toggleCollapse(estado)">
                {{ estado === '1' ? 'Solicitudes' : estado === '2' ? 'En camino' : estado === '3' ? 'Entregados' :
                  estado === '0' ? 'Cancelados' : 'Otro estado' }}
              </div>
              <b-collapse :id="'collapse-' + estado" v-model="collapseState[estado]">
                <div class="card-body p-2">
                  <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                      <thead>
                        <tr>
                          <th class="py-0 px-1">#</th>
                          <th class="py-0 px-1">Sucursal</th>
                          <th class="py-0 px-1">Cartero</th>
                          <th class="py-0 px-1">Guia</th>
                          <th class="py-0 px-1">Acuerdo de Recojo</th>

                          <th class="py-0 px-1">Peso Empresa (Kg)</th>
                          <th class="py-0 px-1">Peso Correos (Kg)</th>
                          <th class="py-0 px-1">Remitente</th>
                          <th class="py-0 px-1">Dirección</th>
                          <th class="py-0 px-1">Teléfono</th>
                          <th class="py-0 px-1">Contenido</th>
                          <th class="py-0 px-1">Fecha</th>
                          <th class="py-0 px-1">Firma Remitente</th>
                          <th class="py-0 px-1">Destinatario</th>
                          <th class="py-0 px-1">Teléfono D</th>
                          <th class="py-0 px-1">Dirección Destinatario</th>
                          <th class="py-0 px-1">Municipio/Provincia</th>
                          <th class="py-0 px-1">Firma Destinatario</th>
                          <th class="py-0 px-1">Nombre Destinatario</th>
                          <th class="py-0 px-1">CI Destinatario</th>
                          <th class="py-0 px-1">Fecha Destinatario</th>
                          <th class="py-0 px-1">Estado</th>
                          <th class="py-0 px-1"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(m, i) in group.data" :key="i">
                          <td class="py-0 px-1">{{ group.startIndex + i + 1 }}</td>
                          <td class="p-1">{{ m.sucursale.nombre }}</td>
                          <td class="p-1">{{ m.cartero_recogida ? m.cartero_recogida.nombre : 'Por asignar' }}</td>
                          <td class="p-1">{{ m.cartero_entrega ? m.cartero_entrega.nombre : 'Por asignar' }}</td>
                          <td class="py-0 px-1">{{ m.guia }}</td>
                          <td class="py-0 px-1">{{ m.sucursale.acuerdos }}</td>

                          <td class="py-0 px-1">{{ m.peso_o }}</td>
                          <td class="py-0 px-1">{{ m.peso_v }}</td>
                          <td class="py-0 px-1">{{ m.remitente }}</td>
                          <td class="py-0 px-1">{{ m.direccion }}</td>
                          <td class="py-0 px-1">{{ m.telefono }}</td>
                          <td class="py-0 px-1">{{ m.contenido }}</td>
                          <td class="py-0 px-1">{{ m.fecha }}</td>
                          <td class="py-0 px-1">
                            <img v-if="m.firma_o" :src="m.firma_o" alt="Firma Origen" width="100" />
                          </td>
                          <td class="py-0 px-1">{{ m.destinatario }}</td>
                          <td class="py-0 px-1">{{ m.telefono_d }}</td>
                          <td class="py-0 px-1">{{ m.direccion_d }}</td>
                          <td class="py-0 px-1">{{ m.ciudad }}</td>
                          <td class="py-0 px-1">
                            <img v-if="m.firma_d" :src="m.firma_d" alt="Firma Destino" width="100" />
                          </td>
                          <td class="py-0 px-1">{{ m.nombre_d }}</td>
                          <td class="py-0 px-1">{{ m.ci_d }}</td>
                          <td class="py-0 px-1">{{ m.fecha_d }}</td>
                          <td class="py-0 px-1">{{ m.estado === 1 ? 'Solicitud' : m.estado === 2 ? 'En camino' :
                            m.estado === 3 ? 'Entregado' : m.estado === 0 ? 'Cancelado' : m.estado }}</td>
                          <td class="py-0 px-1" v-if="m.estado === 1 || m.estado === 2">
                            <div class="btn-group">
                              <nuxtLink :to="url_editar + m.id" class="btn btn-info btn-sm py-1 px-2">
                                <i class="fas fa-pen"></i>
                              </nuxtLink>
                              <button v-if="m.estado !== 2" type="button" @click="Eliminar(m.id)"
                                class="btn btn-danger btn-sm py-1 px-2">
                                <i class="fas fa-trash"></i>
                              </button>
                              <button v-if="m.estado === 2" type="button" @click="DarDeBaja(m.id)"
                                class="btn btn-warning btn-sm py-1 px-2">
                                <i class="fas fa-ban"></i> Dar de Baja
                              </button>
                              <button v-if="m.estado === 1" type="button" @click="markAsEnCamino(m.id)"
                                class="btn btn-success btn-sm py-1 px-2">
                                <i class="fas fa-truck"></i> Asignar Cartero
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!-- Paginación -->
                  <nav aria-label="Page navigation" v-if="group.totalPages > 1">
                    <ul class="pagination justify-content-between">
                      <li class="page-item" :class="{ disabled: group.currentPage === 0 }">
                        <button class="page-link" @click="previousPage(estado)" :disabled="group.currentPage === 0"><</button>
                      </li>
                      <li class="page-item" v-for="page in group.totalPages" :key="page" :class="{ active: group.currentPage === page - 1 }">
                        <button class="page-link" @click="goToPage(estado, page - 1)">{{ page }}</button>
                      </li>
                      <li class="page-item" :class="{ disabled: group.currentPage >= group.totalPages - 1 }">
                        <button class="page-link" @click="nextPage(estado)" :disabled="group.currentPage >= group.totalPages - 1">></button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </b-collapse>
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
      apiUrl: 'solicitudes5',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/encargado/solicitudesj/solicitudej/nuevo',
      url_editar: '/encargado/solicitudesj/solicitudej/editar/',
      url_asignar: '/encargado/solicitudes/solicitude/asignar',
      collapseState: {},
      isModalVisible: false,
      currentId: null,
      user: {
        encargado: []
      },
      itemsPerPage: 10, // Número de elementos por página
      currentPageState: {} // Estado de la página actual por grupo
    };
  },
  computed: {
    groupedData() {
      const grouped = {};
      this.list.forEach(item => {
        if (!grouped[item.estado]) {
          grouped[item.estado] = [];
          this.currentPageState[item.estado] = 0; // Inicializar página actual para cada grupo
        }
        grouped[item.estado].push(item);
      });
      return grouped;
    },
    paginatedData() {
      const paginated = {};
      for (const estado in this.groupedData) {
        const group = this.groupedData[estado];
        const totalPages = Math.ceil(group.length / this.itemsPerPage);
        const currentPage = this.currentPageState[estado] || 0;
        paginated[estado] = {
          data: group.slice(currentPage * this.itemsPerPage, (currentPage + 1) * this.itemsPerPage),
          totalPages: totalPages,
          currentPage: currentPage,
          startIndex: currentPage * this.itemsPerPage
        };
      }
      return paginated;
    }
  },
  methods: {
    async markAsEnCamino(solicitudeId) {
      this.load = true;
      try {
        const carteroId = this.user.cartero.id;
        const response = await this.$encargado.$put(`solicitudesrecojo5/${solicitudeId}`, { cartero_recogida_id: carteroId });
        await this.GET_DATA(this.apiUrl);
        this.$swal.fire({
          icon: 'success',
          title: 'Cartero asignado',
          text: `La solicitud ${solicitudeId} ha sido marcada como 'En camino'.`,
        });
      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al asignar el cartero.',
        });
      } finally {
        this.load = false;
      }
    },
    async GET_DATA(path) {
      const res = await this.$encargado.$get(path);
      return res;
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$encargado.$delete(this.apiUrl + '/' + id);
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
        title: 'Deseas Eliminar?',
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
        const carteroId = this.user.cartero.id;
        const item = this.list.find(m => m.id === id);
        if (item) {
          const response = await this.$encargado.$put(`solicitudesentrega5/${id}`, { cartero_entrega_id: carteroId });
          item.estado = response.estado; // Actualizar estado desde la respuesta
          item.cartero_entrega_id = response.cartero_entrega_id; // Actualizar cartero de entrega desde la respuesta
          await this.GET_DATA(this.apiUrl);
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },
    toggleCollapse(estado) {
      this.$set(this.collapseState, estado, !this.collapseState[estado]);
    },
    nextPage(estado) {
      if (this.currentPageState[estado] < this.paginatedData[estado].totalPages - 1) {
        this.currentPageState[estado]++;
      }
    },
    previousPage(estado) {
      if (this.currentPageState[estado] > 0) {
        this.currentPageState[estado]--;
      }
    },
    goToPage(estado, page) {
      this.currentPageState[estado] = page;
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
  border: 1px solid #dee2e6;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}
</style>
