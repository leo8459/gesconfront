<template>
    <div>
      <JcLoader :load="load"></JcLoader>
      <AdminTemplate :page="page" :modulo="modulo">
        <div slot="body">
          <div class="row justify-content-end mb-3"></div>
          <div class="row">
            <div class="col-6">
              <input type="text" v-model="searchQuery" class="form-control mb-3" placeholder="Buscar solicitud...">
              <div v-for="(group, estado) in groupedData" :key="estado" class="col-12">
                <div class="card border-rounded">
                  <div class="card-header" @click="toggleCollapse(estado)">
                    {{ estado === '1' ? 'Solicitudes' : estado === '2' ? 'En camino' : estado === '3' ? 'Entregados' :
                      estado === '0' ? 'Cancelados' : 'Otro estado' }}
                  </div>
                  <b-collapse :id="'collapse-' + estado" v-model="collapseState[estado]">
                    <div class="card-body p-2">
                      <div class="table-responsive">
                        <table class="table table-sm table-bordered">
                          <thead>
                            <tr>
                              <th class="py-0 px-1">#</th>
                              <th class="py-0 px-1">Guia</th>
                              <th class="py-0 px-1">Sucursal</th>
                              <th class="py-0 px-1">Dirección Destinatario</th>
                              <th class="py-0 px-1">Municipio/Provincia</th>
                              <th class="py-0 px-1">Peso(Kg)</th>
                              <th class="py-0 px-1">Asignar</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(m, i) in filteredList(group)" :key="i">
                              <td class="py-0 px-1">{{ i + 1 }}</td>
                              <td class="py-0 px-1">{{ m.guia }}</td>
                              <td class="p-1">{{ m.sucursale.nombre }}</td>
                              <td class="py-0 px-1">{{ m.direccion_d }}</td>
                              <td class="py-0 px-1">{{ m.ciudad }}</td>
                              <td class="py-0 px-1">
                                <input type="number" v-model="m.peso_v" class="form-control form-control-sm" />
                              </td>
                              <td class="py-0 px-1">
                                <button @click="addDireccion(m)" class="btn btn-success btn-sm">
                                  <i class="fas fa-plus"></i>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </b-collapse>
                </div>
              </div>
            </div>
            <div class="col-6">
              <label for="cartero-select">Seleccionar Cartero</label>
              <select v-model="selectedCartero" id="cartero-select" class="form-control mb-5">
                <option v-for="cartero in carteros" :key="cartero.id" :value="cartero.id">{{ cartero.nombre }}</option>
              </select>
              <h5>Direcciones Asignadas al Cartero</h5>
              <ul class="list-group mb-3">
                <li v-for="(direccion, index) in direccionesAsignadas" :key="index" class="list-group-item">
                  <div>
                    <strong>Sucursal:</strong> {{ direccion.sucursale.nombre }} <br />
                    <strong>Guia:</strong> {{ direccion.guia }} <br />
                    <strong>Dirección:</strong> {{ direccion.direccion_d }} <br />
                    <strong>Ciudad:</strong> {{ direccion.ciudad }} <br />
                    <strong>Peso V:</strong> {{ direccion.peso_v }} Kg
                    <button @click="removeDireccion(index)" class="btn btn-danger btn-sm float-right">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </li>
              </ul>
              <button @click="guardarAsignaciones" class="btn btn-primary w-100">Guardar Asignaciones</button>
            </div>
          </div>
        </div>
      </AdminTemplate>
    </div>
  </template>
  
  <script>
  import { BCollapse } from 'bootstrap-vue';
  
  export default {
    name: "IndexPage",
    components: {
      BCollapse
    },
    data() {
      return {
        load: true,
        list: [],
        carteros: [],
        selectedCartero: null,
        direccionesAsignadas: [],
        solicitudesAsignadas: [],
        apiUrl: 'solicitudes',
        carterosApiUrl: 'carteros',
        page: 'solicitudes',
        modulo: 'solicitudes',
        url_nuevo: '/admin/solicitudes/solicitude/nuevo',
        url_asignar: '/admin/solicitudes/solicitude/asignar',
        url_editar: '/admin/solicitudes/solicitude/editar/',
        collapseState: {},
        searchQuery: ''
      };
    },
    computed: {
      groupedData() {
        const grouped = {};
        this.list.forEach(item => {
          if (item.estado === 1) { // Filtrar las solicitudes con estado 1
            if (!grouped[item.estado]) {
              grouped[item.estado] = [];
            }
            grouped[item.estado].push(item);
          }
        });
        return grouped;
      }
    },
    methods: {
      filteredList(group) {
        if (this.searchQuery) {
          return group.filter(item =>
            item.guia.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            item.sucursale.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            item.direccion_d.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            item.ciudad.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        }
        return group;
      },
      async GET_DATA(path) {
        const res = await this.$administrador.$get(path);
        return res;
      },
      async EliminarItem(id) {
        this.load = true;
        try {
          const res = await this.$administrador.$delete(this.apiUrl + '/' + id);
          await Promise.all([this.GET_DATA(this.apiUrl)]).then((v) => {
            this.list = v[0];
          });
        } catch (e) {
          console.log(e);
        } finally {
          this.load = false;
        }
      },
      Eliminar(id) {
        this.$swal.fire({
          title: 'Deseas Eliminar?',
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar',
        }).then(async (result) => {
          if (result.isConfirmed) {
            await this.EliminarItem(id);
          }
        });
      },
      toggleCollapse(estado) {
        this.$set(this.collapseState, estado, !this.collapseState[estado]);
      },
      addDireccion(direccion) {
        if (!this.selectedCartero) {
          this.$swal.fire('Seleccione un cartero primero', '', 'warning');
          return;
        }
        if (!direccion.peso_v || direccion.peso_v <= 0) {
          this.$swal.fire('Ingrese un peso válido', '', 'warning');
          return;
        }
        this.direccionesAsignadas.push(direccion);
        this.solicitudesAsignadas.push(direccion);
        this.list = this.list.filter(item => item.id !== direccion.id);
      },
      removeDireccion(index) {
        const direccion = this.direccionesAsignadas[index];
        this.list.push(direccion);
        this.direccionesAsignadas.splice(index, 1);
        this.solicitudesAsignadas = this.solicitudesAsignadas.filter(item => item.id !== direccion.id);
      },
      async guardarAsignaciones() {
    if (!this.selectedCartero || this.direccionesAsignadas.length === 0) {
      this.$swal.fire('Seleccione un cartero y añada direcciones primero', '', 'warning');
      return;
    }
    this.load = true;
    try {
      for (const direccion of this.direccionesAsignadas) {
        await this.$administrador.$put(this.apiUrl + '/' + direccion.id, {
          ...direccion, // Asegúrate de que todos los datos de la solicitud se envían
          cartero_id: this.selectedCartero, // Enviar el ID del cartero seleccionado
          estado: 2, // Cambiar el estado a 'En camino'
        });
      }
      await this.GET_DATA(this.apiUrl).then(data => {
        this.list = data;
      });
      this.direccionesAsignadas = [];
      this.solicitudesAsignadas = [];
      this.selectedCartero = null;
      this.$swal.fire('Cartero asignado', '', 'success');
    } catch (e) {
      console.log(e);
      this.$swal.fire('Error al asignar cartero', '', 'error');
    } finally {
      this.load = false;
    }
  },
},
    mounted() {
      this.$nextTick(async () => {
        try {
          const [solicitudesData, carterosData] = await Promise.all([
            this.GET_DATA(this.apiUrl),
            this.GET_DATA(this.carterosApiUrl)
          ]);
          if (Array.isArray(solicitudesData)) {
            this.list = solicitudesData;
          } else {
            console.error('Los datos de solicitudes no son un array:', solicitudesData);
          }
          if (Array.isArray(carterosData)) {
            this.carteros = carterosData;
          } else {
            console.error('Los datos de carteros no son un array:', carterosData);
          }
        } catch (e) {
          console.error('Error al obtener los datos:', e);
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
    overflow: hidden; /* Para asegurar que los bordes redondeados se apliquen correctamente */
  }
  .table-responsive {
    max-width: 100%;
    overflow-x: auto;
  }
  </style>
  