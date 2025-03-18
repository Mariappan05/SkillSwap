const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false  // Password will not be returned in queries
    },
    role: {
        type: String,
        enum: ['student', 'professor', 'admin'],
        default: null
    },
    skills: {
        type: [{
            name: {
                type: String,
                required: true
            },
            proficiency: {
                type: String,
                enum: ['beginner', 'intermediate', 'advanced', 'expert'],
                required: function() { return this.parent().role === 'professor'; }
            },
            yearsOfExperience: {
                type: Number,
                required: function() { return this.parent().role === 'professor'; }
            }
        }],
        default: []
    },
    // Student specific fields
    studentDetails: {
        collegeName: String,
        degree: String,
        department: String,
        year: Number,
        passoutYear: Number,
        collegeLocation: String
    },
    // Professor specific fields
    professorDetails: {
        experience: Number,
        currentRole: String,
        institutionName: String,
        institutionLocation: String,
        idProof: String
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    contact: {
        phone: String,
        alternateEmail: String
    },
    profileCompleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
    // Only hash password if it's modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Password comparison method
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);