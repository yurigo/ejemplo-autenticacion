# Autenticación


## Base de datos

La "base de datos" que estamos utilizando es un array en memoria con 5 usuarios:

- `alice@acme.com` : `longaniza`
- `bob@acme.com` : `longaniza`
- `charlie@acme.com` : `longaniza`
- `dave@acme.com` : `longaniza`
- `eva@acme.com` : `longaniza`

## Modules

- `bcrypt`: encriptación del password
- `dotenv`: variables de entorno
- `express`: framework web
- `jsonwebtoken`: librería que implementa [JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- `rfdc`: Realy Fast Deep Clone.  Implementa la copia profunda de objetos javascript.  (no more `JSON.parse(JSON.stringify(object))`)