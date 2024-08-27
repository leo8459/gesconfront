<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <div class="row">
      <div class="col-12">
        <slot name="body"></slot>
      </div>
      <div class="col-12">
        <div class="row">
          <div class="col-6">
            <button class="btn btn-info w-100" @click="$router.back()">
              Regresar
            </button>
          </div>
          <div class="col-6">
            <button class="btn btn-dark w-100" @click="Save()">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';

export default {
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    apiUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      load: false,
    };
  },
  methods: {
    async Save() {
  this.load = true;
  try {
    const res = await this.$sucursales.$post(this.apiUrl, this.model);
    console.log('Respuesta completa del servidor:', res);  // Esto debería mostrar el objeto completo con todos los datos
    
    // En lugar de res.data, accede directamente a res
    if (res) {
      this.generatePDF(res);  // Pasa res directamente a generatePDF
    } else {
      console.error('No se recibieron datos desde el servidor.');
    }

    this.$swal
      .fire({
        title: "Guardado!",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "Ok",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.$router.back();
        }
      });
  } catch (e) {
    console.log(e);
  } finally {
    this.load = false;
  }
}

,

generatePDF(data) {
  if (!data) {
    console.error('No data provided to generate the PDF');
    return;
  }

  console.log('Generating PDF with data:', data);  // Esto debería mostrar los datos recibidos correctamente

  const doc = new jsPDF();

  // Usar valores por defecto si alguna propiedad es undefined o null
  const guia = data.guia || 'N/A';
  const remitente = data.remitente || 'N/A';
  const telefono = data.telefono || 'N/A';
  const contenido = data.contenido || 'N/A';
  const destinatario = data.destinatario || 'N/A';
  const telefono_d = data.telefono_d || 'N/A';
  const direccion_d = data.direccion_d || 'N/A';
  const ciudad = data.ciudad || 'N/A';
  const fecha = data.fecha || 'N/A';

  // Agregar contenido al PDF
  doc.text(`Número de Guía: ${guia}`, 10, 10);
  doc.text(`Remitente: ${remitente}`, 10, 20);
  doc.text(`Teléfono Remitente: ${telefono}`, 10, 30);
  doc.text(`Contenido: ${contenido}`, 10, 40);
  doc.text(`Destinatario: ${destinatario}`, 10, 50);
  doc.text(`Teléfono Destinatario: ${telefono_d}`, 10, 60);
  doc.text(`Dirección Destino: ${direccion_d}`, 10, 70);
  doc.text(`Provincia: ${ciudad}`, 10, 80);
  doc.text(`Fecha: ${fecha}`, 10, 90);

  // Generar y descargar el PDF
  doc.save(`Solicitud-${guia}.pdf`);
}

  },
  mounted() {
    this.$nextTick(async () => {
      try {
        // Realiza cualquier tarea que necesites al montar el componente
      } catch (e) {
        console.log(e);
      } finally {
        // Finaliza cualquier tarea de montaje si es necesario
      }
    });
  },
};
</script>
