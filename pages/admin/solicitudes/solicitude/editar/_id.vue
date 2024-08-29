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
                      <label for="">Cartero</label>
                      <select name="" id="" class="form-control" v-model="model.cartero_id">
                        <option v-for="m in carteros" :value="m.id">{{ m.nombre }}</option>
                      </select>
                    </div>

                    <div class="form-group col-12">
                      <label for="">Sucursal</label>
                      <input type="text" v-model="model.guia" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">Peso Empresa</label>
                      <input type="text" v-model="model.peso_o" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">peso Agencia</label>
                      <input type="text" v-model="model.peso_v" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">remitente</label>
                      <input type="text" v-model="model.remitente" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">direccion</label>
                      <input type="text" v-model="model.direccion" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">telefono</label>
                      <input type="number" v-model="model.telefono" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">contenido</label>
                      <input type="text" v-model="model.contenido" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">firma_o</label>
                      <input type="text" v-model="model.firma_o" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">destinatario</label>
                      <input type="text" v-model="model.destinatario" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">telefono Destinatario</label>
                      <input type="number" v-model="model.telefono_d" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">Direccion Destino</label>
                      <input type="text" v-model="model.direccion_d" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">Municipio/Provincia</label>
                      <input type="text" v-model="model.ciudad" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">firma_d</label>
                      <input type="text" v-model="model.firma_d" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">nombre Destinatario</label>
                      <input type="text" v-model="model.nombre_d" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">CI destinatario</label>
                      <input type="text" v-model="model.ci_d" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">estado</label>
                      <input type="text" v-model="model.estado" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label for="">Inicio Fecha</label>
                      <input type="date" v-model="model.fecha" class="form-control" :min="ini_vigencia">
                    </div>
                    <div class="form-group col-12">
                      <label for="">Fin Fecha</label>
                      <input type="date" v-model="model.fecha_d" class="form-control" :min="fin_vigencia">
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
      title: "solicitudes",
    };
  },
  data() {
    return {
      load: true,
      model: {
        sucursale_id: '',
        cartero_id: '',
        guia: '',
        peso_o: '',
        peso_v: '',
        remitente: '',
        direccion: '',
        telefono: '',
        contenido: '',
        fecha: '',
        firma_o: '',
        destinatario: '',
        telefono_d: '',
        direccion_d: '',
        ciudad: '',
        firma_d: '',
        nombre_d: '',
        ci_d: '',
        fecha_d: '',
        estado: '',
      },
      apiUrl: "solicitudes1",
      page: "solicitudes",
      modulo: "Agbc",
      sucursales: [],
      ini_vigencia: '',
      fin_vigencia: ''
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
        await Promise.all([
          this.GET_DATA(this.apiUrl + '/' + this.$route.params.id),
          this.GET_DATA('sucursales'),
          this.GET_DATA('carteros')
        ]).then((v) => {
          this.model = v[0];
          this.sucursales = v[1];
          this.carteros = v[2];
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
