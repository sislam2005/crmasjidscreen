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
        
        startTimes = [];
        jamatTimes = [];
        let fridayFound = false;

        jsonData.forEach(entry => {
            const date = new Date(entry["d_date"]);
            if (date.getDay() === 5) {
                fridayFound = true;
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

            // Prepare jamat times entry
            const jamatEntry = {
                "date": entry["d_date"],
                "fajr": entry["fajr_jamah"],
                "dhuhr": entry["zuhr_jamah"],
                "asr": entry["asr_jamah"],
                "isha": entry["isha_jamah"]
            };

            jamatTimes.push(jamatEntry);
        });

        if (!fridayFound) {
            alert("No Fridays found in the uploaded data.");
            return;
        }

        // Wait for user to submit Jummah times
        document.getElementById('submitJummahBtn').addEventListener('click', submitJummahTimes);
    };

    reader.readAsText(file);
}

function submitJummahTimes() {
    jummahKhutbah = document.getElementById('jummahKhutbah').value;
    jummahSalah = document.getElementById('jummahSalah').value;

    if (!jummahKhutbah || !jummahSalah) {
        alert("Please input both Jummah Khutbah and Salah times.");
        return;
    }

    // Add Jummah times to jamatTimes (Ensure Friday entries are updated)
    jamatTimes.forEach(entry => {
        const date = new Date(entry["date"]);
        if (date.getDay() === 5) {  // Only for Fridays
            entry["jumuah1"] = jummahKhutbah;
            entry["jumuah2"] = jummahSalah;
        }
    });

    // Hide the input fields after submission
    document.getElementById('jummahInputs').style.display = 'none';

    alert("Jummah times added successfully!");
}

function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 4)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
