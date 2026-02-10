<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="card border-rounded mb-3">
          <div class="card-header">Reporte de Transporte (PDF)</div>
          <div class="card-body p-2">
            <div class="row">
              <div class="col-12 col-md-3 mb-2">
                <label class="mb-1">Fecha inicio</label>
                <input v-model="dateFrom" type="date" class="form-control" />
              </div>
              <div class="col-12 col-md-3 mb-2">
                <label class="mb-1">Fecha fin</label>
                <input v-model="dateTo" type="date" class="form-control" />
              </div>
              <div class="col-12 col-md-2 mb-2 d-flex align-items-end">
                <button class="btn btn-primary btn-sm w-100" @click="applyDateFilter">Aplicar</button>
              </div>
              <div class="col-12 col-md-2 mb-2 d-flex align-items-end">
                <button class="btn btn-secondary btn-sm w-100" @click="clearDateFilter">Limpiar</button>
              </div>
              <div class="col-12 col-md-2 mb-2 d-flex align-items-end">
                <button class="btn btn-success btn-sm w-100" @click="generateReportPdf">
                  Generar PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-end mb-3">
          <div class="col-12 col-md-2">
            <nuxtLink to="/admin/cartero/eventos" class="btn btn-info btn-sm w-100">
              Ver Eventos
            </nuxtLink>
          </div>
          <div class="col-12 col-md-3">
            <input
              v-model="searchTerm"
              @keypress.enter="currentPage = 0"
              type="text"
              class="form-control"
              placeholder="Buscar..."
            />
          </div>
        </div>

        <div class="card border-rounded mb-3">
          <div class="card-header">Ranking de Uso de Transportadoras</div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-sm ranking-table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Transportadora</th>
                    <th class="text-end">Envios</th>
                    <th class="text-end">Frecuencia (%)</th>
                    <th class="text-end">Total Dias</th>
                    <th class="text-end">Total Pagado</th>
                    <th class="text-end">Kilo Total</th>
                    <th class="text-end">Promedio por Dia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(r, i) in transportadorasRanking" :key="r.transportadora + i">
                    <td>{{ i + 1 }}</td>
                    <td>{{ r.transportadora }}</td>
                    <td class="text-end">{{ r.envios }}</td>
                    <td class="text-end">{{ r.frecuenciaPct.toFixed(2) }}%</td>
                    <td class="text-end">{{ r.totalDias }}</td>
                    <td class="text-end">{{ r.totalPagado.toFixed(2) }}</td>
                    <td class="text-end">{{ r.kiloTotal.toFixed(2) }}</td>
                    <td class="text-end">{{ r.promedioPorDia.toFixed(2) }}</td>
                  </tr>
                  <tr v-if="!transportadorasRanking.length">
                    <td colspan="8" class="text-center py-3">No hay datos para el rango seleccionado.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th class="py-0 px-1">#</th>
                    <th class="py-0 px-1">Transportadora</th>
                    <th class="py-0 px-1">Provincia</th>
                    <th class="py-0 px-1">Cartero</th>
                    <th class="py-0 px-1">N Recibo</th>
                    <th class="py-0 px-1">N Factura</th>
                    <th class="py-0 px-1">Precio Total</th>
                    <th class="py-0 px-1">Pago Registro</th>
                    <th class="py-0 px-1">Peso Total</th>
                    <th class="py-0 px-1">Guias</th>
                    <th class="py-0 px-1">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(m, i) in paginatedData" :key="m?.id ?? i">
                    <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                    <td class="py-0 px-1">{{ m?.transportadora ?? '-' }}</td>
                    <td class="py-0 px-1">{{ m?.provincia || '-' }}</td>
                    <td class="py-0 px-1">{{ getCarteroNombre(m?.cartero_id) }}</td>
                    <td class="py-0 px-1">{{ m?.n_recibo ?? '-' }}</td>
                    <td class="py-0 px-1">{{ m?.n_factura ?? '-' }}</td>
                    <td class="py-0 px-1">{{ Number(m?.precio_total ?? 0).toFixed(2) }}</td>
                    <td class="py-0 px-1">{{ Number(m?.precio_total ?? 0).toFixed(2) }}</td>
                    <td class="py-0 px-1">{{ Number(m?.peso_total ?? 0).toFixed(2) }}</td>
                    <td class="py-0 px-1">{{ formatGuias(m?.guias) }}</td>
                    <td class="py-0 px-1">{{ m?.created_at ?? '-' }}</td>
                  </tr>
                  <tr v-if="!paginatedData.length">
                    <td colspan="11" class="text-center">No hay transportes registrados.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <nav aria-label="Page navigation">
              <ul class="pagination justify-content-between">
                <li class="page-item" :class="{ disabled: currentPage === 0 }">
                  <button class="page-link" @click="previousPage" :disabled="currentPage === 0">&lt;</button>
                </li>
                <li class="page-item" v-for="pageNum in totalPages" :key="pageNum" :class="{ active: currentPage === pageNum - 1 }">
                  <button class="page-link" @click="goToPage(pageNum - 1)">{{ pageNum }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                  <button class="page-link" @click="nextPage" :disabled="currentPage >= totalPages - 1">&gt;</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </AdminTemplate>
  </div>
</template>

<script>
export default {
  name: 'AdminCarteroProvinciaIndex',
  data() {
    return {
      load: true,
      list: [],
      carteros: [],
      searchTerm: '',
      dateFrom: '',
      dateTo: '',
      apiUrl: 'transportes1',
      carterosUrl: 'carteros1',
      page: 'Provincia',
      modulo: 'Provincia',
      currentPage: 0,
      itemsPerPage: 100,
    };
  },
  computed: {
    filteredByDateData() {
      return this.list.filter(item => this.isInDateRange(item?.created_at));
    },
    filteredData() {
      const searchTerm = (this.searchTerm || '').toLowerCase();
      if (!searchTerm) return this.filteredByDateData;

      const carteroIdsByNombre = this.carteros
        .filter(c => (c?.nombre ?? '').toLowerCase().includes(searchTerm))
        .map(c => Number(c?.id))
        .filter(Boolean);

      const carteroIdsByGuia = this.filteredByDateData
        .filter(item => this.formatGuias(item?.guias).toLowerCase().includes(searchTerm))
        .map(item => Number(item?.cartero_id))
        .filter(Boolean);

      const carteroIdsByCampos = this.filteredByDateData
        .filter(item =>
          (item?.transportadora ?? '').toLowerCase().includes(searchTerm) ||
          (item?.provincia ?? '').toLowerCase().includes(searchTerm) ||
          (item?.n_recibo ?? '').toLowerCase().includes(searchTerm) ||
          (item?.n_factura ?? '').toLowerCase().includes(searchTerm) ||
          String(item?.cartero_id ?? '').toLowerCase().includes(searchTerm)
        )
        .map(item => Number(item?.cartero_id))
        .filter(Boolean);

      const matchedCarteroIds = [...new Set([...carteroIdsByNombre, ...carteroIdsByGuia, ...carteroIdsByCampos])];
      if (matchedCarteroIds.length) {
        return this.filteredByDateData.filter(item => matchedCarteroIds.includes(Number(item?.cartero_id)));
      }

      return this.filteredByDateData.filter(item =>
        (item?.transportadora ?? '').toLowerCase().includes(searchTerm) ||
        (item?.provincia ?? '').toLowerCase().includes(searchTerm) ||
        this.formatGuias(item?.guias).toLowerCase().includes(searchTerm)
      );
    },
    paginatedData() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    reportTotalDias() {
      const uniqueDays = new Set(this.filteredByDateData.map(item => this.toDateKey(item?.created_at)).filter(Boolean));
      return uniqueDays.size;
    },
    reportTotalPagado() {
      return this.filteredByDateData.reduce((acc, item) => acc + Number(item?.precio_total || 0), 0);
    },
    reportKiloTotal() {
      return this.filteredByDateData.reduce((acc, item) => acc + Number(item?.peso_total || 0), 0);
    },
    reportTotalEnvios() {
      return this.filteredByDateData.reduce((acc, item) => acc + this.countEnvios(item), 0);
    },
    reportPagoPorDia() {
      if (!this.reportTotalDias) return 0;
      return this.reportTotalPagado / this.reportTotalDias;
    },
    reportePorDia() {
      const grouped = {};
      this.filteredByDateData.forEach(item => {
        const dayKey = this.toDateKey(item?.created_at) || 'SIN FECHA';
        if (!grouped[dayKey]) grouped[dayKey] = { fecha: dayKey, envios: 0, totalPagado: 0, kiloTotal: 0 };
        grouped[dayKey].envios += this.countEnvios(item);
        grouped[dayKey].totalPagado += Number(item?.precio_total || 0);
        grouped[dayKey].kiloTotal += Number(item?.peso_total || 0);
      });
      return Object.values(grouped).sort((a, b) => (a.fecha < b.fecha ? -1 : 1));
    },
    transportadorasRanking() {
      const grouped = {};
      this.filteredByDateData.forEach(item => {
        const name = (item?.transportadora || 'SIN TRANSPORTADORA').toString();
        if (!grouped[name]) {
          grouped[name] = { transportadora: name, envios: 0, totalDiasSet: new Set(), totalPagado: 0, kiloTotal: 0 };
        }
        grouped[name].envios += this.countEnvios(item);
        grouped[name].totalPagado += Number(item?.precio_total || 0);
        grouped[name].kiloTotal += Number(item?.peso_total || 0);
        const dayKey = this.toDateKey(item?.created_at);
        if (dayKey) grouped[name].totalDiasSet.add(dayKey);
      });
      return Object.values(grouped)
        .map(row => ({
          transportadora: row.transportadora,
          envios: row.envios,
          totalDias: row.totalDiasSet.size,
          totalPagado: row.totalPagado,
          kiloTotal: row.kiloTotal,
          frecuenciaPct: this.reportTotalEnvios ? (row.envios / this.reportTotalEnvios) * 100 : 0,
          promedioPorDia: row.totalDiasSet.size ? row.totalPagado / row.totalDiasSet.size : 0,
        }))
        .sort((a, b) => b.envios - a.envios);
    },
  },
  methods: {
    applyDateFilter() {
      this.currentPage = 0;
    },
    clearDateFilter() {
      this.dateFrom = '';
      this.dateTo = '';
      this.currentPage = 0;
    },
    isInDateRange(dateValue) {
      const hasFilters = !!this.dateFrom || !!this.dateTo;
      if (!dateValue) return !hasFilters;
      const itemDate = new Date(dateValue);
      if (Number.isNaN(itemDate.getTime())) return !hasFilters;
      if (this.dateFrom && itemDate < new Date(`${this.dateFrom}T00:00:00`)) return false;
      if (this.dateTo && itemDate > new Date(`${this.dateTo}T23:59:59`)) return false;
      return true;
    },
    toDateKey(dateValue) {
      if (!dateValue) return '';
      const d = new Date(dateValue);
      if (Number.isNaN(d.getTime())) return '';
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    },
    parseGuias(guias) {
      if (Array.isArray(guias)) return guias;
      if (!guias) return [];
      if (typeof guias === 'string') {
        try {
          const parsed = JSON.parse(guias);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          const clean = guias.replace(/^\[|\]$/g, '').replace(/['"]/g, '');
          return clean.split(',').map(x => x.trim()).filter(Boolean);
        }
      }
      return [];
    },
    countEnvios(item) {
      const guias = this.parseGuias(item?.guias);
      return guias.length || 1;
    },
    async generateReportPdf() {
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');

      const doc = new jsPDF({ orientation: 'landscape' });
      const from = this.dateFrom || 'SIN LIMITE';
      const to = this.dateTo || 'SIN LIMITE';

      doc.setFontSize(14);
      doc.text('REPORTE GENERAL DE TRANSPORTE', 14, 14);
      doc.setFontSize(10);
      doc.text(`Rango: ${from} a ${to}`, 14, 20);
      doc.text(`Dias con transporte: ${this.reportTotalDias}`, 14, 26);
      doc.text(`Total de envios: ${this.reportTotalEnvios}`, 14, 31);
      doc.text(`Total pagado: ${this.reportTotalPagado.toFixed(2)}`, 14, 36);
      doc.text(`Kilo total: ${this.reportKiloTotal.toFixed(2)}`, 14, 41);
      doc.text(`Pago promedio por dia: ${this.reportPagoPorDia.toFixed(2)}`, 14, 46);

      const porDiaRows = this.reportePorDia.map((r, idx) => [
        idx + 1,
        r.fecha,
        r.envios,
        r.totalPagado.toFixed(2),
        r.kiloTotal.toFixed(2),
      ]);
      doc.autoTable({
        startY: 52,
        head: [['#', 'Fecha', 'Envios', 'Total Pagado', 'Kilo Total']],
        body: porDiaRows.length ? porDiaRows : [['-', 'Sin datos', '-', '-', '-']],
      });

      const rankingRows = this.transportadorasRanking.map((r, idx) => [
        idx + 1,
        r.transportadora,
        r.envios,
        `${r.frecuenciaPct.toFixed(2)}%`,
        r.totalDias,
        r.totalPagado.toFixed(2),
        r.kiloTotal.toFixed(2),
        r.promedioPorDia.toFixed(2),
      ]);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 8,
        head: [['#', 'Transportadora', 'Envios', 'Frecuencia (%)', 'Total Dias', 'Total Pagado', 'Kilo Total', 'Promedio por Dia']],
        body: rankingRows.length ? rankingRows : [['-', 'Sin datos', '-', '-', '-', '-', '-', '-']],
      });

      doc.save(`reporte_general_transportes_${from}_${to}.pdf`);
    },
    formatGuias(guias) {
      const arr = this.parseGuias(guias);
      if (arr.length) return arr.join(', ');
      if (typeof guias === 'string') return guias;
      return '-';
    },
    getCarteroNombre(carteroId) {
      if (!carteroId) return '-';
      const cartero = this.carteros.find(c => Number(c?.id) === Number(carteroId));
      return cartero?.nombre || `ID ${carteroId}`;
    },
    extractArrayPayload(res) {
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.transportes)) return res.transportes;
      if (Array.isArray(res?.carteros)) return res.carteros;
      return [];
    },
    async GET_DATA(path) {
      const res = await this.$administrador.$get(path);
      this.list = this.extractArrayPayload(res);
    },
    async GET_CARTEROS(path) {
      const res = await this.$administrador.$get(path);
      this.carteros = this.extractArrayPayload(res);
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) this.currentPage++;
    },
    previousPage() {
      if (this.currentPage > 0) this.currentPage--;
    },
    goToPage(page) {
      this.currentPage = page;
    },
  },
  mounted() {
    this.$nextTick(async () => {
      try {
        await Promise.all([this.GET_DATA(this.apiUrl), this.GET_CARTEROS(this.carterosUrl)]);
      } catch (e) {
        console.error('Error al obtener datos de provincia:', e);
      } finally {
        this.load = false;
      }
    });
  },
};
</script>

<style scoped>
.card.border-rounded {
  border-radius: 14px;
  border: 1px solid #dbe3ef;
  overflow: hidden;
}

.card-header {
  background: #1f3b73;
  color: #fff;
  font-weight: 600;
}

.table thead th {
  background: #e9eef8;
  color: #243b64;
  font-weight: 600;
}

.ranking-table thead th {
  background: linear-gradient(90deg, #2d76ad, #2f84bf);
  color: #ffffff;
  border: none;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.ranking-table tbody tr:nth-child(odd) {
  background: #f8fbff;
}

.ranking-table tbody tr:nth-child(even) {
  background: #eef5fc;
}

.ranking-table td,
.ranking-table th {
  padding: 8px 10px;
}

.btn-primary {
  background-color: #1f3b73;
  border-color: #1f3b73;
}

.btn-info {
  background-color: #2a6ea8;
  border-color: #2a6ea8;
  color: #fff;
}

.btn-success {
  background-color: #1f8a5b;
  border-color: #1f8a5b;
}
</style>
