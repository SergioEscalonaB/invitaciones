# Invita — panel e invitaciones digitales

Aplicación local en Next.js para administrar un evento, generar enlaces privados y recibir confirmaciones en `/invitacion/[token]`.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`; la raíz redirige al panel administrativo. Los datos del MVP se guardan en `localStorage`, por lo que se pueden probar sin una base de datos.

## Flujo principal

1. Entra al panel y crea una invitación con nombre y cupo.
2. Copia el enlace privado generado.
3. Abre el enlace para probar la confirmación o el rechazo.
4. Vuelve al panel para ver el estado actualizado.
5. Edita la plantilla y los datos del evento desde sus secciones laterales.

## PostgreSQL y Prisma

El modelo futuro está definido en `prisma/schema.prisma`. Cuando exista una base de datos:

```bash
copy .env.example .env
npx prisma migrate dev --name init
npx prisma generate
```

Después se debe sustituir `MockInvitationService` por una implementación de servidor basada en Prisma y proteger `/admin` con autenticación. No ejecutes una migración hasta configurar una `DATABASE_URL` real.

## Producción

Los enlaces usan siempre la ruta relativa `/invitacion/[token]`, así que al desplegar se convierten automáticamente en `https://tu-dominio.com/invitacion/token`. Antes de publicar quedan pendientes: autenticación del panel, persistencia con PostgreSQL, validación de permisos en el servidor y secretos de producción.
