const express = require("express");

const {
  createCharacter,
  deleteCharacter,
  getCharacterById,
  getCharacters,
  updateCharacter,
  streamCharacters,
} = require("../controller/characterController");

const router = express.Router();

router.get("/stream", streamCharacters);
router.route("/").get(getCharacters).post(createCharacter);
router
  .route("/:id")
  .get(getCharacterById)
  .put(updateCharacter)
  .delete(deleteCharacter);

module.exports = router;
