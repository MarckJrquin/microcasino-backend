const db = require("../models");
const Product = db.product;


const getProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByPk(id);

        if(product){
            return res.status(200).send(product);
        }

        return res.status(404).send({message: "Product not found"});
    }
    catch(error){
        res.status(500).send({message: error.message});
    }
}

const getAllProducts = async (req, res) => {
    try {
        console.log("asdasdasdas");
        const products = await Product.findAll();
        return res.status(200).send(products);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const product = await Product.create({ name, price, description });
        return res.status(201).send(product);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, price, description } = req.body;
        const product = await Product.update({ name, price, description }, { where: { id } });
        return res.status(200).send(product);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        await Product.destroy({ where: { id } });
        return res.status(200).send({message: "Product deleted successfully"});
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

module.exports = {
    getProduct,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct
};
