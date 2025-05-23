const activos = JSON.parse(localStorage.getItem('inventarioEditado') || '[]');
const form = document.getElementById('cidForm');

function crearRadios(name, options, required = false) {
  return options.map(([value, label, extra = '']) => `
    <div class="form-check">
      <input class="form-check-input" type="radio" name="${name}" value="${value}" ${required ? 'required' : ''} ${extra}>
      <label class="form-check-label">${label}</label>
    </div>
  `).join('');
}

function togglePrivacidad(idx, mostrar) {
  const divPrivacidad = document.getElementById(`privacidad${idx}`);
  divPrivacidad.style.display = mostrar ? 'block' : 'none';

  if (!mostrar) {
    const radios = divPrivacidad.querySelectorAll(`input[type=radio]`);
    radios.forEach(radio => radio.checked = false);
  }
}

// Generar el formulario dinámicamente
function generarFormulario() {
  activos.forEach((activo, idx) => {
    form.innerHTML += `
      <fieldset class="border rounded-3 p-4 mb-5 bg-white shadow-sm">
        <legend class="w-auto px-2 fs-5 fw-semibold text-primary">${activo.sistema}</legend>

        <div class="mb-4">
          <p class="fw-semibold text-dark">Confidencialidad</p>
          <p class="text-muted">Si esta información llegara a ser conocida por individuos no autorizados o incluso hecha pública. Afectación de procesos críticos, afectación legal, financiera, organizacional.</p>
          ${crearRadios(`c${idx}`, [
            ['3', 'Completamente (Valor: 3)'],
            ['2', 'Más o menos (Valor: 2)'],
            ['1', 'Casi nada (Valor: 1)']
          ], true)}
        </div>

        <div class="mb-4">
          <p class="fw-semibold text-dark">Integridad</p>
          <p class="text-muted">Si esta información llegara a ser indebida o inadecuadamente alterada, actualizada o modificada, ya sea intencionalmente o por accidente. Afectación de procesos críticos, afectación legal, financiera, organizacional.</p>
          ${crearRadios(`i${idx}`, [
            ['3', 'Completamente (Valor: 3)'],
            ['2', 'Más o menos (Valor: 2)'],
            ['1', 'Casi nada (Valor: 1)']
          ], true)}
        </div>

        <div class="mb-4">
          <p class="fw-semibold text-dark">Disponibilidad</p>
          <p class="text-muted">Si esta información llegara a no estar disponible permanentemente o por un periodo considerable de tiempo. Afectación de procesos críticos, afectación legal, financiera, organizacional.</p>
          ${crearRadios(`d${idx}`, [
            ['3', 'Completamente (Valor: 3)'],
            ['2', 'Más o menos (Valor: 2)'],
            ['1', 'Casi nada (Valor: 1)']
          ], true)}
        </div>

        <div class="mb-4">
          <p class="fw-semibold text-dark">¿Este activo procesa datos personales o sensibles?</p>
          ${crearRadios(`usaPrivacidad${idx}`, [
            ['si', 'Sí', `onchange="togglePrivacidad(${idx}, true)"`],
            ['no', 'No', `onchange="togglePrivacidad(${idx}, false)"`]
          ], true)}
        </div>

        <div id="privacidad${idx}" class="mb-4 ps-4 pt-3 pb-2 border-start border-3 border-primary-subtle bg-light rounded" style="display: none;">
          <p class="fw-semibold text-dark">Privacidad</p>
          <p class="text-muted">¿La información contiene datos demográficos o propios del cliente que, por sí solos, permiten identificar individualmente a una persona o entidad (por ejemplo, nombre, razón social, número de teléfono, cédula de identidad)?</p>
          ${crearRadios(`p${idx}`, [
            ['3', 'Completamente (Valor: 3)'],
            ['2', 'Más o menos (Valor: 2)'],
            ['1', 'Casi nada (Valor: 1)']
          ], true)}
        </div>
      </fieldset>
    `;
  });
}

generarFormulario();

document.getElementById('submitBtn').onclick = async () => {
  const formData = new FormData(form);

  for (let idx = 0; idx < activos.length; idx++) {
    if (!formData.get(`c${idx}`)) {
      await Swal.fire({
        icon: 'warning',
        title: 'Falta respuesta',
        text: `Por favor responde Confidencialidad para el activo "${activos[idx].sistema}".`
      });
      return;
    }
    if (!formData.get(`i${idx}`)) {
      await Swal.fire({
        icon: 'warning',
        title: 'Falta respuesta',
        text: `Por favor responde Integridad para el activo "${activos[idx].sistema}".`
      });
      return;
    }
    if (!formData.get(`d${idx}`)) {
      await Swal.fire({
        icon: 'warning',
        title: 'Falta respuesta',
        text: `Por favor responde Disponibilidad para el activo "${activos[idx].sistema}".`
      });
      return;
    }
    const usaPrivacidad = formData.get(`usaPrivacidad${idx}`);
    if (!usaPrivacidad) {
      await Swal.fire({
        icon: 'warning',
        title: 'Falta respuesta',
        text: `Por favor indica si el activo "${activos[idx].sistema}" procesa datos personales o sensibles.`
      });
      return;
    }
    if (usaPrivacidad === 'si' && !formData.get(`p${idx}`)) {
      await Swal.fire({
        icon: 'warning',
        title: 'Falta respuesta',
        text: `Por favor responde Privacidad para el activo "${activos[idx].sistema}".`
      });
      return;
    }
  }

  // Procesar resultados como antes
  const resultadosCIDP = activos.map((activo, idx) => {
    const c = parseInt(formData.get(`c${idx}`));
    const i = parseInt(formData.get(`i${idx}`));
    const d = parseInt(formData.get(`d${idx}`));
    const usaPrivacidad = formData.get(`usaPrivacidad${idx}`) === 'si';
    const p = usaPrivacidad ? parseInt(formData.get(`p${idx}`)) || 1 : 0;

    let porcentajeC = c === 3 ? 30 : c === 2 ? 20 : 10;
    const porcentajeI = i === 3 ? 30 : i === 2 ? 20 : 10;
    const porcentajeD = d === 3 ? 30 : d === 2 ? 20 : 10;
    const porcentajeP = p === 3 ? 10 : p === 2 ? 5 : p === 1 ? 1 : 0;

    if (usaPrivacidad) porcentajeC += porcentajeP;

    const total = porcentajeC + porcentajeI + porcentajeD;
    const nivel = total <= 40 ? 'USO PÚBLICO O GENERAL' :
                  total <= 60 ? 'USO INTERNO O PRIVADO' :
                  'CRÍTICO O CONFIDENCIAL';

    return {
      ...activo,
      confidencialidad: { valor: c, porcentaje: `${porcentajeC}%`, incluyePrivacidad: usaPrivacidad },
      integridad: { valor: i, porcentaje: `${porcentajeI}%` },
      disponibilidad: { valor: d, porcentaje: `${porcentajeD}%` },
      privacidad: usaPrivacidad ? { valor: p, porcentaje: `${porcentajeP}%` } : null,
      clasificacionTotal: total,
      nivel
    };
  });

  localStorage.setItem('resultadosCID', JSON.stringify(resultadosCIDP));
  window.location.href = 'assets_numbers_results.html';
};
