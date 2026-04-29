import mongoose from "mongoose";
import { Review } from "../../db/models/review.model.js";
import { Booking } from "../../db/models/booking.model.js";
import { CustomTrip } from "../../db/models/customtrip.model.js";
import * as AppError from "../../utils/error/index.js";

class ReviewService {
  async create(userId, data) {
    const { experience, rating, comment } = data;

    const existing = await Review.findOne({ user: userId, experience });
    if (existing) {
      throw new AppError.conflictException(
        "You have already reviewed this experience"
      );
    }

    // Check if user has a confirmed booking for this experience
    const userCustomTrips = await CustomTrip.find({ user: userId, experience });
    const customTripIds = userCustomTrips.map((ct) => ct._id);
    const confirmedBooking = await Booking.findOne({
      customTrip: { $in: customTripIds },
      status: "Confirmed",
    });

    const review = await Review.create({
      user: userId,
      experience,
      rating,
      comment,
      isVerifiedBooking: !!confirmedBooking,
    });

    return await review.populate([
      { path: "user", select: "firstName lastName" },
      { path: "experience", select: "name" },
    ]);
  }

  async getExperienceReviews(experienceId, query) {
    const { page = 1, limit = 10, sort = "-createdAt" } = query;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ experience: experienceId })
        .populate("user", "firstName lastName")
        .sort(sort)
        .skip(Number(skip))
        .limit(Number(limit)),
      Review.countDocuments({ experience: experienceId }),
    ]);

    return { total, page: Number(page), limit: Number(limit), results: reviews.length, reviews };
  }

  async getExperienceStats(experienceId) {
    const stats = await Review.aggregate([
      { $match: { experience: new mongoose.Types.ObjectId(experienceId) } },
      {
        $group: {
          _id: "$experience",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratings: { $push: "$rating" },
        },
      },
    ]);

    if (!stats.length) {
      return { averageRating: 0, totalReviews: 0, ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    }

    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats[0].ratings.forEach((r) => { breakdown[r] = (breakdown[r] || 0) + 1; });

    return {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
      ratingBreakdown: breakdown,
    };
  }

  async getMyReviews(userId) {
    return await Review.find({ user: userId })
      .populate("experience", "name base_price")
      .sort("-createdAt");
  }

  async getAllReviews(query) {
    const { page = 1, limit = 20, rating, experienceId } = query;
    const skip = (page - 1) * limit;
    const filter = {};

    if (rating) filter.rating = Number(rating);
    if (experienceId) filter.experience = experienceId;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("user", "firstName lastName email")
        .populate("experience", "name")
        .sort("-createdAt")
        .skip(Number(skip))
        .limit(Number(limit)),
      Review.countDocuments(filter),
    ]);

    return { total, page: Number(page), limit: Number(limit), results: reviews.length, reviews };
  }

  async update(reviewId, userId, data) {
    const review = await Review.findById(reviewId);
    if (!review) throw new AppError.BadRequestException("Review not found");

    if (review.user.toString() !== userId.toString()) {
      throw new AppError.forbiddenException("You can only edit your own reviews");
    }

    return await Review.findByIdAndUpdate(reviewId, data, { new: true, runValidators: true })
      .populate("user", "firstName lastName")
      .populate("experience", "name");
  }

  async delete(reviewId, userId, userRole) {
    const review = await Review.findById(reviewId);
    if (!review) throw new AppError.BadRequestException("Review not found");

    if (userRole !== "admin" && review.user.toString() !== userId.toString()) {
      throw new AppError.forbiddenException("You can only delete your own reviews");
    }

    await Review.findByIdAndDelete(reviewId);
  }
}

export default new ReviewService();

