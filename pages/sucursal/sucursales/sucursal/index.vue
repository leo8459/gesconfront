<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
      <!-- Mensaje de advertencia si se excede el límite -->
      <div v-if="limiteTotal > 0 && totalNombreD >= limiteTotal" class="alert alert-custom" role="alert">
  Ha alcanzado o sobrepasado su límite presupuestario y no puede Solicitar nuevos envíos. Por favor, comuníquese con la Agencia Boliviana de Correos.
</div>


        <!-- Barra superior con botones de Agregar solo si no se ha excedido el límite -->
        <div v-else class="d-flex justify-content-between align-items-center mb-4">
          <div class="d-flex align-items-center">
            <!-- Botón para crear solicitud de Correspondencia -->
            <select @change="handleSelectChange" class="btn btn-dark btn-sm mr-3">
              <option value="" disabled selected>Crear solicitud de Correspondencia</option>
              <option value="url_nuevo2">Boleta Digital</option>
              <option value="url_nuevo">Boleta fisica</option>
            </select>

            <!-- Botón de Correspondencia Internacional -->
            <a href="https://ips.correos.gob.bo/CDS.Web/Operational/andeclaration.aspx" class="btn btn-dark btn-sm mr-3"
              target="_blank">
              <i class=""></i> Crear solicitud de Correspondencia Internacional
            </a>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-4">
          <button @click="imprimirRotulosDelDia" class="btn btn-primary btn-sm">
            Imprimir Rótulos del Día de Hoy
          </button>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-4">
      <!-- Botón para descargar la plantilla -->
      <button @click="descargarPlantilla" class="btn btn-dark btn-sm">
  Descargar Plantilla
</button>
    </div>
        <!-- Campo para buscar por código de barras -->
        <div class="row mb-3">
          <div class="col-6">
            <input v-model="codigoBarras" @keyup.enter="buscarPorCodigoBarras" class="form-control"
              placeholder="Buscar">
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                Solicitudes Pendientes
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th class="py-0 px-1">#</th>
                        <th class="py-0 px-1">Sucursal</th>
                        <th class="py-0 px-1">Número de Guía</th>
                        <th class="py-0 px-1">Nombre</th>
                        <th class="py-0 px-1">Dirección Específica</th>
                        <th class="py-0 px-1">Zona</th>
                        <th class="py-0 px-1">Dirección maps</th>
                        <th class="py-0 px-1">Peso (Kg)</th>
                        <th class="py-0 px-1">Remitente</th>
                        <th class="py-0 px-1">Teléfono</th>
                        <th class="py-0 px-1">Contenido</th>
                        <th class="py-0 px-1">Fecha de Solicitud</th>
                        <th class="py-0 px-1">Destinatario</th>
                        <th class="py-0 px-1">Teléfono Destinatario</th>
                        <th class="py-0 px-1">Dirección Destinatario maps</th>
                        <th class="py-0 px-1">Dirección Destinatario</th>
                        <th class="py-0 px-1">Ciudad/Departamento</th>
                        <th class="py-0 px-1">Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="(m, i) in paginatedList" :key="i">
                        <td class="py-0 px-1">{{ currentPage * itemsPerPage + i + 1 }}</td>
                        <td class="p-1">{{ m.sucursale ? m.sucursale.nombre : 'Sucursal no asignada' }}</td>
                        <td class="py-0 px-1">{{ m.guia }}</td>
                        <td class="py-0 px-1">{{ m.direccion ? m.direccion.nombre : 'Dirección no asignada' }}</td>
                        <td class="py-0 px-1">{{ m.direccion ? m.direccion.direccion_especifica : 'No especificada' }}</td>
                        <td class="py-0 px-1">{{ m.direccion ? m.direccion.zona : 'Zona no asignada' }}</td>
                        <td class="py-0 px-1">
  <a v-if="m.direccion && isCoordinates(m.direccion.direccion)"
     :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion.direccion"
     target="_blank" class="btn btn-primary btn-sm">
     Ver mapa
  </a>
  <span v-else>{{ m.direccion ? m.direccion.direccion : 'Dirección no disponible' }}</span>
</td>
                        <td class="py-0 px-1">{{ m.peso_o }}</td>
                        <td class="py-0 px-1">{{ m.remitente }}</td>
                        <td class="py-0 px-1">{{ m.telefono }}</td>
                        <td class="py-0 px-1">{{ m.contenido }}</td>
                        <td class="py-0 px-1">{{ m.fecha }}</td>
                        <td class="py-0 px-1">{{ m.destinatario }}</td>
                        <td class="py-0 px-1">{{ m.telefono_d }}</td>
                        <td class="py-0 px-1">
                          <a v-if="isCoordinates(m.direccion_d)"
                            :href="'https://www.google.com/maps/search/?api=1&query=' + m.direccion_d" target="_blank"
                            class="btn btn-primary btn-sm">
                            Ver mapa
                          </a>
                          <span v-else>{{ m.direccion_d }}</span>
                        </td>
                        <td class="py-0 px-1">{{ m.direccion_especifica_d }}</td>
                        <td class="py-0 px-1">{{ m.ciudad }}</td>
                        <td class="py-0 px-1">
                          <div class="btn-group">
                            <button type="button" @click="Eliminar(m.id)" class="btn btn-danger btn-sm py-1 px-2">
                              <i class="fas fa-trash trash-icon"></i>
                            </button>
                            <nuxtLink :to="url_editar + m.id" class="btn btn-info btn-sm py-1 px-2">
                              <i class="fas fa-pen"></i>
                            </nuxtLink>
                            <button type="button" @click="reprintPDF(m)" class="btn btn-warning btn-sm">
                              Imprimir Rotulo
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Paginación -->
                <nav aria-label="Page navigation">
                  <ul class="pagination justify-content-between">
                    <li class="page-item" :class="{ disabled: currentPage === 0 }">
                      <button class="page-link" @click="previousPage" :disabled="currentPage === 0">&lt;</button>
                    </li>
                    <li class="page-item" v-for="page in totalPages" :key="page"
                      :class="{ active: currentPage === page - 1 }">
                      <button class="page-link" @click="goToPage(page - 1)">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                      <button class="page-link" @click="nextPage"
                        :disabled="currentPage >= totalPages - 1">&gt;</button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>
  </div>
</template>

<script>
import { BCollapse } from 'bootstrap-vue';
import jsPDF from 'jspdf';
import EMSImage from '@/pages/sucursal/sucursales/sucursal/img/EMS.png';

export default {
  name: "IndexPage",
  components: {
    BCollapse
  },
  data() {
    return {
      load: true,
      list: [],
      apiUrl: 'solicitudes2',
      page: 'Solicitudes Pendientes',
      modulo: 'Solicitudes Pendientes',
      tarifas: [], // Inicializamos tarifas como un array vacío
      codigoBarras: '', // Para almacenar el código de barras ingresado
      url_nuevo: '/sucursal/sucursales/sucursal/nuevo',
      url_nuevo2: '/sucursal/sucursales/sucursal/nuevo2',
      url_editar: '/sucursal/sucursales/sucursal/editar/',
      user: {
        sucursale: []
      },
      currentPage: 0,
      itemsPerPage: 10,
      direcciones: [], // Agregar aquí la propiedad para almacenar las direcciones
      saldoRestante: null,
    limiteTotal: null,
    totalNombreD: null,
    plantillaUrl: '', // URL para descargar la plantilla

    };
  },
  computed: {
    filteredList() {
      return this.list.filter(item => item.sucursale.id === this.user.user.id && (item.estado === 1));
    },
    sortedList() {
      return this.filteredList.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },
    paginatedList() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.sortedList.length / this.itemsPerPage);
    }
  },
  methods: {
    async descargarPlantilla() {
    try {
        // Realiza la solicitud GET y especifica que la respuesta es de tipo blob
        const response = await this.$sucursales.$get('/descargar-plantilla', { responseType: 'blob' });
        
        // Crear un objeto URL desde el blob recibido
        const url = window.URL.createObjectURL(new Blob([response]));
        
        // Crear un enlace temporal para forzar la descarga
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'plantilla_solicitudes.xlsx'); // Nombre del archivo que se descargará
        
        // Añadir el enlace al documento y simular un clic
        document.body.appendChild(link);
        link.click();
        
        // Limpiar el enlace después de la descarga
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error al descargar la plantilla:', error);
    }
}
,
    reprintPDF(data) {
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
      const barcodeY = startY + 10;
      const barcodeWidth = 70;
      const barcodeHeight = 8;
  
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
  
      return startY + cellHeightFirma2; // Devuelve la nueva posición de Y después de la última fila
    };
  
    // Dibuja la primera guía y coloca la leyenda
    let lastY = drawGuide(startX, startY);
    doc.setFontSize(8);
    doc.text('Esta guia debe ir en la correspondencia rotulada', startX + 2, lastY + 1); // Añade la leyenda justo debajo
  
    // Dibuja la segunda guía y coloca la leyenda
    lastY = drawGuide(startX, startY + 90);
    doc.setFontSize(8);
    doc.text('Copia de guia', startX + 2, lastY + 1); // Añade la leyenda justo debajo
  
    // Dibuja la tercera guía y coloca la leyenda
    lastY = drawGuide(startX, startY + 180);
    doc.setFontSize(8);
    doc.text('Copia de guia', startX + 2, lastY + 1); // Añade la leyenda justo debajo
  
    doc.save(`Solicitud-${guia}.pdf`);
  },
    async fetchSaldoData() {
  try {
    const res = await this.$sucursales.$get('/restantesaldo2');
    // Asigna los valores de la respuesta a las variables reactivas
    this.saldoRestante = Number(res.saldo_restante);
    this.limiteTotal = Number(res.limite_total);
    this.totalNombreD = Number(res.total_nombre_d);
  } catch (error) {
    console.error('Error al obtener saldo:', error);
  }
},
    handleSelectChange(event) {
      const selectedValue = event.target.value;
      if (this[selectedValue]) {
        this.$router.push(this[selectedValue]);
      } else {
      }
    },
    getDireccionLabel(direccion_id) {
      if (!this.direcciones) {
        return 'Direcciones no cargadas';
      }
      const direccion = this.direcciones.find(d => d.id === direccion_id);
      return direccion ? `${direccion.nombre} - ${direccion.direccion_especifica}` : 'Dirección no encontrada';
    },

    async GET_DATA(path) {
      try {
        const res = await this.$sucursales.$get(path);
        return res;
      } catch (error) {
        return [];
      }
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        await this.$sucursales.$put(`${this.apiUrl}/${id}/destroy`);
        this.list = await this.GET_DATA(this.apiUrl);
        this.$swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Solicitud eliminada correctamente.',
        });
      } catch (e) {
        console.log(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al eliminar la solicitud.',
        });
      } finally {
        this.load = false;
      }
    },
    Eliminar(id) {
      this.$swal.fire({
        title: '¿Deseas eliminar?',
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.EliminarItem(id);
        }
      });
    },
    async buscarPorCodigoBarras() {
      try {
        const res = await this.$sucursales.$get('/solicitudes/buscar-por-codigo-barras', {
          params: {
            codigo_barras: this.codigoBarras
          }
        });

        if (res) {
          this.list = [res]; // Muestra solo la solicitud encontrada
        } else {
          this.$swal.fire({
            icon: 'error',
            title: 'No encontrado',
            text: 'No se encontró ninguna solicitud con ese código de barras.',
          });
        }
      } catch (e) {
        console.error('Error al buscar la solicitud:', e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al buscar la solicitud.',
        });
      }
    },
    getTarifaLabel(tarifa_id) {
      if (!this.tarifas) {
        return 'Tarifas no cargadas';
      }
      const tarifa = this.tarifas.find(t => t.id === tarifa_id);
      return tarifa ? tarifa.departamento : 'Tarifa no encontrada';
    },
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
      }
    },
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
    async imprimirRotulosDelDia() {
    const hoy = new Date().toISOString().slice(0, 10); // Obtiene la fecha actual en formato 'YYYY-MM-DD'

    // Filtra las solicitudes que tengan la fecha de hoy y un valor válido en 'fecha'
    const solicitudesDelDia = this.list.filter(solicitud => solicitud.fecha && solicitud.fecha.slice(0, 10) === hoy);

    if (solicitudesDelDia.length === 0) {
      this.$swal.fire({
        icon: 'info',
        title: 'No hay solicitudes',
        text: 'No se encontraron solicitudes para hoy.',
      });
      return;
    }

    // Crea un solo documento PDF
    const doc = new jsPDF('portrait', 'mm', 'letter');

    solicitudesDelDia.forEach((solicitud, index) => {
      // Genera el rótulo para cada solicitud
      this.dibujarRotuloEnPDF(doc, solicitud);

      // Añade una nueva página para la siguiente solicitud, excepto después de la última
      if (index < solicitudesDelDia.length - 1) {
        doc.addPage();
      }
    });

    // Guarda el documento como un archivo PDF único
    doc.save(`Rotulos_Dia_${hoy}.pdf`);
  },

  dibujarRotuloEnPDF(doc, data) {
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
      const barcodeY = startY + 10;
      const barcodeWidth = 70;
      const barcodeHeight = 8;

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

      return startY + cellHeightFirma2; // Devuelve la nueva posición de Y después de la última fila
    };

    // Dibuja la guía en la página actual del documento PDF
    drawGuide(startX, startY);
  },
    



  },
  mounted() {
  this.$nextTick(async () => {
    let user = localStorage.getItem('userAuth');
    this.user = JSON.parse(user);

    // Parte 1: Obtener el saldo restante y el total de nombre_d
    try {
      const res = await this.$sucursales.$get('/restantesaldo2');
      
      this.saldoRestante = Number(res.saldo_restante || 0);
      this.limiteTotal = Number(res.limite_total || 0);
      this.totalNombreD = Number(res.total_nombre_d || 0);

      if (this.saldoRestante <= 0 || this.totalNombreD >= this.limiteTotal) {
        // Aquí puedes manejar el caso en que se exceda el límite si es necesario
      }
    } catch (e) {
    }

    // Parte 2: Obtener la lista de solicitudes pendientes
    try {
      const data = await this.GET_DATA(this.apiUrl); // Llama a GET_DATA para recuperar los datos
      this.list = data; // Asigna los datos a this.list para que se muestren en la tabla
    } catch (e) {
    } finally {
      this.load = false;
    }
  });

}
};
</script>

<style scoped>
.card.border-rounded {
  border-radius: 15px;
  border: 1px solid #34447C;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.card-header {
  background-color: #34447C;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
}

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}

.table th,
.table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  vertical-align: middle;
}

.table th {
  background-color: #6c7a89;
  color: #FFFFFF;
  border-bottom: 2px solid #34447C;
}

.table-hover tbody tr:hover {
  background-color: #F8F9FA;
}

.pagination .page-item.active .page-link {
  background-color: #ffffff;
  border-color: #ffffff;
}

.pagination .page-item .page-link {
  color: #343A40;
}

.btn-warning {
  background-color: #ffcc00;
  border-color: #ffcc00;
  color: #000;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-primary {
  background-color: #e50580;
  border-color: #e50580;
}

.btn-primary:hover {
  background-color: #34447C;
  border-color: #34447C;
}

.btn-dark {
  background-color: #343a40;
  border-color: #343a40;
}
.btn-green {
  background-color: #22C55E; /* Green color */
  color: white;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}



/* Styling for select dropdown options */
select.btn-green {
  background-color: #22C55E;
  color: white;
}


select.btn {
  background-color: #22C55E; /* Este es el color del botón principal */
  color: white;
  padding: 20px 25px;
  border: none;
}

select.btn option {
  background-color:  #ffffff; /* Elimina el fondo */
  color: black; /* Cambia el color de las letras a negro */
  font-weight: bold;
}

select option[disabled] {
  display: none;
}
.alert-custom {
  background-image: linear-gradient(to right, #fffb00de, #ddd905); /* Degradado de azul oscuro a dorado */
  color: black; /* Color del texto */
  border: 1px solid #b2954b; /* Borde dorado */
  border-radius: 5px; /* Bordes redondeados */
  padding: 15px;
}
</style>