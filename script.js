// No JavaScript is strictly required for the basic layout and styling.
// This file is included for potential future interactivity.

// Example: You could add event listeners to the buttons if needed.
// const buttons = document.querySelectorAll('.add-to-plan-btn');
// buttons.forEach(button => {
//     button.addEventListener('click', () => {
//         console.log(button.closest('.agent-item').querySelector('.agent-name').textContent + ' "Add to plan" clicked');
//         // Add your logic here, e.g., making an API call or updating the UI
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.add-to-plan-btn');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Store original text
            const originalText = this.innerHTML;
            const agentItem = this.closest('.agent-item');
            const agentName = agentItem.querySelector('.agent-name').textContent;

            // Show spinner
            this.innerHTML = '<span class="spinner"></span>';
            this.classList.add('loading');
            this.disabled = true; // Disable button during loading

            // Simulate network request
            setTimeout(() => {
                if (agentName === 'Miro') {
                    const errorMessageDiv = agentItem.querySelector('.error-message');
                    errorMessageDiv.textContent = 'Unable to add this agent';
                    errorMessageDiv.style.display = 'block';
                    agentItem.style.paddingBottom = '12px'; // Keep original bottom padding
                    agentItem.style.maxHeight = '150px'; // Expand to show error
                    // Restore button to its original state or a specific error state if desired
                    this.innerHTML = originalText; // Or something like 'Error'
                    this.classList.remove('loading');
                    this.disabled = false; // Re-enable or style as error
                } else {
                    this.innerHTML = 'Added';
                    this.classList.remove('loading');
                    this.classList.add('added');
                    // Button remains disabled as per requirement
                }
            }, 2000);
        });
    });
});
