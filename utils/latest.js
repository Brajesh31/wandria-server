const getWeeklySummary = async (Model, dateField = "createdAt") => {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date();
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  endOfWeek.setHours(0, 0, 0, 0);

  const dayMap = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  const allDays = Object.values(dayMap).map((day) => ({
    day,
    total: 0,
  }));

  const pipeline = [
    {
      $match: {
        [dateField]: {
          $gte: startOfWeek,
          $lte: endOfWeek,
        },
      },
    },
    {
      $project: {
        dayOfWeek: { $dayOfWeek: `$${dateField}` },
      },
    },
    {
      $group: {
        _id: "$dayOfWeek",
        total: { $sum: 1 },
      },
    },
  ];

  const result = await Model.aggregate(pipeline);

  const weekSummary = allDays.map(({ day }) => {
    const found = result.find((d) => dayMap[d._id] === day);
    return { day, total: found ? found.total : 0 };
  });

  return weekSummary;
};

const getMonthlySummary = async (Model, dateField) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;

  const result = await Model.aggregate([
    {
      $group: {
        _id: { month: { $month: `$${dateField}` } },
        total: { $sum: 1 },
      },
    },
    {
      $match: {
        "_id.month": { $in: [currentMonth, lastMonth] },
      },
    },
    {
      $sort: { "_id.month": -1 },
    },
  ]);

  const summary = {
    currentMonth: 0,
    lastMonth: 0,
  };

  for (const item of result) {
    if (item._id.month === currentMonth) {
      summary.currentMonth = item.total;
    } else if (item._id.month === lastMonth) {
      summary.lastMonth = item.total;
    }
  }

  return summary;
};

const getLatest = async (
  Model,
  fields = "-password",
  targetField = "createdAt"
) => {
  const data = await Model.find()
    .select(fields)
    .sort({ [targetField]: -1 })
    .limit(5);

  return data;
};

module.exports = { getWeeklySummary, getMonthlySummary, getLatest };
