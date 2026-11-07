---
role: "Desarrollador (de punta a punta)"
timeframe: "2026"
outcome: "Un reloj de control de accesos que solo hablaba por red local ahora sincroniza con la nube a costo mensual cero, con registros consultables desde cualquier lugar y cada corrección guardada en un historial auditable."
heroImageAlt: "Tabla de registros del panel con el historial de un registro editado abierto debajo de su fila"
gallery:
  - src: "/images/gallery/anviz-cloud-sync/records-history.webp"
    alt: "Pantalla Registros con el historial de un registro editado abierto debajo de su fila"
    caption: "Registros: el historial se abre debajo de la fila y termina en la hora original del equipo"
  - src: "/images/gallery/anviz-cloud-sync/people.webp"
    alt: "Pantalla Prestadores de servicios con la lista de personas cargadas en el reloj"
    caption: "Prestadores: lo que hay en el reloj, con huellas, clave, tarjeta y grupo"
  - src: "/images/gallery/anviz-cloud-sync/changes.webp"
    alt: "Pantalla Cambios con el registro unificado de modificaciones"
    caption: "Cambios: registros y prestadores en un solo log, con motivo, estado y autor"
---

*En las capturas, los nombres, códigos, motivos y datos del equipo se reemplazaron por otros ficticios.*

## El problema

Los datos del reloj solo se podían ver desde una PC en la misma red. Un equipo Anviz GC150 guardaba los registros en su memoria, y la única forma de leerlos era CrossChex Standard, un programa de escritorio conectado a esa misma red.

- **Sin acceso remoto:** nadie podía consultar los registros fuera del lugar.
- **Sin trazabilidad:** no había forma de corregir un registro dejando escrito quién lo cambió y por qué.
- **Sin respaldo:** los datos dependían de un solo equipo y de una base local.
- **Costo descartado:** la opción oficial en la nube (CrossChex Cloud) es paga, y el objetivo era no sumar gastos fijos.

## La solución

Un agente en Python hace de puente entre la red local y la nube, sin abrir ningún puerto de entrada. El reloj escucha en la LAN, el agente se conecta a él y empuja los datos por HTTPS a Supabase. El panel web solo habla con Supabase, nunca con el reloj.

![Arquitectura: el reloj y el agente en la red local, Supabase en la nube y el panel en el navegador](/images/work/anviz-cloud-sync-architecture.webp)

Los cambios en sentido inverso pasan por una cola: el panel escribe un pedido, y el agente lo aplica en el reloj en su siguiente corrida y marca el resultado.

La decisión de fondo es que **el reloj es el registro crudo y Supabase la versión oficial**. Pueden diferir a propósito, y cada diferencia queda explicada por el historial.

## Desafíos técnicos

Cada decisión se comprobó contra el equipo real o la base en producción, no solo en papel.

| Desafío | Qué se hizo | Cómo se comprobó |
| --- | --- | --- |
| Protocolo binario sin SDK | Cliente TCP propio en Python, sin dependencias: tramas, CRC16, comandos y parsers | 163 de 163 registros idénticos a la base de CrossChex; 9 fichas de personas reconstruidas byte a byte |
| No perder datos | Las marcas de "nuevo" del reloj se limpian solo después de subir; clave única contra duplicados | Conciliación registro por registro: 0 sin subir |
| Corregir sin perder el original | La hora del equipo nunca cambia y es la clave; la hora oficial es editable; la baja es lógica | Una descarga completa no revive ni pisa registros editados o eliminados |
| Seguridad sin servidor propio | Row Level Security, permisos por columna y triggers en Postgres | Desde el navegador, la base rechazó borrados reales, cambios de la hora original, autor falsificado y motivo vacío |
| Claves de acceso protegidas | RSA-OAEP-SHA256 de 3072 bits: cifra el navegador, descifra solo el agente | Clave nueva escrita en el reloj y usada en el equipo, con su cero inicial intacto |
| Reloj con la hora mal | El agente corrige desvíos de más de 30 segundos en cada ciclo | Un adelanto de 1 hora se detectó cruzando registros y horarios; se corrigió conservando la hora original |

El historial lo escribe un trigger, así que no se puede falsificar desde el navegador: el autor sale de la sesión, no de lo que envía la página.

## El producto

El panel tiene tres pantallas, con tema oscuro por defecto y tema claro a un clic.

- **Registros:** rangos rápidos, filtros por columna, fila de resumen y exportación a CSV que replica lo que se ve. Alta manual, edición, baja y restauración, con motivo obligatorio. Un clic en la fila abre su historial.
- **Prestadores:** alta, edición y baja de personas en el reloj desde la web, con la clave cifrada en el navegador.
- **Cambios:** un solo tablero con todo lo que se modificó, quién lo hizo y qué sigue pendiente de aplicar en el reloj.
- **Estado del equipo:** última sincronización, registros sin subir, uso de memoria y el comando listo para copiar.

## Stack y resultados

El sistema funciona con costo mensual cero y con todo el historial del reloj en la nube. Hoy el agente corre a demanda; el próximo paso es dejarlo en un equipo encendido las 24 horas.

| Capa | Tecnología |
| --- | --- |
| Agente | Python, sockets TCP, `requests`, `cryptography` |
| Datos y acceso | Supabase: Postgres, Auth, RLS, triggers |
| Panel | Vue 3, Vite, Pinia, Vue Router |
| Interfaz | shadcn-vue, Tailwind CSS v4, TanStack Table, Day.js, PapaParse |
| Desarrollo | Asistido con Claude Code |
