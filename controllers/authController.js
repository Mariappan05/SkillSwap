const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authController = {
    register: async (req, res) => {
        try {
            
            const { email, password, fullName } = req.body;

      
            console.log('Registration Request:', { email, fullName });

         
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log('User already exists:', email);
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }

         
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('Password hashed successfully');

            
            const user = await User.create({
                email,
                password: hashedPassword,
                fullName
            });
            console.log('User created:', user);

           
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

       
            console.log('Generated Token:', token);

       
            res.status(201).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName
                }
            });
        } catch (error) {
          
            console.error('Registration Error:', {
                message: error.message,
                stack: error.stack
            });

            res.status(500).json({
                success: false,
                message: 'Registration failed',
                error: error.message
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
    
            
            console.log('Login Attempt:', { email });
    
          
            const user = await User.findOne({ email }).select('+password');
    
            if (!user) {
                console.log('User not found:', email);
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                console.log('Invalid password for:', email);
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
    
         
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
    
         
            console.log('Login Token Generated:', token);
    
            res.status(200).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName
                }
            });
        } catch (error) {
            console.error('Login Error:', {
                message: error.message,
                stack: error.stack
            });
    
            res.status(500).json({
                success: false,
                message: 'Login failed',
                error: error.message
            });
        }
    }
    
};

module.exports = authController;

