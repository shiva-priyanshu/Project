// 🔊 AUDIO UNLOCK
let audioUnlocked = false;
document.addEventListener('click', () => {
    if (audioUnlocked) return;
    audioUnlocked = true;
    ['correctSound', 'winSound', 'kbcSound', 'userVoice'].forEach(id => {
        const a = document.getElementById(id);
        if (a) {
            a.muted = true;
            a.play().then(() => {
                a.pause();
                a.currentTime = 0;
                a.muted = false;
            }).catch(() => {});
        }
    });
}, { once: true });

const questions = [
    { q: 'What does HTML stand for?', o: ['Hyper Text Markup Language', 'High Text Machine', 'Hyperlinks Text', 'None'], a: 0 },
    { q: 'Which language is used for styling web pages?', o: ['HTML', 'CSS', 'Java', 'Python'], a: 1 },
    { q: 'Which language is used for web logic?', o: ['HTML', 'CSS', 'JavaScript', 'SQL'], a: 2 },
    { q: 'Which tag is used for line break?', o: ['<br>', '<hr>', '<p>', '<div>'], a: 0 },
    { q: 'CSS file extension?', o: ['.html', '.js', '.css', '.java'], a: 2 },
    { q: 'JS variable keyword?', o: ['var', 'int', 'float', 'string'], a: 0 },
    { q: 'Largest heading tag?', o: ['h1', 'h3', 'h6', 'head'], a: 0 },
    { q: 'Base web language?', o: ['Python', 'C', 'HTML', 'Java'], a: 2 }
];

let qi = 0, qInt, avatar = '', players = [];

function submitPin() {
    if (!/^\d{4}$/.test(pin.value)) {
        pinError.innerText = 'Enter 4 digit PIN';
        return;
    }
    show('profileScreen');
}

function selectAvatar(el) {
    document.querySelectorAll('.avatar').forEach(a => a.style.border = 'none');
    el.style.border = '3px solid #2575fc';
    avatar = el.src;
}

function submitProfile() {
    if (playerName.value === '') {
        profileError.innerText = 'Enter name';
        return;
    }
    if (!avatar) {
        profileError.innerText = 'Select avatar';
        return;
    }
    initPlayers();
    show('preTimerScreen');
    startPreTimer();
}

function initPlayers() {
    players = [{ name: playerName.value, score: 0, avatar }];
    for (let i = 1; i <= 5; i++) {
        players.push({
            name: 'Player' + i,
            score: Math.floor(Math.random() * 10),
            avatar: `https://i.pravatar.cc/100?img=${i + 5}`
        });
    }
    renderPlayers();
}

function startPreTimer() {
    let t = 5;
    const el = preTimer;
    const voice = userVoice;
    const colors = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#2575fc'];
    
    el.innerText = t;
    const int = setInterval(() => {
        el.innerText = t;
        document.body.style.background = colors[t - 1] || colors[0];
        if (t === 5) {
            voice.currentTime = 0;
            voice.play().catch(() => {});
        }
        t--;
        if (t < 0) {
            clearInterval(int);
            show('quizScreen');
            loadQ();
        }
    }, 1000);
}

function loadQ() {
    if (qi >= questions.length) {
        finishQuiz();
        return;
    }
    userVoice.currentTime = 0;
    userVoice.play().catch(() => {});
    
    question.innerText = questions[qi].q;
    options.innerHTML = '';
    questions[qi].o.forEach((op, i) => {
        const d = document.createElement('div');
        d.className = 'option';
        d.innerHTML = `<span class="circle"></span><span>${op}</span>`;
        d.onclick = () => selectOpt(i === questions[qi].a, d);
        options.appendChild(d);
    });
    startTimer();
}

function startTimer() {
    let t = 8;
    qTime.innerText = t;
    clearInterval(qInt);
    kbcSound.currentTime = 0;
    kbcSound.play().catch(() => {});
    
    qInt = setInterval(() => {
        t--;
        qTime.innerText = t;
        if (t < 0) {
            clearInterval(qInt);
            kbcSound.pause();
            nextQ();
        }
    }, 1000);
}

function selectOpt(correct, el) {
    clearInterval(qInt);
    kbcSound.pause();
    if (correct) {
        el.classList.add('correct');
        players[0].score += 10;
        correctSound.play().catch(() => {});
        confetti();
    } else {
        el.classList.add('wrong');
    }
    renderPlayers();
    setTimeout(nextQ, 1200);
}

function nextQ() {
    qi++;
    loadQ();
}

function renderPlayers() {
    players.sort((a, b) => b.score - a.score);
    playersDiv.innerHTML = '';
    players.forEach((p, i) => {
        playersDiv.innerHTML += `
            <div class='player ${i === 0 ? 'top1' : ''}'>
                <div class='player-left'>
                    <img src='${p.avatar}'>
                    <span>#${i + 1} ${p.name}</span>
                </div>
                <span>${p.score} pts</span>
            </div>
        `;
    });
}

function finishQuiz() {
    show('calcScreen');
    setTimeout(() => {
        players.sort((a, b) => b.score - a.score);
        podium.innerHTML = `
            <p>🥇 ${players[0]?.name} (${players[0]?.score})</p>
            <p>🥈 ${players[1]?.name} (${players[1]?.score})</p>
            <p>🥉 ${players[2]?.name} (${players[2]?.score})</p>
        `;
        winner.innerText = 'Amazing performance by all participants!';
        winSound.play().catch(() => {});
        confetti();
        show('resultScreen');
    }, 3000);
}

function confetti() {
    for (let i = 0; i < 90; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.background = `hsl(${Math.random() * 360},100%,50%)`;
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 3000);
    }
}

function show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

const playersDiv = document.getElementById('players');
