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
import EMSImage from '@/pages/sucursal/sucursales/sucursal/img/EMS.png';

export default {
  props: {
    model: {
      type: Object,
      default: () => { }
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
        console.log('Respuesta completa del servidor:', res);

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
    },

    generatePDF(data) {
      if (!data) {
        console.error('No data provided to generate the PDF');
        return;
      }

      const doc = new jsPDF('portrait', 'mm', 'letter');
      const fontSize = 10;
      doc.setFontSize(fontSize);

      const guia = data.guia || '';
      const codigoBarras = data.codigo_barras || '';
      const remitente = data.remitente || '';
      const telefono = data.telefono || '';
      const contenido = data.contenido || '';
      const destinatario = data.destinatario || '';
      const telefono_d = data.telefono_d || '';
      const direccion_especifica_d = data.direccion_especifica_d || '';
      const ciudad_d = data.ciudad || '';
      const zona_d = data.zona_d || '';

      const fecha = data.fecha || '';
      const fecha_entrega = data.fecha_d || '';
      const peso = data.peso_r || '';
      const importe = data.importe || '';
      const sucursal = data.sucursale || {};
      const tarifa = data.tarifa || {};
      const origen = sucursal.origen || '';
      const destino = tarifa.departamento || '';

      const direccion = data.direccion || {};
      const direccionEspecifica = direccion.direccion_especifica || '';
      const zona = direccion.zona || '';
      const ciudad = direccion.ciudad || '';

      let startX = 20;
      let startY = 10;
      let cellHeight = 10;
      let cellHeightFirma = 12; // Ajuste de altura para la fila de la firma para mantener uniformidad
      let cellHeightFirma2 = 15; // Ajuste de altura para la fila de la firma para mantener uniformidad
      let col1Width = 40;
      let col2Width = 40;
      let col3Width = 100;

      const drawGuide = (startX, startY) => {
        doc.setFontSize(fontSize);
        doc.rect(startX, startY, col1Width + col2Width, cellHeight * 3);
        doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight * 3);

        const barcodeX = startX + col1Width + col2Width + 5;
        const barcodeY = startY + 10;
        const barcodeWidth = 60;
        const barcodeHeight = 7.5;

        if (EMSImage) {
          doc.addImage(EMSImage, 'PNG', startX + 2, startY + 2, 30, 10);
        }

        if (codigoBarras !== '') {
          doc.addImage(codigoBarras, 'JPEG', barcodeX, barcodeY, barcodeWidth, barcodeHeight);
        }

        const textWidth = doc.getTextWidth(guia);
        const textX = barcodeX + (barcodeWidth - textWidth) / 2;
        doc.text(guia, textX, barcodeY - 3);

        startY += cellHeight * 2;
        doc.rect(startX, startY, col1Width + col2Width, cellHeight);
        doc.text(`Remitente y origen:  ${remitente}   ${origen},`, startX + 2, startY + 7);

        doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight);
        doc.text(`Destinatario y destino: ${destinatario}   ${destino}`, startX + col1Width + col2Width + 2, startY + 7);

        startY += cellHeight;
        doc.rect(startX, startY, col1Width + col2Width, cellHeight);
        doc.text(`Dirección: ${direccionEspecifica}`, startX + 2, startY + 4);
        doc.text(`Zona: ${zona}`, startX + 2, startY + 8);

        doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight);
        doc.text(`Direccion: ${direccion_especifica_d}`, startX + col1Width + col2Width + 2, startY + 4);
        doc.text(`Zona: ${zona_d}, Municipio: ${ciudad_d} `, startX + col1Width + col2Width + 2, startY + 8);

        startY += cellHeight;
        doc.rect(startX, startY, col1Width + col2Width, cellHeight);
        doc.text(`Telefono: ${telefono}`, startX + 2, startY + 7);

        doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight);
        doc.text(`Telefono: ${telefono_d}`, startX + col1Width + col2Width + 2, startY + 7);

        startY += cellHeight;
        doc.rect(startX, startY, col1Width + col2Width, cellHeight);
        doc.text(`Descripcion: ${contenido}`, startX + 2, startY + 7);

        doc.rect(startX + col1Width + col2Width, startY, col3Width / 2, cellHeight);
        doc.text(`Fecha: ${fecha}`, startX + col1Width + col2Width + 2, startY + 7);

        doc.rect(startX + col1Width + col2Width + col3Width / 2, startY, col3Width / 2, cellHeight);
        doc.text(`Fecha entrega: ${fecha_entrega}`, startX + col1Width + col2Width + col3Width / 2 + 2, startY + 7);

        startY += cellHeight;
        doc.rect(startX, startY, col1Width, cellHeightFirma);
        doc.text(`Contratos: ${importe}`, startX + 2, startY + 7);

        doc.rect(startX + col1Width, startY, col2Width, cellHeightFirma);
        doc.text(`Peso: ${peso}`, startX + col1Width + 2, startY + 7);

        doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeightFirma2);
        doc.text('Firma:', startX + col1Width + col2Width + 2, startY + 7);
      };

      drawGuide(startX, startY);
      drawGuide(startX, startY + 90);
      drawGuide(startX, startY + 180);

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
