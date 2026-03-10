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
                    <label for="justificacion">Justificacion</label>
                    <input id="justificacion" v-model="model.justificacion" type="text" class="form-control">
                  </div>
                </div>

                <input
                  id="imagen_justificacion"
                  v-model.trim="model.imagen_justificacion"
                  type="text"
                  class="form-control"
                  placeholder="Imagen"
                >

                <div id="div2" class="mb-3 text-center">
                  <label class="border border-black rounded-2 w-100 bg-white pt-5 pb-5">
                    <div class="d-flex justify-content-center">
                      <div class="d-flex flex-column px-5 pt-4">
                        <i class="fa-solid fa-image fa-bounce fa-5x" style="color: #74C0FC;"></i>
                        <p>Sacar Foto</p>
                      </div>
                    </div>
                    <input id="capturephoto" type="file" accept="image/*" capture="camera" class="d-none">
                  </label>
                </div>

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

                <div class="mb-3 text-center">
                  <button v-if="model.pdf_justificacion" @click="descargarPDF" class="btn btn-primary">
                    Descargar PDF Subido
                  </button>
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
import Swal from 'sweetalert2';
import { openDB } from 'idb';

const PDF_DB_NAME = 'pdf-storage';
const PDF_DB_VERSION = 2;
const PDF_STORE_NAME = 'pdfs';

export default {
  name: 'IndexPage',
  head() {
    return {
      title: 'solicitudes',
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
        pdf_justificacion: '',
      },
      apiUrl: 'solicitudes4',
      page: 'solicitudes',
      modulo: 'Agbc',
      sucursales: [],
      carteros: [],
      ini_vigencia: '',
      fin_vigencia: ''
    };
  },
  methods: {
    async getPdfDb() {
      return openDB(PDF_DB_NAME, PDF_DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(PDF_STORE_NAME)) {
            db.createObjectStore(PDF_STORE_NAME, { keyPath: 'id' });
          }
        },
      });
    },

    async handlePDFUpload(event) {
      const file = event?.target?.files?.[0];

      if (!file || file.type !== 'application/pdf') {
        Swal.fire({
          icon: 'error',
          title: 'Archivo invalido',
          text: 'Solo se permiten archivos PDF.',
        });
        return;
      }

      try {
        const fileContent = await this.readFileAsDataUrl(file);
        const db = await this.getPdfDb();
        await db.put(PDF_STORE_NAME, { id: this.model.id, content: fileContent });
        this.model.pdf_justificacion = fileContent;

        Swal.fire({
          icon: 'success',
          title: 'PDF subido correctamente',
          text: 'El PDF esta subido correctamente.',
        });
      } catch (error) {
        console.error('Error al subir PDF:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo guardar el PDF.',
        });
      } finally {
        event.target.value = '';
      }
    },

    readFileAsDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },

    async descargarPDF() {
      const db = await this.getPdfDb();
      const pdfData = await db.get(PDF_STORE_NAME, this.model.id);

      if (pdfData && pdfData.content) {
        const link = document.createElement('a');
        link.href = pdfData.content;
        link.download = 'justificacion.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (this.model.pdf_justificacion) {
        const link = document.createElement('a');
        link.href = this.model.pdf_justificacion;
        link.download = 'justificacion.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontro ningun PDF almacenado.',
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
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        this.model.fecha_d = `${day}/${month}/${year} ${hours}:${minutes}`;
        await this.$contratos.$put(`${this.apiUrl}/${this.model.id}`, this.model);
        Swal.fire({
          icon: 'success',
          title: 'Exito',
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
    },

    bindImageCapture() {
      const fileInput = document.getElementById('capturephoto');
      if (!fileInput) {
        return;
      }

      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const maxWidth = 1000;
            const maxHeight = 1000;

            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            let quality = 0.4;
            let dataurl = canvas.toDataURL('image/webp', quality);

            while (dataurl.length > 100000 && quality > 0.01) {
              quality -= 0.01;
              dataurl = canvas.toDataURL('image/webp', quality);
            }

            this.model.imagen_justificacion = dataurl;
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    },

    async hydrateStoredPdf() {
      if (!this.model?.id) {
        return;
      }

      try {
        const db = await this.getPdfDb();
        const pdfData = await db.get(PDF_STORE_NAME, this.model.id);
        if (pdfData?.content) {
          this.model.pdf_justificacion = pdfData.content;
        }
      } catch (error) {
        console.error('Error al recuperar PDF:', error);
      }
    }
  },
  mounted() {
    this.$nextTick(async () => {
      try {
        const routeData = await this.GET_DATA(this.apiUrl + '/' + this.$route.params.id);
        this.model = routeData;
        await this.hydrateStoredPdf();
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }

      this.bindImageCapture();
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
