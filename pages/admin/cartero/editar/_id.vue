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
                <div slot="body" class="row">
                  
                  <div class="form-group col-12">
                    <label for="firma_d">Firma Destino</label>
                    <input type="text" v-model.trim="model.firma_d" class="form-control d-none" id="firma_d">
                    <div class="position-relative">
                      <canvas id="canvas2" class="border border-2 rounded-3 bg-white" width="560px"
                        height="250px"></canvas>
                      <div class="btn-canvas">
                        <button type="button" id="guardar2" class="btn btn-primary">Guardar</button>
                        <button type="button" id="limpiar2" class="btn btn-secondary">Limpiar</button>
                      </div>
                    </div>
                  </div>
                  <div class="form-group col-12">
                    <input type="text" v-model="model.fecha_d" class="form-control d-none" id="fecha_d" disabled>
                  </div>
                </div>
                <input type="text" v-model.trim="model.imagen" class="form-control d-none" id="imagen" placeholder="imagen"> <!-- Añadir d-none aquí -->
                <div id="div2" class="mb-3 text-center">

                  <label class="border border-black rounded-2 w-100 bg-white pt-5 pb-5">
                    <div class="d-flex justify-content-center">
                      <div class="d-flex flex-column px-5 pt-4">
                        <i class="fa-solid fa-image fa-bounce fa-5x" style="color: #74C0FC;"></i>
                        <p>Sacar Foto</p>
                      </div>
                    </div>
                    <input type="file" accept="image/*" id="capturephoto" capture="camera" class="d-none">
                  </label>
                </div>
                <button class="btn btn-danger" @click="darDeBaja">Entregar Correspondencia</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>
  </div>
</template>

<script>
import SignaturePad from 'signature_pad';
import Swal from 'sweetalert2';

export default {
  name: "IndexPage",
  head() {
    return {
      title: "solicitudes",
    };
  },
  data() {
    return {
      load: true,
      model: {
        sucursale_id: '',
        cartero_id: '',
        guia: '',
        peso_o: '',
        peso_v: '',
        remitente: '',
        direccion: '',
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
        imagen: '',
      },
      apiUrl: "solicitudes",
      page: "solicitudes",
      modulo: "Agbc",
      sucursales: [],
      carteros: [],
      ini_vigencia: '',
      fin_vigencia: ''
    };
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$api.$get(path);
      return res;
    },

    async darDeBaja() {
    if (!this.model.firma_d && !this.model.imagen) {
      Swal.fire({
        icon: 'warning',
        title: 'Firma o foto requerida',
        text: 'Debes proporcionar una firma o una foto.'
      });
      return;
    }

    try {
      // Mostrar la alerta de envío de Gmail
      Swal.fire({
        title: 'Enviando Gmail de confirmación de entrega a empresa...',
        text: 'Por favor espera mientras se envía la confirmación.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Cambiar el estado del modelo y agregar la fecha de entrega
      this.model.estado = 3;
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      this.model.fecha_d = `${day}/${month}/${year} ${hours}:${minutes}`;

      // Aquí deberías realizar la lógica para enviar el correo Gmail
      // Puedes usar una API en el servidor o servicio de terceros para enviar el correo

      // Simulación de la llamada a la API (puedes reemplazar esto con tu lógica de envío real)
      await this.$api.$put(`${this.apiUrl}/${this.model.id}`, this.model);

      // Actualizar la alerta con el éxito del envío
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'La correspondencia ha sido entregada con éxito. El Gmail de confirmación ha sido enviado.'
      }).then(() => {
        window.history.back();
      });
    } catch (error) {
      // En caso de error al enviar el correo o al actualizar el registro
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al dar de baja el registro o enviar el correo.'
      });
    }
  }

  },
  mounted() {
    this.$nextTick(async () => {
      try {
        // Obtener los datos de la solicitud a editar
        const routeData = await this.GET_DATA(this.apiUrl + '/' + this.$route.params.id);
        this.model = routeData;
        // Obtener la lista de sucursales
        this.sucursales = await this.GET_DATA('sucursales');
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false; // Indicar que la carga ha terminado
      }

      // --- Configuración de la firma digital ---

      // Obtener el elemento canvas para la firma
      var canvas2 = document.getElementById('canvas2');
      // Crear una instancia de SignaturePad asociada al canvas
      var signaturePad2 = new SignaturePad(canvas2);
      // Obtener los botones de limpiar y guardar
      var clearButton2 = document.getElementById('limpiar2');
      var generateButton2 = document.getElementById('guardar2');

      // Evento para limpiar el canvas (borrar la firma)
      clearButton2.addEventListener('click', () => {
        signaturePad2.clear(); // Limpiar el canvas
        this.model.firma_d = ""; // Limpiar la firma en el modelo
      });

      // Evento para guardar la firma
      generateButton2.addEventListener('click', () => {
        var firma2 = signaturePad2.toDataURL(); // Convertir la firma a una imagen en formato DataURL
        this.model.firma_d = firma2; // Guardar la firma en el modelo
        Swal.fire({
          icon: 'success',
          title: 'Firma registrada',
          text: 'Firma registrada exitosamente.'
        });
      });

      // --- Manejo de la captura de foto ---

      // Obtener el input de archivo para capturar la foto
      var fileInput = document.getElementById('capturephoto');

      // Evento que se dispara cuando se selecciona una foto
      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]; // Obtener el archivo seleccionado
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');

              // Definir dimensiones máximas para redimensionar la imagen
              const maxWidth = 1750; // Ancho máximo
              const maxHeight = 1750; // Alto máximo

              let width = img.width;
              let height = img.height;

              // Redimensionar la imagen manteniendo la proporción
              if (width > height) {
                if (width > maxWidth) {
                  height *= maxWidth / width;
                  width = maxWidth;
                }
              } else {
                if (height > maxHeight) {
                  width *= maxHeight / height;
                  height = maxHeight;
                }
              }

              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height); // Dibujar la imagen en el canvas redimensionado

              // Comprimir la imagen en formato WebP con calidad baja
              let quality = 0.4; // Calidad inicial
              let dataurl = canvas.toDataURL('image/webp', quality);

              // Reducir la calidad si el tamaño supera 100 KB
              while (dataurl.length > 100000 && quality > 0.01) {
                quality -= 0.01;
                dataurl = canvas.toDataURL('image/webp', quality);
              }

              this.model.imagen = dataurl; // Guardar la imagen comprimida en el modelo

              // Mostrar alerta indicando que la foto se ha registrado
              Swal.fire({
                icon: 'success',
                title: 'Foto registrada',
                text: 'La foto se ha subido exitosamente.'
              });
            };
            img.src = e.target.result; // Cargar la imagen en el objeto Image
          };
          reader.readAsDataURL(file); // Leer el archivo como DataURL
        }
      });

    });
  }
};
</script>

<style scoped>
.card.border-rounded {
  border-radius: 15px;
  border: 1px solid #dee2e6;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}
</style>
