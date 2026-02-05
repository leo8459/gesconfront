<template>
  <div>
    <JcLoader :load="load"></JcLoader>
    <AdminTemplate :page="page" :modulo="modulo">
      <div slot="body">
        <div class="row justify-content-end">
          <!-- Input de búsqueda -->
          <div class="col-12 mb-3 text-center">
            <h3 class="animated-header">Búsqueda de Envío</h3>
            <input v-model="searchTerm" type="text" class="form-control search-input mt-3"
              placeholder="Ingrese el número de guía..." />
          </div>

          <div class="col-12" v-if="searchTerm">
            <div v-if="filteredList.length === 0" class="text-center no-results">
              <p>No se encontraron eventos con los filtros aplicados.</p>
            </div>

            <div v-else class="timeline animated-timeline">
              <div v-for="(event, index) in filteredList" :key="index" class="timeline-item">
                <div class="timeline-icon animated-icon"></div>
                <div class="timeline-content animated-content">
                  <h5 class="animated-event-date">{{ dash(event.fecha_hora) }}</h5>
                  <p class="animated-event-description">
                    {{ dash(event.codigo) }} - {{ dash(event.accion) }}
                  </p>

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
  name: "IndexPage",
  data() {
    return {
      load: true,
      list: [],
      searchTerm: '',
      apiUrl: 'eventos2',
      page: 'Eventos',
      modulo: 'AGBC',
      currentPage: 0,
      itemsPerPage: 10,
      user: {
        sucursale: []
      },
      accionesPermitidas: [
        "cancelado",
        "Solicitud",
        "En camino",
        "Entregado",
        "Verificados",
        "Recojo",
        "Solicitud Manual",
        "Rechazado",
        "Devolucion",
        "Transito",
        "En camino",
        "Recibido en oficina",
        "Reencaminado",
        "Recibido origen"
      ],


    };
  },
  computed: {
    filteredList() {
      const searchTerm = (this.searchTerm || '').toLowerCase().trim();

      return this.list
        .filter(item => {
          if (!searchTerm) return false;

          const codigo = (item.codigo || '').toLowerCase();
          const accion = (item.accion || '');

          // Filtra por guía y acciones permitidas
          return (
            codigo.includes(searchTerm) &&
            this.accionesPermitidas.includes(accion)
          );
        })
        // ✅ ORDEN SOLO POR FECHA Y HORA
        .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));
    }
  },
  methods: {
    async GET_DATA(path) {
      const res = await this.$sucursales.$get(path);
      return res;
    },
  },
  mounted() {
    this.$nextTick(async () => {
      let user = localStorage.getItem('userAuth');
      this.user = JSON.parse(user);
      try {
        const data = await this.GET_DATA(this.apiUrl);
        if (Array.isArray(data)) {
          this.list = data;
        } else {
          console.error('Los datos recuperados no son un array:', data);
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
  border: 1px solid #000000;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.card-header {
  background-color: #34447C;
  color: #FFFFFF;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
}

.animated-header {
  font-size: 1.75rem;
  font-weight: bold;
  color: #34447C;
  animation: fadeIn 2s ease-in-out;
}

.search-input {
  max-width: 500px;
  margin: 0 auto;
  animation: slideIn 1.5s ease-out;
}

.no-results {
  font-size: 1.25rem;
  color: #999;
  animation: fadeIn 1.5s ease-in-out;
}

.timeline {
  position: relative;
  padding: 20px 0;
  margin: 20px 0;
  border-left: 3px solid #34447C;
}

.animated-timeline {
  animation: fadeInUp 1.5s ease;
}

.timeline-item {
  position: relative;
  padding: 10px 0 20px 30px;
  margin-bottom: 10px;
  animation: slideInTimeline 1s ease;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-icon {
  position: absolute;
  left: -12px;
  top: 10px;
  width: 20px;
  height: 20px;
  background-color: #5c6bc0;
  border-radius: 50%;
}

.animated-icon {
  animation: bounce 2s infinite;
}

.timeline-content {
  background: #f4f6f9;
  padding: 10px 15px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  animation: fadeInContent 1.2s ease-in;
}

.animated-content {
  animation: pulse 1.5s infinite;
}

.timeline-content h5 {
  margin: 0 0 5px;
  color: #34447C;
  animation: fadeInText 1s ease;
}

.animated-event-date {
  animation: fadeInText 1s ease;
}

.timeline-content p {
  margin: 0;
  animation: fadeInText 1.5s ease;
}

.animated-event-description {
  animation: fadeInText 1.5s ease;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes slideIn {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInTimeline {
  0% {
    transform: translateX(-30px);
    opacity: 0;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeInContent {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes fadeInText {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}
</style>
