<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
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
              <i class="fas fa-user-plus"></i> Asignar Carteros
            </nuxtLink>
          </div>
          <div class="col-md-2">
            <button @click="generarReporte" class="btn btn-primary btn-sm w-100">
              <i class="fas fa-file-alt"></i> Generar Reporte
            </button>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="card border-rounded mb-3">
              <div class="card-header">LISTADO DE SOLICITUDES</div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Sucursal</th>
                        <th>Cartero</th>
                        <th>Guia</th>
                        <th>Peso Empresa (Kg)</th>
                        <th>Peso Correos (Kg)</th>
                        <th>Remitente</th>
                        <th>Direccion</th>
                        <th>Telefono</th>
                        <th>Contenido</th>
                        <th>Fecha</th>
                        <th>Destinatario</th>
                        <th>Telefono D</th>
                        <th>Direccion Destinatario</th>
                        <th>Estado</th>
                        <th>Cambiar Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedSolicitudes" :key="m?.id ?? i">
                        <td>{{ i + 1 + (currentPage - 1) * itemsPerPage }}</td>
                        <td>{{ m?.sucursale?.nombre || 'N/A' }}</td>
                        <td>{{ m?.cartero_entrega?.nombre || m?.cartero?.nombre || 'Por asignar' }}</td>
                        <td>{{ m?.guia || '-' }}</td>
                        <td>{{ m?.peso_o ?? '-' }}</td>
                        <td>{{ m?.peso_v ?? '-' }}</td>
                        <td>{{ m?.remitente || '-' }}</td>
                        <td>
                          <a
                            v-if="isCoordinates(getDireccionRemitente(m))"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + getDireccionRemitente(m)"
                            target="_blank"
                            class="btn btn-primary btn-sm"
                          >
                            Ver mapa
                          </a>
                          <span v-else>{{ getDireccionRemitente(m) || '-' }}</span>
                        </td>
                        <td>{{ m?.telefono || '-' }}</td>
                        <td>{{ m?.contenido || '-' }}</td>
                        <td>{{ m?.fecha || '-' }}</td>
                        <td>{{ m?.destinatario || '-' }}</td>
                        <td>{{ m?.telefono_d || '-' }}</td>
                        <td>
                          <a
                            v-if="isCoordinates(getDireccionDestinatario(m))"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + getDireccionDestinatario(m)"
                            target="_blank"
                            class="btn btn-primary btn-sm"
                          >
                            Ver mapa
                          </a>
                          <span v-else>{{ getDireccionDestinatario(m) || '-' }}</span>
                        </td>
                        <td>{{ getEstadoLabel(m?.estado) }}</td>
                        <td>
                          <select v-model.number="m.estado" @change="actualizarEstado(m.id, m.estado)" class="form-control form-control-sm">
                            <option v-for="opt in estadoOptions" :key="opt.value" :value="opt.value">
                              {{ opt.label }}
                            </option>
                          </select>
                        </td>
                        <td>
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
                      <tr v-if="!paginatedSolicitudes.length">
                        <td colspan="17" class="text-center">No hay datos de solicitudes.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-3">
                  <button class="btn btn-secondary" :disabled="currentPage === 1" @click="prevPage">Anterior</button>
                  <span>Pagina {{ currentPage }} de {{ totalSolicitudesPages }}</span>
                  <button class="btn btn-secondary" :disabled="currentPage === totalSolicitudesPages" @click="nextPage">Siguiente</button>
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
      estadoOptions: [
        { value: 0, label: 'CANCELADO' },
        { value: 1, label: 'SOLICITUD' },
        { value: 2, label: 'EN CAMINO' },
        { value: 3, label: 'ENTREGADO' },
        { value: 4, label: 'VERIFICADO ENTREGA' },
        { value: 5, label: 'RECOGIDO' },
        { value: 6, label: 'RECHAZADO' },
        { value: 7, label: 'DEVOLUCION' },
        { value: 8, label: 'EN CAMINO' },
        { value: 9, label: 'EN CAMINO A REGIONAL' },
        { value: 10, label: 'RECIBIDO REGIONAL' },
        { value: 11, label: 'RECHAZADO' },
        { value: 12, label: 'REENCAMINAR' },
        { value: 13, label: 'RECIBIR REENCAMINADO' },
        { value: 14, label: 'TRANSITO PROVINCIA' },
      ],
    };
  },
  computed: {
    filteredSolicitudes() {
      const term = (this.searchTerm || '').toLowerCase();
      return this.list.filter(item =>
        JSON.stringify(item || {}).toLowerCase().includes(term)
      );
    },
    paginatedSolicitudes() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredSolicitudes.slice(start, end);
    },
    totalSolicitudesPages() {
      const pages = Math.ceil(this.filteredSolicitudes.length / this.itemsPerPage);
      return pages > 0 ? pages : 1;
    },
  },
  methods: {
    getEstadoLabel(value) {
      const key = Number(value);
      const found = this.estadoOptions.find(opt => opt.value === key);
      return found ? found.label : 'SIN ESTADO';
    },
    getDireccionRemitente(item) {
      if (!item) return '';
      if (typeof item.direccion === 'string') return item.direccion;
      if (item.direccion && typeof item.direccion === 'object') return item.direccion.direccion || '';
      return '';
    },
    getDireccionDestinatario(item) {
      if (!item) return '';
      return item.direccion_d || item.direccion_especifica_d || '';
    },
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(String(address || ''));
    },
    async actualizarEstado(id, estado) {
      try {
        await this.$administrador.$put(`/solicitudes/${id}/cambiar-estado`, { estado });
        await this.fetchSolicitudes();
      } catch (e) {
        console.error('Error al cambiar estado:', e);
      }
    },
    async fetchSolicitudes() {
      const res = await this.$administrador.$get(this.apiUrl);
      this.list = Array.isArray(res) ? res : [];
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalSolicitudesPages) this.currentPage++;
    },
    async Eliminar(id) {
      try {
        await this.$administrador.$delete(`${this.apiUrl}/${id}`);
        await this.fetchSolicitudes();
      } catch (e) {
        console.error('Error al eliminar:', e);
      }
    },
    generarReporte() {
      console.log('Generar reporte...');
    },
  },
  mounted() {
    this.$nextTick(async () => {
      this.load = true;
      try {
        await this.fetchSolicitudes();
      } catch (e) {
        console.error('Error al cargar la vista:', e);
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
}

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}
</style>
