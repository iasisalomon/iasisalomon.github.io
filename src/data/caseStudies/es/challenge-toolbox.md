---
role: "Ingeniero full-stack"
timeframe: "2022"
outcome: "Una aplicación full-stack en contenedores que toma datos CSV de una API externa, los procesa en el servidor y los presenta en una interfaz en React, construida de punta a punta."
---

## El desafío

Construir una aplicación full-stack que consuma archivos CSV de una API externa, transforme los datos y los haga útiles a través de una interfaz web clara, empaquetada para que funcione igual en cualquier máquina.

Es una consigna más completa de lo que parece: abarca la ingesta de datos, una capa de procesamiento en el backend, el manejo de estado en el frontend y un despliegue reproducible.

## Mi rol

Único ingeniero, a cargo de todo el stack: la integración con la API, la lógica de procesamiento, la interfaz y la configuración de Docker que une todo.

## Cómo lo encaré

- **Backend (Node.js)**: descargué y parseé los CSV de la API externa, con la lógica de transformación aislada para poder razonarla y testearla sin depender del transporte.
- **Frontend (React + Redux)**: modelé los datos procesados en un store de estado predecible, para que la interfaz se mantuviera sincronizada a medida que llegaban los datos.
- **DevOps (Docker)**: puse la aplicación en contenedores para que el entorno fuera reproducible y empezar a trabajar fuera un solo comando en lugar de una lista de pasos.

## Qué demuestra

- Soltura en todo el stack (capa de datos, API, manejo de estado e interfaz) y no en una sola capa.
- Una preferencia por la **reproducibilidad**: contenedores desde el principio, no agregados al final.
- Separar responsabilidades (transporte, transformación y presentación) para que cada parte siga siendo simple.

**Código:** [github.com/iasisalomon/challenge_toolbox](https://github.com/iasisalomon/challenge_toolbox)
