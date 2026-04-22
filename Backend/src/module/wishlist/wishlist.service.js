import { Wishlist } from '../../db/models/wishlist.model.js';

// Get user's wishlist
export const getUserWishlist = async (userId) => {
    let wishlist = await Wishlist.findOne({ user: userId }).populate('experiences');
    if (!wishlist) {
        wishlist = new Wishlist({ user: userId, experiences: [] });
        await wishlist.save();
    }
    return wishlist;
};

// Add experience to wishlist
export const addToWishlist = async (userId, experienceId) => {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
        wishlist = new Wishlist({ user: userId, experiences: [experienceId] });
    } else {
        if (!wishlist.experiences.includes(experienceId)) {
            wishlist.experiences.push(experienceId);
        }
    }
    await wishlist.save();
    return wishlist.populate('experiences');
};

// Remove experience from wishlist
export const removeFromWishlist = async (userId, experienceId) => {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
        wishlist.experiences = wishlist.experiences.filter(id => id.toString() !== experienceId);
        await wishlist.save();
        return wishlist.populate('experiences');
    }
    return null;
};