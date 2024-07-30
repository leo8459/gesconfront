<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-center">

          <div class="col-sm-8 col-12">
            <div class="card">
              <div class="card-header">
                <h3>Actualizar</h3>
              </div>
              <div class="card-body">
                <CrudUpdate3 :model="model" :apiUrl="apiUrl">
                  <div slot="body" class="row">

                    <div class="form-group col-12">
                      <label for="">Sucursal</label>
                      <select name="" id="" class="form-control" v-model="model.sucursale_id">
                        <option v-for="m in sucursales" :value="m.id">{{ m.nombre }}</option>
                      </select>
                    </div>





                    <div class="form-group col-12">
                      <label for="">Departamento de envio</label>
                      <input type="text" v-model="model.departamento" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">Precio Servicio Courier</label>
                      <input type="text" v-model="model.servicio" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">Precio Servicio Provincia</label>
                      <input type="text" v-model="model.servicioprov" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">Precio Servicio Express</label>
                      <input type="text" v-model="model.servicioexpress" class="form-control" id="">
                    </div>
                  </div>
                </CrudUpdate3>
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
      title: "tarifas",
    };
    ;
  },
  data() {
    return {
      load: true,

      model: {
        sucursale_id: '',
        departamento: '',
        servicio: '',
        servicioprov: '',
        servicioexpress: '',
      },
      apiUrl: "tarifas1",
      page: "tarifas",
      modulo: "Agbc",
      sucursales: [],
    };
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$administrador.$get(path);
      return res
    },

  },
  mounted() {
    this.$nextTick(async () => {

      try {
        await Promise.all([this.GET_DATA(this.apiUrl + '/' + this.$route.params.id),this.GET_DATA('sucursales')]).then((v) => {
          this.model = v[0];
          this.sucursales = v[1];
          // if (this.categorias.length) {
          //   this.model.categoria_id = this.categorias[0].id
          // }
          // if (this.secciones.length) {
          //   this.model.seccione_id = this.secciones[0].id
          // }
        })
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false
      }



    });
  }
};
</script>