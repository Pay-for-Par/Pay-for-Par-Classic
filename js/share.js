import { CHEATS, CHEAT_MAP } from './data.js';

function inventoryLines(inventory) {
  return CHEATS.filter(c => (inventory[c.id] ?? 0) > 0)
    .map(c => `${c.icon} ${c.name} ×${inventory[c.id]}`).join('\n');
}

export function startingCheatCard(round, player) {
  return `PAY TO PAR

${player.name}'s Cheat Card
${round.name}

${inventoryLines(player.startingInventory || player.inventory)}

Use them wisely. Once they're gone, you're playing on pure skill—or luck.`;
}

export function remainingCheatCard(round, player) {
  const used = [];
  player.holes.forEach((hole, i) => hole.usedCheats.forEach(entry =>
    used.push(`${CHEAT_MAP[entry.cheatId].icon} ${CHEAT_MAP[entry.cheatId].name} — Hole ${i + 1}`)
  ));
  return `PAY TO PAR

${player.name}'s Remaining Cheats — Hole ${round.currentHole}

${inventoryLines(player.remainingInventory)}

Already used:
${used.length ? used.join('\n') : 'None yet. Suspiciously respectable.'}`;
}


export function allPlayersCheatCard(round, players) {
  const playerSections = players.map((player) => {
    const inventory = player.startingInventory || player.inventory;
    const cheats = CHEATS
      .filter((cheat) => (inventory[cheat.id] ?? 0) > 0)
      .map((cheat) => `${cheat.icon} ${cheat.name} ×${inventory[cheat.id]}`)
      .join(' · ');

    return `${player.name}
${cheats || 'No cheats selected'}`;
  });

  return `PAY TO PAR — ${round.name}

${playerSections.join('\n\n')}

Once they're gone, you're playing on pure skill—or luck.`;
}

export async function shareText(title, text) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return { ok: true, method: 'share' };
    } catch (e) {
      if (e?.name === 'AbortError') return { ok: false, cancelled: true };
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return { ok: true, method: 'copy' };
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
    return { ok: true, method: 'copy' };
  }
}
