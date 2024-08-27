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

const doc = new jsPDF('portrait', 'mm', 'a4'); // Orientación vertical, unidad en milímetros, tamaño A4
const fontSize = 9; // Tamaño de la fuente reducido para mejor ajuste
doc.setFontSize(fontSize);

// Variables de datos
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
const fecha_entrega = data.fecha_d || ''; // Fecha de entrega adicional
const peso = data.peso_r || '';
const importe = data.importe || '';
const sucursal = data.sucursale || {};
const tarifa = data.tarifa || {};
const origen = sucursal.origen || '';
const destino = tarifa.departamento || '';

// Datos de la dirección (Recuperar desde la propiedad de dirección en data)
const direccion = data.direccion || {}; 
const direccionEspecifica = direccion.direccion_especifica || '';
const zona = direccion.zona || '';
const ciudad = direccion.ciudad || '';


// Configuración general
let startX = 10;
let startY = 10;
let cellHeight = 12; // Altura de las celdas
let col1Width = 40; // Ancho de la primera columna
let col2Width = 40; // Ancho de la segunda columna
let col3Width = 100; // Ancho de la tercera columna

// Función para dibujar una guía
const drawGuide = (startX, startY) => {
    // Fila 1: Nro de guía y código de barras
    doc.setFontSize(fontSize);
    doc.rect(startX, startY, col1Width + col2Width, cellHeight * 3); // Celda vacía a la izquierda
    doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight * 3); // Celda para código de barras y número de guía

    // Agregar el código de barras
    const barcodeX = startX + col1Width + col2Width + 5;
    const barcodeY = startY + 10;
    const barcodeWidth = 60;
    const barcodeHeight = 7.5;
    if (codigoBarras !== '') {
        doc.addImage(codigoBarras, 'JPEG', barcodeX, barcodeY, barcodeWidth, barcodeHeight);
    }

    // Centrar el número de guía debajo del código de barras
    const textWidth = doc.getTextWidth(guia);
    const textX = barcodeX + (barcodeWidth - textWidth) / 2;
    doc.text(guia, textX, barcodeY - 3); // Ajustar la posición para centrar

    // Fila 2: Remitente y ORIGEN, OF. DESTINO
    startY += cellHeight * 2;
    doc.rect(startX, startY, col1Width + col2Width, cellHeight); // Remitente y ORIGEN
    doc.text(`Remitente y origen:  ${remitente}   ${origen},`, startX + 2, startY + 7);

    doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight); // OF. DESTINO
    doc.text(`Destinatario y destino: ${destinatario}   ${destino}`, startX + col1Width + col2Width + 2, startY + 7);

    // Fila 3: Dirección específica, zona y ciudad
    startY += cellHeight;
    doc.rect(startX, startY, col1Width + col2Width, cellHeight); // DIRECCION ESPECÍFICA
    doc.text(`Dirección: ${direccionEspecifica}`, startX + 2, startY + 4);
    doc.text(`Zona: ${zona}`, startX + 2, startY + 8);

    doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight); // NOMBRE DESTINATARIO
    doc.text(`Direccion: ${direccion_especifica_d}`, startX + col1Width + col2Width + 2, startY + 4);
    doc.text(`Zona: ${zona_d}`, startX + col1Width + col2Width + 2, startY + 8);
    doc.text(`Municipio: ${ciudad_d}`, startX + col1Width + col2Width + 2, startY + 12);

    // Fila 4: Dirección y Teléfono del Remitente y Destinatario
    startY += cellHeight;
    doc.rect(startX, startY, col1Width + col2Width, cellHeight); // DIRECCION Y TELEFONO REMITENTE
    doc.text(`Telefono: ${telefono}`, startX + 2, startY + 7);

    doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight); // DIRECCION Y TELEFONO DESTINATARIO
    doc.text(`Telefono: ${telefono_d}`, startX + col1Width + col2Width + 2, startY + 7);

    // Fila 5: Descripción y Fecha
    startY += cellHeight;
    doc.rect(startX, startY, col1Width + col2Width, cellHeight); // DESCRIPCIÓN
    doc.text(`Descripcion: ${contenido}`, startX + 2, startY + 7);

    // Dividir la celda de fecha en dos celdas para "Fecha" y "Fecha Entrega"
    doc.rect(startX + col1Width + col2Width, startY, col3Width / 2, cellHeight); // FECHA
    doc.text(`Fecha: ${fecha}`, startX + col1Width + col2Width + 2, startY + 7);

    doc.rect(startX + col1Width + col2Width + col3Width / 2, startY, col3Width / 2, cellHeight); // FECHA_ENTREGA
    doc.text(`Fecha entrega: ${fecha_entrega}`, startX + col1Width + col2Width + col3Width / 2 + 2, startY + 7);

    // Fila 6: Importe, Peso y Firma
    startY += cellHeight;
    doc.rect(startX, startY, col1Width, cellHeight); // IMPORTE
    doc.text(`Importe: ${importe}`, startX + 2, startY + 7);

    doc.rect(startX + col1Width, startY, col2Width, cellHeight); // PESO
    doc.text(`Peso: ${peso}`, startX + col1Width + 2, startY + 7);

    doc.rect(startX + col1Width + col2Width, startY, col3Width, cellHeight); // Firma AGBC
    doc.text('Firma:', startX + col1Width + col2Width + 2, startY + 7);
   
};

// Dibujar las tres guías en la página
drawGuide(startX, startY);
drawGuide(startX, startY + 100); // Ajustar la posición Y para la segunda guía
drawGuide(startX, startY + 200); // Ajustar la posición Y para la tercera guía

// Guardar el PDF
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
