import * as userService from './user.service.js';

export const getProfile = async (req, res) => {
    const user = await userService.getUserById(req.user.id);
    return res.status(200).json({ message: "Success", user });
};

export const updateProfile = async (req, res) => {
    const updated = await userService.updateUserData(req.user.id, req.body);
    return res.status(200).json({ message: "Profile updated", updated });
};

export const changePassword = async (req, res) => {
    try {
        const result = await userService.updatePassword(req.user.id, req.body.oldPassword, req.body.newPassword);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const deleteMe = async (req, res) => {
    await userService.removeAccount(req.user.id);
    return res.status(200).json({ message: "Account deleted" });
};

// Admin Controllers
export const getAllUsers = async (req, res) => {
    const users = await userService.fetchAllUsers();
    return res.status(200).json({ message: "All users retrieved", users });
};

export const adminDeleteUser = async (req, res) => {
    await userService.removeAccount(req.params.userId);
    return res.status(200).json({ message: "User deleted by admin" });
};