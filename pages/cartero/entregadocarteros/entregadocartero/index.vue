<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row align-items-end mb-3">
  <div class="col-md-2">
    <label for="startDate" class="form-label">Fecha Inicial</label>
    <input type="date" v-model="startDate" id="startDate" class="form-control" placeholder="Fecha inicio">
  </div>

  <div class="col-md-2">
    <label for="endDate" class="form-label">Fecha Final</label>
    <input type="date" v-model="endDate" id="endDate" class="form-control" placeholder="Fecha fin">
  </div>

  <div class="col-md-2 d-flex align-items-end">
    <button @click="exportToExcel" class="btn btn-success btn-sm">
      <i class="fas fa-file-excel"></i> Exportar a Excel
    </button>
  </div>

  <div class="col-md-6">
    <input v-model="searchTerm" @keypress.enter="handleSearchEnter" type="text" class="form-control" placeholder="Buscar...">
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
                    <th class="py-0 px-1">Cartero</th>
                    <th class="py-0 px-1">Guia</th>
                    <th class="py-0 px-1">Peso Empresa (Kg)</th>
                    <th class="py-0 px-1">Peso Correos (Kg)</th>
                    <th class="py-0 px-1">Remitente</th>
                    <th class="py-0 px-1">Dirección Maps</th>
                    <th class="py-0 px-1">Dirección</th>
                    <th class="py-0 px-1">Zona Remitente</th>
                    <th class="py-0 px-1">Teléfono</th>
                    <th class="py-0 px-1">Contenido</th>
                    <th class="py-0 px-1">Fecha</th>
                    <th class="py-0 px-1">Destinatario</th>
                    <th class="py-0 px-1">Teléfono D</th>
                    <th class="py-0 px-1">Dirección Destinatario maps</th>
                    <th class="py-0 px-1">Dirección Destinatario</th>
                    <th class="py-0 px-1">Ciudad</th>
                    <th class="py-0 px-1">Zona Destinatario</th>
                    <th class="py-0 px-1">Firma Destinatario</th>
                    <th class="py-0 px-1">Fecha Destinatario</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(m, i) in paginatedData" :key="i">
                    <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                    <td class="p-1">{{ m.sucursale.nombre }}</td>
                    <td class="p-1">{{ m.cartero_entrega ? m.cartero_entrega.nombre : 'Por asignar' }}</td>
                    <td class="py-0 px-1">{{ m.guia }}</td>
                    <td class="py-0 px-1">{{ m.peso_o }}</td>
                    <td class="py-0 px-1">{{ m.peso_v }}</td>
                    <td class="py-0 px-1">{{ m.remitente }}</td>
                    <td class="py-0 px-1">
                      <a v-if="isCoordinates(m.direccion)"
                        :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion" target="_blank"
                        class="btn btn-primary btn-sm">
                        Ver mapa
                      </a>
                      <span v-else>{{ m.direccion }}</span>
                    </td>
                    <td class="py-0 px-1">{{ m.direccion_especifica }}</td>

                    <td class="py-0 px-1">{{ m.zona_r }}</td>
                    <td class="py-0 px-1">{{ m.telefono }}</td>
                    <td class="py-0 px-1">{{ m.contenido }}</td>
                    <td class="py-0 px-1">{{ m.fecha }}</td>
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
                    <td class="py-0 px-1">{{ m.direccion_especifica_d }}</td>
                    <td class="py-0 px-1">{{ m.ciudad }}</td>
                    <td class="py-0 px-1">{{ m.zona_d }}</td>
                    <td class="py-0 px-1">
                      <img v-if="m.firma_d" :src="m.firma_d" alt="Firma Destino" width="100" />
                    </td>
                    <td class="py-0 px-1">{{ m.fecha_d }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Paginación -->
            <nav aria-label="Page navigation">
              <ul class="pagination justify-content-between">
                <li class="page-item" :class="{ disabled: currentPage === 0 }">
                  <button class="page-link" @click="previousPage" :disabled="currentPage === 0"><</button>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page - 1 }">
                  <button class="page-link" @click="goToPage(page - 1)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                  <button class="page-link" @click="nextPage" :disabled="currentPage >= totalPages - 1">></button>
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
      load: true,
      list: [],
      searchTerm: '',
      startDate: '', // Nueva variable para la fecha de inicio
      endDate: '',   // Nueva variable para la fecha de fin
      apiUrl: 'solicitudes',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/admin/solicitudesj/solicitudej/nuevo',
      url_editar: '/admin/solicitudescartero/solicitudecartero/editar/',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      collapseState: {},
      isModalVisible: false,
      currentId: null,
      selected: {},
      selectedItemsData: [],
      user: {
        cartero: []
      },
      currentPage: 0,
      itemsPerPage: 10,
      startDate: '', // Nueva variable para la fecha de inicio
    endDate: '',   // Nueva variable para la fecha de fin
    };
  },
  methods: {
    async exportToExcel() {
    // Validar las fechas seleccionadas
    if (!this.startDate || !this.endDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Fechas requeridas',
        text: 'Por favor, selecciona ambas fechas para generar el reporte.',
      });
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (start > end) {
      Swal.fire({
        icon: 'error',
        title: 'Fechas incorrectas',
        text: 'La fecha de inicio no puede ser mayor que la fecha de fin.',
      });
      return;
    }

    // Filtrar los datos por el rango de fechas
    const filteredData = this.filteredData.filter(m => {
      const fechaD = new Date(m.fecha_d);
      return fechaD >= start && fechaD <= end;
    });

    if (filteredData.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin datos',
        text: 'No hay datos dentro del rango de fechas seleccionado.',
      });
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Solicitudes');

    // Definir las columnas y su anchura en el orden solicitado
    worksheet.columns = [
      { header: '#', key: 'index', width: 5 },
      { header: 'Servicio', key: 'servicio', width: 20 }, // Nueva columna para servicio
      { header: 'Guia', key: 'guia', width: 20 },
      { header: 'Sucursal', key: 'sucursal', width: 20 },
      { header: 'Origen', key: 'origen', width: 10 }, // Origen de sucursale_id
      { header: 'Dirección Destinatario', key: 'direccion_destinatario', width: 25 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Ciudad', key: 'ciudad', width: 25 },
      { header: 'Zona Destinatario', key: 'zona_destinatario', width: 30 },
      { header: 'Cartero', key: 'cartero', width: 20 },
      { header: 'Peso', key: 'peso_correos', width: 10 },
      { header: 'Fecha Destinatario', key: 'fecha_destinatario', width: 25 },
      { header: 'Estado', key: 'estado', width: 20 }, // Columna para estado
      { header: 'Observación', key: 'observacion', width: 25 }, // Columna de observación
    ];

    // Aplicar estilo a la primera fila (encabezados)
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
      fgColor: { argb: 'FF000080' } // Azul oscuro
    };

    // Añadir filas y aplicar estilos personalizados
    filteredData.forEach((m, i) => {
      const row = worksheet.addRow({
        index: this.currentPage * this.itemsPerPage + i + 1,
        servicio: m.tarifa.servicio, // Mostrar el campo servicio desde tarifa
        guia: m.guia,
        sucursal: m.sucursale.nombre,
        origen: m.sucursale.origen, // Usar origen en lugar de tarifa
        direccion_destinatario: m.direccion_especifica_d,
        fecha: m.fecha,
        ciudad: m.ciudad,
        zona_destinatario: m.zona_d,
        cartero: m.cartero_entrega ? m.cartero_entrega.nombre : 'Por asignar',
        peso_correos: m.peso_v + ' Kg', // Añadir "Kg" después del valor de peso
        fecha_destinatario: m.fecha_d,
        estado: m.estado === 3 ? 'ENTREGADO' : '', // Mostrar "ENTREGADO" si el estado es 5
        observacion: m.observacion, // Recuperar la observación
      });

      // Alternar color de fondo para filas
      const fillColor = i % 2 === 0 ? 'FFCCFFCC' : 'FF99CCFF'; // Verde claro / Azul claro
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

    // Establecer altura de las filas
    worksheet.eachRow({ includeEmpty: true }, function (row) {
      row.height = 25; // Ajusta la altura a tu gusto
    });

    // Exportar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Entregados.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },




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
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    async GET_DATA(path) {
      try {
        const res = await this.$api.$get(path);
        if (Array.isArray(res)) {
          this.list = res;
        } else {
          console.error('Los datos recuperados no son un array:', res);
        }
      } catch (e) {
        console.error('Error al obtener los datos:', e);
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
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
      }
    },
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    }
  },
  computed: {
    filteredData() {
      const searchTerm = this.searchTerm.toLowerCase();
      return this.list.filter(item =>
        item.estado === 3 &&
        item.cartero_entrega && item.cartero_entrega.id === this.user.user.id &&
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm)
        )
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
    hasSelectedItems() {
      return Object.keys(this.selected).some(key => this.selected[key]);
    }
  },
  mounted() {
    this.$nextTick(async () => {
      let user = localStorage.getItem('userAuth');
      if (user) {
        this.user = JSON.parse(user);
        console.log('Usuario cargado:', this.user);
      } else {
        console.error('No se encontró el usuario en el almacenamiento local');
        this.user = { cartero: null };
      }

      try {
        const data = await this.GET_DATA(this.apiUrl);
        if (Array.isArray(data)) {
          this.list = data;
          console.log('Datos cargados:', this.list);
        } else {
          console.error('Los datos recuperados no son un array:', data);
        }
      } catch (e) {
        console.error('Error al obtener los datos:', e);
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

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}
.form-label {
  font-weight: bold;
  margin-bottom: 5px;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  font-size: 14px;
  padding: 8px 12px;
}

input[type="date"], input[type="text"] {
  height: 38px;
}

.row.mb-3 {
  margin-bottom: 20px;
}

</style>
