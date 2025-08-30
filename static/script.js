// Navigation functions
function showSection(sectionId) {
    document.querySelectorAll('.content-area').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
    document.getElementById('mainMenu').style.display = 'none';

    // Load section-specific data
    if (sectionId === 'petManagement') {
        loadPetManagement();
    } else if (sectionId === 'staffScheduling') {
        loadStaff();
    } else if (sectionId === 'adoptionCenter') {
        loadAdopters();
    } else if (sectionId === 'petStore') {
        loadStoreItems();
    } else if (sectionId === 'outreachPrograms') {
        loadOutreach();
    } else if (sectionId === 'reports') {
        loadReports();
    }
}

function showMainMenu() {
    document.querySelectorAll('.content-area').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('mainMenu').style.display = 'grid';
}

// Modal functions
function showAddPetModal() {
    document.getElementById('addPetModal').style.display = 'block';
}

function showAddStaffModal() {
    document.getElementById('addStaffModal').style.display = 'block';
}

// Adoption Center logic
function showAddAdopterModal() {
    document.getElementById('addAdopterModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Load pet management data
async function loadPetManagement() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        
        document.getElementById('totalPets').textContent = stats.total_pets;
        document.getElementById('availablePets').textContent = stats.available_pets;
        document.getElementById('adoptedPets').textContent = stats.adopted_pets;
        document.getElementById('avgHappiness').textContent = `${stats.average_happiness}%`;
        
        const petsResponse = await fetch('/api/pets');
        const pets = await petsResponse.json();
        displayPets(pets);
    } catch (error) {
        console.error('Error loading pet management:', error);
        showNotification('Failed to load pet data', 'error');
    }
}

// Display pets in the list
function displayPets(pets) {
    const petsList = document.getElementById('petsList');
    
    if (pets.length === 0) {
        petsList.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No pets registered yet. Add your first pet!</p>';
        return;
    }
    
    petsList.innerHTML = pets.map(pet => `
        <div class="pet-card">
            <h4>🐾 ${pet.name}</h4>
            <div class="pet-info">
                <span><strong>Species:</strong> ${pet.species}</span>
                <span><strong>Age:</strong> ${pet.age} years</span>
                <span><strong>Weight:</strong> ${pet.weight} lbs</span>
                <span><strong>Personality:</strong> ${pet.personality}</span>
                <span><strong>Status:</strong> ${pet.adoption_status}</span>
                <span><strong>Special Talent:</strong> ${pet.hidden_talent}</span>
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Happiness Level:</strong>
                <div class="happiness-bar">
                    <div class="happiness-fill" style="width: ${pet.happiness}%"></div>
                </div>
                <span>${pet.happiness}%</span>
            </div>
            <div>
                <button class="btn" onclick="interactWithPet('${pet.pet_id}')">🎮 Interact</button>
                <button class="btn btn-success" onclick="trainPet('${pet.pet_id}')">🎓 Train</button>
                ${pet.for_sale ? `<span style="background: #28a745; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.9rem;">💰 $${pet.price}</span>` : ''}
            </div>
        </div>
    `).join('');
}

// Add new pet
document.getElementById('addPetForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('petName').value,
        species: document.getElementById('petSpecies').value,
        age: document.getElementById('petAge').value,
        weight: document.getElementById('petWeight').value,
        personality: document.getElementById('petPersonality').value,
        price: document.getElementById('petPrice').value,
        for_sale: document.getElementById('forSale').checked,
    };
    
    try {
        const response = await fetch('/api/pets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Pet added successfully!');
            closeModal('addPetModal');
            this.reset();
            loadPetManagement();
        } else {
            showNotification(result.message || 'Failed to add pet', 'error');
        }
    } catch (error) {
        console.error('Error adding pet:', error);
        showNotification('Failed to add pet', 'error');
    }
});

// Add new staff
document.getElementById('addStaffForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('staffName').value,
        role: document.getElementById('staffRole').value,
        experience: document.getElementById('staffExperience').value,
        specialty: document.getElementById('staffSpecialty').value,
        shift: document.getElementById('staffShift').value,
        email: document.getElementById('staffEmail').value,
        phone: document.getElementById('staffPhone').value,
        salary: document.getElementById('staffSalary').value
    };
    try {
        const response = await fetch('/api/staff', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            showNotification('Staff added successfully!');
            closeModal('addStaffModal');
            this.reset();
            loadStaff();
        } else {
            showNotification(result.message || 'Failed to add staff', 'error');
        }
    } catch (error) {
        showNotification('Failed to add staff', 'error');
    }
});

// Adoption Center functions
document.getElementById('addAdopterForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('adopterName').value,
        email: document.getElementById('adopterEmail').value,
        phone: document.getElementById('adopterPhone').value,
        experience: document.getElementById('adopterExperience').value,
        preferred_species: document.getElementById('adopterPreferredSpecies').value,
        budget: document.getElementById('adopterBudget').value,
        living_situation: document.getElementById('adopterLivingSituation').value,
        family_size: document.getElementById('adopterFamilySize').value,
        has_other_pets: document.getElementById('adopterHasOtherPets').value === "true"
    };
    try {
        const response = await fetch('/api/adopters', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            showNotification('Adopter added successfully!');
            closeModal('addAdopterModal');
            this.reset();
            loadAdopters();
        } else {
            showNotification(result.message || 'Failed to add adopter', 'error');
        }
    } catch (error) {
        showNotification('Failed to add adopter', 'error');
    }
});

async function loadAdopters() {
    try {
        const response = await fetch('/api/adopters');
        const adopters = await response.json();
        const adoptersList = document.getElementById('adoptersList');
        if (!adopters.length) {
            adoptersList.innerHTML = '<p>No adopters yet.</p>';
            return;
        }
        adoptersList.innerHTML = adopters.map(a => `
            <div class="pet-card">
                <h4>🏠 ${a.name}</h4>
                <div class="pet-info">
                    <span><strong>Email:</strong> ${a.email}</span>
                    <span><strong>Phone:</strong> ${a.phone}</span>
                    <span><strong>Experience:</strong> ${a.experience}</span>
                    <span><strong>Preferred Species:</strong> ${a.preferred_species}</span>
                    <span><strong>Budget:</strong> $${a.budget}</span>
                    <span><strong>Living Situation:</strong> ${a.living_situation}</span>
                    <span><strong>Family Size:</strong> ${a.family_size}</span>
                    <span><strong>Has Other Pets:</strong> ${a.has_other_pets ? 'Yes' : 'No'}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        showNotification('Failed to load adopters', 'error');
    }
}

// Load staff data
async function loadStaff() {
    try {
        const response = await fetch('/api/staff');
        const staff = await response.json();
        const staffList = document.getElementById('staffList');
        if (!staff.length) {
            staffList.innerHTML = '<p>No staff members yet.</p>';
            return;
        }
        staffList.innerHTML = staff.map(s => `
            <div class="pet-card">
                <h4>👤 ${s.name}</h4>
                <div class="pet-info">
                    <span><strong>Role:</strong> ${s.role}</span>
                    <span><strong>Experience:</strong> ${s.experience} years</span>
                    <span><strong>Specialty:</strong> ${s.specialty}</span>
                    <span><strong>Shift:</strong> ${s.shift}</span>
                    <span><strong>Email:</strong> ${s.email}</span>
                    <span><strong>Phone:</strong> ${s.phone}</span>
                    <span><strong>Salary:</strong> $${s.salary}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        showNotification('Failed to load staff', 'error');
    }
}

// Interact with pet
async function interactWithPet(petId) {
    try {
        const modal = document.getElementById('interactionModal');
        const content = document.getElementById('interactionContent');
        
        // Get pet details
        const response = await fetch('/api/pets');
        const pets = await response.json();
        const pet = pets.find(p => p.pet_id === petId);
        
        if (!pet) {
            showNotification('Pet not found', 'error');
            return;
        }
        
        content.innerHTML = `
            <h2>🐾 Interacting with ${pet.name}</h2>
            <div class="interaction-area">
                <p><strong>Species:</strong> ${pet.species} | <strong>Personality:</strong> ${pet.personality}</p>
                <p><strong>Current Happiness:</strong> ${pet.happiness}%</p>
                <p><strong>Special Talent:</strong> ${pet.hidden_talent}</p>
                
                <div class="interaction-buttons">
                    <button class="interaction-btn" onclick="performInteraction('${petId}', 'play')">🎾 Play</button>
                    <button class="interaction-btn" onclick="performInteraction('${petId}', 'treat')">🦴 Give Treat</button>
                    <button class="interaction-btn" onclick="performInteraction('${petId}', 'pet')">🤗 Pet</button>
                </div>
                
                <div id="interactionResult" style="margin-top: 20px; min-height: 60px;"></div>
            </div>
        `;
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error interacting with pet:', error);
        showNotification('Failed to interact with pet', 'error');
    }
}

// Perform interaction
async function performInteraction(petId, interactionType) {
    try {
        const resultDiv = document.getElementById('interactionResult');
        resultDiv.innerHTML = '<div class="loading"></div> Processing...';
        
        const response = await fetch(`/api/pets/${petId}/interact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ interaction_type: interactionType })
        });
        
        const result = await response.json();
        
        if (result.success) {
            resultDiv.innerHTML = `
                <div class="interaction-result">
                    <p>${result.response}</p>
                    <p><strong>Happiness increased by ${result.happiness_gain}%!</strong></p>
                    <p>New happiness level: ${result.new_happiness}%</p>
                </div>
            `;
            loadPetManagement(); // Refresh the pet list
        } else {
            resultDiv.innerHTML = `
                <div class="interaction-error">
                    <p>${result.message}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error performing interaction:', error);
        document.getElementById('interactionResult').innerHTML = `
            <div class="interaction-error">
                <p>Failed to perform interaction</p>
            </div>
        `;
    }
}

// Train pet
async function trainPet(petId) {
    try {
        const modal = document.getElementById('trainingModal');
        const content = document.getElementById('trainingContent');
        
        // Get pet details
        const response = await fetch('/api/pets');
        const pets = await response.json();
        const pet = pets.find(p => p.pet_id === petId);
        
        if (!pet) {
            showNotification('Pet not found', 'error');
            return;
        }
        
        // Get available training skills (not already known)
        const availableTraining = [
            'Sit', 'Stay', 'Roll Over', 'Fetch', 'Shake Hands', 
            'Spin', 'Play Dead', 'High Five', 'Dance', 'Speak'
        ].filter(skill => !pet.training.includes(skill));
        
        content.innerHTML = `
            <h2>🎓 Training ${pet.name}</h2>
            <div class="training-area">
                <p><strong>Current Skills:</strong> ${pet.training.length > 0 ? pet.training.join(', ') : 'None yet'}</p>
                <p><strong>Happiness:</strong> ${pet.happiness}%</p>
                
                ${availableTraining.length > 0 ? `
                    <h3>Available Training:</h3>
                    <div class="training-options">
                        ${availableTraining.map(skill => 
                            `<button class="training-btn" onclick="startTraining('${petId}', '${skill}')">${skill}</button>`
                        ).join('')}
                    </div>
                ` : '<p>🏆 This pet has learned all available skills!</p>'}
                
                <div id="trainingResult" style="margin-top: 20px; min-height: 60px;"></div>
            </div>
        `;
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error training pet:', error);
        showNotification('Failed to train pet', 'error');
    }
}

// Start training
async function startTraining(petId, skill) {
    try {
        const resultDiv = document.getElementById('trainingResult');
        resultDiv.innerHTML = '<div class="loading"></div> Training in progress...';
        
        const response = await fetch(`/api/pets/${petId}/train`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ skill })
        });
        
        const result = await response.json();
        
        if (result.success) {
            resultDiv.innerHTML = `
                <div class="training-success">
                    <h3>🎉 Training Successful!</h3>
                    <p>${result.message}</p>
                    <p>New happiness level: ${result.new_happiness}%</p>
                </div>
            `;
            loadPetManagement(); // Refresh the pet list
            setTimeout(() => trainPet(petId), 2000); // Refresh training modal
        } else {
            resultDiv.innerHTML = `
                <div class="training-failure">
                    <h3>😅 Training Session Incomplete</h3>
                    <p>${result.message}</p>
                    <p>New happiness level: ${result.new_happiness}%</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error starting training:', error);
        document.getElementById('trainingResult').innerHTML = `
            <div class="training-error">
                <p>Failed to start training session</p>
            </div>
        `;
    }
}

// Generate sample pets
async function generateSamplePets() {
    try {
        const response = await fetch('/api/pets/sample', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ count: 5 })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(`Generated ${result.count} sample pets!`);
            loadPetManagement();
        } else {
            showNotification('Failed to generate sample pets', 'error');
        }
    } catch (error) {
        console.error('Error generating sample pets:', error);
        showNotification('Failed to generate sample pets', 'error');
    }
}

// Pet Store logic
async function loadStoreItems() {
    try {
        const response = await fetch('/api/store/items');
        const items = await response.json();
        const storeItemsList = document.getElementById('storeItemsList');
        if (!items.length) {
            storeItemsList.innerHTML = '<p>No store items available.</p>';
            return;
        }
        storeItemsList.innerHTML = items.map(item => `
            <div class="pet-card">
                <h4>🛒 ${item.name}</h4>
                <div class="pet-info">
                    <span><strong>Price:</strong> $${item.price}</span>
                    <span><strong>Stock:</strong> ${item.stock}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        showNotification('Failed to load store items', 'error');
    }
}

// Outreach Programs logic
async function loadOutreach() {
    try {
        const response = await fetch('/api/outreach');
        const programs = await response.json();
        const outreachList = document.getElementById('outreachList');
        if (!programs.length) {
            outreachList.innerHTML = '<p>No outreach programs available.</p>';
            return;
        }
        outreachList.innerHTML = programs.map(p => `
            <div class="pet-card">
                <h4>🌟 ${p.name}</h4>
                <div class="pet-info">
                    <span><strong>Date:</strong> ${p.date}</span>
                    <span><strong>Volunteers Needed:</strong> ${p.volunteers_needed}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        showNotification('Failed to load outreach programs', 'error');
    }
}

// Reports & Analytics logic
async function loadReports() {
    try {
        const response = await fetch('/api/reports');
        const reports = await response.json();
        const reportsList = document.getElementById('reportsList');
        if (!reports.length) {
            reportsList.innerHTML = '<p>No reports available.</p>';
            return;
        }
        reportsList.innerHTML = reports.map(r => `
            <div class="stat-card">
                <div class="stat-number">${r.value}</div>
                <div class="stat-label">${r.title}</div>
            </div>
        `).join('');
    } catch (error) {
        showNotification('Failed to load reports', 'error');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Show main menu by default
    document.getElementById('mainMenu').style.display = 'grid';
});