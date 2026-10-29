# Nexo: suscripción por usuario

El precio se calcula según la cantidad de personas que utilizarán Nexo:

- Mensual: USD 14 por usuario, cada mes.
- Anual: USD 154 por usuario, cada año por 12 meses de acceso. Se pagan 11 meses y se recibe uno gratis.
- Ejemplo de 20 usuarios: USD 280 mensuales o USD 3,080 anuales. El ahorro anual es USD 280 frente a doce mensualidades.
- Ambos planes se renuevan hasta que el cliente los cancele desde PayPal. El mes gratis ya está descontado del importe anual; no es una prueba gratuita ni retrasa el primer cobro.

`js/nexo-pricing.js` contiene el precio unitario y la validación compartidos por la calculadora, la configuración pública y el script administrativo. El selector solo acepta cantidades enteras positivas y descarta importes fuera de la precisión segura. El total mostrado se recalcula al cambiar usuarios o frecuencia.

## Crear los planes reales en PayPal

Configurar de forma segura una aplicación REST Live de la cuenta PayPal Business que recibirá los pagos:

- `PAYPAL_API_CLIENT_ID`: identificador público de esa aplicación.
- `PAYPAL_API_CLIENT_SECRET`: secreto. Nunca guardarlo en Git, HTML ni chat.

Revisar los importes sin red ni credenciales:

```sh
node scripts/create-nexo-paypal-plans.cjs --dry-run
```

Con las credenciales configuradas, ejecutar desde `/workspace/casalabs` con Node 24, conservando proxy y certificados:

```sh
NODE_USE_ENV_PROXY=1 node scripts/create-nexo-paypal-plans.cjs --save
```

El script crea o reutiliza el producto específico por usuario y dos planes activos con `quantity_supported: true`. Comprueba el importe unitario, USD, frecuencia, renovación ilimitada y soporte de cantidades. No modifica los antiguos planes de tarifa fija, no crea suscripciones y no carga pagos a clientes.

Los nuevos planes son distintos de los de USD 100/1,100: no se reutilizan aquellos IDs. Las claves de idempotencia y el producto se separan para evitar confundir tarifas. El archivo público utiliza `pricingModel: per_user_v1`.

La opción `--save` guarda únicamente los IDs públicos en `config/nexo-paypal-plans.json`. Confirmar ese archivo y subirlo a `main` permite desplegar los planes sin incluir el secreto. El script rechaza guardar planes de sandbox o sobrescribir una configuración de otra aplicación comercial.

Para pruebas aisladas se puede usar `--sandbox` y credenciales de sandbox. No usar sus IDs en producción. La red necesita permitir `api-m.sandbox.paypal.com` para esa opción.

## Configuración alternativa en Vercel

Estos valores de Production tienen prioridad sobre el archivo público:

- `PAYPAL_API_CLIENT_ID`: aplicación del comerciante propietario de los planes.
- `PAYPAL_NEXO_PER_USER_MONTHLY_PLAN_ID`: ID `P-…` del plan de USD 14 por usuario/mes.
- `PAYPAL_NEXO_PER_USER_ANNUAL_PLAN_ID`: ID `P-…` del plan de USD 154 por usuario/año.

Volver a desplegar después de configurar. Las antiguas variables `PAYPAL_NEXO_MONTHLY_PLAN_ID` y `PAYPAL_NEXO_ANNUAL_PLAN_ID` se ignoran para evitar cobrar la tarifa anterior. El secreto no se necesita en Vercel para mostrar los botones; solo se usa al crear los planes.

## Cómo se cobra

Servicios y Nexo permiten elegir cantidad de usuarios y frecuencia. PayPal solo carga al continuar con una selección válida y un plan configurado. La solicitud de suscripción envía el ID del plan y `quantity` con el número entero de usuarios. PayPal multiplica el precio unitario del plan por esa cantidad: por ejemplo, USD 14 × 20 = USD 280 cada mes. No basta con actualizar el texto del total.

La frecuencia y la cantidad se bloquean mientras se autoriza en PayPal. Sin un plan válido por usuario, no se inicia un pago con otro producto o importe. Las páginas siguen mostrando la calculadora y el contacto para contratar.

La autorización del navegador no verifica un cobro ni activa automáticamente una cuenta. El nuevo checkout exige que el backend de Nexo esté listo antes de cobrar: el webhook verifica el plan, estado, importe y cantidad de usuarios antes de habilitar plazas. Automatizar las altas y cambios de usuarios requiere verificación de suscripciones y webhooks autenticados en el servicio Nexo. Este selector contrata nuevas suscripciones; no modifica las que ya existan.

## Verificación

```sh
node --test --test-isolation=none tests/nexo-payments.test.cjs
```

Las pruebas de planes utilizan PayPal simulado; no hacen cargos. La creación real continúa requiriendo credenciales autorizadas. No describir planes o cobros reales como verificados hasta ejecutarlos y comprobarlos en la cuenta.

Referencia técnica: especificación oficial de PayPal, `plan_request_POST.quantity_supported` y `subscription_request_post.quantity`, en https://github.com/paypal/paypal-rest-api-specifications/blob/main/openapi/billing_subscriptions_v1.json.

## Producción verificada

El 29 de octubre de 2026 se crearon y verificaron en PayPal Live los dos planes de Nexo por usuario. Se confirmaron estado activo, USD 14 mensuales / USD 154 anuales, soporte de cantidades y renovación ilimitada. Una segunda ejecución conservó los mismos identificadores públicos en `config/nexo-paypal-plans.json`. Pasaron las seis pruebas automatizadas locales. No se crearon suscripciones de clientes ni se hicieron cargos reales para validar esta configuración.

## Alta automática de empresas (29/10/2026)

El formulario en Nexo y Servicios ahora solicita empresa, correo de administración y plazas (1–500). El botón muestra el importe exacto. `/api/nexo-checkout` conecta con la función del mismo nombre en el proyecto Supabase de `samauel05-byte/Nexo`: ese servidor registra la compra y crea la suscripción; el navegador solo recibe el ID de PayPal.

El botón de cobro requiere que la función responda `ready:true`, con el mismo client ID y modelo que los planes publicados. Mientras no esté desplegada/configurada, se conserva la calculadora y se indica contratar por contacto, sin cobrar una suscripción que aún no pueda darse de alta automáticamente.

El webhook, migración de base de datos, alta con invitación, correos pendientes y control de licencias están en el repositorio Nexo. Instrucciones: `docs/ACTIVAR-SUSCRIPCIONES.md` en ese repositorio. El push de esta web no publica funciones Supabase. El aviso del navegador tras aprobar PayPal no confirma por sí solo una licencia ni un cargo; solo el servidor puede hacerlo después de verificar firma, suscripción y cobro.
