---
role: "Desarrollador (de punta a punta)"
timeframe: "2026"
outcome: "Un reloj de control de accesos que solo hablaba por red local ahora sincroniza con la nube a costo mensual cero, con registros consultables desde cualquier lugar, horas calculadas por persona y cada corrección guardada en un historial auditable."
heroImageAlt: "Tabla de registros del panel con el historial de un registro editado abierto debajo de su fila"
gallery:
  - src: "/images/gallery/anviz-cloud-sync/records-history.webp"
    alt: "Pantalla Registros con el historial de un registro editado abierto debajo de su fila"
    caption: "Registros: el historial se abre debajo de la fila y termina en la hora original del equipo"
  - src: "/images/gallery/anviz-cloud-sync/shifts.webp"
    alt: "Pantalla Turnos con las horas por persona y los turnos de una de ellas desplegados"
    caption: "Turnos: las horas por persona, con el ingreso, el egreso y el estado de cada turno a un clic"
  - src: "/images/gallery/anviz-cloud-sync/people.webp"
    alt: "Pantalla Prestadores con la lista de personas cargadas en el reloj"
    caption: "Prestadores: lo que hay en el reloj, con huellas, clave, tarjeta y grupo"
  - src: "/images/gallery/anviz-cloud-sync/changes.webp"
    alt: "Pantalla Cambios con el registro unificado de modificaciones"
    caption: "Cambios: registros y prestadores en un solo log, con motivo, estado y autor"
---

*En las capturas, los nombres, los números de documento, los correos, el número de serie del equipo y las rutas de archivos se reemplazaron por otros ficticios.*

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

El panel tiene cuatro pantallas, con tema oscuro por defecto y tema claro a un clic. Todas comparten una barra de estado: cuándo corrió la última sincronización, cuánto se desvía la hora del reloj (en segundos), cuántas personas y registros hay en el equipo sobre su capacidad de 102.400, cuántos registros se cargaron a mano, cuántos faltan subir y el comando para actualizar desde el reloj, listo para copiar.

### Registros

Las marcas del reloj, filtradas y resumidas.

- **Rangos y filtros:** rangos rápidos (hoy, 7 días, este mes, mes anterior), o un mes o fechas a elección, y filtros por columna para persona, tipo (ingreso o egreso) y verificación (huella o manual).
- **Resumen:** días con registros, registros, personas, ingresos, egresos, y cuántos registros son manuales o editados, en cantidad y como porcentaje del total. Muestra de un vistazo cuánto de los datos se tocó a mano.
- **Correcciones:** alta de un registro, edición, baja y restauración, cada una con motivo obligatorio. Los eliminados quedan ocultos salvo que se pidan.
- **Historial:** un clic en la fila abre su línea de tiempo, de lo más nuevo a lo más viejo: quién lo cambió, por qué, y el antes y el después, hasta llegar al registro original del equipo.
- **Exportación:** CSV que replica lo que se ve en pantalla.

![El formulario de nuevo registro abierto sobre la tabla de registros: persona, fecha, hora, tipo y un motivo obligatorio](/images/gallery/anviz-cloud-sync/new-record.webp)

Carga de un registro a mano. El formulario aclara que se guarda solo en el panel, nunca en el reloj, y deja asentado quién lo hizo y por qué.

### Turnos

Las marcas emparejadas en horas trabajadas, para que nadie tenga que sumarlas a mano.

- **Totales por persona:** horas, turnos completos, duración promedio, y cuántos turnos fueron de menos de 6 horas, de 6 a 8 y de más de 8. Arriba, mosaicos con el total de horas, los turnos completos, los que están en curso y los que hay que revisar.
- **Detalle a pedido:** al desplegar a una persona se ve cada turno con su ingreso, egreso, horas y estado (completo o en curso). Un turno que termina después de medianoche aparece marcado con "+1 día".
- **Lista de revisión:** los turnos que necesitan atención se listan debajo de la tabla, para que una marca faltante no distorsione las horas sin que nadie se entere.
- **Mismos controles que Registros:** rangos rápidos, mes o fechas a elección, filtro por persona y exportación a CSV.

### Prestadores

Las personas cargadas en el reloj, administradas desde la web.

- **Alta, edición y baja** de personas en el equipo. Las huellas se enrolan en el propio reloj.
- **Clave:** se define desde la web y se cifra en el navegador antes de salir.
- **Lo que guarda el equipo:** el reloj admite nombres de hasta 10 caracteres, así que la pantalla muestra el nombre completo junto al que figura en el equipo, y además la cantidad de huellas, la clave, la tarjeta y el grupo.
- **Búsqueda** por nombre o DNI, con una etiqueta de administrador, y quienes ya no están en el reloj quedan en una lista aparte, plegada.

### Cambios

Un solo tablero con todo lo que se modificó.

- **Contadores:** pendientes, fallidos, de hoy y total.
- **Filtros:** solo prestadores, solo registros o ambos; por estado (pendiente, aplicado, falló, cancelado); por autor; y búsqueda libre por nombre, motivo y detalle.
- **Cada fila:** cuándo, sobre qué fue (registro o prestador), la acción, el detalle (antes y después, y el motivo), su estado y quién lo hizo.
- **Los pedidos pendientes** son los que el agente todavía no aplicó en el reloj.

## Stack y resultados

El sistema funciona con costo mensual cero y con todo el historial del reloj en la nube. Hoy el agente corre a demanda; el próximo paso es dejarlo en un equipo encendido las 24 horas.

| Capa | Tecnología |
| --- | --- |
| Agente | Python, sockets TCP, `requests`, `cryptography` |
| Datos y acceso | Supabase: Postgres, Auth, RLS, triggers |
| Panel | Vue 3, Vite, Pinia, Vue Router |
| Interfaz | shadcn-vue, Tailwind CSS v4, TanStack Table, Day.js, PapaParse |
| Desarrollo | Asistido con Claude Code |
