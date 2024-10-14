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
                    <label for="">Justificación</label>
                    <input type="text" v-model="model.justificacion" class="form-control" id="justificacion" >
                  </div>
                  
                </div>

                <!-- Input para la imagen de justificación -->
                <input type="text" v-model.trim="model.imagen_justificacion" class="form-control" id="imagen_justificacion" placeholder="Imagen">

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

               
                <!-- Nuevo botón para subir PDF -->
                <div id="pdf-upload" class="mb-3 text-center">
                  <label class="border border-black rounded-2 w-100 bg-white pt-5 pb-5">
                    <div class="d-flex justify-content-center">
                      <div class="d-flex flex-column px-5 pt-4">
                        <i class="fa-solid fa-file-pdf fa-bounce fa-5x" style="color: #FF6347;"></i>
                        <p>Subir PDF</p>
                      </div>
                    </div>
                    <input type="file" accept=".pdf" @change="handlePDFUpload" class="d-none">
                  </label>
                </div>

                <!-- Botón para descargar PDF -->
                <div class="mb-3 text-center">
                  <button v-if="model.pdf_justificacion" @click="descargarPDF" class="btn btn-primary">Descargar PDF Subido</button>
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
import { openDB } from 'idb';

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
        imagen_justificacion: '',
        justificacion: '',
        pdf_justificacion: '', // Campo para almacenar el PDF subido

      },
      apiUrl: "solicitudes4",
      page: "solicitudes",
      modulo: "Agbc",
      sucursales: [],
      carteros: [],
      ini_vigencia: '',
      fin_vigencia: ''
    };
  },
  methods: {
    async handlePDFUpload(event) {
  const file = event.target.files[0];

  if (file && file.type === "application/pdf") {
    const reader = new FileReader();
    reader.onload = async () => {
      const fileContent = reader.result;

      // Guardar el archivo PDF en IndexedDB
      const db = await openDB('pdf-storage', 1, {
        upgrade(db) {
          db.createObjectStore('pdfs', { keyPath: 'id' });
        },
      });

      // Almacenar el PDF en el caché del navegador (IndexedDB)
      await db.put('pdfs', { id: this.model.id, content: fileContent });
      this.model.pdf_justificacion = fileContent; // Actualizar el modelo para visualizar el PDF

      // Mostrar alerta de éxito
      Swal.fire({
        icon: "success",
        title: "PDF subido con éxito",
        text: "El archivo PDF ha sido guardado temporalmente.",
      });
    };

    reader.readAsDataURL(file); // Leer el archivo como base64
  } else {
    Swal.fire({
      icon: "error",
      title: "Archivo inválido",
      text: "Solo se permiten archivos PDF.",
    });
  }
},


    // Método para descargar el PDF almacenado en IndexedDB
    async descargarPDF() {
      const db = await openDB('pdf-storage', 1);
      const pdfData = await db.get('pdfs', 'uploadedPDF');

      if (pdfData && pdfData.content) {
        const link = document.createElement('a');
        link.href = pdfData.content;
        link.download = 'justificacion.pdf'; // Nombre del archivo descargado
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontró ningún PDF almacenado.',
        });
      }
    },

    async GET_DATA(path) {
      const res = await this.$contratos.$get(path);
      return res;
    },

    async darDeBaja() {
    
      try {
        this.model.estado = 4;
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        this.model.fecha_d = `${day}/${month}/${year} ${hours}:${minutes}`;
        await this.$contratos.$put(`${this.apiUrl}/${this.model.id}`, this.model);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'El registro ha sido dado Justificado.'
        }).then(() => {
          window.history.back();
        });
      } catch (error) {
        console.error('Error al dar de baja:', error);
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
  } catch (e) {
    console.log(e);
  } finally {
    this.load = false;
  }

 

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
                const maxWidth = 1000; // Ancho máximo
                const maxHeight = 1000; // Alto máximo

                let width = img.width;
                let height = img.height;

                // Escalar la imagen_justificacion a las dimensiones más pequeñas posibles
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

                // Comprimir la imagen_justificacion en formato WebP lo máximo posible
                let quality = 0.4; // Calidad baja
                let dataurl = canvas.toDataURL('image/webp', quality);

                // Intentar reducir el tamaño por debajo de 1 KB
                while (dataurl.length > 100000 && quality > 0.01) {
                    quality -= 0.01;
                    dataurl = canvas.toDataURL('image/webp', quality);
                }

                console.log('imagen_justificacion final en base64:', dataurl);
                this.model.imagen_justificacion = dataurl; // Guardar la imagen_justificacion comprimida en el modelo
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
