<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-3" v-if="hasSelectedItems">

          </div>
          <div class="col-12 col-md-3 search-input-container">
            <input v-model="searchTerm" @keypress.enter="handleSearchEnter" type="text"
              class="form-control search-input" placeholder="Buscar..." />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                En Camino
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-sm table-bordered table-hover">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">Encontrar Punto</th>

                        <th class="py-0 px-1">
                          <input type="checkbox" @change="selectAll($event, paginatedData)">
                        </th>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>
                        <th class="py-0 px-1">Guía</th>
                        <th class="py-0 px-1">Paquete Casilla</th>
                        <th class="py-0 px-1">Remitente</th>
                        <th class="py-0 px-1">Teléfono</th>
                        <th class="py-0 px-1">Contenido</th>
                        <th class="py-0 px-1">Destinatario</th>
                        <th class="py-0 px-1">Teléfono Destinatario</th>
                        <th class="py-0 px-1">Dirección Destinatario Maps</th>
                        <th class="py-0 px-1">Dirección Destinatario</th>
                        <th class="py-0 px-1">Municipio/Provincia</th>
                        <th class="py-0 px-1">Zona Destinatario</th>
                        <th class="py-0 px-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedData" :key="i">
                        <td class="py-0 px-1" data-label="Encontrar Punto">
                          <input type="checkbox" @change="toggleMarker(m)" />
                        </td>
                        <td class="py-0 px-1">
                          <input type="checkbox" v-model="selected[m.id]">
                        </td>
                        <td class="py-0 px-1" data-label="Nº">{{ currentPage * itemsPerPage + i + 1 }}</td>
                        <td class="py-0 px-1" data-label="Sucursal">{{ m.sucursale.nombre }}</td>
                        <td class="py-0 px-1" data-label="Guía">{{ m.guia }}</td>
                        <td class="py-0 px-1" data-label="Guía">{{ m.alquiler_id ? m.alquiler_id : 'S/P' }}</td>
                        <td class="py-0 px-1" data-label="Remitente">{{ m.remitente }}</td>
                        <td class="py-0 px-1" data-label="Teléfono">{{ m.telefono }}</td>
                        <td class="py-0 px-1" data-label="Contenido">{{ m.contenido }}</td>
                        <td class="py-0 px-1" data-label="Destinatario">{{ m.destinatario }}</td>
                        <td class="py-0 px-1" data-label="Teléfono Destinatario">{{ m.telefono_d }}</td>
                        <td class="py-0 px-1" data-label="Dirección Destinatario Maps">
                          <a v-if="isCoordinates(m.direccion_d) || m.direccion_especifica_d"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + (isCoordinates(m.direccion_d) ? m.direccion_d : m.direccion_especifica_d)"
                            target="_blank" class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>No hay dirección disponible</span>
                        </td>

                        <td class="py-0 px-1" data-label="Dirección">{{ m.direccion_especifica_d }}</td>
                        <td class="py-0 px-1" data-label="Municipio/Provincia">{{ m.ciudad }}</td>
                        <td class="py-0 px-1" data-label="Zona">{{ m.zona_d }}</td>
                        <td class="py-0 px-1" data-label="Acción">
                          <div class="btn-group">
                            <nuxtLink :to="url_editar + m.id" class="btn btn-info btn-sm py-1 px-2 w-100">
                              <i class="fas fa-ban"></i> Entregar Correspondencia
                            </nuxtLink>
                          </div>
                        </td>
                        <td class="py-0 px-1" data-label="Devolver">
                          <button @click="openObservationModal(m.id)" class="btn btn-warning btn-sm w-100">
                            <i class="fas fa-undo"></i> Devolver a destino
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="row justify-content-end mb-3">

              <div class="col-3" v-if="hasSelectedItems">
                <button @click="showMap" class="btn btn-primary btn-sm w-100">
                  <i class="fas fa-map"></i> Mapa
                </button>
              </div>

            </div>

            <!-- Paginación -->
            <nav aria-label="Page navigation">
              <ul class="pagination justify-content-between">
                <li class="page-item" :class="{ disabled: currentPage === 0 }">
                  <button class="page-link" @click="previousPage" :disabled="currentPage === 0">
                    <</button>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page"
                  :class="{ active: currentPage === page - 1 }">
                  <button class="page-link" @click="goToPage(page - 1)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                  <button class="page-link" @click="nextPage" :disabled="currentPage >= totalPages - 1">></button>
                </li>
              </ul>
            </nav>

            <div class="btn-group map-type-selector mb-3">
              <button @click="changeMapType('roadmap')" class="btn btn-light">Mapa</button>
              <button @click="changeMapType('satellite')" class="btn btn-light">Satélite</button>
              <button @click="changeMapType('terrain')" class="btn btn-light">Terreno</button>
              <button @click="changeMapType('hybrid')" class="btn btn-light">Híbrido</button>
            </div>
            <!-- Botones para elegir el tipo de transporte -->
            <!-- Botones para elegir el tipo de transporte -->
            <div class="transportation-options mb-3">
              <button @click="changeTravelMode('DRIVING')" class="btn btn-light">
                <i class="fas fa-car"></i> Auto
              </button>
              <button @click="changeTravelMode('WALKING')" class="btn btn-light">
                <i class="fas fa-walking"></i> A pie
              </button>
              <button @click="changeTravelMode('MOTORCYCLE')" class="btn btn-light">
                <i class="fas fa-motorcycle"></i> Moto
              </button>
            </div>
            <button @click="calculateTotalTime" class="btn btn-primary mb-3">
  <i class="fas fa-clock"></i> Mostrar Tiempo Total
</button>

            <div id="map" class="mt-3" style="height: 500px;"></div>

          </div>
        </div>
      </div>
    </AdminTemplate>

    <!-- Modal para añadir observación -->
    <b-modal v-model="isObservationModalVisible" title="Agregar Observación" hide-backdrop hide-footer>
      <div class="form-group">
        <label for="observacion">Observación</label>
        <textarea id="observacion" v-model="observacion" class="form-control" rows="3"
          placeholder="Ingrese la observación..."></textarea>
      </div>
      <div class="form-group">
        <label for="capturephoto">Subir Foto</label>
        <input type="file" accept="image/*" id="capturephoto" class="form-control-file" @change="handleImageUpload">
        <img v-if="uploadedImage" :src="uploadedImage" class="img-fluid mt-2" />
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-secondary" @click="isObservationModalVisible = false">Cancelar</button>
        <button class="btn btn-primary ml-2" @click="confirmRechazar">Guardar</button>
      </div>
    </b-modal>

    <!-- Modal para añadir peso_v -->
    <b-modal v-model="isModalVisible" title="Asignar Peso Correos (Kg)" hide-backdrop hide-footer>
      <div v-for="item in selectedItemsData" :key="item.id" class="form-group">
        <label :for="'peso_v-' + item.id">{{ item.guia }} - {{ item.sucursale.nombre }}</label>
        <input type="number" :id="'peso_v-' + item.id" v-model="item.peso_v" class="form-control" />
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
import Pica from 'pica';
import Vue from 'vue';
import Router from 'vue-router';

export default {
  name: "IndexPage",
  components: {
    BCollapse,
    BModal,
    // path: '/map',
  },
  data() {
    return {
      load: true,
      list: [],
      searchTerm: '',
      apiUrl: 'solicitudes',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/admin/solicitudesj/solicitudej/nuevo',
      url_editar: '/admin/cartero/editar/',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      collapseState: {},
      isModalVisible: false,
      currentId: null,
      selected: {},
      selectedItemsData: [],
      user: {},
      currentPage: 0,
      itemsPerPage: 10,
      isObservationModalVisible: false,
      observacion: '',
      uploadedImage: '',
      isMapModalVisible: false,
      selectedMapItems: [],
      userLocation: null,
      sortedMapItems: [],
      selectedMarkers: {},
      directionsService: null,
      directionsRenderer: null,
      markers: [], // Inicializar los marcadores como un array vacío

    };
  },
  computed: {
    filteredData() {
  const searchTerm = this.searchTerm.toLowerCase();
  return this.list.filter(item =>
    (item.estado === 2 || item.estado === 9) &&
    item.cartero_entrega && item.cartero_entrega.id === this.user.user.id &&
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm)
    )
  );
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
    calculateTotalTime() {
    const selectedItems = Object.keys(this.selected)
      .map(id => this.list.find(m => m.id == id))
      .filter(item => item && this.isCoordinates(item.direccion_d));

    if (selectedItems.length === 0) {
      this.$swal.fire({
        icon: 'warning',
        title: 'No hay puntos seleccionados',
        text: 'Por favor, selecciona al menos un punto.',
      });
      return;
    }

    this.calculateRouteWithWaypoints(selectedItems, this.selectedTravelMode); // Usar el modo de transporte seleccionado
  },
    changeMapType(type) {
      if (this.map) {
        this.map.setMapTypeId(google.maps.MapTypeId[type.toUpperCase()]);
      }
    },
    async calculateRouteToNearest(selectedItems) {
      if (!this.userLocation) {
        this.$swal.fire({
          icon: 'error',
          title: 'Error de ubicación',
          text: 'No se ha podido obtener la ubicación actual.',
        });
        return;
      }

      // Obtener coordenadas de los destinos seleccionados.
      const destinations = selectedItems
        .map(item => {
          const [lat, lng] = item.direccion_d.split(',').map(coord => parseFloat(coord.trim()));
          return { lat, lng, item };
        });

      if (destinations.length === 0) {
        this.$swal.fire({
          icon: 'warning',
          title: 'Sin destinos válidos',
          text: 'No se encontraron destinos válidos para calcular la ruta.',
        });
        return;
      }

      // Obtener las ubicaciones como objetos LatLng.
      const destinationLocations = destinations.map(dest => new google.maps.LatLng(dest.lat, dest.lng));

      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [this.userLocation],
          destinations: destinationLocations,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status !== google.maps.DistanceMatrixStatus.OK) {
            console.error('Error de Distance Matrix:', status);
            this.$swal.fire({
              icon: 'error',
              title: 'Error al calcular la distancia',
              text: 'No se ha podido calcular la distancia.',
            });
            return;
          }

          // Ordenar los destinos según la distancia desde la ubicación del usuario.
          const distances = response.rows[0].elements.map((element, index) => ({
            distance: element.distance.value,
            destination: destinations[index],
          }));
          distances.sort((a, b) => a.distance - b.distance);

          // Crear un array de waypoints (excluyendo el primer punto que es el más cercano).
          const waypoints = distances.slice(1).map(d => ({
            location: new google.maps.LatLng(d.destination.lat, d.destination.lng),
            stopover: true,
          }));

          // Calcular la ruta utilizando DirectionsService.
          const request = {
            origin: this.userLocation,
            destination: new google.maps.LatLng(distances[0].destination.lat, distances[0].destination.lng),
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true, // Optimiza la ruta si hay múltiples waypoints.
          };

          this.directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              this.directionsRenderer.setDirections(result);
            } else {
              this.$swal.fire({
                icon: 'error',
                title: 'Error al calcular la ruta',
                text: 'No se ha podido calcular la ruta.',
              });
              console.error('Error al calcular la ruta:', status);
            }
          });
        }
      );
    },

    initializeMap() {
      if (window.google && window.google.maps) {
        const mapOptions = {
          center: { lat: -16.5000, lng: -68.1500 }, // Coordenadas de La Paz, Bolivia
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.SATELLITE, // Opción de vista satélite
          tilt: 45 // Agrega vista en 3D si está disponible
        };

        const mapElement = document.getElementById('map');
        this.map = new google.maps.Map(mapElement, mapOptions);

        // Configurar los servicios de direcciones (enrutamiento)
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
  suppressMarkers: true
});       
this.directionsRenderer.setMap(this.map);

        // Si el navegador soporta la geolocalización, configuramos la ubicación actual
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              this.map.setCenter(this.userLocation);

              new google.maps.Marker({
                position: this.userLocation,
                map: this.map,
                title: 'Mi Ubicación',
                icon: {
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                },
              });

              this.addMarkersToMap(); // Añadir markers después de obtener la ubicación
            },
            (error) => {
              console.error('Error al obtener la ubicación del usuario:', error);
              this.addMarkersToMap();
            }
          );
        } else {
          this.addMarkersToMap(); // Si no se obtiene geolocalización, solo añadimos los markers
        }
      } else {
        console.error('Google Maps no está cargado correctamente.');
      }
    },

    changeTravelMode(mode) {
    if (mode === 'MOTORCYCLE') {
      this.selectedTravelMode = google.maps.TravelMode.DRIVING;
    } else {
      this.selectedTravelMode = google.maps.TravelMode[mode];
    }
  },



  addMarkersToMap() {
  const selectedItems = this.list.filter(item => this.selected[item.id]);
  selectedItems.forEach((item, index) => {
    let position;
    if (this.isCoordinates(item.direccion_d)) {
      const [lat, lng] = item.direccion_d.split(',').map(coord => parseFloat(coord.trim()));
      position = { lat, lng };
    } else {
      // Default position if no coordinates
      position = { lat: -16.5000, lng: -68.1500 };
    }

    // Ruta al archivo de imagen que has subido
    const markerImage = '/logo.png';  // Acceso directo al archivo en la carpeta static

    // Crear el marcador con la imagen personalizada en lugar de las letras
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      title: item.destinatario,  // O cualquier dato relevante del punto
      icon: {
        url: markerImage,  // Usar la imagen personalizada como marcador
        scaledSize: new google.maps.Size(80, 80),  // Ajustar el tamaño si es necesario
      },
      label: null  // Evitar que aparezcan letras (A, B, C)
    });

    this.markers.push(marker);  // Almacena el marcador para referencia futura
  });
}


    ,


    toggleMarker(item) {
      // Alterna la selección del elemento
      if (this.selected[item.id]) {
        delete this.selected[item.id];
      } else {
        this.$set(this.selected, item.id, true);
      }

      const selectedItems = Object.keys(this.selected)
        .map(id => this.list.find(m => m.id == id))
        .filter(item => item && this.isCoordinates(item.direccion_d));

      // Recalcula la ruta cada vez que se seleccionan elementos
      this.calculateRouteWithWaypoints(selectedItems);
    },
    formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;

    let durationStr = '';
    if (hours > 0) {
      durationStr += `${hours} h `;
    }
    if (minutes > 0) {
      durationStr += `${minutes} min `;
    }
    if (secondsLeft > 0 || durationStr === '') {
      durationStr += `${secondsLeft} s`;
    }
    return durationStr.trim();
  },

  formatDistance(meters) {
    if (meters >= 1000) {
      const km = meters / 1000;
      return `${km.toFixed(2)} km`;
    } else {
      return `${meters} m`;
    }
  },

  calculateRouteWithWaypoints(selectedItems, travelMode = google.maps.TravelMode.DRIVING) {
  // Verificar si la ubicación del usuario está disponible
  if (!this.userLocation) {
    this.$swal.fire({
      icon: 'error',
      title: 'Error de ubicación',
      text: 'No se ha podido obtener la ubicación actual.',
    });
    return;
  }

  // Preparar los waypoints para la ruta
  // Si hay más de un elemento seleccionado, los usamos como waypoints (excluyendo el primero)
  const waypoints = selectedItems.length > 1
    ? selectedItems.slice(1).map(item => ({
        location: new google.maps.LatLng(
          parseFloat(item.direccion_d.split(',')[0]),
          parseFloat(item.direccion_d.split(',')[1])
        ),
        stopover: true, // Indica que es un punto de parada
      }))
    : [];

  // Establecer el destino como la ubicación del primer elemento seleccionado
  const destination = new google.maps.LatLng(
    parseFloat(selectedItems[0].direccion_d.split(',')[0]),
    parseFloat(selectedItems[0].direccion_d.split(',')[1])
  );

  // Crear el objeto de solicitud para DirectionsService
  const request = {
    origin: this.userLocation, // Punto de inicio (ubicación del usuario)
    destination: destination,  // Punto final (primer elemento seleccionado)
    waypoints: waypoints,      // Puntos intermedios a visitar
    travelMode: travelMode,    // Modo de viaje (ej. DRIVING, WALKING)
    optimizeWaypoints: selectedItems.length > 1, // Optimiza el orden de los waypoints
  };

  // Llamar a DirectionsService para calcular la ruta
  this.directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      // Si la ruta se calculó exitosamente, la mostramos en el mapa
      this.directionsRenderer.setDirections(result);

      // Limpiar cualquier marcador existente en el mapa
      this.clearAllMarkers();

      const markerImage = '/logo.png'; // Ruta de la imagen personalizada para el marcador

      // Obtener la ruta calculada
      const route = result.routes[0];

      // Agregar marcadores en cada tramo (leg) de la ruta
      route.legs.forEach((leg, index) => {
        // Crear un marcador en la ubicación final de cada tramo
        const marker = new google.maps.Marker({
          position: leg.end_location,
          map: this.map,
          title: leg.end_address,
          icon: {
            url: markerImage, // Usar la imagen personalizada para el marcador
            scaledSize: new google.maps.Size(80, 80), // Ajustar el tamaño de la imagen
          },
        });
        // Almacenar el marcador para referencia futura
        this.markers.push(marker);
      });

      // Calcular la duración y distancia total de la ruta
      let totalDuration = 0;
      let totalDistance = 0;

      // Sumar la duración y distancia de cada tramo de la ruta
      route.legs.forEach(leg => {
        totalDuration += leg.duration.value; // Duración en segundos
        totalDistance += leg.distance.value; // Distancia en metros
      });

      // Formatear la duración y distancia total para mostrar
      const totalDurationText = this.formatDuration(totalDuration);
      const totalDistanceText = this.formatDistance(totalDistance);

      // Mostrar una alerta con el tiempo y distancia total
      this.$swal.fire({
        icon: 'info',
        title: 'Ruta calculada',
        html: `Tiempo total: ${totalDurationText}<br>Distancia total: ${totalDistanceText}`,
      });
    } else {
      // Si hubo un error al calcular la ruta, mostrar un mensaje de error
      this.$swal.fire({
        icon: 'error',
        title: 'Error al calcular la ruta',
        text: 'No se ha podido calcular la ruta.',
      });
      console.error('Error al calcular la ruta:', status);
    }
  });
},






    addMarkersForAllPoints(selectedItems) {
      this.clearAllMarkers(); // Limpiar marcadores anteriores

      selectedItems.forEach(item => {
        const [lat, lng] = item.direccion_d.split(',').map(coord => parseFloat(coord.trim()));
        const position = { lat, lng };

        const marker = new google.maps.Marker({
          position,
          map: this.map,
          title: item.destinatario,
        });

        this.markers.push(marker);
      });
    },
    showCoordinatesError() {
      this.$swal.fire({
        icon: 'warning',
        title: 'Coordenadas no disponibles',
        text: 'Este registro no tiene latitud y longitud para mostrar en el mapa.',
      });
    },
    calculateRoute(destination) {
      if (!this.userLocation) {
        this.$swal.fire({
          icon: 'error',
          title: 'Error de ubicación',
          text: 'No se ha podido obtener la ubicación actual.',
        });
        return;
      }

      const request = {
        origin: this.userLocation,
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: google.maps.TravelMode.DRIVING,
      };

      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(result);
        } else {
          this.$swal.fire({
            icon: 'error',
            title: 'Error al calcular la ruta',
            text: 'No se ha podido calcular la ruta.',
          });
          console.error('Error al calcular la ruta:', status);
        }
      });
    },
    clearAllMarkers() {
  if (this.markers && Array.isArray(this.markers)) {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }
},

    updateMapWithSelectedPoints(selectedItems) {
      if (!this.userLocation) {
        this.$swal.fire({
          icon: 'error',
          title: 'Error de ubicación',
          text: 'No se ha podido obtener la ubicación actual.',
        });
        return;
      }

      // Limpiar marcadores anteriores y ruta
      this.clearAllMarkers();
      this.directionsRenderer.set('directions', null);

      // Añadir un marcador para la ubicación del usuario
      const userMarker = new google.maps.Marker({
  position: this.userLocation,
  map: this.map,
  title: 'Mi Ubicación',
  icon: {
    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Icono azul estándar
    scaledSize: new google.maps.Size(80, 80),
  },
});
this.markers.push(userMarker);


      // Añadir marcadores para cada punto seleccionado
      selectedItems.forEach((item, index) => {
        const [lat, lng] = item.direccion_d.split(',').map(coord => parseFloat(coord.trim()));
        const position = { lat, lng };

        const marker = new google.maps.Marker({
          position,
          map: this.map,
          title: `Punto ${String.fromCharCode(65 + index)}`, // A, B, C, ...
          label: String.fromCharCode(65 + index), // Añade etiquetas A, B, C, etc.
        });

        this.markers.push(marker);
      });

      // Si hay más de un punto, calcula la ruta
      if (selectedItems.length > 0) {
        this.calculateRouteWithWaypoints(selectedItems);
      }
    },





    ///////////////////////




    showMap() {
      const selectedItems = this.list.filter(item => this.selected[item.id]);

      if (selectedItems.length === 0) {
        this.$swal.fire({
          icon: 'warning',
          title: 'No hay elementos seleccionados',
          text: 'Por favor, seleccione al menos un elemento.',
        });
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          this.processMap(selectedItems, userLocation);
        }, error => {
          console.error(error);
          this.$swal.fire({
            icon: 'error',
            title: 'Error al obtener ubicación',
            text: 'No se pudo obtener su ubicación actual.',
          });
        });
      } else {
        this.$swal.fire({
          icon: 'error',
          title: 'Geolocalización no soportada',
          text: 'Su navegador no soporta geolocalización.',
        });
      }
    },

    processMap(selectedItems, userLocation) {
      const waypoints = selectedItems.map(item => {
        if (this.isCoordinates(item.direccion_d)) {
          return item.direccion_d.trim();
        } else if (item.direccion_especifica_d) {
          return encodeURIComponent(item.direccion_especifica_d.trim());
        } else {
          return null;
        }
      }).filter(item => item !== null);

      if (waypoints.length === 0) {
        this.$swal.fire({
          icon: 'warning',
          title: 'Sin direcciones válidas',
          text: 'No se encontraron direcciones válidas en los elementos seleccionados.',
        });
        return;
      }

      this.openGoogleMaps(userLocation, waypoints);
    },

    openGoogleMaps(userLocation, waypoints) {
      let url = 'https://www.google.com/maps/dir/?api=1';

      // Establecer el origen como la ubicación del usuario
      url += `&origin=${userLocation.lat},${userLocation.lng}`;

      if (waypoints.length === 1) {
        // Solo un destino
        url += `&destination=${waypoints[0]}`;
      } else {
        // Múltiples destinos: último como destino, anteriores como waypoints
        const destination = waypoints.pop();
        const waypointsParam = waypoints.join('|');
        url += `&destination=${destination}`;
        url += `&waypoints=${waypointsParam}`;
      }

      // Abrir la URL en una nueva pestaña
      const mapWindow = window.open(url, '_blank');
      if (!mapWindow) {
        this.$swal.fire({
          icon: 'error',
          title: 'Bloqueo de ventanas emergentes',
          text: 'Por favor, habilite las ventanas emergentes para esta aplicación.',
        });
      }
    },

    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async confirmRechazar() {
      this.load = true;

      try {
        const originalImage = this.uploadedImage;
        const optimizedImage = await this.optimizeImage(originalImage);
        const formattedDate = this.getFormattedDate();

        await this.$api.$put(`rechazado/${this.selectedSolicitudeId}`, {
          observacion: this.observacion,
          fecha_d: formattedDate,
          imagen: optimizedImage,
          imagen_original: originalImage,
        });

        await this.GET_DATA(this.apiUrl);
        this.showSuccessMessage();
        this.resetForm();
      } catch (e) {
        console.error(e);
        this.showErrorMessage();
      } finally {
        this.load = false;
      }
    },

    async optimizeImage(imageDataUrl) {
      const pica = Pica();
      const img = new Image();
      img.src = imageDataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = 750;
      canvas.height = img.height * (750 / img.width);

      await pica.resize(img, canvas);
      const optimizedImageDataUrl = canvas.toDataURL('image/webp', 0.3);
      return optimizedImageDataUrl;
    },

    getFormattedDate() {
      const now = new Date();
      const options = { timeZone: 'America/La_Paz' };
      return now.toLocaleDateString('es-ES', options) + ' ' + now.toLocaleTimeString('es-ES', options);
    },

    showSuccessMessage() {
      this.$swal.fire({
        icon: 'success',
        title: 'Solicitud ha sido Retornada',
        text: `La solicitud ha sido marcada como 'Devuelta a destino' con la observación.`,
      });
    },

    showErrorMessage() {
      this.$swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al devolver la solicitud a destino.',
      });
    },

    resetForm() {
      this.isObservationModalVisible = false;
      this.observacion = '';
      this.uploadedImage = '';
    },
    openObservationModal(id) {
      this.selectedSolicitudeId = id;
      this.isObservationModalVisible = true;
    },

    async markAsEnCamino(solicitudeId) {
      this.load = true;
      try {
        const carteroId = this.user.user.id;
        await this.$api.$put(`solicitudesrecojo/${solicitudeId}`, { cartero_recogida_id: carteroId });
        await this.GET_DATA(this.apiUrl);
        this.$swal.fire({
          icon: 'success',
          title: 'Cartero asignado',
          text: `La solicitud ${solicitudeId} ha sido marcada como 'En camino'.`,
        });
        await this.GET_DATA(this.apiUrl);
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
      const res = await this.$api.$get(path);
      this.list = Array.isArray(res) ? res : [];
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        await this.$api.$delete(this.apiUrl + '/' + id);
        await this.GET_DATA(this.apiUrl);
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
          const response = await this.$api.$put(`solicitudesentrega/${id}`, { cartero_entrega_id: carteroId, peso_v: item.peso_v });
          Object.assign(item, response);
          await this.GET_DATA(this.apiUrl);
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },
    openAssignModal() {
      this.selectedItemsData = this.list.filter(item => this.selected[item.id]).map(item => ({
        id: item.id,
        guia: item.guia,
        sucursale: item.sucursale,
        peso_v: item.peso_v || 0
      }));
      this.isModalVisible = true;
    },
    handleSearchEnter() {
      this.selectedItemsData = this.filteredData;
      if (this.selectedItemsData.length > 0) {
        this.isModalVisible = true;
      }
    },
    async confirmAssignSelected() {
      this.load = true;
      try {
        const carteroId = this.user.user.id;
        for (let item of this.selectedItemsData) {
          if (item && item.id) {
            await this.$api.$put(`solicitudesentrega/${item.id}`, { cartero_entrega_id: carteroId, peso_v: item.peso_v });
          } else {
            console.error('Item inválido:', item);
          }
        }
        await this.GET_DATA(this.apiUrl);
        this.$swal.fire({
          icon: 'success',
          title: 'Carteros asignados',
          text: 'Todos los carteros seleccionados han sido asignados.',
        });
        this.isModalVisible = false;
        this.selected = {};
        await this.GET_DATA(this.apiUrl);
      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al asignar los carteros.',
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
    },
    // Función actualizada para manejar coordenadas y direcciones
    getMapRoute(item) {
      if (this.isCoordinates(item.direccion_d)) {
        const [lat, lng] = item.direccion_d.split(',').map(coord => coord.trim());
        return {
          path: '/map',
          query: { lat, lng }
        };
      } else if (item.direccion_especifica_d) {
        return {
          path: '/map',
          query: { address: item.direccion_especifica_d }
        };
      }
      // Retorna una ruta vacía o una ruta por defecto si no hay datos
      return {};
    },
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
        this.initializeMap(); // Inicializar el mapa después de obtener los datos

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
  border: 1px solid #000000;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.card-header {
  background-color: #34447C;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
}

/* Estilos generales de la tabla */
.table-responsive {
  max-width: 100%;
  overflow-x: auto !important;
  /* Asegura el scroll horizontal */
  white-space: nowrap;
  /* Mantiene el texto en una línea */
}

.table {
  width: 100%;
  table-layout: auto;
  text-align: center;
  vertical-align: middle;
}

.table th {
  background-color: #6c7a89;
  color: #FFFFFF;
  border-bottom: 2px solid #34447C;
  font-size: 16px;
  text-align: center;
  white-space: nowrap;
}

.table td {
  font-size: 16px;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.table-hover tbody tr:hover {
  background-color: #F8F9FA;
}

/* Estilos para los botones */
.btn-primary {
  background-color: #34447C;
  border-color: #34447C;
}

.btn-primary:hover {
  background-color: #4a5a7a;
}

.btn {
  width: 100%;
  margin-bottom: 5px;
  font-size: 14px;
}

.btn i {
  margin-right: 5px;
}

.search-input-container {
  width: 100%;
}

.search-input {
  width: 100%;
}

/* Para pantallas pequeñas (móviles) */
@media (max-width: 768px) {
  .search-input-container {
    width: 100%;
    margin-bottom: 10px;
  }

  .search-input {
    width: 100%;
  }

  .table-responsive {
    overflow-x: scroll;
  }

  .table thead {
    display: none;
  }

  .table tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
  }

  .table td {
    display: flex;
    justify-content: space-between;
    padding: 5px;
    border: none;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
  }

  .table td::before {
    content: attr(data-label);
    flex: 1;
    font-weight: bold;
    color: #34447C;
    text-align: left;
    padding-right: 5px;
    font-size: 14px;
  }

  .btn {
    font-size: 14px;
    padding: 8px 12px;
  }

  .btn i {
    margin-right: 5px;
  }

  #observacion {
    width: 100%;
    resize: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }
}

/* Ajustes para pantallas más pequeñas */
@media (max-width: 360px) {
  .table td {
    font-size: 12px;
    padding: 4px;
  }

  .table td::before {
    font-size: 12px;
  }

  .btn {
    font-size: 12px;
    padding: 4px 8px;
  }

  .btn i {
    margin-right: 4px;
  }

  .search-input {
    width: 100%;
  }
}

#map {
  width: 100%;
  height: 100vh;
}

.transportation-options {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.transportation-options .btn {
  padding: 10px;
  border-radius: 5px;
  background-color: #f0f0f0;
}

.transportation-options .btn:hover {
  background-color: #e0e0e0;
}
</style>
