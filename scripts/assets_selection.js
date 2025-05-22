let activosJSON = [];

        // Cargar activos desde el JSON
        fetch('../assets/assets.json')
            .then(response => response.json())
            .then(data => {
                activosJSON = data;
                const tbody = document.getElementById('assetsTableBody');
                data.forEach((item, idx) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td class="text-center"><input type="checkbox" name="activo[]" class="form-check-input" value="${item.sistema}|||${item.descripcion}"></td>
                        <td>${item.sistema}</td>
                        <td>${item.descripcion}</td>
                    `;
                    tbody.appendChild(tr);
                });
            });

        // Agregar nuevo activo manualmente
        document.getElementById('addAssetForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const sistema = document.getElementById('nuevoSistema').value;
            const descripcion = document.getElementById('nuevaDescripcion').value;
            const tbody = document.getElementById('assetsTableBody');
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="text-center"><input type="checkbox" name="activo[]" class="form-check-input" value="${sistema}|||${descripcion}|||manual"></td>
                <td>${sistema}</td>
                <td>${descripcion}</td>
            `;
            tbody.appendChild(tr);
            this.reset();
        });

        // Guardar selección en LocalStorage
        document.getElementById('assetsForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const seleccionados = [];
            document.querySelectorAll('input[type="checkbox"][name="activo[]"]:checked').forEach(cb => {
                const partes = cb.value.split('|||');
                // Si es manual, solo tiene sistema y descripcion
                if (partes[2] === 'manual') {
                    seleccionados.push({
                        sistema: partes[0],
                        descripcion: partes[1],
                        manual: true
                    });
                } else {
                    // Buscar el objeto completo en el JSON
                    const encontrado = activosJSON.find(a => a.sistema === partes[0] && a.descripcion === partes[1]);
                    if (encontrado) {
                        seleccionados.push({...encontrado, manual: false});
                    }
                }
            });
            // Guardar en localStorage
            localStorage.setItem('activosSeleccionados', JSON.stringify(seleccionados));
            // Redirigir a inventory
            window.location.href = 'assets_inventory.html';
        });