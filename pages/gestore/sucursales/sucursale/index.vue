<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end">

          <!-- Campo de selección de sucursal -->
          <div class="col-md-2">
            <label for="sucursal" class="form-label">Sucursal</label>
            <select v-model="selectedSucursal" id="sucursal" class="form-control">
              <option value="">Todas</option>
              <option v-for="sucursal in sucursales" :key="sucursal.id" :value="sucursal.id">
                {{ sucursal.nombre }}
              </option>
            </select>
          </div>

          <!-- Campos para seleccionar fechas y botón para generar reporte -->
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
          <div class="col-md-2">
            <nuxtLink :to="url_nuevo" class="btn btn-dark btn-sm w-100">
              <i class=""></i> Crear sucursal
            </nuxtLink>
          </div>

          <!-- Tabla de datos -->
          <div class="col-12">
            <div class="card w-100">
              <div class="card-body">
                <!-- Contenedor de la tabla para hacerlo responsive -->
                <div class="table-responsive">
                  <table class="table table-striped table-bordered">
                    <thead>
                      <th class="py-0 px-1">#</th>
                      <th class="py-0 px-1">Sucursal</th>
                      <th class="py-0 px-1">Acuerdo contrato</th>
                      <th class="py-0 px-1">Tipo de Contrato</th>
                      <th class="py-0 px-1">Departamento Origen</th>
                      <th class="py-0 px-1">Inicio Contrato</th>
                      <th class="py-0 px-1">Fin Contrato</th>
                      <th class="py-0 px-1">Límite Presupuestario</th>
                      <th class="py-0 px-1">Cobertura</th>
                      <th class="py-0 px-1">Dirección</th>
                      <th class="py-0 px-1">Acuerdos</th>
                      <th class="py-0 px-1">Codigo Cliente</th>
                      <th class="py-0 px-1">Numero de Contrato</th>
                      <th class="py-0 px-1">Contacto</th>
                      <th class="py-0 px-1"></th>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedList" :key="i">
                        <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                        <td class="py-0 px-1">{{ m.nombre }}</td>
                        <td class="py-0 px-1">{{ m.tipo_contrato }}</td>
                        <td class="py-0 px-1">{{ m.acuerdo_contrato }}</td>
                        <td class="py-0 px-1">{{ m.origen }}</td>
                        <td class="py-0 px-1">{{ m.ini_vigencia }}</td>
                        <td class="py-0 px-1">{{ m.fin_vigencia }}</td>
                        <td class="py-0 px-1">{{ m.limite }}</td>
                        <td class="py-0 px-1">{{ m.cobertura }}</td>
                        <td class="py-0 px-1">{{ m.direccion }}</td>
                        <td class="py-0 px-1">{{ m.acuerdos }}</td>
                        <td class="py-0 px-1">{{ m.codigo_cliente }}</td>
                        <td class="py-0 px-1">{{ m.n_contrato }}</td>
                        <td class="py-0 px-1">{{ m.contacto_administrativo }}</td>
                        <td class="py-0 px-1">
                          <div class="btn-group">
                            <nuxtLink :to="url_editar + m.id" class="btn btn-info btn-sm py-1 px-2">
                              <i class="fas fa-pen"></i>
                            </nuxtLink>
                            <button type="button" @click="Eliminar(m.id)" class="btn btn-danger btn-sm py-1 px-2">
                              <i class="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div> <!-- Cierre del contenedor table-responsive -->
                
                <!-- Paginación -->
                <nav aria-label="Page navigation">
                  <ul class="pagination justify-content-between">
                    <li class="page-item" :class="{ disabled: currentPage === 0 }">
                      <button class="page-link" @click="previousPage" :disabled="currentPage === 0">&lt;</button>
                    </li>
                    <li class="page-item" v-for="page in totalPages" :key="page"
                      :class="{ active: currentPage === page - 1 }">
                      <button class="page-link" @click="goToPage(page - 1)">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                      <button class="page-link" @click="nextPage"
                        :disabled="currentPage >= totalPages - 1">&gt;</button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>
  </div>
</template>

<script>
import ExcelJS from 'exceljs';
import Swal from 'sweetalert2';

export default {
  name: "IndexPage",
  data() {
    return {
      load: true,
      list: [],
      sucursales: [], // Almacenar las sucursales para el dropdown
      selectedSucursal: '', // Sucursal seleccionada
      apiUrls: ['sucursales3', 'solicitudes3'],
      page: 'Sucursales',
      modulo: 'AGBC',
      url_nuevo: '/gestore/sucursales/sucursale/nuevo',
      url_editar: '/gestore/sucursales/sucursale/editar/',
      busqueda: "",
      resultados: [],
      currentPage: 0,
      itemsPerPage: 10,
      startDate: '',
      endDate: '',
    };
  },
  computed: {
    paginatedList() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.resultados.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.resultados.length / this.itemsPerPage);
    }
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$gestores.$get(path);
      return res;
    },
    async fetchAllData() {
      try {
        const [sucursalesData, solicitudesData] = await Promise.all(
          this.apiUrls.map((url) => this.GET_DATA(url))
        );

        // Almacenar sucursales para el dropdown
        this.sucursales = sucursalesData;

        // Combina los datos
        this.list = [...sucursalesData, ...solicitudesData];
        this.buscar(); // Actualizar la búsqueda con la lista combinada
      } catch (e) {
        console.error('Error al obtener los datos:', e);
      } finally {
        this.load = false;
      }
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$gestores.$delete(this.apiUrls[0] + '/' + id);
        await this.fetchAllData(); // Volver a cargar todos los datos después de eliminar
        this.goToPage(0);
        this.buscar();
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },
    Eliminar(id) {
      this.$swal.fire({
        title: '¿Deseas eliminar?',
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.EliminarItem(id);
        }
      });
    },
    buscar() {
      this.resultados = this.list.filter((item) =>
        item.nombre?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        item.origen?.toLowerCase().includes(this.busqueda.toLowerCase())
      );
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

      // Convertir las fechas de entrada a objetos Date
      const start = this.startDate ? new Date(this.startDate + 'T00:00:00') : null;
      const end = this.endDate ? new Date(this.endDate + 'T23:59:59') : null;

      if (start > end) {
        Swal.fire({
          icon: 'error',
          title: 'Fechas incorrectas',
          text: 'La fecha de inicio no puede ser mayor que la fecha de fin.',
        });
        return;
      }

      // Filtrar los datos por el rango de fechas usando fecha_d y los estados 4 y 6
      const filteredData = this.list.filter(m => {
        // Verificar si m.fecha_d está definido
        if (!m.fecha_d) {
          return false;
        }

        // Convertir fecha_d al formato Date
        const [day, month, yearTime] = m.fecha_d.split('/');
        if (!day || !month || !yearTime) {
          return false; // Si el formato es incorrecto, ignorar el registro
        }

        const [year, time] = yearTime.split(' ');
        if (!year || !time) {
          return false; // Si el formato es incorrecto, ignorar el registro
        }

        const [hours, minutes] = time.split(':');
        if (!hours || !minutes) {
          return false; // Si el formato es incorrecto, ignorar el registro
        }

        const fechaD = new Date(year, month - 1, day, hours, minutes);

        // Comparar si fechaD está entre start y end, y si el estado es 4 o 6
        return fechaD >= start && fechaD <= end && (m.estado === 4 || m.estado === 6) &&
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
      const worksheet = workbook.addWorksheet('Solicitudes Verificadas');

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
          direccion: m.direccion_especifica,
          telefono: m.telefono,
          contenido: m.contenido,
          fecha: m.fecha,
          destinatario: m.destinatario,
          telefono_destinatario: m.telefono_d,
          direccion_destinatario: m.direccion_especifica_d,
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
      link.download = 'Solicitudes_Verificadas.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
  mounted() {
    this.$nextTick(async () => {
      await this.fetchAllData();
    });
  },
};
</script>

<style scoped>
.activo {
  color: blue;
}

.inactivo {
  color: red;
}

.pagination {
  display: flex;
  justify-content: space-between;
}

.pagination .page-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  min-width: 800px; /* Ajusta este valor según tus necesidades */
}
</style>
