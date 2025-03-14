<template>
  <div>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-center">
          <div class="col-sm-8 col-12">
            <div class="card">
              <div class="card-header">
                <h3>Agregar Código</h3>
              </div>
              <div class="card-body">
                <CrudCreate5 :model="model" :apiUrl="apiUrl">
                  <div slot="body" class="row">

                    <!-- Selección de Sucursal -->
                    <div class="form-group col-12">
                      <label for="sucursale_id">Sucursal</label>
                      <select v-model="model.sucursale_id" class="form-control" id="sucursale_id">
                        <option v-for="sucursal in sucursales" :key="sucursal.id" :value="sucursal.id">
                          {{ sucursal.nombre }} ({{ sucursal.codigo_cliente }})
                        </option>
                      </select>
                    </div>

                    <!-- Cantidad de Códigos -->
                    <div class="form-group col-12">
                      <label for="cantidad">Cantidad de Códigos</label>
                      <input type="number" v-model="model.cantidad" class="form-control" id="cantidad" min="1" />
                    </div>

                    <!-- Correlativo de inicio (opcional) -->
                    <div class="form-group col-12">
                      <label for="correlativo_inicio">Correlativo de Inicio (Opcional)</label>
                      <input type="number" v-model="model.correlativo_inicio" class="form-control" id="correlativo_inicio" min="1" />
                    </div>

                    <!-- Mensaje de carga -->
                    <div v-if="loading" class="col-12 text-center">
                      <div class="alert alert-info">
                        <i class="fas fa-spinner fa-spin"></i> Generando códigos, espere por favor...
                      </div>
                    </div>

                    <!-- Botón para Generar Códigos -->
                    <div class="form-group col-12 text-center">
                      <button @click="crearCodigo" class="btn btn-primary" :disabled="loading">
                        <i class="fas fa-save"></i> Crear Código(s)
                      </button>
                    </div>

                  </div> <!-- /slot="body" -->
                </CrudCreate5>
              </div> <!-- /card-body -->
            </div> <!-- /card -->
          </div> <!-- /col -->
        </div> <!-- /row -->
      </div> <!-- /slot="body" -->
    </AdminTemplate>
  </div>
</template>

<script>
import { jsPDF } from 'jspdf';

export default {
  data() {
    return {
      model: {
        sucursale_id: '',
        cantidad: 1,
        correlativo_inicio: null
      },
      apiUrl: 'codigos',
      sucursales: [],
      barcodes: [],
      page: 'Generar Códigos',
      modulo: 'AGBC',
      load: true,
      loading: false // Variable para mostrar mensaje de carga
    };
  },

  methods: {
    async obtenerSucursales() {
      try {
        const res = await this.$administrador.$get('sucursales1');
        this.sucursales = res;
      } catch (error) {
        console.error('Error al obtener sucursales:', error);
      }
    },

    async crearCodigo() {
      this.loading = true; // Mostrar mensaje de carga

      try {
        const res = await this.$administrador.$post(this.apiUrl, this.model);
        console.log('Códigos generados:', res);

        this.barcodes = res.codigos.map(item => ({
          base64: item.barcode,
          code: item.codigo
        }));

        this.$swal.fire({
          title: 'Éxito',
          text: 'Código(s) creado(s) correctamente',
          icon: 'success',
        });

        this.descargarPdf();
      } catch (error) {
        console.error('Error al crear código:', error);
        this.$swal.fire({
          title: 'Error',
          text: 'Hubo un problema al generar los códigos',
          icon: 'error',
        });
      } finally {
        this.loading = false; // Ocultar mensaje de carga después de terminar
      }
    },

    async descargarPdf() {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'legal'
    });

    const marginLeft = 0; // Sin márgenes laterales
    const marginTop = 30;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const imgWidth = 170.1; // 1 cm de ancho
    const imgHeight =  28.35; // 6 cm de largo
    const rowHeight = imgHeight + 40; // Espaciado entre filas
    const codesPerRow = 4;
    
    // Se ajusta el espaciado horizontal para aprovechar todo el ancho de la hoja
    const colSpacing = (pageWidth - (imgWidth * codesPerRow)) / (codesPerRow - 1);
    const textOffset = 20;

    let xPos = marginLeft;
    let yPos = marginTop;

    let repeatedBarcodes = [];
    this.barcodes.forEach(barcode => {
        for (let i = 0; i < 4; i++) {
            repeatedBarcodes.push(barcode);
        }
    });

    for (let i = 0; i < repeatedBarcodes.length; i++) {
        const colIndex = i % codesPerRow;

        // Ajuste de posición sin márgenes laterales
        xPos = marginLeft + (colIndex * (imgWidth + colSpacing));

        const { base64, code } = repeatedBarcodes[i];
        const dataUrl = `data:image/png;base64,${base64}`;

        // Agregar código de barras
        doc.addImage(dataUrl, 'PNG', xPos, yPos, imgWidth, imgHeight);

        // Agregar texto debajo del código de barras
        doc.setFontSize(10);
        doc.text(code, xPos + (imgWidth / 2) - (doc.getTextWidth(code) / 2), yPos + imgHeight + textOffset);

        // Salto de fila
        if (colIndex === codesPerRow - 1 || i === repeatedBarcodes.length - 1) {
            yPos += rowHeight;

            // Salto de página si la fila siguiente no cabe
            if (yPos + rowHeight > pageHeight) {
                doc.addPage();
                yPos = marginTop;
            }
        }
    }

    doc.save('barcodes.pdf');
}





  },

  mounted() {
    this.obtenerSucursales();
  },
};
</script>
