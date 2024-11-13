<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-center">
          <div class="col-md-8 col-12">
            <div class="card">
              <div class="card-header">
                <h3>Agregar Solicitud Digital</h3>
                 <!-- Botón para subir masivamente -->
    <div class="form-group col-12">
      <button class="btn btn-primary" @click="mostrarModalCargaMasiva">Subir Masivamente</button>
    </div>

    <!-- Modal para carga masiva -->
    <b-modal ref="modalCargaMasiva" title="Subir Solicitudes Masivamente" hide-footer>
      <div>
        <input type="file" @change="procesarArchivo" accept=".xlsx, .xls, .csv" />
        <button class="btn btn-primary mt-3" @click="subirArchivo">Subir Archivo</button>
      </div>
    </b-modal>
              </div>

              <div class="card-body">
                <div class="form-group col-12">
                  <h4>Remitente</h4>
                </div>
                <CrudCreate100 :model="model" :apiUrl="apiUrl" @success="onSuccess">
                  <div slot="body" class="row">
                    <div class="form-group col-12">
                      <label for="sucursal">Sucursal</label>
                      <input type="text" id="sucursal" class="form-control" v-model="model.sucursale_nombre" disabled>
                    </div>
                    <!-- <div class="form-group col-12">
                      <label for="sucursal">Número de Guía</label>
                      <input type="text" id="sucursal" class="form-control" v-model="model.guia">
                    </div> -->
                    <div class="form-group col-12">
  <label for="remitente">Remitente</label>
  <input type="text" v-model.trim="model.remitente" class="form-control" id="remitente"
    @input="showRemitenteSuggestions" @blur="hideRemitenteSuggestions" placeholder="Ej: Juan Pérez">
  <ul v-if="remitenteSuggestions.length" class="suggestions-list">
    <li v-for="(suggestion, index) in remitenteSuggestions" :key="index" @click="applyFrequentRemitente(suggestion)">
      {{ suggestion.remitente }} - {{ suggestion.direccion_r }}, Zona: {{ suggestion.zona_r }}
      <button @click.stop="deleteFrequentRemitente(index)" class="delete-btn">X</button>
    </li>
  </ul>
</div>

                    <div class="form-group col-12">
                      <label for="telefono">Teléfono</label>
                      <input type="number" v-model.trim="model.telefono" class="form-control" id="telefono"
                        placeholder="Ej: 12345678">
                    </div>

                    <div class="form-group col-12">
                      <label for="contenido">Contenido</label>
                      <input type="text" v-model.trim="model.contenido" class="form-control" id="contenido"
                        placeholder="Ej: Documentos">
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
                      <label for="direccion">Dirección de Recojo</label>
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
                      <button @click="redirectToAddNewAddress" class="btn btn-primary btn-sm mt-2">
                        Agregar nueva dirección de recojo
                      </button>
                    </div>

                    <div class="form-group col-12">
                      <label for="peso_o">Peso (Medido en Kilogramos)</label>
                      <input type="number" v-model.number="model.peso_o" class="form-control" id="peso_o" step="0.001"
                        @input="limitDecimals" placeholder="Ej: 1.250">
                    </div>

                    <div class="form-group col-12">
                      <label for="precios" class="underline-label">Precio Estimado</label>
                      <input type="text" id="precios" class="form-control" :value="precioSeleccionado" disabled
                        placeholder="Calculado automáticamente">
                        <button type="button" class="btn btn-primary mt-2" @click="saveFrequentRemitente()">Guardar como Remitente Frecuente</button>

                    </div>




                    <div class="form-group col-12">
                      <h4>Destinatario</h4>
                    </div>
                    <div class="form-group col-12">
  <label for="destinatario">Destinatario</label>
  <input type="text" v-model.trim="model.destinatario" class="form-control" id="destinatario"
    @input="showSuggestions" @blur="hideSuggestions" placeholder="Ej: María López">
    <ul v-if="suggestions.length" class="suggestions-list">
  <li v-for="(suggestion, index) in suggestions" :key="index" class="suggestion-item" @click="applyFrequentAddress(suggestion)">
    <span>{{ suggestion.destinatario }} - {{ suggestion.direccion_especifica_d }}, Zona: {{ suggestion.zona_d }}</span>
    <button @click.stop="deleteFrequentAddress(index)" class="delete-btn">X</button>
  </li>
</ul>



</div>


                    <div class="form-group col-12">
                      <label for="telefono_d">Teléfono Destinatario</label>
                      <input type="number" v-model.trim="model.telefono_d" class="form-control" id="telefono_d"
                        placeholder="Ej: 87654321">
                    </div>

                    <div class="form-group col-12">
                      <label for="direccion_d">Mapa de destino</label>
                      <input type="text" id="direccion_d" class="form-control" @click="openModal('direccion_d')"
                        :value="direccionDisplay" readonly placeholder="Seleccionar en el mapa">
                      <input type="hidden" v-model="model.direccion_d_lat">
                      <input type="hidden" v-model="model.direccion_d_lng">
                    </div>

                    <div class="form-group col-12">
                      <label for="direccion_especifica_d">Dirección</label>
                      <input type="text" v-model.trim="model.direccion_especifica_d" class="form-control"
                        id="direccion_especifica_d" placeholder="Ej: Calle Principal 456">
                    </div>

                    <div class="form-group col-12">
                      <label for="zona_d">Zona Destinatario</label>
                      <input type="text" v-model.trim="model.zona_d" class="form-control" id="zona_d"
                        placeholder="Ej: Zona Norte">
                    </div>

                    <div class="form-group col-12">
                      <label for="ciudad">Provincia</label>
                      <input type="text" v-model.trim="model.ciudad" class="form-control" id="ciudad"
                        placeholder="Ej: La Paz">
                    </div>

                    <div class="form-group col-12">
                      <label for="fecha">Inicio Fecha</label>
                      <input type="text" v-model="model.fecha" class="form-control" id="fecha" disabled>
                    </div>

                    <!-- Botón para guardar dirección como frecuente -->
                    <button type="button" class="btn btn-primary" @click="saveFrequentAddress()">Guardar como Dirección
                      Frecuente</button>

                  </div>
                </CrudCreate100>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>

    <!-- Modal para el mapa -->
    <b-modal ref="mapsModalD" title="Seleccionar Dirección en el Mapa" :footer="false" hide-backdrop hide-footer>
      <div>
        <div class="input-group mb-2">
  <input
    type="text"
    v-model="searchQuery_d"
    @input="showSuggestions"
    placeholder="Buscar dirección"
    class="form-control"
  />
  <div class="input-group-append">
    <button class="btn btn-primary" type="button" @click="searchLocationD">
      Buscar
    </button>
  </div>
</div>
<ul v-if="suggestions.length" class="suggestions-list">
  <li
    v-for="suggestion in suggestions"
    :key="suggestion.display_name"
    @click="selectSuggestionD(suggestion)"
  >
    {{ suggestion.display_name }}
  </li>
</ul>

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
        <button class="btn btn-primary mt-2" @click="handleOkD">Confirmar Dirección</button>
        <button class="btn btn-secondary mt-2" @click="goBack">Volver</button>
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
import jsPDF from 'jspdf';

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
      map_d: null,
      marker_d: null,
      selectedAddress_d: '',
      currentLat_d: null,
      currentLng_d: null,
      searchQuery_d: '',
      searching_d: false,
      direcciones: [],
      suggestions: [],
      remitenteSuggestions: [],
      archivo: null,
      isUploading: false, // Nueva variable para el estado de carga


    };
  },
  computed: {
    direccionDisplay() {
    return this.model.direccion_d || 'Seleccionar en el mapa';
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
    mostrarModalCargaMasiva() {
      this.$refs.modalCargaMasiva.show();
    },
    procesarArchivo(event) {
      this.archivo = event.target.files[0];
    },
    async subirArchivo() {
    if (!this.archivo) {
      Swal.fire({
        icon: 'error',
        title: 'Por favor seleccione un archivo',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', this.archivo);
    formData.append('sucursale_id', this.model.sucursale_id);

    try {
      // Muestra el mensaje de "Subiendo archivo..."
      this.isUploading = true;
      Swal.fire({
        title: 'Subiendo archivo...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await this.$sucursales.$post('/solicitudes2/carga-masiva', formData);

      // Cierra el mensaje de carga y muestra el éxito
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Solicitudes subidas con éxito',
        text: `Se han creado ${response.data.creados} solicitudes`,
        showConfirmButton: true,
      });

      this.$refs.modalCargaMasiva.hide();
    } catch (error) {
      // Cierra el mensaje de carga y muestra el error
      Swal.close();
      console.error('Error al subir el archivo:', error);
      Swal.fire({
        icon: 'success',
        title: 'Solicitudes subidas con éxito',
        text: error.response?.data?.message || 'Se subido todos los archivos con exito',
        showConfirmButton: true,
      });
    } finally {
      this.isUploading = false; // Restablece el estado de carga
    }
  },
      // Método para guardar remitente frecuente
 saveFrequentRemitente() {
    let frequentRemitentes = JSON.parse(localStorage.getItem('frequentRemitentes')) || [];
    const exists = frequentRemitentes.some(
      remitente => remitente.remitente.toLowerCase() === this.model.remitente.toLowerCase()
    );

    if (!exists) {
      const newRemitente = {
        remitente: this.model.remitente,
        telefono: this.model.telefono,
        contenido: this.model.contenido,
        tarifa_id: this.model.tarifa_id,
        direccion_id: this.model.direccion_id,
        peso_o: this.model.peso_o,
        precio: this.precioSeleccionado,
        direccion_r: this.direcciones.find(d => d.id === this.model.direccion_id)?.nombre || '',
        zona_r: this.model.zona_r || '',
        ciudad_r: this.model.ciudad || ''
      };
      frequentRemitentes.push(newRemitente);
      localStorage.setItem('frequentRemitentes', JSON.stringify(frequentRemitentes));
      Swal.fire({
        icon: 'success',
        title: 'Remitente guardado como frecuente',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'El remitente ya está guardado',
        showConfirmButton: false,
        timer: 1500
      });
    }
  },

  // Método para mostrar sugerencias de remitentes
  showRemitenteSuggestions() {
    if (this.model.remitente) {
      this.remitenteSuggestions = this.loadFrequentRemitentes(this.model.remitente);
    } else {
      this.remitenteSuggestions = [];
    }
  },

  // Cargar remitentes frecuentes desde el almacenamiento local
  loadFrequentRemitentes(query) {
    const frequentRemitentes = JSON.parse(localStorage.getItem('frequentRemitentes')) || [];
    return frequentRemitentes.filter(remitente =>
      remitente.remitente.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Aplicar el remitente frecuente seleccionado
  applyFrequentRemitente(remitente) {
    this.model.remitente = remitente.remitente;
    this.model.telefono = remitente.telefono;
    this.model.contenido = remitente.contenido;
    this.model.tarifa_id = remitente.tarifa_id;
    this.model.direccion_id = remitente.direccion_id;
    this.model.peso_o = remitente.peso_o;
    this.precioSeleccionado = remitente.precio; // Asegúrate de que se muestre el precio

    // Campos adicionales de dirección
    this.model.direccion = remitente.direccion_r;
    this.model.direccion_lat = remitente.direccion_r_lat;
    this.model.direccion_lng = remitente.direccion_r_lng;
    this.model.zona_r = remitente.zona_r;
    this.model.ciudad = remitente.ciudad_r;

    // Limpia las sugerencias después de seleccionar
    this.remitenteSuggestions = [];
  },

  // Método para eliminar remitente frecuente
  deleteFrequentRemitente(index) {
    let frequentRemitentes = JSON.parse(localStorage.getItem('frequentRemitentes')) || [];
    frequentRemitentes.splice(index, 1);
    localStorage.setItem('frequentRemitentes', JSON.stringify(frequentRemitentes));
    this.remitenteSuggestions = this.loadFrequentRemitentes(this.model.remitente);

    Swal.fire({
      icon: 'success',
      title: 'Remitente eliminado de las frecuentes',
      showConfirmButton: false,
      timer: 1500
    });
  },

  // Ocultar sugerencias de remitentes
  hideRemitenteSuggestions() {
    setTimeout(() => {
      this.remitenteSuggestions = [];
    }, 200);
  },
    deleteFrequentAddress(index) {
    let frequentAddresses = JSON.parse(localStorage.getItem('frequentAddresses')) || [];
    
    // Elimina el elemento en el índice especificado
    frequentAddresses.splice(index, 1);

    // Actualiza el almacenamiento local y la lista de sugerencias
    localStorage.setItem('frequentAddresses', JSON.stringify(frequentAddresses));
    this.suggestions = this.loadFrequentAddresses(this.model.destinatario);

    Swal.fire({
      icon: 'success',
      title: 'Dirección eliminada de las frecuentes',
      showConfirmButton: false,
      timer: 1500
    });
  },
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
    async generateGuideNumber() {
      try {
        const sucursaleId = this.model.sucursale_id;
        const tarifaId = this.model.tarifa_id;
        const response = await this.$sucursales.$post('/generar-guia', {
          sucursale_id: sucursaleId,
          tarifa_id: tarifaId
        });
        return response.data.guia;
      } catch (error) {
        console.error('Error al generar la guía:', error);
        throw new Error('No se pudo generar el número de guía');
      }
    },
    async createRequest() {
  try {
    // Asegúrate de que el modelo tenga las coordenadas antes de enviar
    this.model.guia = await this.generateGuideNumber();
    
    const response = await this.$sucursales.$post(this.apiUrl, this.model);

    // Verifica que la respuesta haya sido exitosa
    this.onSuccess(response);
    this.generatePDF();
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
      if (process.client && type === 'direccion_d') {
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
            this.currentLat_d = -16.499225148793467;
            this.currentLng_d = -68.1352785229683;
            this.$nextTick(() => {
              this.initializeMapD(-16.499225148793467, -68.1352785229683);
            });
          });
        } else {
          this.currentLat_d = -16.499225148793467;
          this.currentLng_d = -68.1352785229683;
          this.$nextTick(() => {
            this.initializeMapD(-16.499225148793467, -68.1352785229683);
          });
        }
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
    async geocodePositionD(latlng) {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`);
      const data = await response.json();
      if (data && data.display_name) {
        this.model.direccion_d = data.display_name;
      } else {
        this.model.direccion_d = `${latlng.lat}, ${latlng.lng}`;
      }
      this.currentLat_d = latlng.lat;
      this.currentLng_d = latlng.lng;
      this.model.direccion_d_lat = this.currentLat_d;
      this.model.direccion_d_lng = this.currentLng_d;
      this.searching_d = false;
    },
    goBack() {
      // Reset latitude and longitude so they are not saved
      this.model.direccion_d_lat = null;
      this.model.direccion_d_lng = null;
      this.model.direccion_d = '';

      this.$refs.mapsModalD.hide(); // Closes the modal without saving
    },
    handleOkD() {
    // Guarda las coordenadas cuando el usuario confirma la selección
    this.model.direccion_d_lat = this.currentLat_d;
    this.model.direccion_d_lng = this.currentLng_d;
    this.model.direccion_d = `${this.currentLat_d}, ${this.currentLng_d}`;

    // Cierra el modal después de confirmar
    this.$refs.mapsModalD.hide();
  },
    async searchLocationD() {
      if (this.searchQuery_d && this.currentLat_d && this.currentLng_d) {
        this.searching_d = true;
        try {
          const lat = this.currentLat_d;
          const lng = this.currentLng_d;

          // Define un viewbox de 0.1 grados alrededor de la ubicación actual
          const viewbox = `${lng - 0.1},${lat - 0.1},${lng + 0.1},${lat + 0.1}`;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              this.searchQuery_d
            )}&addressdetails=1&limit=5&viewbox=${viewbox}&bounded=1`
          );
          const data = await response.json();

          // Mapea los resultados para mostrar las sugerencias
          this.suggestions = data.map(item => ({
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon,
          }));
        } catch (error) {
          console.error('Error al buscar la ubicación:', error);
          this.suggestions = [];
        } finally {
          this.searching_d = false;
        }
      } else {
        this.suggestions = [];
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
    selectSuggestionD(suggestion) {
  this.searchQuery_d = suggestion.display_name;
  this.suggestions = [];

  const lat = parseFloat(suggestion.lat);
  const lon = parseFloat(suggestion.lon);

  // Solo actualiza los valores temporales
  this.currentLat_d = lat;
  this.currentLng_d = lon;
  this.tempAddress = suggestion.display_name; // Almacena temporalmente la dirección

  // Centrar el mapa y mover el marcador a la nueva ubicación
  this.map_d.setView([lat, lon], 14);
  this.marker_d.setLatLng([lat, lon]);
}
,
saveFrequentAddress() {
    let frequentAddresses = JSON.parse(localStorage.getItem('frequentAddresses')) || [];
    const exists = frequentAddresses.some(
      address => address.destinatario.toLowerCase() === this.model.destinatario.toLowerCase()
    );

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
 
  applyFrequentAddress(address) {
    this.model.destinatario = address.destinatario;
    this.model.telefono_d = address.telefono_d;
    this.model.direccion_especifica_d = address.direccion_especifica_d;
    this.model.direccion_d_lat = address.direccion_d_lat;
    this.model.direccion_d_lng = address.direccion_d_lng;
    this.model.zona_d = address.zona_d;
    this.model.ciudad = address.ciudad;

    // Asigna la dirección completa si es necesario
    this.model.direccion_d = `${address.direccion_especifica_d}, Zona: ${address.zona_d}`;

    // Limpia las sugerencias después de seleccionar
    this.suggestions = [];
  },
  showSuggestions() {
    if (this.model.destinatario) {
      this.suggestions = this.loadFrequentAddresses(this.model.destinatario);
    } else {
      this.suggestions = [];
    }
  },
  loadFrequentAddresses(query) {
    const frequentAddresses = JSON.parse(localStorage.getItem('frequentAddresses')) || [];
    return frequentAddresses.filter(address =>
      address.destinatario.toLowerCase().includes(query.toLowerCase())
    );
  },
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.currentLat_d = position.coords.latitude;
            this.currentLng_d = position.coords.longitude;
            this.map_d.setView([this.currentLat_d, this.currentLng_d], 14);
            this.marker_d.setLatLng([this.currentLat_d, this.currentLng_d]);
          },
          (error) => {
            console.error('Error obteniendo la ubicación:', error);
            // Usa una ubicación por defecto si hay un error
           
          }
        );
      }
    },
    hideSuggestions() {
      setTimeout(() => {
        this.suggestions = [];
      }, 200);
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.fetchUser();
      await this.fetchDirecciones();
      this.getCurrentLocation();

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
  }
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

.underline-label {
  text-decoration: underline;
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

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  cursor: pointer;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
}

.delete-btn {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 5px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #ff1a1a;
}

</style>
