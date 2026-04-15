// Generates caster-style commentary lines for game events

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const CASTER_NAMES = ['Captain Flowers', 'Phreak', 'Kobe', 'Chronicler', 'Dagda', 'Atlus', 'Wolf'];

export function getCasterName(): string {
  return pick(CASTER_NAMES);
}

export function getKillCommentary(killerName: string, victimName: string, isHighlight: boolean): string {
  if (isHighlight) {
    return pick([
      `"WHAT A PLAY from ${killerName}! ${victimName} didn't stand a chance!"`,
      `"${killerName} IS ON FIRE! That's absolutely CRIMINAL what they just did to ${victimName}!"`,
      `"OH MY GOD! ${killerName} just DELETED ${victimName} from the map!"`,
      `"The crowd goes WILD! ${killerName} with the outplay of the tournament!"`,
      `"ARE YOU KIDDING ME?! ${killerName} just styled all over ${victimName}!"`,
    ]);
  }
  return pick([
    `"Clean kill there by ${killerName}, ${victimName} caught slightly out of position."`,
    `"${killerName} finds the opening and takes down ${victimName}."`,
    `"Solid play from ${killerName}, punishing that overextension."`,
    `"${victimName} goes down — ${killerName} reads that perfectly."`,
    `"A clinical execution. ${killerName} knew exactly where ${victimName} would be."`,
  ]);
}

export function getTeamfightCommentary(winnerLabel: string, kills: number, isAce: boolean): string {
  if (isAce) {
    return pick([
      `"IT'S AN ACE! ${winnerLabel} WIPES THE FLOOR WITH THEM! This could be the game!"`,
      `"ACE! ACE! ACE! ${winnerLabel} takes down EVERYONE! The nexus is EXPOSED!"`,
      `"THEY'RE ALL DEAD! ${winnerLabel} with the cleanest ace we've seen all tournament!"`,
    ]);
  }
  if (kills >= 4) {
    return pick([
      `"That teamfight was BRUTAL! ${winnerLabel} leaves almost nobody standing!"`,
      `"A near-perfect fight from ${winnerLabel}! That's how you close out a game!"`,
      `"${winnerLabel} just dismantled them in that 5v5. Incredible macro to force that."`,
    ]);
  }
  return pick([
    `"${winnerLabel} comes out ahead in that skirmish. Smart trading."`,
    `"Good fight from ${winnerLabel}, they're building a nice lead here."`,
    `"${winnerLabel} wins the fight and establishes map control."`,
    `"That went in favor of ${winnerLabel}. The gold gap keeps growing."`,
  ]);
}

export function getDragonCommentary(teamLabel: string, isSoul: boolean, isElder: boolean, dragonName?: string): string {
  if (isElder) {
    return pick([
      `"ELDER DRAGON IS DOWN! ${teamLabel} has the execute buff — anyone below threshold just DIES."`,
      `"This is MASSIVE! ${teamLabel} secures the Elder. The burn is going to be lethal in fights."`,
    ]);
  }
  if (isSoul) {
    return pick([
      `"DRAGON SOUL! ${teamLabel} locks in the ${dragonName || 'Dragon'} Soul! That's a HUGE power spike!"`,
      `"Four dragons for ${teamLabel}! The Soul is theirs and this game just got a LOT harder for the other team."`,
    ]);
  }
  return pick([
    `"${teamLabel} picks up the ${dragonName || 'Dragon'}. Good objective control."`,
    `"Clean dragon take by ${teamLabel}. They're stacking towards soul."`,
    `"${dragonName || 'Drake'} goes to ${teamLabel}. The dragon race continues."`,
  ]);
}

export function getBaronCommentary(teamLabel: string, isSteal: boolean, stealerName?: string): string {
  if (isSteal) {
    return pick([
      `"BARON STEAL!! ${stealerName || teamLabel} WITH THE SMITE OF THEIR LIFE! THE PLACE IS GOING INSANE!"`,
      `"NO WAY! ${stealerName || 'They'} STOLE THE BARON! That's a GAME-CHANGING moment!"`,
      `"THE SMITE FIGHT GOES TO ${teamLabel}! ${stealerName || 'What a hero!'} This crowd is ON THEIR FEET!"`,
    ]);
  }
  return pick([
    `"Baron Nashor falls to ${teamLabel}! The purple buff will help them siege."`,
    `"${teamLabel} secures the Baron. Now they need to use this buff wisely."`,
    `"Smart Baron call from ${teamLabel}. They convert their lead into the biggest buff on the map."`,
  ]);
}

export function getTowerCommentary(teamLabel: string, count: number): string {
  if (count >= 2) {
    return pick([
      `"${teamLabel} is TEARING through structures! ${count} towers fall!"`,
      `"The map is opening up. ${teamLabel} takes ${count} towers off that play."`,
    ]);
  }
  return pick([
    `"Tower goes down for ${teamLabel}. The map pressure keeps building."`,
    `"${teamLabel} converts into a tower. Smart rotational play."`,
    `"Another structure falls. ${teamLabel} is slowly choking them out."`,
  ]);
}

export function getVictoryCommentary(winnerLabel: string, duration: number, mvp?: string): string {
  const mvpLine = mvp ? ` And the MVP has to be ${mvp} — what a performance!` : '';
  return pick([
    `"GG! ${winnerLabel} TAKES IT in ${duration} minutes!${mvpLine} What a game!"`,
    `"AND THAT'S THE NEXUS! ${winnerLabel} WINS!${mvpLine} The crowd erupts!"`,
    `"IT'S OVER! ${winnerLabel} with a dominant ${duration}-minute victory!${mvpLine}"`,
    `"${winnerLabel} secures the W!${mvpLine} What a show from both teams, but ${winnerLabel} was just too clean today."`,
  ]);
}
