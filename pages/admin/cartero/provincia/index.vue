<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="card border-rounded mb-3 report-card">
          <div class="card-header">Panel de Reportes de Transporte</div>
          <div class="card-body p-3">
            <div class="row g-2 align-items-end">
              <div class="col-12 col-md-3">
                <label class="mb-1 filter-label">Fecha inicio</label>
                <input v-model="dateFrom" type="date" class="form-control form-control-sm" />
              </div>
              <div class="col-12 col-md-3">
                <label class="mb-1 filter-label">Fecha fin</label>
                <input v-model="dateTo" type="date" class="form-control form-control-sm" />
              </div>
              <div class="col-12 col-md-6 d-flex justify-content-md-end">
                <button class="btn btn-success btn-sm action-btn" @click="generateReportExcel">Generar Excel</button>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-6 col-md-3 mb-2">
            <div class="metric-card">
              <div class="metric-title">Dias con movimiento</div>
              <div class="metric-value">{{ reportTotalDias }}</div>
            </div>
          </div>
          <div class="col-6 col-md-3 mb-2">
            <div class="metric-card">
              <div class="metric-title">Total envios</div>
              <div class="metric-value">{{ reportTotalEnvios }}</div>
            </div>
          </div>
          <div class="col-6 col-md-3 mb-2">
            <div class="metric-card">
              <div class="metric-title">Total pagado</div>
              <div class="metric-value">{{ reportTotalPagado.toFixed(2) }}</div>
            </div>
          </div>
          <div class="col-6 col-md-3 mb-2">
            <div class="metric-card">
              <div class="metric-title">Kilo total</div>
              <div class="metric-value">{{ reportKiloTotal.toFixed(2) }}</div>
            </div>
          </div>
        </div>

        <div class="row justify-content-end mb-3">
          <div class="col-12 col-md-2 mb-2 mb-md-0">
            <nuxtLink to="/admin/cartero/eventos" class="btn btn-info btn-sm w-100">
              Ver Eventos
            </nuxtLink>
          </div>
          <div class="col-12 col-md-3">
            <input
              v-model="searchTerm"
              @keypress.enter="currentPage = 0"
              type="text"
              class="form-control form-control-sm"
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
            <div class="card border-rounded">
              <div class="card-header">Detalle de Registros de Transporte</div>
              <div class="card-body p-0">
                <div class="table-responsive detail-table-wrap">
              <table class="table table-sm table-bordered detail-table mb-0">
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
              </div>
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
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default {
  name: 'AdminCarteroProvinciaIndex',
  data() {
    return {
      load: true,
      list: [],
      carteros: [],
      eventos: [],
      solicitudes: [],
      searchTerm: '',
      dateFrom: '',
      dateTo: '',
      apiUrl: 'transportes1',
      carterosUrl: 'carteros1',
      eventosUrl: 'eventos1',
      solicitudesUrl: 'solicitudes1',
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
    getGuiaFromEvento(evento) {
      if (!evento) return '';
      const raw = evento?.codigo ?? evento?.codigo_id ?? evento?.codigo?.codigo ?? '';
      return String(raw || '').trim();
    },
    getFechaEntregaByGuia(guia) {
      const normalized = String(guia || '').trim().toLowerCase();
      if (!normalized) return '';

      const matches = (this.eventos || []).filter(ev => {
        const codigo = this.getGuiaFromEvento(ev).toLowerCase();
        if (codigo !== normalized) return false;
        const eventoTxt = String(ev?.evento ?? ev?.accion ?? '').toLowerCase();
        const descripcionTxt = String(ev?.observacion ?? ev?.descripcion ?? '').toLowerCase();
        const full = `${eventoTxt} ${descripcionTxt}`;
        return full.includes('entreg');
      });

      if (!matches.length) return '';
      const sorted = [...matches].sort((a, b) => {
        const da = new Date(a?.fecha_hora ?? a?.created_at ?? a?.fecha ?? 0).getTime();
        const db = new Date(b?.fecha_hora ?? b?.created_at ?? b?.fecha ?? 0).getTime();
        return db - da;
      });
      return sorted[0]?.fecha_hora ?? sorted[0]?.created_at ?? sorted[0]?.fecha ?? '';
    },
    getSolicitudByGuia(guia) {
      const normalized = String(guia || '').trim().toLowerCase();
      if (!normalized) return null;
      return (this.solicitudes || []).find(s => String(s?.guia || '').trim().toLowerCase() === normalized) || null;
    },
    buildExcelRows() {
      const byGuia = {};

      this.filteredByDateData.forEach(t => {
        const guias = this.parseGuias(t?.guias);
        guias.forEach(g => {
          const guia = String(g || '').trim();
          if (!guia) return;
          if (!byGuia[guia]) byGuia[guia] = [];
          byGuia[guia].push(t);
        });
      });

      return Object.keys(byGuia).map(guia => {
        const transportesPorGuia = [...byGuia[guia]].sort((a, b) => {
          const da = new Date(a?.created_at ?? 0).getTime();
          const db = new Date(b?.created_at ?? 0).getTime();
          return da - db;
        });

        const sol = this.getSolicitudByGuia(guia);
        const estadoSolicitud = Number(sol?.estado);
        if (![3, 4].includes(estadoSolicitud)) return null;

        const transporteById = sol?.transporte_id
          ? this.filteredByDateData.find(t => Number(t?.id) === Number(sol?.transporte_id))
          : null;
        // Si la guia estuvo en varios transportes, usa un solo registro (el ultimo) para el monto regional.
        const transporteRegional = transporteById || transportesPorGuia[transportesPorGuia.length - 1] || null;
        const transporteProvincia = transportesPorGuia.length > 1
          ? transportesPorGuia[transportesPorGuia.length - 1]
          : (Number(sol?.estado) === 14 ? transporteRegional : null);
        const facturaReciboRegional = [
          transporteRegional?.n_factura,
          transporteRegional?.n_recibo,
        ].filter(Boolean).join(' / ');
        const facturaReciboProvincia = [
          transporteProvincia?.n_factura,
          transporteProvincia?.n_recibo,
        ].filter(Boolean).join(' / ');

        return {
          id: sol?.id ?? '',
          guia,
          fecha_recojo: sol?.fecha_recojo_c ?? sol?.fecha_recojo ?? sol?.fecha ?? '',
          fecha_envio_regional: sol?.fecha_envio_regional ?? transporteRegional?.created_at ?? '',
          destino: sol?.ciudad ?? sol?.reencaminamiento ?? '',
          peso_por_guia: sol?.peso_v ?? sol?.peso_r ?? sol?.peso_o ?? '',
          transportadora_regional: transporteRegional?.transportadora ?? '',
          factura_recibo_regional: facturaReciboRegional || '',
          monto_total_regional: Number(transporteRegional?.precio_total ?? 0),
          fecha_entrega: this.getFechaEntregaByGuia(guia) || (sol?.fecha_d ?? ''),
          transportadora_provincia: transporteProvincia?.transportadora ?? '',
          factura_recibo_provincia: facturaReciboProvincia || '',
          monto_total_provincia: Number(transporteProvincia?.precio_total ?? 0),
        };
      }).filter(Boolean);
    },
    async generateReportExcel() {
      const rows = this.buildExcelRows();
      if (!rows.length) {
        this.$swal.fire({
          icon: 'warning',
          title: 'Sin datos',
          text: 'No hay datos para generar el Excel en el rango seleccionado.',
        });
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reporte Transporte');
      const from = this.dateFrom || 'SIN_LIMITE';
      const to = this.dateTo || 'SIN_LIMITE';

      worksheet.mergeCells('A1:M1');
      worksheet.getCell('A1').value = 'REPORTE DETALLADO DE TRANSPORTE POR GUIA';
      worksheet.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
      worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getCell('A1').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F3B73' },
      };
      worksheet.getRow(1).height = 24;

      worksheet.mergeCells('A2:M2');
      worksheet.getCell('A2').value = `Rango: ${from} a ${to}`;
      worksheet.getCell('A2').font = { italic: true, color: { argb: 'FF2F3A4A' } };
      worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getRow(2).height = 20;

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Codigo Guia', key: 'guia', width: 22 },
        { header: 'Fecha Recojo', key: 'fecha_recojo', width: 20 },
        { header: 'Envio a Regional', key: 'fecha_envio_regional', width: 22 },
        { header: 'Destino (Ciudad)', key: 'destino', width: 20 },
        { header: 'Peso por Guia', key: 'peso_por_guia', width: 16 },
        { header: 'Transportadora Regional', key: 'transportadora_regional', width: 24 },
        { header: 'Factura/Recibo Regional', key: 'factura_recibo_regional', width: 24 },
        { header: 'Monto Total Regional', key: 'monto_total_regional', width: 18 },
        { header: 'Fecha Entrega', key: 'fecha_entrega', width: 20 },
        { header: 'Transportadora Provincia', key: 'transportadora_provincia', width: 24 },
        { header: 'Factura/Recibo Provincia', key: 'factura_recibo_provincia', width: 24 },
        { header: 'Monto Total Provincia', key: 'monto_total_provincia', width: 18 },
      ];

      worksheet.mergeCells('A3:F3');
      worksheet.mergeCells('G3:J3');
      worksheet.mergeCells('K3:M3');
      worksheet.getCell('A3').value = 'DATOS GENERALES';
      worksheet.getCell('G3').value = 'TRAMO REGIONAL';
      worksheet.getCell('K3').value = 'TRAMO PROVINCIA';
      ['A3', 'G3', 'K3'].forEach(addr => {
        const cell = worksheet.getCell(addr);
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF244C8A' },
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD0D7E2' } },
          left: { style: 'thin', color: { argb: 'FFD0D7E2' } },
          bottom: { style: 'thin', color: { argb: 'FFD0D7E2' } },
          right: { style: 'thin', color: { argb: 'FFD0D7E2' } },
        };
      });
      worksheet.getRow(3).height = 22;

      worksheet.getRow(4).values = worksheet.columns.map(c => c.header);
      const headerRow = worksheet.getRow(4);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerRow.height = 24;
      headerRow.eachCell((cell, colNumber) => {
        const isRegional = colNumber >= 7 && colNumber <= 10;
        const isProvincia = colNumber >= 11 && colNumber <= 13;
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: isRegional ? 'FF2A6EA8' : isProvincia ? 'FF1F8A5B' : 'FF3A5D9C' },
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD0D7E2' } },
          left: { style: 'thin', color: { argb: 'FFD0D7E2' } },
          bottom: { style: 'thin', color: { argb: 'FFD0D7E2' } },
          right: { style: 'thin', color: { argb: 'FFD0D7E2' } },
        };
      });

      rows.forEach((r, idx) => {
        const row = worksheet.addRow(r);
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE1E7F0' } },
            left: { style: 'thin', color: { argb: 'FFE1E7F0' } },
            bottom: { style: 'thin', color: { argb: 'FFE1E7F0' } },
            right: { style: 'thin', color: { argb: 'FFE1E7F0' } },
          };
          cell.alignment = {
            vertical: 'middle',
            horizontal: [1, 6, 9, 13].includes(colNumber) ? 'right' : 'left',
          };
        });
        if (idx % 2 === 0) {
          row.eachCell(cell => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF7FAFF' },
            };
          });
        }
      });

      const totalPeso = rows.reduce((acc, r) => acc + Number(r?.peso_por_guia || 0), 0);
      const totalRegional = rows.reduce((acc, r) => acc + Number(r?.monto_total_regional || 0), 0);
      const totalProvincia = rows.reduce((acc, r) => acc + Number(r?.monto_total_provincia || 0), 0);

      const totalRow = worksheet.addRow({
        guia: 'TOTAL',
        peso_por_guia: Number(totalPeso.toFixed(3)),
        monto_total_regional: Number(totalRegional.toFixed(2)),
        monto_total_provincia: Number(totalProvincia.toFixed(2)),
      });
      totalRow.font = { bold: true, color: { argb: 'FF1F3B73' } };
      totalRow.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF0F6FF' },
        };
        cell.border = {
          top: { style: 'medium', color: { argb: 'FF9FB4DA' } },
          left: { style: 'thin', color: { argb: 'FFB9C9E8' } },
          bottom: { style: 'medium', color: { argb: 'FF9FB4DA' } },
          right: { style: 'thin', color: { argb: 'FFB9C9E8' } },
        };
      });

      const firstDataRow = 5;
      const lastRow = totalRow.number;
      worksheet.autoFilter = {
        from: { row: 4, column: 1 },
        to: { row: 4, column: 13 },
      };
      worksheet.views = [{ state: 'frozen', ySplit: 4 }];

      worksheet.getColumn(6).numFmt = '#,##0.000';
      worksheet.getColumn(9).numFmt = '#,##0.00';
      worksheet.getColumn(13).numFmt = '#,##0.00';

      for (let r = firstDataRow; r <= lastRow; r++) {
        worksheet.getRow(r).height = 20;
      }

      ['A', 'I', 'M'].forEach(col => {
        worksheet.getColumn(col).alignment = { vertical: 'middle', horizontal: 'right' };
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `reporte_transporte_detalle_${from}_${to}.xlsx`);
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
      if (Array.isArray(res?.eventos)) return res.eventos;
      if (Array.isArray(res?.solicitudes)) return res.solicitudes;
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
    async GET_EVENTOS(path) {
      const res = await this.$administrador.$get(path);
      this.eventos = this.extractArrayPayload(res);
    },
    async GET_SOLICITUDES(path) {
      const res = await this.$administrador.$get(path);
      this.solicitudes = this.extractArrayPayload(res);
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
        await Promise.all([
          this.GET_DATA(this.apiUrl),
          this.GET_CARTEROS(this.carterosUrl),
          this.GET_EVENTOS(this.eventosUrl),
          this.GET_SOLICITUDES(this.solicitudesUrl),
        ]);
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

.table thead th {
  background: #e9eef8;
  color: #243b64;
  font-weight: 600;
}

.report-card .card-body {
  background: linear-gradient(180deg, #f8fbff 0%, #f2f7ff 100%);
}

.filter-label {
  font-size: 12px;
  color: #35507f;
  font-weight: 700;
}

.action-btn {
  min-width: 110px;
}

.metric-card {
  background: #ffffff;
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
  font-size: 22px;
  line-height: 1.1;
  color: #1f3b73;
  font-weight: 800;
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

.detail-table-wrap {
  max-height: 430px;
}

.detail-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #dfe8f7;
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
