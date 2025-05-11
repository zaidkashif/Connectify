const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require("../Models/userModel");
const validator = require('validator');
console.log('userController loaded');
const { sendRegistrationEmail, sendAccountDeletionEmail, sendOTPEmail } = require('../utility/sendmail');
console.log(sendRegistrationEmail);
const ActivityLog = require('../Models/activityLog');

const JWT_SECRET = process.env.JWT_SECRET || "THESECRECTKEY";
exports.sendotp = async (req, res) => {
    const { email } = req.body;
    console.log('sendotp called with email:', email);
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    console.log('Generated OTP:', otp);
    console.log('OTP Expiry:', otpExpiry);

    try {
        console.log('Finding user with email:', email);
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        console.log('User found:', user._id);
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        console.log('OTP saved to user:', user._id);

        await sendOTPEmail(email, otp);

        const activityLog = new ActivityLog({
            userId: user._id,
            action: 'otp sent',
            details: `User with ID ${req.params.id} was sent OTP.`
        });
        console.log('Activity log created:', activityLog);
        await activityLog.save();

        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

// Verify OTP
exports.verifyotp = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (Date.now() > user.otpExpiry) {
        return res.status(400).json({ message: 'OTP has expired' });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;

        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error resetting password' });
    }
};

// Register
exports.register = async (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: "Email or Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, username, email, password: hashedPassword });
        await user.save();
        await sendRegistrationEmail(email, name);

        const activityLog = new ActivityLog({
            userId: email,
            action: 'registered user',
            details: `User with ID ${email} was registered.`
        });
        await activityLog.save();



        res.status(201).json({ message: "User registered successfully", userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Email and password required" });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

        const activityLog = new ActivityLog({
            userId: email,
            action: 'login user',
            details: `User with ID ${email} was logined.`
        });
        await activityLog.save();

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await User.findByIdAndDelete(userId);

        console.log(`User with ID ${userId} deleted`);
        console.log(`User's email: ${user.email}`);
        console.log(`User's name: ${user.name}`);

        await sendAccountDeletionEmail(user.email, user.name);


        const activityLog = new ActivityLog({
            userId: userId,
            action: 'deleted user',
            details: `User with email ${user.email} was deleted.`

        });
        await activityLog.save();

        res.status(200).json({ message: "Account deleted successfully, and confirmation email sent" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

