  // Campos por defecto para los activos del JSON
        const campos = [
            "sistema",
            "descripcion",
            "clasificacion",
            "propietario",
            "autorizador",
            "estado",
            "comentarios"
        ];

        // Mapeo de nombres amigables
        const nombres = {
            sistema: "Sistema",
            descripcion: "Descripción",
            clasificacion: "Clasificación",
            propietario: "Propietario",
            autorizador: "Autorizador",
            estado: "Estado",
            comentarios: "Comentarios internos"
        };

        // Cargar activos seleccionados
        const activos = JSON.parse(localStorage.getItem('activosSeleccionados') || "[]");
        const tbody = document.getElementById('inventoryTableBody');


        activos.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input name="sistema" value="${item.sistema || ''}" class="form-control form-control-sm"></td>
                <td><input name="descripcion" value="${item.descripcion || ''}" class="form-control form-control-sm"></td>
                <td><input name="clasificacion" value="${item.clasificacion || ''}" class="form-control form-control-sm"></td>
                <td><input name="propietario" value="${item.propietario || ''}" class="form-control form-control-sm"></td>
                <td><input name="autorizador" value="${item.autorizador || ''}" class="form-control form-control-sm"></td>
                <td><input name="estado" value="${item.estado || ''}" class="form-control form-control-sm"></td>
                <td><input name="comentarios" value="${item.comentarios || ''}" class="form-control form-control-sm"></td>
            `;
            tbody.appendChild(tr);
        });


        // Guardar cambios (puedes personalizar la acción)
      document.getElementById('inventoryForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Recolectar datos editados
        const filas = document.querySelectorAll('#inventoryTableBody tr');
        const inventarioEditado = [];
        filas.forEach(tr => {
            const inputs = tr.querySelectorAll('input');
            inventarioEditado.push({
                sistema: inputs[0].value,
                descripcion: inputs[1].value,
                clasificacion: inputs[2].value,
                propietario: inputs[3].value,
                autorizador: inputs[4].value,
                estado: inputs[5].value,
                comentarios: inputs[6].value
            });
        });

        // Guardar el inventario editado en localStorage
        localStorage.setItem('inventarioEditado', JSON.stringify(inventarioEditado));

        // Mostrar el modal Bootstrap correctamente
        var modal = new bootstrap.Modal(document.getElementById('modalClasificacion'));
        modal.show();
    });

        // Botón para clasificación directa
        document.getElementById('btnDirecto').onclick = function() {
            window.location.href = '../screens/assetsNumber/assets_numbers.html';
        };

        // Botón para clasificación con cuestionario
        document.getElementById('btnCuestionario').onclick = function() {
            window.location.href = '../assetsQuestions/assets_form.html';
        };