import ExperienceService from "./experience.service.js";

class ExperienceController {

  //  Create (Admin)
  create = async (req, res, next) => {
    try {
      const data = await ExperienceService.create(req.body);

      res.status(201).json({
        message: "Experience created successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  //  Get All (Search + Filter + Pagination)
  getAll = async (req, res, next) => {
    try {
      const result = await ExperienceService.getAll(req.query);

      res.status(200).json({
        message: "Experiences fetched successfully",
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };

  // 🔍 Get One
  getOne = async (req, res, next) => {
    try {
      const data = await ExperienceService.getOne(req.params.id);

      if (!data) {
        return res.status(404).json({
          message: "Experience not found",
        });
      }

      res.status(200).json({
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  //  Update (Admin)
  update = async (req, res, next) => {
    try {
      const data = await ExperienceService.update(req.params.id, req.body);

      res.status(200).json({
        message: "Experience updated successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  //  Delete (Admin)
  delete = async (req, res, next) => {
    try {
      await ExperienceService.delete(req.params.id);

      res.status(200).json({
        message: "Experience deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new ExperienceController();