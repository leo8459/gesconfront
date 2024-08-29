<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-center">
          <div class="col-sm-8 col-12">
            <div class="card">
              <div class="card-header">
                <h3>Crear Nueva Dirección</h3>
              </div>
              <div class="card-body">
                <CrudCreate10 :model="model" :apiUrl="apiUrl">
                  <div slot="body" class="row">

                    <div class="form-group col-12">
                      <label for="empresa">Sucursal</label>
                      <v-select :options="sucursales" v-model="model.sucursale_id" label="nombre"
                        :reduce="sucursale => sucursale.id" placeholder="Buscar sucursal...">
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
                    </div>
                    <div class="form-group col-12">
                      <label for="nombre">Nombre</label>
                      <input type="text" v-model="model.nombre" class="form-control" id="nombre">
                    </div>
                    <div class="form-group col-12">
                      <label for="direccion_lat_lng">Dirección Maps</label>
                      <input type="text" id="direccion_lat_lng" class="form-control" @click="openModal('direccion')"
                        :value="currentLat && currentLng ? currentLat + ', ' + currentLng : ''" readonly>
                      <input type="hidden" v-model="model.direccion_lat">
                      <input type="hidden" v-model="model.direccion_lng">
                    </div>

                    <div class="form-group col-12">
                      <label for="direccion_especifica">Dirección Específica</label>
                      <input type="text" v-model="model.direccion_especifica" class="form-control" id="direccion_especifica">
                    </div>

                    <div class="form-group col-12">
                      <label for="zona">Zona</label>
                      <input type="text" v-model="model.zona" class="form-control" id="zona">
                    </div>

                  </div>
                </CrudCreate10>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>

    <!-- Modal para el mapa -->
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
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import { BModal } from 'bootstrap-vue';
import 'vue-select/dist/vue-select.css';
import Swal from 'sweetalert2';
import vSelect from 'vue-select';

export default {
  components: {
    BModal,
    vSelect,
  },
  data() {
    return {
      model: {
        nombre: '',
        direccion: '',
        direccion_especifica: '',
        zona: '',
        direccion_lat: '',
        direccion_lng: '',
        sucursale_id: null, // Este campo se relaciona con la sucursal seleccionada
      },
      sucursales: [], // Aquí se almacenarán las sucursales
      apiUrl: 'direcciones2',
      page: 'Direcciones',
      modulo: 'AGBC',
      load: true,
      map: null,
      marker: null,
      currentLat: null,
      currentLng: null,
      searchQuery: '',
      searching: false,
    };
  },
  methods: {
    openModal(type) {
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
            this.setDefaultBoliviaMap();
          });
        } else {
          this.setDefaultBoliviaMap();
        }
      }
    },
    setDefaultBoliviaMap() {
      this.currentLat = -16.290154; // Latitud aproximada del centro de Bolivia
      this.currentLng = -63.588653; // Longitud aproximada del centro de Bolivia
      this.$nextTick(() => {
        this.initializeMap(this.currentLat, this.currentLng);
      });
    },
    initializeMap(lat, lng) {
      if (this.map) {
        this.map.remove();
      }

      import('leaflet').then(L => {
        const bounds = L.latLngBounds([-22.898, -69.648], [-9.675, -57.453]); // Límites aproximados de Bolivia

        this.map = L.map('map', {
          maxBounds: bounds,  // Restringe el mapa a Bolivia
          maxBoundsViscosity: 1.0, // Evita el deslizamiento fuera de los límites
          zoomControl: true,
        }).setView([lat, lng], 20); // Cambia el nivel de zoom a 20 para una vista más cercana

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
    },
    async geocodePosition(latlng) {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}&countrycodes=BO`);
      const data = await response.json();
      if (data && data.display_name) {
        this.model.direccion = data.display_name;
      }
      this.currentLat = latlng.lat;
      this.currentLng = latlng.lng;
      this.searching = false;
    },
    handleOk() {
      this.model.direccion_lat = this.currentLat;
      this.model.direccion_lng = this.currentLng;
      this.model.direccion = this.currentLat + ', ' + this.currentLng;
    },
    async searchLocation() {
      if (this.searchQuery && this.currentLat && this.currentLng) {
        this.searching = true;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${this.searchQuery}&countrycodes=BO&limit=5&viewbox=${this.currentLng - 0.1},${this.currentLat + 0.1},${this.currentLng + 0.1},${this.currentLat - 0.1}`);
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
    async GET_DATA(path) {
      const res = await this.$sucursales.$get(path);
      return res;
    },
  },
  mounted() {
    this.$nextTick(async () => {
      try {
        let user = JSON.parse(localStorage.getItem('userAuth'));
        if (user && user.user) {
          this.model.sucursale_id = user.user.id; // Asignar el ID de la sucursal logueada
          this.sucursales = [user.user]; // Asignar la sucursal logueada al dropdown
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    });
  },

};
</script>

<style scoped>
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

.coordinates {
  text-align: center;
}
</style>
