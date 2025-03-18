const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Skill name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Skill description is required']
    },
    category: {
        type: String,
        required: [true, 'Skill category is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Skill', skillSchema);