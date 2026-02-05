<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <!-- Botón para mostrar los elementos seleccionados -->
          <div class="col-3" v-if="hasSelectedItems">
            <button @click="openSelectedModal" class="btn btn-primary btn-sm w-100">
              <i class="fas fa-truck"></i> Mostrar Seleccionados
            </button>
          </div>
          <!-- Input de búsqueda -->
          <div class="col-3">
            <input v-model="searchTerm" @keypress.enter.prevent="handleSearchEnter" type="text" class="form-control"
              placeholder="Buscar..." />
          </div>
          <!-- Selección de Sucursal -->
          <div class="col-3">
            <select v-model="selectedSucursal" class="form-control" @change="handleSucursalChange">
              <option value="">Seleccione Sucursal</option>
              <option v-for="sucursal in filteredSucursales" :key="sucursal.id" :value="sucursal.id">
                {{ dash(sucursal.nombre) }}
              </option>
            </select>
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
                    <th class="py-0 px-1">
                      <input type="checkbox" @change="selectAll($event)" />
                    </th>
                    <th class="py-0 px-1">#</th>
                    <th class="py-0 px-1">Sucursal</th>
                    <th class="py-0 px-1">Guía</th>
                    <th class="py-0 px-1">Acuerdo de Recojo</th>
                    <th class="py-0 px-1">Peso Empresa (Kg)</th>
                    <th class="py-0 px-1">Remitente</th>
                    <th class="py-0 px-1">Detalles de Domicilio</th>
                    <th class="py-0 px-1">Zona</th>
                    <th class="py-0 px-1">Dirección maps</th>
                    <th class="py-0 px-1">Teléfono</th>
                    <th class="py-0 px-1">Contenido</th>
                    <th class="py-0 px-1">Fecha</th>
                    <th class="py-0 px-1">Destinatario</th>
                    <th class="py-0 px-1">Teléfono D</th>
                    <th class="py-0 px-1">Dirección Destinatario</th>
                    <th class="py-0 px-1">Ciudad/Provincia</th>
                    <th class="py-0 px-1">Zona Destino</th>
                    <th class="py-0 px-1">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(m, i) in filteredData" :key="i">
                    <td class="py-0 px-1">
                      <input type="checkbox" v-model="selected[m.id]" />
                    </td>
                    <td class="py-0 px-1">{{ i + 1 }}</td>
                    <td class="p-1">{{ m.sucursale ? m.sucursale.nombre : '' }}</td>
                    <td class="py-0 px-1">{{ dash(m.guia) }}</td>
                    <td class="py-0 px-1">{{ dash(m.sucursale.acuerdos) }}</td>
                    <td class="py-0 px-1">{{ dash(m.peso_o) }}</td>
                    <td class="py-0 px-1">{{ dash(m.remitente) }}</td>
                    <td class="py-0 px-1">{{ dash(m.direccion.direccion_especifica) }}</td>
                    <td class="py-0 px-1">{{ dash(m.direccion.zona) }}</td>
                    <td class="py-0 px-1">
                      <a v-if="isCoordinates(m.direccion.direccion)"
                        :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion.direccion"
                        target="_blank" class="btn btn-primary btn-sm">
                        Ver mapa
                      </a>
                      <span v-else>{{ dash(m.direccion.direccion) }}</span>
                    </td>
                    <td class="py-0 px-1">{{ dash(m.telefono) }}</td>
                    <td class="py-0 px-1">{{ dash(m.contenido) }}</td>
                    <td class="py-0 px-1">{{ dash(m.fecha) }}</td>
                    <td class="py-0 px-1">{{ dash(m.destinatario) }}</td>
                    <td class="py-0 px-1">{{ dash(m.telefono_d) }}</td>
                    <td class="py-0 px-1">
                      <a v-if="isCoordinates(m.direccion_d)"
                        :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d" target="_blank"
                        class="btn btn-primary btn-sm">
                        Ver mapa
                      </a>
                      <span v-else>{{ dash(m.direccion_d) }}</span>
                    </td>
                    <td class="py-0 px-1">{{ dash(m.ciudad) }}</td>
                    <td class="py-0 px-1">{{ dash(m.zona_d) }}</td>
                    <td class="py-0 px-1">
                          <div class="btn-group">
                  
                            <button type="button" @click="reprintPDF(m)" class="btn btn-warning btn-sm">
                              Imprimir Rotulo
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
              <button class="btn btn-secondary" :disabled="currentPage === 1" @click="currentPage--">Anterior</button>
              <span>Página {{ dash(currentPage) }} de {{ dash(totalPages) }}</span>
              <button class="btn btn-secondary" :disabled="currentPage === totalPages"
                @click="currentPage++">Siguiente</button>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>

    <!-- Modal para mostrar seleccionados -->
    <b-modal v-model="isSelectedModalVisible" title="Resultados de la Búsqueda" hide-backdrop>
      <div v-for="(item, index) in selectedItemsData" :key="item.id"
        class="form-group d-flex justify-content-between align-items-center">
        <label>{{ dash(item.sucursale.nombre) }} - {{ dash(item.guia) }}</label>
        <button @click="removeItem(index)" class="btn btn-danger btn-sm">Eliminar</button>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" @click="collectSelected">Recoger</button>
        <button class="btn btn-secondary ml-2" @click="isSelectedModalVisible = false">Cancelar</button>
      </div>
    </b-modal>
  </div>
</template>


<script>
import { BCollapse, BModal } from 'bootstrap-vue';
import jsPDF from 'jspdf';
import EMSImage from '@/pages/sucursal/sucursales/sucursal/img/EMS.png';

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
      selectedSucursal: '',
      sucursales: [],
      filteredSucursales: [],
      apiUrl: 'solicitudes5',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/admin/solicitudesj/solicitudej/nuevo',
      url_editar: '/admin/solicitudescartero/solicitudecartero/editar/',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      collapseState: {},
      isModalVisible: false,
      isSelectedModalVisible: false,
      currentId: null,
      selected: {},
      selectedItemsData: [],
      user: {
        cartero: [],
      },
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredData() {
      const searchTerm = this.searchTerm.toLowerCase();
      const filtered = this.list.filter(item =>
        item.estado === 1 && (
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm)
          ) ||
          (item.sucursale && item.sucursale.nombre && item.sucursale.nombre.toLowerCase().includes(searchTerm)) ||
          (this.selectedSucursal && item.sucursale && item.sucursale.id === this.selectedSucursal)
        )
      ).sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Ordenar del más nuevo al más antiguo

      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return filtered.slice(start, end);
    },
    totalPages() {
      const totalItems = this.list.filter(item => item.estado === 1).length;
      return Math.ceil(totalItems / this.itemsPerPage);
    },
    hasSelectedItems() {
      return Object.keys(this.selected).some(key => this.selected[key]);
    }
  },
  methods: {
    reprintPDF(data) {
      const doc = new jsPDF('portrait', 'mm', 'letter');
    const fontSize = 10;
    doc.setFontSize(fontSize);
  
    const guia = data.guia || '';
    const codigoBarras = data.codigo_barras || '';
    const remitente = data.remitente || '';
    const telefono = data.telefono || '';
    const contenido = data.contenido || '';
    const destinatario = data.destinatario || '';
    const telefono_d = data.telefono_d || '';
    const direccion_especifica_d = data.direccion_especifica_d || '';
    const ciudad_d = data.ciudad || '';
    const zona_d = data.zona_d || '';
  
    const fecha = data.fecha || '';
    const fecha_entrega = data.fecha_d || '';
    const peso = data.peso_r || '';
    const importe = data.importe || '';
    const sucursal = data.sucursale || {};
    const tarifa = data.tarifa || {};
    const origen = sucursal.origen || '';
    const destino = tarifa.departamento || '';
  
    const direccion = data.direccion || {};
    const direccionEspecifica = direccion.direccion_especifica || '';
    const zona = direccion.zona || '';
    const ciudad = direccion.ciudad || '';
  
    let startX = 20;
    let startY = 10;
    let cellHeight = 10;
    let cellHeightFirma = 12;
    let cellHeightFirma2 = 15;
    let col1Width = 40;
    let col2Width = 40;
    let col3Width = 100;
  
    const drawGuide = (startX, startY) => {
      doc.setFontSize(fontSize);
      doc.rect(startX, startY, col1Width + col2Width, cellHeight * 3);
      doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight * 3);
  
      const barcodeX = startX + col1Width + col2Width + 5;
      const barcodeY = startY + 10;
      const barcodeWidth = 70;
      const barcodeHeight = 8;
  
      if (EMSImage) {
        doc.addImage(EMSImage, 'PNG', startX + 2, startY + 2, 30, 10);
      }
  
      if (codigoBarras !== '') {
        doc.addImage(codigoBarras, 'JPEG', barcodeX, barcodeY, barcodeWidth, barcodeHeight);
      }
  
      const textWidth = doc.getTextWidth(guia);
      const textX = barcodeX + (barcodeWidth - textWidth) / 2;
      doc.text(guia, textX, barcodeY - 3);
  
      startY += cellHeight * 2;
      doc.rect(startX, startY, col1Width + col2Width, cellHeight);
      doc.text(`Remitente y origen:  ${remitente}   ${origen},`, startX + 2, startY + 7);
  
      doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight);
      doc.text(`Destinatario y destino: ${destinatario}   ${destino}`, startX + col1Width + col2Width + 2, startY + 7);
  
      startY += cellHeight;
      doc.rect(startX, startY, col1Width + col2Width, cellHeight);
      doc.text(`Dirección: ${direccionEspecifica}`, startX + 2, startY + 4);
      doc.text(`Zona: ${zona}`, startX + 2, startY + 8);
  
      doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight);
      doc.text(`Direccion: ${direccion_especifica_d}`, startX + col1Width + col2Width + 2, startY + 4);
      doc.text(`Zona: ${zona_d}, Municipio: ${ciudad_d} `, startX + col1Width + col2Width + 2, startY + 8);
  
      startY += cellHeight;
      doc.rect(startX, startY, col1Width + col2Width, cellHeight);
      doc.text(`Telefono: ${telefono}`, startX + 2, startY + 7);
  
      doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight);
      doc.text(`Telefono: ${telefono_d}`, startX + col1Width + col2Width + 2, startY + 7);
  
      startY += cellHeight;
      doc.rect(startX, startY, col1Width + col2Width, cellHeight);
      doc.text(`Descripcion: ${contenido}`, startX + 2, startY + 7);
  
      doc.rect(startX + col1Width + col2Width, startY, col3Width / 2, cellHeight);
      doc.text(`Fecha: ${fecha}`, startX + col1Width + col2Width + 2, startY + 7);
  
      doc.rect(startX + col1Width + col2Width + col3Width / 2, startY, col3Width / 2, cellHeight);
      doc.text(`Fecha entrega: ${fecha_entrega}`, startX + col1Width + col2Width + col3Width / 2 + 2, startY + 7);
  
      startY += cellHeight;
      doc.rect(startX, startY, col1Width, cellHeightFirma);
      doc.text(`Contratos: ${importe}`, startX + 2, startY + 7);
  
      doc.rect(startX + col1Width, startY, col2Width, cellHeightFirma);
      doc.text(`Peso: ${peso}`, startX + col1Width + 2, startY + 7);
  
      doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeightFirma2);
      doc.text('Firma:', startX + col1Width + col2Width + 2, startY + 7);
  
      return startY + cellHeightFirma2; // Devuelve la nueva posición de Y después de la última fila
    };
  
    // Dibuja la primera guía y coloca la leyenda
    let lastY = drawGuide(startX, startY);
    doc.setFontSize(8);
    doc.text('Esta guia debe ir en la correspondencia rotulada', startX + 2, lastY + 1); // Añade la leyenda justo debajo
  
    // Dibuja la segunda guía y coloca la leyenda
    lastY = drawGuide(startX, startY + 90);
    doc.setFontSize(8);
    doc.text('Copia de guia', startX + 2, lastY + 1); // Añade la leyenda justo debajo
  
    // Dibuja la tercera guía y coloca la leyenda
    lastY = drawGuide(startX, startY + 180);
    doc.setFontSize(8);
    doc.text('Copia de guia', startX + 2, lastY + 1); // Añade la leyenda justo debajo
  
    doc.save(`Solicitud-${guia}.pdf`);
  },

    async markAsEnCamino(solicitudeId) {
      this.load = true;
      try {
        const carteroId = this.user.user.id;
        const response = await this.$encargados.$put(`solicitudesrecojo/${solicitudeId}`, { cartero_recogida_id: carteroId });
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
      const res = await this.$encargados.$get(path);
      this.list = res;
      this.filteredSucursales = this.getUniqueSucursales(this.list.filter(item => item.estado === 1));
    },
    getUniqueSucursales(data) {
      const uniqueSucursales = [];
      const sucursalIds = new Set();
      data.forEach(item => {
        if (item.sucursale && !sucursalIds.has(item.sucursale.id)) {
          uniqueSucursales.push(item.sucursale);
          sucursalIds.add(item.sucursale.id);
        }
      });
      return uniqueSucursales;
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
        const carteroId = this.user.user.id;
        const item = this.list.find(m => m.id === id);
        if (item) {
          const response = await this.$encargados.$put(`solicitudesentrega/${id}`, { cartero_entrega_id: carteroId, peso_v: item.peso_v });
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
    openSelectedModal() {
      this.isSelectedModalVisible = true;
    },
    async collectSelected() {
      this.load = true;
      try {
        const carteroId = this.user.user.id;
        for (let item of this.selectedItemsData) {
          await this.$encargados.$put(`marcarrecogido/${item.id}`, { cartero_recogida_id: carteroId });
        }
        await this.GET_DATA(this.apiUrl); // Forzar actualización de la lista
        this.$swal.fire({
          icon: 'success',
          title: 'Recogido',
          text: 'Todos los elementos seleccionados han sido recogidos.',
        });
        this.isSelectedModalVisible = false;
        this.selected = {}; // Limpiar la selección después de recoger
      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al recoger los elementos seleccionados.',
        });
      } finally {
        this.load = false;
      }
    },
    handleSearchEnter() {
      if (this.selectedSucursal) {
        this.selectedItemsData = this.list.filter(item => item.estado === 1 && item.sucursale && item.sucursale.id === this.selectedSucursal).map(item => ({
          id: item.id,
          guia: item.guia,
          sucursale: item.sucursale
        }));
        if (this.selectedItemsData.length > 0) {
          this.openSelectedModal();
        }
      }
    },
    handleSucursalChange() {
      if (this.selectedSucursal) {
        this.selectedItemsData = this.list.filter(item => item.estado === 1 && item.sucursale && item.sucursale.id === this.selectedSucursal).map(item => ({
          id: item.id,
          guia: item.guia,
          sucursale: item.sucursale
        }));
        if (this.selectedItemsData.length > 0) {
          this.openSelectedModal();
        }
      }
    },
    filterBySucursal() {
      const selectedSucursalId = this.selectedSucursal;
      this.filteredData = this.list.filter(item =>
        item.estado === 1 && item.sucursale && (item.sucursale.id === selectedSucursalId)
      );
    },
    selectAll(event) {
      const isChecked = event.target.checked;
      this.filteredData.forEach(item => {
        this.$set(this.selected, item.id, isChecked);
      });
    },
    removeItem(index) {
      this.selectedItemsData.splice(index, 1);
    },
    toggleCollapse(estado) {
      this.$set(this.collapseState, estado, !this.collapseState[estado]);
    },
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
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
        const sucursales = await this.$encargados.$get('sucursales');
        this.sucursales = sucursales;
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

