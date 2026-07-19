const UserRepository = require("../Repositories/UserRepository");
const RefreshTokenRepository = require("../Repositories/RefreshTokenRepository");

const { hashPassword, comparePassword } = require("../Utils/password");

const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require("../Utils/jwt");
const otpRepository = require("../Repositories/OtpRepository");
const { generateOtp, generateExpiryTime } = require("../Utils/otp");
const mail = require("../Utils/mail");
class AuthService {
   async sendRegistrationOtp(userData) {
    const { email } = userData;

    // Check if email already exists
    const existingUser = await UserRepository.findUserByEmail(email);

    if (existingUser) {
        throw new Error("Email already registered");
    }

    // Generate OTP
    const otp = generateOtp();
    const expiresAt = generateExpiryTime();

    // Delete previous registration OTP (if any)
    await otpRepository.deleteOtp(email, "register");

    // Save new OTP
    await otpRepository.saveOtp(
        email,
        otp,
        "register",
        expiresAt
    );

    // Send OTP email
    await mail.sendRegistrationOtp(email, otp);

    return {
        message: "OTP sent successfully"
    };
}
async verifyRegistrationOtp(userData) {
    const { name, email, password, role, profile_image, otp } = userData;

    // Check OTP
    const otpRecord = await otpRepository.findOtp(
        email,
        otp,
        "register"
    );

    if (!otpRecord) {
        throw new Error("Invalid OTP");
    }

    // Check expiry
    if (new Date() > new Date(otpRecord.expires_at)) {
        await otpRepository.deleteOtp(email, "register");
        throw new Error("OTP has expired");
    }

    // Double-check email
    const existingUser = await UserRepository.findUserByEmail(email);

    if (existingUser) {
        throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userId = await UserRepository.createUser({
        name,
        email,
        password: hashedPassword,
        role,
        profile_image
    });

    // Delete OTP
    await otpRepository.deleteOtp(email, "register");

    return {
        id: userId,
        name,
        email,
        role,
        profile_image
    };
}
    async login(email, password) {
        const user= await UserRepository.findUserByEmail(email);
        if(!user){
            throw new Error("User does not exist");
        
        }
 const isPasswordValid=await comparePassword(password, user.password);
 if(!isPasswordValid){
    throw new Error("Invalid email or password");
 }      
     const accessToken=generateAccessToken(user);
     const refreshToken=generateRefreshToken(user);  
     const decoded=verifyRefreshToken(refreshToken);
     await RefreshTokenRepository.saveRefreshToken(
        user.id,
        refreshToken,
        new Date(decoded.exp*1000)
     );
    return {
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_image: user.profile_image,
    },
    accessToken,
    refreshToken
};
    }

   async logout(refreshToken) {

    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }

    const deletedRows =
        await RefreshTokenRepository.deleteRefreshToken(refreshToken);

    if (deletedRows === 0) {
        throw new Error("Invalid refresh token");
    }

    return {
        message: "Logout successful"
    };
}

    async refreshAccessToken(refreshToken) {

    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }

    const decoded = verifyRefreshToken(refreshToken);

    const storedToken =
        await RefreshTokenRepository.findRefreshToken(refreshToken);

    if (!storedToken) {
        throw new Error("Invalid refresh token");
    }

    const user =
        await UserRepository.findUserById(decoded.id);

    if (!user) {
        throw new Error("User not found");
    }

    const accessToken = generateAccessToken(user);

    return {
        accessToken
    };
}

    async getProfile(userId) {

        const user=await UserRepository.findUserById(userId);
           if (!user) {
        throw new Error("User not found");
    }
     return{
        id:user.id,
        name:user.name,
        email:user.email,
        role:user.role,
        profile_image:user.profile_image,
     };
    }

    async updateProfile(userId, userData) {
        const user=await UserRepository.findUserById(userId);;
        if(!user){
            throw new Error("User not found");
        }
        await UserRepository.updateProfile(userId,userData);
        const updatedUser=await UserRepository.findUserById(userId);
        return{
            id:updatedUser.id,
            name:updatedUser.name,
            email:updatedUser.email,

            role:updatedUser.role,
            profile_image:updatedUser.profile_image,
        };
    }

    async changePassword(userId, currentPassword, newPassword) {
        const user=await UserRepository.findUserById(userId);
          if (!user) {
        throw new Error("User not found");
    }
    const isPasswordValid=await comparePassword(
        currentPassword,
        user.password
    );
     if (!isPasswordValid) {
        throw new Error("Current password is incorrect");
    }
     const hashedPassword=await hashPassword(newPassword);
     await UserRepository.updatePassword(userId,hashedPassword);
     await RefreshTokenRepository.deleteRefreshTokensByUserId(userId);
     return{
        message:"Password changed successfully"
     };
    }
    async forgotPassword(email) {
    const user = await UserRepository.findUserByEmail(email);

    if (!user) {
        throw new Error("User not found");
    }

    const otp = generateOtp();
    const expiresAt = generateExpiryTime();

    await otpRepository.deleteOtp(email, "forgot_password");

    await otpRepository.saveOtp(
        email,
        otp,
        "forgot_password",
        expiresAt
    );

    await mail.sendForgotPasswordOtp(email, otp);

    return {
        message: "OTP sent successfully"
    };
}
async resetPassword(email, otp, newPassword) {

    const otpRecord = await otpRepository.findOtp(
        email,
        otp,
        "forgot_password"
    );

    if (!otpRecord) {
        throw new Error("Invalid OTP");
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
        await otpRepository.deleteOtp(email, "forgot_password");
        throw new Error("OTP has expired");
    }

    const user = await UserRepository.findUserByEmail(email);

    if (!user) {
        throw new Error("User not found");
    }

    const hashedPassword = await hashPassword(newPassword);

    await UserRepository.updatePassword(
        user.id,
        hashedPassword
    );

    await RefreshTokenRepository.deleteRefreshTokensByUserId(
        user.id
    );

    await otpRepository.deleteOtp(
        email,
        "forgot_password"
    );

    return {
        message: "Password reset successfully"
    };
}
async resendOtp(email, purpose) {

    if (
        purpose !== "register" &&
        purpose !== "forgot_password"
    ) {
        throw new Error("Invalid OTP purpose");
    }

    const user =
        await UserRepository.findUserByEmail(email);

    if (purpose === "register" && user) {
        throw new Error("Email already registered");
    }

    if (purpose === "forgot_password" && !user) {
        throw new Error("User not found");
    }

    const otp = generateOtp();
    const expiresAt = generateExpiryTime();

    await otpRepository.deleteOtp(email, purpose);

    await otpRepository.saveOtp(
        email,
        otp,
        purpose,
        expiresAt
    );

    if (purpose === "register") {
        await mail.sendRegistrationOtp(email, otp);
    } else {
        await mail.sendForgotPasswordOtp(email, otp);
    }

    return {
        message: "OTP resent successfully"
    };
}
}
module.exports=new AuthService();