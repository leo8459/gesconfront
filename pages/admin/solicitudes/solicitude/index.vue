<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <!-- Filtros y botones -->
        <div class="row justify-content-end mb-3">
          <div class="col-md-3">
            <input v-model="searchTerm" type="text" class="form-control" placeholder="Buscar..." />
          </div>
          <div class="col-md-2">
            <nuxtLink :to="url_nuevo" class="btn btn-dark btn-sm w-100">
              <i class="fas fa-plus"></i> Agregar
            </nuxtLink>
          </div>
          <div class="col-md-2">
            <nuxtLink :to="url_asignar" class="btn btn-dark btn-sm w-100">
              <i class="fas fa-plus"></i> Asignar Carteros
            </nuxtLink>
          </div>
          <div class="col-md-2">
            <button @click="generarReporte" class="btn btn-primary btn-sm w-100">
              <i class="fas fa-file-alt"></i> Generar Reporte
            </button>
          </div>
        </div>

        <!-- Tabla de Resultados -->
        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                LISTADO DE SOLICITUDES
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>
                        <th class="py-0 px-1">Cartero</th>
                        <th class="py-0 px-1">Guía</th>
                        <th class="py-0 px-1">Peso Empresa (Kg)</th>
                        <th class="py-0 px-1">Peso Correos (Kg)</th>
                        <th class="py-0 px-1">Remitente</th>
                        <th class="py-0 px-1">Dirección</th>
                        <th class="py-0 px-1">Teléfono</th>
                        <th class="py-0 px-1">Contenido</th>
                        <th class="py-0 px-1">Fecha</th>
                        <th class="py-0 px-1">Destinatario</th>
                        <th class="py-0 px-1">Teléfono D</th>
                        <th class="py-0 px-1">Dirección Destinatario</th>
                        <th class="py-0 px-1">Estado</th>
                        <th class="py-0 px-1">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedData" :key="i">
                        <td class="py-0 px-1">{{ i + 1 + (currentPage - 1) * itemsPerPage }}</td>
                        <td class="py-0 px-1">{{ m.sucursale?.nombre || 'N/A' }}</td>
                        <td class="py-0 px-1">{{ m.cartero?.nombre || 'Por asignar' }}</td>
                        <td class="py-0 px-1">{{ m.guia }}</td>
                        <td class="py-0 px-1">{{ m.peso_o }}</td>
                        <td class="py-0 px-1">{{ m.peso_v }}</td>
                        <td class="py-0 px-1">{{ m.remitente }}</td>
                        <td class="py-0 px-1">
                          <a v-if="isCoordinates(m.direccion.direccion)"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion.direccion"
                            target="_blank" class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ m.direccion.direccion }}</span>
                        </td>
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
                          <td class="py-0 px-1">
  {{ 
    m.estado === 0 ? 'Cancelado' : 
    m.estado === 1 ? 'Solicitud' :
    m.estado === 2 ? 'En camino' :
    m.estado === 3 ? 'Entregado' :
    m.estado === 4 ? 'Verificado' :
    m.estado === 5 ? 'Recogido' :
    m.estado === 6 ? 'Rechazado' :
    m.estado === 7 ? 'Devolución' :
    m.estado === 8 ? 'Camino a Regional' :
    m.estado === 9 ? 'En camino Regional' :
    m.estado === 10 ? 'Recibir Regional' :
    m.estado === 11 ? 'Rechazado' :
    m.estado === 12 ? 'Reencaminar' :
    m.estado === 13 ? 'Recibir Reencaminar' :
    'Otro'
  }}
</td>
<td class="py-0 px-1">
  <div>
    <!-- Cambiar Estado -->
    <select v-model="m.estado" @change="actualizarEstado(m.id, m.estado)" class="form-control form-control-sm">
      <option :value="0">Cancelado</option>
      <option :value="1">Solicitud</option>
      <option :value="2">En camino</option>
      <option :value="3">Entregado</option>
      <option :value="4">Verificado</option>
      <option :value="5">Recogido</option>
      <option :value="6">Rechazado</option>
      <option :value="7">Devolución</option>
      <option :value="8">Camino a Regional</option>
      <option :value="9">En camino Regional</option>
      <option :value="10">Recibir Regional</option>
      <option :value="11">Rechazado</option>
      <option :value="12">Reencaminar</option>
      <option :value="13">Recibir Reencaminar</option>
    </select>
  </div>
</td>
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
                </div>

                <!-- Controles de Paginación -->
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <button class="btn btn-secondary" :disabled="currentPage === 1" @click="prevPage">Anterior</button>
                  <span>Página {{ currentPage }} de {{ totalPages }}</span>
                  <button class="btn btn-secondary" :disabled="currentPage === totalPages" @click="nextPage">Siguiente</button>
                
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
export default {
  data() {
    return {
      load: true,
      list: [],
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 10,
      apiUrl: 'solicitudes1',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/admin/solicitudes/solicitude/nuevo',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      url_editar: '/admin/solicitudes/solicitude/editar/',
    };
  },
  computed: {
    filteredData() {
      const searchTerm = this.searchTerm.toLowerCase();
      return this.list.filter(item => Object.values(item).some(value => String(value).toLowerCase().includes(searchTerm)));
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
  },
  methods: {
    async actualizarEstado(id, estado) {
    try {
        const response = await this.$administrador.$put(`/solicitudes/${id}/cambiar-estado`, { estado });
        if (response && response.success) {
            this.$toast.success(response.message || "Estado actualizado correctamente.");
        } else {
            throw new Error(response.message || "Respuesta no válida del servidor.");
        }
        this.fetchData();
    } catch (e) {
        console.error("Error al cambiar el estado:", e);
        this.$toast.error(e.message || "Error al actualizar el estado.");
    }
}
,
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    async fetchData() {
      try {
        const res = await this.$administrador.$get(this.apiUrl);
        this.list = Array.isArray(res) ? res : [];
      } catch (e) {
        console.error('Error al obtener los datos:', e);
      } finally {
        this.load = false;
      }
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    async Eliminar(id) {
      try {
        await this.$administrador.$delete(`${this.apiUrl}/${id}`);
        this.fetchData();
      } catch (e) {
        console.error('Error al eliminar el registro:', e);
      }
    },
    generarReporte() {
      console.log('Generar reporte...');
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.card.border-rounded {
  border-radius: 15px;
  border: 1px solid #dee2e6;
  margin-bottom: 1.5rem;
}

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}
</style>
