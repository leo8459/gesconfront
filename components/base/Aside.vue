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

        <li class="nav-item">
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


            </ul>
          </div>

        </li>

          <!-- //CARTERO -->

        <li class="nav-item">
          <a @click="handleItemClick('cartero')" data-bs-toggle="collapse" href="#perfil-cartero" class="nav-link"
            aria-controls="configuracion-cajero" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i v-if="role === 'cartero'" class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Solicitud Cartero</span>
          </a>
          <div class="collapse" id="perfil-cartero">
            <ul class="nav ms-4 ps-3">
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/cartero/solicitudcartero/solicitudecartero">
                  <span class="sidenav-mini-icon"> Solicitud Cartero </span>
                  <span class="sidenav-normal"> Solicitud Cartero</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/cartero/recogidocarteros/recogidocartero">
                  <span class="sidenav-mini-icon"> Recogido Cartero </span>
                  <span class="sidenav-normal"> Recogido Cartero</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/cartero/encaminocarteros/encaminocartero">
                  <span class="sidenav-mini-icon"> En camino Cartero </span>
                  <span class="sidenav-normal"> En camino Cartero</span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/cartero/entregadocarteros/entregadocartero">
                  <span class="sidenav-mini-icon"> Entregado Cartero </span>
                  <span class="sidenav-normal"> Entregado Cartero</span>
                </nuxtLink>
              </li>
             
            </ul>
          </div>
        </li>


        <!-- //EMPRESA -->

        <li class="nav-item">
          <a @click="handleItemClick('empresa')" data-bs-toggle="collapse" href="#perfil-empresa" class="nav-link"
            aria-controls="configuracion-cajero" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i v-if="role === 'empresa'" class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Solicitud Empresa</span>
          </a>
          <div class="collapse" id="perfil-empresa">
            <ul class="nav ms-4 ps-3">
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/sucursal/sucursales/sucursal">
                  <span class="sidenav-mini-icon"> Solicitud Empresa</span>
                  <span class="sidenav-normal">Solicitud Empresa </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/sucursal/encaminosucursales/encaminosucursal">
                  <span class="sidenav-mini-icon"> En Camino Empresa</span>
                  <span class="sidenav-normal"> En Camino Empresa </span>
                </nuxtLink>
              </li>
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/sucursal/entregadosucursales/entregadosucursal">
                  <span class="sidenav-mini-icon"> Entregados Empresa</span>
                  <span class="sidenav-normal">Entregados Empresa </span>
                </nuxtLink>
              </li>
            </ul>
          </div>
        </li>
        <!-- //ENCARGADO -->

        <li class="nav-item">
          <a @click="handleItemClick('encargado')" data-bs-toggle="collapse" href="#perfil-encargado" class="nav-link"
            aria-controls="configuracion-cajero" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i v-if="role === 'encargado'" class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Solicitud Encargado</span>
          </a>
          <div class="collapse" id="perfil-encargado">
            <ul class="nav ms-4 ps-3">
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/clientes/cliente">
                  <span class="sidenav-mini-icon"> clientes </span>
                  <span class="sidenav-normal"> clientes </span>
                </nuxtLink>
              </li>
            </ul>
          </div>
        </li>


        <!-- //COMERCIAL -->

        <li class="nav-item">
          <a @click="handleItemClick('comercial')" data-bs-toggle="collapse" href="#perfil-comercial" class="nav-link"
            aria-controls="configuracion-comercial" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i v-if="role === 'comercial'" class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Solicitud Comercial</span>
          </a>
          <div class="collapse" id="perfil-comercial">
            <ul class="nav ms-4 ps-3">
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/clientes/cliente">
                  <span class="sidenav-mini-icon"> clientes </span>
                  <span class="sidenav-normal"> clientes </span>
                </nuxtLink>
              </li>
            </ul>
          </div>
        </li>


        <!-- //CONTRATOS -->

        <li class="nav-item">
          <a @click="handleItemClick('contratos')" data-bs-toggle="collapse" href="#perfil-contratos" class="nav-link"
            aria-controls="configuracion-cajero" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i v-if="role === 'contratos'" class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Solicitud Contratos</span>
          </a>
          <div class="collapse" id="perfil-contratos">
            <ul class="nav ms-4 ps-3">
              <li class="nav-item">
                <nuxtLink class="nav-link" to="/admin/clientes/cliente">
                  <span class="sidenav-mini-icon"> clientes </span>
                  <span class="sidenav-normal"> clientes </span>
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
</style>

<script>
export default {
  data() {
    return {
      role: '', // Initialize the role data property
    };
  },
  methods: {
    handleItemClick(role) {
      this.role = role; // Update the role property when a menu item is clicked
      console.log(`Clicked on ${role}`);
    },
  },
};
</script>