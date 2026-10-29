# Suscripciones de Nexo

- Mensual: USD 100, un cobro cada mes.
- Anual: USD 1,100, un cobro cada año por 12 meses de servicio. Incluye un mes gratis frente a doce pagos mensuales (ahorro de USD 100).
- Ambos planes se renuevan hasta que el cliente los cancele desde PayPal. El descuento ya está incluido en el importe anual; no es una prueba gratis ni retrasa el primer cobro.

## Crear los planes en la cuenta de PayPal

Se necesita una aplicación REST de la cuenta PayPal Business que recibirá los pagos. Configurar de forma segura en el entorno de ejecución:

- `PAYPAL_API_CLIENT_ID`: identificador público de esa aplicación.
- `PAYPAL_API_CLIENT_SECRET`: secreto de la aplicación. No guardarlo en Git, HTML ni mensajes de chat.

Comprobar los importes sin llamar a PayPal:

```sh
node scripts/create-nexo-paypal-plans.cjs --dry-run
```

Con las credenciales configuradas, ejecutar desde `/workspace/casalabs` con Node 24 y la configuración heredada de proxy y certificados:

```sh
NODE_USE_ENV_PROXY=1 node scripts/create-nexo-paypal-plans.cjs --save
```

El script crea o reutiliza el producto de Nexo y los dos planes activos con las condiciones indicadas. Verifica importes, divisa, periodicidad y renovación ilimitada. No modifica precios de planes existentes ni crea suscripciones o cargos a clientes. Solo imprime los identificadores públicos obtenidos; nunca imprime el secreto ni el token OAuth.

Para pruebas aisladas se puede ejecutar con `--sandbox` y credenciales de sandbox. Sus IDs no deben usarse en producción. La red de sandbox necesita permitir `api-m.sandbox.paypal.com`.

## Activar la web publicada en Vercel

La opción `--save` guarda únicamente los tres identificadores públicos en `config/nexo-paypal-plans.json`. Tras crear los planes, confirmar ese archivo y subirlo a `main` permite desplegar los planes sin guardar el secreto en la web. El script rechaza guardar planes de sandbox o sobrescribir una configuración de otra aplicación comercial.

Como alternativa, los siguientes valores de Vercel Production tienen prioridad sobre el archivo:

- `PAYPAL_API_CLIENT_ID`: la aplicación pública del mismo comerciante propietario de los planes.
- `PAYPAL_NEXO_MONTHLY_PLAN_ID`: ID `P-…` del plan mensual, devuelto por el script.
- `PAYPAL_NEXO_ANNUAL_PLAN_ID`: ID `P-…` del plan anual, devuelto por el script.

Volver a desplegar después de configurar. El secreto no es necesario en Vercel ni en el archivo público para mostrar estos botones: solo lo utiliza el script administrativo al crear planes. `/api/nexo-plans` devuelve únicamente configuración pública y no permite crear planes. Sin un ID válido, la web muestra ese plan como no disponible y no inicia una operación con otro producto o precio.

Las páginas de Servicios y Nexo permiten elegir la frecuencia. El SDK de PayPal se carga únicamente al continuar con un plan disponible. Cada autorización usa el ID exacto del plan elegido.

La autorización recibida en el navegador no verifica un cobro ni activa automáticamente una cuenta de Nexo. Antes de automatizar altas se necesita una integración del servicio con verificación de suscripciones y webhooks autenticados de PayPal. En este sitio la activación se confirma con CaSa Labs.

## Estado de verificación

Se pueden probar las opciones y callbacks con un SDK simulado, sin pagos. La creación real de los planes requiere credenciales autorizadas. No describir planes o cobros reales como verificados hasta ejecutar la creación y comprobarlos en PayPal.

Pruebas locales reproducibles sin credenciales ni red:

```sh
node --test --test-isolation=none tests/nexo-payments.test.cjs
```
