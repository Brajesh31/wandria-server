const parsMarkDownToJson = (markDown) => {
  const regex = /```json\n([\s\S]+?)\n```/;
  const match = markDown.match(regex);

  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  }
  console.error("No valid JSON found in markdown text.");
  return null;
};

module.exports = parsMarkDownToJson;
