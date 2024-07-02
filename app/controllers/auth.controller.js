const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
const { sendConfirmationEmail } = require("../helpers/mailer");

const db = require("../models");
const User = db.user;
const Role = db.role;
const Person = db.person; 
const UserCredit = db.userCredit;
const Op = db.Sequelize.Op;


/* -- Controlador para iniciar sesión de un usuario -- */ 
const signin = async (req, res) => {
    try {
        const { username, password } = req.body; 

        const user = await User.findOne({
            where: {
                username: username,
            },
        });
  
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        if (!user.confirmed) {
            return res.status(401).send({ message: "El registro de usuario no ha sido confirmado. Por favor, revisa tu correo electrónico para confirmar tu registro." });
        }
  
        const passwordIsValid = bcrypt.compareSync(password, user.password);      
        if (!passwordIsValid) {
            return res.status(401).send({
                message: "Contraseña Incorrecta!",
            });
        }
  
        const token = jwt.sign(
            { 
                id: user.id 
            },
            config.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400, // Caducidad del token: 24 horas
            }
        );
  
        let authorities = [];
        const roles = await user.getRoles();  // Obtiene los roles asociados al usuario
        for (let i = 0; i < roles.length; i++) {
            authorities.push(roles[i].name);
        }
  
        req.session.token = token;  // Almacena el token en la sesión del usuario
  
        return res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            status: 'success',
            accessToken: token
        });
    } catch (error) {
        return res.status(500).send({ 
            message: error.message 
        });
    }
};


/* -- Controlador para registrar un nuevo usuario -- */
const signup = async (req, res) => {
    try {   
        let { username, email, password, name, lastName, identification, birthDate, roles} = req.body; 

        if (!username || !email || !password || !name || !lastName || !identification || !birthDate) {
            return res.status(400).send({ message: "Todos los campos son obligatorios." });
        }

        name = name.trim();
        lastName = lastName.trim();
        identification = identification.trim();
        
        const user = await User.create({
            username,
            email,
            password: bcrypt.hashSync(password, 8),  
        });
  
        if (roles) {
            /* -- Si se proporcionan roles en la solicitud, busca los roles correspondientes en la base de datos -- */
            const foundRoles = await Role.findAll({
                where: { 
                    name: {
                        [Op.or]: roles,
                    },
                },
            });
        
            /* -- Asigna los roles al usuario -- */
            await user.setRoles(foundRoles); 
        } else {
            /* -- Si no se proporcionan roles en la solicitud, asigna el rol de usuario por defecto (ID = 1) -- */
            await user.setRoles([1]);
        }
  
        const person = await Person.create({
            name,
            lastName,
            identification,
            birthDate,
        });

        /*-- Asocia la información personal al usuario --*/
        await user.setPerson(person);


        /* -- Crea el registro de balance de usuario en UserCredit -- */
        await UserCredit.create({
            userID: user.id,
            balance: 0.00  // Balance inicial
        });

        // Generar un token de confirmación
        const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: '2h' });

        // Enviar correo de confirmación
        sendConfirmationEmail(user.email, token);
  
        res.status(201).send({ 
            message: 'Usuario registrado con éxito! Por favor revisa tu correo electrónico para confirmar tu registro.' 
        });
    } catch (error) {
        res.status(500).send({ 
            message: error.message 
        });
    }
};
  

/* -- Controlador para cerrar sesión de un usuario -- */
const signout = async (req, res) => {
    try {
        req.session = null;
        return res.status(200).send({
            message: "Sesión cerrada con éxito."
        });
    } catch (err) {
        return res.status(500).send({
            message: err.message
        });
    }
};
  
  
/* -- Controlador para recuperar contrasena de un usuario -- */
const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username,
            },
        });

        if (!user) {
            return res.status(404).send({ 
                message: "Usuario no encontrado." 
            });
        }
      
        const hashedPassword = bcrypt.hashSync(req.body.password,8);
  
        //Actualiza la contraseña del usuario con la nueva contraseña cifrada
        user.password = hashedPassword;
        await user.save();
        
        return res.status(200).send({
            message: "Contraseña restablecida con éxito",
        });   
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};


/* -- Controlador para confirmar el registro de un usuario -- */
const confirmRegistration = async (req, res) => {
    try {
        const token = req.params.token;

        if (!token) {
            return res.status(400).send({ message: "Token no proporcionado." });
        }
        
        const decoded = jwt.verify(token, config.secret);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }
        user.confirmed = true;
        await user.save();
        return res.status(200).send({ message: "Usuario confirmado con éxito, ya puedes iniciar sesión en Casino" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


/* -- Controlador verificar y eliminar usuarios que no confirmaron su registro -- */
const checkUnconfirmedUsers = async (req, res) => {
    try {
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000); // Fecha hace 2 horas
        const unconfirmedUsers = await User.findAll({
            where: {
                confirmed: false,
                createdAt: {
                    [Op.lt]: twoHoursAgo
                }
            }
        });

        // Eliminar los usuarios no confirmados hace más de 2 horas
        for (const user of unconfirmedUsers) {
            await user.destroy();
        }

        console.log(`${unconfirmedUsers.length} usuarios no confirmados eliminados.`);
    } catch (error) {
        console.error("Error al verificar y eliminar usuarios no confirmados:", error);
    }
};
  

module.exports = {
    signin,
    signup,
    signout,
    forgotPassword,
    confirmRegistration,
    checkUnconfirmedUsers
};
