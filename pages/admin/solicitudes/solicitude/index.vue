<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-2">
            <nuxtLink :to="url_nuevo" class="btn btn-dark btn-sm w-100">
              <i class="fas fa-plus"></i> Agregar
            </nuxtLink>
          </div>
          <div class="col-2">
            <nuxtLink :to="url_asignar" class="btn btn-dark btn-sm w-100">
              <i class="fas fa-plus"></i> Asignar Carteros
            </nuxtLink>
          </div>
          <div class="col-2">
            <button @click="generarReporte" class="btn btn-primary btn-sm w-100">
              <i class="fas fa-file-alt"></i> Generar Reporte
            </button>
          </div>
        </div>
        <div class="row">
          <div v-for="(group, estado) in groupedData" :key="estado" class="col-12">
            <div class="card border-rounded">
              <div class="card-header" @click="toggleCollapse(estado)">
                {{ estado === '1' ? 'Solicitudes' : estado === '2' ? 'En camino' : estado === '3' ? 'Entregados' :
                  estado === '0' ? 'Cancelados' : 'Otro estado' }}
              </div>
              <b-collapse :id="'collapse-' + estado" v-model="collapseState[estado]">
                <div class="card-body p-2">
                  <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                      <thead>
                        <tr>
                          <th class="py-0 px-1">#</th>
                          <th class="py-0 px-1">Sucursal</th>
                          <th class="py-0 px-1">Cartero</th>
                          <th class="py-0 px-1">Guia</th>
                          <th class="py-0 px-1">Peso Empresa (Kg)</th>
                          <th class="py-0 px-1">Peso Correos (Kg)</th>
                          <th class="py-0 px-1">Remitente</th>
                          <th class="py-0 px-1">Dirección</th>
                          <th class="py-0 px-1">Teléfono</th>
                          <th class="py-0 px-1">Contenido</th>
                          <th class="py-0 px-1">Fecha</th>
                          <th class="py-0 px-1">Firma Remitente</th>
                          <th class="py-0 px-1">Destinatario</th>
                          <th class="py-0 px-1">Teléfono D</th>
                          <th class="py-0 px-1">Dirección Destinatario</th>
                          <th class="py-0 px-1">Ciudad</th>
                          <th class="py-0 px-1">Firma Destinatario</th>
                          <th class="py-0 px-1">Nombre Destinatario</th>
                          <th class="py-0 px-1">CI Destinatario</th>
                          <th class="py-0 px-1">Fecha Destinatario</th>
                          <th class="py-0 px-1">Estado</th>
                          <th class="py-0 px-1"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(m, i) in group" :key="i">
                          <td class="py-0 px-1">{{ i + 1 }}</td>
                          <td class="p-1">{{ m.sucursale.nombre }}</td>
                          <td class="p-1">{{ m.cartero ? m.cartero.nombre : 'Por asignar' }}</td>
                          <td class="py-0 px-1">{{ m.guia }}</td>
                          <td class="py-0 px-1">{{ m.peso_o }}</td>
                          <td class="py-0 px-1">{{ m.peso_v }}</td>
                          <td class="py-0 px-1">{{ m.remitente }}</td>
                          <td class="py-0 px-1">{{ m.direccion }}</td>
                          <td class="py-0 px-1">{{ m.telefono }}</td>
                          <td class="py-0 px-1">{{ m.contenido }}</td>
                          <td class="py-0 px-1">{{ m.fecha }}</td>
                          <td class="py-0 px-1">
                            <img v-if="m.firma_o" :src="m.firma_o" alt="Firma Origen" width="100" />
                          </td>
                          <td class="py-0 px-1">{{ m.destinatario }}</td>
                          <td class="py-0 px-1">{{ m.telefono_d }}</td>
                          <td class="py-0 px-1">{{ m.direccion_d }}</td>
                          <td class="py-0 px-1">{{ m.ciudad }}</td>
                          <td class="py-0 px-1">
                            <img v-if="m.firma_d" :src="m.firma_d" alt="Firma Destino" width="100" />
                          </td>
                          <td class="py-0 px-1">{{ m.nombre_d }}</td>
                          <td class="py-0 px-1">{{ m.ci_d }}</td>
                          <td class="py-0 px-1">{{ m.fecha_d }}</td>
                          <td class="py-0 px-1">{{ m.estado === 1 ? 'Solicitud' : m.estado === 2 ? 'En camino' :
                            m.estado === 3 ? 'Entregado' : m.estado === 0 ? 'Cancelado' : m.estado }}</td>
                          <td class="py-0 px-1" v-if="m.estado === 1 || m.estado === 2">
                            <div class="btn-group">
                              <nuxtLink :to="url_editar + m.id"
                                class="btn btn-info btn-sm py-1 px-2">
                                <i class="fas fa-pen"></i>
                              </nuxtLink>
                              <button v-if="m.estado !== 2" type="button" @click="Eliminar(m.id)"
                                class="btn btn-danger btn-sm py-1 px-2">
                                <i class="fas fa-trash"></i>
                              </button>
                              <button v-if="m.estado === 2" type="button" @click="DarDeBaja(m.id)"
                                class="btn btn-warning btn-sm py-1 px-2">
                                <i class="fas fa-ban"></i> Dar de Baja
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </b-collapse>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>
  </div>
</template>

<script>
import { BCollapse } from 'bootstrap-vue';

export default {
  name: "IndexPage",
  components: {
    BCollapse
  },
  data() {
    return {
      load: true,
      list: [],
      apiUrl: 'solicitudes',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/admin/solicitudes/solicitude/nuevo',
      url_asignar: '/admin/solicitudes/solicitude/asignar',
      url_editar: '/admin/solicitudes/solicitude/editar/',
      collapseState: {}
    };
  },
  computed: {
    groupedData() {
      const grouped = {};
      this.list.forEach(item => {
        if (!grouped[item.estado]) {
          grouped[item.estado] = [];
        }
        grouped[item.estado].push(item);
      });
      return grouped;
    }
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$api.$get(path);
      return res;
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$api.$delete(this.apiUrl + '/' + id);
        await Promise.all([this.GET_DATA(this.apiUrl)]).then((v) => {
          this.list = v[0];
        });
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },
    Eliminar(id) {
      this.$swal.fire({
        title: 'Deseas Eliminar?',
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
    toggleCollapse(estado) {
      this.$set(this.collapseState, estado, !this.collapseState[estado]);
    },
    generarReporte() {
      const reporteHtml = this.generarReporteHtml();
      const reporteWindow = window.open("", "_blank");
      reporteWindow.document.write(reporteHtml);
      reporteWindow.document.close();
    },
    generarReporteHtml() {
      let html = `
        <html>
        <head>
          <title>Reporte de Solicitudes</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Reporte de Solicitudes</h1>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Sucursal</th>
                <th>Guia</th>
                <th>Peso O</th>
                <th>Peso V</th>
                <th>Remitente</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Contenido</th>
                <th>Fecha</th>
                <th>Firma O</th>
                <th>Destinatario</th>
                <th>Teléfono D</th>
                <th>Dirección Destinatario</th>
                <th>Ciudad</th>
                <th>Firma D</th>
                <th>Nombre D</th>
                <th>CI D</th>
                <th>Fecha D</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
      `;

      this.list.forEach((item, index) => {
        html += `
          <tr>
            <td>${index + 1}</td>
            <td>${item.sucursale.nombre}</td>
            <td>${item.guia}</td>
            <td>${item.peso_o}</td>
            <td>${item.peso_v}</td>
            <td>${item.remitente}</td>
            <td>${item.direccion}</td>
            <td>${item.telefono}</td>
            <td>${item.contenido}</td>
            <td>${item.fecha}</td>
            <td>${item.firma_o ? `<img src="${item.firma_o}" alt="Firma Origen" width="100"/>` : ''}</td>
            <td>${item.destinatario}</td>
            <td>${item.telefono_d}</td>
            <td>${item.direccion_d}</td>
            <td>${item.ciudad}</td>
            <td>${item.firma_d ? `<img src="${item.firma_d}" alt="Firma Destino" width="100"/>` : ''}</td>
            <td>${item.nombre_d}</td>
            <td>${item.ci_d}</td>
            <td>${item.fecha_d}</td>
            <td>${item.estado === 1 ? 'Solicitud' : item.estado === 2 ? 'En camino' : item.estado === 3 ? 'Entregado' : item.estado === 0 ? 'Cancelado' : item.estado}</td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </body>
        </html>
      `;

      return html;
    }
  },
  mounted() {
    this.$nextTick(async () => {
      try {
        const data = await this.GET_DATA(this.apiUrl);
        if (Array.isArray(data)) {
          this.list = data;
        } else {
          console.error('Los datos recuperados no son un array:', data);
        }
      } catch (e) {
        console.error('Error al obtener los datos:', e);
      } finally {
        this.load = false;
      }
    });
  },
};
</script>

<style scoped>
.card.border-rounded {
  border-radius: 15px;
  border: 1px solid #dee2e6;
  margin-bottom: 1.5rem;
  overflow: hidden; /* Para asegurar que los bordes redondeados se apliquen correctamente */
}
.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}
</style>
