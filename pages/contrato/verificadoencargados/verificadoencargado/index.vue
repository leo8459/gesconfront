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
        {{ sucursal.nombre }}
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
                    <th class="py-0 px-1">Dirección</th>
                    <th class="py-0 px-1">Teléfono</th>
                    <th class="py-0 px-1">Contenido</th>
                    <th class="py-0 px-1">Fecha</th>
                    <th class="py-0 px-1">Firma Remitente</th>
                    <th class="py-0 px-1">Destinatario</th>
                    <th class="py-0 px-1">Teléfono D</th>
                    <th class="py-0 px-1">Dirección Destinatario</th>
                    <th class="py-0 px-1">Ciudad</th>
                    <th class="py-0 px-1">Firma Destinatario</th>
                    <th class="py-0 px-1">Nombre Destinatario</th>
                    <th class="py-0 px-1">CI Destinatario</th>
                    <th class="py-0 px-1">Fecha Destinatario</th>
                    <th class="py-0 px-1">Estado</th>
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
                    <td class="py-0 px-1">
                      <a v-if="isCoordinates(m.direccion)"
                        :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion" target="_blank"
                        class="btn btn-primary btn-sm">
                        Ver mapa
                      </a>
                      <span v-else>{{ m.direccion }}</span>
                    </td>
                    <td class="py-0 px-1">{{ m.telefono }}</td>
                    <td class="py-0 px-1">{{ m.contenido }}</td>
                    <td class="py-0 px-1">{{ m.fecha }}</td>
                    <td class="py-0 px-1">
                      <img v-if="m.firma_o" :src="m.firma_o" alt="Firma Origen" width="100" />
                    </td>
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
                    <td class="py-0 px-1">
                      <img v-if="m.firma_d" :src="m.firma_d" alt="Firma Destino" width="100" />
                    </td>
                    <td class="py-0 px-1">{{ m.nombre_d }}</td>
                    <td class="py-0 px-1">{{ m.ci_d }}</td>
                    <td class="py-0 px-1">{{ m.fecha_d }}</td>
                    <td class="py-0 px-1">{{ m.estado === 3 ? 'Entregado' : m.estado }}</td>
                    <td class="py-0 px-1"></td>
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
      currentPage: 1,
      itemsPerPage: 10,
      
    };
  },
  computed: {
    filteredData() {
    const searchTerm = this.searchTerm.toLowerCase();
    return this.list.filter(item => {
      const fechaD = new Date(item.fecha_d);
      const isWithinDateRange = (!this.startDate || fechaD >= new Date(this.startDate)) && (!this.endDate || fechaD <= new Date(this.endDate));
      const isMatchingSucursal = !this.selectedSucursal || item.sucursale?.id === this.selectedSucursal;
      return isWithinDateRange && isMatchingSucursal &&
             item.estado === 4 &&
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
    },
    hasSelectedItems() {
      return Object.keys(this.selected).some(key => this.selected[key]);
    }
  },
  methods: {
    async fetchSucursales() {
    try {
      const res = await this.$gestores.$get('sucursales_endpoint'); // Cambia 'sucursales_endpoint' por el endpoint real
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
        } else {
          console.error('Los datos recuperados no son un array:', res);
        }
      } catch (e) {
        console.error('Error al obtener los datos:', e);
      }
    },
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

    // Filtrar los datos por el rango de fechas, estado 3, y sucursal seleccionada
    const filteredData = this.list.filter(m => {
      const fechaD = new Date(m.fecha_d);
      return fechaD >= start && fechaD <= end && m.estado === 4 &&
             (!this.selectedSucursal || m.sucursale?.id === this.selectedSucursal);
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
    const worksheet = workbook.addWorksheet('Solicitudes Entregadas');

    worksheet.columns = [
      { header: '#', key: 'index', width: 5 },
      { header: 'Sucursal', key: 'sucursal', width: 20 },
      { header: 'Guía', key: 'guia', width: 20 },
      { header: 'Peso (Kg)', key: 'peso', width: 10 },
      { header: 'Remitente', key: 'remitente', width: 20 },
      { header: 'Dirección', key: 'direccion', width: 30 },
      { header: 'Teléfono', key: 'telefono', width: 15 },
      { header: 'Contenido', key: 'contenido', width: 20 },
      { header: 'Firma Destinatario', key: 'firma_destinatario', width: 25 },
      { header: 'Fecha de Solicitud', key: 'fecha', width: 20 },
      { header: 'Destinatario', key: 'destinatario', width: 20 },
      { header: 'Teléfono Destinatario', key: 'telefono_destinatario', width: 15 },
      { header: 'Dirección Destinatario', key: 'direccion_destinatario', width: 30 },
      { header: 'Ciudad', key: 'ciudad', width: 15 },
      { header: 'Zona', key: 'zona', width: 15 },
      { header: 'Precio (Bs)', key: 'precio', width: 10 },
      { header: 'Fecha de Entrega', key: 'fecha_entrega', width: 20 },
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

    for (let i = 0; i < filteredData.length; i++) {
      const m = filteredData[i];
      const row = worksheet.addRow({
        index: i + 1,
        sucursal: m.sucursale.nombre,
        guia: m.guia,
        peso: m.peso_o,
        remitente: m.remitente,
        direccion: m.direccion,
        telefono: m.telefono,
        contenido: m.contenido,
        fecha: m.fecha,
        destinatario: m.destinatario,
        telefono_destinatario: m.telefono_d,
        direccion_destinatario: m.direccion_d,
        ciudad: m.ciudad,
        zona: m.zona_d,
        precio: m.nombre_d,
        fecha_entrega: m.fecha_d,
      });

      totalPrice += parseFloat(m.nombre_d) || 0;

      if (m.firma_d) {
        const signatureId = workbook.addImage({
          base64: m.firma_d,
          extension: 'png',
        });

        worksheet.addImage(signatureId, {
          tl: { col: 8, row: row.number - 1 },
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

    const totalRow = worksheet.addRow({
      zona: 'Total',
      precio: totalPrice.toFixed(2),
    });

    totalRow.eachCell({ includeEmpty: true }, function (cell, colNumber) {
      if (colNumber === 1) {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'right' };
      }
      if (colNumber === 16) {
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
  },
   
    
    
   
  
    
    
  },
  mounted() {
    this.$nextTick(async () => {
      await this.fetchSucursales(); // Cargar sucursales
    await this.GET_DATA(this.apiUrl); // Cargar datos existentes
    this.load = false;
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
