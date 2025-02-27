document.addEventListener('DOMContentLoaded', function() {
    // Define the temperature data
    const temperatureData = {
        "Lowest Minimum": [
            { rank: 1, station: "Gjoa Haven", temperature: -64.0 },
            { rank: 2, station: "Dikson", temperature: -61.1 },
            { rank: 3, station: "Iqaluit", temperature: -58.0 },
            { rank: 4, station: "Yakutsk", temperature: -57.2 },
            { rank: 5, station: "Anadyr", temperature: -54.3 },
            { rank: 6, station: "Yellowknife", temperature: -53.0 },
            { rank: 7, station: "Ulaanbaatar", temperature: -52.9 },
            { rank: 8, station: "Nuuk", temperature: -51.3 },
            { rank: 9, station: "Fairbanks", temperature: -50.9 },
            { rank: 10, station: "Novosibirsk", temperature: -50.7 }
        ],
        "Lowest Mean": [
            { rank: 1, station: "Gjoa Haven", temperature: -14.4 },
            { rank: 2, station: "Dikson", temperature: -11.1 },
            { rank: 3, station: "Iqaluit", temperature: -9.3 },
            { rank: 4, station: "Yakutsk", temperature: -8.8 },
            { rank: 5, station: "Anadyr", temperature: -6.9 },
            { rank: 6, station: "Yellowknife", temperature: -4.3 },
            { rank: 7, station: "Fairbanks", temperature: -2.3 },
            { rank: 8, station: "Nuuk", temperature: -1.4 },
            { rank: 9, station: "Ulaanbaatar", temperature: -0.4 },
            { rank: 10, station: "Whitehorse", temperature: -0.1 }
        ],
        "Lowest Maximum": [
            { rank: 1, station: "Gjoa Haven", temperature: 36.5 },
            { rank: 2, station: "Dikson", temperature: 37.1 },
            { rank: 3, station: "Iqaluit", temperature: 37.7 },
            { rank: 4, station: "Yakutsk", temperature: 40.0 },
            { rank: 5, station: "Anadyr", temperature: 43.1 },
            { rank: 6, station: "Nuuk", temperature: 46.5 },
            { rank: 7, station: "Yellowknife", temperature: 47.4 },
            { rank: 8, station: "Murmansk", temperature: 48.0 },
            { rank: 9, station: "Anchorage", temperature: 49.8 },
            { rank: 10, station: "Tromsø", temperature: 49.9 }
        ],
        "Highest Minimum": [
            { rank: 1, station: "Lodwar", temperature: -18.4 },
            { rank: 2, station: "Juba", temperature: -19.3 },
            { rank: 3, station: "Hat Yai", temperature: -19.6 },
            { rank: 4, station: "Niamey", temperature: -19.6 },
            { rank: 5, station: "Bangkok", temperature: -19.9 },
            { rank: 6, station: "Managua", temperature: -20.0 },
            { rank: 7, station: "Yangon", temperature: -20.0 },
            { rank: 8, station: "N'Djamena", temperature: -20.3 },
            { rank: 9, station: "Bosaso", temperature: -20.2 },
            { rank: 10, station: "Assab", temperature: -20.7 }
        ],
        "Highest Mean": [
            { rank: 1, station: "Lodwar", temperature: 29.3 },
            { rank: 2, station: "Djibouti", temperature: 29.9 },
            { rank: 3, station: "Assab", temperature: 30.5 },
            { rank: 4, station: "Bosaso", temperature: 30.0 },
            { rank: 5, station: "Aden", temperature: 29.1 },
            { rank: 6, station: "Dubai", temperature: 26.9 },
            { rank: 7, station: "Khartoum", temperature: 29.9 },
            { rank: 8, station: "Abéché", temperature: 29.4 },
            { rank: 9, station: "Garissa", temperature: 29.3 },
            { rank: 10, station: "N'Djamena", temperature: 28.3 }
        ],
        "Highest Maximum": [
            { rank: 1, station: "Makassar", temperature: 85.6 },
            { rank: 2, station: "Wau", temperature: 84.4 },
            { rank: 3, station: "Lodwar", temperature: 83.7 },
            { rank: 4, station: "Abéché", temperature: 82.2 },
            { rank: 5, station: "Bangkok", temperature: 82.3 },
            { rank: 6, station: "Dubai", temperature: 82.0 },
            { rank: 7, station: "Colombo", temperature: 81.4 },
            { rank: 8, station: "Djibouti", temperature: 81.5 },
            { rank: 9, station: "Sokoto", temperature: 81.6 },
            { rank: 10, station: "Luanda", temperature: 81.4 }
        ]
    };

    // Function to create and populate a table
    function populateTable(tableId, data) {
        const table = document.getElementById(tableId);
        
        // Create table header
        const headerRow = table.insertRow();
        ['Rank', 'Station', 'Temperature (°C)'].forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            headerRow.appendChild(header);
        });

        // Add data rows
        data.forEach(item => {
            const row = table.insertRow();
            const rankCell = row.insertCell();
            const stationCell = row.insertCell();
            const tempCell = row.insertCell();

            rankCell.textContent = item.rank;
            stationCell.textContent = item.station;
            tempCell.textContent = item.temperature;
        });
    }

    // Populate all tables
    populateTable('lowestMinTable', temperatureData['Lowest Minimum']);
    populateTable('lowestMeanTable', temperatureData['Lowest Mean']);
    populateTable('lowestMaxTable', temperatureData['Lowest Maximum']);
    populateTable('highestMinTable', temperatureData['Highest Minimum']);
    populateTable('highestMeanTable', temperatureData['Highest Mean']);
    populateTable('highestMaxTable', temperatureData['Highest Maximum']);
});