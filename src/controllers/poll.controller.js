const Poll = require("../models/Poll");

const Vote = require("../models/Vote");

const allowedEnergy = [500, 1000, 1500, 2000, 5000];

const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find();

    const formattedPolls = [];

    for (const poll of polls) {
      const options = [];

      for (const option of poll.options) {
        const overall = await Vote.aggregate([
          {
            $match: {
              optionId: option._id,
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$energy",
              },
            },
          },
        ]);

        const currentUser = await Vote.aggregate([
          {
            $match: {
              optionId: option._id,
              userId: req.user.id,
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$energy",
              },
            },
          },
        ]);

        options.push({
          id: option._id,

          name: option.name,

          imageUrl: option.imageUrl,

          overallTotalEnergySpent: overall[0]?.total || 0,

          currentUserEnergySpent: currentUser[0]?.total || 0,
        });
      }

      formattedPolls.push({
        id: poll._id,

        title: poll.title,

        description: poll.description,

        options,
      });
    }

    res.json(formattedPolls);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }

    const options = [];

    for (const option of poll.options) {
      const overall = await Vote.aggregate([
        {
          $match: {
            optionId: option._id,
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$energy",
            },
          },
        },
      ]);

      options.push({
        id: option._id,

        name: option.name,

        imageUrl: option.imageUrl,

        overallTotalEnergySpent: overall[0]?.total || 0,
      });
    }

    res.json({
      id: poll._id,

      title: poll.title,

      description: poll.description,

      options,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const votePoll = async (req, res) => {
  try {
    const { optionId, energy } = req.body;

    if (!allowedEnergy.includes(energy)) {
      return res.status(400).json({
        message: "Invalid energy value",
      });
    }

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }

    const optionExists = poll.options.find(
      (option) => option._id.toString() === optionId,
    );

    if (!optionExists) {
      return res.status(400).json({
        message: "Invalid option",
      });
    }

    await Vote.create({
      userId: req.user.id,

      pollId: req.params.id,

      optionId,

      energy,
    });

    const overall = await Vote.aggregate([
      {
        $match: {
          optionId: optionExists._id,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$energy",
          },
        },
      },
    ]);

    const currentUser = await Vote.aggregate([
      {
        $match: {
          optionId: optionExists._id,
          userId: req.user.id,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$energy",
          },
        },
      },
    ]);

    res.json({
      message: "Vote submitted successfully",

      overallTotalEnergySpent: overall[0]?.total || 0,

      currentUserEnergySpent: currentUser[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getPolls,
  getPollById,
  votePoll,
};
