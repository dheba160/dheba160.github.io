document.addEventListener('DOMContentLoaded', (event) => {
    // --- Earnings Data (Earnings Per Second in USD) ---
    // Note: These are estimates based on publicly available data and can fluctuate.
    const earningsPerSecond = {
        bezos: 985,      // Based on Amazon profits. [20]
        musk: 631,       // Based on a 24-hour timeframe calculation of net worth increase. [18]
        trump: 12,       // Based on reported $1.6 billion over 4 years.
        page: 951,       // Based on a $30 billion net worth increase in a year.
        arnault: 196,    // Based on LVMH's performance. [14]
        zuckerberg: 469, // Based on Meta's profits. [3, 5]
        gates: 117       // Based on estimated daily earnings. [21]
    };

    // --- DOM Elements ---
    const personSelect = document.getElementById('person-select');
    const earningsDisplay = document.getElementById('earnings-display');
    
    // --- State Variables ---
    let selectedPerson = 'bezos'; // Default person
    let earningsCounter = 0;
    let intervalId = null; // To hold our interval's ID

    // --- Functions ---
    
    // Function to start the earnings counter
    function startCounter() {
        // Clear any existing interval to prevent multiple counters running
        if (intervalId) {
            clearInterval(intervalId);
        }
        
        // Reset the counter
        earningsCounter = 0;
        
        // Get the earnings rate for the selected person
        const rate = earningsPerSecond[selectedPerson];
        
        // Start a new interval that runs every second (1000 milliseconds)
        intervalId = setInterval(() => {
            earningsCounter += rate;
            // Format the number to look like currency
            earningsDisplay.textContent = `$${earningsCounter.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }, 1000);
    }

    // --- Event Listeners ---
    
    // Listen for changes on the dropdown menu
    personSelect.addEventListener('change', (e) => {
        // Update the selected person
        selectedPerson = e.target.value;
        // Restart the counter with the new person's rate
        startCounter();
    });

    // --- Initial Call ---
    // Start the counter for the default person when the page loads
    startCounter();
});
