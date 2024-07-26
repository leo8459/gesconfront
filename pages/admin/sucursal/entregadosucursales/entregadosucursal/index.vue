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
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                Entregados
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>
                        <th class="py-0 px-1">Guia</th>
                        <th class="py-0 px-1">Peso(Gr)</th>
                        <th class="py-0 px-1">Remitente</th>
                        <th class="py-0 px-1">Dirección</th>
                        <th class="py-0 px-1">Teléfono</th>
                        <th class="py-0 px-1">Contenido</th>
                        <th class="py-0 px-1">Firma Remitente</th>
                        <th class="py-0 px-1">Fecha de Solicitud</th>
                        <th class="py-0 px-1">Destinatario</th>
                        <th class="py-0 px-1">Teléfono Destinatario</th>
                        <th class="py-0 px-1">Dirección Destinatario</th>
                        <th class="py-0 px-1">Ciudad</th>
                        <th class="py-0 px-1">Nombre Destinatario</th>
                        <th class="py-0 px-1">CI Destinatario</th>
                        <th class="py-0 px-1">Firma Destinatario</th>
                        <th class="py-0 px-1">Estado</th>
                        <th class="py-0 px-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in sortedList" :key="i">
                        <td class="py-0 px-1">{{ i + 1 }}</td>
                        <td class="p-1">{{ m.sucursale.nombre }}</td>
                        <td class="py-0 px-1">{{ m.guia }}</td>
                        <td class="py-0 px-1">{{ m.peso_o }}</td>
                        <td class="py-0 px-1">{{ m.remitente }}</td>
                        <td class="py-0 px-1">
                          <a v-if="isCoordinates(m.direccion)" :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion" target="_blank" class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ m.direccion }}</span>
                        </td>
                        <td class="py-0 px-1">{{ m.telefono }}</td>
                        <td class="py-0 px-1">{{ m.contenido }}</td>
                        <td class="py-0 px-1">
                          <img v-if="m.firma_o" :src="m.firma_o" alt="Firma Origen" width="100" />
                        </td>
                        <td class="py-0 px-1">{{ m.fecha }}</td>
                        <td class="py-0 px-1">{{ m.destinatario }}</td>
                        <td class="py-0 px-1">{{ m.telefono_d }}</td>
                        <td class="py-0 px-1">
                          <a v-if="isCoordinates(m.direccion_d)" :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d" target="_blank" class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ m.direccion_d }}</span>
                        </td>
                        <td class="py-0 px-1">{{ m.ciudad }}</td>
                        <td class="py-0 px-1">{{ m.nombre_d }}</td>
                        <td class="py-0 px-1">{{ m.ci_d }}</td>
                        <td class="py-0 px-1">
                            <img v-if="m.firma_d" :src="m.firma_d" alt="Firma Destino" width="100" />
                          </td>
                        <td class="py-0 px-1">{{ getEstadoLabel(m.estado) }}</td>
                        <td class="py-0 px-1" v-if="m.estado !== 3 && m.estado !== 0">
                          <div class="btn-group">
                            <nuxtLink v-if="m.estado !== 2" :to="url_editar + m.id" class="btn btn-info btn-sm py-1 px-2">
                              <i class="fas fa-pen"></i>
                            </nuxtLink>
                            <button v-if="m.estado !== 2" type="button" @click="Eliminar(m.id)" class="btn btn-danger btn-sm py-1 px-2">
                              <i class="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
      apiUrl: 'solicitudes',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/admin/sucursal/sucursales/sucursal/nuevo',
      url_editar: '/admin/sucursal/sucursales/sucursal/editar/',
      user: {
        sucursale: []
      }
    };
  },
  computed: {
    filteredList() {
      return this.list.filter(item => item.sucursale.id === this.user.user.id && item.estado === 3);
    },
    sortedList() {
      return this.filteredList.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
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
  overflow: hidden; /* Para asegurar que los bordes redondeados se apliquen correctamente */
}
.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}
.table th, .table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.table th {
  min-width: 100px; /* Ajusta este valor según sea necesario */
}
.table th:first-child, .table td:first-child {
  min-width: 30px; /* Ajusta este valor según sea necesario */
}
</style>
