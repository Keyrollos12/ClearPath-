import ActivityService from "./activity.service.js";

class ActivityController {
  // Create
  create = async (req, res, next) => {
    try {
      const data = await ActivityService.create(req.body);

      res.status(201).json({
        message: "Activity created successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  // Get All
  getAll = async (req, res, next) => {
    try {
      const data = await ActivityService.getAll(req.query);

      res.status(200).json({
        results: data.length,
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  // Get One
  getOne = async (req, res, next) => {
    try {
      const data = await ActivityService.getOne(req.params.id);

      if (!data) {
        return res.status(404).json({
          message: "Activity not found",
        });
      }

      res.status(200).json({
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  // Update
  update = async (req, res, next) => {
    try {
      const data = await ActivityService.update(
        req.params.id,
        req.body
      );

      if (!data) {
        return res.status(404).json({
          message: "Activity not found",
        });
      }

      res.status(200).json({
        message: "Updated successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  // Delete
  delete = async (req, res, next) => {
    try {
      const data = await ActivityService.delete(req.params.id);

      if (!data) {
        return res.status(404).json({
          message: "Activity not found",
        });
      }

      res.status(200).json({
        message: "Deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new ActivityController();