<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-3" v-if="hasSelectedItems">
            <button @click="markSelectedAsVerified" class="btn btn-success btn-sm w-100">
              <i class="fas fa-check"></i> Devolver a Origen 
            </button>
          </div>
          <div class="col-3" v-if="hasSelectedItems">
            <button @click="openReencaminarModal" class="btn btn-warning btn-sm w-100">
              <i class="fas fa-redo-alt"></i> Reencaminar 
            </button>
          </div>



          <div class="col-3">
            <input v-model="searchTerm" type="text" class="form-control" placeholder="Buscar..." />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                Verificar return
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">
                          <input type="checkbox" @change="selectAll($event, paginatedData)" />
                        </th>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>

                        <th class="py-0 px-1">Guia</th>
                        <th class="py-0 px-1">Peso Empresa (Kg)</th>
                        <th class="py-0 px-1">Peso Correos (Kg)</th>
                        <th class="py-0 px-1">Remitente</th>
                        <th class="py-0 px-1">Observación</th>
                        <th class="py-0 px-1">Foto</th>
                        <th class="py-0 px-1">Detalles de Domicilio</th>

                        <!-- Nueva columna para la dirección específica -->
                        <th class="py-0 px-1">Zona</th> <!-- Nueva columna para la zona -->
                        <th class="py-0 px-1">Dirección maps</th>
                        <th class="py-0 px-1">Teléfono</th>
                        <th class="py-0 px-1">Contenido</th>
                        <th class="py-0 px-1">Fecha</th>
                        <th class="py-0 px-1">Destinatario</th>
                        <th class="py-0 px-1">Teléfono D</th>
                        <th class="py-0 px-1">Dirección Destinatario</th>
                        <th class="py-0 px-1">Municipio/Provincia</th>
                        <th class="py-0 px-1">Detalles domoicilio destinatario</th>
                        <th class="py-0 px-1">zona destinatario</th>

                        <th class="py-0 px-1">Fecha Destinatario</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedData" :key="m.id">
                        <td class="py-0 px-1">
                          <input type="checkbox" v-model="selected[m.id]" />
                        </td>
                        <td class="py-0 px-1">{{ i + 1 + (currentPage - 1) * itemsPerPage }}</td>
<td class="p-1">
  {{ m?.sucursale?.nombre ?? ( (m?.tipo_correspondencia ?? '').toUpperCase() === 'EMS' ? 'EMS GLOBAL' : 'NULL' ) }}
</td>

                        <td class="py-0 px-1">{{ (m.guia ?? '-') }}</td>
                        <td class="py-0 px-1">{{ (m.peso_o ?? '-') }}</td>
                        <td class="py-0 px-1">{{ (m.peso_v ?? '-') }}</td>
                        <td class="py-0 px-1">{{ (m.remitente ?? '-') }}</td>
                        <td class="py-0 px-1">{{ (m.observacion ?? '-') }}</td>
                        <td class="py-0 px-1">
                          <div class="d-flex flex-column align-items-center">
                            <button v-if="m.imagen" @click="downloadImage(m.imagen)"
                              class="btn btn-sm btn-primary mt-1 align-self-start">
                              Descargar
                            </button>
                          </div>
                        </td>
                      <td class="py-0 px-1">{{ m?.direccion?.direccion_especifica ?? 'NULL' }}</td>

<td class="py-0 px-1">{{ m?.direccion?.zona ?? 'NULL' }}</td>

<td class="py-0 px-1">
  <a
    v-if="m?.direccion?.direccion && isCoordinates(m.direccion.direccion)"
    :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion.direccion"
    target="_blank"
    class="btn btn-primary btn-sm"
  >
    Ver mapa
  </a>
  <span v-else>{{ m?.direccion?.direccion ?? 'NULL' }}</span>
</td>

                        <td class="py-0 px-1">{{ (m.telefono ?? '-') }}</td>
                        <td class="py-0 px-1">{{ (m.contenido ?? '-') }}</td>
                        <td class="py-0 px-1">{{ (m.fecha ?? '-') }}</td>

                        <td class="py-0 px-1">{{ (m.destinatario ?? '-') }}</td>
                        <td class="py-0 px-1">{{ (m.telefono_d ?? '-') }}</td>
                        <td class="py-0 px-1">
                          <a v-if="isCoordinates(m.direccion_d)"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d" target="_blank"
                            class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ (m.direccion_d ?? '-') }}</span>
                        </td>
                        <td class="py-0 px-1">{{ (m.ciudad ?? '-') }}</td>
                        <td class="py-0 px-1">{{ (m.direccion_especifica_d ?? '-') }}</td>
                        <td class="py-0 px-1">{{ (m.zona_d ?? '-') }}</td>


                        <td class="py-0 px-1">{{ (m.fecha_d ?? '-') }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <b-modal id="reencaminarModal" ref="reencaminarModal" title="Reencaminar" @ok="confirmReencaminar">
              <div v-for="(solicitud, index) in selectedItemsData" :key="solicitud.id" class="form-group">
                <!-- Mostrar el número de guía -->
                <p><strong>Solicitud {{ index + 1 }}: </strong>Guía {{ (solicitud.guia ?? '-') }}</p>

                <!-- Seleccionar el destino de reencaminamiento -->
                <label for="reencaminarSelect">Seleccione el destino de reencaminamiento:</label>
                <select v-model="solicitud.reencaminamiento" class="form-control" id="reencaminarSelect">
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
            </b-modal>


            <div class="d-flex justify-content-between align-items-center mt-3">
              <button class="btn btn-secondary" :disabled="currentPage === 1" @click="prevPage">Anterior</button>
              <span>Página {{ (currentPage ?? '-') }} de {{ (totalPages ?? '-') }}</span>
              <button class="btn btn-secondary" :disabled="currentPage === totalPages"
                @click="nextPage">Siguiente</button>
            </div>
            <div class="pagination-controls">
              <ul class="pagination">
                <li :class="['page-item', { active: currentPage === pageNumber }]" v-for="pageNumber in totalPagesArray"
                  :key="pageNumber">
                  <button class="page-link" @click="goToPage(pageNumber)">{{ (pageNumber ?? '-') }}</button>
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
      apiUrl: 'solicitudes5',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/admin/solicitudesj/solicitudej/nuevo',
      url_editar: '/admin/solicitudescartero/solicitudecartero/editar/',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      collapseState: {},
      isModalVisible: false,
      currentId: null,
      selected: {},
      selectedItemsData: [],
      user: {
        cartero: []
      },
      currentPage: 1,
      itemsPerPage: 10,
      pesoReencaminar: 0,          // Campo para el peso de reencaminamiento
      selectedReencaminar: null,    // Campo para seleccionar el destino de reencaminamiento
      selected: {},
      selectedItemsData: [], // Aquí guardamos los datos de las solicitudes seleccionadas
    };
  },
  computed: {
   filteredData() {
  const searchTerm = (this.searchTerm || '').toLowerCase();

  // ✅ estados que quieres ver (ajusta si necesitas más)
  const estadosPermitidos = [11]; // ejemplo: return
  // si quieres ver varios: const estadosPermitidos = [11, 10, 5, 13];

  return (this.list || [])
    .filter(item => {
      const estadoOk = estadosPermitidos.includes(item?.estado);

      // ✅ EMS GLOBAL: sucursale_id y tarifa_id null
      const esEMS = (item?.tipo_correspondencia ?? '').toUpperCase() === 'EMS';
      const esEMSGlobal =
        esEMS &&
        (item?.sucursale_id === null || item?.sucursale_id === undefined) &&
        (item?.tarifa_id === null || item?.tarifa_id === undefined);

      // ✅ contratos normales (con sucursal) o EMS global
      const visible = (item?.sucursale != null) || esEMSGlobal;

      // ✅ búsqueda segura (no revienta con null)
      const coincideBusqueda =
        String(item?.guia ?? '').toLowerCase().includes(searchTerm) ||
        String(item?.remitente ?? '').toLowerCase().includes(searchTerm) ||
        String(item?.destinatario ?? '').toLowerCase().includes(searchTerm) ||
        String(item?.telefono ?? '').toLowerCase().includes(searchTerm) ||
        String(item?.telefono_d ?? '').toLowerCase().includes(searchTerm) ||
        String(item?.contenido ?? '').toLowerCase().includes(searchTerm) ||
        String(item?.ciudad ?? '').toLowerCase().includes(searchTerm) ||
        String(item?.zona_d ?? '').toLowerCase().includes(searchTerm) ||
        String(item?.direccion_especifica_d ?? '').toLowerCase().includes(searchTerm) ||
        String(item?.sucursale?.nombre ?? '').toLowerCase().includes(searchTerm) ||
        String(item?.direccion?.direccion ?? '').toLowerCase().includes(searchTerm) ||
        String(item?.direccion?.zona ?? '').toLowerCase().includes(searchTerm) ||
        String(item?.direccion?.direccion_especifica ?? '').toLowerCase().includes(searchTerm);

      return estadoOk && visible && coincideBusqueda;
    });
},


    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    totalPagesArray() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    },
    hasSelectedItems() {
      return Object.keys(this.selected).some(key => this.selected[key]);
    }
  },
  methods: {
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

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
    goToPage(pageNumber) {
      this.currentPage = pageNumber;
    },
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    async GET_DATA(path) {
      try {
        const res = await this.$encargados.$get(path);
        if (Array.isArray(res)) {
          this.list = res;
        } else {
          console.error('Los datos recuperados no son un array:', res);
        }
      } catch (e) {
        console.error('Error al obtener los datos:', e);
      }
    },




    openReencaminarModal() {
      // Limpiar la lista de datos seleccionados
      this.selectedItemsData = [];

      // Agregar las solicitudes seleccionadas a selectedItemsData
      const selectedIds = Object.keys(this.selected).filter(key => this.selected[key]);
      this.selectedItemsData = this.list.filter(item => selectedIds.includes(item.id.toString()));

      // Mostrar el modal
      this.$refs.reencaminarModal.show();
    },


    async confirmReencaminar() {
      this.load = true;
      try {
        // Verificar que haya ítems seleccionados y un destino de reencaminamiento
        if (this.selectedItemsData.length > 0) {
          for (let solicitud of this.selectedItemsData) {
            // Enviar cada solicitud con su nuevo destino y peso
            await this.$encargados.$put(`reencaminar5/${solicitud.id}`, {
              reencaminamiento: solicitud.reencaminamiento,
              peso_reencaminar: solicitud.peso_reencaminar
            });
          }

          await this.GET_DATA(this.apiUrl); // Actualiza la lista después de reencaminar
          this.$swal.fire({
            icon: 'success',
            title: 'Solicitudes reencaminadas',
            text: 'Las solicitudes seleccionadas han sido reencaminadas con éxito.',
          });
          this.selected = {}; // Limpiar la selección
        } else {
          this.$swal.fire({
            icon: 'warning',
            title: 'Selecciona solicitudes',
            text: 'Por favor selecciona solicitudes para reencaminar.',
          });
        }
      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al reencaminar las solicitudes.',
        });
      } finally {
        this.load = false;
      }
    },

    async markSelectedAsVerified() {
      this.load = true;
      try {
        const selectedIds = Object.keys(this.selected).filter(key => this.selected[key]);
        for (let id of selectedIds) {
          await this.$encargados.$put(`verificarreturn5/${id}`);
        }
        await this.GET_DATA(this.apiUrl); // Forzar actualización de la lista
        this.$swal.fire({
          icon: 'success',
          title: 'Solicitudes verificadas',
          text: 'Todas las solicitudes seleccionadas han sido marcadas como verificadas.',
        });
        this.selected = {}; // Limpiar la selección después de verificar
      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al verificar las solicitudes.',
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
