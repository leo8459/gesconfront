<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end">
          <div class="col-2"></div>
          <div class="col-12">
            <div class="card">
              <nuxtLink :to="url_nuevo" class="btn btn-dark btn-sm w-100">
                <i class="fas fa-plus"></i> Agregar
              </nuxtLink>
              <div class="card-body">
                <!-- Campo de búsqueda -->
                <input type="text" v-model="busqueda" class="form-control" placeholder="Buscar por código"
                  @keyup.enter="buscar" @input="buscar" />
                <br>
                <!-- Contenedor con barra de desplazamiento horizontal -->
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Código</th>
                        <th>Sucursal</th>
                        <th>Código de Barras</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in resultados" :key="m.id">
                        <td>{{ i + 1 }}</td>
                        <td>{{ m.codigo }}</td>
                        <td>{{ m.sucursale_id }}</td>
                        <td>
                          <!-- Mostrar imagen del código de barras -->
                          <img v-if="m.barcode" :src="'data:image/png;base64,' + m.barcode" alt="Código de Barras" class="barcode-img">
                          <span v-else>No disponible</span>
                        </td>
                        <td>
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
      </div>
    </AdminTemplate>
  </div>
</template>


<script>
export default {
  name: "IndexPage",
  head() {
    return {
      title: this.modulo,
    };
  },
  data() {
    return {
      load: true,
      list: [], // tus datos originales
      apiUrl: "codigos",//nombre de la variable para jlar la administrador ruta
      page: "codigos",
      modulo: "AGBC",
      url_nuevo: "/admin/codigos/codigo/nuevo",
      url_editar: "/admin/gestores/gestore/editar/",//VA AL PRIMER ARCHIVO DE LA CARPETA
      busqueda: "", // término de búsqueda
      resultados: [], // datos filtrados
      headers: ['#', 'Codigo', 'Sucursal','Estado',' '],
    };
  },
  computed: {
      user() {
         return this.$store.state.auth.user;
      },
   },
  methods: {
    async GET_DATA(path) {
      try {
        const res = await this.$administrador.$get(path);
        return res;
      } catch (error) {
        console.error(error);
      }
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$administrador.$delete(this.apiUrl + "/" + id);
        console.log(res);
        const [data] = await Promise.all([this.GET_DATA(this.apiUrl)]);
        this.list = data;
        this.buscar(); // Actualizar los resultados después de eliminar
      } catch (e) {
        console.error(e);
      } finally {
        this.load = false;
      }
    },
    Eliminar(id) {
      let self = this;
      this.$swal
        .fire({
          title: "Deseas desactivar la cuenta?",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Confirmar",
          cancelarButtonText: `Cancelar`,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            await self.EliminarItem(id);
          }
        });
    },
    buscar() {
  this.resultados = this.list.filter((item) =>
    item.codigo && item.codigo.toLowerCase().includes(this.busqueda.toLowerCase())
  );
}

  },

  mounted() {
  this.$nextTick(async () => {
    try {
      const [data] = await Promise.all([this.GET_DATA(this.apiUrl)]);
      this.list = data || []; // Asegurar que list siempre sea un array
      this.buscar(); // Llamar a buscar para cargar todos los datos al principio
    } catch (e) {
      console.error(e);
    } finally {
      this.load = false;
    }
  });
}
,
};
</script>

<style scoped>
.activo {
  color: blue;
}

.inactivo {
  color: red;
}
</style>
