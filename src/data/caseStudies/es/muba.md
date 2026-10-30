---
role: "Líder de delivery, construyendo con socios"
timeframe: "Feb 2026 – actualidad"
outcome: "Definí el alcance, diseñé la arquitectura y revisé el delivery asistido por IA de una plataforma multi-tenant para geriátricos, con legajos de residentes, facturación y registros de enfermería, respaldada por más de 1.600 tests automatizados de la API."
---

## El desafío

[MUBA](https://muba.app/) desarrolla software para organizaciones de salud en Argentina. Su primer producto ayuda a los geriátricos a llevar la operación del día a día, de los residentes y las camas a la facturación y la atención de enfermería, en un solo lugar en vez de en herramientas sueltas.

La plataforma tenía que atender a varias instituciones en un mismo sistema, mantener los datos de cada una completamente aislados y darle a cada rol del personal acceso solo a lo que necesita.

## Mi rol

El alcance y la especificación funcional, definidos con los socios; después, el delivery en dos repositorios, una API REST y una aplicación web. Los agentes de IA escribieron buena parte del código. La arquitectura, las revisiones y la decisión de qué contaba como terminado quedaron a mi cargo.

- **Un manual escrito para los agentes.** La arquitectura, el manejo de errores, el aislamiento de datos y las convenciones de testing están escritos como reglas, y cada cambio se mide contra ellas.
- **Revisión antes de que algo salga.** Los agentes nunca hacen commit. Cada cambio se lee, la suite de tests se corre a mano y un plan solo se cierra con un resultado en verde. Las revisiones de código y las auditorías aparte generaron trabajo nuevo propio.
- **Decisiones tomadas y registradas.** Donde la especificación dejaba lugar a interpretación, la decisión se tomó de manera deliberada, se consultó con los socios cuando tocaba al negocio y se registró con su fundamento.
- **Un mismo hilo entre backend y frontend.** Los cambios incompatibles de la API se anunciaban con anticipación, los deploys se coordinaban y las rondas de tests de punta a punta definían los planes siguientes.

## Cómo se trabajó

- **Planes chicos y numerados.** Cada pieza de trabajo es un plan corto con un ID, agrupado por módulo. Una sola tabla tiene el estado de todos los planes, y un registro anota qué cambió y por qué.
- **Cuatro etapas por funcionalidad.** Primero, la funcionalidad anda, con control de acceso y aislamiento de datos desde el primer día. Segundo, los tests se escriben **a partir de la especificación, sin leer el código**, para que no se limiten a confirmar lo que el código ya hace. Tercero, los casos borde. Cuarto, el pulido.
- **Trazable a la especificación.** Cada plan cita los casos de prueba de la especificación que cubre. La especificación nunca se edita para que coincida con el código: cada desvío deliberado queda en un registro de decisiones.
- **Las dudas van al negocio.** Cuando la especificación no decía nada, la pregunta iba a los socios en lugar de adivinar, y la respuesta quedaba registrada.

## Qué se entregó

- **Residentes e instituciones:** legajos de residentes y de la institución donde viven.
- **Finanzas:** contratos, facturación, pagos y gestión con obras sociales.
- **Enfermería:** registros clínicos diarios para el equipo de enfermería.
- **Plataforma:** aislamiento multi-tenant, permisos por rol, registro de auditoría y mensajes de error consistentes y listos para el usuario.

La API corre en Node.js con Express 5, Prisma y PostgreSQL, con validación en Zod y un contrato OpenAPI. La aplicación web corre en React 19, Vite, Zustand y Tailwind. Las dos corren en Docker, con un entorno de demo en vivo.

## Resultado

- Más de **1.600 tests automatizados de la API**, todos en verde.
- **Más de 600 commits** en los dos repositorios en unos ocho meses.
- Una [demo en vivo](https://demo.muba.lat) con datos de ejemplo.
