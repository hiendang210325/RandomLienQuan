const express = require("express");

const {
  createGallery,
  deleteGallery,
  getGalleryById,
  getGalleries,
  updateGallery,
} = require("../controller/galleryController");

const router = express.Router();

router.route("/").get(getGalleries).post(createGallery);
router
  .route("/:id")
  .get(getGalleryById)
  .put(updateGallery)
  .delete(deleteGallery);

module.exports = router;
