<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-3">
            <input v-model="searchTerm" type="text" class="form-control" placeholder="Buscar..." />
          </div>
          <div class="row justify-content-end mb-3">
            <div class="col-md-2">
              <label for="sucursal" class="form-label">Sucursal</label>
              <select v-model="selectedSucursal" id="sucursal" class="form-control">
                <option value="">Todas</option>
                <option v-for="sucursal in sucursales" :key="sucursal.id" :value="sucursal.id">
                  {{ (sucursal.nombre ?? '-') }}
                </option>
              </select>
            </div>

            <div class="col-md-2">
              <label for="startDate" class="form-label">Fecha Inicial</label>
              <input type="date" v-model="startDate" id="startDate" class="form-control">
            </div>
            <div class="col-md-2">
              <label for="endDate" class="form-label">Fecha Final</label>
              <input type="date" v-model="endDate" id="endDate" class="form-control">
            </div>
            <div class="col-md-2 d-flex align-items-end">
              <button @click="exportToExcel" class="btn btn-success btn-sm w-100">
                <i class="fas fa-file-excel"></i> Generar Reporte
              </button>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                Envio observados
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Cliente</th>
                        <th class="py-0 px-1">Cartero Recogida</th>
                        <th class="py-0 px-1">Acuerdo de Recojo</th>
                        <th class="py-0 px-1">Guia</th>
                        <th class="py-0 px-1">Peso Empresa (Kg)</th>
                        <th class="py-0 px-1">Peso Correos (Kg)</th>
                        <th class="py-0 px-1">Remitente</th>
                        <th class="py-0 px-1">Detalles de Domicilio</th>
                        <th class="py-0 px-1">Zona</th>
                        <th class="py-0 px-1">Dirección maps</th>
                        <th class="py-0 px-1">Teléfono</th>
                        <th class="py-0 px-1">Contenido</th>
                        <th class="py-0 px-1">Fecha Recojo</th>
                        <th class="py-0 px-1">Destinatario</th>
                        <th class="py-0 px-1">Teléfono D</th>
                        <th class="py-0 px-1">Dirección Destinatario</th>
                        <th class="py-0 px-1">Zona</th>
                        <th class="py-0 px-1">Ciudad/Provincia</th>
                        <th class="py-0 px-1">Precio (Bs)</th>
                        <th class="py-0 px-1">Fecha de Entrega/Devolucion</th>
                        <th class="py-0 px-1">Imagen Capturada</th>
                        <th class="py-0 px-1">Justificación</th>
                        <th class="py-0 px-1">Imagen Justificación</th>
                        <th class="py-0 px-1">Estado</th> <!-- Nuevo encabezado -->

                        <th class="py-0 px-1"></th>
                      </tr>
                    </thead>
                  <tbody>
  <tr v-for="(m, i) in paginatedData" :key="m.id">
    <td class="py-0 px-1">
      {{ i + 1 + (currentPage - 1) * itemsPerPage }}
    </td>

    <!-- Cliente / Sucursal -->
    <td class="p-1">
      {{ m?.sucursale?.nombre ?? '' }}
    </td>

    <!-- Cartero Recogida -->
    <td class="p-1">
      {{ m?.cartero_recogida?.nombre ?? 'Por asignar' }}
    </td>

    <!-- Acuerdo de Recojo -->
    <td class="py-0 px-1">
      {{ m?.sucursale?.acuerdos ?? '' }}
    </td>

    <!-- Guía -->
    <td class="py-0 px-1">
      {{ m?.guia ?? '' }}
    </td>

    <!-- Peso Empresa -->
    <td class="py-0 px-1">
      {{ m?.peso_o ?? '' }}
    </td>

    <!-- Peso Correos -->
    <td class="py-0 px-1">
      {{ m?.peso_v ?? '' }}
    </td>

    <!-- Remitente -->
    <td class="py-0 px-1">
      {{ m?.remitente ?? '' }}
    </td>

    <!-- Dirección específica -->
    <td class="py-0 px-1">
      {{ m?.direccion?.direccion_especifica ?? '' }}
    </td>

    <!-- Zona origen -->
    <td class="py-0 px-1">
      {{ m?.direccion?.zona ?? '' }}
    </td>

    <!-- Dirección Maps -->
    <td class="py-0 px-1">
      <a
        v-if="isCoordinates(m?.direccion?.direccion)"
        :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion.direccion"
        target="_blank"
        class="btn btn-primary btn-sm"
      >
        Ver mapa
      </a>
      <span v-else>
        {{ m?.direccion?.direccion ?? '' }}
      </span>
    </td>

    <!-- Teléfono -->
    <td class="py-0 px-1">
      {{ m?.telefono ?? '' }}
    </td>

    <!-- Contenido -->
    <td class="py-0 px-1">
      {{ m?.contenido ?? '' }}
    </td>

    <!-- Fecha Recojo -->
    <td class="py-0 px-1">
      {{ m?.fecha_recojo_c ?? '' }}
    </td>

    <!-- Destinatario -->
    <td class="py-0 px-1">
      {{ m?.destinatario ?? '' }}
    </td>

    <!-- Teléfono Destinatario -->
    <td class="py-0 px-1">
      {{ m?.telefono_d ?? '' }}
    </td>

    <!-- Dirección Destinatario -->
    <td class="py-0 px-1">
      <a
        v-if="isCoordinates(m?.direccion_d)"
        :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d"
        target="_blank"
        class="btn btn-primary btn-sm"
      >
        Ver mapa
      </a>
      <span v-else>
        {{ m?.direccion_d ?? '' }}
      </span>
    </td>

    <!-- Zona Destino -->
    <td class="py-0 px-1">
      {{ m?.zona_d ?? '' }}
    </td>

    <!-- Ciudad -->
    <td class="py-0 px-1">
      {{ m?.ciudad ?? '' }}
    </td>

    <!-- Precio -->
    <td class="py-0 px-1">
      {{ m?.nombre_d ?? '' }}
    </td>

    <!-- Fecha Entrega / Devolución -->
    <td class="py-0 px-1">
      {{ m?.fecha_d ?? '' }}
    </td>

    <!-- Imagen Capturada -->
    <td class="py-0 px-1">
      <button
        v-if="m?.imagen"
        @click="downloadImage(m.imagen)"
        class="btn btn-sm btn-primary"
      >
        Descargar
      </button>
    </td>

    <!-- Justificación -->
    <td class="py-0 px-1">
      {{ m?.justificacion ?? '' }}
    </td>

    <!-- Imagen Justificación -->
    <td class="py-0 px-1">
      <button
        v-if="m?.imagen_justificacion"
        @click="downloadImage(m.imagen_justificacion)"
        class="btn btn-sm btn-primary"
      >
        Descargar
      </button>
    </td>

    <!-- Estado -->
    <td class="py-0 px-1">
      {{ translateStatus(m?.estado) }}
    </td>

    <!-- Acción -->
    <td class="py-0 px-1">
      <nuxtLink
        :to="url_editar + m.id"
        class="btn btn-info btn-sm"
      >
        Justificar
      </nuxtLink>
    </td>
  </tr>
</tbody>

                  </table>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <button class="btn btn-secondary" :disabled="currentPage === 1" @click="prevPage">Anterior</button>
                  <span>Página {{ (currentPage ?? '-') }} de {{ (totalPages ?? '-') }}</span>
                  <button class="btn btn-secondary" :disabled="currentPage === totalPages"
                    @click="nextPage">Siguiente</button>
                </div>
                <div class="pagination-controls d-flex justify-content-center mt-3">
  <ul class="pagination">
    <li
      v-for="pageNumber in totalPagesArray"
      :key="pageNumber"
      :class="['page-item', { active: currentPage === pageNumber }]"
    >
      <button
        v-if="pageNumber !== '...'"
        class="page-link"
        @click="goToPage(pageNumber)"
      >
        {{ (pageNumber ?? '-') }}
      </button>
      <span v-else class="page-link disabled">...</span>
    </li>
  </ul>
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
import { BCollapse, BModal } from 'bootstrap-vue';
import ExcelJS from 'exceljs';
import Swal from 'sweetalert2';

export default {
  name: "IndexPage",
  components: {
    BCollapse,
    BModal
  },
  data() {
    return {
      startDate: '', // Fecha de inicio seleccionada
      endDate: '',   // Fecha de fin seleccionada
      selectedSucursal: '', // Sucursal seleccionada
      sucursales: [], // Lista de sucursales para el dropdown
      load: true,
      list: [],
      searchTerm: '',
      apiUrl: 'solicitudes4',
      page: 'Con Multa',
      modulo: 'Con Multa',
      url_nuevo: '/admin/solicitudesj/solicitudej/nuevo',
      url_editar: '/admin/cartero/editar2/',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      collapseState: {},
      isModalVisible: false,
      currentId: null,
      selected: {},
      selectedItemsData: [],
      user: {
        cartero: []
      },
      currentPage: 1,
      itemsPerPage: 10,

    };
  },
  computed: {
   filteredData() {
  const searchTerm = (this.searchTerm || '').toLowerCase();

  // 🔒 Seguridad: si list no es array
  if (!Array.isArray(this.list)) {
    return [];
  }

  return this.list.filter(item => {

    // ===============================
    // ✅ FILTROS OBLIGATORIOS
    // ===============================

    // ❌ SIN SUCURSAL → FUERA
    if (!item?.sucursale?.id) {
      return false;
    }

    // ❌ SIN TARIFA (EMS) → FUERA
    if (!item?.tarifa_id && !item?.tarifa) {
      return false;
    }

    // ❌ SIN FECHA DE RECOJO → FUERA
    if (!item?.fecha_recojo_c) {
      return false;
    }

    // ❌ SIN SERVICIO → FUERA (evita crash)
    const servicio = (item?.tarifa?.servicio ?? '').trim();
    if (!servicio) {
      return false;
    }

    // ===============================
    // ⏱️ LÓGICA DE TIEMPOS (TU CÓDIGO)
    // ===============================

    let fechaLimite;

    const serviciosPorDias = [
      "SERVICIO COURIER NACIONAL (Normal)",
      "SERVICIO COURIER LOCAL (Normal)",
      "SERVICIO DE PROVINCIAS A NIVEL NACIONAL"
    ];

    const serviciosPorHoras = [
      "SERVICIO COURIER NACIONAL (Expreso)",
      "SERVICIO COURIER LOCAL (Expreso)"
    ];

    const recojoDate = new Date(item.fecha_recojo_c);

    if (isNaN(recojoDate.getTime())) {
      return false;
    }

    // 📆 SERVICIOS POR DÍAS
    if (serviciosPorDias.includes(servicio)) {
      const diasEntrega = (item?.tarifa?.dias_entrega ?? 0) / 24;
      fechaLimite = this.addBusinessDays(recojoDate, diasEntrega);
      fechaLimite.setHours(20, 0, 0, 0);
    }

    // ⏰ SERVICIOS POR HORAS
    else if (serviciosPorHoras.includes(servicio)) {
      fechaLimite = new Date(recojoDate);

      if (recojoDate.getDay() === 5 && recojoDate.getHours() >= 17) {
        fechaLimite = this.addBusinessDays(recojoDate, 1);
        fechaLimite.setHours(9, 30, 0, 0);
      } 
      else if (recojoDate.getHours() >= 8 && recojoDate.getHours() < 10) {
        fechaLimite.setHours(19, 0, 0, 0);
      } 
      else if (recojoDate.getHours() >= 17 && recojoDate.getHours() < 23) {
        fechaLimite = this.addBusinessDays(recojoDate, 1);
        fechaLimite.setHours(9, 30, 0, 0);
      } 
      else {
        fechaLimite = new Date(
          recojoDate.getTime() + (item?.tarifa?.dias_entrega ?? 0) * 60 * 60 * 1000
        );

        if (fechaLimite.getDay() === 6) {
          fechaLimite = this.addBusinessDays(fechaLimite, 2);
          fechaLimite.setHours(10, 0, 0, 0);
        } 
        else if (fechaLimite.getDay() === 0) {
          fechaLimite = this.addBusinessDays(fechaLimite, 1);
          fechaLimite.setHours(10, 0, 0, 0);
        }
      }
    }

    // ❌ SERVICIO DESCONOCIDO
    else {
      return false;
    }

    // ===============================
    // ✅ VALIDACIONES FINALES
    // ===============================

    const isLate = new Date() > fechaLimite;
    const isValidState = [1, 2, 5, 8, 9].includes(item.estado);

    const matchesSearch = Object.values(item)
      .some(v => String(v ?? '').toLowerCase().includes(searchTerm));

    return isLate && isValidState && matchesSearch;
  });
}
,


    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;

      return this.filteredData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },

    totalPagesArray() {
      const totalPages = this.totalPages;
      const currentPage = this.currentPage;
      const visiblePages = 3; // Número de páginas visibles al principio y al final

      const pages = [];

      // Mostrar las primeras 'visiblePages' páginas
      for (let i = 1; i <= visiblePages && i <= totalPages; i++) {
        pages.push(i);
      }

      // Agregar puntos suspensivos si hay un hueco
      if (totalPages > visiblePages + visiblePages) {
        if (currentPage > visiblePages + 1) {
          pages.push('...');
        }

        // Agregar las páginas cerca de la página actual si no están cerca del principio
        const start = Math.max(visiblePages + 1, currentPage - 1);
        const end = Math.min(totalPages - visiblePages, currentPage + 1);

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        if (currentPage < totalPages - visiblePages) {
          pages.push('...');
        }
      }

      // Mostrar las últimas 'visiblePages' páginas
      for (let i = Math.max(totalPages - visiblePages + 1, visiblePages + 1); i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    },
    hasSelectedItems() {
      return Object.keys(this.selected).some(key => this.selected[key]);
    }
  },
  methods: {

    translateStatus(status) {
      switch (status) {
        case 1:
          return 'Solicitud de envío';
        case 2:
          return 'Despachado';
        case 5:
          return 'Recojo de empresa';
        case 8:
          return 'Despachado de envío a regional';
        case 9:
          return 'Envío en camino';
        default:
          return 'Estado desconocido';
      }
    },


    generateThumbnail(base64Image) {
      const img = new Image();
      img.src = base64Image;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Ajustar la resolución del thumbnail
      const MAX_WIDTH = 100; // Ajustar según sea necesario
      const MAX_HEIGHT = 100; // Ajustar según sea necesario

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Aquí no es necesario comprimir el thumbnail en exceso si queremos mostrar una imagen más clara
      return canvas.toDataURL('image/jpeg', 0.1);
    },
    downloadImage(base64Image) {
      const link = document.createElement('a');
      link.href = base64Image; // Aquí estás usando la imagen original almacenada
      link.download = 'imagen_capturada.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async fetchSucursales() {
      try {
        const res = await this.$contratos.$get('sucursales4'); // Cambia 'sucursales_endpoint' por el endpoint real
        this.sucursales = res;
      } catch (error) {
        console.error('Error al cargar las sucursales:', error);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
    goToPage(pageNumber) {
      if (pageNumber !== '...') {
        this.currentPage = pageNumber;
      }
    },
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    async GET_DATA(path) {
      try {
        const res = await this.$contratos.$get(path);
        if (Array.isArray(res)) {
          this.list = res;
        } else {
          console.error('Los datos recuperados no son un array:', res);
        }
      } catch (e) {
        console.error('Error al obtener los datos:', e);
      }
    },





    async exportToExcel() {
      const start = this.startDate ? new Date(this.startDate + 'T00:00:00') : null;
      const end = this.endDate ? new Date(this.endDate + 'T23:59:59') : null;

      const filteredData = this.list.filter(m => {
        if (!m.fecha_d) {
          console.error('fecha_d es nulo o indefinido:', m);
          return false; // Excluye este registro del filtrado
        }

        // Convertir fecha_d a Date y ajustar la hora para evitar el desplazamiento de fecha
        const [day, month, yearAndTime] = m.fecha_d.split('/');
        const [year, time] = yearAndTime.split(' ');
        const [hour, minute] = time.split(':');
        const fechaD = new Date(year, month - 1, day, hour, minute);

        const isWithinDateRange = (!start || fechaD >= start) && (!end || fechaD <= end);
        const isMatchingSucursal = !this.selectedSucursal || m.sucursale?.id === this.selectedSucursal;

        return (m.estado === 4 || m.estado === 6) && isMatchingSucursal && isWithinDateRange;
      });

      if (filteredData.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Sin datos',
          text: 'No hay datos disponibles para los criterios seleccionados.',
        });
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Solicitudes Entregadas');

      worksheet.columns = [
        { header: '#', key: 'index', width: 5 },
        { header: 'Fecha de Solicitud', key: 'fecha', width: 20 },
        { header: 'Guía', key: 'guia', width: 20 },
        { header: 'Sucursal Origen', key: 'sucursal_origen', width: 20 },
        { header: 'Dirección', key: 'direccion', width: 30 },
        { header: 'Sucursal', key: 'sucursal', width: 20 },
        { header: 'Departamento/Servicio', key: 'servicio', width: 20 },
        { header: 'Ciudad', key: 'ciudad', width: 15 },
        { header: 'Zona', key: 'zona', width: 15 },
        { header: 'Contenido', key: 'contenido', width: 20 },
        { header: 'Peso (Kg)', key: 'peso', width: 10 },
        { header: 'Precio (Bs)', key: 'precio', width: 10 },
        { header: 'Fecha de Entrega', key: 'fecha_entrega', width: 20 },
        { header: 'Destinatario', key: 'destinatario', width: 20 },
        { header: 'Nombre del Cartero', key: 'cartero', width: 20 },
        { header: 'Observaciones', key: 'observacion', width: 25 },
        { header: 'Firma', key: 'Firma', width: 25 },
      ];

      worksheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(1).border = {
        top: { style: 'thick' },
        left: { style: 'thick' },
        bottom: { style: 'thick' },
        right: { style: 'thick' }
      };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF000080' }
      };

      let totalPrice = 0;
      let totalWeight = 0;

      for (let i = 0; i < filteredData.length; i++) {
        const m = filteredData[i];
        const row = worksheet.addRow({
          index: i + 1,
          fecha: m.fecha,
          guia: m.guia,
          sucursal_origen: m.sucursale.origen,  // Campo ajustado
          direccion: m.direccion_especifica,
          sucursal: m.sucursale.nombre,
          servicio: (m?.tarifa?.departamento ?? m?.reencaminamiento ?? 'SIN TARIFA'),  // Ajuste según tu estructura
          ciudad: m.ciudad,
          zona: m.zona_d,
          contenido: m.contenido,
          peso: m.peso_v,
          precio: m.nombre_d,
          fecha_entrega: m.fecha_d,
          destinatario: m.destinatario,
          cartero: m.cartero_entrega ? m.cartero_entrega.nombre : 'Por asignar',
          observacion: m.observacion,
        });

        totalPrice += parseFloat(m.nombre_d) || 0;
        totalWeight += parseFloat(m.peso_v) || 0;

        if (m.firma_d) {
          const signatureId = workbook.addImage({
            base64: m.firma_d,
            extension: 'png',
          });

          worksheet.addImage(signatureId, {
            tl: { col: 16, row: row.number - 1 },
            ext: { width: 100, height: 50 }
          });
        }

        const fillColor = i % 2 === 0 ? 'FFCCFFCC' : 'FF99CCFF';
        row.eachCell({ includeEmpty: true }, function (cell) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fillColor }
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }

      // Añadir la fila de totales
      const totalRow = worksheet.addRow({
        zona: 'Total',
        peso: totalWeight.toFixed(3) + ' Kg',
        precio: totalPrice.toFixed(2) + ' Bs',
      });

      totalRow.eachCell({ includeEmpty: true }, function (cell, colNumber) {
        if (colNumber === 1) {
          cell.font = { bold: true };
          cell.alignment = { horizontal: 'right' };
        }
        if (colNumber === 11 || colNumber === 12) { // Asegurarse de que el total de peso y precio se resalte
          cell.font = { bold: true };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFD700' }
          };
          cell.border = {
            top: { style: 'thick' },
            left: { style: 'thick' },
            bottom: { style: 'thick' },
            right: { style: 'thick' }
          };
        }
      });

      worksheet.eachRow({ includeEmpty: true }, function (row) {
        row.height = 25;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Solicitudes_Entregadas.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }










    ,





    addBusinessDays(date, days) {
      let count = 0;
      const result = new Date(date);
      while (count < days) {
        result.setDate(result.getDate() + 1);
        // Solo contar días hábiles (lunes a viernes)
        if (result.getDay() !== 0 && result.getDay() !== 6) {
          count++;
        }
      }
      return result;
    },

    checkForPendingDeliveries() {
      const today = new Date();
      console.log(`Fecha y hora actual: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`);

      // Filtrar solo los elementos visibles en la tabla
      const visibleItems = this.paginatedData; // Asumiendo que `paginatedData` contiene los datos visibles en la tabla

      const pendingDeliveries = visibleItems.filter(item => {
        const servicio = item.tarifa.servicio; // Obtener el servicio del item
        let fechaLimite;

        // Servicios que se calculan por días
        const serviciosPorDias = [
          "SERVICIO COURIER NACIONAL (Normal)",
          "SERVICIO COURIER LOCAL (Normal)",
          "SERVICIO DE PROVINCIAS A NIVEL NACIONAL"
        ];

        // Servicios que se calculan por horas
        const serviciosPorHoras = [
          "SERVICIO COURIER NACIONAL (Expreso)",
          "SERVICIO COURIER LOCAL (Expreso)"
        ];

        // Parsear la fecha de recojo
        const recojoDate = new Date(item.fecha_recojo_c);
        console.log(`Fecha de recojo para la guía ${item.guia}: ${recojoDate.toLocaleDateString()} ${recojoDate.toLocaleTimeString()}`);

        if (isNaN(recojoDate.getTime())) {
          console.error('Fecha de recojo inválida:', item.fecha_recojo_c);
          return false;
        }

        if (serviciosPorDias.includes(servicio)) {
          const diasEntrega = item.tarifa.dias_entrega / 24;
          fechaLimite = this.addBusinessDays(recojoDate, diasEntrega);

          // Ajustar la hora límite a las 8 PM (20:00)
          fechaLimite.setHours(20, 0, 0, 0);
        } else if (serviciosPorHoras.includes(servicio)) {
          fechaLimite = new Date(recojoDate);

          if (recojoDate.getDay() === 5 && recojoDate.getHours() >= 17) {
            fechaLimite = this.addBusinessDays(recojoDate, 1);
            fechaLimite.setHours(10, 0, 0, 0);
          } else if (recojoDate.getHours() >= 8 && recojoDate.getHours() < 10) {
            fechaLimite.setHours(20, 0, 0, 0);
          } else if (recojoDate.getHours() >= 17 && recojoDate.getHours() < 19) {
            fechaLimite = this.addBusinessDays(recojoDate, 1);
            fechaLimite.setHours(10, 0, 0, 0);
          } else {
            fechaLimite = new Date(recojoDate.getTime() + item.tarifa.dias_entrega * 60 * 60 * 1000);
            if (fechaLimite.getDay() === 6) {
              fechaLimite = this.addBusinessDays(fechaLimite, 2);
              fechaLimite.setHours(10, 0, 0, 0);
            } else if (fechaLimite.getDay() === 0) {
              fechaLimite = this.addBusinessDays(fechaLimite, 1);
              fechaLimite.setHours(10, 0, 0, 0);
            }
          }
        } else {
          console.error('Servicio no reconocido:', servicio);
          return false;
        }

        console.log(`Fecha límite para la guía ${item.guia}: ${fechaLimite.toLocaleDateString()} ${fechaLimite.toLocaleTimeString()}`);

        const isLate = today > fechaLimite;
        console.log(`Comparación para la guía ${item.guia}: Hoy (${today.toLocaleDateString()} ${today.toLocaleTimeString()}) ${isLate ? 'es mayor' : 'no es mayor'} que la fecha límite (${fechaLimite.toLocaleDateString()} ${fechaLimite.toLocaleTimeString()})`);

        return isLate;
      });


    }
  },




  mounted() {
    this.$nextTick(async () => {
      try {
        // Cargar sucursales
        await this.fetchSucursales();

        // Cargar datos existentes
        const data = await this.GET_DATA(this.apiUrl);

        // Registrar la respuesta completa de la API en la consola
        console.log('Respuesta completa de la API:', data);

        // Verificar si data contiene un array en alguna propiedad
        if (Array.isArray(data)) {
          this.list = data;
        } else if (typeof data === 'object' && data !== null) {
          // Si la respuesta es un objeto, busca si contiene un array
          const keys = Object.keys(data);
          for (let key of keys) {
            if (Array.isArray(data[key])) {
              this.list = data[key];
              console.log(`Datos cargados desde la propiedad '${key}':`, this.list);
              break;
            }
          }
        }

        // Si this.list tiene datos, continuar con la lógica de verificación
        if (this.list.length > 0) {
          this.checkForPendingDeliveries();
        } else {
          console.error('No se encontraron datos válidos en la respuesta de la API.');
        }
      } catch (error) {
        console.error('Error durante la carga de datos:', error);
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

.pagination-controls .pagination {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.pagination-controls .page-item {
  margin: 0 2px;
}

.pagination-controls .page-item .page-link {
  cursor: pointer;
}

.pagination-controls .page-item.active .page-link {
  font-weight: bold;
  background-color: #34447C;
  color: white;
}
</style>
