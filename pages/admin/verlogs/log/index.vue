<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Mensaje Principal</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(log, index) in list" :key="index">
                      <td>{{ log.logNumber }}</td>
                      <td>{{ log.mainMessage }}</td>
                      <td>
                        <button
                          class="btn btn-primary btn-sm"
                          @click="toggleDetails(index)"
                        >
                          {{ log.showDetails ? "Ocultar" : "Ver más" }}
                        </button>
                      </td>
                    </tr>
                    <tr v-if="log.showDetails" v-for="(log, index) in list" :key="'details-' + index">
                      <td colspan="3">
                        <pre>{{ log.details }}</pre>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  name: "IndexPage",
  data() {
    return {
      load: true,
      list: [], // Almacena los logs estructurados
      apiUrl: "logs", // Endpoint para obtener los logs
      page: "logs",
      modulo: "Logs de la Aplicación",
    };
  },
  methods: {
    async GET_DATA(path) {
      try {
        const res = await this.$administrador.$get(path); // Método GET para obtener datos
        return res;
      } catch (e) {
        console.error("Error al obtener los datos:", e);
        return null;
      }
    },
    async fetchLogs() {
      try {
        const res = await this.GET_DATA(this.apiUrl);
        if (res && Array.isArray(res)) {
          // Mapear la respuesta para incluir `showDetails`
          this.list = res.map((log) => ({
            ...log,
            showDetails: false, // Control para desplegar u ocultar detalles
          }));
        } else {
          console.warn("No se recibieron logs válidos");
        }
      } catch (e) {
        console.error("Error al procesar los logs:", e);
      } finally {
        this.load = false;
      }
    },
    toggleDetails(index) {
      this.list[index].showDetails = !this.list[index].showDetails;
    },
  },
  mounted() {
    this.$nextTick(async () => {
      this.load = true;
      await this.fetchLogs();
    });
  },
};
</script>
