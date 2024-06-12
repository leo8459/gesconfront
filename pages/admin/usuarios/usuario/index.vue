<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end">
          <div class="col-2"></div>
          <div class="col-12">
            <div class="card">
              <!-- <button @click="llamarOtraAPI" class="btn btn-primary">
                <i class="fas fa-calendar"></i> Restar Días
              </button> -->
              <nuxtLink :to="url_nuevo" class="btn btn-dark btn-sm w-100">
                <i class="fas fa-plus"></i> Agregar
              </nuxtLink>
              <div class="card-body">
                <!-- Campo de búsqueda -->
                <input type="text" v-model="busqueda" class="form-control" placeholder="Buscar por nombre"
                  @keyup.enter="buscar" @input="buscar" />
                <br>
                <!-- Contenedor con barra de desplazamiento horizontal -->
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th class="py-0 px-1" :key="'header-' + index" v-for="(header, index) in headers">{{ header }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in resultados" :key="m.id">
                        <td class="py-0 px-1">{{ i + 1 }}</td>
                        <td class="py-0 px-1">{{ m.nombre }}</td>
                        <td class="py-0 px-1">{{ m.apellidos }}</td>
                        <td class="py-0 px-1" :class="m.estado === 1 ? 'activo' : 'inactivo'">
                          {{ m.estado === 1 ? 'Activo' : 'Inactivo' }}
                        </td>
                        <td class="py-0 px-1">
                          <div class="btn-group">
                            <nuxtLink :to="url_editar + m.id" class="btn btn-info btn-sm py-1 px-2">
                              <i class="fas fa-pen"></i>
                            </nuxtLink>
                          
                            <button type="button" @click="Eliminar(m.id)" class="btn btn-danger btn-sm py-1 px-2">
                              <i class="fas fa-trash trash-icon"></i>
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
      apiUrl: "users",//nombre de la variable para jlar la api ruta
      page: "Usuarios",
      modulo: "AGBC",
      url_nuevo: "/admin/usuarios/usuario/nuevo",
      url_editar: "/admin/usuarios/usuario/editar/",//VA AL PRIMER ARCHIVO DE LA CARPETA
      busqueda: "", // término de búsqueda
      resultados: [], // datos filtrados
      headers: ['#', 'Nombre', 'Apellidos','Estado',' '],
    };
  },
  methods: {
    async GET_DATA(path) {
      try {
        const res = await this.$api.$get(path);
        return res;
      } catch (error) {
        console.error(error);
      }
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$api.$delete(this.apiUrl + "/" + id);
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
        item.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }
  },
//cntrc+v



  mounted() {
    this.$nextTick(async () => {
      try {
        const [data] = await Promise.all([this.GET_DATA(this.apiUrl)]);
        this.list = data;
        this.buscar(); // Llamar a buscar para cargar todos los datos al principio
      } catch (e) {
        console.error(e);
      } finally {
        this.load = false;
      }
    });
  },
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
