const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
        reminderDate: {
            type: Date,
            default: null,
        },
        reminderSent: {
            type: Boolean,
            default: false,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Todo', TodoSchema);