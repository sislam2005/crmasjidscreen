let startTimes = [];
let jamatTimes = [];
let jummahKhutbah, jummahSalah;

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

        let fridayFound = false;  // Flag to check if Friday is present in the data

        jsonData.forEach(entry => {
            const date = new Date(entry["d_date"]);
            if (date.getDay() === 5) {  // 5 means Friday
                fridayFound = true;
                // Show the Jummah time inputs
                document.getElementById('jummahInputs').style.display = 'block';
            }

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

            // If the date is a Friday, we will add the Jummah times (after they're inputted)
            if (date.getDay() === 5) {
                if (!jummahKhutbah || !jummahSalah) {
                    alert("Please input the Jummah times before proceeding.");
                    return;
                }
                jamatEntry["jumuah1"] = jummahKhutbah;
                jamatEntry["jumuah2"] = jummahSalah;
            }

            jamatTimes.push(jamatEntry);
        });

        // If no Fridays were found, alert the user
        if (!fridayFound) {
            alert("No Fridays found in the uploaded data.");
            return;
        }

        // Show download buttons after processing the file
        document.getElementById('downloadStartTimes').style.display = 'inline-block';
        document.getElementById('downloadJamatTimes').style.display = 'inline-block';
    };

    reader.readAsText(file);
}

// Function to handle Jummah times input and trigger file processing
function submitJummahTimes() {
    jummahKhutbah = document.getElementById('jummahKhutbah').value;
    jummahSalah = document.getElementById('jummahSalah').value;

    // Check if both Jummah times are filled
    if (!jummahKhutbah || !jummahSalah) {
        alert("Please input both Jummah Khutbah and Salah times.");
        return;
    }

    // Hide the Jummah input fields after submission
    document.getElementById('jummahInputs').style.display = 'none';

    // Proceed with processing the file
    processFile();
}

// Function to download the processed JSON files
function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 4)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
