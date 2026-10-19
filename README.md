# Invita — panel e invitaciones digitales

Aplicación local en Next.js para administrar un evento, generar enlaces privados y recibir confirmaciones en `/invitacion/[token]`.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`; la raíz redirige al panel administrativo. Los datos se guardan en PostgreSQL mediante Prisma.

El panel requiere `ADMIN_PASSWORD` y `ADMIN_SESSION_SECRET`. Genera un secreto aleatorio de al menos 32 bytes y guárdalo únicamente en el entorno del servidor. Los invitados no necesitan iniciar sesión: su token aleatorio funciona como credencial del enlace privado.

## Flujo principal

1. Entra al panel y crea una invitación con nombre y cupo.
2. Copia el enlace privado generado.
3. Abre el enlace para probar la confirmación o el rechazo.
4. Vuelve al panel para ver el estado actualizado.
5. Edita la plantilla y los datos del evento desde sus secciones laterales.

## PostgreSQL y Prisma

El modelo está definido en `prisma/schema.prisma`. Para conectar otro PostgreSQL:

```bash
copy .env.example .env
npx prisma migrate dev --name init
npx prisma generate
```

La aplicación usa endpoints internos para que las credenciales nunca lleguen al navegador. Protege `/admin` con autenticación antes de publicar.

## Producción

Los enlaces usan `DOMINIO` como origen y terminan en `/invitacion/[token]`. El token contiene 256 bits aleatorios y no deriva del nombre del invitado. En desarrollo usa `DOMINIO=http://localhost:3000`; en producción cámbialo por `https://tu-dominio.com` y configura los secretos administrativos del entorno.
