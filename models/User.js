const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    email: {
        type: String,   
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['student', 'professor'],
        required: [true, 'Please specify user role']
    },
    age: {
        type: Number,
        min: 18
    },
    profileCompleted: {
        type: Boolean,
        default: false
    },
    professorDetails: {
        experience: String,
        currentRole: String,
        institutionName: String,
        institutionLocation: String,
        idProof: String
    },
    skills: [{
        name: {
            type: String,
            required: true
        },
        proficiency: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            required: function() {
                return this.role === 'professor';
            }
        },
        yearsOfExperience: {
            type: Number,
            required: function() {
                return this.role === 'professor';
            }
        }
    }],
    contact: {
        phone: String,
        alternateEmail: String
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);