const express = require("express");
const router = express.Router();

const AuthController = require("../Controllers/AuthController");
const authMiddleware = require("../Middlewares/authMiddleware");
const validateRequest = require("../Middlewares/validateRequest");

const {
    registerValidation,
    verifyRegistrationValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    resendOtpValidation,
    updateProfileValidation,
    changePasswordValidation
} = require("../middlewares/authValidation");

// Registration
router.post(
    "/register",
    registerValidation,
    validateRequest,
    AuthController.sendRegistrationOtp
);

router.post(
    "/verify-registration",
    verifyRegistrationValidation,
    validateRequest,
    AuthController.verifyRegistrationOtp
);

// Login
router.post(
    "/login",
    loginValidation,
    validateRequest,
    AuthController.login
);

// Forgot Password
router.post(
    "/forgot-password",
    forgotPasswordValidation,
    validateRequest,
    AuthController.forgotPassword
);

// Reset Password
router.post(
    "/reset-password",
    resetPasswordValidation,
    validateRequest,
    AuthController.resetPassword
);

// Resend OTP
router.post(
    "/resend-otp",
    resendOtpValidation,
    validateRequest,
    AuthController.resendOtp
);

// Refresh Token
router.post(
    "/refresh-token",
    AuthController.refreshAccessToken
);

// Logout
router.post(
    "/logout",
    AuthController.logout
);

// Protected Routes
router.get(
    "/profile",
    authMiddleware,
    AuthController.getProfile
);

router.put(
    "/profile",
    authMiddleware,
    updateProfileValidation,
    validateRequest,
    AuthController.updateProfile
);

router.put(
    "/change-password",
    authMiddleware,
    changePasswordValidation,
    validateRequest,
    AuthController.changePassword
);

module.exports = router;