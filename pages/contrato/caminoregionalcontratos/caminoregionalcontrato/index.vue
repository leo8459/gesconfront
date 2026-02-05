<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-3">
            <input v-model="searchTerm" type="text" class="form-control" placeholder="Buscar..." />
          </div>
        </div>
        <!-- Filtros en una sola línea -->
        <div class="row mb-3">
          <!-- Filtro Sucursal -->
          <div class="col-md-2">
            <label for="sucursal" class="form-label">Sucursal</label>
            <select v-model="selectedSucursal" id="sucursal" class="form-control">
              <option value="">Todas</option>
              <option v-for="sucursal in sucursales" :key="sucursal.id" :value="sucursal.id">
                {{ dash(sucursal.nombre) }}
              </option>
            </select>
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

          <!-- Filtro Fecha Inicio -->
          <div class="col-md-2">
            <label for="startDate" class="form-label">Fecha Inicio</label>
            <input v-model="startDate" type="date" id="startDate" class="form-control" />
          </div>

          <!-- Filtro Fecha Fin -->
          <div class="col-md-2">
            <label for="endDate" class="form-label">Fecha Fin</label>
            <input v-model="endDate" type="date" id="endDate" class="form-control" />
          </div>

          <!-- Botón Generar Reporte en PDF -->
          <div class="col-md-2 d-flex align-items-end">
            <button @click="exportToPDF" class="btn btn-danger btn-sm w-100">
              <i class="fas fa-file-pdf"></i> Generar Reporte en PDF
            </button>
          </div>
        </div>

        <!-- Filtro de Búsqueda -->
       

        <!-- Tabla de Resultados -->
        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                SOLICITUDES EN CAMINO A REGIONAL
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                    <th class="py-0 px-1">#</th>
                    <th class="py-0 px-1">Sucursal</th>
                   
                    <th class="py-0 px-1">Guia</th>
                    <th class="py-0 px-1">Peso Correos (Kg)</th>
                  
                    <th class="py-0 px-1">Contenido</th>
                    <th class="py-0 px-1">Fecha</th>
                    <th class="py-0 px-1">Destinatario</th>
                   
                    <th class="py-0 px-1">Precio (Bs)</th>

                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(m, i) in paginatedData" :key="m.id">
                    <td class="py-0 px-1">{{ i + 1 + (currentPage - 1) * itemsPerPage }}</td>
                    <td class="p-1">{{ m.sucursale ? m.sucursale.nombre : '' }}</td>
                   
                    <td class="py-0 px-1">{{ dash(m.guia) }}</td>
                    <td class="py-0 px-1">{{ m.peso_r ? m.peso_r : m.peso_v }}</td>
                    
                    <td class="py-0 px-1">{{ dash(m.contenido) }}</td>
                    <td class="py-0 px-1">{{ dash(m.fecha_recojo_c) }}</td>
                    <td class="py-0 px-1">{{ dash(m.destinatario) }}</td>
                   
                    <td class="py-0 px-1">{{ dash(m.nombre_d) }}</td>
                    
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

            <div class="d-flex justify-content-between align-items-center mt-3">
              <button class="btn btn-secondary" :disabled="currentPage === 1" @click="prevPage">Anterior</button>
              <span>Página {{ dash(currentPage) }} de {{ dash(totalPages) }}</span>
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
        {{ dash(pageNumber) }}
      </button>
      <span v-else class="page-link disabled">...</span>
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

  const filtered = this.list.filter(item => {
    console.log('Verificando item:', item); // Para depurar cada item

    const isMatchingSucursal = !this.selectedSucursal || item.sucursale?.id === this.selectedSucursal;
    const isMatchingOrigen = !this.selectedOrigen || item.sucursale?.origen === this.selectedOrigen;
    const isMatchingDepartamento = !this.selectedDepartamento || item.tarifa?.departamento === this.selectedDepartamento;
    const isMatchingState = item.estado === 8 || item.estado === 9; // Verifica que el estado sea 8 o 9

    // Elimina la validación de fecha_d para que no excluya items sin fecha_d
    const isWithinDateRange = true;

    const result = isMatchingSucursal && isMatchingOrigen && isMatchingDepartamento && isMatchingState && isWithinDateRange &&
      Object.values(item).some(value => String(value).toLowerCase().includes(searchTerm));

    if (result) {
      console.log('Item pasó el filtro:', item);
    } else {
      console.log('Item no pasó el filtro:', item);
    }

    return result;
  });

  console.log('Filtered Data:', filtered); // Verifica los datos filtrados
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
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const maxPagesToShow = 3;

    const pages = [];
    // Mostrar los primeros 3 números
    for (let i = 1; i <= Math.min(maxPagesToShow, totalPages); i++) {
      pages.push(i);
    }

    // Mostrar puntos suspensivos si hay más páginas
    if (currentPage > maxPagesToShow + 1) {
      pages.push('...');
    }

    // Mostrar las páginas alrededor de la página actual
    const startPage = Math.max(currentPage - 1, maxPagesToShow + 1);
    const endPage = Math.min(currentPage + 1, totalPages - maxPagesToShow);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Mostrar puntos suspensivos si hay más páginas después
    if (currentPage < totalPages - maxPagesToShow) {
      pages.push('...');
    }

    // Mostrar los últimos 3 números
    for (let i = Math.max(totalPages - maxPagesToShow + 1, endPage + 1); i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  },
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

  // Añadir los títulos justo encima de los datos
  worksheet.addRow([
    'Fecha Envio Regional',
    'Guía',
    'Origen',
    'Destino',
    'Peso (Kg)',
    'Cliente'
  ]);

  // Configurar el ancho de las columnas manualmente
  worksheet.getColumn(1).width = 25; // Fecha Envio Regional
  worksheet.getColumn(2).width = 20; // Guía
  worksheet.getColumn(3).width = 20; // Origen
  worksheet.getColumn(4).width = 20; // Destino
  worksheet.getColumn(5).width = 15; // Peso (Kg)
  worksheet.getColumn(6).width = 25; // Cliente

  // Agrega los datos filtrados justo debajo de los títulos
  filteredData.forEach((m, index) => {
    const row = worksheet.addRow([
      m.fecha_envio_regional || 'N/A',
      m.guia || 'N/A',
      m.sucursale?.origen || 'N/A',
      m.tarifa?.departamento || 'N/A',
      m.peso_r || m.peso_v || 'N/A',
      m.sucursale?.nombre || 'N/A',
    ]);

    // Estilizar las filas alternadas
    const fillColor = index % 2 === 0 ? 'FFFFFF' : 'F0F0F0';
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

  worksheet.eachRow({ includeEmpty: true }, function (row) {
    row.height = 15;
  });

  // Generar y descargar el archivo Excel
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Solicitudes_Entregadas.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
},
async exportToPDF() {
  const filteredData = this.filteredData; // Asegúrate de que solo se usen los datos filtrados

  if (filteredData.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Sin datos',
      text: 'No hay datos disponibles para los criterios seleccionados.',
    });
    return;
  }

  const doc = new jsPDF('portrait', 'mm', 'a4');
  const logo = await this.loadImageAsBase64(require('@/pages/admin/auth/img/reportelogo.png'));

  // Añadir el logo en la parte superior
  doc.addImage(logo, 'PNG', 10, 10, 190, 30);

  // Añadir información adicional
  doc.setFontSize(10);
  doc.text(`ORIGEN: ${filteredData[0]?.sucursale?.origen || 'N/A'}`, 10, 50);
  doc.text(`SERVICIO: ${filteredData[0]?.tarifa?.servicio || 'N/A'}`, 10, 55);
  doc.text(`CLIENTE: ${filteredData[0]?.sucursale?.nombre || 'N/A'}`, 10, 60);

  // Añadir la tabla de datos
  const columns = [
    { header: 'Fecha Envio Regional', dataKey: 'fecha_envio_regional' },
    { header: 'Guía', dataKey: 'guia' },
    { header: 'Origen', dataKey: 'sucursal_origen' },
    { header: 'Destino', dataKey: 'departamento' },
    { header: 'Peso (Kg)', dataKey: 'peso' },
    { header: 'Cliente', dataKey: 'nombre_sucursal' },
  ];

  const rows = filteredData.map(m => ({
    fecha_envio_regional: m.fecha_envio_regional || 'N/A',
    guia: m.guia || 'N/A',
    sucursal_origen: m.sucursale?.origen || 'N/A',
    departamento: m.tarifa?.departamento || 'N/A',
    peso: m.peso_r || m.peso_v || 'N/A',
    nombre_sucursal: m.sucursale?.nombre || 'N/A',
  }));

  doc.autoTable({
    startY: 70,
    head: [columns.map(col => col.header)],
    body: rows.map(row => columns.map(col => row[col.dataKey])),
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [0, 0, 139] }, // Color azul para los títulos
    alternateRowStyles: { fillColor: [240, 240, 240] }, // Color gris claro para filas alternadas
  });

  // Guardar el PDF
  doc.save('Solicitudes_Entregadas.pdf');
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

    this.list = this.list.filter(item => item.estado === 8 || item.estado === 9); // Cambia aquí los estados a 8 y 9
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
  background-color: #34447C;
  color: white;
}
</style>
