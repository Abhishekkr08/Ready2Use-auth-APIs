const mongoose = require('mongoose');

const Schema = new mongoose.Schema({

    image: {
        data: Buffer,
        contentType: String
    }
})


const imageSchema = new mongoose.model('Image', Schema);
module.exports = imageSchema;


