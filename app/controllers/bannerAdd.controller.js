const db = require("../models");
const BannerAdd = db.BannerAdd;


/* -- Controlador para obtener un solo anuncio -- */
const getBannerAdd = async (req, res) => {
    const id = req.params.id || req.body.id;

    try {
        const bannerAdd = await BannerAdd.findByPk(id);

        if (!bannerAdd) {
            return res.status(404).send({ message: `Banner with id ${id} not found` });
        }

        res.send(bannerAdd);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

}


/* -- Controlador para obtener todos los anuncios -- */
const getAllBannerAdds = async (req, res) => {
    try {
        const bannerAdds = await BannerAdd.findAll();

        if (!bannerAdds) {
            return res.status(404).send({ message: `No banners Add found` });
        }

        res.send(bannerAdds);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


/* -- Controlador para obtener anuncios por tipo -- */
const getBannerAddsByType = async (req, res) => {
    const type = req.params.type || req.body.type;

    try {
        const bannerAdds = await BannerAdd.findAll({
            where: {
                type: type
            }
        });

        if (!bannerAdds) {
            return res.status(404).send({ message: `No banners Add found` });
        }

        res.send(bannerAdds);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

}


/* -- Controlador para obtener todos los anuncios activos -- */
const getActiveBannerAdds = async (req, res) => {
    try {
        const bannerAdds = await BannerAdd.findAll({
            where: {
                status: true
            }
        });

        if (!bannerAdds) {
            return res.status(404).send({ message: `No active banners Add found` });
        }

        res.send(bannerAdds);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


/* -- Controlador para obtener todos los anuncios inactivos -- */
const getInactiveBannerAdds = async (req, res) => {
    try {
        const bannerAdds = await BannerAdd.findAll({
            where: {
                status: false
            }
        });

        if (!bannerAdds) {
            return res.status(404).send({ message: `No inactive banners Add found` });
        }

        res.send(bannerAdds);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


/* -- Controlador para crear un anuncio -- */
const createBannerAdd = async (req, res) => {
    try {
        const banner = {
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            iconUrl: req.body.iconUrl,
            imageUrl: req.body.imageUrl,
            linkUrl: req.body.linkUrl,
            isActive: req.body.isActive
        };

        if(!banner.title || !banner.type) {
            return res.status(400).send({ message: "Title and type are required" });
        }

        const newBanner = await Banner.create(banner);

        res.send(newBanner);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


/* -- Controlador para actualizar un anuncio -- */
const updateBannerAdd = async (req, res) => {
    const id = req.params.id || req.body.id;

    try {
        const banner = await Banner.findByPk(id);

        if (!banner) {
            return res.status(404).send({ message: `Banner with id ${id} not found` });
        }

        const fieldsToUpdate = filterValidFields(req.body);

        const [updated] = await db.BannerAdd.update(fieldsToUpdate, {where: { id }});

        if (updated) {
            return res.status(200).send({ message: `Banner with id ${id} updated successfully`});
        } else {
            return res.status(400).send({ message: `Cannot update Banner with id ${id}`});
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


/* -- Controlador para eliminar un anuncio -- */
const deleteBannerAdd = async (req, res) => {
    const id = req.params.id || req.body.id;

    try {
        const banner = await Banner.findByPk(id);

        if (!banner) {
            return res.status(404).send({ message: `Banner with id ${id} not found` });
        }

        await banner.destroy();

        res.send({ message: `Banner with id ${id} deleted successfully` });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


const filterValidFields = (fields) => {
    return Object.fromEntries(
        Object.entries(fields).filter(
            ([, value]) => value !== "" && value !== null && value !== undefined
        )
    );
};


module.exports = {
    getBannerAdd,
    getAllBannerAdds,
    getBannerAddsByType,
    getActiveBannerAdds,
    getInactiveBannerAdds,
    createBannerAdd,
    updateBannerAdd,
    deleteBannerAdd
};






