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
                      <label for="">Sucursal</label>
                      <select name="" id="" class="form-control" v-model="model.sucursale_id"disabled>
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
                      <label for="">Peso Empresa (Kg)</label>
                      <input type="text" v-model="model.peso_o" class="form-control" id=""disabled>
                    </div>
                    <div class="form-group col-12">
                      <label for="">Peso Agencia (Kg)</label>
                      <input type="text" v-model="model.peso_v" class="form-control" id="">
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
      apiUrl: "solicitudes",
      page: "solicitudes",
      modulo: "Agbc",
      sucursales: [],
      carteros: [], // Añadido para cargar los carteros
      ini_vigencia: '',
      fin_vigencia: ''
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
        await Promise.all([
          this.GET_DATA(this.apiUrl + '/' + this.$route.params.id),
          this.GET_DATA('sucursales'),
          this.GET_DATA('carteros') // Añadido para cargar los carteros
        ]).then((v) => {
          this.model = v[0];
          this.sucursales = v[1];
          this.carteros = v[2]; // Asignar los carteros
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
