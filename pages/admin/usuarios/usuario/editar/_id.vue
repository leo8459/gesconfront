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
                <CrudUpdate :model="model" :apiUrl="apiUrl">




                  <div slot="body" class="row">
                    <div class="form-group col-12">
                      <label for="">Nombre</label>
                      <input type="text" v-model="model.nombre" class="form-control" id="">
                    </div>






                    <div class="form-group col-12">
                      <label for="">Apellidos</label>
                      <input type="text" v-model="model.apellidos" class="form-control" id="">
                    </div>






                   






                    

                    <div class="form-group col-6">
                      <label for="">Email</label>
                      <input type="text" v-model="model.email" class="form-control" id="">
                    </div>





                    <div class="form-group col-6">
                      <label for="">Password</label>
                      <input type="password" v-model="model.password" class="form-control" id="">
                    </div>



                    <div class="form-group col-6">
                      <label for="">Estado de la cuenta</label>
                      <select v-model="model.estado" class="form-control">
                        <option value="1">Activo</option>
                        <option value="0">Inactivo</option>
                      </select>
                    </div>







                  </div>
                </CrudUpdate>
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
      title: "Usuario",
    };
    ;
  },
  data() {
    return {
      load: true,
      model: {
        nombre: "",
        apellidos: "",
        email: '',
        password: '',
        estado: '',

      },
      apiUrl: 'users',
      page: 'Usuarios',
      modulo: 'AGBC'
    };
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$api.$get(path);
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
