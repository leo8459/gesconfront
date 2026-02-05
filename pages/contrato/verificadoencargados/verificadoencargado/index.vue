<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <!-- Filtros -->
        <div class="row justify-content-end mb-3">
          <div class="col-md-2">
            <button @click="mostrarSaldoRestanteManual" class="btn btn-warning w-100">
              Ver Sucursales con Saldo Bajo
            </button>
            <!-- {{ dash(user.user) }} -->
          </div>
          <div class="col-md-2 d-flex align-items-end">
            <button @click="elegirTipoDeReporte" class="btn btn-success btn-sm w-100">
              <i class="fas fa-file-excel"></i> Generar Reporte en Excel
            </button>
          </div>
          <div class="col-md-2">
            <button @click="mostrarResumen = !mostrarResumen" class="btn btn-primary w-100">
              {{ mostrarResumen ? 'Mostrar Todo' : 'Mostrar Resumen' }}
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
            <v-select :options="sucursales" v-model="selectedSucursales" label="nombre"
              :reduce="sucursal => sucursal.id" placeholder="Buscar sucursales..." multiple>
              <template #option="option">
                <div>
                  {{ dash(option.nombre) }}
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

        <!-- Tabla de Resultados Completa -->
        <div v-if="!mostrarResumen" class="row">
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
                        <th class="py-0 px-1">Teléfono Destinatario</th>
                        <th class="py-0 px-1">Empresa que Cancela</th>

                        <th class="py-0 px-1">Dirección Destinatario</th>
                        <th class="py-0 px-1">Zona</th>
                        <th class="py-0 px-1">Ciudad/Provincia</th>
                        <th class="py-0 px-1">Firma Destinatario</th>
                        <th class="py-0 px-1">Precio (Bs)</th>
                        <th class="py-0 px-1">Fecha de Entrega</th>
                        <th class="py-0 px-1">Imagen Capturada</th>
                        <th class="py-0 px-1">Justificación</th>
                        <th class="py-0 px-1">PDF Justificación</th> <!-- Nueva columna para descargar PDF -->
                        <th class="py-0 px-1">Imagen Justificación</th>
                        <th class="py-0 px-1">Fecha devolución</th>
                        <th class="py-0 px-1">Imagen devolución</th>
                        <th class="py-0 px-1"></th>
                      </tr>
                    </thead>
                   <tbody>
  <tr v-for="(m, i) in paginatedData" :key="m?.id ?? i">
    <td class="py-0 px-1">{{ (currentPage - 1) * itemsPerPage + i + 1 }}</td>

    <td class="p-1">{{ m?.sucursale?.nombre ?? 'SIN SUCURSAL' }}</td>
    <td class="p-1">{{ m?.cartero_recogida?.nombre ?? 'Por asignar' }}</td>
    <td class="p-1">{{ m?.cartero_entrega?.nombre ?? 'Por asignar' }}</td>

    <td class="py-0 px-1">{{ m?.guia ?? '-' }}</td>
    <td class="py-0 px-1">{{ m?.peso_o ?? '-' }}</td>
    <td class="py-0 px-1">{{ (m?.peso_r ?? m?.peso_v) ?? '-' }}</td>

    <td class="py-0 px-1">{{ m?.remitente ?? '-' }}</td>

    <td class="py-0 px-1">{{ m?.direccion?.direccion_especifica ?? 'NULL' }}</td>
    <td class="py-0 px-1">{{ m?.direccion?.zona ?? 'NULL' }}</td>
    <td class="py-0 px-1">{{ m?.direccion?.direccion ?? 'NULL' }}</td>

    <td class="py-0 px-1">{{ m?.telefono ?? '-' }}</td>
    <td class="py-0 px-1">{{ m?.contenido ?? '-' }}</td>
    <td class="py-0 px-1">{{ m?.fecha_recojo_c ?? '-' }}</td>

    <td class="py-0 px-1">{{ m?.destinatario ?? '-' }}</td>
    <td class="py-0 px-1">{{ m?.telefono_d ?? '-' }}</td>

    <td class="py-0 px-1">{{ m?.sucursale?.pagador ?? 'S/N' }}</td>

    <td class="py-0 px-1">
      <a
        v-if="m?.direccion_d && isCoordinates(m.direccion_d)"
        :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d"
        target="_blank"
        class="btn btn-primary btn-sm"
      >
        Ver mapa
      </a>
      <span v-else>{{ m?.direccion_d ?? '-' }}</span>
    </td>

    <td class="py-0 px-1">{{ m?.zona_d ?? '-' }}</td>
    <td class="py-0 px-1">{{ m?.ciudad ?? '-' }}</td>

    <td class="py-0 px-1">
      <img v-if="m?.firma_d" :src="m.firma_d" alt="Firma Destino" width="100" />
      <span v-else>-</span>
    </td>

    <!-- Precio -->
    <td class="py-0 px-1">{{ m?.nombre_d ?? '-' }}</td>

    <td class="py-0 px-1">{{ m?.fecha_d ?? '-' }}</td>

    <!-- Imagen capturada -->
    <td class="py-0 px-1">
      <button v-if="m?.imagen" @click="downloadImage(m.imagen)" class="btn btn-sm btn-primary mt-1">
        Descargar
      </button>
      <span v-else>-</span>
    </td>

    <td class="py-0 px-1">{{ m?.justificacion ?? '-' }}</td>

    <!-- PDF -->
    <td class="py-0 px-1">
      <button v-if="m?.pdf_justificacion" @click="downloadPDF(m.pdf_justificacion)" class="btn btn-sm btn-primary mt-1">
        Descargar PDF
      </button>
      <span v-else>No PDF</span>
    </td>

    <!-- Imagen justificación -->
    <td class="py-0 px-1">
      <button v-if="m?.imagen_justificacion" @click="downloadImage(m.imagen_justificacion)" class="btn btn-sm btn-primary mt-1">
        Descargar
      </button>
      <span v-else>-</span>
    </td>

    <td class="py-0 px-1">{{ m?.fecha_devolucion ?? '-' }}</td>

    <td class="py-0 px-1">
      <button v-if="m?.imagen_devolucion" @click="downloadImage(m.imagen_devolucion)" class="btn btn-sm btn-primary mt-1">
        Descargar
      </button>
      <span v-else>-</span>
    </td>

    <td class="py-0 px-1">
      <div class="btn-group">
        <nuxtLink v-if="m?.id" :to="url_editar + m.id" class="btn btn-info btn-sm py-1 px-2">
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
            <div class="pagination-controls d-flex justify-content-center mt-3">
              <ul class="pagination">
                <li v-for="pageNumber in totalPagesArray" :key="pageNumber"
                  :class="['page-item', { active: currentPage === pageNumber }]">
                  <button v-if="pageNumber !== '...'" class="page-link" @click="goToPage(pageNumber)">
                    {{ pageNumber }}
                  </button>
                  <span v-else class="page-link disabled">...</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        <!-- Tabla de Resumen -->
        <div v-if="mostrarResumen" class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                RESUMEN DE SOLICITUDES VERIFICADAS
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>
                        <th class="py-0 px-1">Cartero Entrega</th>
                        <th class="py-0 px-1">Guía</th>
                        <th class="py-0 px-1">Peso (Kg)</th>
                        <th class="py-0 px-1">Fecha de Entrega</th>
                        <th class="py-0 px-1">Firma</th>
                        <th class="py-0 px-1">Imagen Capturada</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedData" :key="m.id">
                        <td class="py-0 px-1">{{ i + 1 + (currentPage - 1) * itemsPerPage }}</td>
                        <td class="p-1">{{ m.sucursale ? m.sucursale.nombre : '' }}</td>
                        <td class="p-1">{{ m.cartero_entrega ? m.cartero_entrega.nombre : 'Por asignar' }}</td>
                        <td class="py-0 px-1">{{ m.guia }}</td>
                        <td class="py-0 px-1">{{ m.peso_r ? m.peso_r : m.peso_v }}</td>
                        <td class="py-0 px-1">{{ m.fecha_d }}</td>
                        <td class="py-0 px-1">
                          <img v-if="m.firma_d" :src="m.firma_d" alt="Firma Destino" width="100" />
                        </td>
                        <td class="py-0 px-1">
                          <div class="d-flex flex-column align-items-center">
                            <button v-if="m.imagen" @click="downloadImage(m.imagen)"
                              class="btn btn-sm btn-primary mt-1 align-self-start">
                              Descargar
                            </button>
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
import { openDB } from 'idb';

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
      mostrarResumen: false,  // Inicia mostrando la tabla completa
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
  const searchTerm = (this.searchTerm || '').toLowerCase();

  return (this.list || []).filter(item => {

    // 🔴 FILTRO CLAVE: SOLO CON SUCURSAL
    if (!item?.sucursale || !item?.sucursale?.id) {
      return false;
    }

    // Estado válido (ajusta si usas otros)
    const estadoValido = item.estado === 4 || item.estado === 7;

    // Búsqueda segura
    const matchSearch = [
      item.guia,
      item.remitente,
      item.destinatario,
      item.telefono,
      item.telefono_d,
      item.ciudad,
      item.zona_d,
      item.sucursale.nombre
    ]
      .filter(v => v !== null && v !== undefined)
      .some(v => String(v).toLowerCase().includes(searchTerm));

    return estadoValido && matchSearch;
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
      const totalPages = this.totalPages;
      const currentPage = this.currentPage;
      const maxPagesToShow = 3; // Número de páginas iniciales y finales visibles

      const pages = [];
      // Agregar los primeros n números
      for (let i = 1; i <= Math.min(maxPagesToShow, totalPages); i++) {
        pages.push(i);
      }

      // Agregar los puntos suspensivos si corresponde
      if (currentPage > maxPagesToShow + 1) {
        pages.push('...');
      }

      // Agregar los números alrededor de la página actual
      const startPage = Math.max(currentPage - 1, maxPagesToShow + 1);
      const endPage = Math.min(currentPage + 1, totalPages - maxPagesToShow);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Agregar los puntos suspensivos si corresponde
      if (currentPage < totalPages - maxPagesToShow) {
        pages.push('...');
      }

      // Agregar los últimos n números
      for (let i = Math.max(totalPages - maxPagesToShow + 1, endPage + 1); i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    },

  },
  methods: {
    downloadPDF(pdfDataUrl) {
      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = 'justificacion.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    ,
    async obtenerSaldoRestanteTodasSucursales() {
      try {
        const lastAlertDate = localStorage.getItem('lastAlertDate');
        const today = new Date().toLocaleDateString();

        // Mostrar la alerta automáticamente solo si no se mostró hoy
        if (lastAlertDate !== today) {
          await this.mostrarSaldoRestante();
          localStorage.setItem('lastAlertDate', today); // Guardar la fecha de hoy
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

    async mostrarSaldoRestante() {
      // Esta función siempre mostrará la alerta
      try {
        const response = await this.$contratos.$get('/restantessaldo4');
        if (response && response.length > 0) {
          const sucursalesConSaldoBajo = response;
          const cantidadSucursales = sucursalesConSaldoBajo.length;

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

          if (result.dismiss === this.$swal.DismissReason.cancel) {
            this.generarPDF(sucursalesConSaldoBajo);
          }
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

    mostrarSaldoRestanteManual() {
      // Esta función permite que el botón muestre la alerta manualmente
      this.mostrarSaldoRestante();
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
    async elegirTipoDeReporte() {
      const { value: tipoReporte } = await Swal.fire({
        title: 'Selecciona el tipo de reporte',
        input: 'radio',
        inputOptions: {
          'detallado': 'Generar Reporte Detallado',
          'resumido': 'Generar Reporte Resumido'
        },
        inputValidator: (value) => {
          if (!value) {
            return 'Debes seleccionar una opción!';
          }
        },
        confirmButtonText: 'Generar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      });

      if (tipoReporte) {
        if (tipoReporte === 'detallado') {
          await this.generarReporteMultiplesSucursales(); // Generar reporte detallado
        } else if (tipoReporte === 'resumido') {
          await this.generarReporteResumido(); // Generar reporte resumido
        }
      }
    },

    async generarReporteResumido() {
      const workbook = new ExcelJS.Workbook();
      const base64Image = await this.loadImageAsBase64(require('@/pages/admin/auth/img/reportelogo.png'));

      // Filtrar los datos según las sucursales seleccionadas
      const filteredData = this.filteredData.filter(item => this.selectedSucursales.includes(item.sucursale?.id));

      if (filteredData.length === 0) {
        await Swal.fire({
          icon: 'info',
          title: 'Sin datos',
          text: 'No hay datos disponibles para los criterios seleccionados.',
        });
        return;
      }

      // Generar hojas por cada sucursal seleccionada
      for (let sucursalId of this.selectedSucursales) {
        const sucursalData = filteredData.filter(item => item.sucursale?.id === sucursalId);
        if (sucursalData.length === 0) continue;

        const sucursalName = sucursalData[0].sucursale.nombre || 'Sucursal';
        const worksheet = workbook.addWorksheet(sucursalName);

        const imageId = workbook.addImage({
          base64: base64Image,
          extension: 'png',
        });
        worksheet.addImage(imageId, {
          tl: { col: 0, row: 0 },
          ext: { width: 500, height: 100 },
        });

        // Espacio para el logo
        for (let i = 0; i < 10; i++) {
          worksheet.addRow([]);
        }

        worksheet.mergeCells('A11:B11');
        worksheet.getCell('A11').value = 'ORIGEN:';
        worksheet.getCell('C11').value = sucursalData[0].sucursale.origen || 'S/N';

        worksheet.mergeCells('A12:B12');
        worksheet.getCell('A12').value = 'SERVICIO:';
        worksheet.getCell('C12').value = sucursalData[0].tarifa?.servicio || 'S/N';

        worksheet.mergeCells('A13:B13');
        worksheet.getCell('A13').value = 'CLIENTE:';
        worksheet.getCell('C13').value = 'EBA LA PAZ';

        worksheet.mergeCells('A14:B14');
        worksheet.getCell('A14').value = 'PERIODO:';
        worksheet.getCell('C14').value = `${this.startDate} - ${this.endDate}`;

        // Añadir los encabezados de las columnas en la fila 17
        const headerRow = worksheet.getRow(17);
        headerRow.values = [
          '#', 'Fecha de Envío', 'Número de Envío', 'Sucursal Origen', 'Dirección', 'Local',
          'Servicio', 'Ciudad', 'Zona', 'Contenido', 'Peso (Kg)', 'Precio (Bs)', 'Observaciones'
        ];

        headerRow.eachCell((cell) => {
          cell.font = { bold: true };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          // Aplicar colores de fondo a los encabezados
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF9BBB59' } // Verde claro
          };
        });

        // Definir las columnas del reporte resumido
        worksheet.columns = [
          { key: 'index', width: 5 },
          { key: 'fecha', width: 20 },
          { key: 'guia', width: 20 },
          { key: 'sucursal_origen', width: 20 },
          { key: 'direccion', width: 15 },
          { key: 'local', width: 10 },
          { key: 'servicio', width: 15 },
          { key: 'ciudad', width: 10 },
          { key: 'zona', width: 15 },
          { key: 'contenido', width: 20 },
          { key: 'peso', width: 10 },
          { key: 'precio', width: 10 },
          { key: 'observacion', width: 25 },
        ];

        // Añadir los datos
        sucursalData.forEach((m, index) => {
          const peso = m.peso_r ? parseFloat(m.peso_r) : (m.peso_v ? parseFloat(m.peso_v) : 0);
          const precio = m.nombre_d ? parseFloat(m.nombre_d) : 0;

          worksheet.addRow({
            index: index + 1,
            fecha: m.fecha_d || 'S/N',
            guia: m.guia || 'S/N',
            sucursal_origen: m.sucursale?.origen || 'S/N',
            direccion: m.direccion_especifica ? 'X' : 'S/N',
            local: m.direccion && m.direccion.zona ? 'X' : 'S/N',
            servicio: m.tarifa?.departamento || 'S/N',
            ciudad: m.ciudad ? 'X' : 'S/N',
            zona: m.zona_d ? 'X' : 'S/N',
            contenido: m.contenido || 'S/N',
            peso: peso.toFixed(3),
            precio: precio.toFixed(2),
            observacion: m.observacion || 'S/N',
          });
        });
      }

      // Crear la hoja resumen
      const resumenSheet = workbook.addWorksheet('Resumen');

      // Agregar el logo en el resumen
      const imageId = workbook.addImage({
        base64: base64Image,
        extension: 'png',
      });
      resumenSheet.addImage(imageId, {
        tl: { col: 2, row: 4 },
        ext: { width: 500, height: 100 },
      });

      resumenSheet.mergeCells('B1:F1');
      resumenSheet.getCell('B1').value = 'Resumen';
      resumenSheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };
      resumenSheet.getCell('B1').font = { bold: true, size: 14 };
      resumenSheet.getCell('B1').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFD700' } // Amarillo
      };

      resumenSheet.mergeCells('B11:F11');
      resumenSheet.getCell('B11').value = `Mes ${new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date())}`;
      resumenSheet.getCell('B11').alignment = { horizontal: 'center', vertical: 'middle' };
      resumenSheet.getCell('B11').font = { bold: true };

      // Agregar columnas del resumen
      resumenSheet.columns = [
        { key: 'index', width: 5 },
        { key: 'sucursal', width: 30 },
        { key: 'peso_total', width: 15 },
        { key: 'total_guias', width: 15 },
        { key: 'subtotal', width: 20 }
      ];

      const headerRowResumen = resumenSheet.getRow(13);
      headerRowResumen.values = ['#', 'Sucursal', 'Peso Total (Kg)', 'Total Guías', 'Subtotal (Bs)'];
      headerRowResumen.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF9BBB59' } // Verde claro
        };
      });

      let totalPeso = 0;
      let totalGuias = 0;
      let totalSubtotal = 0;

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

        sucursalesMap[sucursalId].peso += peso;
        sucursalesMap[sucursalId].totalGuias += 1;
        sucursalesMap[sucursalId].subtotal += subtotal;
      });

      Object.values(sucursalesMap).forEach((sucursal, index) => {
        totalPeso += sucursal.peso;
        totalGuias += sucursal.totalGuias;
        totalSubtotal += sucursal.subtotal;

        const row = resumenSheet.addRow({
          index: index + 1,
          sucursal: sucursal.nombre,
          peso_total: sucursal.peso.toFixed(3),
          total_guias: sucursal.totalGuias,
          subtotal: sucursal.subtotal.toFixed(2)
        });

        row.eachCell((cell) => {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      // Fila de totales
      const totalRow = resumenSheet.addRow({
        sucursal: 'TOTAL',
        peso_total: totalPeso.toFixed(3),
        total_guias: totalGuias,
        subtotal: totalSubtotal.toFixed(2)
      });

      totalRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFD700' } // Amarillo para totales
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Añadir espacio para firmas
      for (let i = 0; i < 5; i++) {
        resumenSheet.addRow([]);
      }

      // FIRMAS
      const firmaRow = resumenSheet.addRow([]);

      // Aquí reemplazamos por el nombre y apellido del usuario logueado
      resumenSheet.mergeCells(`B${firmaRow.number}:C${firmaRow.number}`);
      resumenSheet.getCell(`B${firmaRow.number}`).value = `${this.user.user.nombre} ${this.user.user.apellidos}`;
      resumenSheet.getCell(`B${firmaRow.number}`).font = { bold: true, italic: true, size: 12 };
      resumenSheet.getCell(`B${firmaRow.number}`).alignment = { horizontal: 'center', vertical: 'middle' };

      resumenSheet.mergeCells(`B${firmaRow.number + 1}:C${firmaRow.number + 1}`);
      resumenSheet.getCell(`B${firmaRow.number + 1}`).value = 'AUX. DE CONTRATOS';
      resumenSheet.getCell(`B${firmaRow.number + 1}`).alignment = { horizontal: 'center', vertical: 'middle' };

      resumenSheet.mergeCells(`B${firmaRow.number + 2}:C${firmaRow.number + 2}`);
      resumenSheet.getCell(`B${firmaRow.number + 2}`).value = 'AGENCIA BOLIVIANA DE CORREOS';
      resumenSheet.getCell(`B${firmaRow.number + 2}`).alignment = { horizontal: 'center', vertical: 'middle' };

      // Resto de firma (sin cambios)
      resumenSheet.mergeCells(`E${firmaRow.number}:F${firmaRow.number}`);
      resumenSheet.getCell(`E${firmaRow.number}`).value = 'Williams David Chavez Ticona';
      resumenSheet.getCell(`E${firmaRow.number}`).font = { bold: true, italic: true, size: 12 };
      resumenSheet.getCell(`E${firmaRow.number}`).alignment = { horizontal: 'center', vertical: 'middle' };

      resumenSheet.mergeCells(`E${firmaRow.number + 1}:F${firmaRow.number + 1}`);
      resumenSheet.getCell(`E${firmaRow.number + 1}`).value = 'ENCARGADO DE CONTRATOS';
      resumenSheet.getCell(`E${firmaRow.number + 1}`).alignment = { horizontal: 'center', vertical: 'middle' };

      resumenSheet.mergeCells(`E${firmaRow.number + 2}:F${firmaRow.number + 2}`);
      resumenSheet.getCell(`E${firmaRow.number + 2}`).value = 'AGENCIA BOLIVIANA DE CORREOS';
      resumenSheet.getCell(`E${firmaRow.number + 2}`).alignment = { horizontal: 'center', vertical: 'middle' };

      // Guardar el archivo Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Reporte_Multiples_Sucursales_Resumido.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }





    ,



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
      const workbook = new ExcelJS.Workbook();

      // Función para cargar la imagen en base64
      async function loadImageAsBase64(path) {
        const response = await fetch(path);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      const base64Image = await this.loadImageAsBase64(require('@/pages/admin/auth/img/reportelogo.png'));
      // Formatear las fechas de inicio y fin del periodo
      const formatDate = (date) => {
        if (!date) return 'S/N';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const startDate = this.startDate ? new Date(this.startDate) : new Date();
      const endDateAdjusted = this.endDate ? new Date(this.endDate) : new Date();
      endDateAdjusted.setDate(endDateAdjusted.getDate() + 1);

      const formattedStartDate = formatDate(startDate);
      const formattedEndDateAdjusted = formatDate(endDateAdjusted);

      // Obtener el mes en texto a partir de la fecha de inicio
      const selectedMonth = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(startDate);

      // Filtrar los datos según las sucursales seleccionadas
      const filteredData = this.filteredData.filter(item => this.selectedSucursales.includes(item.sucursale?.id));

      if (filteredData.length === 0) {
        await Swal.fire({
          icon: 'info',
          title: 'Sin datos',
          text: 'No hay datos disponibles para los criterios seleccionados.',
        });
        return;
      }

      // Generar hojas por cada sucursal seleccionada
      for (let sucursalId of this.selectedSucursales) {
        const sucursalData = filteredData.filter(item => item.sucursale?.id === sucursalId);
        if (sucursalData.length === 0) continue;

        const sucursalName = sucursalData[0].sucursale.nombre || 'Sucursal';

        // Crear una nueva hoja para cada sucursal
        const worksheet = workbook.addWorksheet(sucursalName);

        // Agregar el logo e información de la sucursal
        const imageId = workbook.addImage({
          base64: base64Image,
          extension: 'png',
        });
        worksheet.addImage(imageId, {
          tl: { col: 0, row: 0 },
          ext: { width: 500, height: 100 }, // Ajustar el tamaño si es necesario
        });

        // Insertar filas vacías debajo de la imagen para separar el contenido
        for (let i = 0; i < 10; i++) {
          worksheet.addRow([]);
        }

        // Añadir información de origen, servicio y cliente
        worksheet.mergeCells('A11:B11');
        worksheet.getCell('A11').value = 'ORIGEN:';
        worksheet.getCell('C11').value = sucursalData[0].sucursale.origen || 'S/N';

        worksheet.mergeCells('A12:B12');
        worksheet.getCell('A12').value = 'SERVICIO:';
        worksheet.getCell('C12').value = sucursalData[0].tarifa?.servicio || 'S/N';

        worksheet.mergeCells('A13:B13');
        worksheet.getCell('A13').value = 'CLIENTE:';
        worksheet.getCell('C13').value = 'EBA LA PAZ';

        // Añadir periodo
        worksheet.mergeCells('A14:B14');
        worksheet.getCell('A14').value = 'PERIODO:';
        worksheet.getCell('C14').value = `${formattedStartDate} - ${formattedEndDateAdjusted}`;

        // Definir las columnas del reporte
        worksheet.columns = [
          { header: '#', key: 'index', width: 5 },
          { header: 'Fecha de Envío', key: 'fecha', width: 20 },
          { header: 'Número de Envío', key: 'guia', width: 20 },
          { header: 'Sucursal Origen', key: 'sucursal_origen', width: 20 },
          { header: 'Dirección', key: 'direccion', width: 15 },
          { header: 'Local', key: 'local', width: 10 },
          { header: 'Servicio', key: 'servicio', width: 15 },
          { header: 'Ciudad', key: 'ciudad', width: 10 },
          { header: 'Zona', key: 'zona', width: 15 },
          { header: 'Contenido', key: 'contenido', width: 20 },
          { header: 'Peso (Kg)', key: 'peso', width: 10 },
          { header: 'Precio (Bs)', key: 'precio', width: 10 },
          { header: 'Servicio T.', key: 'servicioT', width: 15 },
          { header: 'Fecha y Hora Entrega', key: 'fecha_entrega', width: 20 },
          { header: 'Destinatario', key: 'destinatario', width: 20 },
          { header: 'Cartero', key: 'cartero', width: 20 },
          { header: 'Observaciones', key: 'observacion', width: 25 },
        ];

        // Encabezados agrupados para "Envío" y "Entrega"
        worksheet.mergeCells('A16:M16');
        worksheet.getCell('A16').value = 'Envío';
        worksheet.getCell('A16').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A16').font = { bold: true, size: 14 };
        worksheet.getCell('A16').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF9BBB59' } // Color verde
        };

        worksheet.mergeCells('N16:R16');
        worksheet.getCell('N16').value = 'Entrega';
        worksheet.getCell('N16').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('N16').font = { bold: true, size: 14 };
        worksheet.getCell('N16').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFC0504D' } // Color rojo
        };

        // Añadir los encabezados de las columnas en la fila 17
        const headerRow = worksheet.getRow(17);
        headerRow.values = [
          '#', 'Fecha de Envío', 'Número de Envío', 'Sucursal Origen', 'Dirección', 'Local',
          'Servicio', 'Ciudad', 'Zona', 'Contenido', 'Peso (Kg)', 'Precio (Bs)', 'Servicio T.',
          'Fecha y Hora Entrega', 'Destinatario', 'Cartero', 'Observaciones'
        ];

        // Procesar y añadir los datos de cada sucursal
        sucursalData.forEach((m, index) => {
          const peso = m.peso_r ? parseFloat(m.peso_r) : (m.peso_v ? parseFloat(m.peso_v) : 0);
          const precio = m.nombre_d ? parseFloat(m.nombre_d) : 0;

          worksheet.addRow({
            index: index + 1,
            fecha: m.fecha_d || 'S/N',
            guia: m.guia || 'S/N',
            sucursal_origen: m.sucursale?.origen || 'S/N',
            direccion: m.direccion_especifica ? 'X' : 'S/N',
            local: m.direccion && m.direccion.zona ? 'X' : 'S/N',
            servicio: m.tarifa?.departamento || 'S/N',
            ciudad: m.ciudad ? 'X' : 'S/N',
            zona: m.zona_d ? 'X' : 'S/N',
            contenido: m.contenido || 'S/N',
            peso: peso.toFixed(3),
            precio: precio.toFixed(2),
            servicioT: m.tarifa?.servicio || 'S/N',
            fecha_entrega: m.fecha_d || 'S/N',
            destinatario: m.destinatario || 'S/N',
            cartero: m.cartero_entrega ? m.cartero_entrega.nombre : 'Por asignar',
            observacion: m.observacion || 'S/N',
          });
        });
      }

      // Crear la hoja resumen final
      const resumenSheet = workbook.addWorksheet('Resumen');

      // Agregar el logo en el resumen
      const imageId = workbook.addImage({
        base64: base64Image,
        extension: 'png',
      });
      resumenSheet.addImage(imageId, {
        tl: { col: 2, row: 4 }, // Ajustamos la imagen como en el ejemplo
        ext: { width: 500, height: 100 }, // Ajustar el tamaño si es necesario
      });

      // Título "Resumen"
      resumenSheet.mergeCells('B1:F1');
      resumenSheet.getCell('B1').value = 'Resumen';
      resumenSheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };
      resumenSheet.getCell('B1').font = { bold: true, size: 14 };
      resumenSheet.getCell('B1').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFD700' } // Color amarillo como en la imagen
      };

      // Campo del Mes
      resumenSheet.mergeCells('B11:F11');
      resumenSheet.getCell('B11').value = `Mes ${selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}`;
      resumenSheet.getCell('B11').alignment = { horizontal: 'center', vertical: 'middle' };
      resumenSheet.getCell('B11').font = { bold: true };

      // Agregar las columnas del resumen
      resumenSheet.columns = [
        { key: 'index', width: 5 },
        { key: 'sucursal', width: 30 },
        { key: 'peso_total', width: 15 },
        { key: 'total_guias', width: 15 },
        { key: 'subtotal', width: 20 }
      ];

      // Añadir encabezados
      const headerRow = resumenSheet.getRow(13); // Colocado después de las filas vacías
      headerRow.values = ['#', 'Sucursal', 'Peso Total (Kg)', 'Total Guías', 'Subtotal (Bs)'];
      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF9BBB59' } // Color verde claro como en la imagen
        };
      });

      let totalPeso = 0;
      let totalGuias = 0;
      let totalSubtotal = 0;

      // Agrupar los datos por sucursal y añadir las filas
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

        sucursalesMap[sucursalId].peso += peso;
        sucursalesMap[sucursalId].totalGuias += 1;
        sucursalesMap[sucursalId].subtotal += subtotal;
      });

      // Añadir filas al resumen
      Object.values(sucursalesMap).forEach((sucursal, index) => {
        totalPeso += sucursal.peso;
        totalGuias += sucursal.totalGuias;
        totalSubtotal += sucursal.subtotal;

        const row = resumenSheet.addRow({
          index: index + 1,
          sucursal: sucursal.nombre,
          peso_total: sucursal.peso.toFixed(3),
          total_guias: sucursal.totalGuias,
          subtotal: sucursal.subtotal.toFixed(2)
        });

        row.eachCell((cell) => {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      // Fila de totales
      const totalRow = resumenSheet.addRow({
        sucursal: 'TOTAL',
        peso_total: totalPeso.toFixed(3),
        total_guias: totalGuias,
        subtotal: totalSubtotal.toFixed(2)
      });

      totalRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFD700' } // Color amarillo claro como en la imagen para los totales
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Añadir 5 filas vacías antes de las firmas
      for (let i = 0; i < 5; i++) {
        resumenSheet.addRow([]);
      }

      // Añadir espacio para firmas en la hoja de resumen
      const firmaRow = resumenSheet.addRow([]);

      resumenSheet.mergeCells(`B${firmaRow.number}:C${firmaRow.number}`);
      resumenSheet.getCell(`B${firmaRow.number}`).value = `${this.user.user.nombre} ${this.user.user.apellidos}`;
      resumenSheet.getCell(`B${firmaRow.number}`).font = { bold: true, italic: true, size: 12 };
      resumenSheet.getCell(`B${firmaRow.number}`).alignment = { horizontal: 'center', vertical: 'middle' };

      resumenSheet.mergeCells(`B${firmaRow.number + 1}:C${firmaRow.number + 1}`);
      resumenSheet.getCell(`B${firmaRow.number + 1}`).value = 'AUX. DE CONTRATOS';
      resumenSheet.getCell(`B${firmaRow.number + 1}`).alignment = { horizontal: 'center', vertical: 'middle' };

      resumenSheet.mergeCells(`B${firmaRow.number + 2}:C${firmaRow.number + 2}`);
      resumenSheet.getCell(`B${firmaRow.number + 2}`).value = 'AGENCIA BOLIVIANA DE CORREOS';
      resumenSheet.getCell(`B${firmaRow.number + 2}`).alignment = { horizontal: 'center', vertical: 'middle' };

      resumenSheet.mergeCells(`E${firmaRow.number}:F${firmaRow.number}`);
      resumenSheet.getCell(`E${firmaRow.number}`).value = 'Williams David Chavez Ticona';
      resumenSheet.getCell(`E${firmaRow.number}`).font = { bold: true, italic: true, size: 12 };
      resumenSheet.getCell(`E${firmaRow.number}`).alignment = { horizontal: 'center', vertical: 'middle' };

      resumenSheet.mergeCells(`E${firmaRow.number + 1}:F${firmaRow.number + 1}`);
      resumenSheet.getCell(`E${firmaRow.number + 1}`).value = 'ENCARGADO DE CONTRATOS';
      resumenSheet.getCell(`E${firmaRow.number + 1}`).alignment = { horizontal: 'center', vertical: 'middle' };

      resumenSheet.mergeCells(`E${firmaRow.number + 2}:F${firmaRow.number + 2}`);
      resumenSheet.getCell(`E${firmaRow.number + 2}`).value = 'AGENCIA BOLIVIANA DE CORREOS';
      resumenSheet.getCell(`E${firmaRow.number + 2}`).alignment = { horizontal: 'center', vertical: 'middle' };

      // Guardar el archivo Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Reporte_Multiples_Sucursales_Resumen.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }






    ,

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




    async elegirTipoDeReporteUnicaSucursal() {
      const { value: tipoReporte } = await Swal.fire({
        title: 'Selecciona el tipo de reporte',
        input: 'radio',
        inputOptions: {
          'detallado': 'Generar Reporte Detallado',
          'resumido': 'Generar Reporte Resumido'
        },
        inputValidator: (value) => {
          if (!value) {
            return 'Debes seleccionar una opción!';
          }
        },
        confirmButtonText: 'Generar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      });

      if (tipoReporte) {
        if (tipoReporte === 'detallado') {
          await this.generarReporteUnicaSucursalDetallado(); // Generar reporte detallado
        } else if (tipoReporte === 'resumido') {
          await this.generarReporteUnicaSucursalResumido(); // Generar reporte resumido
        }
      }
    },

    async generarReporteUnicaSucursalDetallado() {
      const workbook = new ExcelJS.Workbook();
      const base64Image = await this.loadImageAsBase64(require('@/pages/admin/auth/img/reportelogo.png'));

      // Filtrar los datos para la única sucursal seleccionada
      const filteredData = this.filteredData.filter(item => this.selectedSucursales.includes(item.sucursale?.id));

      if (filteredData.length === 0) {
        await Swal.fire({
          icon: 'info',
          title: 'Sin datos',
          text: 'No hay datos disponibles para los criterios seleccionados.',
        });
        return;
      }

      const sucursalData = filteredData; // La única sucursal seleccionada
      const sucursalName = sucursalData[0].sucursale.nombre || 'Sucursal';

      // Crear una hoja para la sucursal seleccionada
      const worksheet = workbook.addWorksheet(sucursalName);

      // Añadir el logo y algunos datos
      const imageId = workbook.addImage({
        base64: base64Image,
        extension: 'png',
      });
      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 500, height: 100 },
      });

      for (let i = 0; i < 10; i++) {
        worksheet.addRow([]);
      }

      worksheet.mergeCells('A11:B11');
      worksheet.getCell('A11').value = 'ORIGEN:';
      worksheet.getCell('C11').value = sucursalData[0].sucursale.origen || 'S/N';

      worksheet.mergeCells('A12:B12');
      worksheet.getCell('A12').value = 'SERVICIO:';
      worksheet.getCell('C12').value = sucursalData[0].tarifa?.servicio || 'S/N';

      worksheet.mergeCells('A13:B13');
      worksheet.getCell('A13').value = 'CLIENTE:';
      worksheet.getCell('C13').value = 'EBA LA PAZ';

      worksheet.mergeCells('A14:B14');
      worksheet.getCell('A14').value = 'PERIODO:';
      worksheet.getCell('C14').value = `${this.startDate} - ${this.endDate}`;

      // Añadir los encabezados de las columnas en la fila 17
      const headerRow = worksheet.getRow(17);
      headerRow.values = [
        '#', 'Fecha de Envío', 'Número de Envío', 'Sucursal Origen', 'Dirección', 'Local',
        'Servicio', 'Ciudad', 'Zona', 'Contenido', 'Peso (Kg)', 'Precio (Bs)', 'Observaciones'
      ];

      headerRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF9BBB59' } // Color verde claro para los encabezados
        };
      });

      // Definir las columnas del reporte detallado
      worksheet.columns = [
        { key: 'index', width: 5 },
        { key: 'fecha', width: 20 },
        { key: 'guia', width: 20 },
        { key: 'sucursal_origen', width: 20 },
        { key: 'direccion', width: 15 },
        { key: 'local', width: 10 },
        { key: 'servicio', width: 15 },
        { key: 'ciudad', width: 10 },
        { key: 'zona', width: 15 },
        { key: 'contenido', width: 20 },
        { key: 'peso', width: 10 },
        { key: 'precio', width: 10 },
        { key: 'observacion', width: 25 },
      ];

      // Añadir los datos
      sucursalData.forEach((m, index) => {
        const peso = m.peso_r ? parseFloat(m.peso_r) : (m.peso_v ? parseFloat(m.peso_v) : 0);
        const precio = m.nombre_d ? parseFloat(m.nombre_d) : 0;

        worksheet.addRow({
          index: index + 1,
          fecha: m.fecha_d || 'S/N',
          guia: m.guia || 'S/N',
          sucursal_origen: m.sucursale?.origen || 'S/N',
          direccion: m.direccion_especifica ? 'X' : 'S/N',
          local: m.direccion && m.direccion.zona ? 'X' : 'S/N',
          servicio: m.tarifa?.departamento || 'S/N',
          ciudad: m.ciudad ? 'X' : 'S/N',
          zona: m.zona_d ? 'X' : 'S/N',
          contenido: m.contenido || 'S/N',
          peso: peso.toFixed(3),
          precio: precio.toFixed(2),
          observacion: m.observacion || 'S/N',
        });
      });

      // Crear el resumen al final
      const resumenSheet = workbook.addWorksheet('Resumen');

      // Agregar el logo en el resumen
      const imageIdResumen = workbook.addImage({
        base64: base64Image,
        extension: 'png',
      });
      resumenSheet.addImage(imageIdResumen, {
        tl: { col: 2, row: 4 },
        ext: { width: 500, height: 100 },
      });

      resumenSheet.mergeCells('B1:F1');
      resumenSheet.getCell('B1').value = 'Resumen';
      resumenSheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };
      resumenSheet.getCell('B1').font = { bold: true, size: 14 };
      resumenSheet.getCell('B1').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFD700' } // Color amarillo
      };

      resumenSheet.mergeCells('B11:F11');
      resumenSheet.getCell('B11').value = `Mes ${new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date())}`;
      resumenSheet.getCell('B11').alignment = { horizontal: 'center', vertical: 'middle' };
      resumenSheet.getCell('B11').font = { bold: true };

      resumenSheet.columns = [
        { key: 'index', width: 5 },
        { key: 'sucursal', width: 30 },
        { key: 'peso_total', width: 15 },
        { key: 'total_guias', width: 15 },
        { key: 'subtotal', width: 20 }
      ];

      const headerRowResumen = resumenSheet.getRow(13);
      headerRowResumen.values = ['#', 'Sucursal', 'Peso Total (Kg)', 'Total Guías', 'Subtotal (Bs)'];
      headerRowResumen.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF9BBB59' } // Color verde claro para los encabezados
        };
      });

      const pesoTotal = sucursalData.reduce((total, item) => total + (item.peso_r || item.peso_v || 0), 0);
      const totalGuias = sucursalData.length;
      const totalSubtotal = sucursalData.reduce((total, item) => total + (parseFloat(item.nombre_d) || 0), 0);

      const resumenRow = resumenSheet.addRow({
        index: 1,
        sucursal: sucursalName,
        peso_total: pesoTotal.toFixed(3),
        total_guias: totalGuias,
        subtotal: totalSubtotal.toFixed(2)
      });

      resumenRow.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      const totalRow = resumenSheet.addRow({
        sucursal: 'TOTAL',
        peso_total: pesoTotal.toFixed(3),
        total_guias: totalGuias,
        subtotal: totalSubtotal.toFixed(2)
      });

      totalRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFD700' } // Color amarillo para totales
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Añadir las firmas
      for (let i = 0; i < 5; i++) {
        resumenSheet.addRow([]);
      }

      const firmaRow = resumenSheet.addRow([]);
      // En la sección de firmas, se reemplaza el nombre fijo por los datos del usuario logueado
      resumenSheet.mergeCells(`B${firmaRow.number}:C${firmaRow.number}`);
      resumenSheet.getCell(`B${firmaRow.number}`).value = `${this.user.user.nombre} ${this.user.user.apellidos}`; // Cambiado por el nombre y apellidos del usuario logueado
      resumenSheet.getCell(`B${firmaRow.number}`).font = { bold: true, italic: true, size: 12 };
      resumenSheet.getCell(`B${firmaRow.number}`).alignment = { horizontal: 'center', vertical: 'middle' };


      resumenSheet.mergeCells(`B${firmaRow.number + 1}:C${firmaRow.number + 1}`);
      resumenSheet.getCell(`B${firmaRow.number + 1}`).value = 'AUX. DE CONTRATOS';
      resumenSheet.getCell(`B${firmaRow.number + 1}`).alignment = { horizontal: 'center', vertical: 'middle' };

      resumenSheet.mergeCells(`B${firmaRow.number + 2}:C${firmaRow.number + 2}`);
      resumenSheet.getCell(`B${firmaRow.number + 2}`).value = 'AGENCIA BOLIVIANA DE CORREOS';
      resumenSheet.getCell(`B${firmaRow.number + 2}`).alignment = { horizontal: 'center', vertical: 'middle' };

      resumenSheet.mergeCells(`E${firmaRow.number}:F${firmaRow.number}`);
      resumenSheet.getCell(`E${firmaRow.number}`).value = 'Williams David Chavez Ticona';
      resumenSheet.getCell(`E${firmaRow.number}`).font = { bold: true, italic: true, size: 12 };
      resumenSheet.getCell(`E${firmaRow.number}`).alignment = { horizontal: 'center', vertical: 'middle' };

      resumenSheet.mergeCells(`E${firmaRow.number + 1}:F${firmaRow.number + 1}`);
      resumenSheet.getCell(`E${firmaRow.number + 1}`).value = 'ENCARGADO DE CONTRATOS';
      resumenSheet.getCell(`E${firmaRow.number + 1}`).alignment = { horizontal: 'center', vertical: 'middle' };

      resumenSheet.mergeCells(`E${firmaRow.number + 2}:F${firmaRow.number + 2}`);
      resumenSheet.getCell(`E${firmaRow.number + 2}`).value = 'AGENCIA BOLIVIANA DE CORREOS';
      resumenSheet.getCell(`E${firmaRow.number + 2}`).alignment = { horizontal: 'center', vertical: 'middle' };

      // Guardar el archivo Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Reporte_Sucursal_${sucursalName}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },


    async exportToExcel() {
      const filteredData = this.filteredData.filter(item =>
        this.selectedSucursales.length === 0 ||
        this.selectedSucursales.map(id => String(id)).includes(String(item.sucursale?.id))
      );

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

      // Cargar la imagen del logo y añadirla al Excel
      const base64Image = await this.loadImageAsBase64(require('@/pages/admin/auth/img/reportelogo.png'));
      const imageId = workbook.addImage({
        base64: base64Image,
        extension: 'png',
      });
      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 }, // Posición de la imagen
        ext: { width: 2000, height: 150 } // Tamaño de la imagen
      });

      // Insertar filas vacías debajo de la imagen para separar el contenido
      for (let i = 0; i < 10; i++) {
        worksheet.addRow([]);
      }

      // Añadir información de origen, servicio y cliente
      worksheet.mergeCells('A11:B11');
      worksheet.getCell('A11').value = 'ORIGEN:';
      worksheet.getCell('C11').value = filteredData[0]?.sucursale?.origen || 'S/N';

      worksheet.mergeCells('A12:B12');
      worksheet.getCell('A12').value = 'SERVICIO:';
      worksheet.getCell('C12').value = filteredData[0]?.tarifa?.servicio || 'S/N';

      worksheet.mergeCells('A13:B13');
      worksheet.getCell('A13').value = 'CLIENTE:';
      worksheet.getCell('C13').value = filteredData[0]?.sucursale?.nombre || 'S/N';

      // Formatear las fechas de inicio y fin del periodo
      const formatDate = (date) => {
        if (!date) return 'S/N';
        const d = new Date(date);
        return d.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' });
      };
      const startDate = this.startDate ? new Date(this.startDate) : new Date();
      startDate.setDate(startDate.getDate() + 1);
      const endDateAdjusted = this.endDate ? new Date(this.endDate) : new Date();
      endDateAdjusted.setDate(endDateAdjusted.getDate() + 1);
      const formattedStartDate = formatDate(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
      const formattedEndDateAdjusted = formatDate(endDateAdjusted);

      worksheet.mergeCells('A14:B14');
      worksheet.getCell('A14').value = 'PERIODO:';
      worksheet.getCell('C14').value = `${formattedStartDate} - ${formattedEndDateAdjusted}`;

      // Definir las columnas del reporte
      worksheet.columns = [
        { header: '#', key: 'index', width: 5 },
        { header: 'Fecha de Envío', key: 'fecha', width: 20 },
        { header: 'Número de Envío', key: 'guia', width: 20 },
        { header: 'Sucursal Origen', key: 'sucursal_origen', width: 20 },
        { header: 'Dirección', key: 'direccion', width: 15 },
        { header: 'Local', key: 'local', width: 10 },
        { header: 'Servicio', key: 'servicio', width: 15 },
        { header: 'Ciudad', key: 'ciudad', width: 10 },
        { header: 'Zona', key: 'zona', width: 15 },
        { header: 'Contenido', key: 'contenido', width: 20 },
        { header: 'Peso (Kg)', key: 'peso', width: 10 },
        { header: 'Precio (Bs)', key: 'precio', width: 10 },
        { header: 'Servicio T.', key: 'servicioT', width: 15 },
        { header: 'Fecha y Hora Entrega', key: 'fecha_entrega', width: 20 },
        { header: 'Destinatario', key: 'destinatario', width: 20 },
        { header: 'Cartero', key: 'cartero', width: 20 },
        { header: 'Observaciones', key: 'observacion', width: 25 },
      ];

      // Encabezados agrupados para "Envío" y "Entrega"
      worksheet.mergeCells('A16:M16');
      worksheet.getCell('A16').value = 'Envío';
      worksheet.getCell('A16').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A16').font = { bold: true, size: 14 };
      worksheet.getCell('A16').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF9BBB59' } // Color verde
      };

      worksheet.mergeCells('N16:R16');
      worksheet.getCell('N16').value = 'Entrega';
      worksheet.getCell('N16').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('N16').font = { bold: true, size: 14 };
      worksheet.getCell('N16').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC0504D' } // Color rojo
      };

      // Añadir los encabezados de las columnas en la fila 17
      const headerRow = worksheet.getRow(17);
      headerRow.values = [
        '#', 'Fecha de Envío', 'Número de Envío', 'Sucursal Origen', 'Dirección', 'Local',
        'Servicio', 'Ciudad', 'Zona', 'Contenido', 'Peso (Kg)', 'Precio (Bs)', 'Servicio T.',
        'Fecha y Hora Entrega', 'Destinatario', 'Cartero', 'Observaciones'
      ];

      // Aplicar estilos a los encabezados
      headerRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        // Aplicar colores de fondo según el grupo
        if (colNumber <= 13) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF9BBB59' } // Color verde
          };
        } else {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC0504D' } // Color rojo
          };
        }
      });

      // Variables para totales
      let totalPrice = 0;
      let totalPriceWithDiscount = 0;
      let totalPriceWithRetention = 0;
      let totalWeight = 0;
      let totalDiscount = 0;
      let totalRetention = 0;

      // Procesar cada registro y añadirlo al Excel
      filteredData.forEach((m, index) => {
        // Validar y obtener el precio original
        const precioOriginal = parseFloat(m.nombre_d);
        const precioValido = isNaN(precioOriginal) ? 0 : precioOriginal;

        // Inicializar variables
        let diasDiferencia = 0;
        let fechaEntrega = null;

        // Validar y convertir fecha de entrega
        if (m.fecha_d) {
          fechaEntrega = new Date(m.fecha_d.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
        }

        // Validar y convertir fecha de recojo
        let fechaRecojo = null;
        if (m.fecha_recojo_c) {
          fechaRecojo = new Date(m.fecha_recojo_c.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
        }

        // Calcular días de diferencia
        if (fechaEntrega && fechaRecojo) {
          diasDiferencia = Math.floor((fechaEntrega - fechaRecojo) / (1000 * 60 * 60 * 24));
        } else {
          diasDiferencia = 0;
        }

        // Calcular descuento
        const descuento = parseFloat(m.tarifa?.descuento) || 0;
        let descuentoTotal = 0;

        if (diasDiferencia > 0 && !isNaN(precioValido)) {
          descuentoTotal = (precioValido * (descuento / 100)) * diasDiferencia;
        }

        const precioConDescuento = precioValido - descuentoTotal;

        // Calcular retención
        const retencion = parseFloat(m.tarifa?.retencion) || 0;
        const descuentoRetencion = (precioValido * retencion) / 100;
        const precioConRetencion = precioValido - descuentoRetencion;

        // Obtener peso
        const peso = m.peso_r ? parseFloat(m.peso_r) : (m.peso_v ? parseFloat(m.peso_v) : 0);

        // Añadir fila al Excel
        const row = worksheet.addRow({
          index: index + 1,
          fecha: m.fecha_d || 'S/N',
          guia: m.guia || 'S/N',
          sucursal_origen: m.sucursale?.origen || 'S/N',
          direccion: m.direccion_especifica ? 'X' : 'S/N',
          local: m.direccion && m.direccion.zona ? 'X' : 'S/N',
          servicio: m.tarifa?.departamento || 'S/N',
          ciudad: m.ciudad ? 'X' : 'S/N',
          zona: m.zona_d ? 'X' : 'S/N',
          contenido: m.contenido || 'S/N',
          peso: !isNaN(peso) ? peso.toFixed(3) : 'S/N',
          precio: !isNaN(precioValido) ? precioValido.toFixed(2) : 'S/N',
          servicioT: m.tarifa?.servicio || 'S/N',
          fecha_entrega: m.fecha_d || 'S/N',
          destinatario: m.destinatario || 'S/N',
          cartero: m.cartero_entrega ? m.cartero_entrega.nombre : 'Por asignar',
          observacion: m.observacion || 'S/N',
        });

        // Acumular totales
        totalPrice += precioValido;
        totalDiscount += descuentoTotal;
        totalPriceWithDiscount += precioConDescuento;
        totalRetention += descuentoRetencion;
        totalPriceWithRetention += precioConRetencion;
        totalWeight += !isNaN(peso) ? peso : 0;

        // Aplicar estilos a la fila
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          // Alternar el color de fondo de las filas
          const fillColor = index % 2 === 0 ? 'FFFFFFFF' : 'FFF0F0F0';
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fillColor }
          };
        });
      });

      // Añadir fila de total de precio
      const totalRow = worksheet.addRow({
        zona: 'Total',
        peso: totalWeight.toFixed(3) + ' Kg',
        precio: totalPrice.toFixed(2) + ' Bs',
      });

      // Añadir fila de total de descuento
      const totalDiscountRow = worksheet.addRow({
        zona: 'Total Descuento:',
        precio: totalDiscount.toFixed(2) + ' Bs',
      });

      // Añadir fila de total de retención
      const totalRetentionRow = worksheet.addRow({
        zona: 'Total Retención:',
        precio: totalRetention.toFixed(2) + ' Bs',
      });

      // Aplicar estilos a las filas de totales
      [totalRow, totalDiscountRow, totalRetentionRow].forEach((row) => {
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          cell.font = { bold: true };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.border = {
            top: { style: 'double' },
            left: { style: 'double' },
            bottom: { style: 'double' },
            right: { style: 'double' }
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF00' } // Color amarillo
          };
        });
      });

      // Ajustar la altura de las filas
      worksheet.eachRow({ includeEmpty: true }, function (row) {
        row.height = 20;
      });

      // Ajustar el ancho de las columnas automáticamente
      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value ? cell.value.toString() : '';
          maxLength = Math.max(maxLength, cellValue.length);
        });
        column.width = maxLength < 10 ? 10 : maxLength;
      });

      // Guardar y descargar el archivo Excel
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

    async loadImageAsBase64(path) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'Anonymous'; // Permite cargar imágenes incluso si están en un servidor diferente
        image.onload = function () {
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
      let user = localStorage.getItem('userAuth');
      this.user = JSON.parse(user);
      // Inicialmente cargar el saldo restante, sucursales y datos
      await this.obtenerSaldoRestanteTodasSucursales();
      await this.fetchSucursales();
      await this.GET_DATA(this.apiUrl);

      // Después de obtener los datos, acceder a IndexedDB para cargar los PDF
      try {
        const db = await openDB('pdf-storage', 1);

        // Recorrer la lista de datos y buscar los PDF correspondientes en IndexedDB
        for (let item of this.list) {
          const pdfRecord = await db.get('pdfs', item.id);
          if (pdfRecord) {
            item.pdf_justificacion = pdfRecord.content; // Asignar el PDF al item si existe en IndexedDB
          } else {
            item.pdf_justificacion = null; // No hay PDF disponible
          }
        }

        // Filtrar los elementos por estado
        this.list = this.list.filter(item => item.estado === 4 || item.estado === 7);
        console.log('Datos después del filtrado y recuperación de PDF:', this.list);
      } catch (e) {
        console.error('Error al recuperar PDFs desde IndexedDB:', e);
      }

      this.load = false; // Cambiar el estado de carga
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
