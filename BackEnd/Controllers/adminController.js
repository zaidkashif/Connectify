const PDFDocument = require('pdfkit');
const User = require('../Models/userModel');
const ActivityLog = require('../Models/activityLog');
const jwt = require('jsonwebtoken');

exports.downloadActivityLogPdf = async (req, res) => {
    try {
        const logs = await ActivityLog.find().populate('userId', 'email');

        const doc = new PDFDocument();
        let filename = "Activity_Log.pdf";
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);

        doc.fontSize(18).text('Activity Log Report', { align: 'center' });
        doc.moveDown();

        logs.forEach((log, index) => {
            doc.fontSize(12).text(`#${index + 1}`);
            doc.text(`User: ${log.userId.email || 'N/A'}`);
            doc.text(`Action: ${log.action}`);
            doc.text(`Details: ${log.details}`);
            doc.text(`Timestamp: ${log.createdAt}`);
            doc.moveDown();
        });

        doc.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password -otp -otpExpiry');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/admin/activity-summary
exports.getActivitySummary = async (req, res) => {
    try {
        const logs = await ActivityLog.aggregate([
            {
                $match: { action: 'login user' }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    logins: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
};


exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }

    // Hardcoded admin credentials
    const ADMIN_EMAIL = 'admin@gmail.com';
    const ADMIN_PASSWORD = 'admin';

    // Check if the provided credentials match the hardcoded admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Generate a JWT token for the admin
        const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({
            message: "Admin login successful",
            token,
            user: { id: 'admin', role: 'admin', email: ADMIN_EMAIL }
        });
    } else {
        return res.status(401).json({ error: "Invalid credentials" });
    }
};

