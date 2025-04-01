// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     // farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     quantity: { type: Number, required: true },
//     // createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Product', productSchema);


const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true }, // Store image filename or path
    // farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true }
});

module.exports = mongoose.model("Product", ProductSchema);
