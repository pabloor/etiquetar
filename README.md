# Skale · etiquetar tonalidades

Página web para etiquetar a oído la tonalidad de fragmentos de música, sin cuentas ni instalar nada:
**https://pabloor.github.io/etiquetar/**. Las respuestas sirven para entrenar
[Skale](https://github.com/pabloor/SKALE), un detector de tonalidad libre (AGPL).

- Cada fragmento (30 s, de Free Music Archive) se descarga en el navegador al abrirlo, y los siguientes por adelantado.
- La página propone las 3 tonalidades más probables según el modelo actual, en orden aleatorio, y deja elegir otra,
  «sin tonalidad clara» o saltar. «Cadencia» toca I–IV–V–I en esa tonalidad encima de la música.
- El progreso se guarda en el navegador; cada respuesta se envía además a una hoja de cálculo de Google
  (`google_apps_script.gs`). Si no hay conexión, se envía más tarde.
- Uno de cada 20 fragmentos está etiquetado por expertos (FMAK) para medir la coincidencia; la página no lo indica.
- Cada navegador empieza en un punto distinto de la lista, para repartir el trabajo entre varias personas.

## Configurar la hoja de Google (una vez)

1. Crea una hoja de cálculo nueva en [sheets.new](https://sheets.new) (por ejemplo «Skale etiquetas»).
2. En la hoja: **Extensiones → Apps Script**. Borra lo que haya, pega el contenido de `google_apps_script.gs`
   y cambia `cambia-esta-palabra` por una palabra que solo sepas tú (la clave para leer las respuestas).
   Guarda (icono del disquete).
3. **Implementar → Nueva implementación**. En el engranaje, tipo **Aplicación web**. «Ejecutar como»: **yo**;
   «Quién tiene acceso»: **Cualquier usuario**. **Implementar**, y autoriza el acceso a tu cuenta cuando lo pida
   (Google avisa de que la aplicación no está verificada: «Configuración avanzada» → «Ir a …»).
4. Copia la **URL de la aplicación web** (termina en `/exec`) y ponla en `config.js`.

## Pasar las etiquetas a Skale

En el repositorio de Skale: `python3 tools/sync_etiquetas.py URL_EXEC CLAVE` escribe
`tools/samples/fma_user_labels.jsonl` y `tools/samples/fma_user_expected.csv`; después
`tools/fetch_datasets.py DATOS --solo fma_user` baja el audio para entrenar.

## Música

Fragmentos de `fma_small` ([Free Music Archive](https://github.com/mdeff/fma), Defferrard et al., ISMIR 2017),
solo con licencias Creative Commons o de dominio público, recodificados a MP3 de 128 kbps sin otros cambios.
Título, artista y licencia de cada uno en la página y en `creditos.html`. Cada pieza es de su autor y se usa
bajo su licencia; el código de la página es AGPL-3.0-or-later, como Skale.
