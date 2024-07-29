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
                  <div slot="body" class="row">
                    <div class="form-group col-12">
                      <label for="">Sucursal</label>
                      <select name="" id="" class="form-control" v-model="model.sucursale_id" disabled>
                        <option v-for="m in sucursales" :value="m.id">{{ m.nombre }}</option>
                      </select>
                    </div>
                    <div class="form-group col-12">
                      <label for="">Cartero</label>
                      <select name="" id="" class="form-control" v-model="model.cartero_id"disabled>
                        <option v-for="m in carteros" :value="m.id">{{ m.nombre }}</option>
                      </select>
                    </div>
                    <div class="form-group col-12">
                      <label for="">Peso Empresa (Kg)</label>
                      <input type="text" v-model="model.peso_o" class="form-control" id="" disabled>
                    </div>
                    <div class="form-group col-12">
                      <label for="">Peso Agencia (Kg)</label>
                      <input type="text" v-model="model.peso_v" class="form-control" id=""disabled>
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
                      <label for="fecha_d">Fin Fecha</label>
                      <input type="text" v-model="model.fecha_d" class="form-control" id="fecha_d" disabled>
                    </div>
                  </div>
                <button class="btn btn-danger" @click="darDeBaja">Entregar Correspondencia</button>
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
      carteros: [],
      ini_vigencia: '',
      fin_vigencia: ''
    };
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$administrador.$get(path);
      return res;
    },
    async darDeBaja() {
      try {
        this.model.estado = 3;
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        this.model.fecha_d = `${day}/${month}/${year} ${hours}:${minutes}`;
        await this.$administrador.$put(`${this.apiUrl}/${this.model.id}`, this.model);
        alert('El registro ha sido dado de baja.');
        window.location.href = 'http://localhost:3005/admin/solicitudesj/solicitudej'; // Redirigir a la URL especificada
      } catch (error) {
        console.error('Error al dar de baja:', error);
        alert('Hubo un error al dar de baja el registro.');
      }
    }
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
        });
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }


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
  }
};
</script>
