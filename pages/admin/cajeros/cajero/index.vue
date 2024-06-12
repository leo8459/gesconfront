<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end">
          <div class="col-2">
            <nuxtLink :to="url_nuevo" class="btn btn-dark btn-sm w-100">
              <i class="fas fa-plus"></i> Agregar
            </nuxtLink>
            <button @click="generarReporteCajeros" class="btn btn-lx btn-primary">
              <i class="fas fa-print fa-lg"></i>
    </button>
    <button @click="generarReporteCajerosActivos" class="btn btn-lx btn-primary">
      Personal Activo
    </button>
          </div>
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <table class="table">
                  <thead>

                    <th class="py-0 px-1">#</th>
                    <th class="py-0 px-1">Nombre Completo</th>
                    <th class="py-0 px-1">email</th>
                    <th class="py-0 px-1">carnet</th>
                    <th class="py-0 px-1">estado</th>
                    <th class="py-0 px-1"></th>
                  </thead>
                  <tbody>
                    <tr v-for="(m, i) in list">
                      <td class="py-0 px-1">{{ i + 1 }}</td>
                      <td class="py-0 px-1">{{ m.nombre }}</td>
                      <td class="py-0 px-1">{{ m.email }}</td>
                      <td class="py-0 px-1">{{ m.carnet }}</td>
                      <td class="py-0 px-1"
                        :class="m.estado === 1 ? 'activo' : (m.estado === 3 ? 'CERRADO' : 'Mantenimiento')">
                        {{ m.estado === 1 ? 'Activo' : (m.estado === 3 ? 'CERRADO' : 'Mantenimiento') }}
                      </td>

                      <td class="py-0 px-1">
                        <div class="btn-group">
                          <nuxtLink :to="url_editar + m.id" class="btn btn-info btn-sm py-1 px-2">
                            <i class="fas fa-pen"></i>
                          </nuxtLink>
                          <button type="button" @click="Eliminar(m.id)" class="btn btn-danger btn-sm py-1 px-2">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import 'jspdf-autotable';
export default {
  name: "IndexPage",
  head() {
    return {
      title: this.modulo,
    };
    ;
  },

  data() {
    return {
      load: true,
      list: [],
      apiUrl: 'cajeros',
      page: 'cajeros',
      modulo: 'agbc',
      url_nuevo: '/admin/cajeros/cajero/nuevo',
      url_editar: '/admin/cajeros/cajero/editar/',
    };
  },
  methods: {

    generarReporteCajerosActivos() {
      const dataForReport = this.list.filter(cajero => cajero.estado === 1); // Filtrar cajeros activos

      const headers = [
        '#',
        'Nombre Completo',
        'Email',
        'Carnet',
        'Estado',
      ];

      const body = dataForReport.map((cajero, index) => [
        index + 1,
        cajero.nombre,
        cajero.email,
        cajero.carnet,
        cajero.estado === 1 ? 'Activo' : (cajero.estado === 3 ? 'CERRADO' : 'Mantenimiento'),
      ]);

      const doc = new jsPDF('p', 'mm', 'a4'); // 'p' para orientación vertical

      doc.autoTable({
        head: [headers],
        body: body,
        startY: 10,
        theme: 'striped',
        margin: { top: 20 },
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
          columnWidth: 'wrap',
        },
        didDrawCell: (data) => {
          const cell = data.cell;
          doc.setFontSize(10);
          doc.setTextColor(50);

          if (cell.height > 10 && doc.getTextWidth(cell.text) > cell.width - 10) {
            doc.autoTableText(cell.text, cell.x + 2, cell.y + 2, {
              halign: 'left',
              valign: 'top',
            });
          }
        },
      });

      const fileName = 'reporte_cajeros_activos.pdf';
      doc.save(fileName);
    },


    generarReporteCajeros() {
      const dataForReport = this.list;

      const headers = [
        '#',
        'Nombre Completo',
        'Email',
        'Carnet',
        'Estado',
      ];

      const body = dataForReport.map((cajero, index) => [
        index + 1,
        cajero.nombre,
        cajero.email,
        cajero.carnet,
        cajero.estado === 1 ? 'Activo' : (cajero.estado === 3 ? 'CERRADO' : 'Mantenimiento'),
      ]);

      const doc = new jsPDF('p', 'mm', 'a4'); // 'p' para orientación vertical

      doc.autoTable({
        head: [headers],
        body: body,
        startY: 10,
        theme: 'striped',
        margin: { top: 20 },
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
          columnWidth: 'wrap',
        },
        didDrawCell: (data) => {
          const cell = data.cell;
          doc.setFontSize(10);
          doc.setTextColor(50);

          if (cell.height > 10 && doc.getTextWidth(cell.text) > cell.width - 10) {
            doc.autoTableText(cell.text, cell.x + 2, cell.y + 2, {
              halign: 'left',
              valign: 'top',
            });
          }
        },
      });

      const fileName = 'reporte_cajeros.pdf';
      doc.save(fileName);
    },


    async GET_DATA(path) {
      const res = await this.$api.$get(path);
      return res
    },
    async EliminarItem(id) {
      this.load = true
      try {
        const res = await this.$api.$delete(this.apiUrl + '/' + id);
        console.log(res)
        await Promise.all([this.GET_DATA(this.apiUrl)]).then((v) => {
          this.list = v[0]
        })
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false
      }
    },
    Eliminar(id) {
      let self = this
      this.$swal.fire({
        title: 'Deseas Eliminar?',
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar', // Agrega esta línea para definir el texto del botón Cancelar
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await self.EliminarItem(id)
        }
      })
    }
  },
  mounted() {
    this.$nextTick(async () => {
      try {
        await Promise.all([this.GET_DATA(this.apiUrl)]).then((v) => {
          this.list = v[0]
        })
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false
      }

    });
  },

};
</script>