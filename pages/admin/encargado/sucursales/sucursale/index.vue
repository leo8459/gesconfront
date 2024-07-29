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
          </div>
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <table class="table">
                  <thead>
                    <th class="py-0 px-1">#</th>
                    <th class="py-0 px-1">Sucursal</th>
                    <th class="py-0 px-1">Departamento origen</th>
                    <th class="py-0 px-1">Inicio Contrato</th>
                    <th class="py-0 px-1">Fin Contrato</th>
                    <th class="py-0 px-1">Limite Presupuestario</th>
                    <th class="py-0 px-1">cobertura</th>
                    <th class="py-0 px-1">Direccion</th>
                    <th class="py-0 px-1">Acuerdos</th>
                    <th class="py-0 px-1">Contacto</th>

                    <!-- <th class="py-0 px-1">empresa</th> -->
                    <th class="py-0 px-1"></th>
                  </thead>
                  <tbody>
                    <tr v-for="(m, i) in list" :key="i">
                      <td class="py-0 px-1">{{ i + 1 }}</td>
                      <td class="py-0 px-1">{{ m.nombre }}</td>
                      <td class="py-0 px-1">{{ m.origen }}</td>
                      <td class="py-0 px-1">{{ m.ini_vigencia }}</td>
                      <td class="py-0 px-1">{{ m.fin_vigencia }}</td>
                      <td class="py-0 px-1">{{ m.limite }}</td>
                      <td class="py-0 px-1">{{ m.cobertura }}</td>
                      <td class="py-0 px-1">{{ m.direccion }}</td>
                      <td class="py-0 px-1">{{ m.acuerdos }}</td>
                      <td class="py-0 px-1">{{ m.contacto_administrativo }}</td>

                      <!-- <td class="py-0 px-1">{{ m.empresa ? m.empresa.nombre : 'N/A' }}</td> -->
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
export default {
  name: "IndexPage",
  data() {
    return {
      load: true,
      list: [],
      apiUrl: 'sucursales',
      page: 'sucursales',
      modulo: 'agbc',
      url_nuevo: '/admin/sucursales/sucursale/nuevo',
      url_editar: '/admin/sucursales/sucursale/editar/',
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
