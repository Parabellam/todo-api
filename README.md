# API de Gestión de Tareas (Todo List)

API RESTful construida con NestJS para la gestión de tareas personales, desarrollada como parte de una prueba técnica.

## Características

- Autenticación de usuarios con sesiones de 10 minutos
- Protección de endpoints con API Key
- CRUD completo de tareas
- Documentación con Swagger
- Base de datos PostgreSQL
- Validación de datos
- Manejo de errores
- Contenerización con Docker

## Requisitos

- Node.js v22+ recomendado 22.13.0
- PostgreSQL (v15 o superior)
- Docker y Docker Compose (opcional)
- npm o yarn

## Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd todo-api
```

2. Instalar dependencias:

```bash
npm i
```

3. Configurar variables de entorno:
   Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   DATABASE_URL="postgresql://stiven:123456@localhost:5499/nestdb?schema=public"
   JWT_SECRET=stiven-jwt-example
   API_KEY=stiven-api-key-example
   PORT=3000
   ```

````

4. Configurar la base de datos o levantar docker compose:

   - Opción docker: docker-compose up -d

   Ó

   - Crear una base de datos PostgreSQL llamada `nestdb`
   - Crear un usuario `stiven` con contraseña `123456`
   - O modificar las credenciales en el archivo `.env` según tu configuración (DATABASE_URL)

5. Ejecutar migraciones:

```bash
npm run migration:run
````

6. Iniciar la aplicación:

```bash
npm run start:dev
```

## Primeros Pasos

1. La aplicación se iniciará en `http://localhost:3000`
2. Accede a la documentación Swagger en `http://localhost:3000/api`
3. Para crear tu primer usuario, usa el endpoint de registro o contacta al administrador del sistema

## Documentación de la API

La documentación de la API está disponible en Swagger UI cuando la aplicación está en ejecución:

```
http://localhost:3000/api
```

## Solución de Problemas

### Problemas Comunes

1. **Error de conexión a la base de datos**:

   - Verifica que PostgreSQL esté corriendo
   - Confirma que las credenciales en `.env` sean correctas
   - Asegúrate de que la base de datos `nestdb` exista

2. **Error de autenticación**:
   - Verifica que el API Key sea correcto
   - Asegúrate de que el token JWT no haya expirado
   - Confirma que las credenciales de usuario sean correctas
