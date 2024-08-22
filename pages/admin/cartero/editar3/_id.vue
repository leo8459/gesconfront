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
                    <label for="fecha_d">Fin Fecha</label>
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
    this.model.estado = 10;
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this.model.fecha_d = `${day}/${month}/${year} ${hours}:${minutes}`;
    await this.$api.$put(`${this.apiUrl}/${this.model.id}`, this.model);
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'La correspondencia a sido entregada con exito'
    }).then(() => {
      window.location.href = 'http://localhost:3005/cartero/encaminoregionalcarteros/encaminoregionalcartero'; // Redirigir a la URL especificada
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al dar de baja el registro.'
    });
  }
}

  },
  mounted() {
    this.$nextTick(async () => {
    try {
      const routeData = await this.GET_DATA(this.apiUrl + '/' + this.$route.params.id);
      this.model = routeData;
      this.sucursales = await this.GET_DATA('sucursales');
    } catch (e) {
      console.log(e);
    } finally {
      this.load = false;
    }

    // Código relacionado con la firma (sin cambios)
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
      Swal.fire({
        icon: 'success',
        title: 'Firma registrada',
        text: 'Firma registrada exitosamente.'
      });
    });

    // Manejo de la captura de foto con límite de tamaño muy bajo
    var fileInput = document.getElementById('capturephoto');

    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Definir una resolución baja
            const maxWidth = 1750; // Ancho máximo
            const maxHeight = 1750; // Alto máximo

            let width = img.width;
            let height = img.height;

            // Escalar la imagen a las dimensiones más pequeñas posibles
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
            ctx.drawImage(img, 0, 0, width, height);

            // Comprimir la imagen en formato WebP lo máximo posible
            let quality = 0.4; // Calidad baja
            let dataurl = canvas.toDataURL('image/webp', quality);

            // Intentar reducir el tamaño por debajo de 1 KB
            while (dataurl.length > 100000 && quality > 0.01) {
              quality -= 0.01;
              dataurl = canvas.toDataURL('image/webp', quality);
            }

            this.model.imagen = dataurl; // Guardar la imagen comprimida en el modelo

            // Mostrar alerta cuando se sube una foto
            Swal.fire({
              icon: 'success',
              title: 'Foto registrada',
              text: 'La foto se ha subido exitosamente.'
            });
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
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
