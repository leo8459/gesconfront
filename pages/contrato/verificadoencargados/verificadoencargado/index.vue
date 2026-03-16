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
            <!-- {{ (user.user ?? '-') }} -->
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
          <div class="col-md-2">
            <label for="startDate" class="form-label">Fecha Inicio</label>
            <input v-model="startDate" type="date" id="startDate" class="form-control" />
          </div>
          <!-- Filtro Fecha Fin -->
          <div class="col-md-2">
            <label for="endDate" class="form-label">Fecha Fin</label>
            <input v-model="endDate" type="date" id="endDate" class="form-control" />
          </div>
          <!-- Filtro Sucursal -->
          <div class="col-md-2">
            <label for="sucursal" class="form-label">Sucursal</label>
            <v-select :options="sucursalOptions" v-model="selectedSucursales" label="nombre"
              :reduce="sucursal => sucursal.group_key"
              placeholder="Buscar gestoras..."
              multiple
              :close-on-select="false"
              :clear-search-on-select="false">
              <template #option="option">
                <div class="d-flex align-items-center">
                  <input
                    class="mr-2 sucursal-option-checkbox"
                    type="checkbox"
                    :checked="isSucursalOptionSelected(option)"
                    tabindex="-1"
                    @click.prevent
                    @mousedown.prevent
                  />
                  {{ (option.nombre ?? '-') }}
                </div>
              </template>
              <template #selected-option="option">
                <div>
                  {{ option.nombre }}
                </div>
              </template>
            </v-select>
          </div>
          <!-- Filtro Empresa -->
          <div class="col-md-2">
            <label for="empresa" class="form-label">Empresa</label>
            <select v-model="selectedEmpresa" class="form-control" id="empresa">
              <option value="">Todas</option>
              <option v-for="empresa in empresaOptions" :key="empresa.value" :value="empresa.value">
                {{ empresa.label }}
              </option>
            </select>
          </div>
          <!-- Filtro Departamento de la Sucursal -->
          <div class="col-md-2">
            <label for="origen" class="form-label">Departamento de la sucursal</label>
            <select v-model="selectedOrigen" class="form-control" id="origen">
              <option value="">Todos</option>
              <option value="LPB_SRZ">La Paz + Santa Cruz (LPB/SRZ)</option>
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
          <!-- Filtro Numero de Contrato -->
          <div class="col-md-2">
            <label for="numeroContrato" class="form-label">Numero de contrato</label>
            <select v-model="selectedNumeroContrato" class="form-control" id="numeroContrato">
              <option value="">Todos</option>
              <option v-for="numero in numeroContratoOptions" :key="numero.value" :value="numero.value">
                {{ numero.label }}
              </option>
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
    <td class="py-0 px-1">{{ m?.reencaminamiento ?? m?.ciudad ?? '-' }}</td>

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
      apiUrl: 'solicitudes-verificado',
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
      pagination: { current_page: 1, last_page: 1, total: 0, per_page: 10 },
      empresaOptionsData: [],
      numeroContratoOptionsData: [],
      selectedOrigen: '', // Nuevo filtro Origen
      selectedEmpresa: '',
      selectedNumeroContrato: '',
    };
  },
  computed: {
    sucursalOptions() {
      const groups = new Map();

      (this.sucursales || []).forEach((sucursal) => {
        const groupName = this.getSucursalGroupName(sucursal);
        if (!groupName) return;

        if (!groups.has(groupName)) {
          groups.set(groupName, {
            group_key: groupName,
            nombre: groupName,
            ids: [],
          });
        }

        const group = groups.get(groupName);
        if (sucursal?.id !== null && sucursal?.id !== undefined) {
          group.ids.push(sucursal.id);
        }
      });

      return Array.from(groups.values()).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    },

    selectedSucursalIds() {
      const selectedKeys = new Set((this.selectedSucursales || []).map((value) => String(value)));
      const ids = [];

      (this.sucursalOptions || []).forEach((option) => {
        if (!selectedKeys.has(String(option.group_key))) {
          return;
        }

        (option.ids || []).forEach((id) => {
          if (id !== null && id !== undefined && id !== '' && !ids.includes(id)) {
            ids.push(id);
          }
        });
      });

      return ids;
    },

    empresaOptions() {
      return Array.isArray(this.empresaOptionsData) ? this.empresaOptionsData : [];
    },

    numeroContratoOptions() {
      return Array.isArray(this.numeroContratoOptionsData) ? this.numeroContratoOptionsData : [];
    },

    filteredData() {
      return Array.isArray(this.list) ? this.list : [];
    },



    paginatedData() {
      return this.filteredData;
    },
    totalPages() {
      return Number(this.pagination?.last_page || 1);
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
    normalizeArrayPayload(payload) {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      if (Array.isArray(payload?.solicitudes)) return payload.solicitudes;
      return [];
    },
    normalizePaginationPayload(payload) {
      return {
        current_page: Number(payload?.current_page || 1),
        last_page: Number(payload?.last_page || 1),
        total: Number(payload?.total || this.normalizeArrayPayload(payload).length || 0),
        per_page: Number(payload?.per_page || this.itemsPerPage || 10),
      };
    },
    applyPaginationPayload(payload) {
      const pagination = this.normalizePaginationPayload(payload);
      this.pagination = pagination;
      this.itemsPerPage = pagination.per_page;
      this.currentPage = pagination.current_page;
      this.empresaOptionsData = Array.isArray(payload?.empresas) ? payload.empresas : [];
      this.numeroContratoOptionsData = Array.isArray(payload?.contratos) ? payload.contratos : [];
    },
    buildListPath(page = this.currentPage, perPage = this.itemsPerPage) {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('per_page', perPage);

      const search = String(this.searchTerm || '').trim();
      if (search) params.set('search', search);
      if (this.startDate) params.set('start_date', this.startDate);
      if (this.endDate) params.set('end_date', this.endDate);
      if (this.selectedOrigen) params.set('origen', this.selectedOrigen);
      if (this.selectedEmpresa) params.set('empresa', this.selectedEmpresa);
      if (this.selectedNumeroContrato) params.set('numero_contrato', this.selectedNumeroContrato);
      (this.selectedSucursalIds || []).forEach((id) => {
        if (id !== null && id !== undefined && id !== '') {
          params.append('sucursal_ids[]', id);
        }
      });

      return `${this.apiUrl}?${params.toString()}`;
    },
    async hydratePdfJustificacion(items) {
      try {
        const db = await openDB('pdf-storage', 1);
        for (const item of items) {
          const pdfRecord = await db.get('pdfs', item.id);
          item.pdf_justificacion = pdfRecord ? pdfRecord.content : null;
        }
      } catch (e) {
        console.error('Error al recuperar PDFs desde IndexedDB:', e);
      }
    },
    getOrigenesSeleccionados(origenValue, includeDefaultForReport = false) {
      const todosLosOrigenes = ['LPB', 'SRZ', 'CBB', 'ORU', 'PTI', 'TJA', 'SRE', 'BEN', 'CIJ'];
      const rawValue = String(origenValue || '').trim();
      if (!rawValue) {
        return includeDefaultForReport ? todosLosOrigenes : [];
      }
      if (rawValue === 'LPB_SRZ') {
        return ['LPB', 'SRZ'];
      }
      if (rawValue === 'TODOS') {
        return todosLosOrigenes;
      }
      return [this.normalizeDepartamento(rawValue)];
    },

    normalizeDepartamento(value) {
      if (!value) return '';
      const cleaned = String(value).trim().toUpperCase();
      const text = cleaned.replace(/\s+/g, ' ');

      if (text.includes('LA PAZ') || text.includes('LPB') || text.includes('LPZ')) return 'LPB';
      if (text.includes('SANTA CRUZ') || text.includes('SRZ') || text.includes('SCZ')) return 'SRZ';
      if (text.includes('COCHABAMBA') || text.includes('CBB')) return 'CBB';
      if (text.includes('ORURO') || text.includes('ORU')) return 'ORU';
      if (text.includes('POTOSI') || text.includes('POTOSÍ') || text.includes('PTI')) return 'PTI';
      if (text.includes('TARIJA') || text.includes('TJA')) return 'TJA';
      if (text.includes('SUCRE') || text.includes('SRE')) return 'SRE';
      if (text.includes('BENI') || text.includes('TRINIDAD') || text.includes('TDD') || text.includes('BEN')) return 'BEN';
      if (text.includes('COBIJA') || text.includes('CIJ')) return 'CIJ';

      const equivalencias = {
        'LA PAZ': 'LPB',
        LPZ: 'LPB',
        LPB: 'LPB',
        'SANTA CRUZ': 'SRZ',
        SCZ: 'SRZ',
        SRZ: 'SRZ',
        'COCHABAMBA': 'CBB',
        CBB: 'CBB',
        ORURO: 'ORU',
        ORU: 'ORU',
        POTOSI: 'PTI',
        POTOSÍ: 'PTI',
        PTI: 'PTI',
        TARIJA: 'TJA',
        TJA: 'TJA',
        SUCRE: 'SRE',
        SRE: 'SRE',
        BENI: 'BEN',
        TRINIDAD: 'BEN',
        TDD: 'BEN',
        BEN: 'BEN',
        COBIJA: 'CIJ',
        CIJ: 'CIJ',
      };
      return equivalencias[cleaned] || cleaned;
    },

    getDepartamentoLabel(codigo) {
      const code = this.normalizeDepartamento(codigo);
      const labels = {
        LPB: 'LA PAZ',
        SRZ: 'SANTA CRUZ',
        CBB: 'COCHABAMBA',
        ORU: 'ORURO',
        PTI: 'POTOSÍ',
        TJA: 'TARIJA',
        SRE: 'SUCRE',
        BEN: 'TRINIDAD',
        CIJ: 'COBIJA',
      };
      return labels[code] || (code || 'SIN DEPARTAMENTO');
    },

    getDepartamentoFromItem(item) {
      return this.normalizeDepartamento(item?.tarifa?.departamento || item?.ciudad || '');
    },

    getOrigenFromItem(item) {
      return this.normalizeDepartamento(item?.sucursale?.origen || item?.sucursale?.nombre || '');
    },

    getCiudadReporteFromItem(item) {
      const ciudad = item?.reencaminamiento || item?.ciudad || '';
      return String(ciudad || '').trim() || 'S/N';
    },

    getCiudadCodigoReporteFromItem(item) {
      const raw = String(item?.reencaminamiento || item?.ciudad || '').trim();
      if (!raw) return 'S/N';
      const normalizado = this.normalizeDepartamento(raw);
      const codigos = ['LPB', 'SRZ', 'CBB', 'ORU', 'PTI', 'TJA', 'SRE', 'BEN', 'CIJ'];
      if (codigos.includes(normalizado)) return normalizado;
      return raw.toUpperCase();
    },

    getRuralReporteFromItem(item) {
      const rural = item?.provincia || item?.tarifa?.provincia || item?.direccion?.provincia || '';
      return String(rural || '').trim().toUpperCase();
    },

    getOrigenRuralReporteFromItem(item) {
      const rural = item?.sucursale?.provincia || '';
      return String(rural || '').trim().toUpperCase();
    },

    getTipoEnvioReporteFromItem(item) {
      const tipo = String(item?.tipo_correspondencia || '').trim().toUpperCase();
      if (tipo) return tipo;
      const contenido = String(item?.contenido || '').trim().toUpperCase();
      if (!contenido) return 'DOC';
      if (contenido.includes('CAJA')) return 'CAJA';
      return 'DOC';
    },

    getTarifarioMontosFromItem(item) {
      const total = Number.parseFloat(item?.nombre_d);
      const totalVal = Number.isNaN(total) ? 0 : total;
      const servicioTarifa = String(item?.tarifa?.servicio || item?.tipo_correspondencia || '').toUpperCase();
      const isEms = servicioTarifa.includes('EMS');
      const isExpress = !isEms && servicioTarifa.includes('EXPRESS');

      return {
        ems: isEms ? totalVal : 0,
        express: isExpress ? totalVal : 0,
        total: totalVal,
      };
    },

    parseDateTimeFromAny(value) {
      if (!value) return null;
      if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
      }

      const raw = String(value).trim();
      if (!raw) return null;

      const ddmmyyyy = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?/);
      if (ddmmyyyy) {
        const day = Number(ddmmyyyy[1]);
        const month = Number(ddmmyyyy[2]) - 1;
        const year = Number(ddmmyyyy[3]);
        const hour = Number(ddmmyyyy[4] || 0);
        const minute = Number(ddmmyyyy[5] || 0);
        const second = Number(ddmmyyyy[6] || 0);
        const parsed = new Date(year, month, day, hour, minute, second);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
      }

      const parsed = new Date(raw);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    },

    getFechaHoraEntregaFromItem(item) {
      const parsed = this.parseDateTimeFromAny(item?.fecha_d);
      if (!parsed) return { fecha: 'S/N', hora: 'S/N' };
      const dd = String(parsed.getDate()).padStart(2, '0');
      const mm = String(parsed.getMonth() + 1).padStart(2, '0');
      const yyyy = parsed.getFullYear();
      const hh = String(parsed.getHours()).padStart(2, '0');
      const min = String(parsed.getMinutes()).padStart(2, '0');
      return {
        fecha: `${dd}/${mm}/${yyyy}`,
        hora: `${hh}:${min}`,
      };
    },

    getFechaEnvioFromItem(item) {
      const parsed = this.parseDateTimeFromAny(item?.fecha_recojo_c || item?.fecha || item?.fecha_d);
      if (!parsed) return 'S/N';
      const dd = String(parsed.getDate()).padStart(2, '0');
      const mm = String(parsed.getMonth() + 1).padStart(2, '0');
      const yy = String(parsed.getFullYear()).slice(-2);
      return `${dd}-${mm}-${yy}`;
    },

    getDestinoReporteFromItem(item) {
      return this.getDepartamentoLabel(this.getDepartamentoFromItem(item));
    },

    getReencaminamientoReporteFromItem(item) {
      const raw = item?.reencaminamiento || item?.ciudad || item?.tarifa?.departamento || '';
      return String(raw || '').trim().toUpperCase() || 'S/N';
    },

    getLatestPesoReporteFromItem(item) {
      const candidates = [item?.peso_r, item?.peso_v, item?.peso_o, item?.peso];

      for (const candidate of candidates) {
        const parsed = Number.parseFloat(candidate);
        if (!Number.isNaN(parsed) && parsed > 0) {
          return parsed;
        }
      }

      for (const candidate of candidates) {
        const parsed = Number.parseFloat(candidate);
        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }

      return 0;
    },

    buildDetalleReporteRow(item, index) {
      const { ems, express, total } = this.getTarifarioMontosFromItem(item);
      const { fecha: fechaEntrega, hora: horaEntrega } = this.getFechaHoraEntregaFromItem(item);
      const origenRural = this.getOrigenRuralReporteFromItem(item);
      const destinoRural = this.getRuralReporteFromItem(item);
      const peso = this.getLatestPesoReporteFromItem(item);

      return {
        nro: index + 1,
        fecha_envio: this.getFechaEnvioFromItem(item),
        num_envio: item?.guia || 'S/N',
        origen: this.getOrigenFromItem(item) || 'S/N',
        origen_rural: origenRural ? 'X' : '',
        origen_ciudad: origenRural ? '' : 'X',
        reencaminamiento: this.getReencaminamientoReporteFromItem(item),
        destino_rural: destinoRural ? 'X' : '',
        destino_ciudad: destinoRural ? '' : 'X',
        pieza: 1,
        contenido: item?.contenido || this.getTipoEnvioReporteFromItem(item),
        peso: peso.toFixed(3),
        ems: ems > 0 ? ems.toFixed(2) : '',
        express: express > 0 ? express.toFixed(2) : '',
        total: total.toFixed(2),
        fecha_entrega: fechaEntrega,
        hora_entrega: horaEntrega,
        a_quien: item?.destinatario || 'S/N',
        cartero: item?.cartero_entrega?.nombre || 'Por asignar',
        observaciones: item?.observacion || 'S/N',
      };
    },

    setupDetalleReporteSheet(worksheet) {
      worksheet.columns = [
        { key: 'nro', width: 6 },
        { key: 'fecha_envio', width: 14 },
        { key: 'num_envio', width: 18 },
        { key: 'origen', width: 12 },
        { key: 'origen_rural', width: 9 },
        { key: 'origen_ciudad', width: 9 },
        { key: 'reencaminamiento', width: 16 },
        { key: 'destino_rural', width: 9 },
        { key: 'destino_ciudad', width: 9 },
        { key: 'pieza', width: 8 },
        { key: 'contenido', width: 18 },
        { key: 'peso', width: 10 },
        { key: 'ems', width: 10 },
        { key: 'express', width: 10 },
        { key: 'total', width: 10 },
        { key: 'fecha_entrega', width: 16 },
        { key: 'hora_entrega', width: 12 },
        { key: 'a_quien', width: 18 },
        { key: 'cartero', width: 18 },
        { key: 'observaciones', width: 20 },
      ];

      worksheet.mergeCells('A16:O16');
      worksheet.getCell('A16').value = 'ENVIO';
      worksheet.mergeCells('P16:T16');
      worksheet.getCell('P16').value = 'ENTREGA';

      worksheet.mergeCells('D17:F17');
      worksheet.getCell('D17').value = 'ORIGEN';
      worksheet.mergeCells('G17:I17');
      worksheet.getCell('G17').value = 'DESTINO';
      worksheet.mergeCells('M17:O17');
      worksheet.getCell('M17').value = 'TARIFARIO';

      const headerRow = worksheet.getRow(18);
      headerRow.values = [
        'N°', 'FECHA DE SOLICITUD', 'NUM. DE ENVIO',
        'CIUDAD', 'RURAL', 'LOCAL',
        'CIUDAD.', 'RURAL', 'LOCAL',
        'PIEZA', 'TIPO DE ENVIO', 'PESO',
        'EMS', 'EXPRESS', 'TOTAL',
        'FECHA DE ENTREGA', 'HORA DE ENTREGA', 'A QUIEN SE ENTREGO', 'NOMBRE DEL CARTERO', 'OBSERVACIONES',
      ];

      const styleCell = (cell, fillColor) => {
        cell.font = { bold: true, color: { argb: 'FF000000' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (fillColor) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fillColor },
          };
        }
      };

      const styleRowSegment = (rowNumber, fromCol, toCol, fillColor) => {
        for (let col = fromCol; col <= toCol; col += 1) {
          styleCell(worksheet.getRow(rowNumber).getCell(col), fillColor);
        }
      };

      styleRowSegment(16, 1, 15, 'FF9BBB59');
      styleRowSegment(16, 16, 20, 'FFF4B183');
      styleRowSegment(17, 1, 15, 'FFD9EAD3');
      styleRowSegment(17, 16, 20, 'FFFCE4D6');
      styleRowSegment(18, 1, 15, 'FFD9EAD3');
      styleRowSegment(18, 16, 20, 'FFFCE4D6');
    },

    getEmpresaFromItem(item) {
      const empresa = item?.sucursale?.empresa?.nombre || item?.sucursale?.pagador || item?.sucursale?.nombre;
      return String(empresa || 'SIN EMPRESA').trim();
    },

    getNumeroContratoFromItem(item) {
      const numero = item?.sucursale?.n_contrato || item?.n_contrato || item?.numero_contrato || '';
      return String(numero || '').trim();
    },

    getSucursalGroupName(sucursal) {
      const rawName = String(sucursal?.nombre || '').trim().toUpperCase();
      if (!rawName) {
        return '';
      }

      const cleanedName = rawName.replace(/\s+\d+\s*$/, '').trim();
      if (cleanedName) {
        return cleanedName;
      }

      const originCode = this.normalizeDepartamento(sucursal?.origen);
      return originCode ? `GESTORA ${originCode}` : '';
    },
    isSucursalOptionSelected(option) {
      const key = String(option?.group_key || '');
      return (this.selectedSucursales || []).map((value) => String(value)).includes(key);
    },

    parseDate(value) {
      if (!value) return null;

      if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
      }

      const raw = String(value).trim();
      if (!raw) return null;

      if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
        const [day, month, year] = raw.split('/');
        const parsed = new Date(`${year}-${month}-${day}T00:00:00`);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
      }

      const parsed = new Date(raw);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    },

    getOrigenesParaReporte(data) {
      const origenes = [];
      const seen = new Set();

      data.forEach((item) => {
        const codigo = this.getOrigenFromItem(item);
        if (!codigo || seen.has(codigo)) return;
        seen.add(codigo);
        origenes.push({
          codigo,
          nombre: this.getDepartamentoLabel(codigo),
        });
      });

      return origenes;
    },

    getNumeroContratoLabelForData(data) {
      const contratos = [...new Set(
        (data || [])
          .map((item) => this.getNumeroContratoFromItem(item))
          .filter((value) => Boolean(value))
      )];

      if (this.selectedNumeroContrato) {
        return this.selectedNumeroContrato;
      }

      if (contratos.length === 1) {
        return contratos[0];
      }

      return 'VARIOS';
    },

    getSafeSheetName(baseName, usedSheetNames) {
      const rawName = String(baseName || 'Hoja').replace(/[\\/*?:[\]]/g, '').trim() || 'Hoja';
      const truncated = rawName.slice(0, 31);
      if (!usedSheetNames.has(truncated)) {
        usedSheetNames.add(truncated);
        return truncated;
      }

      let index = 2;
      while (index < 1000) {
        const suffix = `_${index}`;
        const candidate = `${truncated.slice(0, 31 - suffix.length)}${suffix}`;
        if (!usedSheetNames.has(candidate)) {
          usedSheetNames.add(candidate);
          return candidate;
        }
        index += 1;
      }

      const fallback = `Hoja_${Date.now()}`.slice(0, 31);
      usedSheetNames.add(fallback);
      return fallback;
    },

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
      const filteredData = await this.fetchReportData();

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
          ['Ciudad', this.getCiudadReporteFromItem(m)],
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
    async prevPage() {
      if (this.currentPage > 1) {
        await this.fetchList(this.currentPage - 1);
      }
    },
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        await this.fetchList(this.currentPage + 1);
      }
    },
    async goToPage(pageNumber) {
      if (pageNumber === '...') return;
      await this.fetchList(pageNumber);
    },
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    async GET_DATA(path) {
      try {
        const res = await this.$contratos.$get(path);
        return res;
      } catch (e) {
        throw e;
      }
    },
    async fetchList(page = this.currentPage) {
      const payload = await this.GET_DATA(this.buildListPath(page));
      this.list = this.normalizeArrayPayload(payload);
      this.applyPaginationPayload(payload);
      await this.hydratePdfJustificacion(this.list);
      return this.list;
    },
    async fetchReportData() {
      const allItems = [];
      let page = 1;
      let lastPage = 1;
      const perPage = 200;

      do {
        const payload = await this.GET_DATA(this.buildListPath(page, perPage));
        const pageItems = this.normalizeArrayPayload(payload);
        allItems.push(...pageItems);
        lastPage = Number(payload?.last_page || 1);
        page += 1;
      } while (page <= lastPage);

      return allItems;
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
      const origenesReporte = this.getOrigenesSeleccionados(this.selectedOrigen, true);
      const reportData = await this.fetchReportData();
      const filteredData = reportData.filter((item) =>
        origenesReporte.includes(this.getOrigenFromItem(item))
      );
      const origenesParaReporte = this.getOrigenesParaReporte(filteredData);

      if (filteredData.length === 0) {
        await Swal.fire({
          icon: 'info',
          title: 'Sin datos',
          text: 'No hay datos disponibles para los criterios seleccionados.',
        });
        return;
      }

      if (origenesParaReporte.length === 0) {
        await Swal.fire({
          icon: 'info',
          title: 'Sin orígenes',
          text: 'No hay departamentos de origen para generar el reporte.',
        });
        return;
      }

      const usedSheetNames = new Set();

      for (let origen of origenesParaReporte) {
        const origenData = filteredData.filter(
          (item) => this.getOrigenFromItem(item) === origen.codigo
        );
        if (origenData.length === 0) continue;
        const numeroContratoLabel = this.getNumeroContratoLabelForData(origenData);

        const worksheet = workbook.addWorksheet(
          this.getSafeSheetName(`${origen.nombre} (${origen.codigo})`, usedSheetNames)
        );

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
        worksheet.getCell('C11').value = origen.nombre;

        worksheet.mergeCells('A12:B12');
        worksheet.getCell('A12').value = 'NUMERO DE CONTRATO:';
        worksheet.getCell('C12').value = numeroContratoLabel;

        worksheet.mergeCells('A13:B13');
        worksheet.getCell('A13').value = 'SUCURSAL:';
        worksheet.getCell('C13').value = 'TODAS LAS SUCURSALES';

        worksheet.mergeCells('A14:B14');
        worksheet.getCell('A14').value = 'PERIODO:';
        worksheet.getCell('C14').value = `${this.startDate || 'S/N'} - ${this.endDate || 'S/N'}`;

        this.setupDetalleReporteSheet(worksheet);

        let totalPesoOrigen = 0;
        let totalBsOrigen = 0;

        // Añadir los datos
        origenData.forEach((m, index) => {
          const row = worksheet.addRow(this.buildDetalleReporteRow(m, index));
          totalPesoOrigen += this.getLatestPesoReporteFromItem(m);
          totalBsOrigen += Number.parseFloat(m?.nombre_d) || 0;
          row.eachCell((cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
        });

        const totalRow = worksheet.addRow({
          contenido: 'TOTAL PESO',
          peso: totalPesoOrigen.toFixed(3),
          express: 'TOTAL BS',
          total: totalBsOrigen.toFixed(2),
        });

        totalRow.eachCell({ includeEmpty: true }, (cell) => {
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
            fgColor: { argb: 'FFFFFF00' }
          };
        });
      }

      // Crear la hoja resumen
      const resumenSheet = workbook.addWorksheet(this.getSafeSheetName('Resumen', usedSheetNames));

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
        { key: 'origen', width: 30 },
        { key: 'numero_contrato', width: 18 },
        { key: 'peso_total', width: 15 },
        { key: 'total_guias', width: 15 },
        { key: 'subtotal', width: 20 }
      ];

      const headerRowResumen = resumenSheet.getRow(13);
      headerRowResumen.values = ['#', 'Origen', 'Numero Contrato', 'Peso Total (Kg)', 'Total Guías', 'Subtotal (Bs)'];
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

      origenesParaReporte.forEach((origen, index) => {
        const origenData = filteredData.filter(
          (item) => this.getOrigenFromItem(item) === origen.codigo
        );
        if (origenData.length === 0) return;
        const numeroContratoLabel = this.getNumeroContratoLabelForData(origenData);

        const peso = origenData.reduce((acc, item) => {
          const value = item.peso_r ? parseFloat(item.peso_r) : parseFloat(item.peso_v);
          return acc + (Number.isNaN(value) ? 0 : value);
        }, 0);
        const totalGuiasDepto = origenData.length;
        const subtotal = origenData.reduce((acc, item) => {
          const value = parseFloat(item.nombre_d);
          return acc + (Number.isNaN(value) ? 0 : value);
        }, 0);

        totalPeso += peso;
        totalGuias += totalGuiasDepto;
        totalSubtotal += subtotal;

        const row = resumenSheet.addRow({
          index: index + 1,
          origen: `${origen.nombre} (${origen.codigo})`,
          numero_contrato: numeroContratoLabel,
          peso_total: peso.toFixed(3),
          total_guias: totalGuiasDepto,
          subtotal: subtotal.toFixed(2)
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
        origen: 'TOTAL',
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
      const nombreCompleto = `${this.user?.user?.nombre || ''} ${this.user?.user?.apellidos || ''}`.trim() || 'SIN NOMBRE';

      // Aquí reemplazamos por el nombre y apellido del usuario logueado
      resumenSheet.mergeCells(`B${firmaRow.number}:C${firmaRow.number}`);
      resumenSheet.getCell(`B${firmaRow.number}`).value = nombreCompleto;
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
      link.download = 'Reporte_Sucursales_Origen_Resumido.xlsx';
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

      if (this.selectedSucursalIds.length === 1) {
        // Generar reporte para una sola sucursal
        await this.exportToExcel();
      } else if (this.selectedSucursalIds.length > 1) {
        // Generar reporte para múltiples sucursales
        await this.generarReporteMultiplesSucursales();
      }
    },




    async generarReporteMultiplesSucursales() {
      const workbook = new ExcelJS.Workbook();
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

      const origenesReporte = this.getOrigenesSeleccionados(this.selectedOrigen, true);
      const reportData = await this.fetchReportData();
      const filteredData = reportData.filter((item) =>
        origenesReporte.includes(this.getOrigenFromItem(item))
      );
      const origenesParaReporte = this.getOrigenesParaReporte(filteredData);

      if (filteredData.length === 0) {
        await Swal.fire({
          icon: 'info',
          title: 'Sin datos',
          text: 'No hay datos disponibles para los criterios seleccionados.',
        });
        return;
      }

      if (origenesParaReporte.length === 0) {
        await Swal.fire({
          icon: 'info',
          title: 'Sin orígenes',
          text: 'No hay departamentos de origen para generar el reporte.',
        });
        return;
      }

      const usedSheetNames = new Set();

      for (let origen of origenesParaReporte) {
        const origenData = filteredData.filter(
          (item) => this.getOrigenFromItem(item) === origen.codigo
        );
        if (origenData.length === 0) continue;
        const numeroContratoLabel = this.getNumeroContratoLabelForData(origenData);

        const worksheet = workbook.addWorksheet(
          this.getSafeSheetName(`${origen.nombre} (${origen.codigo})`, usedSheetNames)
        );

        // Agregar el logo e información de la hoja
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

        // Añadir información de origen, codigo y sucursal
        worksheet.mergeCells('A11:B11');
        worksheet.getCell('A11').value = 'ORIGEN:';
        worksheet.getCell('C11').value = origen.nombre;

        worksheet.mergeCells('A12:B12');
        worksheet.getCell('A12').value = 'NUMERO DE CONTRATO:';
        worksheet.getCell('C12').value = numeroContratoLabel;

        worksheet.mergeCells('A13:B13');
        worksheet.getCell('A13').value = 'SUCURSAL:';
        worksheet.getCell('C13').value = 'TODAS LAS SUCURSALES';

        // Añadir periodo
        worksheet.mergeCells('A14:B14');
        worksheet.getCell('A14').value = 'PERIODO:';
        worksheet.getCell('C14').value = `${formattedStartDate} - ${formattedEndDateAdjusted}`;

        this.setupDetalleReporteSheet(worksheet);

        const dataStartRow = 19;
        let totalPesoOrigen = 0;
        let totalBsOrigen = 0;

        origenData.forEach((m, index) => {
          const row = worksheet.addRow(this.buildDetalleReporteRow(m, index));
          totalPesoOrigen += this.getLatestPesoReporteFromItem(m);
          totalBsOrigen += Number.parseFloat(m?.nombre_d) || 0;

          row.eachCell((cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        });

        const totalRow = worksheet.addRow({
          contenido: 'TOTAL PESO',
          peso: totalPesoOrigen.toFixed(3),
          express: 'TOTAL BS',
          total: totalBsOrigen.toFixed(2),
        });

        totalRow.eachCell({ includeEmpty: true }, (cell) => {
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
            fgColor: { argb: 'FFFFFF00' }
          };
        });

        // Filtro para la fila de cabecera
        worksheet.autoFilter = `A18:T${Math.max(dataStartRow, worksheet.rowCount)}`;
      }

      // Crear la hoja resumen final
      const resumenSheet = workbook.addWorksheet(this.getSafeSheetName('Resumen', usedSheetNames));

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

      // Campo del Mes
      resumenSheet.mergeCells('B11:F11');
      resumenSheet.getCell('B11').value = `Mes ${selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}`;
      resumenSheet.getCell('B11').alignment = { horizontal: 'center', vertical: 'middle' };
      resumenSheet.getCell('B11').font = { bold: true };

      // Agregar las columnas del resumen
      resumenSheet.columns = [
        { key: 'index', width: 5 },
        { key: 'origen', width: 30 },
        { key: 'numero_contrato', width: 18 },
        { key: 'peso_total', width: 15 },
        { key: 'total_guias', width: 15 },
        { key: 'subtotal', width: 20 }
      ];

      // Añadir encabezados
      const headerRow = resumenSheet.getRow(13); // Colocado después de las filas vacías
      headerRow.values = ['#', 'Origen', 'Numero Contrato', 'Peso Total (Kg)', 'Total Guías', 'Subtotal (Bs)'];
      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      let totalPeso = 0;
      let totalGuias = 0;
      let totalSubtotal = 0;

      origenesParaReporte.forEach((origen, index) => {
        const origenData = filteredData.filter(
          (item) => this.getOrigenFromItem(item) === origen.codigo
        );
        if (origenData.length === 0) return;
        const numeroContratoLabel = this.getNumeroContratoLabelForData(origenData);

        const peso = origenData.reduce((acc, item) => {
          const value = item.peso_r ? parseFloat(item.peso_r) : parseFloat(item.peso_v);
          return acc + (Number.isNaN(value) ? 0 : value);
        }, 0);
        const totalGuiasDepto = origenData.length;
        const subtotal = origenData.reduce((acc, item) => {
          const value = parseFloat(item.nombre_d);
          return acc + (Number.isNaN(value) ? 0 : value);
        }, 0);

        totalPeso += peso;
        totalGuias += totalGuiasDepto;
        totalSubtotal += subtotal;

        const row = resumenSheet.addRow({
          index: index + 1,
          origen: `${origen.nombre} (${origen.codigo})`,
          numero_contrato: numeroContratoLabel,
          peso_total: peso.toFixed(3),
          total_guias: totalGuiasDepto,
          subtotal: subtotal.toFixed(2)
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
        origen: 'TOTAL',
        peso_total: totalPeso.toFixed(3),
        total_guias: totalGuias,
        subtotal: totalSubtotal.toFixed(2)
      });

      totalRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { bold: true };
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
      const nombreCompleto = `${this.user?.user?.nombre || ''} ${this.user?.user?.apellidos || ''}`.trim() || 'SIN NOMBRE';

      resumenSheet.mergeCells(`B${firmaRow.number}:C${firmaRow.number}`);
      resumenSheet.getCell(`B${firmaRow.number}`).value = nombreCompleto;
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
      link.download = 'Reporte_Sucursales_Origen_Detallado.xlsx';
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
      const selectedIds = this.selectedSucursalIds.map((id) => String(id));
      const reportData = await this.fetchReportData();
      const filteredData = reportData.filter(item => selectedIds.includes(String(item.sucursale?.id)));

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

      this.setupDetalleReporteSheet(worksheet);

      // Añadir los datos
      sucursalData.forEach((m, index) => {
        const row = worksheet.addRow(this.buildDetalleReporteRow(m, index));
        row.eachCell((cell) => {
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
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
      const reportData = await this.fetchReportData();
      const filteredData = reportData.filter(item =>
        this.selectedSucursalIds.length === 0 ||
        this.selectedSucursalIds.map(id => String(id)).includes(String(item.sucursale?.id))
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

      this.setupDetalleReporteSheet(worksheet);

      let totalWeight = 0;
      let totalAmount = 0;

      filteredData.forEach((m, index) => {
        const rowData = this.buildDetalleReporteRow(m, index);
        const row = worksheet.addRow(rowData);

        totalWeight += this.getLatestPesoReporteFromItem(m);
        totalAmount += Number.parseFloat(m?.nombre_d) || 0;

        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          const fillColor = index % 2 === 0 ? 'FFFFFFFF' : 'FFF0F0F0';
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fillColor }
          };
        });
      });

      const totalRow = worksheet.addRow({
        contenido: 'TOTAL PESO',
        peso: totalWeight.toFixed(3),
        express: 'TOTAL BS',
        total: totalAmount.toFixed(2),
      });

      totalRow.eachCell({ includeEmpty: true }, (cell) => {
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
          fgColor: { argb: 'FFFFFF00' }
        };
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
      await this.fetchList();

      this.load = false; // Cambiar el estado de carga
    });
  },
  watch: {
    searchTerm() {
      this.fetchList(1);
    },
    startDate() {
      this.fetchList(1);
    },
    endDate() {
      this.fetchList(1);
    },
    selectedEmpresa() {
      this.fetchList(1);
    },
    selectedNumeroContrato() {
      this.fetchList(1);
    },
    selectedOrigen() {
      this.fetchList(1);
    },
    selectedSucursales: {
      handler() {
        this.fetchList(1);
      },
      deep: true,
    },
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

.sucursal-option-checkbox {
  pointer-events: none;
}
</style>
