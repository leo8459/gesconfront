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
  import QRCode from 'qrcode';

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
    // Validar que los campos requeridos estén llenos
   
    if (!this.model.remitente) {
      this.showAlert('El campo "Remitente" es obligatorio.');
      return;
    }
    if (!this.model.telefono) {
      this.showAlert('El campo "Teléfono" es obligatorio.');
      return;
    }
    if (!this.model.contenido) {
      this.showAlert('El campo "Contenido" es obligatorio.');
      return;
    }
    if (!this.model.tarifa_id) {
      this.showAlert('El campo "Destino y Servicio" es obligatorio.');
      return;
    }
    if (!this.model.direccion_id) {
      this.showAlert('El campo "Dirección de Recojo" es obligatorio.');
      return;
    }
    if (!this.model.destinatario) {
      this.showAlert('El campo "Destinatario" es obligatorio.');
      return;
    }
    if (!this.model.telefono_d) {
      this.showAlert('El campo "Teléfono del Destinatario" es obligatorio.');
      return;
    }
    if (!this.model.direccion_especifica_d) {
      this.showAlert('El campo "Dirección Específica del Destinatario" es obligatorio.');
      return;
    }
    if (!this.model.zona_d) {
      this.showAlert('El campo "Zona del Destinatario" es obligatorio.');
      return;
    }

    // Si todas las validaciones pasan, continuar con el guardado
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

  showAlert(message) {
    this.$swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      showConfirmButton: true,
    });
  },
  
  async generatePDF(data) {
  if (!data) {
    console.error('No data provided to generate the PDF');
    return;
  }

  const doc = new jsPDF('portrait', 'mm', 'letter');
  const fontSize = 10;
  doc.setFontSize(fontSize);

  // Extraer los datos necesarios de 'data'
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

  // Generar el código QR con la guía
  const qrCodeDataUrl = await QRCode.toDataURL(guia);

  // Configuraciones iniciales de posición y tamaño
  let startX = 20;
  let startY = 10;
  let cellHeight = 10;
  let cellHeightFirma = 12;
  let cellHeightFirma2 = 15;
  let col1Width = 40;
  let col2Width = 40;
  let col3Width = 100;

  const drawGuide = (startX, startY) => {
    doc.setFontSize(fontSize);
    doc.rect(startX, startY, col1Width + col2Width, cellHeight * 3);
    doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight * 3);

    const barcodeX = startX + col1Width + col2Width + 5;
    const barcodeY = startY + 5;
    const barcodeWidth = 70;
    const barcodeHeight = 8;

    // Agregar imagen EMS si la tienes
    if (EMSImage) {
      doc.addImage(EMSImage, 'PNG', startX + 1, startY + 2, 30, 10);
    }

    // Agregar código de barras
    if (codigoBarras !== '') {
      doc.addImage(codigoBarras, 'JPEG', barcodeX, barcodeY, barcodeWidth, barcodeHeight);
    }

    // Agregar el número de guía debajo del código de barras
    const textWidth = doc.getTextWidth(guia);
    const textX = barcodeX + (barcodeWidth - textWidth) / 2;
    doc.text(guia, textX, barcodeY + barcodeHeight + 4);

    // Agregar código QR al lado del código de barras
    const qrX = barcodeX + barcodeWidth + 5; // Ajusta la posición en X si es necesario
    const qrY = barcodeY - 3; // Ajusta la posición en Y si es necesario
    const qrSize = 20; // Tamaño del QR code

    doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

    // Continuar con el resto del diseño del PDF
    // Remitente y origen
    startY += cellHeight * 2;
    doc.rect(startX, startY, col1Width + col2Width, cellHeight);
    doc.text(`Remitente y origen:  ${remitente}   ${origen}`, startX + 2, startY + 7);

    // Destinatario y destino
    doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight);
    doc.text(`Destinatario y destino: ${destinatario}   ${destino}`, startX + col1Width + col2Width + 2, startY + 7);

    // Direcciones
    startY += cellHeight;
    doc.rect(startX, startY, col1Width + col2Width, cellHeight);
    doc.text(`Dirección: ${direccionEspecifica}`, startX + 2, startY + 4);
    doc.text(`Zona: ${zona}`, startX + 2, startY + 8);

    doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight);
    doc.text(`Dirección: ${direccion_especifica_d}`, startX + col1Width + col2Width + 2, startY + 4);
    doc.text(`Zona: ${zona_d}, Municipio: ${ciudad_d}`, startX + col1Width + col2Width + 2, startY + 8);

    // Teléfonos
    startY += cellHeight;
    doc.rect(startX, startY, col1Width + col2Width, cellHeight);
    doc.text(`Teléfono: ${telefono}`, startX + 2, startY + 7);

    doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight);
    doc.text(`Teléfono: ${telefono_d}`, startX + col1Width + col2Width + 2, startY + 7);

    // Descripción y fechas
    startY += cellHeight;
    doc.rect(startX, startY, col1Width + col2Width, cellHeight);
    doc.text(`Descripción: ${contenido}`, startX + 2, startY + 7);

    doc.rect(startX + col1Width + col2Width, startY, col3Width / 2, cellHeight);
    doc.text(`Fecha: ${fecha}`, startX + col1Width + col2Width + 2, startY + 7);

    doc.rect(startX + col1Width + col2Width + col3Width / 2, startY, col3Width / 2, cellHeight);
    doc.text(`Fecha entrega: ${fecha_entrega}`, startX + col1Width + col2Width + col3Width / 2 + 2, startY + 7);

    // Contratos, peso y firma
    startY += cellHeight;
    doc.rect(startX, startY, col1Width, cellHeightFirma);
    doc.text(`Contratos: ${importe}`, startX + 2, startY + 7);

    doc.rect(startX + col1Width, startY, col2Width, cellHeightFirma);
    doc.text(`Peso: ${peso}`, startX + col1Width + 2, startY + 7);

    doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeightFirma2);
    doc.text('Firma:', startX + col1Width + col2Width + 2, startY + 7);

    return startY + cellHeightFirma2; // Devuelve la nueva posición de Y después de la última fila
  };

  // Dibuja la primera guía y coloca la leyenda
  let lastY = drawGuide(startX, startY);
  doc.setFontSize(8);
  doc.text('Esta guía debe ir en la correspondencia rotulada', startX + 2, lastY + 4);

  // Dibuja la segunda guía
  lastY = drawGuide(startX, lastY + 10);
  doc.text('Copia de guía', startX + 2, lastY + 4);

  // Dibuja la tercera guía
  lastY = drawGuide(startX, lastY + 10);
  doc.text('Copia de guía', startX + 2, lastY + 4);

  // Guardar el PDF con el nombre basado en la guía
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
  