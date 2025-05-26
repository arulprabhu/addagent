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
    // Add delete bin to existing agent items
    function addDeleteBinToAgentItem(agentItem) {
        if (!agentItem.querySelector('.delete-bin')) {
            const deleteBin = document.createElement('div');
            deleteBin.className = 'delete-bin';
            deleteBin.setAttribute('title', 'Remove agent');            deleteBin.addEventListener('click', function(event) {
                event.stopPropagation();
                // Remove the agent item with improved smooth animation
                // First shrink height slightly while fading
                agentItem.style.transition = 'all 0.3s ease-in-out';
                agentItem.style.opacity = '0';
                agentItem.style.transform = 'translateY(10px) scale(0.98)';
                agentItem.style.maxHeight = (agentItem.offsetHeight * 0.8) + 'px';
                agentItem.style.overflow = 'hidden';
                
                setTimeout(() => {
                    // Then smoothly collapse height to 0
                    agentItem.style.transition = 'all 0.2s ease-in-out';
                    agentItem.style.maxHeight = '0px';
                    agentItem.style.padding = '0px';
                    agentItem.style.margin = '0px';
                    
                    setTimeout(() => {
                        agentItem.remove();
                    }, 200);
                }, 300);
            });
            agentItem.appendChild(deleteBin);
        }
    }
    
    // Add delete buttons to any existing agent items
    document.querySelectorAll('.added-agent-item').forEach(agentItem => {
        addDeleteBinToAgentItem(agentItem);
    });
    
    // Set up the add agents button to toggle the agents tray
    const addAgentsBtn = document.getElementById('add-agents-btn');
    const agentsTray = document.getElementById('agents-tray');
    
    if (addAgentsBtn && agentsTray) {
        // Function to position the tray
        function positionTray() {
            const btnRect = addAgentsBtn.getBoundingClientRect();
            agentsTray.style.top = (btnRect.bottom + 5) + 'px'; // 5px below the button
            agentsTray.style.right = (window.innerWidth - btnRect.right) + 'px'; // Align right edge with button
        }
        
        // Initially hide the Agents Tray
        agentsTray.style.display = 'none';
        
        // Toggle the Agents Tray when the Add Agents button is clicked
        addAgentsBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent document click from immediately closing it
            if (agentsTray.style.display === 'none' || !agentsTray.style.display) {
                positionTray(); // Position the tray properly
                agentsTray.style.display = 'flex';
            } else {
                agentsTray.style.display = 'none';
            }
        });
        
        // Close the Agents Tray when clicking outside
        document.addEventListener('click', function(event) {
            if (!agentsTray.contains(event.target) && !addAgentsBtn.contains(event.target)) {
                agentsTray.style.display = 'none';
            }
        });
        
        // Add window resize handler
        window.addEventListener('resize', function() {
            if (agentsTray.style.display === 'flex') {
                positionTray();
            }
        });
    }
    // Set up the agent list with scrolling but no visible scrollbar
    const agentList = document.querySelector('.agent-list');
    
    // Set inline styles to ensure scrolling works with no visible scrollbar
    agentList.style.overflowY = 'scroll';
    agentList.style.msOverflowStyle = 'none'; // Hide scrollbar in IE/Edge
    agentList.style.scrollbarWidth = 'none'; // Hide scrollbar in Firefox
    
    // The footer border is now handled by CSS
    
    // Set up the Get more agents button
    const getMoreAgentsBtn = document.querySelector('.get-more-agents-btn');
    if (getMoreAgentsBtn) {
        getMoreAgentsBtn.addEventListener('click', function() {
            console.log('Get more agents button clicked');
            // Add action logic here - e.g., navigate to store
        });
    }
      // Set up the Add to plan buttons
    const buttons = document.querySelectorAll('.add-to-plan-btn');
    const contentSection = document.querySelector('.content');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Store original text
            const originalText = this.innerHTML;
            const agentItem = this.closest('.agent-item');
            const agentName = agentItem.querySelector('.agent-name').textContent;
            const agentPublisher = agentItem.querySelector('.agent-publisher')?.textContent || '';
            const agentLogo = agentItem.querySelector('svg').cloneNode(true);

            // Show spinner
            this.innerHTML = '<span class="spinner"></span>';
            this.classList.add('loading');
            this.disabled = true; // Disable button during loading

            // Simulate network request
            setTimeout(() => {                if (agentName === 'Miro') {
                    const errorMessageDiv = agentItem.querySelector('.error-message');
                    errorMessageDiv.textContent = 'Unable to add this agent';
                    errorMessageDiv.style.display = 'block';
                    agentItem.style.minHeight = '78px'; // Increase height to accommodate error message (66px + 12px for error)
                    // Restore button to its original state or a specific error state if desired
                    this.innerHTML = originalText; // Or something like 'Error'
                    this.classList.remove('loading');
                    this.disabled = false; // Re-enable or style as error
                } else {
                    this.innerHTML = 'Added';
                    this.classList.remove('loading');
                    this.classList.add('added');
                    this.disabled = true; // Button remains disabled                    // Add agent to L2 screen
                    const newAgentItem = document.createElement('div');
                    newAgentItem.className = 'added-agent-item';
                    
                    // Create agent info-button wrapper (to match the agent-tray structure)
                    const wrapperDiv = document.createElement('div');
                    wrapperDiv.className = 'agent-info-button-wrapper';
                    
                    // Create agent info
                    const agentInfoDiv = document.createElement('div');
                    agentInfoDiv.className = 'agent-info';
                    
                    // Add logo
                    agentInfoDiv.appendChild(agentLogo);
                    
                    // Add text info with proper styling for vertical centering
                    const textInfo = document.createElement('div');
                    textInfo.style.display = 'flex';
                    textInfo.style.flexDirection = 'column';
                    textInfo.style.justifyContent = 'center';
                    textInfo.style.height = '42px';
                    textInfo.style.margin = '0';
                    textInfo.style.padding = '0';
                    
                    const nameDiv = document.createElement('div');
                    nameDiv.className = 'agent-name';
                    nameDiv.textContent = agentName;
                    
                    const publisherDiv = document.createElement('div');
                    publisherDiv.className = 'agent-publisher';
                    publisherDiv.textContent = agentPublisher;
                    
                    textInfo.appendChild(nameDiv);
                    textInfo.appendChild(publisherDiv);
                    agentInfoDiv.appendChild(textInfo);
                      wrapperDiv.appendChild(agentInfoDiv);
                    newAgentItem.appendChild(wrapperDiv);
                    
                    // Add delete bin icon that shows on hover
                    const deleteBin = document.createElement('div');
                    deleteBin.className = 'delete-bin';
                    deleteBin.setAttribute('title', 'Remove agent');
                    deleteBin.addEventListener('click', function(event) {
                        event.stopPropagation();
                        // Remove the agent item with animation
                        newAgentItem.style.opacity = '0';
                        newAgentItem.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            newAgentItem.remove();
                        }, 300);
                    });
                    newAgentItem.appendChild(deleteBin);
                      
                    // Add to content section
                    contentSection.appendChild(newAgentItem);
                    
                    // Note: We're no longer hiding the agents tray automatically
                }
            }, 2000);
        });
    });
});
