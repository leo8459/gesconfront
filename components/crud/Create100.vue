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
  // import jsPDF from 'jspdf';
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
  
  //     generatePDF(data) {
  //   if (!data) {
  //     console.error('No data provided to generate the PDF');
  //     return;
  //   }
  
  //   const doc = new jsPDF('portrait', 'mm', 'letter');
  //   const fontSize = 10;
  //   doc.setFontSize(fontSize);
  
  //   const guia = data.guia || '';
  //   const codigoBarras = data.codigo_barras || '';
  //   const remitente = data.remitente || '';
  //   const telefono = data.telefono || '';
  //   const contenido = data.contenido || '';
  //   const destinatario = data.destinatario || '';
  //   const telefono_d = data.telefono_d || '';
  //   const direccion_especifica_d = data.direccion_especifica_d || '';
  //   const ciudad_d = data.ciudad || '';
  //   const zona_d = data.zona_d || '';
  
  //   const fecha = data.fecha || '';
  //   const fecha_entrega = data.fecha_d || '';
  //   const peso = data.peso_r || '';
  //   const importe = data.importe || '';
  //   const sucursal = data.sucursale || {};
  //   const tarifa = data.tarifa || {};
  //   const origen = sucursal.origen || '';
  //   const destino = tarifa.departamento || '';
  
  //   const direccion = data.direccion || {};
  //   const direccionEspecifica = direccion.direccion_especifica || '';
  //   const zona = direccion.zona || '';
  //   const ciudad = direccion.ciudad || '';
  
  //   let startX = 20;
  //   let startY = 10;
  //   let cellHeight = 10;
  //   let cellHeightFirma = 12;
  //   let cellHeightFirma2 = 15;
  //   let col1Width = 40;
  //   let col2Width = 40;
  //   let col3Width = 100;
  
  //   const drawGuide = (startX, startY) => {
  //     doc.setFontSize(fontSize);
  //     doc.rect(startX, startY, col1Width + col2Width, cellHeight * 3);
  //     doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight * 3);
  
  //     const barcodeX = startX + col1Width + col2Width + 5;
  //     const barcodeY = startY + 10;
  //     const barcodeWidth = 70;
  //     const barcodeHeight = 8;
  
  //     if (EMSImage) {
  //       doc.addImage(EMSImage, 'PNG', startX + 2, startY + 2, 30, 10);
  //     }
  
  //     if (codigoBarras !== '') {
  //       doc.addImage(codigoBarras, 'JPEG', barcodeX, barcodeY, barcodeWidth, barcodeHeight);
  //     }
  
  //     const textWidth = doc.getTextWidth(guia);
  //     const textX = barcodeX + (barcodeWidth - textWidth) / 2;
  //     doc.text(guia, textX, barcodeY - 3);
  
  //     startY += cellHeight * 2;
  //     doc.rect(startX, startY, col1Width + col2Width, cellHeight);
  //     doc.text(`Remitente y origen:  ${remitente}   ${origen},`, startX + 2, startY + 7);
  
  //     doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight);
  //     doc.text(`Destinatario y destino: ${destinatario}   ${destino}`, startX + col1Width + col2Width + 2, startY + 7);
  
  //     startY += cellHeight;
  //     doc.rect(startX, startY, col1Width + col2Width, cellHeight);
  //     doc.text(`Dirección: ${direccionEspecifica}`, startX + 2, startY + 4);
  //     doc.text(`Zona: ${zona}`, startX + 2, startY + 8);
  
  //     doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight);
  //     doc.text(`Direccion: ${direccion_especifica_d}`, startX + col1Width + col2Width + 2, startY + 4);
  //     doc.text(`Zona: ${zona_d}, Municipio: ${ciudad_d} `, startX + col1Width + col2Width + 2, startY + 8);
  
  //     startY += cellHeight;
  //     doc.rect(startX, startY, col1Width + col2Width, cellHeight);
  //     doc.text(`Telefono: ${telefono}`, startX + 2, startY + 7);
  
  //     doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight);
  //     doc.text(`Telefono: ${telefono_d}`, startX + col1Width + col2Width + 2, startY + 7);
  
  //     startY += cellHeight;
  //     doc.rect(startX, startY, col1Width + col2Width, cellHeight);
  //     doc.text(`Descripcion: ${contenido}`, startX + 2, startY + 7);
  
  //     doc.rect(startX + col1Width + col2Width, startY, col3Width / 2, cellHeight);
  //     doc.text(`Fecha: ${fecha}`, startX + col1Width + col2Width + 2, startY + 7);
  
  //     doc.rect(startX + col1Width + col2Width + col3Width / 2, startY, col3Width / 2, cellHeight);
  //     doc.text(`Fecha entrega: ${fecha_entrega}`, startX + col1Width + col2Width + col3Width / 2 + 2, startY + 7);
  
  //     startY += cellHeight;
  //     doc.rect(startX, startY, col1Width, cellHeightFirma);
  //     doc.text(`Contratos: ${importe}`, startX + 2, startY + 7);
  
  //     doc.rect(startX + col1Width, startY, col2Width, cellHeightFirma);
  //     doc.text(`Peso: ${peso}`, startX + col1Width + 2, startY + 7);
  
  //     doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeightFirma2);
  //     doc.text('Firma:', startX + col1Width + col2Width + 2, startY + 7);
  
  //     return startY + cellHeightFirma2; // Devuelve la nueva posición de Y después de la última fila
  //   };
  
  //   // Dibuja la primera guía y coloca la leyenda
  //   let lastY = drawGuide(startX, startY);
  //   doc.setFontSize(8);
  //   doc.text('Esta guia debe ir en la correspondencia rotulada', startX + 2, lastY + 1); // Añade la leyenda justo debajo
  
  //   // Dibuja la segunda guía y coloca la leyenda
  //   lastY = drawGuide(startX, startY + 90);
  //   doc.setFontSize(8);
  //   doc.text('Copia de guia', startX + 2, lastY + 1); // Añade la leyenda justo debajo
  
  //   // Dibuja la tercera guía y coloca la leyenda
  //   lastY = drawGuide(startX, startY + 180);
  //   doc.setFontSize(8);
  //   doc.text('Copia de guia', startX + 2, lastY + 1); // Añade la leyenda justo debajo
  
  //   doc.save(`Solicitud-${guia}.pdf`);
  // }
  
  async generatePDF(data) {
  if (typeof window !== 'undefined') {
    const { jsPDF } = await import('jspdf');
    if (!data) {
      console.error('No se proporcionaron datos para generar el PDF');
      return;
    }

    const doc = new jsPDF('landscape', 'mm', 'letter');
    const fontSize = 16;
    doc.setFontSize(fontSize);

    const guia = data.guia || '';
    const codigoBarras = data.codigo_barras || '';
    const remitente = data.remitente || '';
    const destinatario = data.destinatario || '';
    const direccion_especifica_d = data.direccion_especifica_d || '';
    const origen = data.sucursale ? data.sucursale.origen : '';
    const destino = (data.tarifa ? data.tarifa.departamento : '') || data.reencaminamiento || '';
    const direccionEspecifica = data.direccion ? data.direccion.direccion_especifica : '';
    const telefono = data.telefono || '';
    const telefono_d = data.telefono_d || '';
    const drawWrappedLine = (text, x, y, maxWidth, maxLines = 2) => {
      const rawLines = doc.splitTextToSize(text || '', maxWidth);
      const lines = rawLines.slice(0, maxLines);
      if (rawLines.length > maxLines && lines.length) {
        const last = lines[lines.length - 1];
        lines[lines.length - 1] = `${last.slice(0, Math.max(0, last.length - 3))}...`;
      }
      doc.text(lines, x, y);
    };

    let startX = 10;
    let startY = 10;
    let cellHeight = 15;
    let cellWidth = 135;
    const checkboxSize = 4;  // Tamaño del checkbox

    // Sección de Remitente
    doc.setFontSize(fontSize); // Aplica el nuevo tamaño de letra
    doc.rect(startX, startY, cellWidth, cellHeight);
    drawWrappedLine(`REMITENTE: ${remitente}`, startX + 2, startY + 8, cellWidth - 6, 2);

    const barcodeCellHeight = cellHeight * 3;
    doc.rect(startX + cellWidth, startY, cellWidth, barcodeCellHeight);
    doc.text('', startX + cellWidth + 10, startY + 10);

    if (codigoBarras) {
        const barcodeX = startX + cellWidth + 15;
        const barcodeY = startY + 18;
        const barcodeWidth = 75;
        const barcodeHeight = 10;
        
        doc.addImage(codigoBarras, 'JPEG', barcodeX, barcodeY, barcodeWidth, barcodeHeight);
        const textWidth = doc.getTextWidth(guia);
        const textX = barcodeX + (barcodeWidth - textWidth) / 2;
        doc.text(guia, textX, barcodeY + barcodeHeight + 5);
    }

    startY += cellHeight;
    doc.rect(startX, startY, cellWidth, cellHeight);
    doc.text(`TELEFONO: ${telefono}`, startX + 2, startY + 10);

    startY += cellHeight;
    doc.rect(startX, startY, cellWidth, cellHeight);
    doc.text(`Direccion: ${direccionEspecifica}`, startX + 2, startY + 10);

    startY += cellHeight;
    doc.rect(startX, startY, cellWidth, cellHeight);
    doc.text(`Departamento: ${origen}`, startX + 2, startY + 10);

    startY += cellHeight;
    doc.rect(startX, startY, cellWidth / 2, cellHeight * 2);
    doc.text('DEVOLUCION', startX + 2, startY + 10);
    doc.text('RETOUR', startX + 2, startY + 20);

    doc.setFontSize(fontSize + 2); // Tamaño de letra más grande para "CN 15"
    doc.rect(startX + cellWidth / 2, startY, cellWidth / 2, cellHeight * 2);
    doc.text('CN 15', startX + cellWidth / 2 + 10, startY + 15);
    doc.setFontSize(fontSize); // Regresa al tamaño de letra base

    doc.rect(startX + cellWidth, startY, cellWidth, cellHeight * 2);
    drawWrappedLine(`DESTINATARIO: ${destinatario}`, startX + cellWidth + 2, startY + 8, cellWidth - 6, 2);

    startY += cellHeight * 2;

    // Configuración dinámica para el texto en las celdas de la izquierda con checkbox
    const leftCellTexts = [
        { topText: 'Se Mudó', bottomText: 'Déménagé' },
        { topText: 'Desconocido', bottomText: 'Inconnu' },
        { topText: 'Direccion Insuficiente', bottomText: 'Adresse Insuffisante' }
    ];

    // Llenado dinámico de las celdas a la izquierda con checkbox dentro de la celda y alineado a la derecha
    leftCellTexts.forEach(cell => {
        doc.rect(startX, startY, cellWidth / 2, cellHeight); // Celda completa
        doc.text(cell.topText, startX + 2, startY + 7);
        doc.text(cell.bottomText, startX + 2, startY + 14);

        // Checkbox alineado a la derecha dentro de la celda
        doc.rect(startX + cellWidth / 2 - checkboxSize - 2, startY + (cellHeight - checkboxSize) / 2, checkboxSize, checkboxSize);
        
        startY += cellHeight;
    });

    // Configuración dinámica para el texto en las celdas de la derecha con checkbox
    const rightCellTexts = [
        { topText: 'No Reclamado', bottomText: 'Non Réclamé' },
        { topText: 'Rechazado', bottomText: 'Refusé' },
        { topText: 'Se Asentó', bottomText: 'Parti' }
    ];

    // Llenado dinámico de las celdas a la derecha con checkbox dentro de la celda y alineado a la derecha
    startY -= cellHeight * 3;  // Regresa al inicio de la sección para la derecha
    rightCellTexts.forEach(cell => {
        doc.rect(startX + cellWidth / 2, startY, cellWidth / 2, cellHeight); // Celda completa
        doc.text(cell.topText, startX + cellWidth / 2 + 2, startY + 7);
        doc.text(cell.bottomText, startX + cellWidth / 2 + 2, startY + 14);

        // Checkbox alineado a la derecha dentro de la celda
        doc.rect(startX + cellWidth - checkboxSize - 2, startY + (cellHeight - checkboxSize) / 2, checkboxSize, checkboxSize);

        startY += cellHeight;
    });

    // Información del Destinatario
    startY -= cellHeight * 3;  // Regresa para alinear con el inicio de las celdas de la izquierda
    doc.rect(startX + cellWidth, startY, cellWidth, cellHeight);
    doc.text(`TELEFONO DESTINATARIO: ${telefono_d}`, startX + cellWidth + 10, startY + 10);

    startY += cellHeight;
    doc.rect(startX + cellWidth, startY, cellWidth, cellHeight);
    doc.text(`Direccion: ${direccion_especifica_d}`, startX + cellWidth + 10, startY + 10);

    startY += cellHeight;
    doc.rect(startX + cellWidth, startY, cellWidth, cellHeight);
    doc.text(`Departamento: ${destino}`, startX + cellWidth + 10, startY + 10);

    // Línea final de puntos en el Footer
    startY += cellHeight;
    doc.rect(startX, startY, cellWidth * 2, cellHeight);
    doc.text('................................................................................................................', startX + 2, startY + 10);

    doc.save(`Solicitud-${guia}.pdf`);
  } else {
    console.error('La generación de PDF solo se puede realizar en el cliente.');
  }}



  
  
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
  
