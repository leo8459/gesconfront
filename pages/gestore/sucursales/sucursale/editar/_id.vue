<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-center">
          <div class="col-sm-8 col-12">
            <div class="card">
              <div class="card-header">
                <h3>Editar Sucursal</h3>
              </div>
              <div class="card-body">
                <CrudUpdate4 :model="model" :apiUrl="apiUrl">
                  <div slot="body" class="row">
                    <div class="form-group col-12">
                      <label for="">Sucursal</label>
                      <input type="text" v-model="model.nombre" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">Codigo de Cliente</label>
                      <input type="text" v-model="model.codigo_cliente" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">Numero de Contrato</label>
                      <input type="text" v-model="model.n_contrato" class="form-control" id="">
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
                    <div class="row">
                      <div class="form-group col-md-6">
                        <label for="tipo_contrato">Quien pagara*</label>
                        <select v-model="model.pagador" class="form-control" id="pagador">
                          <option value="ENTIDAD CONTRATANTE">Entidad Contratante</option>
                          <option value="MISMA EMPRESA">Misma Empresa</option>
                        </select>
                      </div>
                    </div>

                    <div class="form-group col-12">
                      <label for="">Contacto Administrativo</label>
                      <input type="number" v-model="model.contacto_administrativo" class="form-control" id="">
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
      title: "sucursales",
    };
  },
  data() {
    return {
      load: true,
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
        email: '',
        password: '',
        empresa_id: '',
        pagador: '',
      },
      apiUrl: "sucursales3",
      page: "sucursales",
      modulo: "Agbc",
      empresas: [],
      ini_vigencia: '',
      fin_vigencia: ''
    };
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$gestores.$get(path);
      return res
    },
  },
  mounted() {
    this.$nextTick(async () => {
      try {
        await Promise.all([
          this.GET_DATA(this.apiUrl + '/' + this.$route.params.id),
          this.GET_DATA('empresas3')
        ]).then((v) => {
          this.model = v[0];
          this.empresas = v[1];
        })
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    });
  }
};
</script>
