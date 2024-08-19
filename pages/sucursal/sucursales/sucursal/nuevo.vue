<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-center">
          <div class="col-md-8 col-12">
            <div class="card">
              <div class="card-header">
                <h3>Agregar Solicitud</h3>
              </div>

              <div class="card-body">
                <div class="form-group col-12">
                  <h4>Remitente</h4>
                </div>
                <CrudCreate2 :model="model" :apiUrl="apiUrl" @success="onSuccess">
                  <div slot="body" class="row">
                    <div class="form-group col-12">
                      <label for="sucursal">Sucursal</label>
                      <input type="text" id="sucursal" class="form-control" v-model="model.sucursale_nombre" disabled>
                    </div>
                    <div class="form-group col-12">
                      <label for="remitente">Remitente</label>
                      <input type="text" v-model.trim="model.remitente" class="form-control" id="remitente">
                    </div>

                    <div class="form-group col-12">
                      <label for="telefono">Teléfono</label>
                      <input type="text" v-model.trim="model.telefono" class="form-control" id="telefono">
                    </div>
                    <div class="form-group col-12">
                      <label for="contenido">Contenido</label>
                      <input type="text" v-model.trim="model.contenido" class="form-control" id="contenido">
                    </div>
                  

                    <div class="form-group col-12">
                      <label for="tarifas">Destino y servicio</label>
                      <v-select :options="tarifas" v-model="model.tarifa_id" label="departamento"
                        :reduce="tarifa => tarifa.id" placeholder="Buscar departamento...">
                        <template #option="option">
                          <div>
                            {{ option.departamento }} - {{ option.servicio }}
                          </div>
                        </template>
                        <template #selected-option="option">
                          <div>
                            {{ option.departamento }} - {{ option.servicio }}
                          </div>
                        </template>
                      </v-select>
                    </div>
                    <div class="form-group col-12">
                      <label for="direccion">Dirección de recojo</label>
                      <v-select :options="direcciones" v-model="model.direccion_id" label="direccion"
                        :reduce="direccion => direccion.id" placeholder="Seleccionar dirección...">
                        <template #option="option">
                          <div>
                            {{ option.nombre }}
                          </div>
                        </template>
                        <template #selected-option="option">
                          <div>
                            {{ option.nombre }}
                          </div>
                        </template>
                      </v-select>

                      <!-- Botón para agregar nueva dirección dentro del mismo div -->
                      <button @click="redirectToAddNewAddress" class="btn btn-primary btn-sm mt-2">
                        Agregar nueva dirección de recogida
                      </button>
                    </div>

                    <div class="form-group col-12">
                      <label for="peso_o">Peso (Medido en Kilogramos)</label>
                      <input type="number" v-model.number="model.peso_o" class="form-control" id="peso_o" step="0.001"
                        @input="limitDecimals">
                    </div>


                    <div class="form-group col-12">
                      <label for="precios">Precio Estimado</label>
                      <input type="text" id="precios" class="form-control" :value="precioSeleccionado" disabled>
                    </div>
                   

                  

                    <div class="form-group col-12">
                      <h4>Destinatario</h4>
                    </div>

                    <div class="form-group col-12">
                      <label for="destinatario">Destinatario</label>
                      <input type="text" v-model.trim="model.destinatario" class="form-control" id="destinatario"
                        @input="showSuggestions" @blur="hideSuggestions">
                      <ul v-if="suggestions.length" class="suggestions-list">
                        <li v-for="suggestion in suggestions" @click="applyFrequentAddress(suggestion)">
                          {{ suggestion.destinatario }}
                        </li>
                      </ul>
                    </div>







                    <div class="form-group col-12">
                      <label for="telefono_d">Teléfono Destinatario</label>
                      <input type="text" v-model.trim="model.telefono_d" class="form-control" id="telefono_d">
                    </div>
                    <div class="form-group col-12">
                      <label for="direccion_d">Dirección Destino Maps</label>
                      <input type="text" id="direccion_d" class="form-control" @click="openModal('direccion_d')"
                        v-model="model.direccion_d" readonly :disabled="isDireccionDFieldDisabled">
                    </div>


                    <div class="form-group col-12">
                      <label for="direccion_d">Dirección</label>
                      <input type="text" v-model.trim="model.direccion_especifica_d" class="form-control"
                        id="direccion_especifica_d">
                    </div>
                    <div class="form-group col-12">
                      <label for="zona_d">Zona Destinatario</label>
                      <input type="text" v-model.trim="model.zona_d" class="form-control" id="zona_d">
                    </div>
                    <div class="form-group col-12">
                      <label for="ciudad">Provincia</label>
                      <input type="text" v-model.trim="model.ciudad" class="form-control" id="ciudad">
                    </div>
                    <div class="form-group col-12">
                      <label for="fecha">Inicio Fecha</label>
                      <input type="text" v-model="model.fecha" class="form-control" id="fecha" disabled>
                    </div>
                    <button type="button" class="btn btn-primary" @click="saveFrequentAddress(); createRequest()">Crear
                      Envio
                      Frecuente</button>
                  </div>
                </CrudCreate2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>
    <!-- Modal for Leaflet Map -->
    <b-modal ref="mapsModal" title="Seleccionar Dirección" @ok="handleOk" size="lg">
      <div>
        <div class="input-group mb-2">
          <input type="text" v-model="searchQuery" @keyup.enter="searchLocation" placeholder="Buscar dirección"
            class="form-control" />
          <div class="input-group-append">
            <button class="btn btn-primary" type="button" @click="searchLocation">Buscar</button>
          </div>
        </div>
        <div v-if="searching" class="overlay">
          <div class="alert alert-info" role="alert">
            Buscando ubicación...
          </div>
        </div>
        <div id="map" style="height: 500px; width: 100%;"></div>
      </div>
      <div class="coordinates mt-2">
        <p>Latitud: {{ currentLat }}</p>
        <p>Longitud: {{ currentLng }}</p>
      </div>
    </b-modal>

    <b-modal ref="mapsModalD" title="Seleccionar Dirección Destino" @ok="handleOkD" size="lg">
      <div>
        <div class="input-group mb-2">
          <input type="text" v-model="searchQuery_d" @keyup.enter="searchLocationD" placeholder="Buscar dirección"
            class="form-control" />
          <div class="input-group-append">
            <button class="btn btn-primary" type="button" @click="searchLocationD">Buscar</button>
          </div>
        </div>
        <div v-if="searching_d" class="overlay">
          <div class="alert alert-info" role="alert">
            Buscando ubicación...
          </div>
        </div>
        <div id="map_d" style="height: 500px; width: 100%;"></div>
      </div>
      <div class="coordinates mt-2">
        <p>Latitud: {{ currentLat_d }}</p>
        <p>Longitud: {{ currentLng_d }}</p>
      </div>
    </b-modal>
  </div>
</template>

<script>
import moment from 'moment-timezone';
import SignaturePad from 'signature_pad';
import { BModal } from 'bootstrap-vue';
import 'leaflet/dist/leaflet.css';
import 'vue-select/dist/vue-select.css';
import vSelect from 'vue-select';
import Swal from 'sweetalert2';

export default {
  components: {
    vSelect,
    BModal
  },
  data() {
    return {
      url_nuevo: '/sucursal/direcciones/direccione/nuevo',

      model: {
        direccion_id: null,
        tipo_servicio: 'servicio',
        sucursale_id: '',
        tarifa_id: '',
        sucursale_nombre: '',
        cartero_id: null,
        guia: '',
        peso_o: '',
        peso_v: '',
        remitente: '',
        direccion: '',
        direccion_lat: '',
        direccion_lng: '',
        telefono: '',
        contenido: '',
        fecha: '',
        firma_o: '',
        destinatario: '',
        direccion_especifica_d: '',
        direccion_especifica: '',
        telefono_d: '',
        direccion_d: '',
        direccion_d_lat: '',
        direccion_d_lng: '',
        ciudad: '',
        firma_d: '',
        nombre_d: '',
        ci_d: '',
        fecha_d: '',
        direccion_d_lat_lng: '',  // Nuevo campo para mostrar latitud y longitud concatenadas
        estado: '',
      },
      apiUrl: 'solicitudes2',
      page: 'solicitudes',
      modulo: 'AGBC',
      load: true,
      sucursales: [],
      tarifas: [],
      sucursale_id_logueada: '',
      ini_vigencia: '',
      fin_vigencia: '',
      map: null,
      marker: null,
      selectedAddress: '',
      currentLat: null,
      currentLng: null,
      searchQuery: '',
      searching: false,
      map_d: null,
      marker_d: null,
      selectedAddress_d: '',
      currentLat_d: null,
      currentLng_d: null,
      searchQuery_d: '',
      searching_d: false,
      direcciones: [],
      suggestions: []  // Almacena las sugerencias para autocompletar
    }
  },
  computed: {
    isDireccionFieldDisabled() {
      return !!this.model.direccion;
    },
    isLatLngFieldDisabled() {
      return !!this.currentLat && !!this.currentLng;
    },
    isDireccionDFieldDisabled() {
      return !!this.model.direccion_d;
    },
    isLatLngDFieldDisabled() {
      return !!this.currentLat_d && !!this.currentLng_d;
    },
    precioSeleccionado() {
      const tarifa = this.tarifas.find(t => t.id === this.model.tarifa_id);
      if (tarifa) {
        const basePrice = tarifa.precio ? parseFloat(tarifa.precio) : 0;
        const extraPrice = tarifa.precio_extra ? parseFloat(tarifa.precio_extra) : 0;

        const peso = parseFloat(this.model.peso_o);
        if (isNaN(peso)) {
          return '';
        }
        if (peso > 1) {
          const pesoAdicional = Math.ceil(peso - 1);
          return basePrice + pesoAdicional * extraPrice;
        } else {
          return basePrice;
        }
      }
      return '';
    }
  },
  methods: {
    redirectToAddNewAddress() {
      this.$router.push(this.url_nuevo);
    },
    async fetchDirecciones() {
      try {
        const direcciones = await this.GET_DATA('direcciones', { sucursale_id: this.sucursale_id_logueada });
        this.direcciones = direcciones;
      } catch (e) {
        console.error('Error al obtener las direcciones:', e);
      }
    },

    generateGuideNumber() {
      const timestamp = Date.now();
      return `GUID-${timestamp}`;
    },

    async createRequest() {
      this.model.guia = this.generateGuideNumber();

      // Verificar si los datos están correctamente asignados
      console.log('Datos del destinatario:', this.model);

      try {
        const response = await this.$sucursales.$post(this.apiUrl, this.model);
        console.log('Respuesta de la API:', response); // Verificar la respuesta de la API
        this.onSuccess(response);
      } catch (error) {
        console.error('Error al crear la solicitud:', error);
        this.showSuccessAlert();
      }
    },


    onSuccess(response) {
      this.showSuccessAlert();
    },

    showSuccessAlert() {
      Swal.fire({
        icon: 'success',
        title: 'Solicitud creada con éxito',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        this.$router.go(-1);
      });
    },

    limitDecimals(event) {
      let value = parseFloat(event.target.value);

      if (isNaN(value)) {
        this.model.peso_o = '';
      } else if (value > 25.000) {
        this.model.peso_o = 25.000.toFixed(3);
      } else {
        this.model.peso_o = value.toFixed(3);
      }
    },

    async GET_DATA(path, params = {}) {
      const res = await this.$sucursales.$get(path, { params });
      return res;
    },

    openModal(type) {
      if (process.client) {
        if (type === 'direccion') {
          this.$refs.mapsModal.show();
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords;
              this.currentLat = latitude;
              this.currentLng = longitude;
              this.$nextTick(() => {
                this.initializeMap(latitude, longitude);
              });
            }, () => {
              this.currentLat = -16.290154;
              this.currentLng = -63.588653;
              this.$nextTick(() => {
                this.initializeMap(-16.290154, -63.588653);
              });
            });
          } else {
            this.currentLat = -16.290154;
            this.currentLng = -63.588653;
            this.$nextTick(() => {
              this.initializeMap(-16.290154, -63.588653);
            });
          }
        } else if (type === 'direccion_d') {
          this.$refs.mapsModalD.show();
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords;
              this.currentLat_d = latitude;
              this.currentLng_d = longitude;
              this.$nextTick(() => {
                this.initializeMapD(latitude, longitude);
              });
            }, () => {
              this.currentLat_d = -16.290154;
              this.currentLng_d = -63.588653;
              this.$nextTick(() => {
                this.initializeMapD(-16.290154, -63.588653);
              });
            });
          } else {
            this.currentLat_d = -16.290154;
            this.currentLng_d = -63.588653;
            this.$nextTick(() => {
              this.initializeMapD(-16.290154, -63.588653);
            });
          }
        }
      }
    },

    initializeMap(lat, lng) {
      if (this.map) {
        this.map.remove();
      }

      if (process.client) {
        import('leaflet').then(L => {
          this.map = L.map('map').setView([lat, lng], 14);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(this.map);

          this.marker = L.marker([lat, lng], {
            draggable: true
          }).addTo(this.map);

          this.map.on('click', (e) => {
            this.marker.setLatLng(e.latlng);
            this.geocodePosition(e.latlng);
          });

          this.marker.on('dragend', (e) => {
            this.geocodePosition(e.target.getLatLng());
          });
        });
      }
    },

    initializeMapD(lat, lng) {
      if (this.map_d) {
        this.map_d.remove();
      }

      if (process.client) {
        import('leaflet').then(L => {
          this.map_d = L.map('map_d').setView([lat, lng], 14);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(this.map_d);

          this.marker_d = L.marker([lat, lng], {
            draggable: true
          }).addTo(this.map_d);

          this.map_d.on('click', (e) => {
            this.marker_d.setLatLng(e.latlng);
            this.geocodePositionD(e.latlng);
          });

          this.marker_d.on('dragend', (e) => {
            this.geocodePositionD(e.target.getLatLng());
          });
        });
      }
    },

    async geocodePosition(latlng) {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`);
      const data = await response.json();
      if (data && data.display_name) {
        this.selectedAddress = data.display_name;
      } else {
        this.selectedAddress = 'No se pudo determinar la dirección';
      }
      this.currentLat = latlng.lat;
      this.currentLng = latlng.lng;
      this.searching = false;
    },

    async geocodePositionD(latlng) {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`);
      const data = await response.json();
      if (data && data.display_name) {
        this.selectedAddress_d = data.display_name;
      } else {
        this.selectedAddress_d = 'No se pudo determinar la dirección';
      }
      this.currentLat_d = latlng.lat;
      this.currentLng_d = latlng.lng;
      this.searching_d = false;
    },

    handleOk() {
      this.model.direccion_lat = this.currentLat;
      this.model.direccion_lng = this.currentLng;
      this.model.direccion = this.currentLat + ', ' + this.currentLng;
    },

    handleOkD() {
      this.model.direccion_d_lat = this.currentLat_d;
      this.model.direccion_d_lng = this.currentLng_d;

      // Asigna el valor concatenado directamente a direccion_d
      this.model.direccion_d = `${this.currentLat_d}, ${this.currentLng_d}`;

      // No necesitas el campo direccion_d_lat_lng
      // this.model.direccion_d_lat_lng = `${this.currentLat_d}, ${this.currentLng_d}`;
    },


    async searchLocation() {
      if (this.searchQuery && this.currentLat && this.currentLng) {
        this.searching = true;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${this.searchQuery}&limit=5&viewbox=${this.currentLng - 0.1},${this.currentLat + 0.1},${this.currentLng + 0.1},${this.currentLat - 0.1}`);
        const data = await response.json();
        if (data.length > 0) {
          const closestMatch = data[0];
          const { lat, lon } = closestMatch;
          this.map.setView([lat, lon], 14);
          this.marker.setLatLng([lat, lon]);
          this.geocodePosition({ lat, lng: lon });
        }
        this.searching = false;
      }
    },

    async searchLocationD() {
      if (this.searchQuery_d && this.currentLat_d && this.currentLng_d) {
        this.searching_d = true;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${this.searchQuery_d}&limit=5&viewbox=${this.currentLng_d - 0.1},${this.currentLat_d + 0.1},${this.currentLng_d + 0.1},${this.currentLat_d - 0.1}`);
        const data = await response.json();
        if (data.length > 0) {
          const closestMatch = data[0];
          const { lat, lon } = closestMatch;
          this.map_d.setView([lat, lon], 14);
          this.marker_d.setLatLng([lat, lon]);
          this.geocodePositionD({ lat, lng: lon });
        }
        this.searching_d = false;
      }
    },

    async fetchUser() {
      let user = JSON.parse(localStorage.getItem('userAuth'));
      if (user && user.user) {
        this.model.sucursale_id = user.user.id;
        this.model.sucursale_nombre = user.user.nombre;
        this.sucursale_id_logueada = user.user.id;
      }
    },

    saveFrequentAddress() {
      let frequentAddresses = JSON.parse(localStorage.getItem('frequentAddresses')) || [];

      // Verifica si ya existe una dirección con el mismo nombre
      const exists = frequentAddresses.some(address => address.destinatario.toLowerCase() === this.model.destinatario.toLowerCase());

      if (!exists) {
        const newAddress = {
          destinatario: this.model.destinatario,
          telefono_d: this.model.telefono_d,
          direccion_especifica_d: this.model.direccion_especifica_d,
          direccion_d_lat: this.model.direccion_d_lat,
          direccion_d_lng: this.model.direccion_d_lng,
          zona_d: this.model.zona_d,
          ciudad: this.model.ciudad,
        };

        frequentAddresses.push(newAddress);
        localStorage.setItem('frequentAddresses', JSON.stringify(frequentAddresses));

        Swal.fire({
          icon: 'success',
          title: 'Dirección guardada como frecuente',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: 'La dirección ya está guardada',
          showConfirmButton: false,
          timer: 1500
        });
      }
    },

    loadFrequentAddresses(query) {
      const frequentAddresses = JSON.parse(localStorage.getItem('frequentAddresses')) || [];
      return frequentAddresses.filter(address => address.destinatario.toLowerCase().includes(query.toLowerCase()));
    },

    applyFrequentAddress(address) {
      this.model.destinatario = address.destinatario;
      this.model.telefono_d = address.telefono_d;
      this.model.direccion_especifica_d = address.direccion_especifica_d;
      this.model.direccion_d_lat = address.direccion_d_lat;
      this.model.direccion_d_lng = address.direccion_d_lng;
      this.model.zona_d = address.zona_d;
      this.model.ciudad = address.ciudad;

      // Asegúrate de que el campo Dirección Destino Maps se llene correctamente en direccion_d
      this.model.direccion_d = `${address.direccion_d_lat}, ${address.direccion_d_lng}`;
    },

    showSuggestions() {
      if (this.model.destinatario) {
        this.suggestions = this.loadFrequentAddresses(this.model.destinatario);
      } else {
        this.suggestions = [];
      }
    },
    hideSuggestions() {
      setTimeout(() => {
        this.suggestions = [];
      }, 200); // Añade un pequeño retraso para permitir el clic en las sugerencias
    }
  },

  mounted() {
    this.$nextTick(async () => {
      await this.fetchUser();
      await this.fetchDirecciones();

      try {
        const sucursales = await this.GET_DATA('sucursales2');
        this.sucursales = sucursales;

        const tarifas = await this.GET_DATA('getTarifas2', { sucursale_id: this.sucursale_id_logueada });
        this.tarifas = tarifas;
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }

      const now = moment().tz("America/La_Paz");
      this.model.fecha = now.format('YYYY-MM-DD HH:mm:ss');

      var canvas = document.getElementById('canvas');
      var signaturePad = new SignaturePad(canvas);
      var clearButton = document.getElementById('limpiar');
      var generateButton = document.getElementById('guardar');
      clearButton.addEventListener('click', () => {
        signaturePad.clear();
        this.model.firma_o = "";
      });

      generateButton.addEventListener('click', () => {
        var firma = signaturePad.toDataURL();
        this.model.firma_o = firma;
      });

      var canvas2 = document.getElementById('canvas2');
      var signaturePad2 = new SignaturePad(canvas2);
      var clearButton2 = document.getElementById('limpiar2');
      var generateButton2 = document.getElementById('guardar2');
      clearButton2.addEventListener('click', () => {
        signaturePad2.clear();
        this.model.firma_d = "";
      });

      generateButton2.addEventListener('click', () => {
        var firma2 = signaturePad2.toDataURL();
        this.model.firma_d = firma2;
      });
    });
  },
}
</script>

<style scoped>
.btn-canvas {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.coordinates {
  text-align: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.alert {
  text-align: center;
}

.table-responsive {
  overflow-x: auto;
}

.table thead th {
  white-space: nowrap;
}

.table tbody td {
  white-space: nowrap;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ddd;
  max-height: 150px;
  overflow-y: auto;
  position: absolute;
  background-color: #fff;
  z-index: 1000;
  width: 100%;
}

.suggestions-list li {
  padding: 8px;
  cursor: pointer;
}

.suggestions-list li:hover {
  background-color: #f0f0f0;
}

@media (max-width: 768px) {
  .card {
    margin-bottom: 1rem;
  }

  .form-group label {
    font-size: 0.9rem;
  }

  .form-control {
    font-size: 0.9rem;
  }

  .btn {
    font-size: 0.9rem;
  }

  .table-responsive {
    margin-bottom: 1rem;
  }
}
</style>
