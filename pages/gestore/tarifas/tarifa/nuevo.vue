<template>
  <div>
    <JcLoader :load="load"></JcLoader>

    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-center">
          <div class="col-sm-12 col-12">
            <div class="card">
              <div class="card-header">
                <h3>Agregar Tarifa</h3>
              </div>
              <div class="card-body">
                <div class="form-horizontal">
                  <div class="form-group">
                    <label class="form-label" for="sucursal">Sucursal</label>
                    <select name="" id="sucursal" class="form-control" v-model="model.sucursale_id">
                      <option v-for="m in sucursales" :value="m.id">{{ m.nombre }}</option>
                    </select>
                  </div>
                  <div class="form-group col-12">
                    <label for="origen">Departamento de envio</label>
                    <select v-model="model.departamento" class="form-control" id="departamento">
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

                  <div class="form-group">
                    <label class="form-label" for="provincia">Municipio de envio</label>
                    <input type="text" v-model="model.provincia" class="form-control" id="provincia">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="servicio">Servicio</label>
                    <select v-model="model.servicio" class="form-control" id="servicio">
                      <option value="SERVICIO COURIER NACIONAL (Normal)">SERVICIO COURIER NACIONAL (Normal)</option>
                      <option value="SERVICIO COURIER NACIONAL (Expreso)">SERVICIO COURIER NACIONAL (Expreso)</option>
                      <option value="SERVICIO COURIER LOCAL (Normal)">SERVICIO COURIER LOCAL (Normal)</option>
                      <option value="SERVICIO COURIER LOCAL (Expreso)">SERVICIO COURIER LOCAL (Expreso)</option>
                      <option value="SERVICIO DE PROVINCIAS A NIVEL NACIONAL">SERVICIO DE PROVINCIAS A NIVEL NACIONAL
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="precio">Precio Servicio por 1 kilo (Bs)</label>
                    <input type="text" v-model="model.precio" class="form-control" id="precio">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="precio_extra">Precio Servicio por kilo extra (Bs)</label>
                    <input type="text" v-model="model.precio_extra" class="form-control" id="precio_extra">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="retencion">Retencion (si aplica)</label>
                    <input type="text" v-model="model.retencion" class="form-control" id="retencion">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="retencion">Horas de entrega</label>
                    <input type="text" v-model="model.dias_entrega" class="form-control" id="dias_entrega">
                  </div>
                  <div class="form-group form-check">
                    <input type="checkbox" v-model="model.envio_internacional" class="form-check-input"
                      id="envio_internacional">
                    <label class="form-check-label" for="envio_internacional">Envio Internacional</label>
                  </div>
                </div>

                <div v-for="(clonado, index) in clonados" :key="index" class="form-horizontal cloned-form">
                  <div class="form-group">
                    <label class="form-label" for="sucursal">Sucursal</label>
                    <select name="" id="sucursal" class="form-control" v-model="clonado.sucursale_id">
                      <option v-for="m in sucursales" :value="m.id">{{ m.nombre }}</option>
                    </select>
                  </div>
                  <div class="form-group col-12">
                    <label for="origen">Departamento de envio</label>
                    <select v-model="clonado.departamento" class="form-control" id="departamento">
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
                  <div class="form-group">
                    <label class="form-label" for="provincia">Municipio de envio</label>
                    <input type="text" v-model="clonado.provincia" class="form-control" id="provincia">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="servicio">Servicio</label>
                    <select v-model="clonado.servicio" class="form-control" id="servicio">
                      <option value="SERVICIO COURIER NACIONAL (Normal)">SERVICIO COURIER NACIONAL (Normal)</option>
                      <option value="SERVICIO COURIER NACIONAL (Expreso)">SERVICIO COURIER NACIONAL (Expreso)</option>
                      <option value="SERVICIO COURIER LOCAL (Normal)">SERVICIO COURIER LOCAL (Normal)</option>
                      <option value="SERVICIO COURIER LOCAL (Expreso)">SERVICIO COURIER LOCAL (Expreso)</option>
                      <option value="SERVICIO DE PROVINCIAS A NIVEL NACIONAL">SERVICIO DE PROVINCIAS A NIVEL NACIONAL
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="precio">Precio Servicio</label>
                    <input type="text" v-model="clonado.precio" class="form-control" id="precio">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="precio_extra">Precio Servicio Extra</label>
                    <input type="text" v-model="clonado.precio_extra" class="form-control" id="precio_extra">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="retencion">Retencion (si aplica)</label>
                    <input type="text" v-model="clonado.retencion" class="form-control" id="retencion">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="retencion">Horas de entrega</label>
                    <input type="text" v-model="clonado.dias_entrega" class="form-control" id="dias_entrega">
                  </div>
                  <div class="form-group form-check">
                    <input type="checkbox" v-model="clonado.envio_internacional" class="form-check-input"
                      :id="'envio_internacional_' + index">
                  </div>
                </div>

                <div class="d-flex justify-content-between mt-3">
                  <button class="btn btn-secondary" @click.prevent="clonarFormulario">Clonar</button>
                  <button class="btn btn-dark" @click.prevent="guardarTodos">Guardar y Agregar</button>
                </div>
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
        sucursale_id: '',
        departamento: '',
        servicio: '',
        precio: '',
        precio_extra: '',
        provincia: '',
        envio_internacional: false,
        retencion: '',
        dias_entrega: '',

      },
      apiUrl: 'tarifas3',
      page: 'tarifas',
      modulo: 'AGBC',
      load: true,
      sucursales: [],
      clonados: []
    };
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$gestores.$get(path);
      return res;
    },
    async guardarDatos(data) {
      try {
        const res = await this.$gestores.$post(this.apiUrl, data);
        if (res.success) {
          // Datos guardados correctamente, puedes mostrar un mensaje o realizar otras acciones
        }
      } catch (error) {
        console.error("Error al guardar los datos: ", error);
        // Manejo de errores, por ejemplo, mantener los datos en el formulario
      }
    },
    async guardarTodos() {
      try {
        // Guarda el formulario principal
        await this.guardarDatos(this.model);
        // Guarda todos los formularios clonados
        for (let clon of this.clonados) {
          await this.guardarDatos(clon);
        }
        // Redirige al usuario a la página anterior
        this.$router.go(-1);
      } catch (error) {
        console.error("Error al guardar todos los datos: ", error);
      }
    },
    clonarFormulario() {
      // Clona el formulario y añade a la lista de formularios clonados
      const clon = { ...this.model };
      this.clonados.push(clon);
    },
    handleSave() {
      // Este método se llama cuando los datos se guardan correctamente
      // Puedes agregar cualquier lógica adicional aquí si es necesario
    },
    async saveData() {
      // Implementa aquí la lógica para guardar los datos
      // Esto podría implicar hacer una solicitud POST/PUT a tu gestores
      try {
        const response = await this.$gestores.$post(this.apiUrl, this.model);
        // Maneja la respuesta según sea necesario
        this.handleSave();
      } catch (error) {
        console.error('Error al guardar los datos:', error);
      }
    },
    getSucursalName(id) {
      const sucursal = this.sucursales.find(s => s.id === id);
      return sucursal ? sucursal.nombre : 'Desconocido';
    }
  },
  mounted() {
    this.$nextTick(async () => {
      try {
        await Promise.all([this.GET_DATA('sucursales3')]).then((v) => {
          this.sucursales = v[0];
        })
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false
      }
    });
  },
}
</script>

<style>
.form-horizontal {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.form-horizontal .form-group {
  flex: 1;
  min-width: 200px;
}

.form-horizontal .form-label {
  display: block;
  margin-bottom: 5px;
}

.cloned-form {
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
}
</style>
