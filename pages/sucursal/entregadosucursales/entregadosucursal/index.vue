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
            <input v-model="searchTerm" type="text" class="form-control" placeholder="Buscar...">
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                Entregados
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>
                        <th class="py-0 px-1">Guía</th>
                        <th class="py-0 px-1">Peso (Kg)</th>
                        <th class="py-0 px-1">Remitente</th>
                        <th class="py-0 px-1">Dirección maps</th>
                        <th class="py-0 px-1">Dirección</th>
                        <th class="py-0 px-1">Teléfono</th>
                        <th class="py-0 px-1">Contenido</th>
                        <th class="py-0 px-1">Firma Destinatario</th>
                        <th class="py-0 px-1">Codigo</th>
                        <th class="py-0 px-1">Fecha de Solicitud</th>
                        <th class="py-0 px-1">Destinatario</th>
                        <th class="py-0 px-1">Teléfono Destinatario</th>
                        <th class="py-0 px-1">Dirección Destinatario maps</th>
                        <th class="py-0 px-1">Dirección Destinatario</th>
                        <th class="py-0 px-1">Ciudad</th>
                        <th class="py-0 px-1">Zona</th>
                        <th class="py-0 px-1">Precio (Bs)</th>
                        <th class="py-0 px-1">Fecha de Entrega</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedList" :key="i">
                        <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                        <td class="p-1">{{ m.sucursale.nombre }}</td>
                        <td class="py-0 px-1">{{ m.guia }}</td>
                        <td class="py-0 px-1">{{ m.peso_o }}</td>
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
                        <td class="py-0 px-1">{{ m.telefono }}</td>
                        <td class="py-0 px-1">{{ m.contenido }}</td>
                        <td class="py-0 px-1">
                          <img v-if="m.firma_d" :src="m.firma_d" alt="Firma Origen" width="100" />
                        </td>
                        <td class="py-0 px-1">
                          <img v-if="m.codigo_barras" :src="'data:image/png;base64,' + m.codigo_barras"
                            alt="Código de Barras" width="200" height="100" />
                        </td>
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
                        <td class="py-0 px-1">{{ m.nombre_d }}</td>
                        <td class="py-0 px-1">{{ m.fecha_d }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
import { BCollapse } from 'bootstrap-vue';
import ExcelJS from 'exceljs';
import Swal from 'sweetalert2';
export default {
  name: "IndexPage",
  components: {
    BCollapse
  },
  data() {
    return {
      load: true,
      list: [],
      apiUrl: 'solicitudes2',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/admin/sucursal/sucursales/sucursal/nuevo',
      url_editar: '/admin/sucursal/sucursales/sucursal/editar/',
      startDate: '', // Nueva variable para la fecha de inicio
      endDate: '',   // Nueva variable para la fecha de fin
      searchTerm: '', // Termino de búsqueda
      user: {
        sucursale: []
      },
      currentPage: 0,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredList() {
      const searchTerm = this.searchTerm.toLowerCase();
      return this.list.filter(item => {
        const guia = item.guia ? item.guia.toLowerCase() : '';
        const remitente = item.remitente ? item.remitente.toLowerCase() : '';
        const destinatario = item.destinatario ? item.destinatario.toLowerCase() : '';
        const direccionDestinatario = item.direccion_especifica_d ? item.direccion_especifica_d.toLowerCase() : '';
        const fechaEntrega = item.fecha_d ? item.fecha_d.toLowerCase() : '';

        return (
          guia.includes(searchTerm) ||
          remitente.includes(searchTerm) ||
          destinatario.includes(searchTerm) ||
          direccionDestinatario.includes(searchTerm) ||
          fechaEntrega.includes(searchTerm)
        );
      }).filter(item => item.sucursale.id === this.user.user.id && (item.estado === 3 || item.estado === 4));
    },
    sortedList() {
      return this.filteredList.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },
    paginatedList() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.sortedList.length / this.itemsPerPage);
    }
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

    // Filtrar los datos por el rango de fechas, estados 3 y 4, y sucursal logueada
    const filteredData = this.list.filter(m => {
      // Verificar si m.fecha_d está definido
      if (!m.fecha_d || !m.sucursale || m.sucursale.id !== this.user.user.id) {
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
      
      // Comparar si fechaD está entre start y end, y si el estado es 3 o 4
      return (m.estado === 3 || m.estado === 4) && fechaD >= start && fechaD <= end;
    });

    if (filteredData.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin datos',
        text: 'No hay registros dentro del rango de fechas y estados seleccionados.',
      });
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Solicitudes Entregadas');

    // Definir las columnas y su anchura en el orden solicitado
    worksheet.columns = [
      { header: '#', key: 'index', width: 5 },
      { header: 'Sucursal', key: 'sucursal', width: 25 },
      { header: 'Guía', key: 'guia', width: 25 },
      { header: 'Código de Barras', key: 'codigo_barras', width: 30 },
      { header: 'Peso (Kg)', key: 'peso', width: 15 },
      { header: 'Remitente', key: 'remitente', width: 25 },
      { header: 'Dirección', key: 'direccion', width: 35 },
      { header: 'Teléfono', key: 'telefono', width: 20 },
      { header: 'Contenido', key: 'contenido', width: 25 },
      { header: 'Firma Destinatario', key: 'firma_destinatario', width: 30 },
      { header: 'Fecha de Solicitud', key: 'fecha', width: 20 },
      { header: 'Destinatario', key: 'destinatario', width: 25 },
      { header: 'Teléfono Destinatario', key: 'telefono_destinatario', width: 20 },
      { header: 'Dirección Destinatario', key: 'direccion_destinatario', width: 35 },
      { header: 'Ciudad', key: 'ciudad', width: 20 },
      { header: 'Zona', key: 'zona', width: 20 },
      { header: 'Precio (Bs)', key: 'precio', width: 15 },
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
      fgColor: { argb: 'FF000080' } // Azul oscuro
    };

    let totalPrice = 0;

    // Añadir filas y aplicar estilos personalizados
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

      // Agregar la imagen del código de barras si está presente
      if (m.codigo_barras) {
        const barcodeId = workbook.addImage({
          base64: m.codigo_barras,
          extension: 'png',
        });

        worksheet.addImage(barcodeId, {
          tl: { col: 3, row: row.number - 1 },
          ext: { width: 125, height: 30 }
        });
      }

      // Sumar el precio al total
      totalPrice += parseFloat(m.nombre_d) || 0;

      // Agregar la imagen de la firma si está presente
      if (m.firma_d) {
        const signatureId = workbook.addImage({
          base64: m.firma_d,
          extension: 'png',
        });

        worksheet.addImage(signatureId, {
          tl: { col: 9, row: row.number - 1 },
          ext: { width: 150, height: 40 }
        });
      }

      // Alternar color de fondo para filas
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

    // Agregar fila de total
    const totalRow = worksheet.addRow({
      index: 'TOTAL',
      precio: totalPrice.toFixed(2),
    });

    // Aplicar estilo a la fila de total
    totalRow.font = { bold: true };
    totalRow.eachCell({ includeEmpty: true }, function (cell) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFCC00' }
      };
      cell.border = {
        top: { style: 'thick' },
        left: { style: 'thick' },
        bottom: { style: 'thick' },
        right: { style: 'thick' }
      };
    });

    worksheet.eachRow({ includeEmpty: true }, function (row) {
      row.height = 25;
    });

    // Exportar el archivo
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





    async GET_DATA(path) {
      const res = await this.$sucursales.$get(path);
      return res;
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$sucursales.$delete(this.apiUrl + '/' + id);
        await Promise.all([this.GET_DATA(this.apiUrl)]).then((v) => {
          this.list = v[0];
        });
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
    async DarDeBaja(id) {
      this.load = true;
      try {
        const item = this.list.find(m => m.id === id);
        if (item) {
          item.estado = 3; // Cambiar estado a 3 (Entregado)
          await this.$sucursales.$put(this.apiUrl + '/' + id, item);
          await Promise.all([this.GET_DATA(this.apiUrl)]).then((v) => {
            this.list = v[0];
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },
    getEstadoLabel(estado) {
      switch (estado) {
        case '1':
          return 'Solicitudes';
        case '2':
          return 'En camino';
        case '3':
          return 'Entregados';
        case '5':
          return 'Pendientes';
        case '0':
          return 'Cancelados';
        default:
          return 'Otro estado';
      }
    },
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
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
  mounted() {
    this.$nextTick(async () => {
      let user = localStorage.getItem('userAuth');
      this.user = JSON.parse(user);
      try {
        const data = await this.GET_DATA(this.apiUrl);
        if (Array.isArray(data)) {
          this.list = data;
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
  /* Para asegurar que los bordes redondeados se apliquen correctamente */
}

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}

.table th,
.table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table th {
  min-width: 100px;
  /* Ajusta este valor según sea necesario */
}

.table th:first-child,
.table td:first-child {
  min-width: 30px;
  /* Ajusta este valor según sea necesario */
}

td img {
  max-width: 100px;
  /* Ajusta el tamaño según tus necesidades */
  height: auto;
}
</style>
