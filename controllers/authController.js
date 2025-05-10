const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Utility to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP placeholder (implement actual email/SMS logic)
const sendOTP = async (email, otp) => {
    console.log(`OTP sent to ${email}: ${otp}`);
};

// Register User or Provider
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, address, role } = req.body;
        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role: role || 'user',
            otp,
            otpExpiry,
        });

        await sendOTP(email, otp);

        res.status(201).json({ message: "OTP sent for verification", userId: user._id });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ message: "Account verified successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user || !user.isVerified) {
            return res.status(403).json({ message: "Account not verified or doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", token, user });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Logout (client should handle token removal, this is just a stub)
exports.logout = (req, res) => {
    res.status(200).json({ message: "Logout successful" });
};

// Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        await sendOTP(email, otp);

        res.status(200).json({ message: "OTP sent to email" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Reset Password with OTP
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};
