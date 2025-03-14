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
                        <button class="btn btn-info w-100" @click="$router.back()">Regresar</button>
                    </div>
                    <div class="col-6">
                        <button class="btn btn-dark w-100" @click="Save()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
    props: {
        model: {
            type: Object,
            default: () => ({}),
        },
        apiUrl: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            load: false,
        };
    },
    methods: {
        async Save() {
            // Variable para almacenar cuál campo está vacío
            let missingField = '';

            // Validamos cada campo y asignamos el mensaje correspondiente si falta uno
            // if (!this.model.nombre) {
            //     missingField = 'Nombre de la sucursal';
            // } else if (!this.model.sigla) {
            //     missingField = 'Sigla';
            // } else if (!this.model.empresa_id) {
            //     missingField = 'Empresa';
            // } else if (!this.model.origen) {
            //     missingField = 'Departamento de la sucursal';
            // } else if (!this.model.acuerdo_contrato) {
            //     missingField = 'Acuerdo contrato';
            // } else if (!this.model.tipo_contrato) {
            //     missingField = 'Tipo de contrato';
            // } else if (!this.model.ini_vigencia) {
            //     missingField = 'Inicio de contrato';
            // } else if (!this.model.fin_vigencia) {
            //     missingField = 'Fin de contrato';
            // }
            // else if (!this.model.cobertura) {
            //     missingField = 'Cobertura';
            // } else if (!this.model.acuerdos) {
            //     missingField = 'Acuerdo';
            // } else if (!this.model.email) {
            //     missingField = 'Email';
            // } else if (!this.model.password) {
            //     missingField = 'Password';
            // }

            // Si falta un campo, mostramos una alerta específica
            if (missingField) {
                Swal.fire({
                    icon: 'error',
                    title: 'Campo faltante',
                    text: `Por favor, complete el campo: ${missingField}.`,
                });
                return; // Detenemos la ejecución si falta algún campo
            }

            this.load = true;
            try {
                // Hacemos la petición POST para crear el nuevo registro en la API
                const res = await this.$gestores.$post(this.apiUrl, this.model);
                console.log(res);

                // Mostramos una alerta de éxito con SweetAlert2
                this.$swal
                    .fire({
                        title: "Guardado!",
                        icon: "success",
                        confirmButtonText: "Ok",
                    })
                    .then((result) => {
                        if (result.isConfirmed) {
                            // Redirigimos de vuelta si se confirma
                            this.$router.back();
                        }
                    });
            } catch (e) {
                // Si ocurre un error, mostramos una alerta de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al guardar. Intente nuevamente.',
                });
                console.log(e);
            } finally {
                this.load = false;
            }
        },
    },
};
</script>