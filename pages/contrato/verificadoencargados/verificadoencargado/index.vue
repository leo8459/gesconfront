<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="row justify-content-end mb-3">
            <div class="col-3">
              <input v-model="searchTerm" type="text" class="form-control" placeholder="Buscar..." />
            </div>

          </div>
          <div class="row justify-content-end mb-3">
            <div class="col-md-3">
              <label for="startDate" class="form-label">Fecha Inicio</label>
              <input v-model="startDate" type="date" id="startDate" class="form-control" />
            </div>
            <div class="col-md-3">
              <label for="endDate" class="form-label">Fecha Fin</label>
              <input v-model="endDate" type="date" id="endDate" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="sucursal" class="form-label">Sucursal</label>
              <select v-model="selectedSucursal" id="sucursal" class="form-control">
                <option value="">Todas</option>
                <option v-for="sucursal in sucursales" :key="sucursal.id" :value="sucursal.id">
                  {{ sucursal.nombre }}
                </option>
              </select>
            </div>
            <div class="col-md-2 d-flex align-items-end">
              <!-- <button @click="exportToPDF" class="btn btn-danger btn-sm w-100">
                <i class="fas fa-file-pdf"></i> Generar Reporte PDF
              </button> -->

              <button @click="exportToExcel" class="btn btn-success btn-sm w-100">
                <i class="fas fa-file-excel"></i> Generar Reporte
              </button>
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
                    <th class="py-0 px-1">Sucursal</th>
                    <th class="py-0 px-1">Cartero Recogida</th>
                    <th class="py-0 px-1">Cartero Entrega</th>
                    <th class="py-0 px-1">Guia</th>
                    <th class="py-0 px-1">Peso Empresa (Kg)</th>
                    <th class="py-0 px-1">Peso Correos (Kg)</th>
                    <th class="py-0 px-1">Remitente</th>
                    <th class="py-0 px-1">Detalles de Domicilio</th>
                    <th class="py-0 px-1">Zona</th>
                    <th class="py-0 px-1">Dirección maps</th>
                    <th class="py-0 px-1">Teléfono</th>
                    <th class="py-0 px-1">Contenido</th>
                    <th class="py-0 px-1">Fecha</th>
                    <th class="py-0 px-1">Destinatario</th>
                    <th class="py-0 px-1">Teléfono D</th>
                    <th class="py-0 px-1">Dirección Destinatario</th>
                    <th class="py-0 px-1">Zona</th>
                    <th class="py-0 px-1">Ciudad/Provincia</th>
                    <th class="py-0 px-1">Firma Destinatario</th>
                    <th class="py-0 px-1">Precio (Bs)</th>
                    <th class="py-0 px-1">Fecha de Entrega</th>
                    <th class="py-0 px-1">Imagen Capturada</th>
                    <th class="py-0 px-1">Justificacion</th>
                    <th class="py-0 px-1">Imagen Justificacion</th>
                    <th class="py-0 px-1">Fecha devolucion</th>
                    <th class="py-0 px-1">Imagen devolucion</th>
                    <th class="py-0 px-1"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(m, i) in paginatedData" :key="m.id">
                    <td class="py-0 px-1">{{ i + 1 + (currentPage - 1) * itemsPerPage }}</td>
                    <td class="p-1">{{ m.sucursale ? m.sucursale.nombre : '' }}</td>
                    <td class="p-1">{{ m.cartero_recogida ? m.cartero_recogida.nombre : 'Por asignar' }}</td>
                    <td class="p-1">{{ m.cartero_entrega ? m.cartero_entrega.nombre : 'Por asignar' }}</td>
                    <td class="py-0 px-1">{{ m.guia }}</td>
                    <td class="py-0 px-1">{{ m.peso_o }}</td>
                    <td class="py-0 px-1">{{ m.peso_v }}</td>
                    <td class="py-0 px-1">{{ m.remitente }}</td>
                    <td class="py-0 px-1">{{ m.direccion.direccion_especifica }}</td>
                    <td class="py-0 px-1">{{ m.direccion.zona }}</td>
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
                    <td class="py-0 px-1">{{ m.fecha_recojo_c }}</td>
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
                    <td class="py-0 px-1">{{ m.zona_d }}</td>
                    <td class="py-0 px-1">{{ m.ciudad }}</td>
                    <td class="py-0 px-1">
                      <img v-if="m.firma_d" :src="m.firma_d" alt="Firma Destino" width="100" />
                    </td>
                    <td class="py-0 px-1">{{ m.nombre_d }}</td>
                    <td class="py-0 px-1">{{ m.fecha_d }}</td>
                    <td class="py-0 px-1">
                      <div class="d-flex flex-column align-items-center">
                        <button v-if="m.imagen" @click="downloadImage(m.imagen)"
                          class="btn btn-sm btn-primary mt-1 align-self-start">
                          Descargar
                        </button>
                      </div>
                    </td>
                    <td class="py-0 px-1">{{ m.justificacion }}</td>
                    <td class="py-0 px-1">
                      <div class="d-flex flex-column align-items-center">
                        <button v-if="m.imagen_justificacion" @click="downloadImage(m.imagen_justificacion)"
                          class="btn btn-sm btn-primary mt-1 align-self-start">
                          Descargar
                        </button>
                      </div>
                    </td>
                    <td class="py-0 px-1">{{ m.fecha_devolucion }}</td>
                    <td class="py-0 px-1">
                      <div class="d-flex flex-column align-items-center">
                        <button v-if="m.imagen_devolucion" @click="downloadImage(m.imagen_devolucion)"
                          class="btn btn-sm btn-primary mt-1 align-self-start">
                          Descargar
                        </button>
                      </div>
                    </td>
                    <td class="py-0 px-1">
                      <div class="btn-group">
                        <nuxtLink :to="url_editar + m.id" class="btn btn-info btn-sm py-1 px-2">
                          <i class="fas fa-ban"></i> Justificar Correspondencia
                        </nuxtLink>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <button class="btn btn-secondary" :disabled="currentPage === 1" @click="prevPage">Anterior</button>
              <span>Página {{ currentPage }} de {{ totalPages }}</span>
              <button class="btn btn-secondary" :disabled="currentPage === totalPages"
                @click="nextPage">Siguiente</button>
            </div>
            <div class="pagination-controls">
              <ul class="pagination">
                <li :class="['page-item', { active: currentPage === pageNumber }]" v-for="pageNumber in totalPagesArray"
                  :key="pageNumber">
                  <button class="page-link" @click="goToPage(pageNumber)">{{ pageNumber }}</button>
                </li>
              </ul>
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';


export default {
  name: "IndexPage",
  components: {
    BCollapse,
    BModal
  },
  data() {
    return {
      selectedSucursal: '', // Sucursal seleccionada
      sucursales: [], // Lista de sucursales para el dropdown
      load: true,
      list: [],
      searchTerm: '',
      apiUrl: 'solicitudes4',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/admin/solicitudesj/solicitudej/nuevo',
      url_editar: '/admin/cartero/editar2/',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      collapseState: {},
      isModalVisible: false,
      currentId: null,
      selected: {},
      startDate: '',
      endDate: '',
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
      const searchTerm = this.searchTerm.toLowerCase();
      const startDate = this.startDate ? new Date(this.startDate) : null;
      const endDate = this.endDate ? new Date(this.endDate) : null;

      if (endDate) {
        // Añadir un día a la fecha de fin para incluir todo ese día
        endDate.setDate(endDate.getDate() + 1);
      }

      const filtered = this.list.filter(item => {
        const isMatchingSucursal = !this.selectedSucursal || item.sucursale?.id === this.selectedSucursal;
        const isMatchingState = item.estado === 4 || item.estado === 7;

        if (!item.fecha_d) {
          return false; // Si no tiene fecha, lo ignoramos
        }

        // Convertir 'fecha_d' a un objeto Date
        const [day, month, year, hour, minute] = item.fecha_d.split(/[\s/:]+/);
        const itemDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);

        const isWithinDateRange =
          (!startDate || (itemDate && itemDate >= startDate)) &&
          (!endDate || (itemDate && itemDate <= endDate));

        return isMatchingSucursal && isMatchingState &&
          isWithinDateRange &&
          Object.values(item).some(value => String(value).toLowerCase().includes(searchTerm));
      });

      console.log('Datos filtrados:', filtered); // Verifica aquí si el filtrado es correcto
      return filtered;
    },


    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    totalPagesArray() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
  },
  methods: {



    async exportToPDF() {
      const filteredData = this.list.filter(m => (m.estado === 4 || m.estado === 7) && (!this.selectedSucursal || m.sucursale?.id === this.selectedSucursal));

      if (filteredData.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Sin datos',
          text: 'No hay datos disponibles para los criterios seleccionados.',
        });
        return;
      }

      const doc = new jsPDF('portrait', 'mm', 'a4');

      filteredData.forEach((m, index) => {
        // Título del documento
        doc.setFontSize(14);
        doc.text(`Solicitud ${index + 1}`, 105, 15, null, null, 'center');

        // Datos de la solicitud
        const rows = [
          ['Fecha de Solicitud', m.fecha_recojo_c || 'N/A'],
          ['Guía', m.guia || 'N/A'],
          ['Sucursal', m.sucursale?.nombre || 'N/A'],
          ['Dirección', m.direccion_especifica || 'N/A'],
          ['Departamento/Servicio', m.tarifa?.departamento || 'N/A'],
          ['Ciudad', m.ciudad || 'N/A'],
          ['Zona', m.zona_d || 'N/A'],
          ['Contenido', m.contenido || 'N/A'],
          ['Peso (Kg)', (m.peso_v && !isNaN(m.peso_v)) ? parseFloat(m.peso_v).toFixed(2) : 'N/A'],
          ['Precio (Bs)', (m.nombre_d && !isNaN(m.nombre_d)) ? parseFloat(m.nombre_d).toFixed(2) : 'N/A'],
          ['Fecha de Entrega', m.fecha_d || 'N/A'],
          ['Destinatario', m.destinatario || 'N/A'],
          ['Nombre del Cartero', m.cartero_entrega?.nombre || 'Por asignar'],
          ['Observaciones', m.observacion || 'N/A'],
        ];

        // Dibujar la tabla
        doc.autoTable({
          body: rows,
          startY: 25,
          margin: { left: 10, right: 10 },
          styles: {
            fontSize: 10,
            cellPadding: 3,
            overflow: 'linebreak',
          },
          theme: 'striped',
        });

        // Agregar nueva página si no es la última solicitud
        if (index < filteredData.length - 1) {
          doc.addPage();
        }
      });

      doc.save('Solicitudes_Entregadas.pdf');
    },




    generateThumbnail(base64Image) {
      const img = new Image();
      img.src = base64Image;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Ajustar la resolución del thumbnail
      const MAX_WIDTH = 100;
      const MAX_HEIGHT = 100;

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

      return canvas.toDataURL('image/jpeg', 0.1);
    },
    downloadImage(base64Image) {
      const link = document.createElement('a');
      link.href = base64Image;
      link.download = 'imagen_capturada.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async fetchSucursales() {
      try {
        const res = await this.$contratos.$get('sucursales4');
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
      this.currentPage = pageNumber;
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
          console.log('Datos cargados:', this.list); // Verifica aquí si los datos se están recuperando correctamente
        } else {
          console.error('Los datos recuperados no son un array:', res);
        }
      } catch (e) {
        console.error('Error al obtener los datos:', e);
      }
    },



    async exportToExcel() {
  const filteredData = this.list.filter(m => (m.estado === 4 || m.estado === 7) && (!this.selectedSucursal || m.sucursale?.id === this.selectedSucursal));

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

  // Define las columnas
  worksheet.columns = [
    { header: '#', key: 'index', width: 5 },
    { header: 'Fecha de Envio', key: 'fecha', width: 20 },
    { header: 'Numero de envio', key: 'guia', width: 20 },
    { header: 'Ciudad', key: 'sucursal_origen', width: 20 },
    { header: 'Rural', key: 'municipio', width: 30 },
    { header: 'Local', key: 'local', width: 30 },
    // { header: 'Ciudad', key: 'sucursal', width: 20 },
    { header: 'Departamento/Servicio', key: 'servicio', width: 20 },
    { header: 'Ciudad', key: 'ciudad', width: 15 },
    { header: 'Zona', key: 'zona', width: 20 },
    { header: 'Contenido', key: 'contenido', width: 20 },
    { header: 'Peso (Kg)', key: 'peso', width: 10 },
    { header: 'Precio (Bs)', key: 'precio', width: 10 },
    { header: 'Servicio', key: 'servicioT', width: 10 },
    { header: 'Fecha y hora', key: 'fecha_entrega', width: 20 },
    { header: 'Entregado', key: 'destinatario', width: 20 },
    { header: 'Cartero', key: 'cartero', width: 20 },
    { header: 'Observaciones', key: 'observacion', width: 25 },
  ];

  // Merging cells to create the "Envío" header spanning multiple columns
  worksheet.mergeCells('A1:N1'); // Combina las celdas de las columnas B a M en la primera fila
  worksheet.getCell('B1').value = 'Envío'; // Coloca el título "Envío" en la celda combinada
  worksheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' }; // Centra el texto
  worksheet.getCell('B1').font = { bold: true, size: 14 }; // Aplica un estilo de fuente
  worksheet.getCell('B1').fill = { 
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '32FF0E' } // Color verde para toda la celda
  };
  
  // Aplica el color de fondo verde al encabezado `#`
  worksheet.getCell('A2').fill = { 
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' } // Color verde
  };
  worksheet.getCell('A2').font = { bold: true, size: 12 }; // Aplica un estilo de fuente para el encabezado `#`
  worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' }; // Centra el texto

  // Aplica los subtítulos debajo del título "Envío"
  worksheet.getRow(2).getCell(1).value = '#';
  worksheet.getRow(2).getCell(2).value = 'Fecha de Envio';
  worksheet.getRow(2).getCell(3).value = 'Numero de envio';
  worksheet.getRow(2).getCell(4).value = 'Ciudad';
  worksheet.getRow(2).getCell(5).value = 'Rural';
  worksheet.getRow(2).getCell(6).value = 'Local';
  // worksheet.getRow(2).getCell(7).value = 'Cliente';
  worksheet.getRow(2).getCell(7).value = 'Ciudad';
  worksheet.getRow(2).getCell(8).value = 'Rural';
  worksheet.getRow(2).getCell(9).value = 'Local';
  worksheet.getRow(2).getCell(10).value = 'Contenido';
  worksheet.getRow(2).getCell(11).value = 'Peso (Kg)';
  worksheet.getRow(2).getCell(12).value = 'Precio (Bs)';
  worksheet.getRow(2).getCell(13).value = 'Servicio';

  // Merging cells to create the "Entrega" header spanning multiple columns
  worksheet.mergeCells('O1:R1'); // Combina las celdas de las columnas O a R en la primera fila
  worksheet.getCell('O1').value = 'Entrega'; // Coloca el título "Entrega" en la celda combinada
  worksheet.getCell('O1').alignment = { horizontal: 'center', vertical: 'middle' }; // Centra el texto
  worksheet.getCell('O1').font = { bold: true, size: 14 }; // Aplica un estilo de fuente
  worksheet.getCell('O1').fill = { 
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '891113' } // Color verde para toda la celda
  };

  // Aplica los subtítulos debajo del título "Entrega"
  worksheet.getRow(2).getCell(14).value = 'Fecha y hora';
  worksheet.getRow(2).getCell(15).value = 'Entregado';
  worksheet.getRow(2).getCell(16).value = 'Cartero';
  worksheet.getRow(2).getCell(17).value = 'Observaciones';

  worksheet.getRow(1).eachCell({ includeEmpty: true }, function(cell) {
    cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
});

worksheet.getRow(2).eachCell({ includeEmpty: true }, function(cell) {
    cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
});

      let totalPrice = 0;
      let totalPriceWithDiscount = 0;
      let totalPriceWithRetention = 0;
      let totalWeight = 0;
      let totalDiscount = 0;
      let totalRetention = 0;

      for (let i = 0; i < filteredData.length; i++) {
        const m = filteredData[i];

        const precioOriginal = parseFloat(m.nombre_d) || 0;

        // Cálculo de descuento basado en días de diferencia
        const descuento = parseInt(m.tarifa.descuento) || 0;
        let diasDiferencia = 0;
        const fechaEntrega = m.fecha_d ? new Date(m.fecha_d.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')) : null;

        if (fechaEntrega) {
          const fechaLimiteEntrega = new Date(m.fecha_recojo_c.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
          diasDiferencia = Math.floor((fechaEntrega - fechaLimiteEntrega) / (1000 * 60 * 60 * 24));
        }

        let descuentoTotal = 0;
        if (diasDiferencia > 0) {
          descuentoTotal = (precioOriginal * (descuento / 100)) * diasDiferencia;
        }
        const precioConDescuento = precioOriginal - descuentoTotal;

        // Cálculo de retención
        const retencion = parseFloat(m.tarifa.retencion) || 0;
        const descuentoRetencion = (precioOriginal * retencion) / 100;
        const precioConRetencion = precioOriginal - descuentoRetencion;

        //////////////////////
        const row = worksheet.addRow({
          index: i + 1,
          fecha: m.fecha_recojo_c,
          guia: m.guia,
          sucursal_origen: m.sucursale.origen,
          direccion: m.direccion_especifica ? 'X' : '', // Si tiene contenido, muestra 'X', de lo contrario 'N/A'
          local: m.direccion && m.direccion.zona ? 'X' : '', // Si tiene contenido, muestra 'X', de lo contrario 'N/A'
          servicio: m.tarifa.departamento,
          ciudad: m.ciudad ? 'X' : '', // Si tiene contenido, muestra 'X', de lo contrario 'N/A'
          zona: m.zona_d ? 'X' : '', // Si tiene contenido, muestra 'X', de lo contrario 'N/A'
          contenido: m.contenido,
          peso: m.peso_r ? m.peso_r : m.peso_v, // Si peso_r existe, lo muestra; si no, muestra peso_v
          precio: precioOriginal.toFixed(2),
          servicioT: m.tarifa.servicio,
          fecha_entrega: m.fecha_d,
          destinatario: m.destinatario,
          cartero: m.cartero_entrega ? m.cartero_entrega.nombre : 'Por asignar',
          observacion: m.observacion,
                    // sucursal: m.sucursale.nombre,

        });


        totalPrice += precioOriginal;
        totalDiscount += descuentoTotal;
        totalPriceWithDiscount += precioConDescuento;
        totalRetention += descuentoRetencion;
        totalPriceWithRetention += precioConRetencion;
        totalWeight += parseFloat(m.peso_v) || 0;

        const fillColor = i % 2 === 0 ? 'FFFFFF' : 'FFFFFF';
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

      // Añadir fila de total de precio
      const totalRow = worksheet.addRow({
        zona: 'Total', // Etiqueta
        peso: totalWeight.toFixed(3) + ' Kg', // Total de peso
        precio: totalPrice.toFixed(2) + ' Bs', // Total de precio original
      });

      // Añadir fila de total de descuento justo debajo del total de precio
      const totalDiscountRow = worksheet.addRow({
        zona: 'Total Descuento: ', // Etiqueta vacía para mantener la alineación
        precio: '' + totalDiscount.toFixed(2) + ' Bs', // Total de descuento
      });

      // Añadir fila de total de retención justo debajo del total de descuento
      const totalRetentionRow = worksheet.addRow({
        zona: 'Total Retención: ', // Etiqueta vacía para mantener la alineación
        precio: '' + totalRetention.toFixed(2) + ' Bs', // Total de retención
      });

      // Estilizar las filas de totales
      [totalRow, totalDiscountRow, totalRetentionRow].forEach(row => {
        row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
          if (colNumber === 1) {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'right' };
          }
          if ([11, 12, 13, 14, 15].includes(colNumber)) { // Resaltar los totales de precio, descuento, y retención
            cell.font = { bold: true };
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFFF' }
            };
            cell.border = {
              top: { style: 'thick' },
              left: { style: 'thick' },
              bottom: { style: 'thick' },
              right: { style: 'thick' }
            };
          }
        });
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












  },




  mounted() {
    this.$nextTick(async () => {
      await this.fetchSucursales();
      await this.GET_DATA(this.apiUrl);
      this.load = false;

      console.log('Usuario cargado:', this.user);
      console.log('Datos cargados después de montaje:', this.list);

      this.list = this.list.filter(item => item.estado === 4 || item.estado === 7);
      console.log('Datos después del filtrado inicial:', this.list);
    });
  },
};
</script>

<style scoped>
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
  background-color: #007bff;
  color: white;
}
</style>
