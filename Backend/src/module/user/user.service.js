import { User } from '../../db/models/user.model.js';
import bcrypt from 'bcryptjs';

// User Actions
export const getUserById = async (id) => {
    return await User.findById(id).select('-password');
};

export const updateUserData = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
};

export const updatePassword = async (id, oldPassword, newPassword) => {
    const user = await User.findById(id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Current password incorrect");

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return { message: "Password updated successfully" };
};

export const removeAccount = async (id) => {
    return await User.findByIdAndDelete(id);
};

// Admin Actions
export const fetchAllUsers = async () => {
    return await User.find().select('-password');
};