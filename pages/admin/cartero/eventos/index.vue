<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="card border-rounded mb-3">
          <div class="card-header">Panel de Eventos</div>
          <div class="card-body p-3">
            <div class="row align-items-end">
              <div class="col-12 col-md-2 mb-2 mb-md-0">
                <nuxtLink to="/admin/cartero/provincia" class="btn btn-info btn-sm w-100">
                  Ver Transportes
                </nuxtLink>
              </div>
              <div class="col-12 col-md-4">
                <input
                  v-model="searchTerm"
                  @keypress.enter="currentPage = 0"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Buscar por codigo, evento u observacion..."
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-6 col-md-3 mb-2">
            <div class="metric-card">
              <div class="metric-title">Total eventos</div>
              <div class="metric-value">{{ filteredData.length }}</div>
            </div>
          </div>
          <div class="col-6 col-md-3 mb-2">
            <div class="metric-card">
              <div class="metric-title">Eventos hoy</div>
              <div class="metric-value">{{ eventosHoy }}</div>
            </div>
          </div>
          <div class="col-6 col-md-3 mb-2">
            <div class="metric-card">
              <div class="metric-title">Entregados</div>
              <div class="metric-value">{{ eventosEntregados }}</div>
            </div>
          </div>
          <div class="col-6 col-md-3 mb-2">
            <div class="metric-card">
              <div class="metric-title">Devoluciones</div>
              <div class="metric-value">{{ eventosDevueltos }}</div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12" v-for="group in groupedSections" :key="group.key">
            <div class="card border-rounded mb-3 group-card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ group.title }}</span>
                <span class="group-badge">{{ group.rows.length }}</span>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive events-table-wrap">
                  <table class="table table-sm table-bordered events-table mb-0">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Codigo</th>
                        <th class="py-0 px-1">Evento</th>
                        <th class="py-0 px-1">Observacion</th>
                        <th class="py-0 px-1">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(e, i) in group.rows" :key="`${group.key}-${e?.id ?? i}`">
                        <td class="py-0 px-1">{{ i + 1 }}</td>
                        <td class="py-0 px-1">{{ e?.codigo ?? e?.codigo_id ?? e?.codigo?.codigo ?? '-' }}</td>
                        <td class="py-0 px-1">{{ e?.evento ?? e?.accion ?? e?.estado ?? '-' }}</td>
                        <td class="py-0 px-1">{{ e?.observacion ?? e?.descripcion ?? '-' }}</td>
                        <td class="py-0 px-1">{{ e?.fecha_hora ?? e?.created_at ?? e?.fecha ?? '-' }}</td>
                      </tr>
                      <tr v-if="!group.rows.length">
                        <td colspan="5" class="text-center py-3">Sin eventos en este grupo.</td>
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
export default {
  name: 'AdminCarteroEventosIndex',
  data() {
    return {
      load: true,
      list: [],
      searchTerm: '',
      apiUrl: 'eventos1',
      page: 'Eventos',
      modulo: 'Eventos',
      currentPage: 0,
      itemsPerPage: 100,
    };
  },
  computed: {
    filteredData() {
      const term = (this.searchTerm || '').toLowerCase();
      return this.list.filter(item => JSON.stringify(item || {}).toLowerCase().includes(term));
    },
    groupedSections() {
      const getText = (ev) => `${ev?.evento ?? ev?.accion ?? ''} ${ev?.observacion ?? ev?.descripcion ?? ''}`.toLowerCase();
      const entregados = this.filteredData.filter(ev => getText(ev).includes('entreg'));
      const devueltos = this.filteredData.filter(ev => {
        const txt = getText(ev);
        return txt.includes('devol') || txt.includes('retorn');
      });
      const usedIds = new Set([...entregados, ...devueltos].map(ev => ev?.id).filter(Boolean));
      const otros = this.filteredData.filter(ev => !usedIds.has(ev?.id));

      return [
        { key: 'entregados', title: 'Eventos de Entrega', rows: entregados },
        { key: 'devoluciones', title: 'Eventos de Devolucion', rows: devueltos },
        { key: 'otros', title: 'Otros Eventos', rows: otros },
      ];
    },
    eventosHoy() {
      const today = new Date();
      const y = today.getFullYear();
      const m = today.getMonth();
      const d = today.getDate();
      return this.filteredData.filter(ev => {
        const raw = ev?.fecha_hora ?? ev?.created_at ?? ev?.fecha;
        if (!raw) return false;
        const dt = new Date(raw);
        return !Number.isNaN(dt.getTime()) && dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d;
      }).length;
    },
    eventosEntregados() {
      return this.filteredData.filter(ev => {
        const txt = `${ev?.evento ?? ev?.accion ?? ''} ${ev?.observacion ?? ev?.descripcion ?? ''}`.toLowerCase();
        return txt.includes('entreg');
      }).length;
    },
    eventosDevueltos() {
      return this.filteredData.filter(ev => {
        const txt = `${ev?.evento ?? ev?.accion ?? ''} ${ev?.observacion ?? ev?.descripcion ?? ''}`.toLowerCase();
        return txt.includes('devol') || txt.includes('retorn');
      }).length;
    },
  },
  methods: {
    extractArrayPayload(res) {
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.eventos)) return res.eventos;
      return [];
    },
    async GET_DATA(path) {
      const res = await this.$administrador.$get(path);
      this.list = this.extractArrayPayload(res);
    },
  },
  mounted() {
    this.$nextTick(async () => {
      try {
        await this.GET_DATA(this.apiUrl);
      } catch (e) {
        console.error('Error al obtener eventos:', e);
      } finally {
        this.load = false;
      }
    });
  },
};
</script>

<style scoped>
.card.border-rounded {
  border-radius: 12px;
  border: 1px solid #d7e1f0;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(23, 44, 79, 0.06);
}

.card-header {
  background: #1f3b73;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.metric-card {
  background: #fff;
  border: 1px solid #d9e3f2;
  border-radius: 10px;
  padding: 10px 12px;
  height: 100%;
}

.metric-title {
  font-size: 12px;
  color: #5d7297;
  font-weight: 700;
  text-transform: uppercase;
}

.metric-value {
  font-size: 24px;
  line-height: 1.1;
  color: #1f3b73;
  font-weight: 800;
}

.events-table-wrap {
  max-height: 360px;
}

.events-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: linear-gradient(90deg, #2d76ad, #2f84bf);
  color: #fff;
  font-weight: 700;
}

.events-table tbody tr:nth-child(odd) {
  background: #f8fbff;
}

.events-table tbody tr:nth-child(even) {
  background: #eef5fc;
}

.btn-info {
  background-color: #2a6ea8;
  border-color: #2a6ea8;
  color: #fff;
}

.group-card .card-header {
  background: linear-gradient(90deg, #1f3b73, #2a6ea8);
}

.group-badge {
  background: #ffffff;
  color: #1f3b73;
  font-weight: 800;
  border-radius: 999px;
  min-width: 30px;
  text-align: center;
  padding: 2px 8px;
}
</style>
