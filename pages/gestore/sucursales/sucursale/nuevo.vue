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
                <CrudCreate4 :model="model" :apiUrl="apiUrl">
                  <div slot="body" class="row">
                    <div class="form-group col-12">
                      <label for="empresa">Empresa</label>
                      <v-select :options="empresas" v-model="model.empresa_id" label="nombre"
                        :reduce="empresa => empresa.id" placeholder="Buscar empresa...">
                        <template #option="option">
                          <div>
                            {{ option.nombre }}
                          </div>
                        </template>
                        <template #selected-option="option">
                          <div>
                            {{ option.nombre }}
                          </div>
                        </template>
                      </v-select>
                    </div>

                    <div class="form-group col-12">
                      <label for="">Nombre de sucursal</label>
                      <input type="text" v-model="model.nombre" class="form-control" id="">
                    </div>


                    <div class="form-group col-12">
                      <label for="">Numero de contrato</label>
                      <input type="text" v-model="model.n_contrato" class="form-control" id="">
                    </div>



                    <div class="form-group col-12">
                      <label for="origen">Departamento de la sucursal</label>
                      <select v-model="model.origen" class="form-control" id="origen">
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


                    <div class="form-group col-12">
                      <label for="acuerdo_contrato">Acuerdo contrato</label>
                      <select v-model="model.acuerdo_contrato" class="form-control" id="acuerdo_contrato">
                        <option value="CONTRATO">CONTRATO</option>
                        <option value="CONVENIO">CONVENIO</option>
                        <option value="POSTPAGO">POSTPAGO</option>
                        <option value="TASITA RECONDUCCIÓN">TASITA RECONDUCCIÓN</option>
                      </select>
                    </div>

                    <div class="form-group col-12">
                      <label for="tipo_contrato">Tipo de contrato</label>
                      <select v-model="model.tipo_contrato" class="form-control" id="tipo_contrato">
                        <option value="EMS">EMS</option>
                        <option value="ECA">ECA</option>
                        <option value="EMS Y ECA">EMS Y ECA</option>
                      </select>
                    </div>

                    <div class="form-group col-12">
                      <label for="">Inicio de contrato</label>
                      <input type="date" v-model="model.ini_vigencia" class="form-control" :min="ini_vigencia">
                    </div>

                    <div class="form-group col-12">
                      <label for="">Fin de contrato</label>
                      <input type="date" v-model="model.fin_vigencia" class="form-control" :min="fin_vigencia">
                    </div>

                    <div class="form-group col-12">
                      <label for="">Limite presupuestario</label>
                      <input type="text" v-model="model.limite" class="form-control" id="">
                    </div>

                    <div class="form-group col-12">
                      <label for="cobertura">Cobertura</label>
                      <select v-model="model.cobertura" class="form-control" id="cobertura">
                        <option value="Internacional">Internacional</option>
                        <option value="Nacional">Nacional</option>
                        <option value="Local">Local</option>
                        <option value="Interprovincial">Interprovincial</option>
                      </select>
                    </div>


                    <div class="form-group col-12">
                      <label for="">Acuerdo recojo</label>
                      <input type="text" v-model="model.acuerdos" class="form-control" id="">
                    </div>
<!-- 
                    <div class="form-group col-12">
                      <label for="">Direccion</label>
                      <input type="text" v-model="model.direccion" class="form-control" id="">
                    </div> -->

                    <div class="form-group col-12">
                      <label for="">Contacto Administrativo</label>
                      <input type="number" v-model="model.contacto_administrativo" class="form-control" id="">
                    </div>

                    <div class="form-group col-12">
                      <label for="">Email</label>
                      <input type="text" v-model="model.email" class="form-control" id="">
                    </div>

                    <div class="form-group col-12">
                      <label for="">Password</label>
                      <input type="password" v-model="model.password" class="form-control" id="">
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
import 'vue-select/dist/vue-select.css';
import vSelect from 'vue-select';
export default {
  components: {
    vSelect,
  },
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
        codigo_cliente: '',
        empresa_id: '',
        tipo_contrato: '', // Este será llenado al recibir los datos del backend
        acuerdo_contrato: '', // Este será llenado al recibir los datos del backend

      },
      apiUrl: 'sucursales3',
      page: 'Sucursal',
      modulo: 'AGBC',
      load: true,
      empresas: [],
      ini_vigencia: '',
      fin_vigencia: ''
    }
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
        await Promise.all([this.GET_DATA('empresas3')]).then((v) => {
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
