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
              <button class="btn btn-primary btn-sm ml-2" @click="openAddDeliveredModal">
                <i class="fas fa-plus"></i> Añadir envios entregados
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
                        <th class="py-0 px-1">Peso</th>
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
                        <th class="py-0 px-1">Recibido por</th>
                        <th class="py-0 px-1">Fecha Entrega</th>
                        <th class="py-0 px-1">Imagen Capturada</th>
                        <th class="py-0 px-1">Firma Devolucion</th>
                        <th class="py-0 px-1">Imagen Devolucion</th>

                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedData" :key="i">
                        <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>

                        <td class="p-1">{{ m?.sucursale?.nombre ?? 'NULL' }}</td>

                        <td class="p-1">{{ m?.cartero_entrega?.nombre ?? 'Por asignar' }}</td>

                        <td class="py-0 px-1">{{ m?.guia ?? 'NULL' }}</td>

                        <td class="py-0 px-1">{{ (m?.peso_r ?? m?.peso_v) ?? 'NULL' }}</td>

                        <td class="py-0 px-1">{{ m?.remitente ?? 'NULL' }}</td>

                        <!-- Dirección maps (NULL safe) -->
                        <td class="py-0 px-1">
                          <a v-if="m?.direccion?.direccion && isCoordinates(m.direccion.direccion)"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion.direccion"
                            target="_blank" class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ m?.direccion?.direccion ?? 'NULL' }}</span>
                        </td>

                        <td class="py-0 px-1">{{ m?.telefono ?? 'NULL' }}</td>
                        <td class="py-0 px-1">{{ m?.contenido ?? 'NULL' }}</td>
                        <td class="py-0 px-1">{{ m?.fecha ?? 'NULL' }}</td>
                        <td class="py-0 px-1">{{ m?.destinatario ?? 'NULL' }}</td>
                        <td class="py-0 px-1">{{ m?.telefono_d ?? 'NULL' }}</td>

                        <td class="py-0 px-1">
                          <a v-if="m?.direccion_d && isCoordinates(m.direccion_d)"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d" target="_blank"
                            class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ m?.direccion_d ?? 'NULL' }}</span>
                        </td>

                        <td class="py-0 px-1">{{ m?.ciudad ?? 'NULL' }}</td>
                        <td class="py-0 px-1">{{ m?.zona_d ?? 'NULL' }}</td>

                        <td class="py-0 px-1">
                          <img v-if="m?.firma_d" :src="m.firma_d" alt="Firma Destino" width="100" />
                          <span v-else>NULL</span>
                        </td>

                        <td class="py-0 px-1">{{ m?.entrega_observacion ?? 'NULL' }}</td>

                        <td class="py-0 px-1">
                          <span v-if="m?.fecha_devolucion">{{ (m.fecha_devolucion ?? '-') }}</span>
                          <span v-else>{{ m?.fecha_d ?? 'NULL' }}</span>
                        </td>

                        <td class="py-0 px-1">
                          <button v-if="m?.imagen" @click="downloadImage(m.imagen)" class="btn btn-sm btn-primary mt-1">
                            Descargar
                          </button>
                          <span v-else>NULL</span>
                        </td>

                        <td class="py-0 px-1">
                          <img v-if="m?.firma_o" :src="m.firma_o" alt="Firma Origen" width="100" />
                          <span v-else>NULL</span>
                        </td>

                        <td class="py-0 px-1">
                          <button v-if="m?.imagen_devolucion" @click="downloadImage(m.imagen_devolucion)"
                            class="btn btn-sm btn-primary mt-1">
                            Descargar
                          </button>
                          <span v-else>NULL</span>
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
                  <button class="page-link" @click="goToPage(page - 1)">{{ (page ?? '-') }}</button>
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
        <label :for="'peso_v-' + item.id">{{ (item.guia ?? '-') }} - {{ (item.sucursale.nombre ?? '-') }}</label>
        <input type="number" :id="'peso_v-' + item.id" v-model="item.peso_v" class="form-control" />
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-secondary" @click="isModalVisible = false">Cancelar</button>
        <button class="btn btn-primary ml-2" @click="confirmAssignSelected">Asignar</button>
      </div>
    </b-modal>
    <b-modal
      v-model="isAddDeliveredVisible"
      title="Añadir envios entregados"
      hide-backdrop
      hide-footer
      size="xl"
      centered
      modal-class="delivered-modal"
      content-class="delivered-modal-content"
    >
      <div class="delivered-form">
        <div class="row">
          <div class="col-lg-4 col-md-6 mb-3">
            <label class="delivered-label">Sucursal</label>
            <select v-model="deliveredForm.sucursale_id" class="form-control delivered-control">
              <option value="">-- Seleccionar --</option>
              <option v-for="s in sucursales" :key="s.id" :value="s.id">{{ s.nombre }}</option>
            </select>
          </div>

          <div class="col-lg-4 col-md-6 mb-3">
            <label class="delivered-label">Guía</label>
            <input v-model.trim="deliveredForm.guia" class="form-control delivered-control" />
          </div>

          <div class="col-lg-4 col-md-6 mb-3">
            <label class="delivered-label">Peso recibido (Kg)</label>
            <input v-model.trim="deliveredForm.peso_r" class="form-control delivered-control" />
          </div>

          <div class="col-lg-6 col-md-6 mb-3">
            <label class="delivered-label">Remitente</label>
            <input v-model.trim="deliveredForm.remitente" class="form-control delivered-control" />
          </div>

          <div class="col-lg-6 col-md-6 mb-3">
            <label class="delivered-label">Teléfono</label>
            <input v-model.trim="deliveredForm.telefono" class="form-control delivered-control" />
          </div>

          <div class="col-lg-6 col-md-6 mb-3">
            <label class="delivered-label">Destinatario</label>
            <input v-model.trim="deliveredForm.destinatario" class="form-control delivered-control" />
          </div>

          <div class="col-lg-6 col-md-6 mb-3">
            <label class="delivered-label">Teléfono destinatario</label>
            <input v-model.trim="deliveredForm.telefono_d" class="form-control delivered-control" />
          </div>

          <div class="col-md-12 mb-3">
            <label class="delivered-label">Contenido</label>
            <input v-model.trim="deliveredForm.contenido" class="form-control delivered-control" />
          </div>

          <div class="col-md-12 mb-3">
            <label class="delivered-label">Dirección destinatario</label>
            <input v-model.trim="deliveredForm.direccion_d" class="form-control delivered-control" />
          </div>

          <div class="col-md-12 mb-3">
            <label class="delivered-label">Reencaminamiento</label>
            <select v-model="deliveredForm.reencaminamiento" class="form-control delivered-control">
              <option v-for="dep in departamentosEnvio" :key="dep.value" :value="dep.value">
                {{ dep.label }}
              </option>
            </select>
          </div>

          <div class="col-md-12">
            <input type="text" v-model="deliveredForm.imagen" class="form-control d-none" />

            <label class="delivered-upload w-100 text-center">
              <div class="d-flex justify-content-center">
                <div class="d-flex flex-column px-5 py-2">
                  <i class="fa-solid fa-image fa-3x mb-2"></i>
                  <p class="m-0">Sacar / Subir foto</p>
                  <small v-if="deliveredForm.imagen" class="delivered-photo-ok">Foto cargada</small>
                </div>
              </div>
              <input type="file" accept="image/*" id="captureDeliveredPhoto" capture="camera" class="d-none" @change="handleDeliveredPhotoUpload">
            </label>

            <div v-if="deliveredForm.imagen" class="text-center mt-3">
              <img :src="deliveredForm.imagen" alt="Vista previa" class="delivered-preview">
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end mt-4 delivered-actions">
          <button class="btn delivered-btn-cancel" @click="isAddDeliveredVisible = false">Cancelar</button>
          <button class="btn delivered-btn-save ml-2" @click="saveDeliveredManual">Guardar</button>
        </div>
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
      page: 'Envios Entregados',
      modulo: 'Envios Entregados',
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
      isAddDeliveredVisible: false,
deliveredForm: {
  sucursale_id: '',
  guia: '',
  peso_r: '',
  remitente: '',
  telefono: '',
  contenido: '',
  destinatario: '',
  telefono_d: '',
  direccion_d: '',
  reencaminamiento: '',
  imagen: '',
},
departamentosEnvio: [
  { value: '', label: '-- Seleccione --' },
  { value: 'LPB', label: 'La Paz (LPB)' },
  { value: 'SRZ', label: 'Santa Cruz (SRZ)' },
  { value: 'CBB', label: 'Cochabamba (CBB)' },
  { value: 'ORU', label: 'Oruro (ORU)' },
  { value: 'PTI', label: 'Potosí (PTI)' },
  { value: 'TJA', label: 'Tarija (TJA)' },
  { value: 'SRE', label: 'Sucre (SRE)' },
  { value: 'BEN', label: 'Trinidad (TDD)' },
  { value: 'CIJ', label: 'Cobija (CIJ)' }
],
sucursales: [],
    };
  },
  computed: {
    filteredData() {
      const searchTerm = (this.searchTerm || '').toLowerCase();
      const carteroId = this.user?.user?.id;

      return (this.list || [])
        .filter(item => {
          const estadoOk = [3, 4, 10, 7].includes(item?.estado);

          // ✅ mismo cartero (si es null no entra)
          const mismoCartero = item?.cartero_entrega?.id === carteroId;

          // ✅ contratos + EMS (ambos pasan, solo filtramos por estado y cartero)
          const esEMS = (item?.tipo_correspondencia ?? '').toUpperCase() === 'EMS';
          const esContrato = !esEMS; // si quieres separar después

          // ✅ búsqueda segura (no revienta con nulls)
          const coincideBusqueda =
            Object.values(item || {}).some(v =>
              String(v ?? '').toLowerCase().includes(searchTerm)
            ) ||
            String(item?.sucursale?.nombre ?? '').toLowerCase().includes(searchTerm) ||
            String(item?.direccion?.direccion ?? '').toLowerCase().includes(searchTerm);

          // ✅ mantiene estados + cartero + búsqueda + muestra contratos y EMS
          return estadoOk && mismoCartero && coincideBusqueda && (esContrato || esEMS);
        })
        .sort((a, b) => {
          const parseFecha = (str) => {
            if (!str) return 0;

            // formato esperado: "dd/mm/yyyy HH:MM"
            const parts = String(str).split(' ');
            const datePart = parts[0] || '';
            const timePart = parts[1] || '00:00';

            const [day, month, year] = datePart.split('/');
            const [hours, minutes] = timePart.split(':');

            const d = new Date(
              Number(year || 0),
              Number(month || 1) - 1,
              Number(day || 1),
              Number(hours || 0),
              Number(minutes || 0)
            );

            return isNaN(d.getTime()) ? 0 : d.getTime();
          };

          const dateA = a?.fecha_devolucion || a?.fecha_d;
          const dateB = b?.fecha_devolucion || b?.fecha_d;

          return parseFecha(dateB) - parseFecha(dateA); // descendente
        });
    }
    ,
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
  openAddDeliveredModal() {
  // limpiar form
  this.deliveredForm = {
    sucursale_id: '',
    guia: '',
    peso_r: '',
    remitente: '',
    telefono: '',
    contenido: '',
    destinatario: '',
    telefono_d: '',
    direccion_d: '',
    reencaminamiento: '',
    imagen: '',
  };
  this.isAddDeliveredVisible = true;
},

handleDeliveredPhotoUpload(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const maxDimension = 1200;
      const maxLength = 55000; // evita exceder columna TEXT en backend

      let width = img.width;
      let height = img.height;

      if (width > height && width > maxDimension) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else if (height >= width && height > maxDimension) {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }

      let quality = 0.7;
      let attempts = 0;
      let dataurl = '';

      while (attempts < 10) {
        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        dataurl = canvas.toDataURL('image/webp', quality);

        if (dataurl.length <= maxLength) break;

        quality = Math.max(0.2, quality - 0.1);
        width = Math.max(420, Math.round(width * 0.9));
        height = Math.max(420, Math.round(height * 0.9));
        attempts += 1;
      }

      this.deliveredForm.imagen = dataurl;
      console.log('[ENTREGADOS][IMAGEN_PREPARADA]', {
        name: file.name,
        mime: file.type,
        originalSizeBytes: file.size,
        base64Length: dataurl.length
      });

      this.$swal.fire({
        icon: 'success',
        title: 'Foto registrada',
        text: 'La foto se ha subido exitosamente.'
      });
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
},

async saveDeliveredManual() {
  if (!this.deliveredForm.guia) {
    this.$swal.fire({ icon: 'warning', title: 'Falta guía', text: 'La guía es obligatoria.' });
    return;
  }
  if (!this.deliveredForm.remitente || !this.deliveredForm.telefono || !this.deliveredForm.contenido) {
    this.$swal.fire({ icon: 'warning', title: 'Faltan datos', text: 'Remitente, teléfono y contenido son obligatorios.' });
    return;
  }
  if (!this.deliveredForm.destinatario || !this.deliveredForm.telefono_d) {
    this.$swal.fire({ icon: 'warning', title: 'Faltan datos', text: 'Destinatario y teléfono destinatario son obligatorios.' });
    return;
  }

  this.load = true;
  let payload = null;
  try {
    const now = new Date();
    payload = {
      ...this.deliveredForm,
      estado: 3,
      fecha_d: `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    };

    console.log('[ENTREGADOS][REQUEST]', {
      ...payload,
      imagen: payload?.imagen ? `[base64 length: ${payload.imagen.length}]` : '(vacio)'
    });

    const response = await this.$api.$post('solicitudes/entregados', payload);
    console.log('[ENTREGADOS][RESPONSE]', response);

    if (response?.id && !response?.imagen && payload?.imagen) {
      console.warn('[ENTREGADOS][WARN] POST devolvió imagen null. Intentando guardar imagen por PUT...');
      const updateRes = await this.$api.$put(`${this.apiUrl}/${response.id}`, { imagen: payload.imagen });
      console.log('[ENTREGADOS][PUT_IMAGEN_RESPONSE]', updateRes);
    }

    await this.GET_DATA(this.apiUrl);
    this.isAddDeliveredVisible = false;

    this.$swal.fire({
      icon: 'success',
      title: 'Guardado',
      text: 'Envío entregado registrado correctamente.'
    });
  } catch (e) {
    const errorPayload = {
      message: e?.message || 'Error desconocido',
      status: e?.response?.status || null,
      data: e?.response?.data || null,
      sentPayload: payload
        ? { ...payload, imagen: payload?.imagen ? `[base64 length: ${payload.imagen.length}]` : '(vacio)' }
        : null
    };
    console.error('[ENTREGADOS][ERROR]', errorPayload);
    this.$swal.fire({
      icon: 'error',
      title: 'Error',
      text: `No se pudo guardar el envío entregado. Revisa consola (F12). Status: ${errorPayload.status ?? 'N/A'}`
    });
  } finally {
    this.load = false;
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
        const estadoTexto = 'ENTREGADO';

        // ✅ AHORA SERVICIO = NOMBRE DE SUCURSAL
        const servicioTexto =
          m?.sucursale?.nombre
          ?? (((m?.tipo_correspondencia ?? '').toUpperCase() === 'EMS')
            ? 'PARTICULAR'
            : 'SIN SUCURSAL');

        const row = worksheet.addRow({
          index: i + 1,
          servicio: servicioTexto,
          guia: m?.guia ?? 'NULL',
          fecha: m?.fecha_recojo_c ?? 'NULL',
          ciudad: m?.ciudad ?? 'NULL',
          zona_destinatario: m?.zona_d ?? 'NULL',
          cartero: m?.cartero_entrega?.nombre ?? 'Por asignar',
          peso_correos: m?.peso_v ? `${m.peso_v} Kg` : 'NULL',
          fecha_destinatario: m?.fecha_d ?? 'NULL',
          estado: estadoTexto,
          observacion: m?.observacion ?? 'NULL',
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
        if (path === this.apiUrl && Array.isArray(res)) {
          this.list = res;
        }
        return res;
      } catch (e) {
        console.error('Error al obtener los datos:', e);
        return null;
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
      const sucursales = await this.GET_DATA('sucursales');
      this.sucursales = Array.isArray(sucursales) ? sucursales : [];
      if (user) {
        this.user = JSON.parse(user);
        console.log('Usuario cargado:', this.user);
      } else {
        console.error('No se encontró el usuario en el almacenamiento local');
        this.user = { cartero: null };
      }

      try {
        await this.GET_DATA(this.apiUrl);
        console.log('Datos cargados:', this.list);
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

.delivered-form {
  background: linear-gradient(180deg, #f9fbff 0%, #f4f6fa 100%);
  border: 1px solid #dde5f2;
  border-radius: 14px;
  padding: 16px;
}

.delivered-label {
  font-weight: 700;
  color: #2b3f67;
  font-size: 14px;
  margin-bottom: 6px;
}

.delivered-control {
  border: 1px solid #c8d4ea;
  border-radius: 10px;
  height: 42px;
  box-shadow: none;
}

.delivered-control:focus {
  border-color: #4466a8;
  box-shadow: 0 0 0 0.18rem rgba(68, 102, 168, 0.18);
}

.delivered-upload {
  border: 2px dashed #b8c8e4;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  color: #48699f;
  transition: all 0.2s ease;
}

.delivered-upload:hover {
  border-color: #4466a8;
  background: #f6f9ff;
}

.delivered-photo-ok {
  color: #1f7a43;
  font-weight: 600;
}

.delivered-preview {
  max-width: 220px;
  max-height: 220px;
  border-radius: 10px;
  border: 1px solid #b9c8e2;
  box-shadow: 0 8px 20px rgba(28, 47, 84, 0.12);
}

.delivered-actions .btn {
  min-width: 120px;
  border-radius: 10px;
  font-weight: 700;
}

.delivered-btn-cancel {
  background: #e5e7eb;
  border-color: #d1d5db;
  color: #374151;
}

.delivered-btn-cancel:hover {
  background: #d7dbe2;
  border-color: #c2c8d0;
}

.delivered-btn-save {
  background: #34447c;
  border-color: #34447c;
  color: #fff;
}

.delivered-btn-save:hover {
  background: #2b3765;
  border-color: #2b3765;
}

::v-deep .delivered-modal .modal-dialog {
  width: 70vw;
  max-width: 70vw;
  margin: 1rem auto !important;
}

::v-deep .delivered-modal {
  padding-left: 0 !important;
}

::v-deep .delivered-modal-content {
  border-radius: 16px;
  border: 1px solid #c9d7ef;
  box-shadow: 0 16px 44px rgba(16, 30, 58, 0.22);
  overflow: hidden;
}

::v-deep .delivered-modal .modal-header {
  background: #f4f7ff;
  border-bottom: 1px solid #dbe4f3;
}

::v-deep .delivered-modal .modal-title {
  font-weight: 800;
  color: #2f4573;
}

@media (max-width: 768px) {
  ::v-deep .delivered-modal .modal-dialog {
    width: calc(100vw - 0.5rem);
    max-width: none;
    margin: 0.25rem auto;
  }

  .delivered-form {
    padding: 10px;
  }

  .delivered-actions .btn {
    min-width: 100px;
  }
}
</style>
