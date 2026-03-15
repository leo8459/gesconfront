<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-12 col-md-4">
            <input
              v-model="searchTerm"
              @keypress.enter.prevent="handleSearchEnter"
              @paste="handlePasteDetect"
              type="text"
              class="form-control"
              placeholder="Buscar guia y Enter para autoseleccionar..."
            />
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">Guias Seleccionadas</div>
              <div class="card-body p-2 selected-list-body">
                <div v-if="!selectedItems.length" class="alert alert-info mb-2">
                  No hay guias seleccionadas.
                </div>

                <div class="table-responsive" v-if="selectedItems.length">
                  <table class="table table-sm table-bordered table-hover mb-2">
                    <thead>
                      <tr>
                        <th class="py-1 px-2">Guia</th>
                        <th class="py-1 px-2">Bitacora (Opcional)</th>
                        <th class="py-1 px-2 text-center" style="width: 90px;">Quitar</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in selectedItems" :key="item.id">
                        <td class="py-1 px-2">{{ item.guia || ('ID ' + item.id) }}</td>
                        <td class="py-1 px-2">
                          <textarea
                            :id="'bitacora-' + item.id"
                            v-model="bitacoraForm[item.id]"
                            class="form-control"
                            rows="2"
                            placeholder="Bitacora opcional..."
                          ></textarea>
                        </td>
                        <td class="py-1 px-2 text-center">
                          <button class="btn btn-danger btn-sm" @click="quitarSeleccion(item.id)">
                            Quitar
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <button class="btn btn-primary w-100" :disabled="!selectedItems.length" @click="openTransporteModal">
                  Guardar Bitacora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>

    <b-modal v-model="isTransporteModalVisible" title="Datos De Transporte" hide-backdrop hide-footer no-enforce-focus>
      <div class="form-group">
        <label for="transportadora">Transportadora</label>
        <input
          id="transportadora"
          v-model="transporteForm.transportadora"
          class="form-control"
          type="text"
          placeholder="Nombre de la transportadora"
        />
      </div>
      <div class="form-group">
        <label for="provincia">Provincia</label>
        <input
          id="provincia"
          v-model="transporteForm.provincia"
          class="form-control"
          type="text"
          placeholder="Provincia"
        />
      </div>
      <div class="form-group">
        <label for="n-recibo">N° Recibo</label>
        <input
          id="n-recibo"
          v-model="transporteForm.n_recibo"
          class="form-control"
          type="text"
          placeholder="Numero de recibo"
        />
      </div>
      <div class="form-group">
        <label for="n-factura">N° Factura</label>
        <input
          id="n-factura"
          v-model="transporteForm.n_factura"
          class="form-control"
          type="text"
          placeholder="Numero de factura"
        />
      </div>
      <div class="form-group">
        <label for="precio-total">Precio Total</label>
        <input
          id="precio-total"
          v-model.number="transporteForm.precio_total"
          class="form-control"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
        />
      </div>
      <div class="form-group">
        <label for="peso-total">Peso Total</label>
        <input
          id="peso-total"
          v-model.number="transporteForm.peso_total"
          class="form-control"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
        />
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-secondary" @click="isTransporteModalVisible = false">Cancelar</button>
        <button class="btn btn-primary ml-2" @click="guardarBitacora">Guardar</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { BModal } from 'bootstrap-vue';

export default {
  name: 'BitacoraCarteroIndex',
  components: {
    BModal,
  },
  data() {
    return {
      load: true,
      page: 'Bitacoras',
      modulo: 'Bitacoras',
      apiUrl: 'solicitudes6',
      list: [],
      preselectedItems: [],
      searchTerm: '',
      selected: {},
      bitacoraForm: {},
      user: {},
      isTransporteModalVisible: false,
      transporteForm: {
        transportadora: '',
        provincia: '',
        n_recibo: '',
        n_factura: '',
        precio_total: 0,
        peso_total: 0,
      },
    };
  },
  computed: {
    availableData() {
      return (this.list || []).sort((a, b) => Number(b?.id || 0) - Number(a?.id || 0));
    },
    selectedItems() {
      const ids = Object.keys(this.selected)
        .filter(key => this.selected[key])
        .map(id => Number(id));
      const combined = [...(this.preselectedItems || []), ...(this.availableData || [])]
        .filter((item, index, items) => (
          items.findIndex((candidate) => Number(candidate?.id) === Number(item?.id)) === index
        ));
      return combined.filter(item => ids.includes(Number(item?.id)));
    },
  },
  methods: {
    normalizeArrayPayload(payload) {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      if (Array.isArray(payload?.solicitudes)) return payload.solicitudes;
      return [];
    },
    buildListPath(search = this.searchTerm) {
      const params = new URLSearchParams();
      const normalizedSearch = String(search || '').trim();
      if (normalizedSearch) {
        params.set('search', normalizedSearch);
      }
      const query = params.toString();
      return query ? `${this.apiUrl}?${query}` : this.apiUrl;
    },
    async fetchList(search = this.searchTerm) {
      const data = await this.GET_DATA(this.buildListPath(search));
      this.list = this.normalizeArrayPayload(data);
      return this.list;
    },
    buildSearchAnyPath(search) {
      const params = new URLSearchParams();
      params.set('search', String(search || '').trim());
      return `solicitudes-busqueda?${params.toString()}`;
    },
    async searchAnySolicitude(search) {
      try {
        return await this.$api.$get(this.buildSearchAnyPath(search));
      } catch (e) {
        const statusCode = Number(e?.response?.status || 0);
        if (statusCode === 404) {
          return null;
        }
        throw e;
      }
    },
    async GET_DATA(path) {
      const res = await this.$api.$get(path);
      return this.normalizeArrayPayload(res);
    },
    handlePasteDetect() {
      this.$nextTick(() => this.handleSearchEnter());
    },
    normalizeSearchTerm(value) {
      return String(value || '').replace(/\s+/g, '').trim();
    },
    itemMatchesSearch(item, term) {
      return (
        String(item?.id || '').toLowerCase() === term ||
        String(item?.guia || '').toLowerCase() === term ||
        String(item?.guia || '').toLowerCase().includes(term)
      );
    },
    ensureItemInPrelist(item) {
      if (!item?.id) {
        return;
      }

      const exists = (this.preselectedItems || []).some(
        (currentItem) => Number(currentItem?.id) === Number(item.id)
      );

      if (!exists) {
        this.preselectedItems = [item, ...(this.preselectedItems || [])];
      }
    },
    async handleSearchEnter() {
      const rawTerm = this.normalizeSearchTerm(this.searchTerm);
      if (!rawTerm) {
        this.searchTerm = '';
        return;
      }

      let found = null;
      this.load = true;
      try {
        found = await this.searchAnySolicitude(rawTerm);
      } catch (e) {
        console.error('Error buscando guias para bitacora:', e);
      } finally {
        this.load = false;
      }

      if (!found?.id) {
        this.$swal.fire({
          icon: 'warning',
          title: 'Guia no encontrada',
          text: 'No se encontro una guia con ese codigo.',
        });
        this.searchTerm = '';
        return;
      }

      if (this.selected[found.id]) {
        this.searchTerm = '';
        return;
      }

      this.ensureItemInPrelist(found);
      this.$set(this.selected, found.id, true);
      this.searchTerm = '';
    },
    quitarSeleccion(id) {
      this.$delete(this.selected, id);
      this.$delete(this.bitacoraForm, id);
      this.preselectedItems = (this.preselectedItems || []).filter(
        (item) => Number(item?.id) !== Number(id)
      );
    },
    openTransporteModal() {
      if (!this.selectedItems.length) {
        this.$swal.fire({
          icon: 'warning',
          title: 'Sin seleccion',
          text: 'Seleccione al menos una guia.',
        });
        return;
      }

      const totalPeso = this.selectedItems.reduce((acc, item) => {
        const peso = Number(item?.peso_v ?? item?.peso_o ?? 0);
        return acc + (Number.isFinite(peso) ? peso : 0);
      }, 0);

      this.transporteForm = {
        transportadora: '',
        provincia: '',
        n_recibo: '',
        n_factura: '',
        precio_total: Number(this.transporteForm.precio_total || 0),
        peso_total: Number(totalPeso.toFixed(2)),
      };
      this.isTransporteModalVisible = true;
    },
    async guardarBitacora() {
      const carteroId = Number(this.user?.user?.id);
      if (!carteroId) {
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontro el cartero logueado.',
        });
        return;
      }

      this.load = true;
      try {
        const solicitudesIds = this.selectedItems.map(item => item.id).filter(Boolean);
        const guias = this.selectedItems.map(item => (item?.guia || '').toString().trim()).filter(Boolean);

        await this.$api.$post('transportes', {
          transportadora: (this.transporteForm.transportadora || '').trim(),
          provincia: (this.transporteForm.provincia || '').trim(),
          cartero_id: carteroId,
          n_recibo: (this.transporteForm.n_recibo || '').trim(),
          n_factura: (this.transporteForm.n_factura || '').trim(),
          precio_total: Number(this.transporteForm.precio_total || 0),
          peso_total: Number(this.transporteForm.peso_total || 0),
          solicitude_ids: solicitudesIds,
          guias,
        });

        for (const item of this.selectedItems) {
          await this.$api.$put(`solicitudes/${item.id}`, {
            entrega_observacion: (this.bitacoraForm[item.id] || '').trim(),
          });
        }

        await this.fetchList();
        this.selected = {};
        this.preselectedItems = [];
        this.bitacoraForm = {};
        this.isTransporteModalVisible = false;
        this.$swal.fire({
          icon: 'success',
          title: 'Bitacoras y transporte guardados',
          text: 'Se guardaron correctamente.',
        });
      } catch (e) {
        console.error(e);
        this.isTransporteModalVisible = false;
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo guardar la bitacora.',
        });
      } finally {
        this.load = false;
      }
    },
  },
  mounted() {
    this.$nextTick(async () => {
      const rawUser = localStorage.getItem('userAuth');
      this.user = rawUser ? JSON.parse(rawUser) : {};

      try {
        await this.fetchList();
      } catch (e) {
        console.error(e);
      } finally {
        this.load = false;
      }
    });
  },
  watch: {
    searchTerm() {
      this.fetchList();
    },
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

.selected-list-body {
  min-height: 520px;
}
</style>
