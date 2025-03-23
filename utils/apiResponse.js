// utils/apiResponse.js
const apiResponse = {
    success: (res, status, message, data) => {
        return res.status(status).json({
            success: true,
            message,
            data
        });
    },
    error: (res, status, message) => {
        return res.status(status).json({
            success: false,
            message
        });
    }
};

module.exports = apiResponse;
