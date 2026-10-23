// Recoge las respuestas de la página de etiquetado en esta hoja de cálculo.
// Instalación: en la hoja, Extensiones > Apps Script, pega este código, guarda y
// Implementar > Nueva implementación > Aplicación web (Ejecutar como: yo; Quién tiene acceso: cualquier usuario).
// La URL que termina en /exec es la que va en config.js.
// Cambia CLAVE_LECTURA por una palabra cualquiera: sin ella nadie puede leer las respuestas (los nombres incluidos).
const CLAVE_LECTURA = 'cambia-esta-palabra';

const SHEET = 'etiquetas';
const HEADER = ['recibido', 'id_respuesta', 'accion', 'pista', 'eleccion', 'modelo', 'persona', 'navegador', 'hora'];
const KEY = /^(none|skip|[A-G][#b]? (major|minor))$/;

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) { sh = ss.insertSheet(SHEET); sh.appendRow(HEADER); }
  return sh;
}

function clean_(v, n) { return String(v == null ? '' : v).slice(0, n); }

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const events = (data.events || []).slice(0, 200);
  const rows = [];
  events.forEach(function (v) {
    const action = v.action === 'undo' ? 'undo' : 'label';
    if (action === 'label' && !KEY.test(String(v.choice))) return;   // descarta lo que no es una respuesta válida
    rows.push([new Date(), clean_(v.uid, 40), action, Number(v.id) || 0, clean_(v.choice, 12),
               clean_(v.model, 12), clean_(v.who, 40), clean_(v.client, 30), clean_(v.time, 30)]);
  });
  if (rows.length) {
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const sh = sheet_();
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, HEADER.length).setValues(rows);
    } finally { lock.releaseLock(); }
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true, n: rows.length }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Lectura de todas las respuestas (la usa tools/sync_etiquetas.py del repositorio de Skale).
function doGet(e) {
  if (!e || !e.parameter || e.parameter.clave !== CLAVE_LECTURA || CLAVE_LECTURA === 'cambia-esta-palabra')
    return ContentService.createTextOutput(JSON.stringify({ error: 'clave incorrecta' })).setMimeType(ContentService.MimeType.JSON);
  return ContentService.createTextOutput(JSON.stringify(sheet_().getDataRange().getValues()))
    .setMimeType(ContentService.MimeType.JSON);
}
