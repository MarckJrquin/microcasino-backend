const bcrypt = require("bcryptjs"); 

const db = require("../models");
const User = db.user;


const checkUserExists = async (req, res, next) => {
  const userId = req.userId;

  try {
    // Verificar si el usuario existe en la base de datos por ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }

}


const checkDuplicateUser = async (req, res, next) => {
  const userId = req.userId;
  const { username } = req.body;
  
  if (!username) {
    return next();
  }

  try {
    // Verificar si el usuario existe en la base de datos por ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    // Verificar si el nombre de usuario ya están en uso, excluyendo al usuario actual
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ where: { username, id: { [db.Sequelize.Op.ne]: userId } } });
      if (usernameExists) {
        return res.status(400).send({ message: "El username no se encuentra disponible" });
      }
    }

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


const checkDuplicateEmail = async (req, res, next) => {
  const userId = req.userId;
  const { email } = req.body;

  if (!email) {
    return next();
  }

  try {
    // Verificar si el correo existe en la base de datos por ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    // Verificar si el correo de usuario ya están en uso, excluyendo al usuario actual
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email, id: { [db.Sequelize.Op.ne]: userId } } });
      if (emailExists) {
        return res.status(400).send({ message: "El correo ya está en uso" });
      }
    }

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


const validateProfileUpdate = async (req, res, next) => {
  const { username, email, name, lastName, identification, birthDate, password } = req.body;

  if(username && !isValidText(username)) {
    return res.status(400).send({ message: "El username no debe contener números ni espacios en blanco" });
  }

  if (username && username.length < 6 ) {
    return res.status(400).send({ message: "El username debe tener al menos 6 caracteres" });
  }

  if (email && /\s/.test(email)) {
    return res.status(400).send({ message: "El correo no debe contener espacios en blanco" });
  }

  if (email && !isValidEmail(email)) {
    return res.status(400).send({ message: "Formato de email inválido" });
  }

  if (birthDate && /\s/.test(birthDate)) {
    return res.status(400).send({ message: "La fecha de nacimiento no debe contener espacios en blanco" });
  }

  if (birthDate && !isValidBirthDate(birthDate)) {
    return res.status(400).send({ message: "Debe ser mayor o igual a 18 años" });
  }

  if (name && !isValidText(name)) {
    return res.status(400).send({ message: "El nombre no debe contener números ni espacios en blanco" });
  }

  if (lastName && !isValidText(lastName)) {
    return res.status(400).send({ message: "El apellido no debe contener números ni espacios en blanco" });
  }

  if(identification && /\s/.test(identification)) {
    return res.status(400).send({ message: "La cédula no debe contener espacios en blanco" });
  }

  if (password) {
    return res.status(400).send({ message: "No se puede actualizar la contraseña desde este endpoint" });
  }

  next();
};


const checkChangePassword = async (req, res, next) => {
  try {
    const userId = req.userId;
    const password = req.body.password;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).send({ message: "La contraseña anterior no es correcta" });
    }

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


const validateNewPassword = (req, res, next) => {
  try {
    const { newPassword } = req.body;

    console.log("New password", newPassword);

    if (!newPassword) {
      return res.status(400).send({ message: "Ingrese su nueva contraseña" });
    }

    //Verifica la longitud de la contraseña
    if (newPassword.length < 8) {
      return res.status(400).send({ message: "La nueva contraseña debe tener 8 o más caracteres" });
    }

    //Verifica si la contraseña tiene espacios en blanco
    if (/\s/.test(newPassword)) {
      return res.status(400).send({ message: "La nueva contraseña no puede tener espacios en blanco" });
    }

    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};


const isValidEmail = (email) => {
  // Valida el formato de email
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};


const isValidBirthDate = (birthDate) => {
  // Valida si es mayor o igual a 18 años
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  if (today.getMonth() < birthDateObj.getMonth() || (today.getMonth() === birthDateObj.getMonth() && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  return age >= 18;
};


const isValidText = (name) => {
  // Valida que no contenga números ni espacios en blanco
  return /^[a-zA-Z]+$/.test(name);
};


const verifyUserProfile = {
  checkUserExists,
  checkDuplicateUser,
  checkDuplicateEmail,
  validateProfileUpdate,
  checkChangePassword,
  validateNewPassword,
};


module.exports = verifyUserProfile;




// const verifyProfileUpdate = (req, res, next) => {
//   try {
//     // let { username, email, name, lastName, birthDate, identification, profile_picture, password } = req.body;
    
//     // // Verificar si todos los campos están vacíos
//     // const areAllFieldsEmpty = !username && !email && !name && !lastName && !birthDate && !identification && !profile_picture;
//     // if (areAllFieldsEmpty) {
//     //   return res.status(400).send({ message: "Debes proporcionar al menos un campo para actualizar" });
//     // }
  
//     // // Verificar que los campos no estén vacíos
//     // const fieldMessages = [];

//     // // Verificando que el username cumpla todos los requisitos para registrarlo a nuestra base de datos
//     // if (username !== undefined) {
//     //   if (username?.trim() === "") {
//     //     fieldMessages.push("El campo username no puede estar vacío");
//     //   } else if (/\s/.test(username)) {
//     //     fieldMessages.push("El campo username no puede llevar espacios en blanco");
//     //   } else if (username.length <= 6) {
//     //     fieldMessages.push("El username debe tener más de 6 caracteres");
//     //   }
//     // }

//     // // Verificando que el name cumpla todos los requisitos para registrarlo a nuestra base de datos
//     // if (name !== undefined) {
//     //   if (name?.trim() === "") {
//     //     fieldMessages.push("El campo 'nombre' no puede estar vacío");
//     //   } else if (/\s/.test(name)) {
//     //     fieldMessages.push("El campo 'nombre' no puede llevar espacios en blanco");
//     //   } else if (/\d/.test(name)) {
//     //     fieldMessages.push("El campo 'nombre' no pueda llevar números");
//     //   } else if (/[^\w\s]/.test(name)) {
//     //     fieldMessages.push("El campo 'nombre' no puede llevar caracteres especiales");
//     //   }
//     // }

//     // // Verificando que el lastName cumpla todos los requisitos para registrarlo a nuestra base de datos
//     // if (lastName !== undefined) {
//     //   if (lastName?.trim() === "") {
//     //     fieldMessages.push("El campo 'apellido' no puede estar vacío");
//     //   } else if (/\s/.test(lastName)) {
//     //     fieldMessages.push("El campo 'apellido' no puede llevar espacios en blanco");
//     //   } else if (/\d/.test(lastName)) {
//     //     fieldMessages.push("El campo 'apellido' no pueda llevar números");
//     //   } else if (/[^\w\s]/.test(lastName)) {
//     //     fieldMessages.push("El campo 'nombre' no puede llevar caracteres especiales");
//     //   }
//     // }

//     // // Verificando que el birthDate cumpla todos los requisitos para registrarlo a nuestra base de datos
//     // if (birthDate !== undefined) {
//     //   if (birthDate?.trim() === "") {
//     //     fieldMessages.push("El campo 'fecha de nacimiento' no puede estar vacío");
//     //   } else if (/\s/.test(birthDate)) {
//     //     fieldMessages.push("El campo 'fecha de nacimiento' no puede llevar espacios en blanco");
//     //   }
//     // }

//     // // Verificando que el profile_picture cumpla todo lo que debería cumplir para entrar a nuestra base de datos
//     // if (profile_picture !== undefined) {
//     //   if (profile_picture?.trim() === "") {
//     //     fieldMessages.push("El campo 'foto de perfil' no puede estar vacío");
//     //   } else if (/\s/.test(profile_picture)) {
//     //     fieldMessages.push("El campo 'foto de perfil' no puede llevar espacios en blanco");
//     //   }
//     // }

//     // // Verificando que el email cumpla todo lo que debería cumplir para entrar a nuestra base de datos
//     // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     // if (email !== undefined) {
//     //   if (email?.trim() === "") {
//     //     fieldMessages.push("El campo 'correo' no puede estar vacío");
//     //   } else if (/\s/.test(email)) {
//     //     fieldMessages.push("El campo 'correo' no puede llevar espacios en blanco");
//     //   } else if (!emailRegex.test(email)) {
//     //     fieldMessages.push("Debe proporcionar un correo válido");
//     //   }
//     // }

//     // // Verificando que identification (cedula) cumpla todos los requisitos para registrarlo a nuestra base de datos
//     // if (identification !== undefined) {
//     //   if (identification?.trim() === "") {
//     //     fieldMessages.push("El campo cédula no puede estar vacío");
//     //   } else if (/\s/.test(username)) {
//     //     fieldMessages.push("El campo cédula no puede llevar espacios en blanco");
//     //   }
//     // }

//     // if (fieldMessages.length > 0) {
//     //   return res.status(400).send({ message: fieldMessages });
//     // }

//     // // Verificar si se incluye el campo "password" y devolver un mensaje de error
//     // if (password !== undefined) {
//     //   return res.status(400).send({message:"Por motivos de seguridad no puede actualizar la contraseña desde aquí!",});
//     // }

//     // next();


//     const { username, email, name, lastName, birthDate, identification, profile_picture, password } = req.body;

//   // Verificar si todos los campos están vacíos
//   const areAllFieldsEmpty = !username && !name && !lastName && !birthDate && !profile_picture && !email;
//   if (areAllFieldsEmpty) {
//     return res.status(400).send({ message: "Debes proporcionar al menos un campo para actualizar" });
//   }

//   // Funciones de validación
//   const validateField = (field, validations) => {
//     for (let validation of validations) {
//       const errorMessage = validation(field);
//       if (errorMessage) {
//         return errorMessage;
//       }
//     }
//     return null;
//   };

//   const nonEmpty = field => field?.trim() === "" ? "no puede estar vacío" : null;
//   const noSpaces = field => /\s/.test(field) ? "no puede llevar espacios en blanco" : null;
//   const minLength = (field, length) => field.length <= length ? `debe tener más de ${length} caracteres` : null;
//   const noNumbers = field => /\d/.test(field) ? "no puede llevar números" : null;
//   const noSpecialChars = field => /[^\w\s]/.test(field) ? "no puede llevar caracteres especiales" : null;
//   const validEmail = field => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field) ? "Debe proporcionar un correo válido" : null;

//   const validateBirthDate = field => {
//     const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//     if (!dateRegex.test(field)) {
//       return "El formato de fecha de nacimiento debe ser yyyy-mm-dd";
//     }

//     const birthDateObj = new Date(field);
//     const currentDate = new Date();
//     let age = currentDate.getFullYear() - birthDateObj.getFullYear();
//     const monthDifference = currentDate.getMonth() - birthDateObj.getMonth();

//     if (
//       monthDifference < 0 ||
//       (monthDifference === 0 && currentDate.getDate() < birthDateObj.getDate())
//     ) {
//       age--;
//     }

//     return age < 18 ? "Debe ser mayor de 18 años" : null;
//   };

//   // Validaciones específicas por campo
//   const validations = {
//     username: [noSpaces, field => minLength(field, 6)],
//     name: [noSpaces, noNumbers, noSpecialChars],
//     lastName: [noSpaces, noNumbers, noSpecialChars],
//     birthDate: [validateBirthDate],
//     profile_picture: [noSpaces],
//     email: [noSpaces, validEmail],
//     identification: [noSpaces]
//   };

//   // Recopilar mensajes de error
//   const fieldMessages = Object.keys(validations)
//     .map(key => validateField(req.body[key], validations[key]))
//     .filter(message => message !== null)
//     .map((message, index) => `El campo '${Object.keys(validations)[index]}' ${message}`);

//   // Devolver mensajes de error si existen
//   if (fieldMessages.length > 0) {
//     return res.status(400).send({ message: fieldMessages });
//   }

//   // Verificar si se incluye el campo "password" y devolver un mensaje de error
//   if (password !== undefined) {
//     return res.status(400).send({ message: "Por motivos de seguridad no puede actualizar la contraseña desde aquí!" });
//   }

//   next();
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };
