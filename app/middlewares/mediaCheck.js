const { ExhibitImage } = require("../models");
/*-- Middleware para verificar el contenido mandado en el file--*/

const imageValidator = async (req, res, next) => {
    try {
        // Revisa si en el body de la petición viene el archivo
        if (!req.file){
            return res.status(400).send({ message: "No se ha proporcionado ningún archivo" });
        }

        const allowedFormats = ['image/jpg','image/jpeg','image/png'];

        if (!allowedFormats.includes(req.file.mimetype)){
            return res.status(400).send({message: "El archivo debe ser una imagen"});
        }

        // Si pasa la validación pasa al siguiente
        next();
    } catch (error) {
        return res.status(500).send({ message: "Error en el servidor" });
    }
};

const mediaValidator = async (req, res, next) => {
  try {
    // Definiendo los tipos de archivos que podemos contener en cada media enviado
    const allowedFormats = {
      images: ['image/jpg', 'image/jpeg', 'image/png'],
      audio: ['audio/mpeg', 'audio/mp3', 'audio/wav'],
      gifImage: ['image/gif'],
      video: ['video/mp4']
    };

    // Verificar si algún tipo tiene un formato inválido
    const invalidMediaTypes = Object.keys(allowedFormats).filter(mediaType => {
      return req.files && req.files[mediaType] && req.files[mediaType].length > 0 &&
        !allowedFormats[mediaType].includes(req.files[mediaType][0].mimetype);
    });

   

    // Si hay tipos de medios con formatos inválidos, enviar mensajes de error personalizados
    if (invalidMediaTypes.length > 0) {
      const invalidMediaMessages = invalidMediaTypes.map(mediaType => `El archivo ${mediaType} debe ser tipo ${allowedFormats[mediaType].join(', ')}`).join(', ');
      return res.status(400).send({ message: invalidMediaMessages });
    }

    next();
  } catch (error) {
    return res.status(500).send({ message: "Error en el servidor" });
  }
};

const checkFileCounts = async (req, res, next) => {
  try {
    const requiredCounts = {
      images: 2,
      audio: 1,
      gifImage: 1,
      video: 1
    };

    const missingMediaTypes = [];
    const invalidCountMediaTypes = [];

    // Verificar si falta algún tipo de medio
    for (const mediaType in requiredCounts) {
      // Verificar si hay archivos para este tipo de medio en la solicitud
      if (req.files && req.files[mediaType] && req.files[mediaType].length > 0) {
        // Verificar el número de archivos cargados para cada tipo de medio
        if (req.files[mediaType].length < requiredCounts[mediaType]) {
          invalidCountMediaTypes.push(mediaType);
        }
      } else {
        // Antes aquí tenía un error pero ya no puke shon opcionales trite :c
      }
    }

    // Si hay tipos de medios con número inválido de archivos, enviar mensajes de error personalizados
    if (invalidCountMediaTypes.length > 0) {
      const invalidCountMediaMessages = invalidCountMediaTypes.map(mediaType => `Se esperaban ${requiredCounts[mediaType]} archivo(s) para ${mediaType}`).join(', ');
      return res.status(404).send({ message: invalidCountMediaMessages });
    }

    next();
  } catch (error) {
    return res.status(500).send({ message: "Error en el servidor" });
  }
};


const mediaCheck = {
    imageValidator,
    mediaValidator,
    checkFileCounts,
    
  };
  
  
  /* -- Exporta el objeto mediaCheck como un módulo -- */
  module.exports = mediaCheck;

