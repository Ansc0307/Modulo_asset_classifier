// --- Exportar CSV ---
    function exportarCSV(nombre, filas, encabezados) {
        let csv = encabezados.join(",") + "\n";
        filas.forEach(fila => {
            csv += fila.map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(",") + "\n";
        });
        const blob = new Blob([csv], {type: "text/csv"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = nombre;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Mostrar modal
    document.getElementById('btnExportar').onclick = function() {
        document.getElementById('modalExportar').style.display = 'flex';
    };

    // Exportar inventario completo
    document.getElementById('btnExportarInventario').onclick = function() {
        // Recoge el inventario original y los valores de clasificación
        const activos = JSON.parse(localStorage.getItem('inventarioEditado') || "[]");
        const forms = document.querySelectorAll('.clasificacionForm');
        let filas = [];
        let encabezados = [
            "Sistema", "Descripción", "Clasificación", "Propietario", "Autorizador", "Estado", "Comentarios",
            "Confidencialidad (valor)", "Confidencialidad (%)","Privacidad (valor)",
            "Integridad (valor)", "Integridad (%)",
            "Disponibilidad (valor)", "Disponibilidad (%)", 
            "Total (%)", "Nivel de Clasificación"
        ];
        activos.forEach((item, idx) => {
            const form = forms[idx];
            const conf = form.querySelector('select[name="confidencialidad"]').value;
            const integ = form.querySelector('select[name="integridad"]').value;
            const disp = form.querySelector('select[name="disponibilidad"]').value;
            const priv = form.querySelector('select[name="privacidad"]').value;

            // Porcentaje de confidencialidad (suma 10 si privacidad es ALTO, máx 40)
            let porcConf = valoresPorNivel.confidencialidad[conf];
            if (parseInt(priv) === 3) porcConf += 10;
            if (porcConf > 40) porcConf = 40;

            let porcInt = valoresPorNivel.integridad[integ];
            let porcDisp = valoresPorNivel.disponibilidad[disp];
            let porcTotal = porcConf + porcInt + porcDisp;
            let clasif = clasificacionFinal(porcTotal);

            filas.push([
                item.sistema, item.descripcion, item.clasificacion, item.propietario, item.autorizador, item.estado, item.comentarios,
                conf, porcConf, priv, integ, porcInt, disp, porcDisp, porcTotal, clasif
            ]);
        });
        exportarCSV("inventario_completo.csv", filas, encabezados);
        document.getElementById('modalExportar').style.display = 'none';
    };

    // Exportar resumen
    document.getElementById('btnExportarResumen').onclick = function() {
        const activos = JSON.parse(localStorage.getItem('inventarioEditado') || "[]");
        const forms = document.querySelectorAll('.clasificacionForm');
        let encabezados = [
            "Activo de Información",
            "Confidencialidad (valor)", "Confidencialidad (%)","Privacidad (valor)",
            "Integridad (valor)", "Integridad (%)",
            "Disponibilidad (valor)", "Disponibilidad (%)",
            "% Total", "Nivel de Clasificación"
        ];
        let filas = [];
        activos.forEach((item, idx) => {
            const form = forms[idx];
            const conf = form.querySelector('select[name="confidencialidad"]').value;
            const integ = form.querySelector('select[name="integridad"]').value;
            const disp = form.querySelector('select[name="disponibilidad"]').value;
            const priv = form.querySelector('select[name="privacidad"]').value;

            // Porcentaje de confidencialidad (suma 10 si privacidad es ALTO, máx 40)
            let porcConf = valoresPorNivel.confidencialidad[conf];
            if (parseInt(priv) === 3) porcConf += 10;
            if (porcConf > 40) porcConf = 40;

            let porcInt = valoresPorNivel.integridad[integ];
            let porcDisp = valoresPorNivel.disponibilidad[disp];
            let porcTotal = porcConf + porcInt + porcDisp;
            let clasif = clasificacionFinal(porcTotal);

            filas.push([
                `${item.sistema} - ${item.descripcion}`,
                conf, porcConf,priv, integ, porcInt, disp, porcDisp, porcTotal, clasif
            ]);
        });
        exportarCSV("resumen_clasificacion.csv", filas, encabezados);
        document.getElementById('modalExportar').style.display = 'none';
    };