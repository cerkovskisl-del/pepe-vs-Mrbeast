// Spēles mainīgie (Dati)
let pepeFollowers = 0;
let followersPerSecond = 0;
let mrBeastFollowers = 491000000;

// Uzlabojumu dati (Cena, Cik dod, un cik jau ir nopirkti)
let upgrades = {
    1: { name: "Izveidot mēmi", cost: 15, fpsBonus: 1, count: 0 },
    2: { name: "Vīrusu video", cost: 100, fpsBonus: 10, count: 0 },
    3: { name: "Kopīgs strīms", cost: 1100, fpsBonus: 100, count: 0 }
};

// Elementu atrašana no HTML, lai varētu mainīt tekstu
const pepeCountDisplay = document.getElementById("pepe-count");
const fpsCountDisplay = document.getElementById("fps-count");
const clickBtn = document.getElementById("click-btn");

// 1. Funkcija: Ko dara klikšķis uz galvenās pogas
clickBtn.addEventListener("click", () => {
    pepeFollowers += 1; // Par katru klikšķi iedod 1 sekotāju
    updateUI();
});

// 2. Funkcija: Uzlabojumu pirkšana
function buyUpgrade(id) {
    let upgrade = upgrades[id];
    
    if (pepeFollowers >= upgrade.cost) {
        // Atņemam sekotājus par pirkumu
        pepeFollowers -= upgrade.cost;
        
        // Palielinām kopējo FPS (sekotāji sekundē)
        followersPerSecond += upgrade.fpsBonus;
        
        // Palielinām šī uzlabojuma skaitu un cenu (nākamais maksās dārgāk par 15%)
        upgrade.count++;
        upgrade.cost = Math.round(upgrade.cost * 1.15);
        
        // Atjaunojam pogas tekstu HTML failā
        document.getElementById(`upgrade${id}-btn`).innerText = `Cena: ${upgrade.cost} sekotāji`;
        
        updateUI();
    } else {
        alert("Tev nepietiek sekotāju!");
    }
}

// 3. Funkcija: Vizuālo skaitļu atjaunošana ekrānā
function updateUI() {
    // Izmantojam toLocaleString(), lai skaitļi būtu smuki ar komatiem (piem. 1,000)
    pepeCountDisplay.innerText = Math.floor(pepeFollowers).toLocaleString();
    fpsCountDisplay.innerText = followersPerSecond.toLocaleString();
    
    // Pārbaudām uzvaru
    if (pepeFollowers >= mrBeastFollowers) {
        alert("Neticami! Pepe ir apdzinis MrBeast un kļuvis par interneta karali! 🐸👑");
        mrBeastFollowers = Infinity; // Lai paziņojums neparādās katru sekundi
    }
}

// 4. Cikls: Kas notiek katru sekundi (vai precīzāk - ik pēc 100 milisekundēm gludākam progresam)
setInterval(() => {
    if (followersPerSecond > 0) {
        pepeFollowers += (followersPerSecond / 10); // Pieskaitām daļu no sekundes ienākuma
        updateUI();
    }
}, 100);