const validator = {
    validateEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    validatePassword: (password) => {
        return password.length >= 6;
    },

    sanitizeUser: (user) => {
        const { password, ...sanitizedUser } = user.toObject();
        return sanitizedUser;
    }
};

module.exports = validator;
