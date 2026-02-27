<template>
  <div>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-center">
          <div class="col-sm-8 col-12">
            <div class="card">
              <div class="card-header">
                <h3>Agregar Contrato</h3>
              </div>
              <div class="card-body">
                <CrudCreate3 :model="model" :apiUrl="apiUrl">
                  <div slot="body" class="row">
                    <div class="form-group col-12">
                      <label for="nombre">Nombre</label>
                      <input id="nombre" type="text" v-model="model.nombre" class="form-control">
                    </div>

                    <div class="form-group col-12">
                      <label for="apellidos">Apellidos</label>
                      <input id="apellidos" type="text" v-model="model.apellidos" class="form-control">
                    </div>

                    <div class="form-group col-12">
                      <label for="email">Email</label>
                      <input id="email" type="email" v-model="model.email" class="form-control">
                    </div>

                    <div class="form-group col-12">
                      <label for="password">Password</label>
                      <input id="password" type="password" v-model="model.password" class="form-control">
                    </div>

                    <div class="form-group col-12">
                      <label for="estado">Estado</label>
                      <select id="estado" v-model="model.estado" class="form-control">
                        <option :value="1">Activo</option>
                        <option :value="0">Inactivo</option>
                      </select>
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
        password: '',
        estado: 1,
      },
      apiUrl: 'contrato1',
      page: 'Contratos',
      modulo: 'AGBC',
      load: true,
    }
  },
}
</script>
