const db = require("../models");
const BannerAdd = db.BannerAdd;

/* -- Controlador para verificar si un anuncio existe -- */
const checkIfBannerExists = async (req, res, next) => {
    try {
        const bannerAddID = await BannerAdd.findByPk(req.params.id);

        const bannerAdd = await BannerAdd.findByPk(bannerAddID);
        if (!bannerAdd) {
            return res.status(404).send({ message: "Anuncio no encontrado" });
        }
        next();
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }

}

const bannerAddMiddleware = {
    checkIfBannerExists
};
  

module.exports = bannerAddMiddleware;