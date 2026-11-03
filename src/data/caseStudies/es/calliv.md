---
role: "Desarrollador (proyecto personal)"
timeframe: "2021–2022, revisado en 2026"
outcome: "Una herramienta web que convierte la lectura de una placa de laboratorio en una curva de calibración ajustada. Tiene dos versiones publicadas: la app original en Vue y una reescritura en Nuxt con Vuex."
---

## El problema

En los ensayos de laboratorio de biología es habitual calcular una propiedad de una muestra por interpolación. Se mide una señal (absorbancia, fluorescencia, radiación, resistencia eléctrica, temperatura) para un conjunto de estándares de concentración conocida, se arma la **curva de calibración** y después se lee sobre esa curva el valor de la muestra desconocida.

Cuando empecé Calliv estudiaba biotecnología y quería trabajar con IA aplicada a las ciencias biológicas. Este proyecto junta las dos cosas: un flujo de trabajo real de laboratorio resuelto con herramientas de machine learning.

## Qué hace

Calliv toma el CSV que exporta un lector de placas y hace el recorrido completo en el navegador:

1. **Lee** el archivo, con separador `;` y comas decimales, tal como sale del equipo.
2. **Ordena** las lecturas: resta el fondo a cada una, promedia las lecturas repetidas de cada pocillo y arma la matriz de la placa.
3. **Resta el blanco** y lleva a cero los valores que quedan por debajo.
4. **Grafica** los estándares para detectar valores atípicos.
5. **Ajusta** una regresión y muestra la ecuación de la curva.

El CSV de ejemplo de los dos repositorios es una lectura real: 32 pocillos (`A1`–`H4`), cada uno leído en 3 ciclos.

## Versión 1: una app de Vue

La primera versión (2021) es una app de Vue 2 que corre solo en el navegador:

- **TensorFlow.js** ajusta los modelos por descenso de gradiente, y **p5.js** dibuja los puntos y la curva.
- Ajusta una **recta o una parábola** y muestra el <span tabindex="0" data-bs-toggle="tooltip" data-bs-placement="top" title="Coeficiente de determinación: la proporción de la variación de los datos que explica la curva. 1 es un ajuste perfecto.">R²</span> de cada una.
- Cada pantalla guarda sus resultados en `localStorage` y la siguiente los vuelve a leer.

Funcionaba, pero tenía límites claros: los valores de los estándares estaban fijos en el código, y si no se pasaba por la pantalla de procesamiento, la de curvas no tenía nada que ajustar.

## Versión 2: la reescritura en Nuxt

En mayo de 2021 empecé de cero con NuxtJS, aplicando lo que había aprendido. Los cambios principales:

- **Un store de Vuex** en lugar de claves sueltas en `localStorage`. Un solo store guarda todos los datos y se persiste entero con un plugin. Cada paso del cálculo es una mutación con nombre, y una acción encadena el procesamiento completo al subir el archivo.
- **Estándares editables:** cada fila de la placa tiene su campo para la concentración del estándar.
- **Dos métodos de ajuste para la recta:** descenso de gradiente con TensorFlow.js, con tasa de aprendizaje e iteraciones configurables, o **mínimos cuadrados**, la fórmula exacta. TensorFlow se carga solo cuando se usa.
- **Highcharts** para los gráficos.

Comparar los dos métodos fue lo más instructivo. Para una recta, mínimos cuadrados da siempre el mismo resultado exacto. El descenso de gradiente arranca de valores al azar, converge lento con estos datos y, si la tasa de aprendizaje pasa de cierto punto, diverge. Fue una buena lección sobre cuándo un modelo iterativo no es la herramienta adecuada.

## La revisión de 2026

En 2026 volví al proyecto para que las dos versiones se puedan usar de nuevo:

- Separé cada versión en su propio repositorio y las actualicé para que funcionen con herramientas actuales (pnpm y Node reciente).
- Documenté el formato del CSV y el funcionamiento de cada pantalla, con una guía para probarla con los datos de ejemplo.
- Publiqué las dos en Cloudflare Workers como sitios estáticos.

## Lo que todavía falta

- **Interpolar la muestra desconocida**, el último paso del ensayo. Las dos versiones llegan hasta ajustar la curva.
- La versión 2 solo ajusta rectas, y los estándares tienen que estar en la primera columna de la placa.

## Lo que aprendí

- Pasar una app de una sola página en Vue a NuxtJS: rutas por archivos, plugins y generación estática.
- Manejar estado compartido con Vuex, y por qué conviene más que pasar datos entre pantallas a mano.
- Ajustar modelos de regresión con TensorFlow.js, y saber cuándo una fórmula exacta es mejor opción.
- Manipular arreglos multidimensionales para representar una placa de laboratorio.

**Probalo:** [versión 1](https://calliv-v1.iasisalomon.workers.dev/) · [versión 2](https://calliv-v2.iasisalomon.workers.dev/)

**Código:** [calliv-v1](https://github.com/iasisalomon/calliv-v1) · [calliv-v2](https://github.com/iasisalomon/calliv-v2)
