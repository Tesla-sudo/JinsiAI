const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');

// CSV file path (creates if missing)
const csvPath = path.join(__dirname, 'farmEvents.csv');

const initCSV = () => {
  if (!fs.existsSync(csvPath)) {
    const csvWriter = createCsvWriter({
      path: csvPath,
      header: [
        { id: 'farmerId', title: 'farmerId' },
        { id: 'eventType', title: 'eventType' },
        { id: 'disease', title: 'disease' },
        { id: 'co2SavedKg', title: 'co2SavedKg' },
        { id: 'waterSavedLiters', title: 'waterSavedLiters' },
        { id: 'location', title: 'location' },
        { id: 'timestamp', title: 'timestamp' },
        { id: 'incomeImpactKsh', title: 'incomeImpactKsh' }
      ]
    });
    csvWriter.writeRecords([]);  // Create empty file
    console.log('✅ CSV initialized: farmEvents.csv');
  }
};

const pushToCSV = async (eventData) => {
  initCSV();  // Ensure file exists
  const csvWriter = createCsvWriter({ path: csvPath });
  await csvWriter.writeRecords([eventData]);
  console.log('✅ Event pushed to CSV:', eventData.eventType);
};

module.exports = { pushToCSV };