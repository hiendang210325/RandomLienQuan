const mongoose = require("mongoose");

const transformCharacter = (_doc, ret) => {
  ret.id = ret._id.toString();
  delete ret._id;
  return ret;
};

const characterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Character name is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Character image URL is required"],
      trim: true,
    },
    categories: {
      type: [String],
      default: [],
    },
    showInSpin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: transformCharacter,
      versionKey: false,
    },
    toObject: {
      transform: transformCharacter,
      versionKey: false,
    },
  },
);

module.exports = mongoose.model("Character", characterSchema);
