const wishesList = [
    "Пусть дембель придет как салют в твою честь!",
    "Кирзачи не стоптать – ты настоящий воин!",
    "Еще 19 дней. Инженерные войска гордятся тобой.",
    "Скоро ты обнимешь родных. Держись, брат!",
    "Каждый день приближает запах гражданки.",
    "Помни: ваша служба — щит России. Честь имею!",
    "Ты выдержал это испытание, боец.",
    "Пусть последние дни станут самыми памятными.",
    "Взвод гордится тобой. Финишируй красиво!",
    "Солдатская дружба — навечно. Мы с тобой.",
    "Уже меньше двух недель! Ты справишься.",
    "Скоро вместо казармы — дом. Представь это.",
    "Благодарим за службу, брат. Ждём на гражданке.",
    "Не теряй чувство юмора. Осталось чуть-чуть.",
    "Твоя сила воли — пример для молодых.",
    "Каждый закат приближает мирную жизнь.",
    "Инженер всегда прокладывает путь. Ты — молодец!",
    "Скоро ты увидишь, как ждали тебя дома.",
    "Последние 2 дня — как два шага. Ты готов!",
    "Поздравляю! Ты прошёл этот путь с честью. Дембель неизбежен!"
];

const STORAGE_KEY = "wishes_engineer_reverse";

function getStartDate() {
    let start = localStorage.getItem(STORAGE_KEY);
    if (!start) {
        const today = new Date();
        today.setHours(0,0,0,0);
        start = today.toISOString();
        localStorage.setItem(STORAGE_KEY, start);
    }
    return new Date(start);
}

// Возвращает индекс (0..19), но в обратном порядке:
// день 1 = сигарета 20, день 20 = сигарета 1
function getCurrentCigaretteIndex() {
    const startDate = getStartDate();
    const today = new Date();
    today.setHours(0,0,0,0);
    let daysPassed = Math.floor((today - startDate) / (1000*60*60*24));
    if (daysPassed < 0) daysPassed = 0;
    if (daysPassed >= wishesList.length) daysPassed = wishesList.length - 1;
    
    // Обратный порядок: 0-й день открывает сигарету 20 (индекс 19)
    // daysPassed = 0 → cigaretteIndex = 19
    // daysPassed = 19 → cigaretteIndex = 0
    const cigaretteIndex = (wishesList.length - 1) - daysPassed;
    return cigaretteIndex;
}

// Какие сигареты открыты? (все от текущей до конца, т.е. от 20 вниз)
function getUnlockedIndices() {
    const currentIdx = getCurrentCigaretteIndex();
    const unlocked = [];
    for (let i = currentIdx; i < wishesList.length; i++) {
        unlocked.push(i);
    }
    return unlocked;
}

function renderWishes() {
    const grid = document.getElementById("wishesGrid");
    if (!grid) return;
    
    const currentCigIdx = getCurrentCigaretteIndex();
    const unlocked = getUnlockedIndices();
    
    // Сигарета, которая открылась сегодня (в обратном порядке)
    const todayCigaretteNumber = currentCigIdx + 1; // 1..20
    const remainingCigarettes = todayCigaretteNumber - 1; // сколько осталось выкурить
    
    const daysLeftSpan = document.getElementById("daysLeft");
    if (daysLeftSpan) daysLeftSpan.innerText = remainingCigarettes >= 0 ? remainingCigarettes : 0;
    
    grid.innerHTML = "";
    
    wishesList.forEach((wish, idx) => {
        // Номер сигареты (обратный): индекс 19 → сигарета 1, индекс 0 → сигарета 20
        const cigaretteNumber = wishesList.length - idx;
        const isUnlocked = unlocked.includes(idx);
        
        const card = document.createElement("div");
        card.className = `wish-card ${isUnlocked ? "unlocked" : "locked"}`;
        
        const header = document.createElement("div");
        header.className = "card-header";
        header.innerText = `Сигарета ${cigaretteNumber}`;
        
        const content = document.createElement("div");
        content.className = "wish-content";
        
        if (isUnlocked) {
            content.innerText = wish;
        } else {
            content.innerText = ""; // текст будет через псевдоэлементы CSS
        }
        
        card.appendChild(header);
        card.appendChild(content);
        
        card.addEventListener("click", () => {
            if (isUnlocked) {
                alert(`📣 Боевое пожелание (Сигарета ${cigaretteNumber}):\n\n${wish}`);
            } else {
                const remaining = cigaretteNumber - todayCigaretteNumber;
                alert(`🔒 Сигарета ${cigaretteNumber} ещё не выкурена.\nОсталось выкурить ${remaining} сигарет до неё.`);
            }
        });
        
        grid.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", renderWishes);