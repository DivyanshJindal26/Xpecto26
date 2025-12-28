const fs = require("fs");
const path = require("path");

function collegeMap() {
  const filePath = path.join(__dirname, "../data/colleges.csv");
  const data = fs.readFileSync(filePath, "utf8");

  const lines = data.trim().split("\n");
  const map = {};

  for (let i = 1; i < lines.length; i++) { 
    const [email, college] = lines[i].split(",");
    map[email.trim().toLowerCase()] = college.trim();
  }

  return map;
}
const collegeMap = collegeMap();

module.exports = collegeMap;
