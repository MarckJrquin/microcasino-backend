const db = require("../models");
const User = db.user;
const Person = db.person;
const Address = db.address;


/* -- Controlador para obtener una Direccion de un usuario -- */
const getUserAddress = async (req, res) => {
    try {
        const userId = req.params.userId || req.body.userId;
        const addressId = req.params.id || req.body.id;

        const address = await Address.findOne({ where: { id: addressId, userId } });

        if (!address) {
            return res.status(404).send({ message: "Dirección no encontrada" });
        }

        res.status(200).send(address);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

/* -- Controlador para obtener las Direcciones de un usuario -- */
const getUserAddresses = async (req, res) => {
    try {
        const userId = req.params.userId || req.body.userId;

        const addresses = await Address.findAll({ where: { userId } });

        if (!addresses) {
            return res.status(404).send({ message: "Direcciones no encontradas" });
        }

        res.status(200).send(addresses);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


/* -- Controlador para registrar una direccion de un usuario -- */
const createUserAddress = async (req, res) => {
    try {
        const userID = req.params.userId || req.body.userId;
        const { country, state, address1, address2, floorApartmentHouseNumber, reference } = req.body;

        if(!country || !state || !address1 || !address2 || !floorApartmentHouseNumber || !reference) {
            return res.status(400).send({ message: "Faltan campos requeridos para registrar la dirección" });
        }

        const address = await Address.create({ country, state, address1, address2, floorApartmentHouseNumber, reference, userID });
        return res.status(201).send(address);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


/* -- Controlador para asignar direccion como favorita -- */
const setFavoriteAddress = async (req, res) => {
    try {
        const userID = req.params.userId || req.body.userId;
        const id = req.params.id || req.body.id;

        console.log(userID, id);

        const address = await Address.findOne({ where: { id, userID } });

        if (!address) {
            return res.status(404).send({ message: "Dirección no encontrada" });
        }

        // Reset all addresses' favorite status for the user
        await Address.update({ isFavorite: false }, { where: { userID } });

        const updated = await Address.update({ isFavorite: true }, { where: { id, userID } });

        if (updated) {
            return res.status(200).send({ message: "Dirección favorita actualizada correctamente" });
        } else {
            return res.status(400).send({ message: "No se pudo actualizar la dirección favorita" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

}


/* -- Controlador para Editar una direccion de un usuario -- */
const updateUserAddress = async (req, res) => {
    try {
        const userID = req.params.userId || req.body.userId;
        const id = req.params.id || req.body.id;
        const { country, state, address1, address2, floorApartmentHouseNumber, reference } = req.body;

        let updateFields = {};
        if (country !== undefined || country != "") updateFields.country = country;
        if (state !== undefined || state != "") updateFields.state = state;
        if (address1 !== undefined || address1 != "") updateFields.address1 = address1;
        if (address2 !== undefined || address2 != "") updateFields.address2 = address2;
        if (floorApartmentHouseNumber !== undefined || floorApartmentHouseNumber != "") updateFields.floorApartmentHouseNumber = floorApartmentHouseNumber;
        if (reference !== undefined || reference !== "" ) updateFields.reference = reference;

        const [updated] = await Address.update(updateFields, { where: { id, userID } });

        if (updated) {
            return res.status(200).send({ message: "Dirección actualizada correctamente" });
        } else {
            return res.status(400).send({ message: "No se pudo actualizar la dirección"});
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


/* -- Controlador para Eliminar una direccion de un usuario -- */
const deleteUserAddress = async (req, res) => {
    try {
        const userID = req.params.userId || req.body.userId;
        const addressId = req.params.id || req.body.id;

        const deleted = await Address.destroy({ where: { id: addressId, userID } });

        if (deleted) {
            return res.status(200).send({ message: "Dirección eliminada correctamente" });
        } else {
            return res.status(400).send({ message: "No se pudo eliminar la dirección" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

  
module.exports = {
    getUserAddress,
    getUserAddresses,
    createUserAddress,
    setFavoriteAddress,
    updateUserAddress,
    deleteUserAddress
}