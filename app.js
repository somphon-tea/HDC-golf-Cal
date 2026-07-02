// ===== STORAGE MANAGEMENT =====
const STORAGE_KEY = 'golfLeaderboardData';

const AppState = {
    players: [],
    courses: [],
    groups: [],
    events: [],
    currentEventId: null,
    currentScoreFilter: 'net'
};

// Initialize localStorage
function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        Object.assign(AppState, JSON.parse(saved));
    } else {
        // Load default sample data
        AppState.players = [
            { id: 1, name: 'อเล็กซ์', handicap: 12, notes: '', rounds: [] },
            { id: 2, name: 'บอย', handicap: 18, notes: '', rounds: [] },
            { id: 3, name: 'ชัย', handicap: 5, notes: '', rounds: [] }
        ];
        AppState.courses = [
            { id: 1, name: 'Bangkok Golf Club', par: 72, rating: 73.5, slope: 135, location: 'Bangkok' }
        ];
    }
    saveData();
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState));
}

// ===== TAB NAVIGATION =====
function switchTab(tabName, element) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    if (element) element.classList.add('active');

    if (tabName === 'leaderboard') renderLeaderboard();
    if (tabName === 'players') renderPlayersList();
    if (tabName === 'courses') renderCoursesList();
    if (tabName === 'groups') renderGroupsList();
    if (tabName === 'history') renderHistory();
}

// ===== MODAL FUNCTIONS =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');

    if (modalId === 'eventModal') populateEventModal();
    if (modalId === 'playerModal') resetPlayerModal();
    if (modalId === 'courseModal') resetCourseModal();
    if (modalId === 'groupModal') populateGroupModal();
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// ===== PLAYER MANAGEMENT =====
function savePlayer() {
    const name = document.getElementById('playerName').value.trim();
    const handicap = parseFloat(document.getElementById('playerHandicap').value) || 0;
    const notes = document.getElementById('playerNotes').value.trim();

    if (!name) {
        alert('Please enter player name');
        return;
    }

    const player = { id: Date.now(), name, handicap, notes, rounds: [] };
    AppState.players.push(player);
    saveData();
    closeModal('playerModal');
    renderPlayersList();
    alert('Player added!');
}

function resetPlayerModal() {
    document.getElementById('playerName').value = '';
    document.getElementById('playerHandicap').value = '';
    document.getElementById('playerNotes').value = '';
}

function deletePlayer(playerId) {
    if (confirm('Delete this player?')) {
        AppState.players = AppState.players.filter(p => p.id !== playerId);
        saveData();
        renderPlayersList();
    }
}

function renderPlayersList() {
    const container = document.getElementById('players-list');
    const empty = document.getElementById('players-empty');

    if (AppState.players.length === 0) {
        container.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    container.innerHTML = AppState.players.map(p => `
        <div style="background: #FAFAFC; padding: 12px; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div class="card-name">${p.name}</div>
                <div class="card-detail">Handicap: ${p.handicap.toFixed(1)} | Rounds: ${(p.rounds || []).length}</div>
                ${p.notes ? `<div class="card-detail">${p.notes}</div>` : ''}
            </div>
            <button class="btn-delete" onclick="deletePlayer(${p.id})">×</button>
        </div>
    `).join('');
}

// ===== COURSE MANAGEMENT =====
function saveCourse() {
    const name = document.getElementById('courseName').value.trim();
    const par = parseInt(document.getElementById('coursePar').value) || 72;
    const rating = parseFloat(document.getElementById('courseRating').value) || 72;
    const slope = parseInt(document.getElementById('courseSlope').value) || 113;
    const location = document.getElementById('courseLocation').value.trim();

    if (!name) {
        alert('Please enter course name');
        return;
    }

    const course = { id: Date.now(), name, par, rating, slope, location };
    AppState.courses.push(course);
    saveData();
    closeModal('courseModal');
    renderCoursesList();
    alert('Course added!');
}

function resetCourseModal() {
    document.getElementById('courseName').value = '';
    document.getElementById('coursePar').value = '72';
    document.getElementById('courseRating').value = '73.5';
    document.getElementById('courseSlope').value = '135';
    document.getElementById('courseLocation').value = '';
}

function deleteCourse(courseId) {
    if (confirm('Delete this course?')) {
        AppState.courses = AppState.courses.filter(c => c.id !== courseId);
        saveData();
        renderCoursesList();
    }
}

function renderCoursesList() {
    const container = document.getElementById('courses-list');
    const empty = document.getElementById('courses-empty');

    if (AppState.courses.length === 0) {
        container.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    container.innerHTML = AppState.courses.map(c => `
        <div style="background: #FAFAFC; padding: 12px; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div class="card-name">${c.name}</div>
                <div class="card-detail">Par ${c.par} • Rating ${c.rating} • Slope ${c.slope}</div>
                <div class="card-detail">${c.location}</div>
            </div>
            <button class="btn-delete" onclick="deleteCourse(${c.id})">×</button>
        </div>
    `).join('');
}

// ===== GROUP MANAGEMENT =====
function populateGroupModal() {
    const container = document.getElementById('groupPlayers');
    container.innerHTML = AppState.players.map(p => `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <input type="checkbox" value="${p.id}" style="width: auto; margin: 0;">
            <label style="margin: 0; flex: 1;">${p.name}</label>
        </div>
    `).join('');
}

function saveGroup() {
    const name = document.getElementById('groupName').value.trim();
    const checkboxes = document.querySelectorAll('#groupPlayers input[type="checkbox"]:checked');
    const playerIds = Array.from(checkboxes).map(cb => parseInt(cb.value));

    if (!name) {
        alert('Please enter group name');
        return;
    }

    if (playerIds.length === 0) {
        alert('Please select at least one player');
        return;
    }

    const group = { id: Date.now(), name, playerIds };
    AppState.groups.push(group);
    saveData();
    closeModal('groupModal');
    renderGroupsList();
    alert('Group created!');
}

function deleteGroup(groupId) {
    if (confirm('Delete this group?')) {
        AppState.groups = AppState.groups.filter(g => g.id !== groupId);
        saveData();
        renderGroupsList();
    }
}

function loadGroupPlayers(groupId) {
    const group = AppState.groups.find(g => g.id === groupId);
    if (group) {
        const playerNames = group.playerIds.map(id => AppState.players.find(p => p.id === id)?.name).join(', ');
        return playerNames;
    }
    return '';
}

function renderGroupsList() {
    const container = document.getElementById('groups-list');
    const empty = document.getElementById('groups-empty');

    if (AppState.groups.length === 0) {
        container.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    container.innerHTML = AppState.groups.map(g => `
        <div style="background: #FAFAFC; padding: 12px; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div class="card-name">${g.name}</div>
                <div class="card-detail">${loadGroupPlayers(g.id)}</div>
            </div>
            <button class="btn-delete" onclick="deleteGroup(${g.id})">×</button>
        </div>
    `).join('');
}

// ===== EVENT / ROUND MANAGEMENT =====
function populateEventModal() {
    const courseSelect = document.getElementById('eventCourse');
    courseSelect.innerHTML = '<option value="">Select a course</option>' +
        AppState.courses.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    const playersDiv = document.getElementById('eventPlayers');
    playersDiv.innerHTML = AppState.players.map(p => `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <input type="checkbox" value="${p.id}" class="event-player-checkbox" style="width: auto; margin: 0;">
            <label style="margin: 0; flex: 1;">${p.name}</label>
        </div>
    `).join('');

    document.getElementById('eventDate').valueAsDate = new Date();
}

function updateScoreInputs() {
    const checkboxes = document.querySelectorAll('.event-player-checkbox:checked');
    const playerIds = Array.from(checkboxes).map(cb => parseInt(cb.value));

    const scoreDiv = document.getElementById('scoreInput');
    scoreDiv.innerHTML = playerIds.map(pId => {
        const player = AppState.players.find(p => p.id === pId);
        return `
            <div style="margin-bottom: 12px; padding: 10px; background: #FAFAFC; border-radius: 10px;">
                <div style="font-weight: 500; margin-bottom: 8px;">${player.name}</div>
                <input type="number" placeholder="Gross Score" class="gross-score" data-player="${pId}" style="margin-bottom: 8px;">
                <input type="number" placeholder="Handicap (auto-filled)" class="hc-score" data-player="${pId}" value="${player.handicap}" style="margin-bottom: 8px;" readonly>
                <div style="padding: 8px; background: white; border-radius: 8px; font-size: 12px; color: var(--text-muted);">
                    Net: <span class="net-calc-${pId}">-</span>
                </div>
            </div>
        `;
    }).join('');

    setTimeout(() => {
        document.querySelectorAll('.gross-score').forEach(input => {
            input.addEventListener('input', calculateNetScore);
        });
    }, 100);
}

function calculateNetScore(e) {
    const playerId = e.target.dataset.player;
    const gross = parseInt(e.target.value) || 0;
    const hc = parseFloat(document.querySelector(`.hc-score[data-player="${playerId}"]`).value) || 0;
    const net = gross - hc;
    document.querySelector(`.net-calc-${playerId}`).textContent = net;
}

function saveEvent() {
    const courseId = parseInt(document.getElementById('eventCourse').value);
    const date = document.getElementById('eventDate').value;
    const checkboxes = document.querySelectorAll('.event-player-checkbox:checked');
    const playerIds = Array.from(checkboxes).map(cb => parseInt(cb.value));

    if (!courseId || !date || playerIds.length === 0) {
        alert('Please select course, date, and at least one player');
        return;
    }

    const scores = {};
    playerIds.forEach(pId => {
        const gross = parseInt(document.querySelector(`.gross-score[data-player="${pId}"]`).value) || 0;
        const handicap = parseFloat(document.querySelector(`.hc-score[data-player="${pId}"]`).value) || 0;
        scores[pId] = { gross, handicap, net: gross - handicap };
    });

    const event = { id: Date.now(), courseId, date, scores, photo: null };

    function finalize() {
        AppState.events.push(event);
        playerIds.forEach(pId => {
            const player = AppState.players.find(p => p.id === pId);
            if (player) {
                if (!player.rounds) player.rounds = [];
                player.rounds.push({ eventId: event.id, date, scores: scores[pId] });
            }
        });
        saveData();
        closeModal('eventModal');
        renderLeaderboard();
        alert('Round saved!');
    }

    const photoInput = document.getElementById('eventPhoto');
    if (photoInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
            event.photo = e.target.result;
            finalize();
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        finalize();
    }
}

// ===== LEADERBOARD RENDERING =====
function toggleScoreFilter(filter, element) {
    AppState.currentScoreFilter = filter;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    if (element) element.classList.add('active');
    renderLeaderboard();
}

function renderLeaderboard() {
    const latestEvent = AppState.events[AppState.events.length - 1];

    if (!latestEvent) {
        document.getElementById('leaderboard-list').innerHTML = '';
        document.getElementById('leaderboard-empty').style.display = 'block';
        document.getElementById('export-section').style.display = 'none';
        return;
    }

    document.getElementById('leaderboard-empty').style.display = 'none';
    document.getElementById('export-section').style.display = 'block';

    const course = AppState.courses.find(c => c.id === latestEvent.courseId);
    document.getElementById('event-course').textContent = course?.name || 'Unknown Course';
    document.getElementById('event-date').textContent = new Date(latestEvent.date).toLocaleDateString('th-TH');
    document.getElementById('current-event-info').style.display = 'block';

    const leaderboardData = Object.entries(latestEvent.scores).map(([pId, score]) => {
        const player = AppState.players.find(p => p.id === parseInt(pId));
        const stableford = calculateStableford(score.gross, course.par, score.handicap);
        return { player, ...score, stableford };
    });

    if (AppState.currentScoreFilter === 'net') {
        leaderboardData.sort((a, b) => a.net - b.net);
    } else if (AppState.currentScoreFilter === 'gross') {
        leaderboardData.sort((a, b) => a.gross - b.gross);
    } else {
        leaderboardData.sort((a, b) => b.stableford - a.stableford);
    }

    const listContainer = document.getElementById('leaderboard-list');
    listContainer.innerHTML = leaderboardData.map((item, index) => {
        const rank = index + 1;
        const topClass = rank === 1 ? 'top-1' : rank === 2 ? 'top-2' : rank === 3 ? 'top-3' : '';
        const rankDisplay = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;

        return `
            <div class="rank-item ${topClass}">
                <div class="rank-left">
                    <div class="rank-number">${rankDisplay}</div>
                    <div>
                        <div class="player-name">${item.player.name}</div>
                        <div class="score-details">Gross: ${item.gross} | HC: ${item.handicap.toFixed(1)}</div>
                    </div>
                </div>
                <div>
                    ${AppState.currentScoreFilter === 'net' ? `<div class="score-badge">Net: ${item.net}</div>` : ''}
                    ${AppState.currentScoreFilter === 'gross' ? `<div class="score-badge">Gross: ${item.gross}</div>` : ''}
                    ${AppState.currentScoreFilter === 'stableford' ? `<div class="score-badge">Stable: ${item.stableford}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function calculateStableford(gross, par, handicap) {
    const scoreToStdIndex = gross - par;
    const stablefordPoints = { '-3': 5, '-2': 5, '-1': 4, '0': 3, '1': 2, '2': 1, '3': 0 };
    return stablefordPoints[scoreToStdIndex] || 0;
}

// ===== HISTORY & STATS =====
function renderHistory() {
    const historyContainer = document.getElementById('history-list');
    const historyEmpty = document.getElementById('history-empty');

    if (AppState.events.length === 0) {
        historyContainer.innerHTML = '';
        historyEmpty.style.display = 'block';
        document.getElementById('stats-empty').style.display = 'block';
        return;
    }

    historyEmpty.style.display = 'none';
    historyContainer.innerHTML = AppState.events.map(event => {
        const course = AppState.courses.find(c => c.id === event.courseId);
        const scoresText = Object.entries(event.scores).map(([pId, score]) => {
            const player = AppState.players.find(p => p.id === parseInt(pId));
            return `${player.name}: ${score.net} (${score.gross}/${score.handicap})`;
        }).join(' • ');

        return `
            <div style="background: #FAFAFC; padding: 12px; border-radius: 12px; margin-bottom: 10px;">
                <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">${new Date(event.date).toLocaleDateString('th-TH')}</div>
                <div style="font-weight: 500; margin-bottom: 4px;">📍 ${course?.name || 'Unknown'}</div>
                <div style="font-size: 12px;">${scoresText}</div>
            </div>
        `;
    }).join('');

    renderPlayerStats();
}

function renderPlayerStats() {
    const statsContainer = document.getElementById('player-stats');
    const statsEmpty = document.getElementById('stats-empty');

    const stats = AppState.players.map(player => {
        const rounds = player.rounds || [];
        if (rounds.length === 0) return null;

        const avgNet = (rounds.reduce((sum, r) => sum + r.scores.net, 0) / rounds.length).toFixed(1);
        const bestNet = Math.min(...rounds.map(r => r.scores.net));
        const wins = AppState.events.filter(e => {
            const playerScore = e.scores[player.id];
            if (!playerScore) return false;
            const allScores = Object.values(e.scores).map(s => s.net);
            return Math.min(...allScores) === playerScore.net;
        }).length;

        return { player, rounds, avgNet, bestNet, wins };
    }).filter(s => s !== null);

    if (stats.length === 0) {
        statsContainer.innerHTML = '';
        statsEmpty.style.display = 'block';
        return;
    }

    statsEmpty.style.display = 'none';
    statsContainer.innerHTML = stats.map(stat => `
        <div style="background: #F8F9FA; padding: 12px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid var(--primary-pastel);">
            <div style="font-weight: 500; margin-bottom: 8px;">${stat.player.name}</div>
            <div style="font-size: 12px; color: var(--text-muted); line-height: 1.6;">
                <div>📊 Rounds: ${stat.rounds.length}</div>
                <div>📈 Avg Net: ${stat.avgNet}</div>
                <div>🏆 Best: ${stat.bestNet}</div>
                <div>🥇 Wins: ${stat.wins}</div>
            </div>
        </div>
    `).join('');
}

// ===== EXPORTS =====
function copyToClipboard() {
    const latestEvent = AppState.events[AppState.events.length - 1];
    if (!latestEvent) return;

    const course = AppState.courses.find(c => c.id === latestEvent.courseId);
    let text = `⛳ ${course?.name || 'Golf Score'} - ${new Date(latestEvent.date).toLocaleDateString('th-TH')}\n\n`;

    const leaderboard = Object.entries(latestEvent.scores).map(([pId, score]) => {
        const player = AppState.players.find(p => p.id === parseInt(pId));
        return { player: player.name, ...score };
    }).sort((a, b) => a.net - b.net);

    leaderboard.forEach((item, index) => {
        const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        text += `${emoji} ${item.player}\n   Net: ${item.net} (Gross: ${item.gross})\n`;
    });

    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
}

function exportCSV() {
    const latestEvent = AppState.events[AppState.events.length - 1];
    if (!latestEvent) return;

    let csv = 'Rank,Player,Gross,Handicap,Net\n';
    const leaderboard = Object.entries(latestEvent.scores).map(([pId, score]) => {
        const player = AppState.players.find(p => p.id === parseInt(pId));
        return { player: player.name, ...score };
    }).sort((a, b) => a.net - b.net);

    leaderboard.forEach((item, index) => {
        csv += `${index + 1},${item.player},${item.gross},${item.handicap},${item.net}\n`;
    });

    downloadFile(csv, 'golf-scores.csv', 'text/csv');
}

function exportJSON() {
    const latestEvent = AppState.events[AppState.events.length - 1];
    if (!latestEvent) return;

    const data = {
        course: AppState.courses.find(c => c.id === latestEvent.courseId),
        date: latestEvent.date,
        scores: Object.entries(latestEvent.scores).map(([pId, score]) => ({
            player: AppState.players.find(p => p.id === parseInt(pId)).name,
            ...score
        }))
    };

    downloadFile(JSON.stringify(data, null, 2), 'golf-scores.json', 'application/json');
}

function exportAllData() {
    const data = {
        players: AppState.players,
        courses: AppState.courses,
        groups: AppState.groups,
        events: AppState.events
    };

    downloadFile(JSON.stringify(data, null, 2), 'golf-leaderboard-backup.json', 'application/json');
    alert('Data exported!');
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            Object.assign(AppState, imported);
            saveData();
            alert('Data imported successfully!');
            location.reload();
        } catch (err) {
            alert('Invalid JSON file');
        }
    };
    reader.readAsText(file);
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function clearAllData() {
    if (confirm('Clear all data? This cannot be undone!')) {
        localStorage.removeItem(STORAGE_KEY);
        AppState.players = [];
        AppState.courses = [];
        AppState.groups = [];
        AppState.events = [];
        saveData();
        location.reload();
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderPlayersList();
    renderCoursesList();
    renderGroupsList();
    renderLeaderboard();

    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('event-player-checkbox')) {
            updateScoreInputs();
        }
    });
});
