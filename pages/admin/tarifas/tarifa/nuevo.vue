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
                    <label class="form-label" for="">Sucursal</label>
                    <select name="" id="" class="form-control" v-model="model.sucursale_id">
                      <option v-for="m in sucursales" :value="m.id">{{ m.nombre }}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="">Departamento de envio</label>
                    <input type="text" v-model="model.departamento" class="form-control" id="">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="">Precio Servicio Courier</label>
                    <input type="text" v-model="model.servicio" class="form-control" id="">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="">Precio Servicio Provincia</label>
                    <input type="text" v-model="model.servicioprov" class="form-control" id="">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="">Precio Servicio Express</label>
                    <input type="text" v-model="model.servicioexpress" class="form-control" id="">
                  </div>
                </div>
                
                <div v-for="(clonado, index) in clonados" :key="index" class="form-horizontal cloned-form">
                  <div class="form-group">
                    <label class="form-label" for="">Sucursal</label>
                    <select name="" id="" class="form-control" v-model="clonado.sucursale_id">
                      <option v-for="m in sucursales" :value="m.id">{{ m.nombre }}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="">Departamento de envio</label>
                    <input type="text" v-model="clonado.departamento" class="form-control" id="">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="">Precio Servicio Courier</label>
                    <input type="text" v-model="clonado.servicio" class="form-control" id="">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="">Precio Servicio Provincia</label>
                    <input type="text" v-model="clonado.servicioprov" class="form-control" id="">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="">Precio Servicio Express</label>
                    <input type="text" v-model="clonado.servicioexpress" class="form-control" id="">
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
        servicioprov: '',
        servicioexpress: '',
      },
      apiUrl: 'tarifas',
      page: 'tarifas',
      modulo: 'AGBC',
      load: true,
      sucursales: [],
      clonados: []
    };
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$api.$get(path);
      return res;
    },
    async guardarDatos(data) {
      try {
        const res = await this.$api.$post(this.apiUrl, data);
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
      // Esto podría implicar hacer una solicitud POST/PUT a tu API
      try {
        const response = await this.$api.$post(this.apiUrl, this.model);
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
        await Promise.all([this.GET_DATA('sucursales')]).then((v) => {
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
