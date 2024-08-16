<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-center">
          <div class="col-sm-8 col-12">
            <div class="card">
              <div class="card-header">
                <h3>Actualizar Dirección</h3>
              </div>
              <div class="card-body">
                <CrudUpdate4 :model="model" :apiUrl="apiUrl">
                  <div slot="body" class="row">

                    <!-- Campo para seleccionar la Sucursal -->
                    <div class="form-group col-12">
                      <label for="sucursale_id">Sucursal</label>
                      <v-select :options="sucursales" v-model="model.sucursale_id" label="nombre"
                        :reduce="sucursale => sucursale.id" placeholder="Selecciona una sucursal">
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
                      <label for="">Nombre de direccion</label>
                      <input type="text" v-model="model.nombre" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="direccion_lat_lng">Dirección Maps</label>
                      <input type="text" id="direccion_lat_lng" class="form-control" @click="openModal('direccion')"
                        :value="currentLat && currentLng ? currentLat + ', ' + currentLng : model.direccion" readonly>
                      <input type="hidden" v-model="model.direccion_lat">
                      <input type="hidden" v-model="model.direccion_lng">
                    </div>

                    <div class="form-group col-12">
                      <label for="">Dirección Específica</label>
                      <input type="text" v-model="model.direccion_especifica" class="form-control" id="">
                    </div>

                    <div class="form-group col-12">
                      <label for="">Zona</label>
                      <input type="text" v-model="model.zona" class="form-control" id="">
                    </div>

                  </div>
                </CrudUpdate4>
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
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

export default {
  name: "EditPage",
  components: {
    BModal,
    vSelect,
  },
  data() {
    return {
      load: true,
      model: {
        nombre: '',
        direccion: '',
        direccion_especifica: '',
        zona: '',
        direccion_lat: '',
        direccion_lng: '',
        sucursale_id: null, // Campo para almacenar la sucursal seleccionada
      },
      sucursales: [], // Lista de sucursales
      apiUrl: "direcciones3",
      page: "Direcciones",
      modulo: "Agbc",
      map: null,
      marker: null,
      currentLat: null,
      currentLng: null,
      searchQuery: '',
      searching: false,
    };
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$gestores.$get(path);
      return res;
    },
    openModal() {
      this.$refs.mapsModal.show();
      this.initializeMap(this.model.direccion_lat, this.model.direccion_lng);
    },
    initializeMap(lat, lng) {
      if (this.map) {
        this.map.remove();
      }

      import('leaflet').then(L => {
        this.map = L.map('map').setView([lat || -16.290154, lng || -63.588653], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.marker = L.marker([lat || -16.290154, lng || -63.588653], {
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
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`);
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
  },
  mounted() {
    this.$nextTick(async () => {
      try {
        const [response, sucursalesData] = await Promise.all([
          this.GET_DATA(this.apiUrl + '/' + this.$route.params.id),
          this.GET_DATA('sucursales3'),
        ]);
        
        this.model = response;
        this.sucursales = sucursalesData;

        if (this.model.direccion_lat && this.model.direccion_lng) {
          this.currentLat = this.model.direccion_lat;
          this.currentLng = this.model.direccion_lng;
        } else {
          this.currentLat = -16.290154; // Default Lat
          this.currentLng = -63.588653; // Default Lng
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    });
  }
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
