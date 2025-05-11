const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, default: '' },
    media: { type: String, default: '' },

    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
