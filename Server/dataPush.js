const fs = require('fs');
const path = require('path');

const CSV_FILE = path.join(__dirname, 'data', 'farmer_data.csv');

// Auto-create folder + header if missing
if (!fs.existsSync(path.dirname(CSV_FILE))) {
  fs.mkdirSync(path.dirname(CSV_FILE), { recursive: true });
}
if (!fs.existsSync(CSV_FILE)) {
  const header = "timestamp,farmerId,eventType,disease,cropType,co2SavedKg,waterSavedLiters,location,incomeImpactKsh,adviceGiven\n";
  fs.writeFileSync(CSV_FILE, header);
  console.log("Created new farmer_data.csv");
}

const pushToCSV = (data) => {
  try {
    const line = [
      new Date().toISOString(),
      data.farmerId || "anonymous",
      data.eventType || "query",
      (data.disease || "").replace(/,/g, " "),
      (data.cropType || "").replace(/,/g, " "),
      data.co2SavedKg || 0,
      data.waterSavedLiters || 0,
      (data.location || "Unknown").replace(/,/g, " "),
      data.incomeImpactKsh || 0,
      `"${(data.adviceGiven || "").replace(/"/g, '""').substring(0, 500)}"`
    ].join(",") + "\n";

    fs.appendFileSync(CSV_FILE, line);
    console.log("✅ Data saved to farmer_data.csv");
  } catch (err) {
    console.error("❌ CSV save failed:", err.message);
  }
};

module.exports = { pushToCSV };

// // server/dataPush.js
// const fs = require('fs');
// const path = require('path');

// const CSV_FILE = path.join(__dirname, 'data', 'farmer_data.csv');

// function pushToAnalytics(data) {
//   const row = [
//    new Date().toISOString(),
//    data.farmerId || 'unknown',
//    data.eventType || 'query',
//    (data.disease || 'None').replace(/,/g, ''),
//    data.co2SavedKg || 0,
//    data.waterSavedLiters || 0,
//    data.location || 'Kenya',
//    data.incomeImpactKsh || 0,
//    data.cropType || 'Unknown',
//    `"${(data.adviceGiven || '').replace(/"/g, '""').substring(0, 500)}"`
//  ].join(',') + '\n';

//  fs.appendFileSync(CSV_FILE, row);
//  console.log('Data saved → farmer_data.csv', data.eventType);
// }

// module.exports = { pushToAnalytics };




// // server/dataPush.js
// const fs = require('fs');
// const path = require('path');

// const CSV_FILE = path.join(__dirname, 'farmer_data.csv');

// if (!fs.existsSync(CSV_FILE)) {
//   const headers = 'Timestamp,FarmerID,EventType,Disease,CO₂ Saved (kg),Water Saved (liters),Location,Income Impact (KSh),Crop Type,Advice Given\n';
//   fs.writeFileSync(CSV_FILE, headers);
//   console.log('CSV created with perfect Power BI headers');
// }

// function pushToCSV(data) {
//   const row = [
//     new Date().toISOString(),
//     data.farmerId || 'unknown',
//     data.eventType || 'query',
//     (data.disease || 'None').replace(/,/g, ' '),
//     data.co2SavedKg || 0,
//     data.waterSavedLiters || 0,
//     data.location || 'Kenya',
//     data.incomeImpactKsh || 0,
//     data.cropType || 'Unknown',
//     `"${(data.adviceGiven || '').replace(/"/g, '""').substring(0, 1000)}"`
//   ].join(',') + '\n';

//   fs.appendFileSync(CSV_FILE, row);
//   console.log('Data pushed to Power BI:', data.eventType, data.co2SavedKg + 'kg');
// }

// module.exports = { pushToCSV };






// // // server/dataPush.js
// // const fs = require('fs');
// // const path = require('path');

// // const CSV_FILE = path.join(__dirname, 'farmer_data.csv');

// // // Initialize CSV with PERFECT column names for Power BI
// // if (!fs.existsSync(CSV_FILE)) {
// //   const headers = [
// //     'Timestamp',
// //     'FarmerID',
// //     'EventType',
// //     'Disease',
// //     'CO₂ Saved (kg)',        // ← Clean name
// //     'Water Saved (liters)',  // ← Clean name
// //     'Location',
// //     'Income Impact (KSh)',   // ← Clean name
// //     'Crop Type',
// //     'Advice Given'
// //   ].join(',') + '\n';
// //   fs.writeFileSync(CSV_FILE, headers);
// //   console.log('CSV created with clean headers for Power BI');
// // }

// // function pushToCSV(data) {
// //   const row = [
// //     new Date().toISOString(),
// //     data.farmerId || 'unknown',
// //     data.eventType || 'unknown',
// //     (data.disease || 'None').replace(/,/g, ''),
// //     data.co2SavedKg || 0,
// //     data.waterSavedLiters || 0,
// //     data.location || 'Unknown',
// //     data.incomeImpactKsh || 0,
// //     data.cropType || 'Unknown',
// //     (data.adviceGiven || '').replace(/,/g, '').replace(/\n/g, ' ').substring(0, 500)
// //   ].join(',') + '\n';

// //   fs.appendFileSync(CSV_FILE, row);
// //   console.log('Pushed to Power BI:', data.eventType, data.co2SavedKg + 'kg CO₂');
// // }

// // module.exports = { pushToCSV };

























// // // // server/dataPush.js
// // // const fs = require('fs');
// // // const path = require('path');

// // // const CSV_FILE = path.join(__dirname, 'farmer_data.csv');

// // // // Initialize CSV with headers if it doesn't exist
// // // if (!fs.existsSync(CSV_FILE)) {
// // //   const headers = [
// // //     'Timestamp',
// // //     'FarmerID',
// // //     'EventType',
// // //     'Disease',
// // //     'CO2_Saved_Kg',
// // //     'Water_Saved_Liters',
// // //     'Location',
// // //     'Income_Impact_KSH',
// // //     'Crop_Type',
// // //     'Advice_Given'
// // //   ].join(',') + '\n';
// // //   fs.writeFileSync(CSV_FILE, headers);
// // //   console.log('CSV file created with headers');
// // // }

// // // function pushToCSV(data) {
// // //   const row = [
// // //     new Date().toISOString(),
// // //     data.farmerId || 'unknown',
// // //     data.eventType || 'unknown',
// // //     (data.disease || '').replace(/,/g, ''), // sanitize commas
// // //     data.co2SavedKg || 0,
// // //     data.waterSavedLiters || 0,
// // //     data.location || 'Unknown',
// // //     data.incomeImpactKsh || 0,
// // //     data.cropType || 'Unknown',
// // //     (data.adviceGiven || '').replace(/,/g, '').replace(/\n/g, ' ') // clean text
// // //   ].join(',') + '\n';

// // //   fs.appendFileSync(CSV_FILE, row);
// // //   console.log('Pushed to CSV:', row.trim());
// // // }

// // // module.exports = { pushToCSV };