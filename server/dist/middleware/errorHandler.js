"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const globalErrorHandler = (err, req, res, next) => {
    console.error("ERROR 💥", err);
    // Known operational error
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
        });
    }
    // Unknown error
    return res.status(500).json({
        success: false,
        status: "error",
        message: "Something went wrong",
    });
};
exports.globalErrorHandler = globalErrorHandler;
