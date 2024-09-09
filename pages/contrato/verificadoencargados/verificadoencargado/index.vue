<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <!-- Filtros -->
        <div class="row justify-content-end mb-3">
          <div class="col-md-2 d-flex align-items-end">
            <button @click="generarReporte" class="btn btn-success btn-sm w-100">
  <i class="fas fa-file-excel"></i> Generar Reporte en Excel
</button>
          </div>
          <div class="col-3">
            <input v-model="searchTerm" type="text" class="form-control" placeholder="Buscar..." />
          </div>
        </div>
        <div class="row justify-content-end mb-3">
          <!-- Filtro Fecha Inicio -->
          <div class="col-md-3">
            <label for="startDate" class="form-label">Fecha Inicio</label>
            <input v-model="startDate" type="date" id="startDate" class="form-control" />
          </div>
          <!-- Filtro Fecha Fin -->
          <div class="col-md-3">
            <label for="endDate" class="form-label">Fecha Fin</label>
            <input v-model="endDate" type="date" id="endDate" class="form-control" />
          </div>
         <!-- Filtro Sucursal -->
         <div class="col-md-2">
            <label for="sucursal" class="form-label">Sucursal</label>
            <v-select 
  :options="sucursales" 
  v-model="selectedSucursales" 
  label="nombre"
  :reduce="sucursal => sucursal.id" 
  placeholder="Buscar sucursales..."
  multiple>
  <template #option="option">
    <div>
      {{ option.nombre }}
    </div>
  </template>
  <template #selected-option="option">
    <div>
      {{ option.nombre }}
    </div>
  </template>
</v-select>
          </div>
          <!-- Filtro Departamento de la Sucursal -->
          <div class="col-md-2">
            <label for="origen" class="form-label">Departamento de la sucursal</label>
            <select v-model="selectedOrigen" class="form-control" id="origen">
              <option value="">Todos</option>
              <option value="LPB">La Paz (LPB)</option>
              <option value="SRZ">Santa Cruz (SRZ)</option>
              <option value="CBB">Cochabamba (CBB)</option>
              <option value="ORU">Oruro (ORU)</option>
              <option value="PTI">Potosí (PTI)</option>
              <option value="TJA">Tarija (TJA)</option>
              <option value="SRE">Sucre (SRE)</option>
              <option value="BEN">Trinidad (TDD)</option>
              <option value="CIJ">Cobija (CIJ)</option>
            </select>
          </div>
          <!-- Filtro Departamento de Envío -->
          <div class="col-md-2">
            <label for="departamento" class="form-label">Departamento de envío</label>
            <select v-model="selectedDepartamento" class="form-control" id="departamento">
              <option value="">Todos</option>
              <option value="LPB">La Paz (LPB)</option>
              <option value="SRZ">Santa Cruz (SRZ)</option>
              <option value="CBB">Cochabamba (CBB)</option>
              <option value="ORU">Oruro (ORU)</option>
              <option value="PTI">Potosí (PTI)</option>
              <option value="TJA">Tarija (TJA)</option>
              <option value="SRE">Sucre (SRE)</option>
              <option value="BEN">Trinidad (TDD)</option>
              <option value="CIJ">Cobija (CIJ)</option>
            </select>
          </div>
        </div>

        <!-- Tabla de Resultados -->
        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                SOLICITUDES VERIFICADAS
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                    <th class="py-0 px-1">#</th>
                    <th class="py-0 px-1">Sucursal</th>
                    <th class="py-0 px-1">Cartero Recogida</th>
                    <th class="py-0 px-1">Cartero Entrega</th>
                    <th class="py-0 px-1">Guía</th>
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
                    <th class="py-0 px-1">Justificación</th>
                    <th class="py-0 px-1">Imagen Justificación</th>
                    <th class="py-0 px-1">Fecha devolución</th>
                    <th class="py-0 px-1">Imagen devolución</th>
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
                    <td class="py-0 px-1">{{ m.peso_r ? m.peso_r : m.peso_v }}</td>
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
          </div>
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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
export default {
  name: "IndexPage",
  components: {
    BCollapse,
    BModal,
    vSelect // Aquí solo necesitas definir el componente una vez

  },
  data() {
    return {
      selectedSucursales: [], // Sucursales seleccionadas (array)
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
      selectedOrigen: '', // Nuevo filtro Origen
      selectedDepartamento: '', // Nuevo filtro Departamento
      origenes: ['Origen 1', 'Origen 2', 'Origen 3'], // Ejemplo de datos para Origen
      departamentos: ['Departamento 1', 'Departamento 2', 'Departamento 3'], // Ejemplo de datos para Departamento
    };
  },
  computed: {
    filteredData() {
  const searchTerm = this.searchTerm.toLowerCase();
  const startDate = this.startDate ? new Date(this.startDate) : null;
  const endDate = this.endDate ? new Date(this.endDate) : null;

  if (endDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  return this.list.filter(item => {
    const isMatchingSucursales = !this.selectedSucursales.length || this.selectedSucursales.includes(item.sucursale?.id);
    const isMatchingOrigen = !this.selectedOrigen || item.sucursale?.origen === this.selectedOrigen;
    const isMatchingDepartamento = !this.selectedDepartamento || item.tarifa?.departamento === this.selectedDepartamento;
    const isMatchingState = item.estado === 4 || item.estado === 7;

    if (!item.fecha_d) {
      return false; // Si fecha_d es null o undefined, omitir este item
    }

    const [day, month, year, hour, minute] = item.fecha_d.split(/[\s/:]+/);
    const itemDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);

    const isWithinDateRange = (!startDate || (itemDate && itemDate >= startDate)) && (!endDate || (itemDate && itemDate <= endDate));

    return isMatchingSucursales && isMatchingOrigen && isMatchingDepartamento && isMatchingState &&
      isWithinDateRange &&
      Object.values(item).some(value => String(value).toLowerCase().includes(searchTerm));
  });
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

    async obtenerSaldoRestanteTodasSucursales() {
    try {
      // Obtener la fecha de la última vez que se mostró la alerta desde el localStorage
      const lastAlertDate = localStorage.getItem('lastAlertDate');
      const today = new Date().toLocaleDateString();

      // Si la alerta ya fue mostrada hoy, no hacer nada
      if (lastAlertDate === today) {
        return;
      }

      const response = await this.$contratos.$get('/restantessaldo4');
      console.log('Respuesta de la API:', response);

      if (response && response.length > 0) {
        const sucursalesConSaldoBajo = response;
        const cantidadSucursales = sucursalesConSaldoBajo.length;

        // Mostrar la alerta con la cantidad de sucursales
        const result = await this.$swal.fire({
          icon: 'warning',
          title: 'Sucursales con Saldo Bajo',
          text: `Hay ${cantidadSucursales} sucursales con saldo bajo.`,
          confirmButtonText: 'Aceptar',
          showCancelButton: true,
          cancelButtonText: 'Ver más detalles',
          customClass: {
            content: 'text-left'
          }
        });

        // Verifica la acción del usuario
        if (result.dismiss === this.$swal.DismissReason.cancel) {
          // Si el usuario hizo clic en "Ver más detalles"
          this.generarPDF(sucursalesConSaldoBajo);
        }

        // Guardar la fecha de hoy en el localStorage para evitar que la alerta se muestre nuevamente hoy
        localStorage.setItem('lastAlertDate', today);
      } else {
        throw new Error('La respuesta de la API no contiene sucursales.');
      }
    } catch (e) {
      console.error('Error al obtener los saldos restantes:', e);
      this.$swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener el saldo restante de las sucursales.',
        confirmButtonText: 'Aceptar'
      });
    }
  },


    generarPDF(sucursales) {
  const docDefinition = {
    content: [
      { text: 'Listado de Sucursales con Saldo Bajo', style: 'header' },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*', '*'], // Aumentamos el número de columnas
          body: [
            ['Sucursal', 'Contacto Administrativo', 'Saldo Restante (Bs)', 'Límite Total (Bs)', 'Porcentaje Restante (%)'],
            ...sucursales.map(sucursal => [
              sucursal.sucursal || 'N/A',
              sucursal.contacto_administrativo || 'N/A', // Proporciona un valor predeterminado si está indefinido
              sucursal.saldo_restante || 'N/A',
              sucursal.limite_total || 'N/A',
              sucursal.saldo_restante && sucursal.limite_total
                ? ((sucursal.saldo_restante / sucursal.limite_total) * 100).toFixed(2) + '%'
                : 'N/A'
            ])
          ]
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      }
    }
  };

  pdfMake.createPdf(docDefinition).download('sucursales_saldo_bajo.pdf');
}


,

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

    async generarReporte() {
  if (this.selectedSucursales.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Sin sucursales seleccionadas',
      text: 'Por favor, seleccione al menos una sucursal para generar el reporte.',
    });
    return;
  }

  if (this.selectedSucursales.length === 1) {
    // Generar reporte para una sola sucursal
    await this.exportToExcel();
  } else if (this.selectedSucursales.length > 1) {
    // Generar reporte para múltiples sucursales
    await this.generarReporteMultiplesSucursales();
  }
},
    async generarReporteMultiplesSucursales() {
  if (this.selectedSucursales.length < 2) {
    return; // Solo genera el reporte si hay más de una sucursal seleccionada
  }

  const filteredData = this.paginatedData.filter(item => this.selectedSucursales.includes(item.sucursale?.id));

  if (filteredData.length === 0) {
    await Swal.fire({
      icon: 'info',
      title: 'Sin datos',
      text: 'No hay datos disponibles para los criterios seleccionados.',
    });
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reporte Múltiples Sucursales');

  // Cargar la imagen usando la ruta correcta
  const base64Image = await this.loadImageAsBase64(require('@/pages/admin/auth/img/reportelogo.png'));

  // Añadir la imagen en la parte superior
  const imageId = workbook.addImage({
    base64: base64Image,
    extension: 'png',
  });

  worksheet.addImage(imageId, {
    tl: { col: 2, row: 0 }, // Posición superior izquierda
    ext: { width: 750, height: 75 } // Ajustar el tamaño según sea necesario
  });

  // Ajustar las fechas y sumar un día para corregir el desfase
  const startDate = new Date(this.startDate);
  startDate.setDate(startDate.getDate() + 1); // Sumar un día
  const endDate = new Date(this.endDate);
  endDate.setDate(endDate.getDate() + 1); // Sumar un día

  const options = { month: 'long' }; // Para obtener el nombre completo del mes
  const startMonth = startDate.toLocaleDateString('es-BO', options);
  const endMonth = endDate.toLocaleDateString('es-BO', options);

  // Añadir una fila con el rango de meses (formateado) en la columna correcta
  const rangoMesesRow = worksheet.addRow([]);
  worksheet.mergeCells('C8:F8'); // Ajusta el rango según el tamaño que necesites
  worksheet.getCell('C8').value = `${startMonth}`;
  worksheet.getCell('C8').font = { bold: true };
  worksheet.getCell('C8').alignment = { horizontal: 'center' }; // Centrar el texto horizontalmente

// Insertar filas vacías antes del encabezado para que los títulos comiencen en la fila 7
for (let i = 0; i < 0; i++) {
    worksheet.addRow([]);
}

// Añadir manualmente los títulos en la fila 7
const titleRow = worksheet.addRow(['', '', 'REGIONALES', 'PESO (Kg)', 'TOTAL GUIAS', 'SUB TOTAL (Bs)']);
titleRow.eachCell((cell, colNumber) => {
  if (colNumber >= 3) { // Solo aplicar el estilo a las columnas desde C en adelante
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF9BBB59' }, // Color verde
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  }
});

// Configurar las columnas (sin usar `header`)
worksheet.columns = [
  { key: 'empty1', width: 20 }, // Columna vacía para desplazar el contenido a la columna C
  { key: 'empty2', width: 20 }, // Segunda columna vacía
  { key: 'regional', width: 30 },
  { key: 'peso', width: 15 },
  { key: 'totalGuias', width: 15 },
  { key: 'subtotal', width: 20 },
];
    // Estilo de encabezado
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF9BBB59' }, // Color verde
    };

    // Bordes para las celdas
    const borderStyle = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // Agrupar los datos por sucursal
    const sucursalesMap = {};

    filteredData.forEach(item => {
      const sucursalId = item.sucursale.id;
      const sucursalNombre = item.sucursale.nombre;
      const peso = item.peso_r ? parseFloat(item.peso_r) : parseFloat(item.peso_v) || 0;
      const subtotal = parseFloat(item.nombre_d) || 0;

      if (!sucursalesMap[sucursalId]) {
        sucursalesMap[sucursalId] = {
          nombre: sucursalNombre,
          peso: 0,
          totalGuias: 0,
          subtotal: 0
        };
      }

      sucursalesMap[sucursalId].peso += peso; // Sumar el peso correctamente
      sucursalesMap[sucursalId].totalGuias += 1; // Cada ítem es una guía
      sucursalesMap[sucursalId].subtotal += subtotal;
    });

    // Añadir filas al reporte
    Object.values(sucursalesMap).forEach((sucursal) => {
      const row = worksheet.addRow({
        regional: sucursal.nombre,
        peso: sucursal.peso.toFixed(3), // Mostrar con tres decimales
        totalGuias: sucursal.totalGuias,
        subtotal: sucursal.subtotal.toFixed(2)
      });

      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = borderStyle;
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });

    // Calcular totales
    const totalPeso = Object.values(sucursalesMap).reduce((acc, suc) => acc + suc.peso, 0);
    const totalGuias = Object.values(sucursalesMap).reduce((acc, suc) => acc + suc.totalGuias, 0);
    const totalSubtotal = Object.values(sucursalesMap).reduce((acc, suc) => acc + suc.subtotal, 0);

    // Añadir fila de totales
    const totalRow = worksheet.addRow({
      regional: 'TOTAL PESO',
      peso: totalPeso.toFixed(3),
      totalGuias: totalGuias,
      subtotal: totalSubtotal.toFixed(2)
    });

   // Aplicar estilos solo desde la columna C en adelante en la fila de totales
totalRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
  if (colNumber >= 3) { // Solo aplicar el estilo a las columnas desde C en adelante
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' } // Fondo amarillo
    };
    cell.font = { bold: true };
    cell.border = borderStyle;
  }
});


    // Fila adicional para total final en Bolivianos
    worksheet.addRow({});
    const totalFinalRow = worksheet.addRow({
      regional: 'TOTAL FINAL BOLIVIANOS',
      subtotal: `Bs ${totalSubtotal.toFixed(2)}`
    });

    totalFinalRow.getCell(1).alignment = { horizontal: 'left' };
    totalFinalRow.getCell(6).alignment = { horizontal: 'center' };
    totalFinalRow.getCell(6).font = { bold: true };
    totalFinalRow.getCell(6).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' } // Fondo amarillo
    };

    totalFinalRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = borderStyle;
    });

    // Añadir fila para el texto final
    worksheet.addRow({});
    const textoFinalRow = worksheet.addRow({
      regional: `SON: ${await this.convertirNumeroALetras(Math.floor(totalSubtotal))} 00/100 BOLIVIANOS`
    });

    textoFinalRow.getCell(1).alignment = { horizontal: 'center' };
    textoFinalRow.getCell(1).font = { italic: true };

    // Estilo de la celda con el total en bolivianos
    worksheet.getColumn('subtotal').numFmt = '"Bs"#,##0.00;[Red]"Bs"#,##0.00';

    // Añadir filas vacías después de la tabla
    const lastDataRow = worksheet.lastRow.number;
    const emptyRowsCount = 10;
    for (let i = 0; i < emptyRowsCount; i++) {
      worksheet.addRow({});
    }

    // Añadir las firmas 10 filas después del final de la tabla
    const signatureStartRow = lastDataRow + emptyRowsCount + 1;

    // Añadir las firmas
    worksheet.mergeCells(`C${signatureStartRow}:D${signatureStartRow}`);
    worksheet.getCell(`C${signatureStartRow}`).value = "Rodrigo L.Alquez Chavez";
    worksheet.getCell(`C${signatureStartRow}`).alignment = { horizontal: 'center' };
    worksheet.getCell(`C${signatureStartRow}`).font = { bold: true, color: { argb: 'FF006400' } };

    worksheet.mergeCells(`F${signatureStartRow}:F${signatureStartRow}`);
    worksheet.getCell(`F${signatureStartRow}`).value = "Williams David Chavez Ticona";
    worksheet.getCell(`F${signatureStartRow}`).alignment = { horizontal: 'center' };
    worksheet.getCell(`F${signatureStartRow}`).font = { bold: true };

    // Segunda fila de las firmas
    worksheet.mergeCells(`C${signatureStartRow + 1}:D${signatureStartRow + 1}`);
    worksheet.getCell(`C${signatureStartRow + 1}`).value = "AUX. DE CONTRATOS";
    worksheet.getCell(`C${signatureStartRow + 1}`).alignment = { horizontal: 'center' };
    worksheet.getCell(`C${signatureStartRow + 1}`).font = { italic: true };

    worksheet.mergeCells(`F${signatureStartRow + 1}:F${signatureStartRow + 1}`);
    worksheet.getCell(`F${signatureStartRow + 1}`).value = "ENCARGADO DE CONTRATOS";
    worksheet.getCell(`F${signatureStartRow + 1}`).alignment = { horizontal: 'center' };
    worksheet.getCell(`F${signatureStartRow + 1}`).font = { italic: true };

    // Tercera fila de las firmas
    worksheet.mergeCells(`C${signatureStartRow + 2}:D${signatureStartRow + 2}`);
    worksheet.getCell(`C${signatureStartRow + 2}`).value = "AGENCIA BOLIVIANA DE CORREOS";
    worksheet.getCell(`C${signatureStartRow + 2}`).alignment = { horizontal: 'center' };
    worksheet.getCell(`C${signatureStartRow + 2}`).font = { italic: true };

    worksheet.mergeCells(`F${signatureStartRow + 2}:F${signatureStartRow + 2}`);
    worksheet.getCell(`F${signatureStartRow + 2}`).value = "AGENCIA BOLIVIANA DE CORREOS";
    worksheet.getCell(`F${signatureStartRow + 2}`).alignment = { horizontal: 'center' };
    worksheet.getCell(`F${signatureStartRow + 2}`).font = { italic: true };

    // Guardar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Reporte_Multiples_Sucursales_Formateado.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  async convertirNumeroALetras(num) {
    const unidades = ['CERO', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];

    if (num < 10) return unidades[num];
    if (num < 20) return especiales[num - 10];
    if (num < 100) return decenas[Math.floor(num / 10)] + (num % 10 === 0 ? '' : ' Y ' + unidades[num % 10]);

    if (num < 1000) {
      if (num === 100) return 'CIEN';
      return unidades[Math.floor(num / 100)] + ' CIENTO ' + await this.convertirNumeroALetras(num % 100);
    }
    
    if (num < 1000000) {
      if (Math.floor(num / 1000) === 1) {
        return 'MIL ' + await this.convertirNumeroALetras(num % 1000);
      } else {
        return await this.convertirNumeroALetras(Math.floor(num / 1000)) + ' MIL ' + await this.convertirNumeroALetras(num % 1000);
      }
    }
    
    return 'NUMERO DEMASIADO GRANDE';
  },




    async exportToExcel() {
  const filteredData = this.filteredData; // Asegúrate de que solo se usen los datos filtrados

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

  // Cargar la imagen usando la ruta correcta
  const base64Image = await this.loadImageAsBase64(require('@/pages/admin/auth/img/reportelogo.png'));
  
  // Añadir la imagen en la parte superior
  const imageId = workbook.addImage({
    base64: base64Image,
    extension: 'png',
  });

  worksheet.addImage(imageId, {
    tl: { col: 0, row: 0 }, // Posición superior izquierda
    ext: { width: 1000, height: 150 } // Ajusta el ancho y la altura según sea necesario
  });

  // Insertar filas en blanco debajo de la imagen
  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow([]);

  // Añadir la información en la parte superior del Excel
  worksheet.mergeCells('A11:B11');
  worksheet.getCell('A11').value = 'ORIGEN:';
  worksheet.getCell('C11').value = filteredData[0]?.sucursale?.origen || 'N/A';

  worksheet.mergeCells('A12:B12');
  worksheet.getCell('A12').value = 'SERVICIO:';
  worksheet.getCell('C12').value = filteredData[0]?.tarifa?.servicio || 'N/A';

  worksheet.mergeCells('A13:B13');
  worksheet.getCell('A13').value = 'CLIENTE:';
  worksheet.getCell('C13').value = filteredData[0]?.sucursale?.nombre || 'N/A';

 // Convertir la fecha a formato "DD/MM/YYYY"
const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Ajustar la fecha final añadiendo un día para el rango
const startDate = this.startDate ? new Date(this.startDate) : new Date();
startDate.setDate(startDate.getDate() + 1);
const endDateAdjusted = this.endDate ? new Date(this.endDate) : new Date();
endDateAdjusted.setDate(endDateAdjusted.getDate() + 1);

// Asegúrate de que la fecha de inicio no tenga ajustes de hora no deseados
const formattedStartDate = formatDate(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
const formattedEndDateAdjusted = formatDate(endDateAdjusted);

worksheet.mergeCells('A14:B14');
worksheet.getCell('A14').value = 'PERIODO:';
worksheet.getCell('C14').value = `${formattedStartDate} - ${formattedEndDateAdjusted}`;


  // Define las columnas
  worksheet.columns = [
    { header: '', key: 'index', width: 5 },
    { header: '', key: 'fecha', width: 20 },
    { header: '', key: 'guia', width: 20 },
    { header: '', key: 'sucursal_origen', width: 20 },
    { header: '', key: 'municipio', width: 30 },
    { header: '', key: 'local', width: 30 },
    { header: '', key: 'servicio', width: 20 },
    { header: '', key: 'ciudad', width: 15 },
    { header: '', key: 'zona', width: 20 },
    { header: '', key: 'contenido', width: 20 },
    { header: '', key: 'peso', width: 10 },
    { header: '', key: 'precio', width: 10 },
    { header: '', key: 'servicioT', width: 10 },
    { header: '', key: 'fecha_entrega', width: 20 },
    { header: '', key: 'destinatario', width: 20 },
    { header: '', key: 'cartero', width: 20 },
    { header: '', key: 'observacion', width: 25 },
  ];

  // Merging cells to create the "Envío" header spanning multiple columns
  worksheet.mergeCells('A16:M16'); 
  worksheet.getCell('B16').value = 'Envío'; 
  worksheet.getCell('B16').alignment = { horizontal: 'center', vertical: 'middle' }; 
  worksheet.getCell('B16').font = { bold: true, size: 14 }; 
  worksheet.getCell('B16').fill = { 
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '32FF0E' } // Color verde para toda la celda
  };

  worksheet.getRow(17).getCell(1).value = '#';
  worksheet.getRow(17).getCell(2).value = 'Fecha de Envio';
  worksheet.getRow(17).getCell(3).value = 'Numero de envio';
  worksheet.getRow(17).getCell(4).value = 'Ciudad';
  worksheet.getRow(17).getCell(5).value = 'Rural';
  worksheet.getRow(17).getCell(6).value = 'Local';
  worksheet.getRow(17).getCell(7).value = 'Ciudad';
  worksheet.getRow(17).getCell(8).value = 'Rural';
  worksheet.getRow(17).getCell(9).value = 'Local';
  worksheet.getRow(17).getCell(10).value = 'Contenido';
  worksheet.getRow(17).getCell(11).value = 'Peso (Kg)';
  worksheet.getRow(17).getCell(12).value = 'Precio (Bs)';
  worksheet.getRow(17).getCell(13).value = 'Servicio';

  worksheet.mergeCells('N16:R16'); 
  worksheet.getCell('O16').value = 'Entrega'; 
  worksheet.getCell('O16').alignment = { horizontal: 'center', vertical: 'middle' }; 
  worksheet.getCell('O16').font = { bold: true, size: 14 }; 
  worksheet.getCell('O16').fill = { 
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '891113' }
  };

  worksheet.getRow(17).getCell(14).value = 'Fecha y hora Entrega';
  worksheet.getRow(17).getCell(15).value = 'Entregado a';
  worksheet.getRow(17).getCell(16).value = 'Cartero';
  worksheet.getRow(17).getCell(17).value = 'Observaciones';

  worksheet.getRow(16).eachCell({ includeEmpty: true }, function(cell) {
    cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
  });

  worksheet.getRow(17).eachCell({ includeEmpty: true }, function(cell) {
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

  filteredData.forEach((m, index) => {
    const precioOriginal = parseFloat(m.nombre_d) || 0;

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

    const retencion = parseFloat(m.tarifa.retencion) || 0;
    const descuentoRetencion = (precioOriginal * retencion) / 100;
    const precioConRetencion = precioOriginal - descuentoRetencion;

    const row = worksheet.addRow({
      index: index + 1,
      fecha: m.fecha_envio_regional,
      guia: m.guia,
      sucursal_origen: m.sucursale.origen,
      direccion: m.direccion_especifica ? 'X' : '',
      local: m.direccion && m.direccion.zona ? 'X' : '',
      servicio: m.tarifa.departamento,
      ciudad: m.ciudad ? 'X' : '',
      zona: m.zona_d ? 'X' : '',
      contenido: m.contenido,
      peso: m.peso_r ? m.peso_r : m.peso_v,
      precio: precioOriginal.toFixed(2),
      servicioT: m.tarifa.servicio,
      fecha_entrega: m.fecha_d,
      destinatario: m.destinatario,
      cartero: m.cartero_entrega ? m.cartero_entrega.nombre : 'Por asignar',
      observacion: m.observacion,
    });

    totalPrice += precioOriginal;
    totalDiscount += descuentoTotal;
    totalPriceWithDiscount += precioConDescuento;
    totalRetention += descuentoRetencion;
    totalPriceWithRetention += precioConRetencion;
    const peso = m.peso_r ? parseFloat(m.peso_r) : (m.peso_v ? parseFloat(m.peso_v) : 0);
totalWeight += peso;

    const fillColor = index % 2 === 0 ? 'FFFFFF' : 'FFFFFF';
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
  });

  // Añadir fila de total de precio
  const totalRow = worksheet.addRow({
    zona: 'Total', 
    peso: totalWeight.toFixed(3) + ' Kg', 
    precio: totalPrice.toFixed(2) + ' Bs', 
  });

  // Añadir fila de total de descuento justo debajo del total de precio
  const totalDiscountRow = worksheet.addRow({
    zona: 'Total Descuento: ', 
    precio: '' + totalDiscount.toFixed(2) + ' Bs', 
  });

  // Añadir fila de total de retención justo debajo del total de descuento
  const totalRetentionRow = worksheet.addRow({
    zona: 'Total Retención: ', 
    precio: '' + totalRetention.toFixed(2) + ' Bs', 
  });

  // Estilizar las filas de totales
  [totalRow, totalDiscountRow, totalRetentionRow].forEach(row => {
    row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
      if (colNumber === 1) {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'right' };
      }
      if ([11, 12, 13, 14, 15].includes(colNumber)) { 
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
    row.height = 15;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Solicitudes_Entregadas.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
},

async loadImageAsBase64(path) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'Anonymous'; // Permite cargar imágenes incluso si están en un servidor diferente
      image.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
      };
      image.onerror = reject;
      image.src = path; // Aquí es donde usas la ruta de la imagen
    });
  }









  },




  mounted() {
    this.$nextTick(async () => {
      await this.obtenerSaldoRestanteTodasSucursales();
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
  background-color: #007bff;
  color: white;
}
</style>
