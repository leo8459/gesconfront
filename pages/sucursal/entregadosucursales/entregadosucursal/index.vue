<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row mb-3">
          <div class="col-md-9 d-flex align-items-end">
            <div class="d-flex align-items-center">
              <label for="startDate" class="form-label me-2">Fecha Inicial</label>
              <input type="date" v-model="startDate" id="startDate" class="form-control me-2"
                placeholder="Fecha inicio">
            </div>
            <div class="d-flex align-items-center">
              <label for="endDate" class="form-label me-2">Fecha Final</label>
              <input type="date" v-model="endDate" id="endDate" class="form-control me-2" placeholder="Fecha fin">
            </div>
            <button @click="exportToExcel" class="btn btn-success btn-sm me-2">
              <i class="fas fa-file-excel"></i> Exportar a Excel
            </button>
          </div>
          <div class="col-md-3 text-end">
            <input v-model="searchTerm" type="text" class="form-control mb-2" placeholder="Buscar...">
            <div class="d-flex justify-content-end">
              <button @click="mostrarLimiteFaltante" class="btn btn-warning btn-sm me-2">
                Mostrar límite faltante
              </button>

            </div>
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
                        <th class="py-0 px-1">Teléfono</th>
                        <th class="py-0 px-1">Contenido</th>
                        <th class="py-0 px-1">Fecha de Solicitud</th>
                        <th class="py-0 px-1">Destinatario</th>
                        <th class="py-0 px-1">Teléfono Destinatario</th>
                        <th class="py-0 px-1">Dirección Destinatario maps</th>
                        <th class="py-0 px-1">Dirección Destinatario</th>
                        <th class="py-0 px-1">Municipio/Provincia</th>
                        <th class="py-0 px-1">Zona</th>
                        <th class="py-0 px-1">Fecha de Entrega</th>
                        <th class="py-0 px-1">Precio (Bs)</th>
                        <th class="py-0 px-1">Firma Destinatario</th>
                        <th class="py-0 px-1">Recibido por</th>
                        <th class="py-0 px-1">Imagen</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedList" :key="m?.id ?? i">
                        <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>

                        <td class="p-1">
                          {{ m?.sucursale?.nombre ?? 'SIN SUCURSAL' }}
                        </td>

                        <td class="py-0 px-1">{{ m?.guia ?? 'SIN GUÍA' }}</td>

                        <td class="py-0 px-1">
                          {{ (m?.peso_r ?? m?.peso_v) ?? '0' }}
                        </td>

                        <td class="py-0 px-1">{{ m?.remitente ?? 'SIN REMITENTE' }}</td>

                        <td class="py-0 px-1">{{ m?.telefono ?? 'SIN TELÉFONO' }}</td>

                        <td class="py-0 px-1">{{ m?.contenido ?? 'SIN CONTENIDO' }}</td>

                        <td class="py-0 px-1">{{ m?.fecha_recojo_c ?? 'SIN FECHA' }}</td>

                        <td class="py-0 px-1">{{ m?.destinatario ?? 'SIN DESTINATARIO' }}</td>

                        <td class="py-0 px-1">{{ m?.telefono_d ?? 'SIN TELÉFONO' }}</td>

                        <td class="py-0 px-1">
                          <a v-if="m?.direccion_d && isCoordinates(String(m.direccion_d))"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d" target="_blank"
                            class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ m?.direccion_d ?? 'SIN DIRECCIÓN' }}</span>
                        </td>

                        <td class="py-0 px-1">{{ m?.direccion_especifica_d ?? 'SIN DETALLE' }}</td>

                        <td class="py-0 px-1">{{ m?.ciudad ?? 'SIN CIUDAD' }}</td>

                        <td class="py-0 px-1">{{ m?.zona_d ?? 'SIN ZONA' }}</td>

                        <td class="py-0 px-1">{{ m?.fecha_d ?? 'SIN FECHA' }}</td>

                        <td class="py-0 px-1">{{ m?.nombre_d ?? '0.00' }}</td>

                        <td class="py-0 px-1">
                          <img v-if="m?.firma_d" :src="m.firma_d" alt="Firma Destinatario" width="100" />
                          <span v-else>SIN FIRMA</span>
                        </td>

                        <td class="py-0 px-1">{{ m?.entrega_observacion ?? 'SIN OBSERVACIÓN' }}</td>

                        <td class="py-0 px-1">
                          <div class="d-flex flex-column align-items-center">
                            <button v-if="m?.imagen" @click="downloadImage(m.imagen)"
                              class="btn btn-sm btn-primary mt-1 align-self-start">
                              Descargar
                            </button>
                            <span v-else>SIN IMAGEN</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>

                  </table>
                </div>
                <!-- Paginación -->
                <nav aria-label="Page navigation">
                  <ul class="pagination justify-content-between">
                    <!-- Botón de página anterior -->
                    <li class="page-item" :class="{ disabled: currentPage === 0 }">
                      <button class="page-link" @click="goToPage(currentPage - 1)"
                        :disabled="currentPage === 0">&lt;</button>
                    </li>

                    <!-- Páginas dinámicas -->
                    <li v-for="page in totalPagesArray" :key="page"
                      :class="['page-item', { active: page === currentPage + 1 }]">
                      <button v-if="page !== '...'" class="page-link" @click="goToPage(page - 1)">
                        {{ dash(page) }}
                      </button>
                      <span v-else class="page-link">...</span>
                    </li>

                    <!-- Botón de página siguiente -->
                    <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                      <button class="page-link" @click="goToPage(currentPage + 1)"
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
      saldoRestante: null // Nueva variable para almacenar el saldo restante

    };
  },
  computed: {
    totalPagesArray() {
      const totalPages = this.totalPages;
      const currentPage = this.currentPage + 1; // Índice basado en 1 para mostrar
      const maxPagesToShow = 3;

      const pages = [];

      // Mostrar los primeros 3 números
      for (let i = 1; i <= Math.min(maxPagesToShow, totalPages); i++) {
        pages.push(i);
      }

      // Mostrar puntos suspensivos si hay un salto entre las primeras y las páginas actuales
      if (currentPage > maxPagesToShow + 1) {
        pages.push('...');
      }

      // Mostrar las páginas cercanas a la actual
      const startPage = Math.max(currentPage - 1, maxPagesToShow + 1);
      const endPage = Math.min(currentPage + 1, totalPages - maxPagesToShow);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Mostrar puntos suspensivos si hay un salto entre las páginas actuales y las últimas
      if (currentPage < totalPages - maxPagesToShow) {
        pages.push('...');
      }

      // Mostrar los últimos 3 números
      for (let i = Math.max(totalPages - maxPagesToShow + 1, endPage + 1); i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    },
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
      }).filter(item => item?.sucursale?.id === this.user?.user?.id && (item.estado === 3 || item.estado === 4));
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


    async obtenerSaldoRestante() {
      try {
        const lastAlertDate = localStorage.getItem('lastAlertDate');
        const today = new Date().toLocaleDateString();

        // Si la alerta ya fue mostrada hoy, no hacer nada y salir de la función
        if (lastAlertDate === today) {
          return;
        }

        const sucursaleId = this.user.user.id;
        const response = await this.$sucursales.$get(`restante2/${sucursaleId}`);
        this.saldoRestante = response.saldo_restante;

        const limiteTotal = response.limite_total;
        const diezPorCiento = limiteTotal * 0.1;

        if (this.saldoRestante < diezPorCiento) {
          this.$swal.fire({
            icon: 'warning',
            title: 'Saldo Bajo',
            text: `El saldo restante para la sucursal es: ${this.saldoRestante} Bs. Esto es menos del 10% de su límite total (${limiteTotal} Bs). ¡Comunícate con la AGBC pronto!`,
            confirmButtonText: 'Aceptar'
          });

          // Guardar la fecha actual en localStorage para evitar mostrar la alerta más de una vez al día
          localStorage.setItem('lastAlertDate', today);
        }

      } catch (e) {
        console.error('Error al obtener el saldo restante:', e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener el saldo restante.',
          confirmButtonText: 'Aceptar'
        });
      }
    },

    async mostrarLimiteFaltante() {
      try {
        const sucursaleId = this.user.user.id;
        const response = await this.$sucursales.$get(`restante2/${sucursaleId}`);
        this.saldoRestante = response.saldo_restante;

        const limiteTotal = response.limite_total;
        const diezPorCiento = limiteTotal * 0.1;

        if (this.saldoRestante < diezPorCiento) {
          this.$swal.fire({
            icon: 'warning',
            title: 'Saldo Bajo',
            text: `El saldo restante para la sucursal es: ${this.saldoRestante} Bs. Esto es menos del 10% de su límite total (${limiteTotal} Bs). ¡Comunícate con la AGBC pronto!`,
            confirmButtonText: 'Aceptar'
          });
        } else {
          this.$swal.fire({
            icon: 'info',
            title: 'Saldo Disponible',
            text: `El saldo restante es suficiente: ${this.saldoRestante} Bs.`,
            confirmButtonText: 'Aceptar'
          });
        }

      } catch (e) {
        console.error('Error al mostrar el límite faltante:', e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener el saldo restante.',
          confirmButtonText: 'Aceptar'
        });
      }
    }



    ,

    downloadImage(base64Image) {
      const link = document.createElement('a');
      link.href = base64Image; // Aquí estás usando la imagen original almacenada
      link.download = 'imagen_capturada.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

        { header: 'Contenido', key: 'contenido', width: 25 },
        { header: 'Firma Destinatario', key: 'firma_destinatario', width: 30 },
        { header: 'Fecha de Envio', key: 'fecha', width: 20 },

        { header: 'Peso (Kg)', key: 'peso', width: 15 },
        { header: 'Fecha de Entrega', key: 'fecha_entrega', width: 20 },
        { header: 'Precio (Bs)', key: 'precio', width: 15 },
        { header: 'Firma (Bs)', key: '', width: 20 },


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
          peso: m.peso_r ? m.peso_r : m.peso_v,  // Aquí aplicas la misma lógica

          contenido: m.contenido,
          fecha: m.fecha_recojo_c,
          precio: m.nombre_d,
          fecha_entrega: m.fecha_d,
        });

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
            ext: { width: 120, height: 30 }
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
    },





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
    goToPage(page) {
      if (page >= 0 && page < this.totalPages) {
        this.currentPage = page;
      }
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
  },
  mounted() {
    this.$nextTick(async () => {
      const userStr = localStorage.getItem('userAuth');

      // ✅ NULL-safe
      this.user = userStr ? JSON.parse(userStr) : { user: null };

      // ✅ si no hay user, evita errores
      if (!this.user?.user?.id) {
        this.load = false;
        this.$swal?.fire?.({
          icon: 'warning',
          title: 'Sin sesión',
          text: 'No se encontró usuario logueado (userAuth).',
        });
        return;
      }

      await this.obtenerSaldoRestante();

      try {
        const data = await this.GET_DATA(this.apiUrl);
        if (Array.isArray(data)) {
          this.list = data;
        } else {
          console.error('Los datos recuperados no son un array:', data);
          this.list = [];
        }
      } catch (e) {
        console.error('Error al obtener los datos:', e);
        this.list = [];
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
  border: 1px solid #34447C;
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

.table th,
.table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  vertical-align: middle;
}

.table th {
  background-color: #6c7a89;
  color: #FFFFFF;
  border-bottom: 2px solid #34447C;
}

.table-hover tbody tr:hover {
  background-color: #F8F9FA;
}

.pagination .page-item.active .page-link {
  background-color: #ffffff;
  border-color: #ffffff;
}

.pagination .page-item .page-link {
  color: #343A40;
}

.btn-warning {
  background-color: #ffcc00;
  border-color: #ffcc00;
  color: #000;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  height: calc(2.25rem + 2px);
  padding: 0.375rem 0.75rem;
}

.btn-primary {
  background-color: #e50580;
  border-color: #e50580;
}

.btn-primary:hover {
  background-color: #34447C;
  border-color: #34447C;
}

.btn-dark {
  background-color: #343a40;
  border-color: #343a40;
}

.me-2 {
  margin-right: 10px;
}

.w-100 {
  width: 100%;
}

.pagination .page-item.active .page-link {
  background-color: #34447C;
  color: white;
  border-color: #34447C;
}

.pagination .page-item .page-link {
  color: #343a40;
  cursor: pointer;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
}
</style>