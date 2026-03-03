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
              <div class="card-header">Guias seleccionadas</div>
              <div class="card-body p-2 selected-list-body">
                <div v-if="!selectedForAssign.length" class="alert alert-info mb-2">
                  No hay guias seleccionadas.
                </div>

                <div class="table-responsive" v-if="selectedForAssign.length">
                  <table class="table table-sm table-bordered table-hover mb-2">
                    <thead>
                      <tr>
                        <th class="py-1 px-2">Guia</th>
                        <th class="py-1 px-2">Sucursal</th>
                        <th class="py-1 px-2">Tarifa</th>
                        <th class="py-1 px-2">Peso Correos (Kg)</th>
                        <th class="py-1 px-2 text-center" style="width: 90px">Quitar</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in selectedForAssign" :key="item.id">
                        <td class="py-1 px-2">{{ item.guia || ("ID " + item.id) }}</td>
                        <td class="py-1 px-2">{{ item?.sucursale?.nombre || "EMS GLOBAL" }}</td>
                        <td class="py-1 px-2">{{ item.tarifa || "SIN TARIFA" }}</td>
                        <td class="py-1 px-2">{{ item.peso_v || "-" }}</td>
                        <td class="py-1 px-2 text-center">
                          <button class="btn btn-danger btn-sm" @click="quitarSeleccion(item.id)">
                            Quitar
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <button
                  class="btn btn-primary w-100"
                  :disabled="!selectedForAssign.length"
                  @click="openRegionalModal"
                >
                  Mandar a regional
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedForDelivery.length > 0" class="mt-4">
          <h5>Paquetes para enviar</h5>
          <div class="table-responsive">
            <table class="table table-sm table-bordered">
              <thead>
                <tr>
                  <th class="py-0 px-1">#</th>
                  <th class="py-0 px-1">Guía</th>
                  <th class="py-0 px-1">Sucursal</th>
                  <th class="py-0 px-1">Tarifa</th>
                  <th class="py-0 px-1">Peso Correos (Kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in selectedForDelivery" :key="item.id || index">
                  <td class="py-0 px-1">{{ index + 1 }}</td>
                  <td class="py-0 px-1">{{ item.guia || "-" }}</td>
                  <td class="py-0 px-1">{{ item?.sucursale?.nombre || "EMS GLOBAL" }}</td>
                  <td class="py-0 px-1">{{ item.tarifa || "SIN TARIFA" }}</td>
                  <td class="py-0 px-1">{{ item.peso_v || "-" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminTemplate>

    <b-modal
      v-model="isModalVisible"
      title="Asignar Peso Correos (Kg)"
      hide-backdrop
      hide-footer
      @shown="focusPesoInput"
    >
      <div v-for="item in selectedItemsData" :key="item.id" class="form-group">
        <label :for="'peso_v-' + item.id">
          {{ item?.guia || "SIN GUIA" }} -
          {{ item?.sucursale?.nombre || "EMS GLOBAL" }} -
          {{ item?.tarifa || "SIN TARIFA" }}
        </label>

        <label :for="'peso_v-' + item.id" class="mt-2">Peso Envio (Kg)</label>
        <input
          type="text"
          :id="'peso_v-' + item.id"
          v-model="item.peso_v"
          class="form-control"
          @input="updatePrice(item)"
          placeholder="000.001"
          step="0.001"
          min="0.001"
          ref="pesoInput"
        />

        <label :for="'peso_o-' + item.id" class="mt-2">Peso origen (Kg)</label>
        <input type="text" :id="'peso_o-' + item.id" v-model="item.peso_o" class="form-control" disabled />
      </div>

      <div class="d-flex justify-content-end">
        <button class="btn btn-secondary" @click="isModalVisible = false">Cancelar</button>
        <button class="btn btn-primary ml-2" @click="confirmAssignSelected">Asignar</button>
      </div>
    </b-modal>

    <b-modal v-model="isRegionalModalVisible" title="Mandar a regional" hide-backdrop hide-footer>
      <div class="form-group">
        <label for="nombreGenerador">Apellido de quien manda</label>
        <input
          id="nombreGenerador"
          v-model.trim="nombreGenerador"
          type="text"
          class="form-control"
          placeholder="Escribe el apellido..."
        />
      </div>

      <div class="form-group mt-3">
        <label for="departamentoSeleccionado">Departamento destino</label>
        <select id="departamentoSeleccionado" v-model="departamentoSeleccionado" class="form-control">
          <option value="">Seleccione un departamento</option>
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

      <div class="form-group mt-3">
        <label for="tipoEnvioRegional">Tipo de envío</label>
        <select id="tipoEnvioRegional" v-model="tipoEnvioRegional" class="form-control">
          <option value="AEREO">AEREO</option>
          <option value="TERRESTRE">TERRESTRE</option>
        </select>
      </div>

      <div class="d-flex justify-content-end mt-3">
        <button class="btn btn-secondary" @click="isRegionalModalVisible = false">Cancelar</button>
        <button class="btn btn-primary ml-2" @click="confirmAllAssignments">Mandar</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { BModal } from "bootstrap-vue";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default {
  name: "GenerarDespachoCarteroIndex",
  components: {
    BModal,
  },
  data() {
    return {
      load: true,
      page: "Generar despachos",
      modulo: "Generar despachos",
      apiUrl: "solicitudes",
      list: [],
      tarifas: [],
      searchTerm: "",
      selectedItemsData: [],
      selectedForAssign: [],
      selectedForDelivery: [],
      isModalVisible: false,
      isRegionalModalVisible: false,
      nombreGenerador: "",
      departamentoSeleccionado: "",
      tipoEnvioRegional: "AEREO",
      user: {},
    };
  },
  computed: {
    availableData() {
      return (this.list || [])
        .filter((item) => Number(item?.id) > 0)
        .sort((a, b) => {
          const fa = a?.fecha_recojo_c ? new Date(a.fecha_recojo_c).getTime() : Number(a?.id || 0);
          const fb = b?.fecha_recojo_c ? new Date(b.fecha_recojo_c).getTime() : Number(b?.id || 0);
          return fb - fa;
        });
    },
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$api.$get(path);
      return Array.isArray(res) ? res : [];
    },
    getTarifaLabel(tarifaId) {
      if (!tarifaId) return "SIN TARIFA";
      const tarifa = (this.tarifas || []).find((t) => Number(t?.id) === Number(tarifaId));
      return tarifa?.departamento || "SIN TARIFA";
    },
    calculatePrice(tarifaId, pesoV) {
      const tarifa = (this.tarifas || []).find((t) => Number(t?.id) === Number(tarifaId));
      if (!tarifa) return 0;

      const basePrice = tarifa?.precio ? parseFloat(tarifa.precio) : 0;
      const extraPrice = tarifa?.precio_extra ? parseFloat(tarifa.precio_extra) : 0;
      const peso = parseFloat(pesoV);
      if (isNaN(peso)) return 0;
      if (peso > 1) {
        return basePrice + Math.ceil(peso - 1) * extraPrice;
      }
      return basePrice;
    },
    updatePrice(item) {
      item.precio = this.calculatePrice(item.tarifa_id, item.peso_v);
      item.nombre_d = item.precio;
    },
    itemMatchesSearch(item, term) {
      return (
        String(item?.id || "").toLowerCase().includes(term) ||
        String(item?.guia || "").toLowerCase().includes(term) ||
        String(item?.remitente || "").toLowerCase().includes(term) ||
        String(item?.destinatario || "").toLowerCase().includes(term) ||
        String(item?.reencaminamiento || "").toLowerCase().includes(term) ||
        String(item?.sucursale?.nombre || "").toLowerCase().includes(term)
      );
    },
    mapItemForAssign(item) {
      return {
        id: item?.id,
        guia: item?.guia || "",
        sucursale: item?.sucursale || null,
        peso_v: item?.peso_v || "",
        peso_o: item?.peso_o || "",
        tarifa_id: item?.tarifa_id || null,
        tarifa: item?.tarifa_id ? this.getTarifaLabel(item.tarifa_id) : "SIN TARIFA",
        precio: this.calculatePrice(item?.tarifa_id, item?.peso_v),
        nombre_d: this.calculatePrice(item?.tarifa_id, item?.peso_v),
        fecha_envio_regional: item?.fecha_envio_regional || null,
      };
    },
    handlePasteDetect() {
      this.$nextTick(() => this.handleSearchEnter());
    },
    handleSearchEnter() {
      const term = String(this.searchTerm || "").trim().toLowerCase();
      if (!term) {
        this.searchTerm = "";
        return;
      }

      const exact = this.availableData.find((item) => {
        const guia = String(item?.guia || "").toLowerCase();
        const id = String(item?.id || "").toLowerCase();
        return guia === term || id === term;
      });
      const partial = this.availableData.find((item) => this.itemMatchesSearch(item, term));
      const found = exact || partial;

      if (!found?.id) {
        this.$swal.fire({
          icon: "warning",
          title: "Guia no encontrada",
          text: "No se encontro una solicitud para ese criterio.",
        });
        this.searchTerm = "";
        return;
      }

      const alreadySelected = this.selectedForAssign.some(
        (item) => Number(item?.id) === Number(found.id)
      );
      if (alreadySelected) {
        this.$swal.fire({
          icon: "info",
          title: "Ya seleccionada",
          text: "La guia ya está en la pre-lista.",
        });
        this.searchTerm = "";
        return;
      }

      this.selectedItemsData = [this.mapItemForAssign(found)];
      this.isModalVisible = true;
    },
    focusPesoInput() {
      this.$nextTick(() => {
        const refs = this.$refs.pesoInput;
        const input = Array.isArray(refs) ? refs[0] : refs;
        if (input && typeof input.focus === "function") input.focus();
      });
    },
    confirmAssignSelected() {
      const prepared = this.selectedItemsData.map((item) => {
        let peso = parseFloat(item.peso_v);
        if (isNaN(peso) || peso < 0.001) peso = 0.001;
        if (peso > 25) peso = 25;

        const pesoFormateado = peso.toFixed(3);
        return {
          ...item,
          peso_v: pesoFormateado,
          precio: this.calculatePrice(item.tarifa_id, pesoFormateado),
          nombre_d: this.calculatePrice(item.tarifa_id, pesoFormateado),
        };
      });

      this.selectedForAssign = [...this.selectedForAssign, ...prepared];
      this.selectedForDelivery = [...this.selectedForAssign];
      this.isModalVisible = false;
      this.searchTerm = "";
      this.selectedItemsData = [];
    },
    quitarSeleccion(id) {
      this.selectedForAssign = this.selectedForAssign.filter(
        (item) => Number(item?.id) !== Number(id)
      );
      this.selectedForDelivery = [...this.selectedForAssign];
    },
    openRegionalModal() {
      if (!this.selectedForAssign.length) {
        this.$swal.fire({
          icon: "warning",
          title: "Sin seleccion",
          text: "Seleccione al menos una guía.",
        });
        return;
      }
      this.isRegionalModalVisible = true;
    },
    getNowDateTime() {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
        now.getHours()
      )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    },
    async loadImageAsBase64(path) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
        };
        image.onerror = reject;
        image.src = path;
      });
    },
    async generateCN33Excel() {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Designado Operador Postal");
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, "0");
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const yyyy = now.getFullYear();
      const hh = String(now.getHours()).padStart(2, "0");
      const mi = String(now.getMinutes()).padStart(2, "0");
      const formattedDate = `${dd}/${mm}/${yyyy}`;
      const formattedTime = `${hh}:${mi}`;
      const firstPackage = this.selectedForAssign.length ? this.selectedForAssign[0] : null;

      const headerStyle = {
        font: { bold: true },
        alignment: { vertical: "middle", horizontal: "center" },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        },
      };

      worksheet.columns = [
        { header: "ENVIO", key: "envio", width: 20 },
        { header: "ORIG", key: "orig", width: 15 },
        { header: "DEST", key: "dest", width: 15 },
        { header: "CAN", key: "can", width: 10 },
        { header: "COR", key: "cor", width: 10 },
        { header: "EMS", key: "ems", width: 15 },
        { header: "CLIENTE", key: "cliente", width: 25 },
        { header: "ENDAS", key: "endas", width: 20 },
        { header: "OBSERVACION", key: "observacion", width: 30 },
      ];

      worksheet.mergeCells("A1:C2");
      worksheet.getCell("A1").value = "Postal designated operator";
      worksheet.getCell("A1").style = headerStyle;
      worksheet.mergeCells("D1:G7");
      worksheet.getCell("D1").value = "EMS";
      worksheet.getCell("D1").style = headerStyle;
      worksheet.mergeCells("H1:M2");
      worksheet.getCell("H1").value = "LISTA CN-33";
      worksheet.getCell("H1").style = headerStyle;
      worksheet.mergeCells("A3:C3");
      worksheet.getCell("A3").value = "BO-BOLIVIA";
      worksheet.getCell("A3").style = headerStyle;
      worksheet.mergeCells("H3:M3");
      worksheet.getCell("H3").value = "Airmails";
      worksheet.getCell("H3").style = headerStyle;
      worksheet.mergeCells("A4:C4");
      worksheet.getCell("A4").value = "Office of origin";
      worksheet.getCell("A4").style = headerStyle;
      worksheet.mergeCells("H4:M4");
      worksheet.getCell("H4").value = "DIA";
      worksheet.getCell("H4").style = headerStyle;
      worksheet.mergeCells("A5:C5");
      worksheet.getCell("A5").value = `${firstPackage?.sucursale?.origen ?? "EMS"}`;
      worksheet.getCell("A5").style = headerStyle;
      worksheet.mergeCells("H5:M5");
      worksheet.getCell("H5").value = formattedDate;
      worksheet.getCell("H5").style = headerStyle;
      worksheet.mergeCells("A6:C6");
      worksheet.getCell("A6").value = "office of destination";
      worksheet.getCell("A6").style = headerStyle;

      const reencaminamientos = [
        ...new Set(this.selectedForAssign.map((item) => item.reencaminamiento || this.departamentoSeleccionado || "")),
      ].join(", ");
      worksheet.mergeCells("A7:C7");
      worksheet.getCell("A7").value = reencaminamientos || this.departamentoSeleccionado || "";
      worksheet.getCell("A7").style = headerStyle;

      try {
        const base64Image = await this.loadImageAsBase64(
          require("@/pages/sucursal/sucursales/sucursal/img/EMS.png")
        );
        const imageId = workbook.addImage({
          base64: base64Image,
          extension: "png",
        });
        worksheet.addImage(imageId, {
          tl: { col: 7, row: 5 },
          ext: { width: 500, height: 50 },
        });
      } catch (e) {}

      worksheet.mergeCells("A8:G8");
      worksheet.getCell("A8").value = "DESPACHO -001";
      worksheet.getCell("A8").style = headerStyle;
      worksheet.mergeCells("H8:M8");
      const tipoEnvioExcel = (this.tipoEnvioRegional || "AEREO").toUpperCase();
      worksheet.getCell("H8").value =
        tipoEnvioExcel === "TERRESTRE"
          ? "X PRIORITARIO                  X POR TERRESTRE"
          : "X PRIORITARIO                  X POR AEREO";
      worksheet.getCell("H8").style = headerStyle;
      worksheet.mergeCells("A9:G10");
      worksheet.getCell("A9").value =
        tipoEnvioExcel === "TERRESTRE" ? "TRANSPORTE TERRESTRE" : "NUMERO DE VUELO LPB-OB-680";
      worksheet.getCell("A9").style = headerStyle;
      worksheet.mergeCells("H9:M9");
      worksheet.getCell("H9").value = `DIA DE DESPACHO ${formattedDate}`;
      worksheet.getCell("H9").style = headerStyle;
      worksheet.mergeCells("H10:M10");
      worksheet.getCell("H10").value = `HORA ${formattedTime}`;
      worksheet.getCell("H10").style = headerStyle;
      worksheet.mergeCells("A11:C11");
      worksheet.getCell("A11").value = "         ";
      worksheet.getCell("A11").style = headerStyle;
      worksheet.mergeCells("D11:F11");
      worksheet.getCell("D11").value = "PESO (kg)";
      worksheet.getCell("D11").style = headerStyle;
      worksheet.mergeCells("G11:I11");
      worksheet.getCell("G11").value = "weinght (kg)";
      worksheet.getCell("G11").style = headerStyle;
      worksheet.mergeCells("J11:M12");
      worksheet.getCell("J11").value = "OBSERVACION";
      worksheet.getCell("J11").style = headerStyle;

      worksheet.getCell("A12").value = "ENVIO";
      worksheet.getCell("B12").value = "ORIG";
      worksheet.getCell("C12").value = "DEST";
      worksheet.getCell("D12").value = "CAN";
      worksheet.getCell("F12").value = "EMS";
      worksheet.getCell("G12").value = "CLIENTE";
      worksheet.getCell("H12").value = "ENDAS";
      worksheet.getCell("I12").value = "EMS";
      worksheet.getRow(12).eachCell((cell) => {
        cell.style = headerStyle;
      });

      let currentRow = 13;
      this.selectedForAssign.forEach((item) => {
        worksheet.getCell(`A${currentRow}`).value = item.guia || "";
        worksheet.getCell(`B${currentRow}`).value = item?.sucursale?.origen ?? "EMS";
        worksheet.getCell(`C${currentRow}`).value = item.reencaminamiento || this.departamentoSeleccionado || "";
        worksheet.getCell(`D${currentRow}`).value = 1;
        worksheet.getCell(`F${currentRow}`).value = parseFloat(item.peso_v || 0);
        worksheet.getCell(`G${currentRow}`).value = item?.sucursale?.nombre ?? "EMS GLOBAL";
        worksheet.mergeCells(`J${currentRow}:M${currentRow}`);
        worksheet.getCell(`J${currentRow}`).value = item?.observacion || "";
        worksheet.getRow(currentRow).eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
        currentRow++;
      });

      worksheet.getCell(`D${currentRow}`).value = { formula: `SUM(D13:D${currentRow - 1})` };
      worksheet.getCell(`F${currentRow}`).value = { formula: `SUM(F13:F${currentRow - 1})` };
      worksheet.getColumn("F").numFmt = "#,##0.000";

      worksheet.mergeCells(`A${currentRow + 8}:B${currentRow + 8}`);
      worksheet.getCell(`A${currentRow + 8}`).value = "Dispatching office of exchange";
      worksheet.getCell(`A${currentRow + 8}`).style = headerStyle;
      worksheet.mergeCells(`A${currentRow + 9}:B${currentRow + 9}`);
      worksheet.getCell(`A${currentRow + 9}`).value = this.nombreGenerador || "Nombre no registrado";
      worksheet.getCell(`A${currentRow + 9}`).style = headerStyle;
      worksheet.mergeCells(`A${currentRow + 10}:B${currentRow + 10}`);
      worksheet.getCell(`A${currentRow + 10}`).value = "Signature";
      worksheet.getCell(`A${currentRow + 10}`).style = headerStyle;
      worksheet.mergeCells(`A${currentRow + 11}:B${currentRow + 11}`);
      worksheet.getCell(`A${currentRow + 11}`).value = "Salida Internacional";
      worksheet.getCell(`A${currentRow + 11}`).style = headerStyle;
      worksheet.mergeCells(`E${currentRow + 8}:G${currentRow + 8}`);
      worksheet.getCell(`E${currentRow + 8}`).value = "The official of the carrier or airport";
      worksheet.getCell(`E${currentRow + 8}`).style = headerStyle;
      worksheet.mergeCells(`E${currentRow + 9}:G${currentRow + 9}`);
      worksheet.getCell(`E${currentRow + 9}`).value = "Date and signature";
      worksheet.getCell(`E${currentRow + 9}`).style = headerStyle;
      worksheet.mergeCells(`H${currentRow + 8}:I${currentRow + 8}`);
      worksheet.getCell(`H${currentRow + 8}`).value = "Office of exchange of destination";
      worksheet.getCell(`H${currentRow + 8}`).style = headerStyle;
      worksheet.mergeCells(`H${currentRow + 9}:I${currentRow + 9}`);
      worksheet.getCell(`H${currentRow + 9}`).value = "Date and signature";
      worksheet.getCell(`H${currentRow + 9}`).style = headerStyle;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "designado_operador_postal.xlsx");
    },
    async sendToRegional(item, userId, fechaEnvioRegional) {
      const payload = {
        cartero_recogida_id: userId || null,
        peso_v: item.peso_v ?? "0.001",
        nombre_d: item.nombre_d ?? null,
        fecha_envio_regional: item?.fecha_envio_regional || fechaEnvioRegional,
        reencaminamiento: this.departamentoSeleccionado,
        estado: 8,
      };

      const requests = [
        () => this.$api.$put(`mandarregional/${item.id}`, payload),
        () => this.$api.$put(`solicitudesregional/${item.id}`, payload),
        () => this.$api.$put(`solicitudesregional5/${item.id}`, payload),
        () => this.$api.$put(`solicitudes/${item.id}/cambiar-estado`, { estado: 8 }),
      ];

      let lastError = null;
      for (const request of requests) {
        try {
          await request();
          this.list = (this.list || []).map((row) =>
            Number(row?.id) === Number(item?.id) ? { ...row, estado: 8 } : row
          );
          return;
        } catch (e) {
          lastError = e;
        }
      }
      throw lastError;
    },
        async confirmAllAssignments() {
      if (!this.departamentoSeleccionado) {
        this.$swal.fire({
          icon: "warning",
          title: "Falta departamento",
          text: "Seleccione el departamento destino.",
        });
        return;
      }

      if (!this.selectedForAssign.length) {
        this.$swal.fire({
          icon: "warning",
          title: "Sin seleccion",
          text: "No hay guias para mandar.",
        });
        return;
      }

      this.load = true;
      try {
        const userId = Number(this.user?.user?.id || 0);
        const fechaEnvioRegional = this.getNowDateTime();

        for (const item of this.selectedForAssign) {
          item.reencaminamiento = this.departamentoSeleccionado;
          await this.sendToRegional(item, userId, fechaEnvioRegional);
        }

        try {
          await this.generateCN33Excel();
        } catch (exportError) {
          console.error("Error generando CN-33:", exportError);
          this.$swal.fire({
            icon: "warning",
            title: "Despacho enviado",
            text: "Se mando a regional, pero no se pudo generar el CN-33.",
          });
        }

        this.$swal.fire({
          icon: "success",
          title: "Despacho enviado",
          text: "Las guias fueron mandadas a regional y se genero el CN-33.",
        });

        this.isRegionalModalVisible = false;
        this.selectedForAssign = [];
        this.selectedForDelivery = [];
        this.searchTerm = "";

        this.list = await this.GET_DATA(this.apiUrl);
      } catch (e) {
        console.error(e);
        const backendMessage =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          (typeof e?.response?.data === "string" ? e.response.data : "");
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text:
            backendMessage ||
            "No se pudo mandar a regional. Verifique permisos o endpoint.",
        });
        if (e?.response?.data) {
          this.$swal.fire({
            icon: "info",
            title: "Detalle backend",
            text:
              typeof e.response.data === "string"
                ? e.response.data
                : JSON.stringify(e.response.data),
          });
        }
      } finally {
        this.load = false;
      }
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

.selected-list-body {
  min-height: 380px;
}
</style>


