<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end">
          <div class="col-2">
            <nuxtLink :to="url_nuevo" class="btn btn-dark btn-sm w-100">
              <i class=""></i> Agregar Tarifa
            </nuxtLink>
          </div>
          <div class="col-12">
            <div class="row">
              <div v-for="(sucursal, index) in sucursales" :key="index" class="col-12 col-sm-6 col-lg-4 mb-3">
                <div class="card border-primary h-100">
                  <div class="card-header" style="background-color: #34447C; color: #FFFFFF; text-align: center;">
                    <h5 class="card-title" style="color: #FFFFFF;">{{ sucursal.nombre }}</h5>
                  </div>
                  <div class="card-body d-flex flex-column">
                    <p class="card-text">
                      <button class="btn btn-block" style="background-color: #B99C46; color: #FFFFFF;" @click="openModal(sucursal)">
                        Ver Tarifas
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>

    <!-- Modal -->
    <div class="modal fade" id="sucursalModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Tarifas de la Sucursal: {{ selectedSucursal.nombre }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <table class="table table-striped table-responsive-sm">
              <thead>
                <tr>
                  <th class="p-1">#</th>
                  <th class="p-1">Departamento de origen</th>
                  <th class="p-1">Departamento de Envio</th>
                  <th class="p-1">Servicio (Bs)</th>
                  <th class="p-1">Kilogramo Extra (Bs)</th>
                  <th class="p-1">Kilogramo Extra (Bs)</th>

                  <th class="p-1"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(m, i) in selectedSucursal.tarifas" :key="m.id">
                  <td class="p-1">{{ i + 1 }}</td>
                  <td class="p-1">{{ m.sucursale.origen }}</td>
                  <td class="p-1">{{ m.departamento }}</td>
                  <td class="p-1">{{ m.servicio }}</td>
                  <td class="p-1">{{ m.precio }}</td>
                  <td class="p-1">{{ m.precio_extra }}</td>
                  <td class="p-1">
                    <div class="btn-group">
                      <button type="button" class="btn btn-info btn-sm p-1" @click="editarTarifa(m.id)">
                        <i class="fas fa-pen"></i>
                      </button>
                      <button type="button" @click="Eliminar(m.id)" class="btn btn-danger btn-sm p-1">
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
</template>

<script>
export default {
  name: "IndexPage",
  head() {
    return {
      title: this.modulo,
      link: [
        { rel: "stylesheet", href: "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" },
      ],
      script: [
        { src: "https://code.jquery.com/jquery-3.5.1.slim.min.js" },
        { src: "https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js" },
        { src: "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" },
      ],
    };
  },
  data() {
    return {
      load: true,
      sucursales: [],
      selectedSucursal: {},
      apiUrl: 'tarifas1',
      page: 'tarifas',
      modulo: 'AGBC',
      url_nuevo: '/admin/tarifas/tarifa/nuevo',
      url_editar: '/admin/tarifas/tarifa/editar/',
    };
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$administrador.$get(path);
      return res;
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$administrador.$delete(this.apiUrl + '/' + id);
        console.log(res);
        await this.loadData();
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },
    Eliminar(id) {
      let self = this;
      this.$swal.fire({
        title: 'Deseas Eliminar?',
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await self.EliminarItem(id);
        }
      });
    },
    async loadData() {
      try {
        const data = await this.GET_DATA(this.apiUrl);
        this.sucursales = this.groupBySucursal(data);
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },
    groupBySucursal(data) {
      const sucursales = [];
      data.forEach(item => {
        let sucursal = sucursales.find(s => s.nombre === item.sucursale.nombre);
        if (!sucursal) {
          sucursal = { nombre: item.sucursale.nombre, tarifas: [] };
          sucursales.push(sucursal);
        }
        sucursal.tarifas.push(item);
      });
      return sucursales;
    },
    openModal(sucursal) {
      this.selectedSucursal = sucursal;
      this.$nextTick(() => {
        $('#sucursalModal').modal('show');
      });
    },
    closeModal() {
      $('#sucursalModal').modal('hide');
    },
    editarTarifa(id) {
      this.closeModal();
      this.$router.push(this.url_editar + id);
    }
  },
  mounted() {
    this.$nextTick(this.loadData);
  },
};
</script>
