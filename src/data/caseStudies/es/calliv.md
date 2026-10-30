---
role: "Desarrollador y analista de datos"
timeframe: "2021"
outcome: "Una herramienta renderizada en el servidor para limpiar, procesar y visualizar datos científicos, con un frontend en Vue/Nuxt y un pipeline de procesamiento de datos."
---

## El desafío

Los datos científicos casi nunca llegan listos para analizar. Calliv se propuso tomar datos científicos crudos y dejarlos **limpios, procesables y legibles**: convertir archivos CSV desordenados en algo sobre lo que una persona pueda razonar y que se pueda visualizar.

## Mi rol

Construí el proyecto de punta a punta: el pipeline de procesamiento de datos y la interfaz renderizada en el servidor que lo expone.

## Cómo lo encaré

- **Limpieza y procesamiento de datos**: me ocupé del trabajo poco vistoso pero esencial de normalizar y validar los CSV crudos antes de que cualquier paso posterior pudiera confiar en ellos.
- **Frontend (Vue + Nuxt, SSR)**: usé renderizado del lado del servidor para que la primera carga fuera rápida, con una interfaz pensada para presentar los datos procesados y no para decorarlos.
- **Base para el análisis (TensorFlow)**: dejé preparado el terreno para aplicar técnicas de machine learning a los datos ya limpios.

## Qué demuestra

- Los fundamentos de ciencia de datos que más pesan en la práctica: **la limpieza y la validación van antes que el modelado**.
- La capacidad de moverme entre la capa de datos y una capa de presentación que hace legibles los hallazgos.
- Elegir la estrategia de renderizado adecuada (<span tabindex="0" data-bs-toggle="tooltip" data-bs-placement="top" title="Server-Side Rendering: el servidor genera el HTML completo de una página antes de enviarlo al navegador, en lugar de armarlo del lado del cliente.">SSR</span>) para el problema, en lugar de ir por la opción por defecto.

**Código:** [github.com/iasisalomon/calliv](https://github.com/iasisalomon/calliv)
