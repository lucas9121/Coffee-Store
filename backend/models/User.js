const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10; // number of salt rounds for bcrypt hashing

const SECURITY_QUESTIONS = [
    "What is your mother's maiden name?",
    "What is the name of your first pet?",
    "What was your first car?",
    "What elementary school did you attend?",
    "What is the name of the town where you were born?",
    "Where did you meet your spouse?"
];

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { 
      type: String, 
      unique: true, 
      trim: true, 
      lowercase: true, 
      required: true
    },
    password: { 
      type: String, 
      trim: true, 
      minLength: 5, 
      required: true 
    },
    account: { 
      type: String, 
      enum: ['user', 'worker', 'admin'], 
      default: 'user', 
      required: true 
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }], // saved favorite items
    recent: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }], // recently viewed/purchased
    securityQuestions: {
        type: [{
            question: { 
              type: String, 
              enum: SECURITY_QUESTIONS, 
              required: true 
            },
            answer: { type: String, required: true } // will be hashed once on creation
        }],
        validate: [arr => arr.length === 2, "You must select exactly 2 security questions"]
    },
    refreshTokenHash: {Type: String},
    refreshTokenExpiresAt: {type: Date}
}, 
{
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password; // hide password in JSON responses
            ret.securityQuestions = ret.securityQuestions.map(sq => ({
                question: sq.question // only send question without answer
            }));
            delete ret.refreshTokenHash;
            delete ret.refreshTokenExpiresAt;
            return ret;
        }
    }
});

// Pre-save hook to hash password and initial security answers
userSchema.pre('save', async function(next) {
    // hash password if it’s new or changed
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    }

    // hash any security answers that are modified or new
    for (const sq of this.securityQuestions) {
        // only hash if the answer is new or modified
        if (sq.isNew || sq.isModified('answer')) {
            sq.answer = await bcrypt.hash(sq.answer, SALT_ROUNDS);
        }
    }

    next(); // continue saving
});

module.exports = mongoose.model('User', userSchema);