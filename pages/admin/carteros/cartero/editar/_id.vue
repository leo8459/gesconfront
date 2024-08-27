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
                      <label for="">Nombre</label>
                      <input type="text" v-model="model.nombre" class="form-control" id="">
                    </div>






                    <div class="form-group col-12">
                      <label for="">Apellidos</label>
                      <input type="text" v-model="model.apellidos" class="form-control" id="">
                    </div>

                    <div class="form-group col-12">
                      <label for="">Departamento</label>
                      <select v-model="model.departamento_cartero" class="form-control" id="origen">
                        <option value="LPB">La Paz (LPB)</option>
                        <option value="SRZ">Santa Cruz (SRZ)</option>
                        <option value="CBB">Cochabamba (CBB)</option>
                        <option value="ORU">Oruro (ORU)</option>
                        <option value="PTI">Potosí (PTI)</option>
                        <option value="TJA">Tarija (TJA)</option>
                        <option value="SRE">Sucre (SRE)</option>
                        <option value="BEN">Trinidad (TDD)</option>
                        <option value="CIJ">Cobija (CIJ)</option>
                      </select>
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
        departamento_cartero: '',
      },
      apiUrl: 'carteros1',
      page: 'Usuarios',
      modulo: 'AGBC'
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
