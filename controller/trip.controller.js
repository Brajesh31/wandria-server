const Trip = require("../model/trip.model");
const asyncWrapper = require("../middleware/asyncWrapper");
const dataform = require("../utils/dataForm");
const prompt = require("../utils/tripPrompt");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const parsMarkDownToJson = require("../utils/markDownParser");
const genAI = new GoogleGenerativeAI(process.env.GENRATE_KEY);

const getAllTrips = asyncWrapper(async (req, res) => {
  const trips = await Trip.find();
  if (!trips) {
    res.status(404).json(dataform("faild", 404, "no users found"));
  }
  return res
    .status(200)
    .json(dataform("success", 200, "successfully operation", trips));
});

const addTrip = asyncWrapper(async (req, res) => {
  const { country, groupType, interest, duration, style } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(
      prompt(duration, country, interest, style, groupType)
    );
    const response = await result.response;
    const newTrip = parsMarkDownToJson(response.text());

    if (!newTrip) {
      return res
        .status(400)
        .json(dataform("fail", 400, "Failed to generate trip data."));
    }

    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${country} ${interest} ${style}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );

    if (!imageResponse.ok) {
      return res
        .status(500)
        .json(dataform("fail", 500, "Failed to fetch images from Unsplash."));
    }

    const imgData = await imageResponse.json();
    const images = imgData.results
      .slice(0, 3)
      .map((item) => item.urls?.regular);

    const trip = await Trip.create({ ...newTrip, images });

    return res
      .status(201)
      .json(dataform("success", 201, "Trip generated successfully.", trip));
  } catch (error) {
    console.error("Error in addTrip:", error.message);
    return res.status(500).json(dataform("fail", 500, error.message));
  }
});

const getTripById = asyncWrapper(async (req, res) => {
  const trips = await Trip.findById(req.params.id);
  if (!trips) res.status(404).json(dataform("faild", 404, "invalid trip id"));

  res
    .status(200)
    .json(dataform("success", 200, "successfully operation", trips));
});

const updateTrip = asyncWrapper(async (req, res) => {
  const tripData = await Trip.findByIdAndUpdate(req.params.id, {
    ...req.body,
  });
  if (!tripData)
    res.status(404).json(dataform("faild", 404, "invalid trip data"));

  res
    .status(201)
    .json(dataform("success", 201, "trip updated successfully", tripData));
});

const deleteTrip = asyncWrapper(async (req, res) => {
  const delTrip = await Trip.deleteOne({ _id: req.params.id });

  res.status(201).json(dataform("success", 201, "trip deleted successfully"));
});

module.exports = {
  getAllTrips,
  addTrip,
  getTripById,
  updateTrip,
  deleteTrip,
};
