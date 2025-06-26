// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const mentallyTiredInput = document.getElementById('mentallyTired');
    const isLateInput = document.getElementById('isLate');
    const lowEnergyInput = document.getElementById('lowEnergy');
    const breakDurationInput = document.getElementById('breakDuration');
    const restedEnoughInput = document.getElementById('restedEnough');
    const drankCoffeeInput = document.getElementById('drankCoffee');
    const getRecommendationBtn = document.getElementById('getRecommendationBtn');
    const recommendationOutput = document.getElementById('outputMessage');
    const followUpQuestionsDiv = document.getElementById('followUpQuestions');
    const messageBox = document.getElementById('messageBox');
    const messageContent = document.getElementById('messageContent');
    const closeMessageBoxBtn = document.getElementById('closeMessageBox');

    // State variables to track if a break was recommended and if follow-up is needed
    let breakWasRecommended = false;
    let initialRecommendationGiven = false;

    // Function to display a custom message box (replaces alert())
    function showMessageBox(message) {
        messageContent.textContent = message;
        messageBox.classList.remove('hidden');
    }

    // Event listener for closing the custom message box
    closeMessageBoxBtn.addEventListener('click', () => {
        messageBox.classList.add('hidden');
    });

    // Event listener for the "Get Recommendation" button
    getRecommendationBtn.addEventListener('click', () => {
        // Read input values
        const M = mentallyTiredInput.checked; // Mentally Tired
        const L = isLateInput.checked;        // Late in the day
        const E = lowEnergyInput.checked;     // Low Energy
        const B_duration = parseInt(breakDurationInput.value, 10); // Break duration
        const B = B_duration > 35;            // Break longer than 35 min

        // Follow-up states (only relevant if follow-up questions are shown)
        const R = restedEnoughInput.checked;  // Rest is enough
        const C = drankCoffeeInput.checked;   // Drank coffee

        let recommendation = '';
        let showFollowUp = false; // Flag to determine if follow-up questions should be shown

        // --- Core Logic based on Flowchart and Logical Statements ---

        // IF M THEN T (If mentally tired, take a break)
        if (M) {
            recommendation = 'You are mentally tired. It\'s time to TAKE A BREAK!';
            breakWasRecommended = true; // Set flag
            showFollowUp = true; // After recommending a break, follow-up questions become relevant
        }
        // IF ¬M ∧ ¬L THEN short break (Not tired, not late, take a short break)
        else if (!M && !L) {
            recommendation = 'You are doing great! A SHORT BREAK might still be beneficial.';
            breakWasRecommended = false; // This is a suggestion, not a forced break scenario
            showFollowUp = false; // No immediate follow-up needed for a short break suggestion
        }
        // IF ¬M ∧ L THEN more frequent breaks (Not tired, but it's late, take more frequent breaks)
        else if (!M && L) {
            recommendation = 'It\'s getting late. Consider taking MORE FREQUENT BREAKS.';
            breakWasRecommended = false; // Not a forced break scenario
            showFollowUp = false; // No immediate follow-up needed
        }

        // --- Follow-up Logic (applies if initial recommendation was to take a break or if previously took one) ---
        // This part needs to be considered for subsequent clicks or when a break has been evaluated.
        // If an initial recommendation has been given and follow-up questions are now visible,
        // we re-evaluate based on the 'after break' scenario.

        if (initialRecommendationGiven) { // Only re-evaluate if this is a subsequent check
            // IF T ∧ B THEN ask: continue or end (If took a break and break was longer than 35 min)
            // This condition is tricky as 'T' is 'take a break' action. We interpret 'T' as 'a break was taken'.
            if (breakWasRecommended && B) { // Assuming 'breakWasRecommended' means a break was taken
                recommendation = 'You had a long break. You can now choose to CONTINUE studying or END your session.';
                // Reset breakWasRecommended after this decision point
                breakWasRecommended = false;
            }
            // IF ¬B ∧ E THEN C (If break not long enough AND energy is low, suggest coffee)
            else if (!B && E) { // !B is break duration <= 35 min
                recommendation = 'Your break was short and energy is low. SUGGEST YOU DRINK COFFEE.';
            }
            // IF E ∧ C THEN S (If energy is low AND drank coffee, continue studying)
            else if (E && C) {
                recommendation = 'Energy is low, but you drank coffee. You can now CONTINUE STUDYING!';
            }
            // IF ¬E ∧ R THEN S (If energy is NOT low AND rest is enough, continue studying)
            else if (!E && R) {
                recommendation = 'You\'re not low on energy and feel rested. You can now CONTINUE STUDYING!';
            }
            // IF M ∧ ¬R ∧ ¬C THEN T (If mentally tired AND rest not enough AND didn't drink coffee, take another break)
            // This is a re-evaluation scenario after a previous break.
            else if (M && !R && !C) {
                recommendation = 'You are still mentally tired, not rested enough, and haven\'t had coffee. TAKE ANOTHER BREAK!';
                breakWasRecommended = true; // Another break is recommended
                showFollowUp = true; // Follow-up still relevant for the new break
            }
        }

        // Display the recommendation
        recommendationOutput.textContent = recommendation;
        recommendationOutput.classList.add('recommendation-highlight'); // Add visual feedback

        // Show/hide follow-up questions
        if (showFollowUp || initialRecommendationGiven) { // Always show after initial interaction
            followUpQuestionsDiv.classList.remove('hidden');
        } else {
            followUpQuestionsDiv.classList.add('hidden');
            // Reset follow-up checkboxes if questions are hidden
            restedEnoughInput.checked = false;
            drankCoffeeInput.checked = false;
        }

        // Set flag indicating an initial recommendation has been given for subsequent evaluations
        initialRecommendationGiven = true;
    });

    // Initial message on load
    recommendationOutput.textContent = 'Welcome! Enter your current state to get started.';
    recommendationOutput.classList.remove('recommendation-highlight'); // No highlight initially

    // Optional: Reset button functionality for a fresh start (not explicitly requested but useful)
    // const resetButton = document.createElement('button');
    // resetButton.textContent = 'Reset';
    // resetButton.className = 'w-full bg-gray-400 text-white py-2 px-4 rounded-lg font-bold text-lg mt-4 shadow hover:bg-gray-500 transition-all duration-300';
    // resetButton.addEventListener('click', () => {
    //     mentallyTiredInput.checked = false;
    //     isLateInput.checked = false;
    //     lowEnergyInput.checked = false;
    //     breakDurationInput.value = '';
    //     restedEnoughInput.checked = false;
    //     drankCoffeeInput.checked = false;
    //     recommendationOutput.textContent = 'Your recommendation will appear here.';
    //     recommendationOutput.classList.remove('recommendation-highlight');
    //     followUpQuestionsDiv.classList.add('hidden');
    //     breakWasRecommended = false;
    //     initialRecommendationGiven = false;
    // });
    // getRecommendationBtn.parentNode.insertBefore(resetButton, getRecommendationBtn.nextSibling);
});
