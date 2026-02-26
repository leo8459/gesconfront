<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-12 col-md-3" v-if="selectedForAssign.length > 0">
            <button @click="recibirTodosLosPaquetes" class="btn btn-primary btn-sm w-100">
              <i class="fas fa-box"></i> Recibir todos los paquetes
            </button>
          </div>

          <div class="col-12 col-md-3">
            <input
              v-model="searchTerm"
              @keypress.enter="handleSearchEnter"
              @paste="handlePasteDetect"
              type="text"
              class="form-control"
              placeholder="Buscar guia y Enter..."
            />
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">Recibir de regional</div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>
                        <th class="py-0 px-1">Guia</th>
                        <th class="py-0 px-1">Remitente</th>
                        <th class="py-0 px-1">Destino</th>
                        <th class="py-0 px-1">Fecha envio regional</th>
                        <th class="py-0 px-1">Peso envio (Kg)</th>
                        <th class="py-0 px-1">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedData" :key="m?.id ?? i">
                        <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                        <td class="py-0 px-1">{{ m?.sucursale?.nombre ?? "SIN SUCURSAL" }}</td>
                        <td class="py-0 px-1">{{ m?.guia ?? "SIN GUIA" }}</td>
                        <td class="py-0 px-1">{{ m?.remitente ?? "SIN REMITENTE" }}</td>
                        <td class="py-0 px-1">{{ m?.reencaminamiento ?? m?.tarifa?.departamento ?? "-" }}</td>
                        <td class="py-0 px-1">{{ m?.fecha_envio_regional ?? "-" }}</td>
                        <td class="py-0 px-1">{{ m?.peso_v ?? "-" }}</td>
                        <td class="py-0 px-1">{{ m?.estado ?? "-" }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <nav aria-label="Page navigation">
              <ul class="pagination justify-content-between">
                <li class="page-item" :class="{ disabled: currentPage === 0 }">
                  <button class="page-link" @click="previousPage" :disabled="currentPage === 0">&lt;</button>
                </li>
                <li class="page-item" v-for="pageNo in totalPages" :key="pageNo" :class="{ active: currentPage === pageNo - 1 }">
                  <button class="page-link" @click="goToPage(pageNo - 1)">{{ pageNo }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                  <button class="page-link" @click="nextPage" :disabled="currentPage >= totalPages - 1">&gt;</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div v-if="selectedForDelivery.length > 0" class="mt-4">
          <button class="btn btn-primary btn-sm mb-3" @click="recibirTodosLosPaquetes">
            RECIBIR TODOS LOS PAQUETES
          </button>
          <h5>Paquetes seleccionados para recibir</h5>
          <div class="table-responsive">
            <table class="table table-sm table-bordered">
              <thead>
                <tr>
                  <th class="py-0 px-1">#</th>
                  <th class="py-0 px-1">Guia</th>
                  <th class="py-0 px-1">Peso oficina destino (Kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in selectedForDelivery" :key="item.id || index">
                  <td class="py-0 px-1">{{ index + 1 }}</td>
                  <td class="py-0 px-1">{{ item?.guia ?? "-" }}</td>
                  <td class="py-0 px-1">{{ item?.peso_r ?? "-" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminTemplate>

    <b-modal v-model="isModalVisible" title="Asignar peso oficina destino (Kg)" hide-backdrop hide-footer @shown="focusPesoInput">
      <div v-for="item in selectedItemsData" :key="item.id" class="form-group">
        <label :for="'peso_r-' + item.id">
          {{ item?.guia ?? "SIN GUIA" }} - {{ item?.sucursale?.nombre ?? "EMS GLOBAL" }}
        </label>
        <input
          type="text"
          :id="'peso_r-' + item.id"
          v-model="item.peso_r"
          class="form-control"
          ref="pesoInput"
          placeholder="000.001"
          step="0.001"
          min="0.001"
        />
      </div>
      <div class="d-flex justify-content-end mt-2">
        <button class="btn btn-secondary" @click="isModalVisible = false">Cancelar</button>
        <button class="btn btn-primary ml-2" @click="confirmAssignSelected">Agregar a la lista</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { BModal } from "bootstrap-vue";

export default {
  name: "RecibirRegionalCarteroIndex",
  components: {
    BModal,
  },
  data() {
    return {
      load: true,
      list: [],
      tarifas: [],
      searchTerm: "",
      apiUrl: "solicitudes",
      page: "Recibir de regional",
      modulo: "Recibir de regional",
      isModalVisible: false,
      selectedItemsData: [],
      selectedForAssign: [],
      selectedForDelivery: [],
      user: {},
      currentPage: 0,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredData() {
      const search = String(this.searchTerm || "").toLowerCase();
      const departamento =
        this.user?.user?.departamento_cartero || this.user?.user?.departamento || null;

      if (!departamento) return [];

      return (this.list || [])
        .filter((item) => {
          const matchesReencaminamiento = item?.reencaminamiento === departamento;
          const matchesDepartamento = item?.tarifa?.departamento === departamento;

          const matchesSearch =
            String(item?.guia ?? "").toLowerCase().includes(search) ||
            String(item?.remitente ?? "").toLowerCase().includes(search) ||
            String(item?.destinatario ?? "").toLowerCase().includes(search) ||
            String(item?.sucursale?.nombre ?? "").toLowerCase().includes(search) ||
            String(item?.reencaminamiento ?? "").toLowerCase().includes(search);

          return (matchesReencaminamiento || matchesDepartamento) && matchesSearch && [8, 12].includes(Number(item?.estado));
        })
        .sort((a, b) => {
          const da = a?.fecha_envio_regional ? new Date(a.fecha_envio_regional).getTime() : 0;
          const db = b?.fecha_envio_regional ? new Date(b.fecha_envio_regional).getTime() : 0;
          return db - da;
        });
    },
    paginatedData() {
      const start = this.currentPage * this.itemsPerPage;
      return this.filteredData.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$api.$get(path);
      return Array.isArray(res) ? res : [];
    },
    getTarifaLabel(tarifaId) {
      const tarifa = (this.tarifas || []).find((t) => Number(t?.id) === Number(tarifaId));
      return tarifa?.departamento || "SIN TARIFA";
    },
    calculatePrice(tarifaId, pesoR) {
      const tarifa = (this.tarifas || []).find((t) => Number(t?.id) === Number(tarifaId));
      if (!tarifa) return 0;
      const basePrice = tarifa?.precio ? parseFloat(tarifa.precio) : 0;
      const extraPrice = tarifa?.precio_extra ? parseFloat(tarifa.precio_extra) : 0;
      const peso = parseFloat(pesoR);
      if (isNaN(peso)) return 0;
      if (peso > 1) return basePrice + Math.ceil(peso - 1) * extraPrice;
      return basePrice;
    },
    normalizePeso(value) {
      if (value === null || value === undefined || value === "") return null;
      const parsed = parseFloat(String(value).replace(",", "."));
      if (isNaN(parsed) || parsed <= 0) return null;
      return parsed.toFixed(3);
    },
    resolvePesoRegistrado(item) {
      return (
        this.normalizePeso(item?.peso_r) ??
        this.normalizePeso(item?.peso_v) ??
        this.normalizePeso(item?.peso_o) ??
        ""
      );
    },
    focusPesoInput() {
      this.$nextTick(() => {
        const refs = this.$refs.pesoInput;
        const input = Array.isArray(refs) ? refs[0] : refs;
        if (input && typeof input.focus === "function") input.focus();
      });
    },
    handlePasteDetect() {
      this.$nextTick(() => this.handleSearchEnter());
    },
    handleSearchEnter() {
      const found = this.filteredData.length > 0 ? this.filteredData[0] : null;
      if (!found?.id) {
        this.searchTerm = "";
        return;
      }

      const exists = this.selectedForAssign.some((item) => Number(item?.id) === Number(found.id));
      if (exists) {
        this.$swal.fire({
          icon: "info",
          title: "Ya agregada",
          text: "La guia ya esta en la lista.",
        });
        this.searchTerm = "";
        return;
      }

      const pesoInicial = this.resolvePesoRegistrado(found);

      this.selectedItemsData = [
        {
          id: found.id,
          guia: found.guia,
          sucursale: found.sucursale ?? null,
          peso_r: pesoInicial,
          tarifa_id: found?.tarifa_id ?? null,
          tarifa: this.getTarifaLabel(found?.tarifa_id),
          precio: this.calculatePrice(found?.tarifa_id, pesoInicial),
          nombre_d: this.calculatePrice(found?.tarifa_id, pesoInicial),
          estado: found?.estado,
        },
      ];
      this.isModalVisible = true;
    },
    confirmAssignSelected() {
      const prepared = this.selectedItemsData.map((item) => {
        let peso = parseFloat(String(item.peso_r ?? "").replace(",", "."));
        if (isNaN(peso) || peso < 0.001) peso = 0.001;
        if (peso > 25) peso = 25;
        const pesoFormateado = peso.toFixed(3);
        return {
          ...item,
          peso_r: pesoFormateado,
          precio: this.calculatePrice(item.tarifa_id, pesoFormateado),
          nombre_d: this.calculatePrice(item.tarifa_id, pesoFormateado),
        };
      });

      this.selectedForAssign = [...this.selectedForAssign, ...prepared];
      this.selectedForDelivery = [...this.selectedForAssign];
      this.list = this.list.filter(
        (item) => !this.selectedForAssign.some((selectedItem) => Number(selectedItem.id) === Number(item.id))
      );
      this.selectedItemsData = [];
      this.isModalVisible = false;
      this.searchTerm = "";
    },
    async recibirPaquete(item, userId) {
      const payload = {
        estado: 10,
        peso_r: item.peso_r,
        nombre_d: item.nombre_d,
        encargado_regional_id: userId || null,
        cartero_recogida_id: userId || null,
        cartero_entrega_id: null,
      };

      await this.$api.$put(`recibirpaquetes/${item.id}`, payload);
    },
    async recibirTodosLosPaquetes() {
      if (!this.selectedForAssign.length) {
        this.$swal.fire({
          icon: "warning",
          title: "Sin seleccion",
          text: "Seleccione al menos una guia.",
        });
        return;
      }

      this.load = true;
      try {
        const userId = Number(this.user?.user?.id || 0);
        for (const item of this.selectedForAssign) {
          await this.recibirPaquete(item, userId);
        }

        this.$swal.fire({
          icon: "success",
          title: "Recibido de regional",
          text: "Los codigos seleccionados fueron actualizados a estado 10.",
        });

        this.selectedForAssign = [];
        this.selectedForDelivery = [];
        this.searchTerm = "";
        this.list = await this.GET_DATA(this.apiUrl);
      } catch (e) {
        console.error(e);
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          (typeof e?.response?.data === "string" ? e.response.data : "");
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: msg || "No se pudo cambiar a estado 10.",
        });
      } finally {
        this.load = false;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) this.currentPage++;
    },
    previousPage() {
      if (this.currentPage > 0) this.currentPage--;
    },
    goToPage(pageNo) {
      this.currentPage = pageNo;
    },
  },
  mounted() {
    this.$nextTick(async () => {
      const rawUser = localStorage.getItem("userAuth");
      this.user = rawUser ? JSON.parse(rawUser) : {};
      try {
        const [solicitudes, tarifas] = await Promise.all([
          this.GET_DATA(this.apiUrl),
          this.GET_DATA("getTarifas"),
        ]);
        this.list = solicitudes;
        this.tarifas = tarifas;
      } catch (e) {
        console.error(e);
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
  background-color: #34447c;
  color: #ffffff;
  font-weight: bold;
  text-transform: uppercase;
}

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}
</style>
