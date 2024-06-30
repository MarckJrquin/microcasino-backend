# API (Proyecto Final DSV - DVI)

## Crear base de datos
```
CREATE DATABASE casino;
```

## Variables de entornos
* Crear archivo .env en la raiz del proyecto y agregar dentro:
```
COOKIE_SECRET=mySuperSecretKey123
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=12345 {contraseña propia}
DB_NAME=casino
DB_DIALECT=mysql   
DB_POOL_MAX=8
DB_POOL_MIN=0
DB_POOL_ACQUIR=30000
DB_POOL_IDLE=10000
```

## Project setup
```
npm install
```

## Run
```
npm run start
```

## Ejecutar instrucciones MySQL
```
INSERT INTO roles VALUES (1, 'user', now(), now());
INSERT INTO roles VALUES (2, 'moderator', now(), now());
INSERT INTO roles VALUES (3, 'admin', now(), now());
```


## API Endpoints
<div>

| Methods |             Urls           |                Actions 
|-------------|:--------------------------:|-----------------------------------:|
| **POST**    | /api/auth/signup           | signup new account
| **POST**    | /api/auth/signin           | login an account
| **POST**    | /api/auth/signout          | logout the account
| **GET**     | /api/user/perfil           | Get the current profile account
| **PUT**     | /api/user/editProfile      | Update the current profile account
| **GET**     | /api/test/all              | retrieve public content
| **GET**     | /api/test/user             | access User’s content
| **GET**     | /api/test/mod              | access Moderator’s content
| **GET**     | /api/test/admin            | access Admin’s content

</div>