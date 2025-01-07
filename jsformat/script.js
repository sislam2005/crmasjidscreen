let startTimes = [];
let jamatTimes = [];

function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert("Please upload a JSON file.");
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        const jsonData = JSON.parse(e.target.result);
        
        // Reset the arrays for each upload
        startTimes = [];
        jamatTimes = [];

        jsonData.forEach(entry => {
            // Extract start times
            startTimes.push({
                "date": entry["d_date"],
                "fajr": entry["fajr_begins"],
                "sunrise": entry["sunrise"],
                "dhuhr": entry["zuhr_begins"],
                "asr": entry["asr_mithl_1"],
                "maghrib": entry["maghrib_begins"],
                "isha": entry["isha_begins"]
            });

            // Prepare the jamat times entry
            const jamatEntry = {
                "date": entry["d_date"],
                "fajr": entry["fajr_jamah"],
                "dhuhr": entry["zuhr_jamah"],
                "asr": entry["asr_jamah"],
                "isha": entry["isha_jamah"]
            };

            // If the date is a Friday, ask for Jummah times
            const date = new Date(entry["d_date"]);
            if (date.getDay() === 5) {  // 5 means Friday
                document.getElementById('jummahInputs').style.display = 'block';

                const jummahKhutbah = document.getElementById('jummahKhutbah').value;
                const jummahSalah = document.getElementById('jummahSalah').value;

                // If Jummah times are provided, add them to the entry
                if (jummahKhutbah && jummahSalah) {
                    jamatEntry["jumuah1"] = jummahKhutbah;
                    jamatEntry["jumuah2"] = jummahSalah;
                }
            }

            jamatTimes.push(jamatEntry);
        });

        // Show download buttons
        document.getElementById('downloadStartTimes').style.display = 'inline-block';
        document.getElementById('downloadJamatTimes').style.display = 'inline-block';
    };

    reader.readAsText(file);
}

// Function to download the processed JSON files
function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 4)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
