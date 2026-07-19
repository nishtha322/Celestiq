const AuthService = require("../Services/AuthService");

class AuthController {
  async sendRegistrationOtp(req, res) {
    try {
      const result = await AuthService.sendRegistrationOtp(req.body);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verifyRegistrationOtp(req, res) {
    try {
      const user = await AuthService.verifyRegistrationOtp(req.body);

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        data: user,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async logout(req, res) {
    try {

        const refreshToken = req.cookies.refreshToken;

        const result =
            await AuthService.logout(refreshToken);

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            message: result.message,
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

  async refreshAccessToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        const result = await AuthService.refreshAccessToken(refreshToken);

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        return res.status(200).json({
            success: true,
            message: "Access token refreshed"
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
}
  async getProfile(req, res) {
    try {
      const user = await AuthService.getProfile(req.user.id);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const user = await AuthService.updateProfile(req.user.id, req.body);

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      const result = await AuthService.changePassword(
        req.user.id,
        currentPassword,
        newPassword,
      );

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const result = await AuthService.forgotPassword(email);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async resetPassword(req, res) {
    try {
      const { email, otp, newPassword } = req.body;

      const result = await AuthService.resetPassword(email, otp, newPassword);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async resendOtp(req, res) {
    try {
      const { email, purpose } = req.body;

      const result = await AuthService.resendOtp(email, purpose);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
