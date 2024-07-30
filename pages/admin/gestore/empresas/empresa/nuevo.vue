<template>
  <div>

    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-center">
          <div class="col-sm-8 col-12">
            <div class="card">
              <div class="card-header">
                <h3>Agregar</h3>
              </div>
              <div class="card-body">
                <CrudCreate4 :model="model" :apiUrl="apiUrl">




                  <div slot="body" class="row">

                    <div class="form-group col-12">
                      <label for="">Nombre</label>
                      <input type="text" v-model="model.nombre" class="form-control" id="">
                    </div>

                    <div class="form-group col-12">
                      <label for="">Nit</label>
                      <input type="text" v-model="model.nit" class="form-control" id="">
                    </div>

                    


                    <div class="form-group col-12">
                      <label for="">Email</label>
                      <input type="text" v-model="model.email" class="form-control" id="">
                    </div>

                    <div class="form-group col-12">
                      <label for="">Password</label>
                      <input type="text" v-model="model.password" class="form-control" id="">
                    </div>




                   

                  </div>
                </CrudCreate4>
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
  data() {
    return {
      model: {
        nombre: '',
        apellidos: '',
        email: '',
        password: ''


      },
      apiUrl: 'empresas3',
      page: 'Usuarios',
      modulo: 'AGBC',
      load: true,

    }

  },

  methods: {


  },
  mounted() {
   
  },

}
</script>
