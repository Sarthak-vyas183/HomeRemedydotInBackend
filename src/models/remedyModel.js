import mongoose from 'mongoose';

const remedySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String], // Array of ingredient names
        required: true
    },
    steps: {
        type: [String], // Step-by-step guide
        required: true
    },
    ailments: {
        type: [String], // List of ailments the remedy helps with
        required: true
    },
    effectiveness: {
        type: Number, // Rating from 1-5
        min: 1,
        max: 5,
        default: 3
    },
    EcommerceUrl: {
        type: String,
        default: "https://www.amazon.in/"
    },
    isVerified: {
        type: Boolean,
        default: false // Admin or doctor verification
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifyInfo: {
        status: {
            type: String,
            default: "pending" // pending, approved, rejected
        },
        reason: {
            type: String,
            default: "We will let you know soon..."
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const remedyModel = mongoose.model('Remedy', remedySchema);
