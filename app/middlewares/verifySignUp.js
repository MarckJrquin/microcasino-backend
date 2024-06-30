const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;


const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        const { username, email } = req.body;

        // Verifica username
        let user = await User.findOne({
            where: {
                username: username
            }
        });

        if (user) {
            return res.status(400).send({ message: "Failed! Username is already in use!" });
        }

        // Verifica correo electrónico
        user = await User.findOne({
            where: {
                email: email
            }
        });

        if (user) {
            return res.status(400).send({ message: "Failed! Email is already in use!" });
        }

        next();
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


/* -- Middleware para verificar si los roles existen -- */
const checkRolesExisted = (req, res, next) => {
    const { roles } = req.body;
    if (roles) {
        for (let role of roles) {
            if (!ROLES.includes(role)) {
                return res.status(400).send({ message: `Failed! Role does not exist = ${role}` });
            }
        }
    }
    next();
};


/*-- Middleware para verificar que el usuario ingrese su nombre --*/
const checkName = (req, res, next) => {
    const { name } = req.body;
    if(!name){ 
        return res.status(400).send({ message: "Error. Por favor ingrese un nombre" });
    }
    if(/\d/.test(name)) { 
        return res.status(400).send({ message: "Error. El nombre no puede contener números" });
    }
    if (/[^\w\s]/.test(name)){
        return res.status(400).send({ message: "Error. El nombre no puede contener caracteres especiales" });
    }
    next();
};


/*-- Middleware para verificar que el usuario ingrese su apellido --*/
const checkLastName = (req, res, next) => {
    const { lastName } = req.body;
    if(!lastName){ 
        return res.status(400).send({ message: "Error. Por favor ingrese un apellido"});
    }
    if(/\d/.test(lastName)){ 
        return res.status(400).send({ message: "Error. El apellido no puede contener números" });
    }
    if (/[^\w\s]/.test(lastName)){
        return res.status(400).send({ message: "Error. El apellido no puede contener caracteres especiales" });
    }
    next();
};


/*-- Middleware para verificar que el usuario ingrese una fecha de nacimiento --*/
const checkBirthDate = (req, res, next) =>{
    const { birthDate } = req.body;

    if (!birthDate) {
        return res.status(400).send({ message: "Error. Por favor ingrese una fecha de nacimiento" });
    }

    // Expresión regular para validar el formato yyyy-mm-dd
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    // Verifica si la fecha cumple con el formato yyyy-mm-dd
    if (!dateRegex.test(birthDate)) {
        return res.status(400).send({ message: "Error. El formato de fecha de nacimiento debe ser yyyy-mm-dd" });
    }

    // Verificar si el usuario es mayor de 18 años
    const birthDateObj = new Date(birthDate);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDateObj.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDateObj.getDate())) {
        age--;
    }

    if (age < 18) {
        return res.status(400).send({ message: "Error. Debe ser mayor de 18 años" });
    }

    next();
};


/*-- Middleware para verificar que el usuario ingrese su cedula --*/
const checkIdentification = (req, res, next) => {
    let { identification } = req.body;
    if(!identification){
        return res.status(400).send({ message: "Por favor, ingrese una cédula"});
    }

    identification = identification.trim();
    if(/\s/.test(identification)) {
        return res.status(400).send ({ message: "La cédula no puede tener espacios en blanco" });
    }
    next();
};


/*-- Middleware para verificar que la contraseña sea más larga que 8 caracteres --*/
const validatePassword = (req, res, next) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).send({ message: "Por favor, ingrese una contraseña" });
        }

        // Verifica longitud mínima de 8 caracteres
        if (password.length < 8) {
            return res.status(400).send({ message: "La contraseña debe tener 8 o más caracteres" });
        }

        // Verifica que no haya espacios en blanco
        if (/\s/.test(password)) {
            return res.status(400).send({ message: "La contraseña no puede tener espacios en blanco" });
        }

        // // Verifica al menos una letra mayúscula
        // if (!/[A-Z]/.test(password)) {
        //     return res.status(400).send({ message: "La contraseña debe tener al menos una letra mayúscula" });
        // }

        // // Verifica al menos una letra minúscula
        // if (!/[a-z]/.test(password)) {
        //     return res.status(400).send({ message: "La contraseña debe tener al menos una letra minúscula" });
        // }

        // // Verifica al menos un número
        // if (!/[0-9]/.test(password)) {
        //     return res.status(400).send({ message: "La contraseña debe tener al menos un número" });
        // }

        // // Verifica al menos un carácter especial
        // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        //     return res.status(400).send({ message: "La contraseña debe tener al menos un carácter especial" });
        // }

        next();
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};


/*-- Middleware para verificar que el usuario no ingrese un campo en blanco en email y username --*/
const validateUsernameAndEmail = (req, res, next) => {
    try {
        let { username, email } = req.body;

        if (!username) {
            return res.status(400).send({ message: "Debe proporcionar un username" });
        }

        if(/\s/.test(username)) {
            return res.status(400).send ({ message: "El username no puede tener espacios en blanco" });
        }

        if (username.length <= 6) {
            return res.status(400).send({ message: "El nombre de usuario debe tener más de 6 caracteres" });
        }

        if (!email) {
            return res.status(400).send({ message: "Debe proporcionar un correo" });
        }

        if(/\s/.test(email)) {
            return res.status(400).send ({ message: "El correo no puede tener espacios en blanco" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({ message: "Debe proporcionar un correo válido" });
        }

        next();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};



module.exports = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted,
    checkName,
    checkLastName,
    checkBirthDate,
    checkIdentification,
    validatePassword,
    validateUsernameAndEmail
};