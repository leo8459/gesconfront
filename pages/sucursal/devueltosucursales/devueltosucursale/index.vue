<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end mb-3">
          <div class="col-2">
           
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card border-rounded">
              <div class="card-header">
                Devueltos
              </div>
              <div class="card-body p-2">
                <div class="table-responsive">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Sucursal</th>
                        <th>Guía</th>
                        <th>Observación</th>
                        <th>Foto de observacion</th>
                        <th>Fecha devolucion</th>
                        <th>Foto de la entrega</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(m, i) in paginatedList" :key="i">
                        <td>{{ currentPage * itemsPerPage + i + 1 }}</td>
                        <td>{{ dash(m.sucursale.nombre) }}</td>
                        <td>{{ dash(m.guia) }}</td>
                        <td>{{ dash(m.observacion) }}</td>
                        <td>
                          <div class="d-flex flex-column align-items-center">
                            <button v-if="m.imagen" @click="downloadImage(m.imagen)"
                              class="btn btn-sm btn-primary mt-1 align-self-center">
                              Descargar
                            </button>
                          </div>
                        </td>
                        <td>{{ dash(m.fecha_devolucion) }}</td>
                        <td>
                          <div class="d-flex flex-column align-items-center">
                            <button v-if="m.imagen_devolucion" @click="downloadImage(m.imagen_devolucion)"
                              class="btn btn-sm btn-primary mt-1 align-self-center">
                              Descargar
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- Paginación -->
                <nav aria-label="Page navigation">
  <ul class="pagination justify-content-between">
    <!-- Botón de página anterior -->
    <li class="page-item" :class="{ disabled: currentPage === 0 }">
      <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 0">&lt;</button>
    </li>

    <!-- Números de página dinámicos -->
    <li v-for="page in totalPagesArray" :key="page" :class="['page-item', { active: page === currentPage + 1 }]">
      <button v-if="page !== '...'" class="page-link" @click="goToPage(page - 1)">
        {{ dash(page) }}
      </button>
      <span v-else class="page-link">...</span>
    </li>

    <!-- Botón de página siguiente -->
    <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
      <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages - 1">&gt;</button>
    </li>
  </ul>
</nav>

              </div>
            </div>
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
      apiUrl: 'solicitudes2',
      page: 'solicitudes',
      modulo: 'solicitudes',
      url_nuevo: '/sucursal/sucursales/sucursal/nuevo',
      url_editar: '/sucursal/sucursales/sucursal/editar/',
      user: {
        sucursale: []
      },
      currentPage: 0,
      itemsPerPage: 10,
    };
  },
  computed: {
    totalPagesArray() {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage + 1; // Ajustar para índice basado en 1
    const maxPagesToShow = 3;

    const pages = [];

    // Mostrar los primeros tres números
    for (let i = 1; i <= Math.min(maxPagesToShow, totalPages); i++) {
      pages.push(i);
    }

    // Mostrar puntos suspensivos si hay un salto entre las primeras y las páginas actuales
    if (currentPage > maxPagesToShow + 1) {
      pages.push('...');
    }

    // Mostrar las páginas cercanas a la actual
    const startPage = Math.max(currentPage - 1, maxPagesToShow + 1);
    const endPage = Math.min(currentPage + 1, totalPages - maxPagesToShow);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Mostrar puntos suspensivos si hay un salto entre las páginas actuales y las últimas
    if (currentPage < totalPages - maxPagesToShow) {
      pages.push('...');
    }

    // Mostrar los últimos tres números
    for (let i = Math.max(totalPages - maxPagesToShow + 1, endPage + 1); i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  },
    filteredList() {
  const userId = this.user?.user?.id;

  // si no hay user logueado, no muestres nada y evitas el error
  if (!userId) return [];

  return this.list.filter(item =>
    item?.sucursale?.id === userId &&
    (item?.estado === 7 || item?.estado === 7)
  );
},

    sortedList() {
      return this.filteredList.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },
    paginatedList() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.sortedList.length / this.itemsPerPage);
    }
  },
  methods: {
    generateThumbnail(base64Image) {
      const img = new Image();
      img.src = base64Image;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Ajustar la resolución del thumbnail
      const MAX_WIDTH = 100; // Ajustar según sea necesario
      const MAX_HEIGHT = 100; // Ajustar según sea necesario

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Aquí no es necesario comprimir el thumbnail en exceso si queremos mostrar una imagen más clara
      return canvas.toDataURL('image/jpeg', 0.1);
    },


    downloadImage(base64Image) {
      const link = document.createElement('a');
      link.href = base64Image; // Aquí estás usando la imagen original almacenada
      link.download = 'imagen_capturada.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    async GET_DATA(path) {
      const res = await this.$sucursales.$get(path);
      return res;
    },
    async EliminarItem(id) {
      this.load = true;
      try {
        const res = await this.$sucursales.$delete(this.apiUrl + '/' + id);
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
        title: '¿Deseas eliminar?',
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
    async DarDeBaja(id) {
      this.load = true;
      try {
        const item = this.list.find(m => m.id === id);
        if (item) {
          item.estado = 3; // Cambiar estado a 3 (Entregado)
          await this.$sucursales.$put(this.apiUrl + '/' + id, item);
          await Promise.all([this.GET_DATA(this.apiUrl)]).then((v) => {
            this.list = v[0];
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },
    getEstadoLabel(estado) {
      switch (estado) {
        case '1':
          return 'Solicitudes';
        case '2':
          return 'En camino';
        case '3':
          return 'Entregados';
        case '5':
          return 'Pendientes';
        case '0':
          return 'Cancelados';
        default:
          return 'Otro estado';
      }
    },
    isCoordinates(address) {
      const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      return regex.test(address);
    },
    goToPage(page) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
    }
  },
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  },
  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  },
  },
 mounted() {
  this.$nextTick(async () => {
    const userStr = localStorage.getItem('userAuth');
    this.user = userStr ? JSON.parse(userStr) : { user: null };

    if (!this.user?.user?.id) {
      this.list = [];
      this.load = false;
      return;
    }

    try {
      const data = await this.GET_DATA(this.apiUrl);
      this.list = Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Error al obtener los datos:', e);
      this.list = [];
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
  border: 1px solid #34447C;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.card-header {
  background-color: #34447C;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
}

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}

.table th,
.table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  vertical-align: middle;
}

.table th {
  background-color: #6c7a89; /* Gris oscuro */
  color: #FFFFFF; /* Blanco para el texto para asegurar la legibilidad */
  border-bottom: 2px solid #34447C;
}

.table-hover tbody tr:hover {
  background-color: #F8F9FA;
}

.pagination .page-item.active .page-link {
  background-color: #ffffff;
  border-color: #ffffff;
}

.pagination .page-item .page-link {
  color: #343A40;
}

.btn-primary {
  background-color: #e50580;
  border-color: #e50580;
}

.btn-primary:hover {
  background-color: #34447C;
  border-color: #34447C;
}
.pagination .page-item.active .page-link {
  background-color: #34447C;
  color: white;
  border-color: #34447C;
}

.pagination .page-item .page-link {
  color: #343a40;
  cursor: pointer;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
}

</style>
