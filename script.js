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
    // Track added agents to sync between L2 and agents tray
    const addedAgents = new Set();
    
    // Add delete bin to existing agent items
    function addDeleteBinToAgentItem(agentItem) {
        if (!agentItem.querySelector('.delete-bin')) {
            const deleteBin = document.createElement('div');
            deleteBin.className = 'delete-bin';
            deleteBin.setAttribute('title', 'Remove agent');
            deleteBin.addEventListener('click', function(event) {
                event.stopPropagation();
                // Get agent name before removal for syncing
                const agentName = agentItem.querySelector('.agent-name').textContent;
                
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
                        // Remove agent from tracking set
                        addedAgents.delete(agentName);
                        agentItem.remove();
                        
                        // Update the tray agents visibility
                        // Only update if the tray is visible
                        if (agentsTray && agentsTray.style.display === 'flex') {
                            updateAgentTrayItems();
                        }
                    }, 200);
                }, 300);
            });
            agentItem.appendChild(deleteBin);
        }
    }
      // Add delete buttons to any existing agent items and track them
    document.querySelectorAll('.added-agent-item').forEach(agentItem => {
        const agentName = agentItem.querySelector('.agent-name').textContent;
        if (agentName) {
            addedAgents.add(agentName);
        }
        addDeleteBinToAgentItem(agentItem);
    });    // Function to update agent tray items based on what's been added
    function updateAgentTrayItems() {
        const trayAgentItems = document.querySelectorAll('#agents-tray .agent-item');
        const agentList = document.querySelector('.agent-list');
        
        // Check if we already have a message element
        let noAgentsMessage = document.getElementById('no-agents-message');
        
        let visibleAgents = 0;
        
        trayAgentItems.forEach(item => {
            const agentName = item.querySelector('.agent-name').textContent;
            const addButton = item.querySelector('.add-to-plan-btn');
            
            if (addedAgents.has(agentName)) {
                // Agent has been added, hide it entirely
                item.style.display = 'none';
            } else {
                // Agent hasn't been added, ensure it's visible and reset button state
                item.style.display = 'flex';
                visibleAgents++;
                if (addButton.classList.contains('added')) {
                    addButton.innerHTML = 'Add to plan';
                    addButton.classList.remove('added', 'loading');
                    addButton.disabled = false;
                }
                item.classList.remove('agent-already-added');
            }
        });
        
        // Handle the case when all agents are added
        if (visibleAgents === 0) {
            if (!noAgentsMessage) {
                noAgentsMessage = document.createElement('div');
                noAgentsMessage.id = 'no-agents-message';
                noAgentsMessage.className = 'no-agents-message';
                noAgentsMessage.textContent = 'All available agents have been added';
                agentList.appendChild(noAgentsMessage);
            }
            noAgentsMessage.style.display = 'block';
        } else if (noAgentsMessage) {
            noAgentsMessage.style.display = 'none';
        }
    }
    
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
                updateAgentTrayItems(); // Update the tray before displaying
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
    }    // Set up the Add to plan buttons
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
            setTimeout(() => {
                if (agentName === 'Miro') {
                    const errorMessageDiv = agentItem.querySelector('.error-message');
                    errorMessageDiv.textContent = 'Unable to add this agent';
                    errorMessageDiv.style.display = 'block';
                    agentItem.style.minHeight = '78px'; // Increase height to accommodate error message (66px + 12px for error)
                    // Restore button to its original state or a specific error state if desired
                    this.innerHTML = originalText; // Or something like 'Error'
                    this.classList.remove('loading');
                    this.disabled = false; // Re-enable or style as error
                } else {
                    // Add agent to tracking set
                    addedAgents.add(agentName);
                    
                    // Update button state
                    this.innerHTML = 'Added';
                    this.classList.remove('loading');
                    this.classList.add('added');
                    this.disabled = true; // Button remains disabled
                    
                    // Update the agent item to show as added
                    agentItem.classList.add('agent-already-added');
                    
                    // Add agent to L2 screen
                    const newAgentItem = document.createElement('div');
                    newAgentItem.className = 'added-agent-item';
                    newAgentItem.setAttribute('data-agent-name', agentName);
                    
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
                        
                        // Remove agent from tracking set
                        addedAgents.delete(agentName);
                        
                        // Remove the agent item with animation
                        newAgentItem.style.transition = 'all 0.3s ease-in-out';
                        newAgentItem.style.opacity = '0';
                        newAgentItem.style.transform = 'translateY(10px) scale(0.98)';
                        newAgentItem.style.maxHeight = (newAgentItem.offsetHeight * 0.8) + 'px';
                        newAgentItem.style.overflow = 'hidden';
                        
                        setTimeout(() => {
                            // Then smoothly collapse height to 0
                            newAgentItem.style.transition = 'all 0.2s ease-in-out';
                            newAgentItem.style.maxHeight = '0px';
                            newAgentItem.style.padding = '0px';
                            newAgentItem.style.margin = '0px';
                                  setTimeout(() => {
                            newAgentItem.remove();
                            // Update the tray if it's visible - make the agent visible again
                            if (agentsTray.style.display === 'flex') {
                                // Find the agent in the tray and make it visible again
                                const trayAgentItems = document.querySelectorAll('#agents-tray .agent-item');
                                trayAgentItems.forEach(item => {
                                    const itemAgentName = item.querySelector('.agent-name').textContent;
                                    if (itemAgentName === agentName) {
                                        item.style.display = 'flex';
                                    }
                                });
                            }
                        }, 200);
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
