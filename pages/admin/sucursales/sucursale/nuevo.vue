<template>
  <div>
    <JcLoader :load="load"></JcLoader>

    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-center">
          <div class="col-sm-8 col-12">
            <div class="card">
              <div class="card-header">
                <h3>Crear Nueva Sucursal</h3>
              </div>
              <div class="card-body">
                <CrudCreate3 :model="model" :apiUrl="apiUrl">
                  <div slot="body" class="row">
                    <div class="form-group col-12">
                      <label for="">empresa</label>
                      <select name="" id="" class="form-control" v-model="model.empresa_id">
                        <option v-for="m in empresas" :value="m.id">{{ m.nombre }}</option>
                      </select>
                    </div>
                    
                    <div class="form-group col-12">
                      <label for="">Sucursal</label>
                      <input type="text" v-model="model.nombre" class="form-control" id="">
                    </div>
                    
                    <div class="form-group col-12">
                      <label for="">Email</label>
                      <input type="text" v-model="model.email" class="form-control" id="">
                    </div>

                    <div class="form-group col-12">
                      <label for="">Password</label>
                      <input type="password" v-model="model.password" class="form-control" id="">
                    </div>

                    <div class="form-group col-12">
                      <label for="">Departamento origen</label>
                      <input type="text" v-model="model.origen" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">Inicio Fecha</label>
                      <input type="date" v-model="model.ini_vigencia" class="form-control" :min="ini_vigencia">
                    </div>

                    <div class="form-group col-12">
                      <label for="">Fin Fecha</label>
                      <input type="date" v-model="model.fin_vigencia" class="form-control" :min="fin_vigencia">
                    </div>

                    <div class="form-group col-12">
                      <label for="">limite</label>
                      <input type="text" v-model="model.limite" class="form-control" id="">
                    </div>

                    <div class="form-group col-12">
                      <label for="">cobertura</label>
                      <input type="text" v-model="model.cobertura" class="form-control" id="">
                    </div>

                    <div class="form-group col-12">
                      <label for="">Acuerdo Recojo</label>
                      <input type="text" v-model="model.acuerdos" class="form-control" id="">
                    </div>

                    <div class="form-group col-12">
                      <label for="">Direccion</label>
                      <input type="text" v-model="model.direccion" class="form-control" id="">
                    </div>

                    <div class="form-group col-12">
                      <label for="">Contacto Administrativo</label>
                      <input type="number" v-model="model.contacto_administrativo" class="form-control" id="">
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
        origen: '',
        ini_vigencia: '',
        fin_vigencia: '',
        limite: '',
        cobertura: '',
        direccion: '',
        contacto_administrativo: '',
        acuerdos: '',
        empresa_id: '',
      },
      apiUrl: 'sucursales1',
      page: 'sucursales',
      modulo: 'AGBC',
      load: true,
      empresas: [],
      ini_vigencia: '',
      fin_vigencia: ''
        }
  },

  methods: {
    async GET_DATA(path) {
      const res = await this.$administrador.$get(path);
      return res;
    },
  },

  mounted() {
    this.$nextTick(async () => {
      try {
        await Promise.all([this.GET_DATA('empresas1')]).then((v) => {
          this.empresas = v[0];
        });
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    });
  },
}
</script>
