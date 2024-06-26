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


        <li class="nav-item">
          <a @click="handleItemClick('cajero')" data-bs-toggle="collapse" href="#perfil-cajero" class="nav-link"
            aria-controls="configuracion-cajero" role="button" aria-expanded="false">
            <div
              class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center d-flex align-items-center justify-content-center me-2">
              <i v-if="role === 'cajero'" class="fas fa-money-bill blue-icon"></i>
            </div>
            <span class="nav-link-text ms-1">Alquiler</span>
          </a>
          <div class="collapse" id="perfil-cajero">
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