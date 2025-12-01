# Challenge Técnico – Fullstack Developer (PHP + React)

Contiene un **backend PHP** y un **frontend React**, ambos levantados con Docker.

## Estructura del proyecto

```bash
challenge-matrice/
├─ backend/ # Código PHP + configuración Apache + storage
│ ├─ Dockerfile
│ ├─ 000-default.conf
│ └─ storage/ # Archivos persistentes de imágenes
├─ frontend/ # Código React + build
│ ├─ Dockerfile
│ └─ build/
└─ docker-compose.yml

```

## Requisitos

- Docker >= 20
- Docker Compose >= 1.29

## Cómo levantar el proyecto

1. Clonar el repositorio:

```bash
git clone <URL_DEL_REPO>
cd challenge-matrice
```

2. Generar el build del frontend React:

```bash
cd frontend
npm install
npm run build
cd ..
```

3. Levantar los contenedores

```bash
docker-compose up --build
```

## Configuración de la base de datos

1. Verificar que .env en Laravel tenga la conexión correcta:

```bash
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=challenge-matrice
DB_USERNAME=root
DB_PASSWORD=root
```

2. Correr migraciones:

```bash
docker compose exec backend bash
php artisan migrate
```

## Persistencia de imágenes

Los archivos subidos se guardan en backend/storage.

Laravel crea un link simbólico public/storage para servir las imágenes:

```bash
docker compose exec backend bash
php artisan storage:link
```

Las imágenes se pueden acceder desde el frontend usando URLs como:

http://localhost:8000/storage/tu-imagen.jpg

## Acceder a la aplicación

```bash
Backend PHP: http://localhost:8080

Frontend React: http://localhost:3000
```
