// server/dataPush.js
const fs = require('fs');
const path = require('path');

const CSV_FILE = path.join(__dirname, 'farmer_data.csv');

// Initialize CSV with headers if it doesn't exist
if (!fs.existsSync(CSV_FILE)) {
  const headers = [
    'Timestamp',
    'FarmerID',
    'EventType',
    'Disease',
    'CO2_Saved_Kg',
    'Water_Saved_Liters',
    'Location',
    'Income_Impact_KSH',
    'Crop_Type',
    'Advice_Given'
  ].join(',') + '\n';
  fs.writeFileSync(CSV_FILE, headers);
  console.log('CSV file created with headers');
}

function pushToCSV(data) {
  const row = [
    new Date().toISOString(),
    data.farmerId || 'unknown',
    data.eventType || 'unknown',
    (data.disease || '').replace(/,/g, ''), // sanitize commas
    data.co2SavedKg || 0,
    data.waterSavedLiters || 0,
    data.location || 'Unknown',
    data.incomeImpactKsh || 0,
    data.cropType || 'Unknown',
    (data.adviceGiven || '').replace(/,/g, '').replace(/\n/g, ' ') // clean text
  ].join(',') + '\n';

  fs.appendFileSync(CSV_FILE, row);
  console.log('Pushed to CSV:', row.trim());
}

module.exports = { pushToCSV };