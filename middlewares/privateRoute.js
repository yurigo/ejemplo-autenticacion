function privateRoute(req, res, next) {

    // si el token no esta en la cabecera de la peticion lanzamos un error al middleware de errores
    if (!req.headers.authorization) return next('401')

    // obtenemos el token -> Authorization: Bearer ey9031468497h086f64f13h7j98.6f419h780f61436f497h8106h96f831.09879573f48fh
    // Solo necesitamos el token, por eso lo cortamos y descartamos el "Bearer "
    const token = req.headers.authorization.split(" ")[1];

    // comprobamos que haya token
    if (!token) return next('401')

    const jwt = require('jsonwebtoken');
    try {
        // verificamos el token y obtenemos el payload, en caso que no sea valido capturamos el error y lo propagamos al middleware de errores
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.USER_ID = decoded.id
        req.USER_EMAIL = decoded.email
        next()
    } catch (error) {
        return next('401')
    }

}

module.exports = { privateRoute }