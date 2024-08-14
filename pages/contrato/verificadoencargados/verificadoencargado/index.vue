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
  const start = this.startDate ? new Date(this.startDate + 'T00:00:00') : null;
  const end = this.endDate ? new Date(this.endDate + 'T23:59:59') : null;

  const filteredData = this.list.filter(m => {
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
      servicio: m.tarifa.departamento,  // Ajuste según tu estructura
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
