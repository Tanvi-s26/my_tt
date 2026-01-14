document.addEventListener('DOMContentLoaded', function() {
    const daysContainer = document.querySelector('.days-container');
    const addBtn = document.getElementById('addBtn');
    const clearBtn = document.getElementById('clearBtn');
    const modal = document.getElementById('addClassModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const classForm = document.getElementById('classForm');
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    const currentWeekSpan = document.getElementById('currentWeek');

    let classes = JSON.parse(localStorage.getItem('timetableClasses')) || [];
    let currentWeek = 1;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = [
        '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
    ];

    // Initialize timetable
    function initTimetable() {
        daysContainer.innerHTML = '';
        days.forEach(day => {
            const dayColumn = document.createElement('div');
            dayColumn.className = 'day-column';
            dayColumn.dataset.day = day;
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            
            dayColumn.appendChild(dayHeader);
            daysContainer.appendChild(dayColumn);
        });
        
        renderClasses();
    }

    // Render classes on timetable
    function renderClasses() {
        // Clear existing classes
        document.querySelectorAll('.class-slot').forEach(slot => slot.remove());
        
        classes.forEach(cls => {
            if (cls.week !== currentWeek) return;
            
            const dayColumn = document.querySelector(`.day-column[data-day="${cls.day}"]`);
            if (!dayColumn) return;
            
            const classSlot = document.createElement('div');
            classSlot.className = 'class-slot';
            classSlot.style.backgroundColor = cls.color;
            classSlot.style.height = `${cls.duration * 60}px`;
            classSlot.style.top = `${(cls.startTime - 8) * 60 + 60}px`;
            
            classSlot.innerHTML = `
                <h4>${cls.name}</h4>
                <p><i class="fas fa-user"></i> ${cls.teacher}</p>
                <p><i class="fas fa-door-open"></i> ${cls.room}</p>
                <p><i class="fas fa-clock"></i> ${getTimeString(cls.startTime)} - ${getTimeString(cls.startTime + cls.duration)}</p>
                <button class="delete-btn" data-id="${cls.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            dayColumn.appendChild(classSlot);
            
            // Add delete functionality
            classSlot.querySelector('.delete-btn').addEventListener('click', function(e) {
                e.stopPropagation();
                deleteClass(cls.id);
            });
        });
    }

    // Get time string from hour
    function getTimeString(hour) {
        if (hour === 12) return '12:00 PM';
        if (hour === 24) return '12:00 AM';
        return hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
    }

    // Add new class
    function addClass(classData) {
        classData.id = Date.now().toString();
        classData.week = currentWeek;
        classes.push(classData);
        saveToLocalStorage();
        renderClasses();
    }

    // Delete class
    function deleteClass(id) {
        if (confirm('Are you sure you want to delete this class?')) {
            classes = classes.filter(cls => cls.id !== id);
            saveToLocalStorage();
            renderClasses();
        }
    }

    // Clear all classes
    function clearAllClasses() {
        if (confirm('Are you sure you want to delete ALL classes?')) {
            classes = [];
            saveToLocalStorage();
            renderClasses();
        }
    }

    // Save to localStorage
    function saveToLocalStorage() {
        localStorage.setItem('timetableClasses', JSON.stringify(classes));
    }

    // Event Listeners
    addBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        classForm.reset();
    });

    classForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newClass = {
            name: document.getElementById('className').value,
            room: document.getElementById('classRoom').value,
            teacher: document.getElementById('teacherName').value,
            day: document.getElementById('classDay').value,
            startTime: parseInt(document.getElementById('startTime').value),
            duration: parseInt(document.getElementById('duration').value),
            color: document.getElementById('classColor').value
        };
        
        addClass(newClass);
        modal.style.display = 'none';
        classForm.reset();
    });

    clearBtn.addEventListener('click', clearAllClasses);
    
     // Add new goal
addGoalBtn.addEventListener('click', function() {
    const text = goalInput.value.trim();
    if (!text) return;
    
    const newGoal = {
        id: Date.now(),
        text: text,
        type: document.getElementById('goalType').value,
        priority: document.getElementById('goalPriority').value,
        completed: false,
        date: new Date().toDateString(),
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    goals.push(newGoal);
    saveGoals();
    renderGoals();
    goalInput.value = '';

    // Show notification
    showNotification('Goal added successfully!');
});

    // Toggle goal completion
function toggleGoal(e) {
    const index = e.target.dataset.index;
    goals[index].completed = !goals[index].completed;
    saveGoals();
    renderGoals();
    
    if (goals[index].completed) {
        showNotification('Goal completed! Great job!');
        checkForAchievements();
    }
}

    // Week navigation
    prevWeekBtn.addEventListener('click', () => {
        if (currentWeek > 1) {
            currentWeek--;
            currentWeekSpan.textContent = `Week ${currentWeek}`;
            renderClasses();
        }
    });

    nextWeekBtn.addEventListener('click', () => {
        currentWeek++;
        currentWeekSpan.textContent = `Week ${currentWeek}`;
        renderClasses();
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            classForm.reset();
        }
    });
    

    // Update progress stats
function updateProgress() {
    const total = goals.length;
    const completed = goals.filter(goal => goal.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    goalsProgress.textContent = `${completed}/${total}`;
    goalsPercentage.textContent = `${percentage}%`;

    // Save goals to localStorage
function saveGoals() {
    localStorage.setItem('dailyGoals', JSON.stringify(goals));
}
    
    // Update progress bar color
    goalsPercentage.style.color = percentage === 100 ? '#4CAF50' : 
                                 percentage >= 50 ? '#FFA000' : 
                                 '#F44336';
}

    // Check and award achievements
function checkForAchievements() {
    const today = new Date().toDateString();
    const completedToday = goals.filter(g => g.completed && g.date === today).length;
    

    // Add keyboard shortcut for adding goals
goalInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addGoalBtn.click();
    }
});
    
    // Initialize
    initTimetable();
});
