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
                <CrudCreate3 :model="model" :apiUrl="apiUrl">




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
                        <option value="SCZ">Santa Cruz (SCZ)</option>
                        <option value="CBB">Cochabamba (CBB)</option>
                        <option value="ORU">Oruro (ORU)</option>
                        <option value="PTS">Potosí (PTS)</option>
                        <option value="TJA">Tarija (TJA)</option>
                        <option value="CHU">Sucre (CHU)</option>
                        <option value="BEN">Trinidad (BEN)</option>
                        <option value="PAN">Cobija (PAN)</option>
                      </select>
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
                </CrudCreate3>
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
        departamento_cartero: '',
        password: ''


      },
      apiUrl: 'carteros1',
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
