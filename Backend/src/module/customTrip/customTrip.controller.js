import CustomTripService from "./customTrip.service.js";

class CustomTripController {

  // Create from Experience
  create = async (req, res, next) => {
    try {
      const data = await CustomTripService.create(
        req.user._id,
        req.body.experienceId
      );

      res.status(201).json({
        message: "CustomTrip created successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  // Get user trips
  getUserTrips = async (req, res, next) => {
    try {
      const data = await CustomTripService.getUserTrips(req.user._id);

      res.status(200).json({
        results: data.length,
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  // Get one trip
  getOne = async (req, res, next) => {
    try {
      const data = await CustomTripService.getOne(req.params.id);

      if (!data) {
        return res.status(404).json({
          message: "Trip not found",
        });
      }

      res.status(200).json({
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  // SMART VIEW (Experience OR CustomTrip)
  getFinalTrip = async (req, res, next) => {
    try {
      const result = await CustomTripService.getFinalTrip(
        req.user._id,
        req.params.experienceId
      );

      res.status(200).json({
        source: result.source,
        data: result.data,
      });
    } catch (err) {
      next(err);
    }
  };

  // PREVIEW TRIP WITH ALL CHANGES (Builder View)
  preview = async (req, res, next) => {
    try {
      const data = await CustomTripService.getPreview(req.params.id);

      if (!data) {
        return res.status(404).json({
          message: "Trip not found",
        });
      }

      res.status(200).json({
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  // Add activity
  addActivity = async (req, res, next) => {
    try {
      const data = await CustomTripService.addActivity(
        req.params.id,
        req.body.day_number,
        req.body
      );

      res.status(200).json({
        message: "Activity added successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  // Remove activity
  removeActivity = async (req, res, next) => {
    try {
      const data = await CustomTripService.removeActivity(
        req.params.id,
        req.body.day_number,
        req.body.activityId
      );

      res.status(200).json({
        message: "Activity removed successfully",
        data,
      });
    } catch (err) {
     next(err);
    }
  };

  // Remove day
  removeDay = async (req, res, next) => {
    try {
      const data = await CustomTripService.removeDay(
        req.params.id,
        req.body.day_number
      );

      res.status(200).json({
        message: "Day removed successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  // Add day
  addDay = async (req, res, next) => {
    try {
      const data = await CustomTripService.addDay(
        req.params.id,
        req.body.day_number,
        req.body.activities || []
      );

      res.status(200).json({
        message: "Day added successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  // Add extra activity
  addExtraActivity = async (req, res, next) => {
    try {
      const data = await CustomTripService.addExtraActivity(
        req.params.id,
        req.body
      );

      res.status(200).json({
        message: "Extra activity added successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  // Remove extra activity
  removeExtraActivity = async (req, res, next) => {
    try {
      const data = await CustomTripService.removeExtraActivity(
        req.params.id,
        req.body.activityId
      );

      res.status(200).json({
        message: "Extra activity removed successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  // Delete custom trip
  delete = async (req, res, next) => {
    try {
      await CustomTripService.delete(req.params.id, req.user._id);

      res.status(200).json({
        message: "Custom trip deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  // Restore day
  restoreDay = async (req, res, next) => {
    try {
      const data = await CustomTripService.restoreDay(
        req.params.id,
        req.body.day_number
      );

      res.status(200).json({
        message: "Day restored successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  // Restore activity
  restoreActivity = async (req, res, next) => {
    try {
      const data = await CustomTripService.restoreActivity(
        req.params.id,
        req.body.day_number,
        req.body.activityId
      );

      res.status(200).json({
        message: "Activity restored successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  // Restore extra activity
  restoreExtraActivity = async (req, res, next) => {
    try {
      const data = await CustomTripService.restoreExtraActivity(
        req.params.id,
        req.body.activityId
      );

      res.status(200).json({
        message: "Extra activity restored successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new CustomTripController();
