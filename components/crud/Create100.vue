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
    if (typeof window === 'undefined') {
      console.error('La generacion de PDF solo se puede realizar en el cliente.');
      return;
    }

    const { jsPDF } = await import('jspdf');
    if (!data) {
      console.error('No se proporcionaron datos para generar el PDF');
      return;
    }

    const doc = new jsPDF('landscape', 'mm', 'letter');
    const fontSize = 13;
    const lineHeight = 5;
    const checkboxSize = 4;
    doc.setFontSize(fontSize);

    const guia = data.guia || '';
    const codigoBarras = data.codigo_barras || '';
    const remitente = data.remitente || '';
    const destinatario = data.destinatario || '';
    const direccionEspecifica = (data.direccion && data.direccion.direccion_especifica) || '';
    const direccionDest = data.direccion_especifica_d || '';
    const telefono = data.telefono || '';
    const telefonoDest = data.telefono_d || '';
    const origen = (data.sucursale && data.sucursale.origen) || '';
    const destino = (data.tarifa && data.tarifa.departamento) || data.reencaminamiento || '';
    const provinciaDestinatario = (data.ciudad || (this.model && this.model.ciudad) || '').trim();
    const departamentoProvinciaDestinatario = provinciaDestinatario
      ? `Departamento: ${destino || '-'} | Provincia: ${provinciaDestinatario}`
      : `Departamento: ${destino || '-'}`;

    const startX = 10;
    const leftWidth = 135;
    const rightWidth = 135;
    const halfLeft = leftWidth / 2;

    const getWrappedLines = (text, maxWidth, maxLines = 0) => {
      const rawText = (text || '').toString();
      const lines = doc.splitTextToSize(rawText, maxWidth);
      if (!maxLines || lines.length <= maxLines) return lines.length ? lines : [''];
      const trimmed = lines.slice(0, maxLines);
      const lastIndex = trimmed.length - 1;
      const lastLine = (trimmed[lastIndex] || '').toString();
      trimmed[lastIndex] = `${lastLine.substring(0, Math.max(0, lastLine.length - 3))}...`;
      return trimmed;
    };

    const getRowHeight = (lines, minHeight = 12, paddingY = 3) => {
      return Math.max(minHeight, (lines.length * lineHeight) + (paddingY * 2));
    };

    const drawCellWithLines = (x, y, width, height, lines, paddingX = 2, paddingTop = 4) => {
      doc.rect(x, y, width, height);
      lines.forEach((line, idx) => {
        doc.text(line, x + paddingX, y + paddingTop + (idx * lineHeight));
      });
    };

    let y = 10;

    const remitenteLines = getWrappedLines(`REMITENTE: ${remitente}`, leftWidth - 6, 3);
    const telefonoLines = getWrappedLines(`TELEFONO: ${telefono}`, leftWidth - 6, 2);
    const direccionOrigenLines = getWrappedLines(`Direccion: ${direccionEspecifica}`, leftWidth - 6, 3);
    const departamentoOrigenLines = getWrappedLines(`Departamento: ${origen || '-'}`, leftWidth - 6, 2);

    const hRem = getRowHeight(remitenteLines, 13);
    const hTel = getRowHeight(telefonoLines, 11);
    const hDir = getRowHeight(direccionOrigenLines, 13);
    const hDept = getRowHeight(departamentoOrigenLines, 11);
    const barcodeBlockHeight = hRem + hTel + hDir;

    drawCellWithLines(startX, y, leftWidth, hRem, remitenteLines);
    drawCellWithLines(startX, y + hRem, leftWidth, hTel, telefonoLines);
    drawCellWithLines(startX, y + hRem + hTel, leftWidth, hDir, direccionOrigenLines);

    doc.rect(startX + leftWidth, y, rightWidth, barcodeBlockHeight);
    if (codigoBarras) {
      const barcodeWidth = Math.min(75, rightWidth - 24);
      const barcodeHeight = 10;
      const barcodeX = startX + leftWidth + ((rightWidth - barcodeWidth) / 2);
      const barcodeY = y + Math.max(8, (barcodeBlockHeight - barcodeHeight - 8) / 2);
      doc.addImage(codigoBarras, 'JPEG', barcodeX, barcodeY, barcodeWidth, barcodeHeight);
      const textWidth = doc.getTextWidth(guia);
      const textX = barcodeX + ((barcodeWidth - textWidth) / 2);
      const guiaY = Math.min(barcodeY + barcodeHeight + 5, y + barcodeBlockHeight - 2);
      doc.text(guia, textX, guiaY);
    }

    y += barcodeBlockHeight;
    drawCellWithLines(startX, y, leftWidth, hDept, departamentoOrigenLines);
    y += hDept;

    const destinatarioLines = getWrappedLines(`DESTINATARIO: ${destinatario}`, rightWidth - 6, 4);
    const hDestinatario = getRowHeight(destinatarioLines, 20);
    const hReturnBlock = Math.max(20, hDestinatario);

    doc.rect(startX, y, halfLeft, hReturnBlock);
    doc.text('DEVOLUCION', startX + 2, y + 7);
    doc.text('RETOUR', startX + 2, y + 13);

    doc.rect(startX + halfLeft, y, halfLeft, hReturnBlock);
    doc.setFontSize(fontSize + 2);
    doc.text('CN 15', startX + halfLeft + 10, y + (hReturnBlock / 2) + 1);
    doc.setFontSize(fontSize);

    drawCellWithLines(startX + leftWidth, y, rightWidth, hReturnBlock, destinatarioLines);
    y += hReturnBlock;

    const leftCellTexts = [
      { topText: 'Se Mudo', bottomText: 'Demenage' },
      { topText: 'Desconocido', bottomText: 'Inconnu' },
      { topText: 'Direccion Insuficiente', bottomText: 'Adresse Insuffisante' },
    ];
    const rightCellTexts = [
      { topText: 'No Reclamado', bottomText: 'Non Reclamado' },
      { topText: 'Rechazado', bottomText: 'Refuse' },
      { topText: 'Se Asento', bottomText: 'Parti' },
    ];

    const rightInfoLines = [
      getWrappedLines(`TELEFONO DESTINATARIO: ${telefonoDest}`, rightWidth - 12, 2),
      getWrappedLines(`Direccion: ${direccionDest}`, rightWidth - 12, 3),
      getWrappedLines(departamentoProvinciaDestinatario, rightWidth - 12, 3),
    ];
    const rowHeights = rightInfoLines.map(lines => getRowHeight(lines, 14));

    for (let i = 0; i < 3; i += 1) {
      const rowHeight = rowHeights[i];

      doc.rect(startX, y, halfLeft, rowHeight);
      doc.text(leftCellTexts[i].topText, startX + 2, y + 6);
      doc.text(leftCellTexts[i].bottomText, startX + 2, y + 12);
      doc.rect(
        startX + halfLeft - checkboxSize - 2,
        y + ((rowHeight - checkboxSize) / 2),
        checkboxSize,
        checkboxSize
      );

      doc.rect(startX + halfLeft, y, halfLeft, rowHeight);
      doc.text(rightCellTexts[i].topText, startX + halfLeft + 2, y + 6);
      doc.text(rightCellTexts[i].bottomText, startX + halfLeft + 2, y + 12);
      doc.rect(
        startX + leftWidth - checkboxSize - 2,
        y + ((rowHeight - checkboxSize) / 2),
        checkboxSize,
        checkboxSize
      );

      drawCellWithLines(startX + leftWidth, y, rightWidth, rowHeight, rightInfoLines[i], 10, 6);
      y += rowHeight;
    }

    const footerHeight = 12;
    doc.rect(startX, y, leftWidth + rightWidth, footerHeight);
    doc.text(
      '................................................................................................................',
      startX + 2,
      y + 8
    );

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
  
