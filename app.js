// 🎯 Maps + Typen
const maps = [
  { name: "Gem Grab - Hard Rock", type: "control" },
  { name: "Showdown - Feast or Famine", type: "survival" },
  { name: "Brawl Ball - Center Stage", type: "goal" },
  { name: "Heist - Safe Zone", type: "heist" }
];

// 🧠 Brawler Meta Daten
const brawlers = [
  { name: "Shelly", roles: ["survival"], meta: 7 },
  { name: "Spike", roles: ["control"], meta: 9 },
  { name: "Colt", roles: ["heist"], meta: 8 },
  { name: "Bull", roles: ["survival", "heist"], meta: 6 },
  { name: "Poco", roles: ["goal", "control"], meta: 7 },
  { name: "Leon", roles: ["survival"], meta: 9 },
  { name: "Piper", roles: ["control"], meta: 8 },
  { name: "Dynamike", roles: ["control", "heist"], meta: 7 }
];

// 📉 Buff / Nerf System (Fake Patch Notes)
const patches = {
  Spike: +1,
  Leon: -1,
  Colt: +1,
  Bull: 0,
  Piper: +1,
  Shelly: 0,
  Poco: -1,
  Dynamike: 0
};

// DOM
const mapSelect = document.getElementById("mapSelect");
const list = document.getElementById("brawlerList");
const metaInfo = document.getElementById("metaInfo");

// Init Maps
maps.forEach((m, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = m.name;
  mapSelect.appendChild(opt);
});

// Berechnung Meta
function getMetaScore(brawler, mapType) {
  let score = brawler.meta;

  // Map Bonus
  if (brawler.roles.includes(mapType)) {
    score += 2;
  }

  // Buff/Nerf
  score += (patches[brawler.name] || 0);

  return score;
}

// Render
function update() {
  const map = maps[mapSelect.value];

  const ranked = brawlers
    .map(b => ({
      ...b,
      score: getMetaScore(b, map.type)
    }))
    .sort((a, b) => b.score - a.score);

  list.innerHTML = "";

  ranked.forEach(b => {
    const li = document.createElement("li");
    li.textContent = `${b.name} ⭐ ${b.score.toFixed(1)}`;
    list.appendChild(li);
  });

  metaInfo.innerHTML = `
    <p><b>Map Typ:</b> ${map.type}</p>
    <p><b>Patch Einfluss aktiv:</b> ${Object.keys(patches).length} Brawler angepasst</p>
  `;
}

// Event
mapSelect.addEventListener("change", update);

// Start
update();
