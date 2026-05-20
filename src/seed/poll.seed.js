const mongoose = require("mongoose");

const dotenv = require("dotenv");

const Poll = require("../models/Poll");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedPoll = async () => {
  try {
    await Poll.deleteMany();

    await Poll.create({
      title: "Which outfit shall i wear next ?",

      description: "Choose your favorite outfit",

      options: [
        {
          name: "Yellow Dress",

          imageUrl: "http://localhost:5000/static/yellowDress.jpg",
        },

        {
          name: "Red Dress",

          imageUrl: "http://localhost:5000/static/redDress.jpg",
        },
      ],
    });

    console.log("Poll Seeded");

    process.exit();
  } catch (error) {
    console.log(error.message);

    process.exit();
  }
};

seedPoll();
