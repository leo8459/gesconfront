<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-center">
          <div class="col-sm-8 col-12">
            <div class="card">
              <div class="card-header">
                <h3>Actualizar</h3>
              </div>
              <div class="card-body">
                <CrudUpdate2 :model="model" :apiUrl="apiUrl">
                  <div slot="body" class="row">
                    <div class="form-group col-12">
                      <label for="sucursal">Sucursal</label>
                      <select id="sucursal" class="form-control" v-model="model.sucursale_id" disabled>
                        <option v-for="m in sucursales" :key="m.id" :value="m.id">{{ m.nombre }}</option>
                      </select>
                    </div>
                    <div class="form-group col-12">
                      <label for="guia">Guia</label>
                      <input type="text" v-model.trim="model.guia" class="form-control" id="guia">
                    </div>
                    <div class="form-group col-12">
                      <label for="peso_o">Peso (Gr)</label>
                      <input type="text" v-model.trim="model.peso_o" class="form-control" id="peso_o">
                    </div>
                    <div class="form-group col-12">
                      <label for="remitente">Remitente</label>
                      <input type="text" v-model.trim="model.remitente" class="form-control" id="remitente">
                    </div>
                    <div class="form-group col-12">
                      <label for="direccion">Dirección</label>
                      <input type="text" id="direccion" class="form-control" @click="openModal" :value="currentLat && currentLng ? currentLat + ', ' + currentLng : ''" readonly>
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
                      <input type="text" v-model.trim="model.direccion_d" class="form-control" id="direccion_d">
                    </div>
                    <div class="form-group col-12">
                      <label for="ciudad">Ciudad</label>
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
                      <label for="fecha">Envio Fecha</label>
                      <input type="text" v-model="model.fecha" class="form-control" id="fecha" disabled>
                    </div>
                  </div>
                </CrudUpdate2>
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
  </div>
</template>

<script>
import moment from 'moment-timezone';
import { BModal } from 'bootstrap-vue';
import 'leaflet/dist/leaflet.css';

export default {
  components: {
    BModal
  },
  data() {
    return {
      load: true,
      model: {
        sucursale_id: '',
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
        ciudad: '',
        firma_d: '',
        nombre_d: '',
        ci_d: '',
        fecha_d: '',
        estado: '',
      },
      apiUrl: "solicitudes2",
      page: "solicitudes",
      modulo: "Agbc",
      sucursales: [],
      ini_vigencia: '',
      fin_vigencia: '',
      map: null,
      marker: null,
      selectedAddress: '',
      currentLat: null,
      currentLng: null,
      searchQuery: '',
      searching: false
    };
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$sucursales.$get(path);
      return res;
    },
    openModal() {
      if (process.client) {
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
    },
    handleOk() {
      this.model.direccion_lat = this.currentLat;
      this.model.direccion_lng = this.currentLng;
      this.model.direccion = this.currentLat + ', ' + this.currentLng;
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
        await Promise.all([
          this.GET_DATA(this.apiUrl + '/' + this.$route.params.id),
          this.GET_DATA('sucursales')
        ]).then((v) => {
          this.model = v[0];
          this.sucursales = v[1];
        });
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }

      const now = moment().tz("America/La_Paz");
      this.model.fecha = now.format('YYYY-MM-DD HH:mm:ss');
    });
  }
};
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
</style>
