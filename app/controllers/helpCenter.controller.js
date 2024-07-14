const db = require("../models");
const HelpCenter = db.helpCenter;

const createRequest = async (req, res) => {
    try {
        const { name, lastname, email, message } = req.body;

        if (!name || !lastname || !email || !message) {
            return res.status(400).json({ error: 'Todos los campos son requeridos.' });
        }

        const newRequest = await HelpCenter.create({ name, lastname, email, message });
        res.status(201).json({ message: 'Mensaje enviado correctamente', request: newRequest });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la solicitud.' });
    }
};

const getRequests = async (req, res) => {
    try {
        const requests = await HelpCenter.findAll();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las solicitudes.' });
    }
};


const getRequest = async (req, res) => {
    try {
        const { id } = req.params || req.body;
        const request = await HelpCenter.findByPk(id);
        if (!request) {
            return res.status(404).json({ error: 'Solicitud no encontrada.' });
        }
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la solicitud.' });
    }
}


const updateRequest = async (req, res) => {
    try {
        const { id } = req.params || req.body;
        const { status, solution } = req.body;
        const request = await HelpCenter.findByPk(id);
        if (!request) {
            return res.status(404).json({ error: 'Solicitud no encontrada.' });
        }
        request.status = status || request.status;
        request.solution = solution || request.solution;
        await request.save();
        res.status(200).json({ message: 'Solicitud actualizada correctamente', request });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la solicitud.' });
    }
};

const deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await HelpCenter.findByPk(id);
        if (!request) {
            return res.status(404).json({ error: 'Solicitud no encontrada.' });
        }
        await request.destroy();
        res.status(204).json({ message: 'Solicitud eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la solicitud.' });
    }
}


// Utilidad para filtrar campos válidos
const filterValidFields = (fields) => {
    return Object.fromEntries(
        Object.entries(fields).filter(
            ([, value]) => value !== "" && value !== null && value !== undefined
        )
    );
};


module.exports = {
    createRequest,
    getRequests,
    getRequest,
    updateRequest,
    deleteRequest
};