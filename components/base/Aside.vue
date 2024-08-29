<template>
  <aside class="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3"
    id="sidenav-main">
    <div class="collapse navbar-collapse w-auto h-auto" id="sidenav-collapse-main">
      <ul class="navbar-nav">
        <li class="nav-item mt-3">
          <h6 class="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">
            AGBC
          </h6>
        </li>

        <li class="nav-item" v-if="isAdministrador">
          <a @click="handleItemClick('admin')" data-bs-toggle="collapse" href="#perfil-admin" class="nav-link"
            aria-controls="configuracion-admin" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i v-if="role === 'admin'" class="fas fa-user blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Admin</span>
          </a>

          <!-- //ADMIN -->


          <div class="collapse" id="perfil-admin">
            <ul class="nav ms-4 ps-3">
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin">
                  <span class="sidenav-mini-icon"> Dashboard </span>
                  <span class="sidenav-normal"> Dashboard </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/gestores/gestore">
                  <span class="sidenav-mini-icon"> Gestores </span>
                  <span class="sidenav-normal"> Gestores </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/usuarios/usuario">
                  <span class="sidenav-mini-icon"> Usuario </span>
                  <span class="sidenav-normal"> Usuario </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/empresas/empresa">
                  <span class="sidenav-mini-icon"> empresas </span>
                  <span class="sidenav-normal"> empresas </span>
                </nuxtLink>
              </li>

              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/sucursales/sucursale">
                  <span class="sidenav-mini-icon"> sucursales </span>
                  <span class="sidenav-normal"> sucursales </span>
                </nuxtLink>
              </li>

              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/tarifas/tarifa">
                  <span class="sidenav-mini-icon"> tarifas </span>
                  <span class="sidenav-normal"> tarifas </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/solicitudes/solicitude">
                  <span class="sidenav-mini-icon"> solicitudes </span>
                  <span class="sidenav-normal"> solicitudes </span>
                </nuxtLink>
              </li>

              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/solicitudesemp/solicitudeemp">
                  <span class="sidenav-mini-icon"> Solicitud Empresa</span>
                  <span class="sidenav-normal">Solicitud Empresa </span>
                </nuxtLink>
              </li>

              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/solicitudesj/solicitudej">
                  <span class="sidenav-mini-icon"> Solicitud Encargado </span>
                  <span class="sidenav-normal"> Solicitud Encargado</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/solicitudescartero/solicitudecartero">
                  <span class="sidenav-mini-icon"> Solicitud Cartero </span>
                  <span class="sidenav-normal"> Solicitud Cartero</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/solicitudescarterohoy">
                  <span class="sidenav-mini-icon"> Solicitud Cartero Hoy </span>
                  <span class="sidenav-normal"> Solicitud Cartero Hoy</span>
                </nuxtLink>
              </li>

              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/encargados/encargado">
                  <span class="sidenav-mini-icon"> encargados </span>
                  <span class="sidenav-normal"> encargados </span>
                </nuxtLink>
              </li>

              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/carteros/cartero">
                  <span class="sidenav-mini-icon"> carteros </span>
                  <span class="sidenav-normal"> carteros </span>
                </nuxtLink>
              </li>

              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/contratos/contrato">
                  <span class="sidenav-mini-icon"> contratos </span>
                  <span class="sidenav-normal"> contratos </span>
                </nuxtLink>
              </li>
            </ul>
          </div>

        </li>

        <!-- //CARTERO -->


        <li class="nav-item" v-if="isCartero">
          <!-- Botón Volver a Menú Principal -->
          <a @click="handleItemClick('menu-principal')" href="/cartero" class="nav-link">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i class="fas fa-arrow-left blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Volver a menú principal</span>
          </a>

          <!-- Sección Cartero -->
          <a @click="handleItemClick('cartero')" data-bs-toggle="collapse" href="#perfil-cartero" class="nav-link"
            aria-controls="configuracion-cajero" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Cartero</span>
          </a>
          <div class="collapse" id="perfil-cartero">
            <ul class="nav ms-4 ps-3">
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/cartero/solicitudcartero/solicitudecartero">
                  <span class="sidenav-mini-icon"> Solicitud Cartero </span>
                  <span class="sidenav-normal"> Solicitud Cartero</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/cartero/recogidocarteros/recogidocartero">
                  <span class="sidenav-mini-icon"> Recogido Cartero </span>
                  <span class="sidenav-normal"> Recogido Cartero</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/cartero/encaminocarteros/encaminocartero">
                  <span class="sidenav-mini-icon"> En camino Cartero </span>
                  <span class="sidenav-normal"> En camino Cartero</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/cartero/entregadocarteros/entregadocartero">
                  <span class="sidenav-mini-icon"> Entregado Cartero </span>
                  <span class="sidenav-normal"> Entregado Cartero</span>
                </nuxtLink>
              </li>
            </ul>
          </div>

          <!-- Sección Regional -->
          <a @click="handleItemClick('cartero-regional')" data-bs-toggle="collapse" href="#perfil-cartero-regional"
            class="nav-link" aria-controls="configuracion-cajero" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i class="fas fa-truck blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Cartero Regional</span>
          </a>
          <div class="collapse" id="perfil-cartero-regional">
            <ul class="nav ms-4 ps-3">
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/cartero/recogidoregionalcarteros/recogidoregionalcartero">
                  <span class="sidenav-mini-icon"> En camino a Regional</span>
                  <span class="sidenav-normal"> En camino a Regional</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/cartero/encaminoregionalcarteros/encaminoregionalcartero">
                  <span class="sidenav-mini-icon"> Correspondencia en camino</span>
                  <span class="sidenav-normal"> Correspondencia en camino</span>
                </nuxtLink>
              </li>
            </ul>
          </div>

          <!-- Sección Return -->
          <a @click="handleItemClick('return')" data-bs-toggle="collapse" href="#perfil-return" class="nav-link"
            aria-controls="configuracion-cajero" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i class="fas fa-undo-alt blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Return</span>
          </a>
          <div class="collapse" id="perfil-return">
            <ul class="nav ms-4 ps-3">
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/cartero/devolucioncarteros/devolucioncartero">
                  <span class="sidenav-mini-icon"> Devolución Cartero </span>
                  <span class="sidenav-normal"> Devolución Cartero</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/cartero/devueltoscarteros/devueltoscartero">
                  <span class="sidenav-mini-icon"> Retornados Cartero </span>
                  <span class="sidenav-normal"> Retornados Cartero</span>
                </nuxtLink>
              </li>
            </ul>
          </div>
        </li>






        <!-- //EMPRESA -->


        <li class="nav-item" v-if="isSucursale">
          <a @click="handleItemClick('empresa')" data-bs-toggle="collapse" href="#perfil-empresa" class="nav-link"
            aria-controls="configuracion-cajero" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i v-if="role === 'empresa'" class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Empresa</span>
          </a>
          <div class="collapse" id="perfil-empresa">
            <ul class="nav ms-4 ps-3">
              <li class="nav-item" v-if="isSucursale">
                <nuxtLink class="nav-link" to="/sucursal">
                  <span class="sidenav-mini-icon"> Dashboard </span>
                  <span class="sidenav-normal"> Dashboard </span>
                </nuxtLink>
              </li>
              <li class="nav-item" v-if="isSucursale">
                <nuxtLink class="nav-link" to="/sucursal/canceladossucursales/canceladosucursal">
                  <span class="sidenav-mini-icon"> Cancelados Empresa</span>
                  <span class="sidenav-normal">Cancelados Empresa </span>
                </nuxtLink>
              </li>
              <li class="nav-item" v-if="isSucursale">
                <nuxtLink class="nav-link" to="/sucursal/sucursales/sucursal">
                  <span class="sidenav-mini-icon"> Solicitud Empresa</span>
                  <span class="sidenav-normal">Solicitud Empresa </span>
                </nuxtLink>
              </li>

              <li class="nav-item" v-if="isSucursale">
                <nuxtLink class="nav-link" to="/sucursal/encaminosucursales/encaminosucursal">
                  <span class="sidenav-mini-icon"> En Camino Empresa</span>
                  <span class="sidenav-normal"> En Camino Empresa </span>
                </nuxtLink>
              </li>
              <li class="nav-item" v-if="isSucursale">
                <nuxtLink class="nav-link" to="/sucursal/entregadosucursales/entregadosucursal">
                  <span class="sidenav-mini-icon"> Entregados Empresa</span>
                  <span class="sidenav-normal">Entregados Empresa </span>
                </nuxtLink>
              </li>

              <li class="nav-item" v-if="isSucursale">
                <nuxtLink class="nav-link" to="/sucursal/devueltosucursales/devueltosucursale">
                  <span class="sidenav-mini-icon"> Devueltos Empresa</span>
                  <span class="sidenav-normal">Devueltos Empresa </span>
                </nuxtLink>
              </li>
            </ul>
          </div>
        </li>



        <!-- //ENCARGADO -->


        <li class="nav-item" v-if="isEncargado">
          <!-- Botón Volver a Menú Principal -->
          <a @click="handleItemClick('menu-principal')" href="/encargado" class="nav-link">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i class="fas fa-arrow-left blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Volver a menú principal</span>
          </a>

          <!-- Sección Encargado -->
          <a @click="handleItemClick('encargado')" data-bs-toggle="collapse" href="#perfil-encargado" class="nav-link"
            aria-controls="configuracion-encargado" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Encargado</span>
          </a>
          <div class="collapse" id="perfil-encargado">
            <ul class="nav ms-4 ps-3">
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/encargado/solicitudencargados/solicitudencargado">
                  <span class="sidenav-mini-icon"> Solicitud de recojo </span>
                  <span class="sidenav-normal"> Solicitud de recojo </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/encargado/recogidoencargados/recogidoencargado">
                  <span class="sidenav-mini-icon"> Paquetes recogidos </span>
                  <span class="sidenav-normal"> Paquetes recogidos</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/encargado/encaminoencargados/encaminoencargado">
                  <span class="sidenav-mini-icon"> Paquetes en camino </span>
                  <span class="sidenav-normal"> Paquetes en camino</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/encargado/entregadoencargados/entregadoencargado">
                  <span class="sidenav-mini-icon"> Paquetes Entregada</span>
                  <span class="sidenav-normal"> Paquetes Entregada</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/encargado/verificadoencargados/verificadoencargado">
                  <span class="sidenav-mini-icon"> Paquetes Verificada </span>
                  <span class="sidenav-normal"> Paquetes Verificada</span>
                </nuxtLink>
              </li>
            </ul>
          </div>

          <!-- Sección Regional -->
          <a @click="handleItemClick('encargado-regional')" data-bs-toggle="collapse" href="#perfil-encargado-regional"
            class="nav-link" aria-controls="configuracion-encargado" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i class="fas fa-truck blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Encargado Regional</span>
          </a>
          <div class="collapse" id="perfil-encargado-regional">
            <ul class="nav ms-4 ps-3">
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/encargado/regionalencargados/regionalencargado">
                  <span class="sidenav-mini-icon"> En camino a regional </span>
                  <span class="sidenav-normal"> En camino a regional</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/encargado/recibidoregionalencargados/recibidoregionalencargado">
                  <span class="sidenav-mini-icon"> Recibidos </span>
                  <span class="sidenav-normal"> Recibidos</span>
                </nuxtLink>
              </li>
            </ul>
          </div>

          <!-- Sección Return -->
          <a @click="handleItemClick('return')" data-bs-toggle="collapse" href="#perfil-return" class="nav-link"
            aria-controls="configuracion-encargado" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i class="fas fa-undo-alt blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Return</span>
          </a>
          <div class="collapse" id="perfil-return">
            <ul class="nav ms-4 ps-3">
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/encargado/verificardevueltoencargados/verificardevueltoencargado">
                  <span class="sidenav-mini-icon"> Verificar Return </span>
                  <span class="sidenav-normal"> Verificar Return</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/encargado/rechazadoencargados/rechazadoencargado">
                  <span class="sidenav-mini-icon"> Devolución Encargado </span>
                  <span class="sidenav-normal"> Devolución Encargado</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/encargado/devueltoencargados/devueltoencargado">
                  <span class="sidenav-mini-icon"> Retornados Encargado </span>
                  <span class="sidenav-normal"> Retornados Encargado</span>
                </nuxtLink>
              </li>
            </ul>
          </div>
        </li>




        <!-- //COMERCIAL -->


        <li class="nav-item" v-if="isGestor">
          <a @click="handleItemClick('comercial')" data-bs-toggle="collapse" href="#perfil-comercial" class="nav-link"
            aria-controls="configuracion-comercial" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i v-if="role === 'comercial'" class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Comercial</span>
          </a>
          <div class="collapse" id="perfil-comercial">
            <ul class="nav ms-4 ps-3">
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/gestore">
                  <span class="sidenav-mini-icon"> Dashboard </span>
                  <span class="sidenav-normal"> Dashboard </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/gestore/empresas/empresa">
                  <span class="sidenav-mini-icon"> Empresas </span>
                  <span class="sidenav-normal"> Empresas </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/gestore/sucursales/sucursale">
                  <span class="sidenav-mini-icon"> Sucursales </span>
                  <span class="sidenav-normal"> Sucursales </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/gestore/tarifas/tarifa">
                  <span class="sidenav-mini-icon"> Tarifas </span>
                  <span class="sidenav-normal"> Tarifas </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/gestore/direcciones/direccione">
                  <span class="sidenav-mini-icon"> Direcciones </span>
                  <span class="sidenav-normal"> Direcciones </span>
                </nuxtLink>
              </li>
            </ul>
          </div>
        </li>


        <!-- //CONTRATOS -->


        <li class="nav-item" v-if="isContrato">
          <a @click="handleItemClick('contratos')" data-bs-toggle="collapse" href="#perfil-contratos" class="nav-link"
            aria-controls="configuracion-cajero" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i v-if="role === 'contratos'" class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Contratos</span>
          </a>
          <div class="collapse" id="perfil-contratos">
            <ul class="nav ms-4 ps-3">
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/contrato">
                  <span class="sidenav-mini-icon"> Dashboard </span>
                  <span class="sidenav-normal"> Dashboard </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/contrato/paquetessinentregar/paquetesinentregar">
                  <span class="sidenav-mini-icon"> Paquetes con multa </span>
                  <span class="sidenav-normal"> Paquetes con multa </span>
                </nuxtLink>
                <nuxtLink class="nav-link" to="/contrato/verificadoencargados/verificadoencargado">
                  <span class="sidenav-mini-icon"> Correspondencia Verificada </span>
                  <span class="sidenav-normal"> Correspondencia Verificada</span>
                </nuxtLink>              
              </li>
            </ul>
          </div>
        </li>





      </ul>
    </div>

  </aside>
</template>
<style scoped>
.blue-icon {
  color: blue;
  /* Set the desired color */
}

.nav-item {
  margin-bottom: 10px;
  /* Espacio entre elementos de la lista */
  padding-left: 0;
  /* Elimina el padding izquierdo */
}

.nav-link {
  padding: 10px 15px 10px 0px;
  /* Elimina el padding izquierdo */
  display: flex;
  align-items: center;
  text-align: left;
  font-size: 14px;
  /* Tamaño de fuente consistente */
}

.nav-link .icon {
  margin-right: 8px;
  /* Espacio entre el ícono y el texto */
}

.nav-link-text {
  flex: 1;
  /* Asegura que el texto ocupe el espacio restante */
  padding-left: 5px;
  /* Ajuste adicional para que el texto quede alineado */
}

.sidenav-mini-icon {
  display: none;
  /* Oculta los mini íconos si no los necesitas */
}

.sidenav-normal {
  font-weight: 500;
}

.collapse ul.nav {
  padding-left: 20px;
  /* Ajuste del padding para las sub-listas */
}

.collapse ul.nav .nav-item {
  padding-left: 15px;
  /* Asegura que las sub-listas estén alineadas */
}
</style>

<script>
export default {
  data() {
    return {
      role: '', // Initialize the role data property
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
  },
  methods: {
    handleItemClick(role) {
      this.role = role; // Update the role property when a menu item is clicked
      console.log(`Clicked on ${role}`);
    },
  },
};
</script>