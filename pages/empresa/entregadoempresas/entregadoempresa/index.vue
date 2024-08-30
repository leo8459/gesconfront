<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="row justify-content-end mb-3">
            <div class="col-3">
              <label for="startDate" class="form-label">Fecha Inicio</label>
              <input v-model="startDate" type="date" class="form-control" id="startDate" />
            </div>
            <div class="col-3">
              <label for="endDate" class="form-label">Fecha Fin</label>
              <input v-model="endDate" type="date" class="form-control" id="endDate" />
            </div>
          </div>
          <button @click="generateElegantPDF" class="btn btn-primary btn-sm">
            Generar PDF
          </button>
          <div class="col-3">
            <input v-model="searchTerm" type="text" class="form-control" placeholder="Buscar..." />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th class="py-0 px-1">
                    </th>
                    <th class="py-0 px-1">#</th>
                    <th class="py-0 px-1">Sucursal</th>


                    <th class="py-0 px-1">Guia</th>
                    <th class="py-0 px-1">Peso (Kg)</th>
                    <th class="py-0 px-1">Remitente</th>
                    <th class="py-0 px-1">Detalles de Domicilio</th>

                    <!-- Nueva columna para la dirección específica -->
                    <th class="py-0 px-1">Zona</th> <!-- Nueva columna para la zona -->
                    <th class="py-0 px-1">Dirección maps</th>
                    <th class="py-0 px-1">Contenido</th>
                    <th class="py-0 px-1">Fecha</th>
                    <th class="py-0 px-1">Destinatario</th>
                    <th class="py-0 px-1">Teléfono D</th>
                    <th class="py-0 px-1">Dirección Destinatario</th>
                    <th class="py-0 px-1">Municipio/Provincia</th>
                    <th class="py-0 px-1">Detalles domoicilio destinatario</th>
                    <th class="py-0 px-1">zona destinatario</th>

                    <th class="py-0 px-1">Firma Destinatario</th>
                    <th class="py-0 px-1">Fecha de Entrega</th>
                    <th class="py-0 px-1">Estado</th>
                    <th class="py-0 px-1">Imagen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(m, i) in paginatedData" :key="m.id">
                    <td class="py-0 px-1">
                    </td>
                    <td class="py-0 px-1">{{ i + 1 + (currentPage - 1) * itemsPerPage }}</td>
                    <td class="p-1">{{ m.sucursale ? m.sucursale.nombre : '' }}</td>

                    <td class="py-0 px-1">{{ m.guia }}</td>
                    <td class="py-0 px-1">{{ m.peso_r ? m.peso_r : m.peso_v }}</td>
                    <td class="py-0 px-1">{{ m.remitente }}</td>
                    <td class="py-0 px-1">{{ m.direccion.direccion_especifica }}</td>
                    <!-- Mostrar la dirección específica -->
                    <td class="py-0 px-1">{{ m.direccion.zona }}</td> <!-- Mostrar la zona -->
                    <td class="py-0 px-1">
                      <a v-if="isCoordinates(m.direccion.direccion)"
                        :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion.direccion"
                        target="_blank" class="btn btn-primary btn-sm">
                        Ver mapa
                      </a>
                      <span v-else>{{ m.direccion.direccion }}</span>
                    </td>
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
                    <td class="py-0 px-1">{{ m.ciudad }}</td>
                    <td class="py-0 px-1">{{ m.direccion_especifica_d }}</td>
                    <td class="py-0 px-1">{{ m.zona_d }}</td>

                    <td class="py-0 px-1">
                      <img v-if="m.firma_d" :src="m.firma_d" alt="Firma Destino" width="100" />
                    </td>
                    <td class="py-0 px-1">{{ m.fecha_d }}</td>
                    <td class="py-0 px-1">{{ m.estado === 3 || m.estado === 4 ? 'Entregado' : m.estado }}</td>
                    <td class="py-0 px-1">

                      <button v-if="m.imagen" @click="downloadImage(m.imagen)"
                        class="btn btn-sm btn-primary mt-1">Descargar</button>
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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { BCollapse, BModal } from 'bootstrap-vue';

export default {
  name: "IndexPage",
  components: {
    BCollapse,
    BModal
  },
  data() {
    return {
      load: true,
      list: [],
      searchTerm: '',
      apiUrl: 'solicitudes7',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/admin/solicitudesj/solicitudej/nuevo',
      url_editar: '/admin/solicitudescartero/solicitudecartero/editar/',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      collapseState: {},
      isModalVisible: false,
      currentId: null,
      selected: {},
      startDate: '', // Fecha inicio
      endDate: '',   // Fecha fin
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

      // Asegúrate de que user y user.user estén definidos
      if (!this.user || !this.user.user) {
        return []; // Devolver un array vacío o manejar el error de otra forma
      }

      const empresaId = this.user.user.id; // El ID de la empresa del usuario logueado

      return this.list.filter(item =>
        item.sucursale.empresa_id === empresaId && // Comparar empresa_id de la sucursal con el id del usuario
        (item.estado === 3 || item.estado === 4) && // Filtrar por estado (si es necesario)
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm) // Filtrar por el término de búsqueda
        )
      );
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
    },
    hasSelectedItems() {
      return Object.keys(this.selected).some(key => this.selected[key]);
    }
  },
  methods: {
    loadImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, ''));
        };
        img.onerror = reject;
        img.src = url;
      });
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

    generateElegantPDF() {
      // Convertir las fechas seleccionadas a objetos Date en el formato correcto
      const start = this.startDate ? new Date(this.startDate + 'T00:00:00') : null;
      const end = this.endDate ? new Date(this.endDate + 'T23:59:59') : null;



      // Filtrando y organizando los datos
      const dataForPDF = this.paginatedData.filter(m => {
        if (!m.fecha_d) return false;

        // Validar y convertir fecha_d al formato de fecha adecuado (DD/MM/YYYY -> YYYY-MM-DD)
        const parts = m.fecha_d.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // Meses en JavaScript son 0-indexados
          const year = parseInt(parts[2], 10);

          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const recordDateD = new Date(year, month, day, 0, 0, 0);


            // Filtrar según el rango de fechas
            return (!start || recordDateD >= start) && (!end || recordDateD <= end);
          } else {
            return false;
          }
        } else {
          return false;
        }
      }).map(m => ({
        sucursal: m.sucursale ? m.sucursale.nombre : '',
        guia: m.guia,
        peso: m.peso_r || m.peso_v,
        fecha_recojo: m.fecha_recojo_c,
        fecha_entrega: m.fecha_d,
        costo: parseFloat(m.nombre_d) || 0
      }));


      // Suma total del costo (nombre_d)
      const totalCosto = dataForPDF.reduce((sum, item) => sum + item.costo, 0);

      // Verificar si hay datos filtrados para generar el PDF
      if (dataForPDF.length === 0) {
        this.$swal.fire({
          icon: 'info',
          title: 'Sin datos',
          text: 'No se encontraron registros en el rango de fechas seleccionado.',
        });
        return;
      }

      // Definición del contenido del PDF
      const docDefinition = {
        content: [
          { text: 'Reporte de Solicitudes', style: 'header' },
          {
            table: {
              headerRows: 1,
              widths: ['20%', '15%', '15%', '20%', '20%', '10%'],
              body: [
                [
                  { text: 'Sucursal', style: 'tableHeader' },
                  { text: 'Guía', style: 'tableHeader' },
                  { text: 'Peso (Kg)', style: 'tableHeader' },
                  { text: 'Fecha de Recojo', style: 'tableHeader' },
                  { text: 'Fecha de Entrega', style: 'tableHeader' },
                  { text: 'Costo (Bs)', style: 'tableHeader' }
                ],
                ...dataForPDF.map(item => [
                  { text: item.sucursal, style: 'tableBody', alignment: 'center' },
                  { text: item.guia, style: 'tableBody', alignment: 'center' },
                  { text: item.peso, style: 'tableBody', alignment: 'center' },
                  { text: item.fecha_recojo, style: 'tableBody', alignment: 'center' },
                  { text: item.fecha_entrega, style: 'tableBody', alignment: 'center' },
                  { text: item.costo.toFixed(2), style: 'tableBody', alignment: 'center' }
                ]),
                [
                  { text: 'Total Gastado', colSpan: 5, alignment: 'right', style: 'tableTotal' }, {}, {}, {}, {},
                  { text: totalCosto.toFixed(2), style: 'tableTotal', alignment: 'center' }
                ]
              ]
            },
            layout: {
              fillColor: function (rowIndex) {
                return (rowIndex % 2 === 0) ? '#f3f3f3' : null;
              },
              hLineWidth: function (i, node) {
                return (i === 0 || i === node.table.body.length) ? 1 : 0;
              },
              vLineWidth: function (i) {
                return 0;
              },
              hLineColor: function (i) {
                return '#aaa';
              },
              paddingLeft: function (i) {
                return i === 0 ? 10 : 5;
              },
              paddingRight: function (i) {
                return i === 0 ? 10 : 5;
              },
              paddingTop: function (i, node) {
                return i === 0 ? 4 : 2;
              },
              paddingBottom: function (i, node) {
                return i === 0 ? 4 : 2;
              }
            }
          }
        ],
        styles: {
          header: {
            fontSize: 22,
            bold: true,
            margin: [0, 0, 0, 20],
            color: '#2a3e52',
            alignment: 'center'
          },
          tableHeader: {
            bold: true,
            fontSize: 12,
            color: 'white',
            fillColor: '#2a3e52',
            alignment: 'center',
            margin: [0, 5, 0, 5]
          },
          tableBody: {
            fontSize: 11,
            margin: [0, 5, 0, 5],
          },
          tableTotal: {
            bold: true,
            fontSize: 12,
            color: '#2a3e52'
          }
        },
        defaultStyle: {
          fontSize: 10
        }
      };

      // Genera el PDF y abre la descarga
      pdfMake.createPdf(docDefinition).download('reporte_sucursales.pdf');
    }


    ,




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
        const res = await this.$empresas.$get(path);

        if (Array.isArray(res)) {
          this.list = res;
        } else if (typeof res === 'object' && res !== null) {
          this.list = res.data || []; // Aquí asume que `res.data` es un array
        } else {
          this.list = [];
        }
      } catch (e) {
        this.list = [];
      }
    }
    ,










    async markSelectedAsVerified() {
      this.load = true;
      try {
        const selectedIds = Object.keys(this.selected).filter(key => this.selected[key]);
        for (let id of selectedIds) {
          await this.$empresas.$put(`verificarsolicitudes5/${id}`);
        }
        await this.GET_DATA(this.apiUrl); // Forzar actualización de la lista
        this.$swal.fire({
          icon: 'success',
          title: 'Solicitudes verificadas',
          text: 'Todas las solicitudes seleccionadas han sido marcadas como verificadas.',
        });
        this.selected = {}; // Limpiar la selección después de verificar
      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al verificar las solicitudes.',
        });
      } finally {
        this.load = false;
      }
    },
    selectAll(event, group) {
      const isChecked = event.target.checked;
      group.forEach(item => {
        this.$set(this.selected, item.id, isChecked);
      });
    },
    toggleCollapse(estado) {
      this.$set(this.collapseState, estado, !this.collapseState[estado]);
    }
  },
  mounted() {
    this.$nextTick(async () => {
      let user = localStorage.getItem('userAuth');
      if (user) {
        this.user = JSON.parse(user);
      } else {
        this.user = null;
      }

      if (this.user) {
        try {
          await this.GET_DATA(this.apiUrl);
        } catch (e) {
        } finally {
          this.load = false;
        }
      }
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
