<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-center">
          <div class="col-md-8 col-12">
            <div class="card">
              <div class="card-header">
                <h3>Agregar Casilla</h3>
              </div>
              <div class="card-body">
                <CrudCreate :model="model" :apiUrl="apiUrl">
                  <div slot="body" class="row">
                    <div class="form-group col-12">
                      <label for="sucursal">Sucursal</label>
                      <select id="sucursal" class="form-control" v-model="model.sucursale_id">
                        <option v-for="m in sucursales" :key="m.id" :value="m.id">{{ m.nombre }}</option>
                      </select>
                    </div>
                    <div class="form-group col-12">
                      <label for="sucursal">carteros</label>
                      <select id="sucursal" class="form-control" v-model="model.cartero_id">
                        <option v-for="m in carteros" :key="m.id" :value="m.id">{{ m.nombre }}</option>
                      </select>
                    </div>
                    <div class="form-group col-12">
                      <label for="guia">Guia</label>
                      <input type="text" v-model.trim="model.guia" class="form-control" id="guia">
                    </div>
                    <div class="form-group col-12">
                      <label for="peso_o">Peso Empresa</label>
                      <input type="text" v-model.trim="model.peso_o" class="form-control" id="peso_o">
                    </div>
                    <div class="form-group col-12">
                      <label for="peso_v">Peso Agencia</label>
                      <input type="text" v-model.trim="model.peso_v" class="form-control" id="peso_v">
                    </div>
                    <div class="form-group col-12">
                      <label for="remitente">Remitente</label>
                      <input type="text" v-model.trim="model.remitente" class="form-control" id="remitente">
                    </div>
                    <div class="form-group col-12">
                      <label for="direccion">Dirección</label>
                      <input type="text" v-model.trim="model.direccion" class="form-control" id="direccion">
                    </div>
                    <div class="form-group col-12">
                      <label for="telefono">Teléfono</label>
                      <input type="number" v-model.trim="model.telefono" class="form-control" id="telefono">
                    </div>
                    <div class="form-group col-12">
                      <label for="contenido">Contenido</label>
                      <input type="text" v-model.trim="model.contenido" class="form-control" id="contenido">
                    </div>
                    <div class="form-group col-12">
                      <label for="firma_o">Firma Origen</label>
                      <input type="hidden" v-model.trim="model.firma_o" class="form-control" id="firma_o">
                      <div class="position-relative">
                        <canvas id="canvas" class="border border-2 rounded-3 bg-white" width="560px" height="250px"></canvas>
                        <div class="btn-canvas">
                          <button type="button" id="guardar" class="btn btn-primary">Guardar</button>
                          <button type="button" id="limpiar" class="btn btn-secondary">Limpiar</button>
                        </div>
                      </div>
                    </div>
                    <div class="form-group col-12">
                      <label for="destinatario">Destinatario</label>
                      <input type="text" v-model.trim="model.destinatario" class="form-control" id="destinatario">
                    </div>
                    <div class="form-group col-12">
                      <label for="telefono_d">Teléfono Destinatario</label>
                      <input type="number" v-model.trim="model.telefono_d" class="form-control" id="telefono_d">
                    </div>
                    <div class="form-group col-12">
                      <label for="direccion_d">Dirección Destino</label>
                      <input type="text" v-model.trim="model.direccion_d" class="form-control" id="direccion_d">
                    </div>
                    <div class="form-group col-12">
                      <label for="ciudad">Municipio/Provincia</label>
                      <input type="text" v-model.trim="model.ciudad" class="form-control" id="ciudad">
                    </div>
                    <div class="form-group col-12">
                      <label for="firma_d">Firma Destino</label>
                      <input type="hidden" v-model.trim="model.firma_d" class="form-control" id="firma_d">
                      <div class="position-relative">
                        <canvas id="canvas2" class="border border-2 rounded-3 bg-white" width="560px" height="250px"></canvas>
                        <div class="btn-canvas">
                          <button type="button" id="guardar2" class="btn btn-primary">Guardar</button>
                          <button type="button" id="limpiar2" class="btn btn-secondary">Limpiar</button>
                        </div>
                      </div>
                    </div>
                    <div class="form-group col-12">
                      <label for="nombre_d">Nombre Destinatario</label>
                      <input type="text" v-model.trim="model.nombre_d" class="form-control" id="nombre_d">
                    </div>
                    <div class="form-group col-12">
                      <label for="ci_d">CI Destinatario</label>
                      <input type="text" v-model.trim="model.ci_d" class="form-control" id="ci_d">
                    </div>
                    <div class="form-group col-12">
                      <label for="estado">Estado</label>
                      <input type="text" v-model.trim="model.estado" class="form-control" id="estado">
                    </div>
                    <div class="form-group col-12">
                      <label for="fecha">Inicio Fecha</label>
                      <input type="date" v-model="model.fecha" class="form-control" :min="ini_vigencia" id="fecha">
                    </div>
                    <div class="form-group col-12">
                      <label for="fecha_d">Fin Fecha</label>
                      <input type="date" v-model="model.fecha_d" class="form-control" :min="fin_vigencia" id="fecha_d">
                    </div>
                  </div>
                </CrudCreate>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>
  </div>
</template>

<script>
import SignaturePad from 'signature_pad';


export default {
  data() {
    return {
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
      apiUrl: 'solicitudes',
      page: 'solicitudes',
      modulo: 'AGBC',
      load: true,
      sucursales: [],
      carteros: [],
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
        const sucursales = await this.GET_DATA('sucursales');
        this.sucursales = sucursales;
        const carteros = await this.GET_DATA('carteros'); // Asegúrate de cargar también los carteros
        this.carteros = carteros;
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }

      var canvas = document.getElementById('canvas');
      var signaturePad = new SignaturePad(canvas);
      var clearButton = document.getElementById('limpiar');
      var generateButton = document.getElementById('guardar');
      clearButton.addEventListener('click', () => {
        signaturePad.clear();
        this.model.firma_o = "";
      });

      generateButton.addEventListener('click', () => {
        console.log('guardar');
        var firma = signaturePad.toDataURL();
        this.model.firma_o = firma;
      });

      var canvas2 = document.getElementById('canvas2');
      var signaturePad2 = new SignaturePad(canvas2);
      var clearButton2 = document.getElementById('limpiar2');
      var generateButton2 = document.getElementById('guardar2');
      clearButton2.addEventListener('click', () => {
        signaturePad2.clear();
        this.model.firma_d = "";
      });

      generateButton2.addEventListener('click', () => {
        console.log('guardar2');
        var firma2 = signaturePad2.toDataURL();
        this.model.firma_d = firma2;
      });

    });

  },
}
</script>
