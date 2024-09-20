<template>
  <aside class="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3"
    id="sidenav-main">
    <div class="collapse navbar-collapse w-auto h-auto" id="sidenav-collapse-main">
      <ul class="navbar-nav">
        <!-- Sidebar Header with logo and title -->
        <!-- Sidebar Header with logo and title -->
        <li class="nav-item mt-3 d-flex align-items-center sidebar-header">
          <img class="agbc-logo me-2" src="@/pages/admin/auth/img/AGBClogo.png" alt="AGBC Logo"
            :style="{ width: logoWidth, height: logoHeight }">
          <h6 class="text-uppercase text-xs font-weight-bolder opacity-6">GESCON</h6>
        </li>




        <!-- //ADMIN -->

        <li class="nav-item full-width-item" v-if="isAdministrador">
          <a @click="handleItemClick('admin')" data-bs-toggle="collapse" href="#perfil-admin"
            class="nav-link full-width-link" aria-controls="configuracion-admin" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i v-if="role === 'admin'" class="fas fa-user blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1 full-width-text">Admin</span>
          </a>

          <div class="collapse" id="perfil-admin">
            <ul class="nav flex-column submenu">
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/admin">
                  <span class="sidenav-mini-icon"> Dashboard </span>
                  <span class="sidenav-normal full-width-text"> Dashboard </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/admin/gestores/gestore">
                  <span class="sidenav-mini-icon"> Gestores </span>
                  <span class="sidenav-normal full-width-text"> Gestores </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/admin/encargados/encargado">
                  <span class="sidenav-mini-icon"> Encargados </span>
                  <span class="sidenav-normal full-width-text"> Encargados </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/admin/carteros/cartero">
                  <span class="sidenav-mini-icon"> Carteros </span>
                  <span class="sidenav-normal full-width-text"> Carteros </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/admin/usuarios/usuario">
                  <span class="sidenav-mini-icon"> Usuario </span>
                  <span class="sidenav-normal full-width-text"> Usuario </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/admin/empresas/empresa">
                  <span class="sidenav-mini-icon"> Empresas </span>
                  <span class="sidenav-normal full-width-text"> Empresas </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/admin/sucursales/sucursale">
                  <span class="sidenav-mini-icon"> Sucursales </span>
                  <span class="sidenav-normal full-width-text"> Sucursales </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/admin/tarifas/tarifa">
                  <span class="sidenav-mini-icon"> Tarifas </span>
                  <span class="sidenav-normal full-width-text"> Tarifas </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/admin/solicitudes/solicitude">
                  <span class="sidenav-mini-icon"> Solicitudes </span>
                  <span class="sidenav-normal full-width-text"> Solicitudes </span>
                </nuxtLink>
              </li>
              <!-- Añadir más elementos de navegación como este -->
            </ul>
          </div>
        </li>

        <!-- //CARTERO -->

        <li class="nav-item full-width-item" v-if="isCartero">
          <!-- Botón Volver a Menú Principal -->
          <a @click="handleItemClick('menu-principal')" href="/cartero" class="nav-link full-width-link">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i class="fas fa-arrow-left blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1 full-width-text">Volver a menú principal</span>
          </a>

          <!-- Sección Cartero -->
          <a @click="handleItemClick('cartero')" data-bs-toggle="collapse" href="#perfil-cartero"
            class="nav-link full-width-link" aria-controls="configuracion-cajero" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1 full-width-text">Cartero</span>
          </a>
          <div class="collapse" id="perfil-cartero">
            <ul class="nav flex-column submenu">
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/cartero/solicitudcartero/solicitudecartero">
                  <span class="sidenav-normal"> Recibir envios</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/cartero/recogidocarteros/recogidocartero">
                  <span class="sidenav-normal"> Enviar envios</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/cartero/encaminocarteros/encaminocartero">
                  <span class="sidenav-normal"> Entregar envios</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/cartero/entregadocarteros/entregadocartero">
                  <span class="sidenav-normal"> Entregados</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/cartero/eventocarteros/eventocartero">
                  <span class="sidenav-normal"> Eventos</span>
                </nuxtLink>
              </li>
            </ul>
          </div>

          <!-- Sección Regional -->
          <a @click="handleItemClick('cartero-regional')" data-bs-toggle="collapse" href="#perfil-cartero-regional"
            class="nav-link full-width-link" aria-controls="configuracion-cajero" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i class="fas fa-truck blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1 full-width-text">Regional</span>
          </a>
          <div class="collapse" id="perfil-cartero-regional">
            <ul class="nav flex-column submenu">
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link"
                  to="/cartero/recogidoregionalcarteros/recogidoregionalcartero">
                  <span class="sidenav-normal"> Enviar envios de regional</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link"
                  to="/cartero/encaminoregionalcarteros/encaminoregionalcartero">
                  <span class="sidenav-normal"> Entregar envios de regional</span>
                </nuxtLink>
              </li>
            </ul>
          </div>

          <!-- Sección Return -->
          <a @click="handleItemClick('return')" data-bs-toggle="collapse" href="#perfil-return"
            class="nav-link full-width-link" aria-controls="configuracion-cajero" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i class="fas fa-undo-alt blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1 full-width-text">Return</span>
          </a>
          <div class="collapse" id="perfil-return">
            <ul class="nav flex-column submenu">
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/cartero/devolucioncarteros/devolucioncartero">
                  <span class="sidenav-normal"> Devoluciónes pendientes</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/cartero/devueltoscarteros/devueltoscartero">
                  <span class="sidenav-normal"> Retornados</span>
                </nuxtLink>
              </li>
            </ul>
          </div>
        </li>





        <!-- EMPRESA -->
        <li class="nav-item full-width-item" v-if="isSucursale">
          <a @click="handleItemClick('empresa')" class="nav-link full-width-link">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i v-if="role === 'empresa'" class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1 full-width-text">Empresa</span>
          </a>
          <!-- Aquí quitamos el collapse para que siempre esté desplegado -->
          <div id="perfil-empresa">
            <ul class="nav flex-column submenu">
              <li class="nav-item" v-if="isSucursale">
                <nuxtLink class="nav-link full-width-link" to="/sucursal">
                  <span class="sidenav-normal full-width-text">Pagina principal</span>
                </nuxtLink>
              </li>
              <li class="nav-item" v-if="isSucursale">
                <nuxtLink class="nav-link full-width-link" to="/sucursal/canceladossucursales/canceladosucursal">
                  <span class="sidenav-normal full-width-text">Cancelados</span>
                </nuxtLink>
              </li>
              <li class="nav-item" v-if="isSucursale">
                <nuxtLink class="nav-link full-width-link" to="/sucursal/sucursales/sucursal">
                  <span class="sidenav-normal full-width-text">Pendientes de envio</span>
                </nuxtLink>
              </li>
              <li class="nav-item" v-if="isSucursale">
                <nuxtLink class="nav-link full-width-link" to="/sucursal/encaminosucursales/encaminosucursal">
                  <span class="sidenav-normal full-width-text">Enviados</span>
                </nuxtLink>
              </li>
              <li class="nav-item" v-if="isSucursale">
                <nuxtLink class="nav-link full-width-link" to="/sucursal/entregadosucursales/entregadosucursal">
                  <span class="sidenav-normal full-width-text">Paquetes entregados</span>
                </nuxtLink>
              </li>
              <li class="nav-item" v-if="isSucursale">
                <nuxtLink class="nav-link full-width-link" to="/sucursal/devueltosucursales/devueltosucursale">
                  <span class="sidenav-normal full-width-text">Devoluciones</span>
                </nuxtLink>
              </li>
            </ul>
          </div>
        </li>




        <!-- //ENCARGADO -->
        <li class="nav-item full-width-item" v-if="isEncargado">
          <!-- Botón Volver a Menú Principal -->
          <a @click="handleItemClick('menu-principal')" href="/encargado" class="nav-link full-width-link">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i class="fas fa-arrow-left blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1 full-width-text">Volver a menú principal</span>
          </a>

          <!-- Sección Encargado -->
          <a @click="handleItemClick('encargado')" data-bs-toggle="collapse" href="#perfil-encargado"
            class="nav-link full-width-link" aria-controls="configuracion-encargado" role="button"
            aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1 full-width-text">Encargado</span>
          </a>
          <div class="collapse" id="perfil-encargado">
            <ul class="nav flex-column submenu">
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/encargado/solicitudencargados/solicitudencargado">
                  <span class="sidenav-normal full-width-text"> Recibir envios</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/encargado/recogidoencargados/recogidoencargado">
                  <span class="sidenav-normal full-width-text"> Enviar envios</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/encargado/encaminoencargados/encaminoencargado">
                  <span class="sidenav-normal full-width-text"> Envios en camino</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/encargado/entregadoencargados/entregadoencargado">
                  <span class="sidenav-normal full-width-text"> Registrar entrega</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/encargado/verificadoencargados/verificadoencargado">
                  <span class="sidenav-normal full-width-text"> Paquetes entregados</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/encargado/eventoencargados/eventoencargado">
                  <span class="sidenav-normal"> Eventos</span>
                </nuxtLink>
              </li>
            </ul>
          </div>

          <!-- Sección Regional -->
          <a @click="handleItemClick('encargado-regional')" data-bs-toggle="collapse" href="#perfil-encargado-regional"
            class="nav-link full-width-link" aria-controls="configuracion-encargado" role="button"
            aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i class="fas fa-truck blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1 full-width-text">Encargado Regional</span>
          </a>
          <div class="collapse" id="perfil-encargado-regional">
            <ul class="nav flex-column submenu">
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/encargado/regionalencargados/regionalencargado">
                  <span class="sidenav-normal full-width-text"> Recibir envíos</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link"
                  to="/encargado/recibidoregionalencargados/recibidoregionalencargado">
                  <span class="sidenav-normal full-width-text"> Recibidos</span>
                </nuxtLink>
              </li>
            </ul>
          </div>

          <!-- Sección Return -->
          <a @click="handleItemClick('return')" data-bs-toggle="collapse" href="#perfil-return"
            class="nav-link full-width-link" aria-controls="configuracion-encargado" role="button"
            aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i class="fas fa-undo-alt blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1 full-width-text">Return</span>
          </a>
          <div class="collapse" id="perfil-return">
            <ul class="nav flex-column submenu">
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link"
                  to="/encargado/verificardevueltoencargados/verificardevueltoencargado">
                  <span class="sidenav-normal full-width-text"> Verificar envios return</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/encargado/rechazadoencargados/rechazadoencargado">
                  <span class="sidenav-normal full-width-text"> Devolución Encargado</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/encargado/devueltoencargados/devueltoencargado">
                  <span class="sidenav-normal full-width-text"> Retornados Encargado</span>
                </nuxtLink>
              </li>
            </ul>
          </div>
        </li>





        <!-- //COMERCIAL -->
        <li class="nav-item full-width-item" v-if="isGestor">
          <a @click="handleItemClick('comercial')" data-bs-toggle="collapse" href="#perfil-comercial"
            class="nav-link full-width-link" aria-controls="configuracion-comercial" role="button"
            aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i v-if="role === 'comercial'" class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1 full-width-text">Comercial</span>
          </a>
          <div class="collapse" id="perfil-comercial">
            <ul class="nav flex-column submenu">
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/gestore">
                  <span class="sidenav-normal full-width-text"> Dashboard </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/gestore/empresas/empresa">
                  <span class="sidenav-normal full-width-text"> Empresas </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/gestore/sucursales/sucursale">
                  <span class="sidenav-normal full-width-text"> Sucursales </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/gestore/tarifas/tarifa">
                  <span class="sidenav-normal full-width-text"> Tarifas </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/gestore/direcciones/direccione">
                  <span class="sidenav-normal full-width-text"> Direcciones </span>
                </nuxtLink>
              </li>
            </ul>
          </div>
        </li>



        <!-- //CONTRATOS -->
        <li class="nav-item full-width-item" v-if="isContrato">
          <a @click="handleItemClick('contratos')" data-bs-toggle="collapse" href="#perfil-contratos"
            class="nav-link full-width-link" aria-controls="configuracion-cajero" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i v-if="role === 'contratos'" class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1 full-width-text">Contratos</span>
          </a>
          <div class="collapse" id="perfil-contratos">
            <ul class="nav flex-column submenu">
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/contrato">
                  <span class="sidenav-normal full-width-text"> Dashboard </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/contrato/paquetessinentregar/paquetesinentregar">
                  <span class="sidenav-normal full-width-text"> Envios con multa </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/contrato/verificadoencargados/verificadoencargado">
                  <span class="sidenav-normal full-width-text"> Envios Verificados </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link"
                  to="/contrato/caminoregionalcontratos/caminoregionalcontrato">
                  <span class="sidenav-normal full-width-text"> Envios despachados </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/contrato/tarifas/tarifa">
                  <span class="sidenav-normal full-width-text"> Tarifas </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/contrato/eventocontratos/eventocontrato">
                  <span class="sidenav-normal"> Eventos</span>
                </nuxtLink>
              </li>
            </ul>
          </div>
        </li>




        <!-- //EMPRESAMATRIZ -->
        <li class="nav-item full-width-item" v-if="isEmpresa">
          <a @click="handleItemClick('contratos')" data-bs-toggle="collapse" href="#perfil-contratos"
            class="nav-link full-width-link" aria-controls="configuracion-cajero" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i v-if="role === 'contratos'" class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1 full-width-text">EMPRESAMATRIZ</span>
          </a>
          <div class="collapse" id="perfil-contratos">
            <ul class="nav flex-column submenu">
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/contrato">
                  <span class="sidenav-normal full-width-text"> Dashboard </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link full-width-link" to="/empresa/entregadoempresas/entregadoempresa">
                  <span class="sidenav-normal full-width-text"> Entregados </span>
                </nuxtLink>
              </li>
            </ul>
          </div>
        </li>


      </ul>
    </div>

  </aside>
</template>


<script>
export default {
  data() {
    return {
      role: '', // Initialize the role data property
      logoWidth: '40px',  // Default width
      logoHeight: '40px', // Default height
    };
  },
  computed: {
    userType() {
      return this.$store.getters['auth/currentUserType']; // Accede al tipo de usuario desde el store de Vuex
    },
    isCartero() {
      return this.userType === 'cartero'; // Verifica si el tipo de usuario es cartero
    },
    isSucursale() {
      return this.userType === 'sucursal'; // Verifica si el tipo de usuario es sucursale
    },
    isAdministrador() {
      return this.userType === 'administrador'; // Verifica si el tipo de usuario es sucursale
    },
    isGestor() {
      return this.userType === 'Gestore'; // Verifica si el tipo de usuario es sucursale
    },
    isEncargado() {
      return this.userType === 'encargado'; // Verifica si el tipo de usuario es sucursale
    },
    isContrato() {
      return this.userType === 'contratos'; // Verifica si el tipo de usuario es sucursale
    },
    isEmpresa() {
      return this.userType === 'empresas'; // Verifica si el tipo de usuario es sucursale
    },
  },
  methods: {
    handleItemClick(role) {
      this.role = role; // Update the role property when a menu item is clicked
      console.log(`Clicked on ${role}`);
    },
    setLogoSize(width, height) {
      this.logoWidth = width;
      this.logoHeight = height;
    },
  },
};
</script>



<style scoped>
/* Sidebar container */
#sidenav-main {
  width: 220px;
  background: linear-gradient(145deg, #ffffff, #ffffff);
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
}

/* Sidebar header (Logo and Title) */
.sidebar-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.full-width-header,
.full-width-link {
  width: 100%;
}

.full-width-text {
  width: 100%;
  white-space: normal;
  /* Allows text to wrap */
  word-wrap: break-word;
  /* Breaks long words if necessary */
}

/* Nav link design */
.nav-item {
  margin-bottom: 10px;
}

.nav-link.full-width-link {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  font-size: 14px;
  text-align: left;
  color: #174069;
  background-color: rgba(255, 255, 255, 0.8);
  width: 100%;
  /* Full width */
}

.nav-link.full-width-link:hover {
  background-color: #e0e4ff;
}

/* Icon design */
.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 8px;
  background-color: #f1f3ff;
  margin-right: 12px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.blue-icon {
  color: #3a86ff;
}

/* Remove space in dropdown items */
.nav.ms-4.ps-3 {
  padding-left: 0;
  margin-left: 0;
}

/* Responsive design for sidebar */
@media (max-width: 768px) {
  #sidenav-main {
    width: 180px;
  }

  .nav-link-text {
    font-size: 12px;
  }
}

.full-width-item,
.full-width-link {
  width: 100%;
}

.full-width-text {
  width: 100%;
  white-space: normal;
  word-wrap: break-word;
}

.nav-link.full-width-link {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  font-size: 14px;
  text-align: left;
  color: #174069;
  background-color: rgba(255, 255, 255, 0.8);
}

.nav-link.full-width-link:hover {
  background-color: #e0e4ff;
}
</style>