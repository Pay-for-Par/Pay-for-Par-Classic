export const CHEATS = [
  { id: 'breakfast-ball', icon: '🍳', name: 'Breakfast Ball', summary: 'One free re-hit from the first tee.', timing: 'First tee only.', free: true },
  { id: 'lunch-ball', icon: '🍔', name: 'Lunch Ball', summary: 'One free re-hit from the 10th tee.', timing: '10th tee only.', free: true },
  { id: 'i-suck', icon: '🤦', name: 'I Suck!', summary: 'Immediately replay the shot. The first one no longer exists.', timing: 'Declare immediately after the shot.' },
  { id: 'bucket', icon: '🪣', name: 'Bucket of Balls', summary: 'Hit the same shot up to three times and keep the best result.', timing: 'Any shot, including a putt.' },
  { id: 'do-over', icon: '🎯', name: 'Do Over', summary: 'Replay a missed putt and keep the better result.', timing: 'Putting green only.' },
  { id: 'foot-wedge', icon: '🦶', name: 'Foot Wedge', summary: 'Move the ball up to two club lengths, no closer to the hole.', timing: 'Before playing the next shot.' },
  { id: 'hazard', icon: '🌊', name: 'Hazard? What Hazard?', summary: 'Ignore the disaster and drop in the nearest reasonable fairway area without penalty.', timing: 'No closer to the hole.' },
  { id: 'power-drive', icon: '🚀', name: 'Power Drive', summary: 'Add approximately 40 yards to a tee shot.', timing: 'Declare before teeing off.' },
  { id: 'gonna-cheat', icon: '😈', name: "I'm Gonna Cheat", summary: 'Skip the drive and place the ball in a reasonable fairway position, up to 250 yards from the tee.', timing: 'Declare before teeing off.' }
];

export const CHEAT_MAP = Object.fromEntries(CHEATS.map((cheat) => [cheat.id, cheat]));

export const PACKAGES = {
  scratch: {
    id: 'scratch',
    color: 'green',
    icon: '🟢',
    name: 'Scratch Pack',
    blurb: "For golfers who usually don't need much help.",
    description: 'A light loadout for bad luck, bold decisions and the occasional moment of weakness.',
    inventory: {
      'breakfast-ball': 1, 'lunch-ball': 1, 'i-suck': 0, bucket: 1,
      'do-over': 0, 'foot-wedge': 0, hazard: 1, 'power-drive': 0, 'gonna-cheat': 0
    }
  },
  weekend: {
    id: 'weekend',
    color: 'blue',
    icon: '🔵',
    name: 'Weekend Warrior',
    blurb: 'For golfers looking for balanced strategy and recovery.',
    description: 'Enough help to erase a few mistakes, attack a few holes and remain dangerous all day.',
    inventory: {
      'breakfast-ball': 1, 'lunch-ball': 1, 'i-suck': 1, bucket: 1,
      'do-over': 1, 'foot-wedge': 2, hazard: 2, 'power-drive': 1, 'gonna-cheat': 1
    }
  },
  fun: {
    id: 'fun',
    color: 'orange',
    icon: '🟠',
    name: 'Just Keep It Fun',
    blurb: 'For golfers who want fewer disasters and more laughs.',
    description: 'A generous loadout designed to keep the ball moving, the group involved and misery to a minimum.',
    inventory: {
      'breakfast-ball': 1, 'lunch-ball': 1, 'i-suck': 3, bucket: 1,
      'do-over': 2, 'foot-wedge': 3, hazard: 3, 'power-drive': 2, 'gonna-cheat': 1
    }
  }
};

export const WHEEL = [
  ['➕', 'One Stroke', 'Add one stroke immediately.'],
  ['🦩', 'Flamingo', 'Play the next putt standing on one foot.'],
  ['🏌️', 'Happy Gilmore', 'Attempt a Happy Gilmore run-up on the next tee shot.'],
  ['👟', 'Cinderella', 'Remove one shoe for the next tee shot.'],
  ['🎤', 'PGA Announcer', 'Give full TV commentary before the next tee shot.'],
  ['🕵️', 'Cheat Confiscation', 'The Nark steals one unused cheat.']
];
