<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
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
          </div>

          <div class="col-3">
            <input v-model="searchTerm" @keypress.enter="handleSearchEnter" type="text" class="form-control"
              placeholder="Buscar..." />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                ENTREGADOS
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                    <th class="py-0 px-1">#</th>
                    <th class="py-0 px-1">Sucursal</th>
                    <th class="py-0 px-1">Cartero</th>
                    <th class="py-0 px-1">Guia</th>
                    <th class="py-0 px-1">Peso Correos (Kg)</th>
                    <th class="py-0 px-1">Remitente</th>

                    <!-- Nueva columna para la dirección específica -->
                    <th class="py-0 px-1">Dirección maps</th>
                    <th class="py-0 px-1">Teléfono</th>
                    <th class="py-0 px-1">Contenido</th>
                    <th class="py-0 px-1">Fecha</th>
                    <th class="py-0 px-1">Destinatario</th>
                    <th class="py-0 px-1">Teléfono D</th>
                    <th class="py-0 px-1">Dirección Destinatario</th>
                    <th class="py-0 px-1">Municipio/Provincia</th>
                    <th class="py-0 px-1">Zona Destinatario</th>
                    <th class="py-0 px-1">Firma Destinatario</th>
                    <th class="py-0 px-1">Fecha Entrega</th>
                    <th class="py-0 px-1">Imagen Capturada</th>
                    <th class="py-0 px-1">Firma Devolucion</th>
                    <th class="py-0 px-1">Imagen Devolucion</th>

                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(m, i) in paginatedData" :key="i">
                    <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                    <td class="p-1">{{ m.sucursale.nombre }}</td>
                    <td class="p-1">{{ m.cartero_entrega ? m.cartero_entrega.nombre : 'Por asignar' }}</td>
                    <td class="py-0 px-1">{{ m.guia }}</td>
                    <td class="py-0 px-1">{{ m.peso_r ? m.peso_r : m.peso_v }}</td>
                    <td class="py-0 px-1">{{ m.remitente }}</td>
                    <!-- Mostrar la dirección específica -->
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
                    <td class="py-0 px-1">{{ m.ciudad }}</td>
                    <td class="py-0 px-1">{{ m.zona_d }}</td>
                    <td class="py-0 px-1">
                      <img v-if="m.firma_d" :src="m.firma_d" alt="Firma Destino" width="100" />
                    </td>
                    <td class="py-0 px-1">
  <span v-if="m.fecha_devolucion">{{ m.fecha_devolucion }}</span>
  <span v-else>{{ m.fecha_d }}</span>
</td>


                    <td class="py-0 px-1">
                      
                      <button v-if="m.imagen" @click="downloadImage(m.imagen)"
                        class="btn btn-sm btn-primary mt-1">Descargar</button>
                    </td>
                    
                    <td class="py-0 px-1">
                      <img v-if="m.firma_o" :src="m.firma_o" alt="Firma Destino" width="100" />
                    </td>
                    <td class="py-0 px-1">
                      
                      <button v-if="m.imagen_devolucion" @click="downloadImage(m.imagen_devolucion)"
                        class="btn btn-sm btn-primary mt-1">Descargar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

            <!-- Paginación -->
            <nav aria-label="Page navigation">
              <ul class="pagination justify-content-between">
                <li class="page-item" :class="{ disabled: currentPage === 0 }">
                  <button class="page-link" @click="previousPage" :disabled="currentPage === 0">
                    <</button>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page"
                  :class="{ active: currentPage === page - 1 }">
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

    <!-- Modal para añadir peso_v -->
    <b-modal v-model="isModalVisible" title="Asignar Peso Correos (Kg)" hide-backdrop>
      <div v-for="item in selectedItemsData" :key="item.id" class="form-group">
        <label :for="'peso_v-' + item.id">{{ item.guia }} - {{ item.sucursale.nombre }}</label>
        <input type="number" :id="'peso_v-' + item.id" v-model="item.peso_v" class="form-control" />
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-secondary" @click="isModalVisible = false">Cancelar</button>
        <button class="btn btn-primary ml-2" @click="confirmAssignSelected">Asignar</button>
      </div>
    </b-modal>
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
      startDate: '', // Nueva variable para la fecha de inicio
      endDate: '',   // Nueva variable para la fecha de fin
      selectedItemsData: [],
      user: {
        cartero: []
      },
      currentPage: 0,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredData() {
    const searchTerm = this.searchTerm.toLowerCase();

    return this.list
      .filter(item =>
        (item.estado === 3 || item.estado === 4 || item.estado === 10 || item.estado === 7) &&
        item.cartero_entrega && item.cartero_entrega.id === this.user.user.id &&
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm)
        )
      )
      .sort((a, b) => {
        // Usamos fecha_devolucion si existe, de lo contrario usamos fecha_d
        const dateA = a.fecha_devolucion || a.fecha_d;
        const dateB = b.fecha_devolucion || b.fecha_d;

        // Asegúrate de que ambas fechas existen y tienen el formato correcto
        if (dateA && dateB) {
          const [dayA, monthA, yearTimeA] = dateA.split('/');
          const [dayB, monthB, yearTimeB] = dateB.split('/');

          const [yearA, timeA] = yearTimeA.split(' ');
          const [yearB, timeB] = yearTimeB.split(' ');

          const [hoursA, minutesA] = timeA.split(':');
          const [hoursB, minutesB] = timeB.split(':');

          const dateObjA = new Date(yearA, monthA - 1, dayA, hoursA, minutesA);
          const dateObjB = new Date(yearB, monthB - 1, dayB, hoursB, minutesB);

          // Orden descendente (del más nuevo al más antiguo)
          return dateObjB - dateObjA;
        }
        return 0;
      });
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

      // Filtrar los datos por el rango de fechas, estados 3, 4, o 7, y cartero logueado
const filteredData = this.list.filter(m => {
  // Verificar si el cartero corresponde al logueado
  if (!m.cartero_entrega || m.cartero_entrega.id !== this.user.user.id) {
    return false;
  }

  // Seleccionar la fecha a usar: si existe fecha_devolucion, usar esa; si no, usar fecha_d
  const fechaUsar = m.fecha_devolucion ? m.fecha_devolucion : m.fecha_d;

  // Asegurarse de que la fecha no es nula
  if (!fechaUsar) {
    return false;
  }

  // Convertir la fecha al formato Date
  const [day, month, yearTime] = fechaUsar.split('/');
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

  const fechaFinal = new Date(year, month - 1, day, hours, minutes);

  // Comparar si fechaFinal está entre start y end, y si el estado es 3, 4 o 7
  return (m.estado === 3 || m.estado === 4 || m.estado === 7) && fechaFinal >= start && fechaFinal <= end;
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
      const worksheet = workbook.addWorksheet('Solicitudes Filtradas');

      worksheet.columns = [
        { header: '#', key: 'index', width: 5 },
        { header: 'Servicio', key: 'servicio', width: 40 },
        { header: 'Guia', key: 'guia', width: 20 },
        { header: 'Fecha de recojo', key: 'fecha', width: 25 },
        { header: 'Municipio', key: 'ciudad', width: 25 },
        { header: 'Zona Destinatario', key: 'zona_destinatario', width: 30 },
        { header: 'Cartero', key: 'cartero', width: 20 },
        { header: 'Peso', key: 'peso_correos', width: 10 },
        { header: 'Fecha de Entrega', key: 'fecha_destinatario', width: 25 },
        { header: 'Estado', key: 'estado', width: 20 },
        { header: 'Observación', key: 'observacion', width: 25 },
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

      filteredData.forEach((m, i) => {
        const estadoTexto = m.estado === 3 ? 'ENTREGADO' : 'ENTREGADO';

        const row = worksheet.addRow({
          index: i + 1,
          servicio: m.tarifa.servicio,
          guia: m.guia,
          fecha: m.fecha_recojo_c,
          ciudad: m.ciudad,
          zona_destinatario: m.zona_d,
          cartero: m.cartero_entrega ? m.cartero_entrega.nombre : 'Por asignar',
          peso_correos: m.peso_v + ' Kg',
          fecha_destinatario: m.fecha_d,
          estado: estadoTexto,
          observacion: m.observacion,
        });

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
      });

      worksheet.eachRow({ includeEmpty: true }, function (row) {
        row.height = 25;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Solicitudes_Filtradas.xlsx';
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

    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    async markAsEnCamino(solicitudeId) {
      this.load = true;
      try {
        const carteroId = this.user.id;
        const response = await this.$api.$put(`solicitudesrecojo/${solicitudeId}`, { cartero_recogida_id: carteroId });
        await this.GET_DATA(this.apiUrl);
        this.$swal.fire({
          icon: 'success',
          title: 'Cartero asignado',
          text: `La solicitud ${solicitudeId} ha sido marcada como 'En camino'.`,
        });
        await this.GET_DATA(this.apiUrl); // Forzar actualización de la lista
      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al asignar el cartero.',
        });
      } finally {
        this.load = false;
      }
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
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$api.$delete(this.apiUrl + '/' + id);
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
        title: 'Deseas Eliminar?',
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
        const carteroId = this.user.id;
        const item = this.list.find(m => m.id === id);
        if (item) {
          const response = await this.$api.$put(`solicitudesentrega/${id}`, { cartero_entrega_id: carteroId, peso_v: item.peso_v });
          item.estado = response.estado; // Actualizar estado desde la respuesta
          item.cartero_entrega_id = response.cartero_entrega_id; // Actualizar cartero de entrega desde la respuesta
          item.peso_v = response.peso_v; // Actualizar peso desde la respuesta
          await this.GET_DATA(this.apiUrl);
        }
        await this.GET_DATA(this.apiUrl); // Forzar actualización de la lista
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },
    openAssignModal() {
      this.selectedItemsData = this.list.filter(item => this.selected[item.id]).map(item => ({
        id: item.id,
        guia: item.guia,
        sucursale: item.sucursale,
        peso_v: item.peso_v || 0
      }));
      this.isModalVisible = true;
    },
    handleSearchEnter() {
      this.selectedItemsData = this.filteredData;
      if (this.selectedItemsData.length > 0) {
        this.isModalVisible = true;
      }
    },
    async confirmAssignSelected() {
      this.load = true;
      try {
        const carteroId = this.user.user.id;
        for (let item of this.selectedItemsData) {
          if (item && item.id) { // Verificación adicional
            await this.$api.$put(`solicitudesentrega/${item.id}`, { cartero_entrega_id: carteroId, peso_v: item.peso_v });
          } else {
            console.error('Item inválido:', item);
          }
        }
        await this.GET_DATA(this.apiUrl); // Forzar actualización de la lista
        this.$swal.fire({
          icon: 'success',
          title: 'Carteros asignados',
          text: 'Todos los carteros seleccionados han sido asignados.',
        });
        this.isModalVisible = false;
        this.selected = {}; // Limpiar la selección después de asignar
        await this.GET_DATA(this.apiUrl); // Forzar actualización de la lista
      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al asignar los carteros.',
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
  border: 1px solid #000000;
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

.table {
  text-align: center;
  vertical-align: middle;
}

.table th {
  background-color: #6c7a89;
  color: #FFFFFF;
  border-bottom: 2px solid #34447C;
  font-size: 16px;
  text-align: center;
  white-space: nowrap;
}

.table td {
  font-size: 16px;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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

.btn-primary {
  background-color: #34447C;
  border-color: #34447C;
}

.btn-primary:hover {
  background-color: #4a5a7a;
}
</style>