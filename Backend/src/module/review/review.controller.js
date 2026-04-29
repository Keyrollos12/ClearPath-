import ReviewService from "./review.service.js";

class ReviewController {
  // POST / — authenticated user submits a review
  create = async (req, res, next) => {
    try {
      const data = await ReviewService.create(req.user._id, req.body);
      res.status(201).json({ message: "Review submitted successfully", data });
    } catch (err) {
      next(err);
    }
  };

  // GET /experience/:experienceId — public listing
  getExperienceReviews = async (req, res, next) => {
    try {
      const result = await ReviewService.getExperienceReviews(
        req.params.experienceId,
        req.query
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // GET /experience/:experienceId/stats — public aggregate stats
  getExperienceStats = async (req, res, next) => {
    try {
      const data = await ReviewService.getExperienceStats(req.params.experienceId);
      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  };

  // GET /my-reviews — logged-in user sees their own reviews
  getMyReviews = async (req, res, next) => {
    try {
      const data = await ReviewService.getMyReviews(req.user._id);
      res.status(200).json({ results: data.length, data });
    } catch (err) {
      next(err);
    }
  };

  // GET / — admin: all reviews for service quality monitoring
  getAllReviews = async (req, res, next) => {
    try {
      const result = await ReviewService.getAllReviews(req.query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // PATCH /:reviewId — owner edits their review
  update = async (req, res, next) => {
    try {
      const data = await ReviewService.update(
        req.params.reviewId,
        req.user._id,
        req.body
      );
      res.status(200).json({ message: "Review updated successfully", data });
    } catch (err) {
      next(err);
    }
  };

  // DELETE /:reviewId — owner or admin removes a review
  delete = async (req, res, next) => {
    try {
      await ReviewService.delete(req.params.reviewId, req.user._id, req.user.role);
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
}

export default new ReviewController();

