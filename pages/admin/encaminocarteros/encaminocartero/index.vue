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
          <div v-for="(group, estado) in groupedData" :key="estado" class="col-12">
            <div class="card border-rounded">
              <div class="card-header" @click="toggleCollapse(estado)">
                {{ estado === '2' ? 'En camino' : 'Otro estado' }}
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
                          <th class="py-0 px-1">Cartero2</th>
                          <th class="py-0 px-1">Guia</th>
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
                          <th class="py-0 px-1">Ciudad</th>
                          <th class="py-0 px-1">Firma Destinatario</th>
                          <th class="py-0 px-1">Nombre Destinatario</th>
                          <th class="py-0 px-1">CI Destinatario</th>
                          <th class="py-0 px-1">Fecha Destinatario</th>
                          <th class="py-0 px-1">Estado</th>
                          <th class="py-0 px-1"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(m, i) in group" :key="i">
                          <td class="py-0 px-1">{{ i + 1 }}</td>
                          <td class="p-1">{{ m.sucursale.nombre }}</td>
                          <td class="p-1">{{ m.cartero_recogida ? m.cartero_recogida.nombre : 'Por asignar' }}</td>
                          <td class="p-1">{{ m.cartero_entrega ? m.cartero_entrega.nombre : 'Por asignar' }}</td>
                          <td class="py-0 px-1">{{ m.guia }}</td>
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
                          <td class="py-0 px-1">{{ m.estado === 2 ? 'En camino' : 'Otro estado' }}</td>
                          <td class="py-0 px-1" v-if="m.estado === 2">
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
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
      apiUrl: 'solicitudes',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/admin/solicitudescartero/solicitudecartero/nuevo',
      url_editar: '/admin/solicitudescartero/solicitudecartero/editar/',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      collapseState: {},
      isModalVisible: false,
      currentId: null,
      user: {}
    };
  },
  computed: {
    groupedData() {
      const grouped = {};
      this.list
        .filter(item => item.estado === 2) // Filtrar solo las solicitudes "En camino"
        .forEach(item => {
          if (!grouped[item.estado]) {
            grouped[item.estado] = [];
          }
          grouped[item.estado].push(item);
        });
      return grouped;
    }
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$api.$get(path);
      return res;
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$api.$delete(this.apiUrl + '/' + id);
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
          const laPazTime = new Date().toLocaleString('en-US', { timeZone: 'America/La_Paz' });
          item.fecha_d = laPazTime.replace(',', ''); // Establecer fecha y hora actual en La Paz
          await this.$api.$put(this.apiUrl + '/' + id, item);
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
    async MarcarEnCamino(id) {
      this.load = true;
      try {
        // Obtener el ID del cartero logueado desde this.user
        const carteroRecogidaId = this.user.cartero.id;
        console.log("ID del cartero logueado:", carteroRecogidaId);

        // Enviar la solicitud PUT para marcar como "En camino"
        const res = await this.$api.$put(`/solicitudesrecojo/${id}`, { cartero_recogida_id: carteroRecogidaId });
        console.log("Respuesta de la solicitud PUT:", res);

        // Actualizar la lista de solicitudes
        const result = await Promise.all([this.GET_DATA(this.apiUrl)]);
        console.log("Resultado de GET_DATA:", result);

        this.list = result[0];
        console.log("Lista actualizada:", this.list);
      } catch (e) {
        console.error("Error en MarcarEnCamino:", e);
      } finally {
        this.load = false;
        console.log("Finalizando MarcarEnCamino, load:", this.load);
      }
    },
    toggleCollapse(estado) {
      this.$set(this.collapseState, estado, !this.collapseState[estado]);
    }
  },
  mounted() {
    this.$nextTick(async () => {
      let user = localStorage.getItem('userAuth')
      this.user = JSON.parse(user)
      try {
        const data = await this.GET_DATA(this.apiUrl);
        if (Array.isArray(data)) {
          // Filtrar las solicitudes para mostrar solo las del día de hoy y "En camino"
          const today = new Date().toISOString().split('T')[0];
          this.list = data.filter(item => item.estado === 2 && item.fecha.split('T')[0] === today);
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
  /* Para asegurar que los bordes redondeados se apliquen correctamente */
}

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}
</style>
