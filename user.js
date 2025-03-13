import mongoose from 'mongoose';
import { type } from 'os';
import { match } from 'assert';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Por favor, forneça um e-mail válido']
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

export default User;