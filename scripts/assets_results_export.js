// Función para exportar CSV
function exportarCSV(nombre, filas, encabezados) {
  let csv = encabezados.join(",") + "\n";
  filas.forEach(fila => {
    csv += fila.map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(",") + "\n";
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Botón Exportar → Mostrar modal
document.getElementById('btnExportar').onclick = function () {
  document.getElementById('modalExportar').style.display = 'flex';
};

// Exportar resumen
document.getElementById('btnExportarResumen').onclick = function () {
  const resultados = JSON.parse(localStorage.getItem('resultadosCID') || '[]');

  let encabezados = [
    "Activo", "Confidencialidad (valor)", "Confidencialidad (%)",
    "Privacidad (valor)", "Privacidad (%)",
    "Integridad (valor)", "Integridad (%)",
    "Disponibilidad (valor)", "Disponibilidad (%)",
    "% Total", "Nivel de Clasificación"
  ];

  let filas = resultados.map(activo => [
    activo.sistema,
    activo.confidencialidad.valor, activo.confidencialidad.porcentaje,
    activo.privacidad?.valor ?? 'N/A', activo.privacidad?.porcentaje ?? 'N/A',
    activo.integridad.valor, activo.integridad.porcentaje,
    activo.disponibilidad.valor, activo.disponibilidad.porcentaje,
    activo.clasificacionTotal + "%", activo.nivel
  ]);

  exportarCSV("resumen_clasificacion.csv", filas, encabezados);
  document.getElementById('modalExportar').style.display = 'none';
};

// Exportar completo
document.getElementById('btnExportarInventario').onclick = function () {
  const resultados = JSON.parse(localStorage.getItem('resultadosCID') || '[]');
  const inventario = JSON.parse(localStorage.getItem('inventarioEditado') || '[]');

  let encabezados = [
    "Sistema", "Descripción", "Clasificación", "Propietario", "Autorizador", "Estado", "Comentarios",
    "Confidencialidad (valor)", "Confidencialidad (%)", "Privacidad (valor)",
    "Integridad (valor)", "Integridad (%)",
    "Disponibilidad (valor)", "Disponibilidad (%)",
    "Total (%)", "Nivel de Clasificación"
  ];

  let filas = resultados.map((activo, idx) => {
    const info = inventario[idx] || {};

    return [
      info.sistema || '', info.descripcion || '', info.clasificacion || '', info.propietario || '', info.autorizador || '', info.estado || '', info.comentarios || '',
      activo.confidencialidad.valor || '', activo.confidencialidad.porcentaje || '',
      activo.privacidad?.valor ?? 'N/A',
      activo.integridad.valor || '', activo.integridad.porcentaje || '',
      activo.disponibilidad.valor || '', activo.disponibilidad.porcentaje || '',
      activo.clasificacionTotal + '%', activo.nivel
    ];
  });

  exportarCSV("inventario_completo.csv", filas, encabezados);
  document.getElementById('modalExportar').style.display = 'none';
};
