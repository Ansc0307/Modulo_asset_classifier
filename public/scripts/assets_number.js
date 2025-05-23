// Porcentajes para cada atributo
    const porcentajes = {
        confidencialidad: 40,
        integridad: 30,
        disponibilidad: 30
    };

    // Valores para cada nivel
    const valoresPorNivel = {
        confidencialidad: {3: 40, 2: 20, 1: 10},
        integridad: {3: 30, 2: 20, 1: 10},
        disponibilidad: {3: 30, 2: 20, 1: 10}
    };

    // Niveles de clasificación
    function clasificacionFinal(puntaje) {
        if (puntaje <= 40) return "USO PÚBLICO O GENERAL";
        if (puntaje > 40 && puntaje <= 60) return "USO INTERNO O PRIVADO";
        if (puntaje > 60 && puntaje <= 100) return "CRÍTICO O CONFIDENCIAL";
        return "Valores errados";
    }

    // Cargar inventario editado
    const activos = JSON.parse(localStorage.getItem('inventarioEditado') || "[]");
    const container = document.getElementById('activosContainer');

    // Descripción de cada atributo
    const descripciones = {
        confidencialidad: "Si esta información llegara a ser conocida por individuos no autorizados o incluso hecha pública. Afectación de procesos críticos, afectación legal, financiera, organizacional",
        integridad: "Si esta información llegara a ser indebida o inadecuadamente alterada, actualizada o modificada, ya sea intencionalmente o por accidente. Afectación de procesos críticos, afectación legal, financiera, organizacional.",
        disponibilidad: "Si esta información llegara a no estar disponible permanentemente o por un periodo considerable de tiempo. Afectación de procesos críticos, afectación legal, financiera, organizacional.",
        privacidad: "Si la información es demográfica o propia del cliente, si contiene cualquier dato que por sí mismo pueda ser usado (sin tener que consultar otro activo de información) para identificar a un cliente de manera individualizada; ya sea este cliente una persona, una empresa, etc. Ejemplos : Nombre o Razón Social, Número de Teléfono, Carnet de Identidad, etc.<br>La información es anónima si no identifica de manera específica a una persona natural / jurídica, es decir identifica atributos propios de las personas."
    };

    // Opciones de nivel
    function nivelSelect(name, valor = 1) {
        return `<select name="${name}" class="form-select form-select-sm w-auto d-inline-block">
            <option value="3" ${valor==3?'selected':''}>Alto (3)</option>
            <option value="2" ${valor==2?'selected':''}>Medio (2)</option>
            <option value="1" ${valor==1?'selected':''}>Bajo (1)</option>
        </select>`;
    }

    // Opciones de privacidad
   function privacidadSelect(valor = 1) {
        return `<select name="privacidad" class="form-select form-select-sm w-auto d-inline-block">
            <option value="3" ${valor==3?'selected':''}>Alto</option>
            <option value="2" ${valor==2?'selected':''}>Medio</option>
            <option value="1" ${valor==1?'selected':''}>Bajo</option>
        </select>`;
    }

    // Renderizar tabla para cada activo
    activos.forEach((activo, idx) => {
        let html = `
        <div class="card mb-4 shadow-sm">
        <div class="card-header bg-primary text-white fw-bold">
            ${activo.sistema} - ${activo.descripcion}
        </div>
        <div class="card-body bg-light">
            <form class="clasificacionForm">
            <div class="table-responsive">
                <table class="table table-bordered align-middle mb-3">
                <thead class="table-secondary">
                    <tr>
                    <th class="align-middle text-center" rowspan="2" style="width:120px;">PRIVACIDAD</th>
                    <td rowspan="2" class="privacidad align-middle" style="text-align:left; min-width:300px;">${descripciones.privacidad}</td>
                    <th class="text-center">ALTO</th>
                    <th class="text-center">MEDIO</th>
                    <th class="text-center">BAJO</th>
                    </tr>
                    <tr>
                    <td colspan="3" class="text-center">
                        <div class="d-flex justify-content-center">
                        ${privacidadSelect()}
                        </div>
                    </td>
                    </tr>
                </thead>
                </table>
                <table class="table table-bordered align-middle">
                <thead class="table-primary">
                    <tr>
                    <th class="text-center" style="width:200px;">NIVEL<br><small>(Alto=3, Medio=2, Bajo=1)</small></th>
                    <th class="text-center" style="width:160px;">VALOR</th>
                    <th class="text-center" style="width:160px;">PORCENTAJE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td class="fw-bold bg-warning-subtle">CONFIDENCIALIDAD</td>
                    <td>
                        <select name="confidencialidad" class="form-select form-select-sm w-auto d-inline-block">
                        <option value="3">Alto (3)</option>
                        <option value="2">Medio (2)</option>
                        <option value="1" selected>Bajo (1)</option>
                        </select>
                    </td>
                    <td class="porcentajeConf text-center">${valoresPorNivel.confidencialidad[1]}</td>
                    </tr>
                    <tr>
                    <td class="fw-bold bg-warning-subtle">INTEGRIDAD</td>
                    <td>
                        <select name="integridad" class="form-select form-select-sm w-auto d-inline-block">
                        <option value="3">Alto (3)</option>
                        <option value="2">Medio (2)</option>
                        <option value="1" selected>Bajo (1)</option>
                        </select>
                    </td>
                    <td class="porcentajeInt text-center">${valoresPorNivel.integridad[1]}</td>
                    </tr>
                    <tr>
                    <td class="fw-bold bg-warning-subtle">DISPONIBILIDAD</td>
                    <td>
                        <select name="disponibilidad" class="form-select form-select-sm w-auto d-inline-block">
                        <option value="3">Alto (3)</option>
                        <option value="2">Medio (2)</option>
                        <option value="1" selected>Bajo (1)</option>
                        </select>
                    </td>
                    <td class="porcentajeDisp text-center">${valoresPorNivel.disponibilidad[1]}</td>
                    </tr>
                    <tr class="table-info">
                    <td class="fw-bold">TOTAL</td>
                    <td class="totalValor text-center">3</td>
                    <td class="totalPorcentaje text-center">40</td>
                    </tr>
                    <tr>
                    <td colspan="3" class="clasificacionFinal text-center fw-bold"></td>
                    </tr>
                </tbody>
                </table>
            </div>
            </form>
        </div>
        </div>
        `;

        const div = document.createElement('div');
        div.innerHTML = html;
        container.appendChild(div);

        const form = div.querySelector('form');
        const privSelect = form.querySelector('select[name="privacidad"]');
        const confSelect = form.querySelector('select[name="confidencialidad"]');
        const intSelect = form.querySelector('select[name="integridad"]');
        const dispSelect = form.querySelector('select[name="disponibilidad"]');
        const totalValorTd = form.querySelector('.totalValor');
        const totalPorcTd = form.querySelector('.totalPorcentaje');
        const clasifSpan = form.querySelector('.clasificacionFinal span');
        const porcentajeConfTd = form.querySelector('.porcentajeConf');
        const porcentajeIntTd = form.querySelector('.porcentajeInt');
        const porcentajeDispTd = form.querySelector('.porcentajeDisp');

        function actualizar() {
            let conf = parseInt(confSelect.value);
            let integ = parseInt(intSelect.value);
            let disp = parseInt(dispSelect.value);
            let priv = parseInt(privSelect.value);

            // Porcentaje de confidencialidad (suma 10 si privacidad es ALTO, máx 40)
            let porcConf = valoresPorNivel.confidencialidad[conf];
            if (priv === 3) porcConf += 10;
            if (porcConf > 40) porcConf = 40;

            // Actualizar porcentajes individuales
            porcentajeConfTd.textContent = porcConf;
            porcentajeIntTd.textContent = valoresPorNivel.integridad[integ];
            porcentajeDispTd.textContent = valoresPorNivel.disponibilidad[disp];

            // Calcular totales
            let valorTotal = conf + integ + disp;
            let porcTotal = porcConf + valoresPorNivel.integridad[integ] + valoresPorNivel.disponibilidad[disp];

            totalValorTd.textContent = valorTotal;
            totalPorcTd.textContent = porcTotal;
            form.querySelector('.clasificacionFinal').innerHTML =
                `NIVEL DE CLASIFICACIÓN DE LA INFORMACIÓN: <span>${clasificacionFinal(porcTotal)}</span>`;
            form.querySelector('.clasificacionFinal').className =
                'clasificacionFinal text-center fw-bold ' +
                (porcTotal > 60 ? 'bg-danger-subtle' : porcTotal > 40 ? 'bg-warning-subtle' : 'bg-info-subtle');

            // Color según clasificación
            form.querySelector('.clasificacionFinal').style.background = 
                porcTotal > 60 ? '#ffcdd2' : porcTotal > 40 ? '#fff9c4' : '#e3f2fd';
        }

        [privSelect, confSelect, intSelect, dispSelect].forEach(sel => {
            sel.addEventListener('change', actualizar);
        });
        actualizar();
    });