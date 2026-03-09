<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3"></div>
        <div class="row">
          <div class="col-6">
            <input
              type="text"
              v-model="searchQuery"
              @keypress.enter.prevent="handleSearchEnter"
              @paste.prevent="handleSearchPaste"
              class="form-control mb-3"
              placeholder="Buscar o pegar codigo(s) de guia..."
            >

            <div v-if="mostrarPaquetes" v-for="(group, estado) in groupedData" :key="estado" class="col-12">
              <div class="card border-rounded">
                <div class="card-header" @click="toggleCollapse(estado)">
                  {{
                    estado === '5' ? 'Recogidos' :
                    estado === '10' ? 'Recibidos Regional' :
                    estado === '2' ? 'En camino' :
                    estado === '3' ? 'Entregados' :
                    estado === '0' ? 'Cancelados' : 'Otro estado'
                  }}
                </div>

                <b-collapse :id="'collapse-' + estado" v-model="collapseState[estado]">
                  <div class="card-body p-2">
                    <div class="table-responsive">
                      <table class="table table-sm table-bordered">
                        <thead>
                          <tr>
                            <th class="py-0 px-1">#</th>
                            <th class="py-0 px-1">Guia</th>
                            <th class="py-0 px-1">Sucursal</th>
                            <th class="py-0 px-1">Direccion Destinatario</th>
                            <th class="py-0 px-1">Municipio/Provincia</th>
                            <th class="py-0 px-1">Peso(Kg)</th>
                            <th class="py-0 px-1">Asignar</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(m, i) in filteredList(group)" :key="m.id || i">
                            <td class="py-0 px-1">{{ i + 1 }}</td>
                            <td class="py-0 px-1">{{ m.guia }}</td>
                            <td class="p-1">{{ getSucursalLabel(m) }}</td>
                            <td class="py-0 px-1">{{ m.direccion_d }}</td>
                            <td class="py-0 px-1">{{ m.ciudad }}</td>
                            <td class="py-0 px-1">
                              <input type="number" v-model.number="m.peso_v" class="form-control form-control-sm" />
                            </td>
                            <td class="py-0 px-1">
                              <button @click="addDireccion(m)" class="btn btn-success btn-sm">
                                <i class="fas fa-plus"></i>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </b-collapse>
              </div>
            </div>
          </div>

          <div class="col-6">
            <div class="panel-card p-3 mb-3">
              <label for="cartero-select" class="section-label">Seleccionar Cartero</label>
              <select v-model="selectedCartero" id="cartero-select" class="form-control mb-0">
              <option :value="null" disabled>Seleccione un cartero</option>
              <option v-for="cartero in filteredCarteros" :key="cartero.id" :value="cartero.id">
                {{ cartero.nombre || cartero.nombre2 || ('Cartero #' + cartero.id) }}
              </option>
              </select>
            </div>

            <div class="panel-card p-3">
              <h5 class="panel-title">Lista De Asignacion</h5>
              <div class="table-responsive compact-table">
                <table class="table table-sm table-bordered mb-2">
                  <thead>
                    <tr>
                      <th class="py-1 px-2">Codigo</th>
                      <th class="py-1 px-2" style="width: 140px;">Peso (Kg)</th>
                      <th class="py-1 px-2">Cartero</th>
                      <th class="py-1 px-2 text-center" style="width: 70px;">Quitar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(direccion, index) in direccionesAsignadas" :key="direccion.id || index">
                      <td class="py-1 px-2">{{ direccion.guia }}</td>
                      <td class="py-1 px-2">
                        <input
                          type="number"
                          v-model.number="direccion.peso_v"
                          min="0.001"
                          step="0.001"
                          class="form-control form-control-sm"
                          placeholder="0.001"
                          required
                        />
                      </td>
                      <td class="py-1 px-2">{{ selectedCarteroNombre || '-' }}</td>
                      <td class="py-1 px-2 text-center">
                        <button @click="removeDireccion(index)" class="btn btn-danger btn-sm px-2 py-0">
                          <i class="fas fa-times"></i>
                        </button>
                      </td>
                    </tr>
                    <tr v-if="!direccionesAsignadas.length">
                      <td class="py-2 px-2 text-center text-muted" colspan="4">No hay codigos agregados</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button @click="guardarAsignaciones" class="btn btn-primary w-100 btn-save">Guardar Asignaciones</button>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>
  </div>
</template>

<script>
import { BCollapse } from 'bootstrap-vue';

export default {
  name: 'IndexPage',
  components: {
    BCollapse,
  },
  data() {
    return {
      load: true,
      list: [],
      carteros: [],
      selectedCartero: null,
      direccionesAsignadas: [],
      solicitudesAsignadas: [],
      apiUrl: 'solicitudes5',
      carterosApiUrl: 'carteros5',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/admin/solicitudes/solicitude/nuevo',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      url_editar: '/admin/solicitudes/solicitude/editar/',
      collapseState: {},
      searchQuery: '',
      user: {},
      mostrarPaquetes: false,
    };
  },
  computed: {
    loggedUserDepartment() {
      return this.normalizeDept(
        this.user?.user?.departamento_cartero ??
        this.user?.departamento_cartero ??
        this.user?.user?.departamento ??
        this.user?.departamento
      );
    },
    filteredCarteros() {
      const department = this.loggedUserDepartment;
      const source = Array.isArray(this.carteros) ? this.carteros : [];

      if (!department) {
        return [];
      }

      return source.filter((cartero) => {
        const carteroDepartment = this.normalizeDept(
          cartero?.departamento_cartero ?? cartero?.departamento
        );
        return carteroDepartment === department;
      });
    },
    groupedData() {
      const grouped = {};
      (this.list || []).forEach((item) => {
        if (!(Number(item?.estado) === 5 || Number(item?.estado) === 10)) {
          return;
        }
        const key = String(item?.estado ?? 'sin_estado');
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      });
      return grouped;
    },
    selectedCarteroNombre() {
      const cartero = (this.filteredCarteros || []).find((c) => Number(c.id) === Number(this.selectedCartero));
      if (!cartero) return '';
      return cartero.nombre || cartero.nombre2 || `Cartero #${cartero.id}`;
    },
  },
  methods: {
    extractArrayPayload(res) {
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.solicitudes)) return res.solicitudes;
      if (Array.isArray(res?.carteros)) return res.carteros;
      if (Array.isArray(res?.results)) return res.results;
      return [];
    },
    normalizeDept(value) {
      return String(value ?? '').trim().toUpperCase();
    },
    isEmsSolicitude(item) {
      return String(item?.tipo_correspondencia ?? '').trim().toUpperCase() === 'EMS';
    },
    isWithoutSucursalSolicitude(item) {
      return item?.sucursale_id == null && item?.sucursale?.id == null;
    },
    getSucursalLabel(item) {
      if (item?.sucursale?.nombre) {
        return item.sucursale.nombre;
      }

      if (this.isEmsSolicitude(item)) {
        return 'EMS GLOBAL';
      }

      return this.isWithoutSucursalSolicitude(item) ? 'SIN SUCURSAL' : '-';
    },
    mergeSolicitudes(primaryList, allSolicitudes) {
      const merged = new Map();

      (Array.isArray(primaryList) ? primaryList : []).forEach((item) => {
        if (item?.id != null) {
          merged.set(item.id, item);
        }
      });

      (Array.isArray(allSolicitudes) ? allSolicitudes : []).forEach((item) => {
        const estado = Number(item?.estado);
        if (item?.id == null) {
          return;
        }

        if ((this.isEmsSolicitude(item) || this.isWithoutSucursalSolicitude(item)) && [5, 10].includes(estado)) {
          merged.set(item.id, item);
        }
      });

      return Array.from(merged.values());
    },
    filteredList(group) {
      if (!this.searchQuery) return group;

      const term = this.searchQuery.toLowerCase();
      return group.filter((item) =>
        String(item?.guia ?? '').toLowerCase().includes(term) ||
        String(this.getSucursalLabel(item)).toLowerCase().includes(term) ||
        String(item?.direccion_d ?? '').toLowerCase().includes(term) ||
        String(item?.ciudad ?? '').toLowerCase().includes(term)
      );
    },
    handleSearchEnter() {
      this.processGuiasFromText(this.searchQuery);
      this.searchQuery = '';
    },
    handleSearchPaste(event) {
      const pastedText = event?.clipboardData?.getData('text') || '';
      this.processGuiasFromText(pastedText);
      this.searchQuery = '';
    },
    processGuiasFromText(rawText) {
      const text = String(rawText ?? '');
      const parts = text
        .split(/[\s,;|]+/)
        .map((p) => this.normalizeDept(p))
        .filter(Boolean);

      if (!parts.length) return;

      let agregadas = 0;
      const noEncontradas = [];

      parts.forEach((guia) => {
        const solicitud = (this.list || []).find(
          (item) => this.normalizeDept(item?.guia) === guia
        );

        if (!solicitud) {
          noEncontradas.push(guia);
          return;
        }

        const antes = this.direccionesAsignadas.length;
        this.addDireccion(solicitud);
        if (this.direccionesAsignadas.length > antes) {
          agregadas += 1;
        }
      });

      if (parts.length === 1 && agregadas === 0 && noEncontradas.length === 1) {
        this.$swal.fire('Guia no encontrada', 'No existe en la lista disponible.', 'info');
        return;
      }

      if (noEncontradas.length) {
        this.$swal.fire(
          'Busqueda completada',
          `Agregadas: ${agregadas}. No encontradas: ${noEncontradas.join(', ')}`,
          'info'
        );
      }
    },
    async GET_DATA(path) {
      const res = await this.$encargados.$get(path);
      return this.extractArrayPayload(res);
    },
    async TRY_GET_DATA(path) {
      try {
        return await this.GET_DATA(path);
      } catch (e) {
        console.warn(`No se pudo cargar ${path}:`, e?.response?.status || e?.message || e);
        return [];
      }
    },
    getRequestErrorMessage(error, fallbackMessage) {
      return (
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        (typeof error?.response?.data === 'string' ? error.response.data : '') ||
        fallbackMessage
      );
    },
    toggleCollapse(estado) {
      this.$set(this.collapseState, estado, !this.collapseState[estado]);
    },
    addDireccion(direccion) {
      const yaExiste = this.direccionesAsignadas.some((item) => item.id === direccion.id);
      if (yaExiste) {
        this.$swal.fire('Ya agregado', 'Esta solicitud ya esta en la lista de asignacion.', 'info');
        return;
      }

      if (!direccion.peso_v || Number(direccion.peso_v) <= 0) {
        direccion.peso_v = null;
      }

      this.direccionesAsignadas.push(direccion);
      this.solicitudesAsignadas.push(direccion);
      this.list = this.list.filter((item) => item.id !== direccion.id);
    },
    removeDireccion(index) {
      const direccion = this.direccionesAsignadas[index];
      this.list.push(direccion);
      this.direccionesAsignadas.splice(index, 1);
      this.solicitudesAsignadas = this.solicitudesAsignadas.filter((item) => item.id !== direccion.id);
    },
    async guardarAsignaciones() {
      if (!this.selectedCartero || this.direccionesAsignadas.length === 0) {
        this.$swal.fire('Seleccione un cartero y anada direcciones primero', '', 'warning');
        return;
      }

      const carteroPermitido = this.filteredCarteros.some(
        (c) => Number(c.id) === Number(this.selectedCartero)
      );
      if (!carteroPermitido) {
        this.$swal.fire(
          'Cartero no permitido',
          'Solo puede asignar carteros del mismo departamento que el usuario logueado.',
          'warning'
        );
        return;
      }

      const sinPeso = this.direccionesAsignadas.filter((d) => !d?.peso_v || Number(d.peso_v) <= 0);
      if (sinPeso.length) {
        this.$swal.fire(
          'Peso obligatorio',
          `Debe asignar peso en todas las guias. Faltan: ${sinPeso.map(d => d.guia).join(', ')}`,
          'warning'
        );
        return;
      }

      this.load = true;
      try {
        const asignadasIds = [];

        for (const direccion of this.direccionesAsignadas) {
          await this.$encargados.$put(`solicitudesentrega5/${direccion.id}`, {
            cartero_entrega_id: Number(this.selectedCartero),
            peso_v: direccion?.peso_v ?? null,
          });

          asignadasIds.push(direccion.id);
        }

        const [solicitudesData, todasLasSolicitudes] = await Promise.all([
          this.GET_DATA(this.apiUrl),
          this.TRY_GET_DATA('solicitudes'),
        ]);
        this.list = this.mergeSolicitudes(solicitudesData, todasLasSolicitudes);
        this.direccionesAsignadas = this.direccionesAsignadas.filter((item) => !asignadasIds.includes(item.id));
        this.solicitudesAsignadas = this.solicitudesAsignadas.filter((item) => !asignadasIds.includes(item.id));
        this.selectedCartero = null;
        this.$swal.fire('Cartero asignado', '', 'success');
      } catch (e) {
        console.log(e);
        this.$swal.fire(
          'Error al asignar cartero',
          this.getRequestErrorMessage(e, 'No se pudo completar la asignación.'),
          'error'
        );
      } finally {
        this.load = false;
      }
    },
  },
  mounted() {
    this.$nextTick(async () => {
      try {
        const user = localStorage.getItem('userAuth');
        this.user = user ? JSON.parse(user) : {};

        const [solicitudesData, todasLasSolicitudes, carterosData] = await Promise.all([
          this.GET_DATA(this.apiUrl),
          this.TRY_GET_DATA('solicitudes'),
          this.GET_DATA(this.carterosApiUrl),
        ]);

        this.list = this.mergeSolicitudes(solicitudesData, todasLasSolicitudes);
        this.carteros = Array.isArray(carterosData) ? carterosData : [];

        Object.keys(this.groupedData).forEach((estado) => {
          this.$set(this.collapseState, estado, true);
        });

        if (!this.list.length) {
          this.list = this.mergeSolicitudes([], todasLasSolicitudes);
        }
        if (!this.carteros.length) {
          const fallbackCarteros = await this.GET_DATA('carteros');
          this.carteros = Array.isArray(fallbackCarteros) ? fallbackCarteros : [];
        }
      } catch (e) {
        console.error('Error al obtener los datos:', e);
        this.$swal.fire('Error de carga', 'No se pudieron recuperar solicitudes/carteros desde la API.', 'error');
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

.panel-card {
  background: #ffffff;
  border: 1px solid #d9dee8;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(22, 44, 77, 0.06);
}

.section-label {
  font-weight: 600;
  color: #34447c;
  margin-bottom: 8px;
  display: block;
}

.panel-title {
  margin: 0 0 10px;
  font-weight: 700;
  color: #2f3f67;
}

.compact-table .table th {
  background: #f4f7fc;
  color: #34447c;
  font-weight: 700;
}

.btn-save {
  font-weight: 700;
  letter-spacing: 0.2px;
}
</style>
