# HDC-golf-Cal
HDC golf Calcualtion
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Golf Score Leaderboard</title>
    <!-- นำเข้า Google Fonts เพื่อความโมเดิร์น -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --bg-color: #F8F9FA;
            --card-bg: #FFFFFF;
            --primary-pastel: #E8D7FF; /* พาสเทลม่วง */
            --secondary-pastel: #D4E6B5; /* พาสเทลเขียวมิ้นต์ */
            --accent-pastel: #FFDFD3; /* พาสเทลส้มพีช */
            --text-main: #4A4A4A;
            --text-muted: #8E8E93;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Kanit', sans-serif;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            padding: 16px;
            display: flex;
            justify-content: center;
        }

        .container {
            width: 100%;
            max-width: 480px; /* ขนาดพอดีหน้าจอโทรศัพท์ใน LINE */
        }

        header {
            text-align: center;
            margin-bottom: 24px;
            padding: 20px;
            background: linear-gradient(135deg, var(--primary-pastel), var(--secondary-pastel));
            border-radius: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        header h1 {
            font-size: 24px;
            color: #4A3E56;
            margin-bottom: 4px;
        }

        header p {
            font-size: 14px;
            color: #61556E;
        }

        .section-card {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .section-title {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* ฟอร์มกรอกข้อมูลผู้เล่น */
        .player-row {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr auto;
            gap: 8px;
            align-items: center;
            margin-bottom: 12px;
            background: #FAFAFC;
            padding: 10px;
            border-radius: 12px;
        }

        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #EAEAEA;
            border-radius: 10px;
            font-size: 14px;
            outline: none;
            transition: 0.2s;
        }

        input:focus {
            border-color: #C1A3E8;
        }

        input[type="number"] {
            text-align: center;
        }

        .btn-delete {
            background: #FFE5E5;
            color: #E53E3E;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 10px;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .btn-add {
            background-color: var(--secondary-pastel);
            color: #4A5D2E;
            border: none;
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
        }

        .btn-calc {
            background: linear-gradient(90deg, #C5A3FF, #A8D8B9);
            color: white;
            border: none;
            width: 100%;
            padding: 14px;
            border-radius: 15px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(197, 163, 255, 0.3);
            margin-top: 10px;
        }

        .btn-line {
            background-color: #06C755; /* สีเขียว LINE */
            color: white;
            border: none;
            width: 100%;
            padding: 12px;
            border-radius: 15px;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            margin-top: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        /* ตารางจัดอันดับ (Leaderboard) */
        .leaderboard-list {
            margin-top: 10px;
        }

        .rank-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 16px;
            background: #FAFAFC;
            border-radius: 15px;
            margin-bottom: 10px;
            transition: 0.3s;
        }

        .rank-item.top-1 {
            background: linear-gradient(90deg, #FFF4E5, #FFFDF0);
            border-left: 5px solid #FFB84D;
        }

        .rank-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .rank-number {
            font-size: 16px;
            font-weight: 600;
            width: 28px;
            height: 28px;
            background: #EAEAEA;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .top-1 .rank-number {
            background: #FFB84D;
            color: white;
        }

        .player-name {
            font-weight: 500;
        }

        .score-details {
            font-size: 12px;
            color: var(--text-muted);
        }

        .net-score-badge {
            background: #F0EDF5;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 600;
            color: #6C5B7B;
        }

        .top-1 .net-score-badge {
            background: #FFDFD3;
            color: #D9534F;
        }
    </style>
</head>
<body>

<div class="container">
    <header>
        <h1>Golfกับแก๊งเพื่อน ⛳</h1>
        <p>คำนวณ Net Score และจัดอันดับแบบเรียลไทม์</p>
    </header>

    <!-- ส่วนกรอกข้อมูล -->
    <div class="section-card">
        <div class="section-title">
            <span>รายชื่อผู้เล่น</span>
            <button class="btn-add" onclick="addPlayerRow()">+ เพิ่มผู้เล่น</button>
        </div>
        
        <div id="labels-row" style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 8px; margin-bottom: 8px; font-size: 12px; color: var(--text-muted); text-align: center;">
            <div style="text-align: left; padding-left: 10px;">ชื่อ</div>
            <div>Gross</div>
            <div>Handicap</div>
            <div style="width: 36px;"></div>
        </div>

        <div id="players-container">
            <!-- แถวผู้เล่นเริ่มต้นจะถูกสร้างจาก JavaScript -->
        </div>

        <button class="btn-calc" onclick="calculateAndRank()">🏆 ประมวลผลและจัดอันดับ</button>
    </div>

    <!-- ส่วนแสดงอันดับ -->
    <div class="section-card" id="leaderboard-section" style="display: none;">
        <div class="section-title">📊 อันดับคะแนน (Net Score)</div>
        <div id="leaderboard-list" class="leaderboard-list">
            <!-- ผลลัพธ์การจัดอันดับจะมาแสดงที่นี่ -->
        </div>
        
        <button class="btn-line" onclick="copyToClipboard()">
            💬 คัดลอกสรุปคะแนนส่งเข้า LINE
        </button>
    </div>
</div>

<script>
    // ข้อมูลเริ่มต้นสำหรับทดสอบใช้งาน
    const defaultPlayers = [
        { name: 'อเล็กซ์', gross: 85, handicap: 12 },
        { name: 'บอย', gross: 92, handicap: 18 },
        { name: 'ชัย', gross: 79, handicap: 5 }
    ];

    function init() {
        const container = document.getElementById('players-container');
        defaultPlayers.forEach(p => {
            container.appendChild(createPlayerRowElement(p.name, p.gross, p.handicap));
        });
    }

    function createPlayerRowElement(name = '', gross = '', handicap = '') {
        const row = document.createElement('div');
        row.className = 'player-row';
        row.innerHTML = `
            <input type="text" placeholder="ชื่อผู้เล่น" class="input-name" value="${name}">
            <input type="number" placeholder="Gross" class="input-gross" value="${gross}">
            <input type="number" placeholder="HC" class="input-handicap" value="${handicap}">
            <button class="btn-delete" onclick="this.parentElement.remove()">×</button>
        `;
        return row;
    }

    function addPlayerRow() {
        const container = document.getElementById('players-container');
        container.appendChild(createPlayerRowElement());
    }

    // ฟังก์ชันคำนวณและจัดอันดับ
    function calculateAndRank() {
        const rows = document.querySelectorAll('.player-row');
        let playersData = [];

        rows.forEach(row => {
            const name = row.querySelector('.input-name').value.trim();
            const gross = parseInt(row.querySelector('.input-gross').value);
            const handicap = parseInt(row.querySelector('.input-handicap').value);

            // ตรวจสอบความถูกต้องของข้อมูล
            if (name && !isNaN(gross) && !isNaN(handicap)) {
                const net = gross - handicap;
                playersData.push({ name, gross, handicap, net });
            }
        });

        if (playersData.length === 0) {
            alert('กรุณากรอกข้อมูลผู้เล่นอย่างน้อย 1 คนให้ครบถ้วนครับ');
            return;
        }

        // เรียงลำดับจาก Net Score น้อยไปมาก (กอล์ฟยิ่งน้อยยิ่งดี)
        playersData.sort((a, b) => a.net - b.net);

        renderLeaderboard(playersData);
    }

    // แสดงผลบนหน้าจอ
    function renderLeaderboard(players) {
        const listContainer = document.getElementById('leaderboard-list');
        listContainer.innerHTML = '';

        players.forEach((player, index) => {
            const rank = index + 1;
            const isTop = rank === 1 ? 'top-1' : '';
            const rankDisplay = rank === 1 ? '🥇' : rank;

            const item = document.createElement('div');
            item.className = `rank-item ${isTop}`;
            item.innerHTML = `
                <div class="rank-left">
                    <div class="rank-number">${rankDisplay}</div>
                    <div>
                        <div class="player-name">${player.name}</div>
                        <div class="score-details">Gross: ${player.gross} | HC: ${player.handicap}</div>
                    </div>
                </div>
                <div class="net-score-badge">Net: ${player.net}</div>
            `;
            listContainer.appendChild(item);
        });

        // แสดงเซกชันตารางคะแนน
        document.getElementById('leaderboard-section').style.display = 'block';
        // เลื่อนหน้าจอลงมาดูผลลัพธ์อัตโนมัติ
        document.getElementById('leaderboard-section').scrollIntoView({ behavior: 'smooth' });
        
        // บันทึกข้อมูลผลลัพธ์ไว้ใช้สำหรับฟังก์ชันคัดลอกข้อความ
        window.currentLeaderboardData = players;
    }

    // ฟังก์ชันคัดลอกข้อความเพื่อส่งเข้า LINE
    function copyToClipboard() {
        if (!window.currentLeaderboardData || window.currentLeaderboardData.length === 0) return;

        let textMessage = `⛳ สรุปอันดับคะแนนกอล์ฟ ⛳\n\n`;
        window.currentLeaderboardData.forEach((player, index) => {
            const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            textMessage += `${rankEmoji} คุณ ${player.name}\n   [Net: ${player.net}] (Gross: ${player.gross} / HC: ${player.handicap})\n`;
        });
        textMessage += `\nคำนวณผ่าน Golf Web App 🏌️‍♂️`;

        navigator.clipboard.writeText(textMessage).then(() => {
            alert('คัดลอกสรุปคะแนนเรียบร้อยแล้ว! สามารถเปิดแอป LINE แล้วกดวาง (Paste) ส่งให้เพื่อนได้เลยครับ 💬');
        }).catch(err => {
            alert('เกิดข้อผิดพลาดในการคัดลอก กรุณาลองอีกครั้งครับ');
        });
    }

    // เริ่มต้นระบบเมื่อโหลดหน้าเว็บ
    init();
</script>

</body>
</html>
