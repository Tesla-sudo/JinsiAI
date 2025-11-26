const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const CSV_FILE = path.join(DATA_DIR, 'farmer_data.csv');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log("Created data/ folder");
}

if (!fs.existsSync(CSV_FILE)) {
  const header = "timestamp,farmerId,eventType,disease,cropType,co2SavedKg,waterSavedLiters,location,incomeImpactKsh,adviceGiven,conversationId\n";
  fs.writeFileSync(CSV_FILE, header);
  console.log("Created farmer_data.csv with correct header");
}

const pushToCSV = (data) => {
  try {
    const row = [
      new Date().toISOString(),
      (data.farmerId || "anon").replace(/,/g, ""),
      (data.eventType || "query"),
      (data.disease || "").replace(/,/g, " ").replace(/\n/g, " "),
      (data.cropType || ""),
      data.co2SavedKg || 0,
      data.waterSavedLiters || 0,
      (data.location || "Kenya").replace(/,/g, " "),
      data.incomeImpactKsh || 0,
      `"${(data.adviceGiven || "").replace(/"/g,'""').substring(0,500)}"`,
      data.conversationId || ""
    ];

    const line = row.join(",") + "\n";
    fs.appendFileSync(CSV_FILE, line);
    console.log("Data saved → data/farmer_data.csv");
  } catch (err) {
    console.error("CSV SAVE FAILED:", err.message);
  }
};

module.exports = { pushToCSV };
