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
                <CrudCreate :model="model" :apiUrl="apiUrl" @success="onSuccess">
                  <div slot="body" class="row">
                    <div class="form-group col-12">
                      <label for="sucursal">Sucursal</label>
                      <select id="sucursal" class="form-control" v-model="model.sucursale_id" disabled>
                        <option v-for="m in sucursales" :key="m.id" :value="m.id">{{ m.nombre }}</option>
                      </select>
                    </div>
                    <div class="form-group col-12">
                      <label for="guia">Numero de Guia</label>
                      <input type="text" v-model.trim="model.guia" class="form-control" id="guia">
                    </div>
                    <div class="form-group col-12">
                      <label for="peso_o">Peso (Medido en Kilogramos)</label>
                      <input type="text" v-model.trim="model.peso_o" class="form-control" id="peso_o">
                    </div>
                    <div class="form-group col-12">
                      <label for="remitente">Remitente</label>
                      <input type="text" v-model.trim="model.remitente" class="form-control" id="remitente">
                    </div>
                    <div class="form-group col-12">
                      <label for="direccion">Dirección</label>
                      <input type="text" id="direccion" class="form-control" @click="openModal('direccion')" :value="currentLat && currentLng ? currentLat + ', ' + currentLng : ''" readonly>
                      <input type="hidden" v-model="model.direccion_lat">
                      <input type="hidden" v-model="model.direccion_lng">
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
                      <label for="destinatario">Destinatario</label>
                      <input type="text" v-model.trim="model.destinatario" class="form-control" id="destinatario">
                    </div>
                    <div class="form-group col-12">
                      <label for="telefono_d">Teléfono Destinatario</label>
                      <input type="text" v-model.trim="model.telefono_d" class="form-control" id="telefono_d">
                    </div>
                    <div class="form-group col-12">
                      <label for="direccion_d">Dirección Destino</label>
                      <input type="text" id="direccion_d" class="form-control" @click="openModal('direccion_d')" :value="currentLat_d && currentLng_d ? currentLat_d + ', ' + currentLng_d : ''" readonly>
                      <input type="hidden" v-model="model.direccion_d_lat">
                      <input type="hidden" v-model="model.direccion_d_lng">
                    </div>
                    <div class="form-group col-12">
                      <label for="ciudad">Ciudad o Departamento de Entrega</label>
                      <input type="text" v-model.trim="model.ciudad" class="form-control" id="ciudad">
                    </div>
                    <div class="form-group col-12">
                      <label for="nombre_d">Nombre Destinatario</label>
                      <input type="text" v-model.trim="model.nombre_d" class="form-control" id="nombre_d">
                    </div>
                    <div class="form-group col-12">
                      <label for="ci_d">CI Destinatario</label>
                      <input type="text" v-model.trim="model.ci_d" class="form-control" id="ci_d">
                    </div>
                    <div class="form-group col-12">
                      <label for="fecha">Inicio Fecha</label>
                      <input type="text" v-model="model.fecha" class="form-control" id="fecha" disabled>
                    </div>
                  </div>
                </CrudCreate>
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
          <input type="text" v-model="searchQuery" @keyup.enter="searchLocation" placeholder="Buscar dirección" class="form-control"/>
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
          <input type="text" v-model="searchQuery_d" @keyup.enter="searchLocationD" placeholder="Buscar dirección" class="form-control"/>
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

export default {
  components: {
    BModal
  },
  data() {
    return {
      model: {
        sucursale_id: '',
        cartero_id: null, // Permitir valor nulo
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
        telefono_d: '',
        direccion_d: '',
        direccion_d_lat: '',
        direccion_d_lng: '',
        ciudad: '',
        firma_d: '',
        nombre_d: '',
        ci_d: '',
        fecha_d: '',
        estado: '',
      },
      apiUrl: 'solicitudes',
      page: 'solicitudes',
      modulo: 'AGBC',
      load: true,
      sucursales: [],
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
      searching_d: false
    }
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$api.$get(path);
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
                this.initializeMap(-16.290154, -63.588653); // Fallback to Bolivia
              });
            });
          } else {
            this.currentLat = -16.290154;
            this.currentLng = -63.588653;
            this.$nextTick(() => {
              this.initializeMap(-16.290154, -63.588653); // Fallback to Bolivia
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
                this.initializeMapD(-16.290154, -63.588653); // Fallback to Bolivia
              });
            });
          } else {
            this.currentLat_d = -16.290154;
            this.currentLng_d = -63.588653;
            this.$nextTick(() => {
              this.initializeMapD(-16.290154, -63.588653); // Fallback to Bolivia
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
          this.map = L.map('map').setView([lat, lng], 14); // Center the map to user's location or fallback
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
          this.map_d = L.map('map_d').setView([lat, lng], 14); // Center the map to user's location or fallback
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
      this.model.direccion_d = this.currentLat_d + ', ' + this.currentLng_d;
    },
    async searchLocation() {
      if (this.searchQuery && this.currentLat && this.currentLng) {
        this.searching = true;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${this.searchQuery}&limit=5&viewbox=${this.currentLng-0.1},${this.currentLat+0.1},${this.currentLng+0.1},${this.currentLat-0.1}`);
        const data = await response.json();
        if (data.length > 0) {
          // Find the closest match
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
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${this.searchQuery_d}&limit=5&viewbox=${this.currentLng_d-0.1},${this.currentLat_d+0.1},${this.currentLng_d+0.1},${this.currentLat_d-0.1}`);
        const data = await response.json();
        if (data.length > 0) {
          // Find the closest match
          const closestMatch = data[0];
          const { lat, lon } = closestMatch;
          this.map_d.setView([lat, lon], 14);
          this.marker_d.setLatLng([lat, lon]);
          this.geocodePositionD({ lat, lng: lon });
        }
        this.searching_d = false;
      }
    },
    onSuccess() {
      this.$router.push('/admin/sucursal/sucursales/solicitudes');
    },
    async fetchUser() {
      let user = JSON.parse(localStorage.getItem('userAuth'));
      if (user && user.sucursale) {
        this.model.sucursale_id = user.sucursale.id;
      }
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.fetchUser();

      try {
        const sucursales = await this.GET_DATA('sucursales');
        this.sucursales = sucursales;
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
        console.log('guardar');
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
        console.log('guardar2');
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
