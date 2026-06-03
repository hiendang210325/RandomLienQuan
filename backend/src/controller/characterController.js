const Character = require("../models/Character");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const pickCharacterFields = (body) => {
  const fields = {};

  ["name", "imageUrl", "categories", "showInSpin"].forEach((key) => {
    if (body[key] !== undefined) {
      fields[key] = body[key];
    }
  });

  return fields;
};

let clients = [];

const streamCharacters = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  res.write("data: connected\n\n");

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter(client => client !== res);
  });
};

const notifyClients = () => {
  clients.forEach(client => {
    client.write("data: update\n\n");
  });
};

const getCharacters = async (_req, res, next) => {
  try {
    const characters = await Character.find().sort({ createdAt: -1 });
    res.set("Cache-Control", "no-store");
    res.json(characters);
  } catch (error) {
    next(error);
  }
};

const getCharacterById = async (req, res, next) => {
  try {
    const character = await Character.findById(req.params.id);

    if (!character) {
      throw createError("Character not found", 404);
    }

    res.json(character);
  } catch (error) {
    next(error);
  }
};

const createCharacter = async (req, res, next) => {
  try {
    const character = await Character.create(pickCharacterFields(req.body));
    notifyClients();
    res.status(201).json(character);
  } catch (error) {
    next(error);
  }
};

const updateCharacter = async (req, res, next) => {
  try {
    const updates = pickCharacterFields(req.body);

    if (Object.keys(updates).length === 0) {
      throw createError("No valid character fields provided", 400);
    }

    const character = await Character.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!character) {
      throw createError("Character not found", 404);
    }

    res.json(character);
    notifyClients();
  } catch (error) {
    next(error);
  }
};

const deleteCharacter = async (req, res, next) => {
  try {
    const character = await Character.findByIdAndDelete(req.params.id);

    if (!character) {
      throw createError("Character not found", 404);
    }

    notifyClients();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCharacter,
  deleteCharacter,
  getCharacterById,
  getCharacters,
  updateCharacter,
  streamCharacters,
};
