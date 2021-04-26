let trackedAbilities;
let pets;
let playerId;
let abilitiesCast = new Map();

function updateAbilitiesCast(logLine, lineId) {
  if (lineId === 2) {
    playerId = logLine[2];
  }
  else if ((lineId === 21) || (lineId === 22)) {
    const [casterId, abilityId, targetId]= [logLine[2], parseInt(logLine[4], 16), logLine[6]];
    if ((casterId != playerId) || (targetId[0] >= '4') || !trackedAbilities.includes(abilityId)) return;

    const [castTime, caster, castId, abilityName] = [new Date(), logLine[3], logLine[44], logLine[5]];
    abilitiesCast.set(castId, [castTime, caster, abilityId, abilityName]);
  }
  else if (lineId === 37) {
    const castId = logLine[4];
    abilitiesCast.delete(castId);
  }
}

function runGhostbuster() {
  const keysToDelete = [];
  for (const [key, value] of abilitiesCast.entries()) {
    const elapsedTime = toUtcMs(new Date()) - toUtcMs(value[0]);
    if (elapsedTime >= 2000) {
      keysToDelete.push(key);
      const str = `${value[3]} has been ghosted.`
      console.log(str);
      responsiveVoice.speak(str);
    }
  }
  for (let i = 0; i != keysToDelete.length; ++i)
    abilitiesCast.delete(keysToDelete[i]);
}

function toUtcMs(date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
}

function parseAbilitiesFile() {
  $.getJSON('abilities.json', (data) => {
    trackedAbilities = data["Tracked Abilities"];
  });
}