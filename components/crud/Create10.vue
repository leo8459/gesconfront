<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <div class="row">
      <div class="col-12">
        <slot name="body"></slot>
      </div>
      <div class="col-12">
        <div class="row">
          <div class="col-6">
            <button class="btn btn-info w-100" @click="$router.back()">
              Regresar
            </button>
          </div>
          <div class="col-6">
            <button class="btn btn-dark w-100" @click="Save()">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import EMSImage from '@/pages/sucursal/sucursales/sucursal/img/EMS.png';

export default {
  props: {
    model: {
      type: Object,
      default: () => { }
    },
    apiUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      load: false,
    };
  },
  methods: {
    async Save() {
      this.load = true;
      try {
        const res = await this.$sucursales.$post(this.apiUrl, this.model);
        console.log('Respuesta completa del servidor:', res);

        if (res) {
        } else {
          console.error('No se recibieron datos desde el servidor.');
        }

        this.$swal
          .fire({
            title: "Guardado!",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "Ok",
          })
          .then((result) => {
            if (result.isConfirmed) {
              this.$router.back();
            }
          });
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },

  


  },
  mounted() {
    this.$nextTick(async () => {
      try {
        // Realiza cualquier tarea que necesites al montar el componente
      } catch (e) {
        console.log(e);
      } finally {
        // Finaliza cualquier tarea de montaje si es necesario
      }
    });
  },
};
</script>
