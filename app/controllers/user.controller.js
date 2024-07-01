const bcrypt = require ('bcryptjs');  

const db = require("../models");
const User = db.user;
const Person = db.person;
const Address = db.address;


/* -- Controlador para obtener perfil de un usuario -- */
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
  
        const user = await User.findByPk(userId, {
            include: [{
                model: Person,
                attributes: ['name', 'lastName', 'identification', 'birthDate', 'profile_picture']
            },
            {
                model: Address,
                as: 'addresses' // Alias, Include the addresses
            }]
        });
  
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }
  
        const roles = await user.getRoles();
  
        const userProfile = {
            userId: user.id,
            username: user.username,
            email: user.email,
            roles: roles.map((role) => role.name),
            ...user.person.dataValues,
            addresses: user.addresses // Incluimos las direcciones aquí
        };
  
        res.status(200).send(userProfile);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


/* -- Controlador para obtener foto de perfil de un usuario --*/
const getPhotoProfile = async (req, res) => {
    try {
        const userId = req.userId;
  
        const user = await User.findByPk(userId, {
            include: {
                model: Person,
                attributes: ['profile_picture']
            },
        });

        // Revisa si el usuario existe
        if (!user) {
          return res.status(404).send({ message: "Usuario no encontrado"});
        }

        // Manda el response en un formato más limpio
        const userPhotoProfile = { ...user.person.dataValues };

        res.status(200).send(userPhotoProfile)
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


/*-- Controlador para actualizar los datos del perfil de un usuario --*/
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const fieldsToUpdate = filterValidFields(req.body);

        const user = await User.findByPk(userId, {
            include: {
                model: Person,
            },
        });

        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }

        // Actualiza los campos del modelo User
        Object.assign(user, fieldsToUpdate);

        // Si hay campos para Person, actualiza también
        if (user.person) {
            const personFieldsToUpdate = filterValidFields(req.body);
            Object.assign(user.person, personFieldsToUpdate);
            await user.person.save();
        }

        await user.save();

        res.status(200).send({ message: "Perfil actualizado exitosamente" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// Controlador para cambiar contraseña de una persona por su ID
const changePass = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }
  
        const hashedPassword = bcrypt.hashSync(req.body.newPassword, 8);
  
        user.password = hashedPassword;
        await user.save();
  
        return res.status(200).send({ message: "Contraseña restablecida con éxito"});
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
 

const allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};
  

const userBoard = (req, res) => {
    res.status(200).send("User Content.");
};
 

const adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};
 

const moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};
  

// Utilidad para filtrar campos válidos
const filterValidFields = (fields) => {
    return Object.fromEntries(
        Object.entries(fields).filter(
            ([, value]) => value !== "" && value !== null && value !== undefined
        )
    );
};


module.exports = {
    getProfile,
    getPhotoProfile,
    updateProfile,
    changePass,
    allAccess,
    userBoard,
    adminBoard,
    moderatorBoard
};

