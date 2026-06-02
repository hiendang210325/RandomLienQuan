const Gallery = require("../models/Gallery");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const pickGalleryFields = (body) => {
  const fields = {};

  ["name", "leftImageUrl", "rightImageUrl"].forEach((key) => {
    if (body[key] !== undefined) {
      fields[key] = body[key];
    }
  });

  return fields;
};

const getGalleries = async (_req, res, next) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 });
    res.json(galleries);
  } catch (error) {
    next(error);
  }
};

const getGalleryById = async (req, res, next) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      throw createError("Gallery item not found", 404);
    }

    res.json(gallery);
  } catch (error) {
    next(error);
  }
};

const createGallery = async (req, res, next) => {
  try {
    const gallery = await Gallery.create(pickGalleryFields(req.body));
    res.status(201).json(gallery);
  } catch (error) {
    next(error);
  }
};

const updateGallery = async (req, res, next) => {
  try {
    const updates = pickGalleryFields(req.body);

    if (Object.keys(updates).length === 0) {
      throw createError("No valid gallery fields provided", 400);
    }

    const gallery = await Gallery.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!gallery) {
      throw createError("Gallery item not found", 404);
    }

    res.json(gallery);
  } catch (error) {
    next(error);
  }
};

const deleteGallery = async (req, res, next) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);

    if (!gallery) {
      throw createError("Gallery item not found", 404);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGallery,
  deleteGallery,
  getGalleryById,
  getGalleries,
  updateGallery,
};
