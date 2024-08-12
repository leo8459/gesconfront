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
                <CrudUpdate4 :model="model" :apiUrl="apiUrl">
                  <div slot="body" class="row">
                    <div class="form-group col-12">
                      <label class="form-label" for="">Departamento de envio</label>
                      <input type="text" v-model="model.departamento" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label class="form-label" for="">Servicio</label>
                      <input type="text" v-model="model.servicio" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label class="form-label" for="">Precio Servicio</label>
                      <input type="text" v-model="model.precio" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label class="form-label" for="">Precio Servicio Extra</label>
                      <input type="text" v-model="model.precio_extra" class="form-control" id="">
                    </div>
                  </div>
                </CrudUpdate4>
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
        precio: '',
        precio_extra: '',
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
        const routeData = await this.GET_DATA(this.apiUrl + '/' + this.$route.params.id);
        this.model = routeData;
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    });

  }
};

</script>