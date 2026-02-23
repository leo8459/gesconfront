<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="m-0">Asignar Carteros</h5>
          <div>
            <button class="btn btn-secondary btn-sm mr-2" @click="volver">Volver</button>
            <button class="btn btn-primary btn-sm" :disabled="!items.length || load" @click="confirmarAsignacion">
              Guardar asignaciones
            </button>
          </div>
        </div>

        <div class="card border-rounded">
          <div class="card-header">Solicitudes seleccionadas</div>
          <div class="card-body p-2">
            <div v-if="!items.length" class="alert alert-warning mb-0">
              No hay solicitudes seleccionadas. Vuelve y selecciona registros para asignar.
            </div>

            <div v-else class="table-responsive">
              <table class="table table-sm table-bordered table-hover">
                <thead>
                  <tr>
                    <th class="py-0 px-1">#</th>
                    <th class="py-0 px-1">Guía</th>
                    <th class="py-0 px-1">Sucursal</th>
                    <th class="py-0 px-1">Remitente</th>
                    <th class="py-0 px-1">Teléfono D</th>
                    <th class="py-0 px-1">Ciudad/Prov.</th>
                    <th class="py-0 px-1">Cartero</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in items" :key="item.id">
                    <td class="py-0 px-1">{{ idx + 1 }}</td>
                    <td class="py-0 px-1">{{ item.guia }}</td>
                    <td class="py-0 px-1">{{ item.sucursale_nombre }}</td>
                    <td class="py-0 px-1">{{ item.remitente || '-' }}</td>
                    <td class="py-0 px-1">{{ item.telefono_d || '-' }}</td>
                    <td class="py-0 px-1">{{ item.ciudad || '-' }}</td>
                    <td class="py-0 px-1">
                      <select v-model="selectedCarteros[item.id]" class="form-control form-control-sm">
                        <option :value="null" disabled>Seleccione cartero</option>
                        <option v-for="c in carteros" :key="c.id" :value="c.id">
                          {{ c.nombre || c.nombre2 || ('Cartero #' + c.id) }}
                        </option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminTemplate>
  </div>
</template>

<script>
export default {
  name: 'AsignarCarterosRecogidoEncargado',
  data() {
    return {
      load: true,
      page: 'solicitudes',
      modulo: 'solicitudes',
      items: [],
      carteros: [],
      selectedCarteros: {},
    };
  },
  methods: {
    volver() {
      this.$router.push('/encargado/recogidoencargados/recogidoencargado');
    },
    async cargarCarteros() {
      const res = await this.$encargados.$get('carteros');
      this.carteros = Array.isArray(res) ? res : [];
    },
    async confirmarAsignacion() {
      if (!this.items.length) {
        this.$swal.fire({
          icon: 'warning',
          title: 'Sin solicitudes',
          text: 'No hay solicitudes para asignar.',
        });
        return;
      }

      const faltantes = this.items.filter(item => !this.selectedCarteros[item.id]);
      if (faltantes.length) {
        this.$swal.fire({
          icon: 'warning',
          title: 'Faltan carteros',
          text: 'Selecciona un cartero para cada solicitud antes de guardar.',
        });
        return;
      }

      this.load = true;
      try {
        for (const item of this.items) {
          await this.$encargados.$put(`solicitudesrecojo5/${item.id}`, {
            cartero_recogida_id: Number(this.selectedCarteros[item.id]),
          });
        }

        localStorage.removeItem('asignar_carteros_recogido');
        this.$swal.fire({
          icon: 'success',
          title: 'Carteros asignados',
          text: 'Las solicitudes seleccionadas fueron asignadas correctamente.',
        });
        this.volver();
      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron guardar todas las asignaciones.',
        });
      } finally {
        this.load = false;
      }
    },
  },
  mounted() {
    this.$nextTick(async () => {
      try {
        const raw = localStorage.getItem('asignar_carteros_recogido');
        const parsed = raw ? JSON.parse(raw) : [];
        this.items = Array.isArray(parsed) ? parsed : [];

        if (!this.items.length) {
          this.$swal.fire({
            icon: 'warning',
            title: 'Sin selección',
            text: 'Primero selecciona solicitudes en la vista anterior.',
          });
          this.volver();
          return;
        }

        await this.cargarCarteros();
      } catch (e) {
        console.error(e);
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la vista de asignación.',
        });
        this.volver();
      } finally {
        this.load = false;
      }
    });
  },
};
</script>

<style scoped>
.card.border-rounded {
  border-radius: 15px;
  border: 1px solid #dee2e6;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.card-header {
  background-color: #7a2e2e;
  color: #ffffff;
  font-weight: bold;
  text-transform: uppercase;
}

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}
</style>
