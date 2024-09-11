<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">

          <div class="col-3">
            <input v-model="searchTerm" @keypress.enter="handleSearchEnter" type="text" class="form-control"
              placeholder="Buscar..." />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                SOLICITUDES
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>
                        <th class="py-0 px-1">Guía</th>
                        <th class="py-0 px-1">Remitente</th>
                        <th class="py-0 px-1">Detalles de Domicilio</th>

                        <!-- Nueva columna para la dirección específica -->
                        <th class="py-0 px-1">Zona</th> <!-- Nueva columna para la zona -->
                        <th class="py-0 px-1">Dirección maps</th>
                        <th class="py-0 px-1">Teléfono</th>
                        <th class="py-0 px-1">Contenido</th>
                        <th class="py-0 px-1">Fecha Solicitud</th>
                        <th class="py-0 px-1">Destinatario</th>
                        <th class="py-0 px-1">Teléfono D</th>
                        <th class="py-0 px-1">Dirección Destinatario</th>
                        <th class="py-0 px-1">Municipio/Provincia</th>
                        <th class="py-0 px-1">Zona Destinatario</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedData" :key="i">
                        <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                        <td class="p-1">{{ m.sucursale.nombre }}</td>
                        <td class="py-0 px-1">{{ m.guia }}</td>
                        <td class="py-0 px-1">{{ m.remitente }}</td>
                        <td class="py-0 px-1">{{ m.direccion.direccion_especifica }}</td>
                        <!-- Mostrar la dirección específica -->
                        <td class="py-0 px-1">{{ m.direccion.zona }}</td> <!-- Mostrar la zona -->
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
                  <button class="page-link" @click="previousPage" :disabled="currentPage === 0">&lt;</button>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page"
                  :class="{ active: currentPage === page - 1 }">
                  <button class="page-link" @click="goToPage(page - 1)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                  <button class="page-link" @click="nextPage" :disabled="currentPage >= totalPages - 1">&gt;</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div class="col-3" v-if="selectedForAssign.length > 0">
          <button class="btn btn-primary" @click="isModalNameVisible = true">
            MANDAR A REGIONAL
          </button>

          <!-- Modal para ingresar el nombre -->
          <b-modal v-model="isModalNameVisible" title="Generar CN-33" hide-footer>
            <div class="form-group">
              <label for="nombreGenerador">Nombre de la persona que genera el CN-33</label>
              <input v-model="nombreGenerador" type="text" class="form-control" placeholder="Escribe tu nombre..." />
            </div>
            <div class="d-flex justify-content-end">
              <button class="btn btn-secondary" @click="isModalNameVisible = false">Cancelar</button>
              <button class="btn btn-primary ml-2" @click="confirmNameAndGenerate">Generar Reporte</button>
            </div>
          </b-modal>

        </div>
        <!-- Nueva tabla para mostrar los paquetes seleccionados para entregar -->
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
                <tr v-for="(item, index) in selectedForDelivery" :key="index">
                  <td class="py-0 px-1">{{ index + 1 }}</td>
                  <td class="py-0 px-1">{{ item.guia }}</td>
                  <td class="py-0 px-1">{{ item.sucursale.nombre }}</td>
                  <td class="py-0 px-1">{{ item.tarifa }}</td>
                  <td class="py-0 px-1">{{ item.peso_v }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminTemplate>

    <!-- Modal para añadir peso_v -->
    <b-modal v-model="isModalVisible" title="Asignar Peso Correos (Kg)" hide-backdrop hide-footer
      @shown="focusPesoInput">
      <div v-for="item in selectedItemsData" :key="item.id" class="form-group">
        <label :for="'peso_v-' + item.id">{{ item.guia }} - {{ item.sucursale.nombre }} - {{ item.tarifa }}</label>

        <!-- Campo de entrada con ref para enfoque directo -->
        <label :for="'peso_v-' + item.id" class="mt-2">Peso Envio (Kg)</label>
        <input type="text" :id="'peso_v-' + item.id" v-model="item.peso_v" class="form-control"
          @input="updatePrice(item)" placeholder="000.001" step="0.001" min="0.001" ref="pesoInput" />
        <!-- Campo de entrada con ref para enfoque directo -->
        <label :for="'peso_o-' + item.id" class="mt-2">Peso origen (Kg)</label>
        <input type="text" :id="'peso_o-' + item.id" v-model="item.peso_o" class="form-control" disabled />
        <!-- Campo oculto para nombre_d -->
        <label :for="'nombre_d-' + item.id" class="d-none">Nombre Destinatario</label>
        <input type="text" :id="'nombre_d-' + item.id" v-model="item.nombre_d" class="form-control d-none" readonly />
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
import { saveAs } from 'file-saver';



export default {
  name: "IndexPage",
  components: {
    BCollapse,
    BModal
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    }
  },
  data() {
    return {
      load: true,
      list: [],
      searchTerm: '',
      apiUrl: 'solicitudes5',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/admin/solicitudesj/solicitudej/nuevo',
      url_editar: '/admin/solicitudescartero/solicitudecartero/editar/',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      tarifas: [], // Inicializamos tarifas como un array vacío
      collapseState: {},
      isModalVisible: false,
      currentId: null,
      selected: {},
      selectedItemsData: [],
      selectedForAssign: [],
      selectedForDelivery: [], // Nueva propiedad para almacenar los paquetes seleccionados para entregar
      user: {
        cartero: []
      },
      currentPage: 0,
      itemsPerPage: 10,
      isModalNameVisible: false, // Controla la visibilidad del modal
      nombreGenerador: '',       // Variable para almacenar el nombre ingresado
      selectedForAssign: [],     // Paquetes seleccionados
      selectedForDelivery: [],   // Paquetes para enviar
      load: true,                // Controla la carga
    };
  },
  computed: {
    filteredData() {
      const searchTerm = this.searchTerm.toLowerCase();

      // Verificar si `this.user` y `this.user.user` están definidos antes de acceder a `departamento`
      const departamentoCartero = this.user && this.user.user ? this.user.user.departamento : null;

      return this.list.filter(item =>
        item.estado === 5 &&
        item.sucursale && // Asegurarse de que la sucursal exista
        departamentoCartero && item.sucursale.origen === departamentoCartero && // Filtrar por el origen de la sucursal y el departamento del usuario
        (
          (this.selectedSucursal ? item.sucursale.id === this.selectedSucursal : true) && // Filtrar por sucursal seleccionada
          (Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm)
          ) ||
            (item.sucursale.nombre && item.sucursale.nombre.toLowerCase().includes(searchTerm)))
        )
      ).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
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
    focusPesoInput() {
      this.$refs.pesoInput[0].focus(); // Asegúrate de que el campo de entrada esté enfocado
    },
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    getTarifaLabel(tarifa_id) {
      if (!this.tarifas) {
        return 'Tarifas no cargadas';
      }
      const tarifa = this.tarifas.find(t => t.id === tarifa_id);
      return tarifa ? tarifa.departamento : 'Tarifa no encontrada';
    },
    calculatePrice(tarifa_id, peso_v) {
      const tarifa = this.tarifas.find(t => t.id === tarifa_id);
      if (tarifa) {
        const basePrice = tarifa.precio ? parseFloat(tarifa.precio) : 0;
        const extraPrice = tarifa.precio_extra ? parseFloat(tarifa.precio_extra) : 0;
        const peso = parseFloat(peso_v);
        if (isNaN(peso)) {
          return ''; // No mostrar nada si el peso está vacío
        }
        if (peso > 1) {
          const pesoAdicional = Math.ceil(peso - 1); // Redondea hacia arriba para cada 1.01, 2.01, etc.
          return basePrice + pesoAdicional * extraPrice;
        } else {
          return basePrice;
        }
      }
      return '';
    },
    updatePrice(item) {
      const peso = parseFloat(item.peso_v);
      item.precio = this.calculatePrice(item.tarifa_id, item.peso_v);
      item.nombre_d = item.precio; // Actualiza nombre_d con el precio calculado
    },
    async GET_DATA(path) {
      const res = await this.$encargados.$get(path);
      return res;
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$encargados.$delete(this.apiUrl + '/' + id);
        await Promise.all([this.GET_DATA(this.apiUrl)]).then((v) => {
          this.list = v[0];
        });
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },
    openAssignModal() {
      this.selectedItemsData = this.list.filter(item => this.selected[item.id]).map(item => {
        const precio = this.calculatePrice(item.tarifa_id, item.peso_v);
        return {
          id: item.id,
          guia: item.guia,
          sucursale: item.sucursale,
          peso_v: item.peso_v !== undefined && item.peso_v !== null && item.peso_v !== 0 ? item.peso_v : '', // Asegúrate de que peso_v esté vacío inicialmente
          tarifa_id: item.tarifa_id,
          tarifa: this.getTarifaLabel(item.tarifa_id),
          nombre_d: precio,
          precio: precio,
          peso_o: item.peso_o // Incluye peso aquí

        };
      });
      this.isModalVisible = true;
    },
    handleSearchEnter() {
      const filteredItems = this.filteredData;
      if (filteredItems.length > 0) {
        const item = filteredItems[0]; // Seleccionar el primer elemento filtrado
        this.selectedItemsData = [{
          id: item.id,
          guia: item.guia,
          sucursale: item.sucursale,
          peso_v: item.peso_v || 0,
          tarifa_id: item.tarifa_id,
          tarifa: this.getTarifaLabel(item.tarifa_id), // Añadir la tarifa al objeto
          precio: this.calculatePrice(item.tarifa_id, item.peso_v), // Calcular el precio inicial
          peso_o: item.peso_o, // Incluye peso aquí

        }];
        this.isModalVisible = true;
      }
    },
    confirmAssignSelected() {
      this.selectedForAssign = [...this.selectedForAssign, ...this.selectedItemsData.map(item => {
        // Validación final
        let peso = parseFloat(item.peso_v);
        if (isNaN(peso) || peso < 0.001) {
          peso = 0.001;
        } else if (peso > 25.000) {
          peso = 25.000;
        }
        item.peso_v = peso.toFixed(3); // Ajustar y formatear el valor
        item.nombre_d = item.precio; // Asegúrate de que nombre_d tenga el mismo valor que precio
        return item;
      })];

      // Actualizar la lista de paquetes para entregar
      this.selectedForDelivery = [...this.selectedForAssign];

      // Remover los elementos seleccionados de la lista original (tabla de arriba)
      this.list = this.list.filter(item => !this.selectedForAssign.some(selectedItem => selectedItem.id === item.id));

      this.isModalVisible = false;
      this.selected = {}; // Limpiar la selección después de asignar

      // Limpiar el campo de búsqueda
      this.searchTerm = '';
    },
    confirmNameAndGenerate() {
      if (!this.nombreGenerador) {
        this.$swal.fire({
          icon: 'warning',
          title: 'Campo vacío',
          text: 'Por favor, ingrese el nombre de la persona que genera el CN-33',
        });
        return;
      }

      // Cerrar el modal y llamar a la función que genera el Excel
      this.isModalNameVisible = false;
      this.confirmAllAssignments();
    },
    async confirmAllAssignments() {
      this.load = true;
      try {
        const carteroId = this.user.user.id;
        const payload = this.selectedForAssign.map(item => ({
          id: item.id,
          guia: item.guia,
          origen: item.sucursale.origen,
          tarifa: item.tarifa,
          peso_v: item.peso_v,
          sucursale_nombre: item.sucursale.nombre,
          fecha_solicitud: item.fecha,
          fecha_envio_regional: item.fecha_envio_regional
        }));

        for (let item of this.selectedForAssign) {
          await this.$encargados.$put(`solicitudesregional5/${item.id}`, {
            encargado_id: carteroId,
            peso_v: item.peso_v,
            fecha_envio_regional: item.fecha_envio_regional,
            precio: item.precio,
            nombre_d: item.nombre_d
          });
        }

        // Generar el archivo Excel en el frontend usando ExcelJS con el nuevo diseño
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Designado Operador Postal');
        // Obtener la fecha y hora actual
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
        const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
        const firstPackage = this.selectedForAssign.length > 0 ? this.selectedForAssign[0] : null;

        // Estilo de las celdas
        const headerStyle = {
          font: { bold: true },
          alignment: { vertical: 'middle', horizontal: 'center' },
          border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          }
        };
        // Ajustar el ancho de las columnas
        worksheet.columns = [
          { header: 'ENVIO', key: 'envio', width: 20 },       // Ancho de la columna 'ENVIO'
          { header: 'ORIG', key: 'orig', width: 15 },         // Ancho de la columna 'ORIG'
          { header: 'DEST', key: 'dest', width: 15 },         // Ancho de la columna 'DEST'
          { header: 'CAN', key: 'can', width: 10 },           // Ancho de la columna 'CAN'
          { header: 'COR', key: 'cor', width: 10 },           // Ancho de la columna 'COR'
          { header: 'EMS', key: 'ems', width: 15 },           // Ancho de la columna 'EMS'
          { header: 'CLIENTE', key: 'cliente', width: 25 },   // Ancho de la columna 'CLIENTE'
          { header: 'ENDAS', key: 'endas', width: 20 },       // Ancho de la columna 'ENDAS'
          { header: 'OBSERVACION', key: 'observacion', width: 30 }  // Ancho de la columna 'OBSERVACION'
        ];

        // Ajustar la altura de las filas
        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
          row.height = 20;  // Ajustar la altura de todas las filas a 20
        });

        // Primera fila
        worksheet.mergeCells('A1:C2');
        worksheet.getCell('A1').value = 'Postal designated operator';
        worksheet.getCell('A1').style = headerStyle;

        worksheet.mergeCells('D1:G7');  // Aquí se asegura que esta sea la única celda para EMS
        worksheet.getCell('D1').value = 'EMS';
        worksheet.getCell('D1').style = headerStyle;

        worksheet.mergeCells('H1:M2');
        worksheet.getCell('H1').value = 'LISTA CN-33';
        worksheet.getCell('H1').style = headerStyle;

        // Segunda fila de datos
        worksheet.mergeCells('A3:C3');
        worksheet.getCell('A3').value = 'BO-BOLIVIA';
        worksheet.getCell('A3').style = headerStyle;

        worksheet.mergeCells('H3:M3');
        worksheet.getCell('H3').value = 'Airmails';
        worksheet.getCell('H3').style = headerStyle;

        // Tercera fila
        worksheet.mergeCells('A4:C4');
        worksheet.getCell('A4').value = 'Office of origin';
        worksheet.getCell('A4').style = headerStyle;

        worksheet.mergeCells('H4:M4');
        worksheet.getCell('H4').value = 'DIA';
        worksheet.getCell('H4').style = headerStyle;

        // Cuarta fila
        worksheet.mergeCells('A5:C5');
        worksheet.getCell('A5').value = `${firstPackage.sucursale.origen}`; // Usar el origen del primer paquete
        worksheet.getCell('A5').style = headerStyle;

        worksheet.mergeCells('H5:M5');
        worksheet.getCell('H5').value = formattedDate; // Fecha actual
        worksheet.getCell('H5').style = headerStyle;


        // Quinta fila
        worksheet.mergeCells('A6:C6');
        worksheet.getCell('A6').value = 'office of destination';
        worksheet.getCell('A6').style = headerStyle;

        worksheet.mergeCells('A7:C7');
        worksheet.getCell('A7').value = `${firstPackage.tarifa}`; // Usar la tarifa/departamento del primer paquete
        worksheet.getCell('A7').style = headerStyle;

        // Aquí agregamos la imagen sin subdivisiones de celdas
        const base64Image = await this.loadImageAsBase64(require('@/pages/sucursal/sucursales/sucursal/img/EMS.png'));
        const imageId = workbook.addImage({
          base64: base64Image,
          extension: 'png',
        });

        // La imagen ocupa una sola celda, sin divisiones
        worksheet.addImage(imageId, {
          tl: { col: 7, row: 5 }, // Posición exacta donde inicia la imagen
          ext: { width: 500, height: 50 } // Tamaño ajustado de la imagen
        });

        // Sexta fila
        worksheet.mergeCells('A8:G8');
        worksheet.getCell('A8').value = 'DESPACHO -001';
        worksheet.getCell('A8').style = headerStyle;

        worksheet.mergeCells('H8:M8');
        worksheet.getCell('H8').value = 'X PRIORITARIO                  X POR AEREO';
        worksheet.getCell('H8').style = headerStyle;

        // Séptima fila
        worksheet.mergeCells('A9:G10');
        worksheet.getCell('A9').value = 'NUMERO DE VUELO LPB-OB-680';
        worksheet.getCell('A9').style = headerStyle;

        worksheet.mergeCells('H9:M9');
        worksheet.getCell('H9').value = `DIA DE DESPACHO ${formattedDate}`; // Día de despacho con fecha actual
        worksheet.getCell('H9').style = headerStyle;


        worksheet.mergeCells('H10:M10');
        worksheet.getCell('H10').value = `HORA ${formattedTime}`; // Hora actual
        worksheet.getCell('H10').style = headerStyle;


        // Continuar agregando filas con los mismos estilos
        worksheet.mergeCells('A11:C11');
        worksheet.getCell('A11').value = '         ';
        worksheet.getCell('A11').style = headerStyle;

        // Continuar agregando filas con los mismos estilos
        worksheet.mergeCells('D11:F11');
        worksheet.getCell('D11').value = 'PESO (kg)';
        worksheet.getCell('D11').style = headerStyle;


        worksheet.mergeCells('G11:I11');
        worksheet.getCell('G11').value = 'weinght (kg)';
        worksheet.getCell('G11').style = headerStyle;



        worksheet.mergeCells('J11:M12');
        worksheet.getCell('J11').value = 'OBSERVACION';
        worksheet.getCell('J11').style = headerStyle;
        worksheet.getCell('A12').value = 'ENVIO';
        worksheet.getCell('A12').style = headerStyle;

        worksheet.getCell('B12').value = 'ORIG';
        worksheet.getCell('B12').style = headerStyle;

        worksheet.getCell('C12').value = 'DEST';
        worksheet.getCell('C12').style = headerStyle;

        worksheet.getCell('D12').value = 'CAN';
        worksheet.getCell('D12').style = headerStyle;

        worksheet.getCell('E12').value = 'COR';
        worksheet.getCell('E12').style = headerStyle;

        worksheet.getCell('F12').value = 'EMS';
        worksheet.getCell('F12').style = headerStyle;

        worksheet.getCell('G12').value = 'CLIENTE';
        worksheet.getCell('G12').style = headerStyle;

        worksheet.getCell('H12').value = 'ENDAS';
        worksheet.getCell('H12').style = headerStyle;

        worksheet.getCell('I12').value = 'EMS';
        worksheet.getCell('I12').style = headerStyle;


        // Cabecera
        worksheet.getCell('A12').value = 'ENVIO'; // Guías
        worksheet.getCell('B12').value = 'ORIG'; // Origen Sucursal
        worksheet.getCell('C12').value = 'DEST'; // Tarifa Departamento
        worksheet.getCell('D12').value = 'CAN'; // Cantidad (Siempre 1)
        worksheet.getCell('F12').value = 'EMS'; // Peso
        worksheet.getCell('G12').value = 'CLIENTE'; // Nombre de la Sucursal

        // Estilo de la cabecera
        worksheet.getRow(12).eachCell((cell) => {
          cell.style = headerStyle;
        });
        // // Asignar el nombre ingresado en la celda A20
        // worksheet.getCell('A20').value = `Generado por: ${this.nombreGenerador}`; // Nombre ingresado en el modal
        // worksheet.getCell('A20').style = headerStyle;
        // // Agregar los datos seleccionados
        let currentRow = 13; // Inicializar currentRow después de la cabecera

        this.selectedForAssign.forEach((item) => {
          let peso = parseFloat(item.peso_v); // Convertir peso a número con punto decimal
          worksheet.getCell(`A${currentRow}`).value = item.guia;
          worksheet.getCell(`B${currentRow}`).value = item.sucursale.origen;
          worksheet.getCell(`C${currentRow}`).value = item.tarifa;
          worksheet.getCell(`D${currentRow}`).value = 1; // Cantidad
          worksheet.getCell(`F${currentRow}`).value = peso; // Asignar peso como número
          worksheet.getCell(`G${currentRow}`).value = item.sucursale.nombre;
          worksheet.mergeCells(`J${currentRow}:M${currentRow}`);
  worksheet.getCell(`J${currentRow}`).value = item.observacion || ''; // Asignar observación

          worksheet.getRow(currentRow).eachCell((cell) => {
            cell.style = {
              alignment: { vertical: 'middle', horizontal: 'center' },
              border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
              }
            };
          });

          currentRow++; // Incrementar currentRow después de cada fila
        });

        // Aplicar las fórmulas para sumar el peso y cantidad total
        worksheet.getCell(`D${currentRow}`).value = { formula: `SUM(D13:D${currentRow - 1})` }; // Total cantidad
        worksheet.getCell(`F${currentRow}`).value = { formula: `SUM(F13:F${currentRow - 1})` }; // Total peso como número

        // Aplicar el formato de las celdas en toda la tabla
        worksheet.eachRow({ includeEmpty: false }, function (row) {
          worksheet.getColumn('F').numFmt = '#,##0.000'; // Formato con coma para miles y decimales

          row.eachCell({ includeEmpty: false }, function (cell) {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        });
        // Después de la tabla y los totales, añadimos las celdas para los nuevos campos
        worksheet.mergeCells(`A${currentRow + 8}:B${currentRow + 8}`);
        worksheet.getCell(`A${currentRow + 8}`).value = 'Dispatching office of exchange';
        worksheet.getCell(`A${currentRow + 8}`).style = headerStyle;

        worksheet.mergeCells(`A${currentRow + 9}:B${currentRow + 9}`);
        worksheet.getCell(`A${currentRow + 9}`).value = this.nombreGenerador || 'Nombre no registrado';
        worksheet.getCell(`A${currentRow + 9}`).style = headerStyle;

        worksheet.mergeCells(`A${currentRow + 10}:B${currentRow + 10}`);
        worksheet.getCell(`A${currentRow + 10}`).value = 'Signature';
        worksheet.getCell(`A${currentRow + 10}`).style = headerStyle;

        worksheet.mergeCells(`A${currentRow + 11}:B${currentRow + 11}`);
        worksheet.getCell(`A${currentRow + 11}`).value = 'Salida Internacional';
        worksheet.getCell(`A${currentRow + 11}`).style = headerStyle;

        // Campos del centro
        worksheet.mergeCells(`E${currentRow + 8}:G${currentRow + 8}`);
        worksheet.getCell(`E${currentRow + 8}`).value = 'The official of the carrier or airport';
        worksheet.getCell(`E${currentRow + 8}`).style = headerStyle;

        worksheet.mergeCells(`E${currentRow + 9}:G${currentRow + 9}`);
        worksheet.getCell(`E${currentRow + 9}`).value = 'Date and signature';
        worksheet.getCell(`E${currentRow + 9}`).style = headerStyle;

        // Campos de la derecha
        worksheet.mergeCells(`H${currentRow + 8}:I${currentRow + 8}`);
        worksheet.getCell(`H${currentRow + 8}`).value = 'Office of exchange of destination';
        worksheet.getCell(`H${currentRow + 8}`).style = headerStyle;

        worksheet.mergeCells(`H${currentRow + 9}:I${currentRow + 9}`);
        worksheet.getCell(`H${currentRow + 9}`).value = 'Date and signature';
        worksheet.getCell(`H${currentRow + 9}`).style = headerStyle;

        // Finalmente, guarda el archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'designado_operador_postal.xlsx');


        this.selectedForAssign = [];
        this.selectedForDelivery = [];

        this.$swal.fire({
          icon: 'success',
          title: 'Paquetes Enviados',
          text: 'Todos los paquetes seleccionados han sido asignados y exportados.',
        });
      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al asignar los paquetes.',
        });
      } finally {
        this.load = false;
      }
    },

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
    },

    async getBase64Image(path) {
      const response = await fetch(path);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }



    ,


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
      this.user = JSON.parse(user);
      try {
        const data = await this.GET_DATA(this.apiUrl);
        if (Array.isArray(data)) {
          this.list = data;
        } else {
          console.error('Los datos recuperados no son un array:', data);
        }
        // Obtener tarifas para los nombres de tarifa
        const tarifas = await this.GET_DATA('getTarifas');
        if (Array.isArray(tarifas)) {
          this.tarifas = tarifas;
          console.log('Tarifas cargadas:', tarifas); // Log para verificar las tarifas
        } else {
          console.error('Las tarifas recuperadas no son un array:', tarifas);
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
  background-color: #007bff;
  color: white;
}
</style>
