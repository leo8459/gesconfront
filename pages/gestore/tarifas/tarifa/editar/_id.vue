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
                      <label for="">Sucursal</label>
                      <select name="" id="" class="form-control" v-model="model.sucursale_id">
                        <option v-for="m in sucursales" :key="m.id" :value="m.id">{{ m.nombre }}</option>
                      </select>
                    </div>
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
                    <div class="form-group col-12">
                      <label class="form-label" for="">retencion (si aplica)</label>
                      <input type="text" v-model="model.retencion" class="form-control" id="">
                    </div>
                    <div class="form-group col-12">
                      <label class="form-label" for="">Dias de entrega</label>
                      <input type="text" v-model="model.dias_entrega" class="form-control" id="">
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
        retencion: '',
        dias_entrega: '',

      },
      apiUrl: "tarifas3",
      page: "tarifas",
      modulo: "Agbc",
      sucursales: [],
    };
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$gestores.$get(path);
      return res;
    },
  },
  mounted() {
    this.$nextTick(async () => {
      try {
        const [tarifaData, sucursalesData] = await Promise.all([
          this.GET_DATA(this.apiUrl + '/' + this.$route.params.id),
          this.GET_DATA('sucursales3')
        ]);

        // Verifica que tarifaData sea un objeto antes de asignarlo a this.model
        if (typeof tarifaData === 'object' && !Array.isArray(tarifaData)) {
          this.model = tarifaData;
        } else {
          console.error('Expected tarifaData to be an object but got:', tarifaData);
        }

        this.sucursales = Array.isArray(sucursalesData) ? sucursalesData : [];
      } catch (e) {
        console.error(e);
      } finally {
        this.load = false;
      }
    });
  }
};
</script>
