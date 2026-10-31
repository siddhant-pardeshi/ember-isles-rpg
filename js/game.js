/* ============================================================
 * EMBER ISLES — a small warm top-down adventure.
 * One hand-authored island: Emberwick village, Harbor Point,
 * the Whisper Woods and the dark Ember Cave. Three quests:
 * sunfruit for the lamplighter, beacon braziers in order, and
 * the Ember Heart in the cave. Data-slates teach working with
 * AI assistants. Progress saves locally; the isle remembers you.
 * All art is drawn with canvas paths; all audio is synthesized.
 * ============================================================ */
(function () {
  'use strict';

  /* ---------------- tuning ---------------- */
  const TILE = 32;
  const PLAYER_SPEED = 96;
  const MAPW = 40, MAPH = 30;

  /* tile legend (solid marked *)
     G grass  T tall grass  P path  S sand  W water*
     t tree*  r rock*  H house wall*  R roof*  D door
     L lamp*  B brazier  K dock  C cave floor  X cave wall*
     E cave entrance  w well*  F fence* */
  const MAP = [
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWGttGGGWWWWWGGGXXXXXXXXXXXXXXGGGWWWWWW',
    'WWGGGGGGGWWWWGGXXXXXXXXXXXXXXXXXXGGGWWWW',
    'WGGGGGGGGGGWGGXXXCCCCCCCCCCCCXXXXGGGWWWW',
    'WGGtGGGGGGGGGGGXXCCCCCCCCCCCCCCXXGGGGWWW',
    'WGGGGGTTGGGGGGGXXCCCCCCCCCCCCCCXXGGGGGWW',
    'WGGTTTTTGGGGGGGGXXCCCCCCCCCCCCXXXGGGGGWW',
    'WGGTTTTGGGGGGGGGGEXCCCCCCCCCCCCXXGGGGGWW',
    'WGGGGGGGGGGGGGGGGGGXXCCCXXXXXXXXGGGGGWWW',
    'WWGGGGGGGGGGGGGGGGGGGXXXXXXXXXWGGGGGWWWW',
    'WWWGGGGGGrrGGGGGGGGGGGGGGGGGGGGGGGGWWWWW',
    'WGGGGGGGrrrrGGGGGGGGGGGGGtGGGGGGGGGGGWWW',
    'WGGHHHHGGGGGGGGGGGGGGGGTTTGGGGGGGGGGGWWW',
    'WGGHHHHGGGGGGGGGGGGGGGTTTTTGGGGGGGGGGGWW',
    'WPPHHHHPPPPPPPPPPPPPPPPPTTTGGGGGGGGGGGWW',
    'WPGHHHHGGGGGGGGGGGGGGGGGTTGGGGGGGGGGGGWW',
    'WPGGwwGGGGGGGGGGGGGGGGGGGGGGGGTTTGGGGGWW',
    'WPGGGGGGGGGGGGGGGGGGGGGGGGGGGTTTTTGGGGWW',
    'WPGHHHHHHGGGGGGGGGGGGGGGGGGGGGTTGGGGGGWW',
    'WPGHHHHHHGGGGGGGGGGGGGGGGGGGGGGGGGGGGGWW',
    'WPPGHHHHHGGGGGGGGGGGGGGGGGGGGGGGGGGGGGWW',
    'WWPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGWWW',
    'WWWPPPPPPPPPPPGGGGGGGGGGGGGGGGGGGGGGWWWW',
    'WWWWGGGGGSSPPPPSSSSSSSSSSSSSSSSSSSSWWWWW',
    'WWWWWGGGSSSSKPPKKSSSSSSSSSSSSSSSSSWWWWWW',
    'WWWWWWGGSSSSKPPKKSSSSSSSSSSSSSSSWWWWWWWW',
    'WWWWWWWGGSSSPPPPSSSSSSSSSSSSSSWWWWWWWWWW',
    'WWWWWWWWGGSSSSSSSSSSSSSSSSSSWWWWWWWWWWWW',
    'WWWWWWWWWWWSSSSSSSSSSSSSSWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW'
  ];

  /* world objects */
  const NPCS = [
    { id: 'maren', name: 'Maren', x: 9.2, y: 14.4, role: 'lamplighter', tint: '#C77E4A' },
    { id: 'finn',  name: 'Old Finn', x: 8.4, y: 24.2, role: 'fisher', tint: '#5F7E8A' },
    { id: 'tama',  name: 'Tama', x: 24.3, y: 12.7, role: 'kid', tint: '#B06AC0' },
    { id: 'selu',  name: 'Selu', x: 12.6, y: 24.3, role: 'keeper', tint: '#4A8A6A' }
  ];
  const HOUSES = [
    { x: 2.2, y: 12.1, w: 4, h: 3 },   // Maren's lamp house
    { x: 3.2, y: 18.2, w: 4.6, h: 3 },
    { x: 4.2, y: 20.2, w: 3.6, h: 2.4 }
  ];
  const FRUITS = [
    { id: 'fruit1', x: 6.5, y: 6.5 },
    { id: 'fruit2', x: 3.5, y: 7.5 },
    { id: 'fruit3', x: 25.5, y: 17.5 }
  ];
  const BRAZIERS = [
    { id: 'dock',  x: 11.9, y: 24.5 },
    { id: 'well',  x: 6.6,  y: 16.5 },
    { id: 'north', x: 14.0, y: 10.5 }
  ];
  const BRAZIER_ORDER = ['dock', 'well', 'north'];
  const SLATES = [
    { id: 'slate1', x: 19.5, y: 15.5 },
    { id: 'slate2', x: 26.5, y: 13.5 },
    { id: 'slate3', x: 28.5, y: 6.5 },
    { id: 'slate4', x: 9.5, y: 22.5 },
    { id: 'slate5', x: 16.5, y: 4.5 },
    { id: 'slate6', x: 6.5, y: 20.5 }
  ];
  const SLIMES = [
    { x: 20.5, y: 6.5 }, { x: 24.5, y: 5.5 }, { x: 27.5, y: 9.5 }, { x: 22.5, y: 9.5 }
  ];
  const HEART = { x: 31.0, y: 5.0 };

  const REGION_NAMES = [
    { test: (x, y) => x < 18 && y >= 10 && y <= 22, name: 'Emberwick Village' },
    { test: (x, y) => y > 22, name: 'Harbor Point' },
    { test: (x, y) => x >= 18 && y > 4 && y <= 22, name: 'Whisper Woods' },
    { test: (x, y) => y <= 9 && x > 13, name: 'Ember Cave' },
    { test: () => true, name: 'The Isles' }
  ];

  /* ---------------- state ---------------- */
  let W = { w: 0, h: 0 };
  let player = { x: 7.5, y: 14.5, dir: 'down', moving: false, walkPhase: 0 };
  let cam = { x: 0, y: 0 };
  let quests = { fruit: 'available', braziers: 'available', cave: 'locked' };
  let items = { sunfruit: 0, lantern: false, charm: false, heart: false };
  let talked = {};            // npc id -> true (met)
  let fruitTaken = {};        // fruit id -> true
  let slateTaken = {};        // slate id -> true
  let braziersLit = [];       // ordered ids
  let dlg = null, lanternTier = 0;             // slate mastery brightens the lantern
  let near = null;            // interact target
  let slimes = [];
  let particles = Kit.particles();
  let fireflies = [];
  let state = 'roam';         // roam | dialogue | done
  let G = null;
  let won = false, wonShown = false;
  let idleT = 0;

  /* ---------------- persistence ---------------- */
  function saveGame() {
    Kit.store.set('ember.save', {
      quests, items, player: { x: player.x, y: player.y },
      talked, fruitTaken, slateTaken, braziersLit, won, lanternTier
    });
  }
  function loadGame() {
    const s = Kit.store.get('ember.save', null);
    if (!s) return false;
    quests = s.quests || quests;
    items = s.items || items;
    talked = s.talked || {};
    fruitTaken = s.fruitTaken || {};
    slateTaken = s.slateTaken || {};
    braziersLit = s.braziersLit || [];
    won = !!s.won;
    lanternTier = s.lanternTier || 0;
    if (s.player) { player.x = s.player.x; player.y = s.player.y; }
    return true;
  }
  function hasSave() { return !!Kit.store.get('ember.save', null); }

  /* ---------------- map helpers ---------------- */
  function tileAt(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= MAPW || ty >= MAPH) return 'W';
    return MAP[ty][tx];
  }
  const SOLID = 'Wt rHRLXFw';
  function solid(tx, ty) { return SOLID.includes(tileAt(tx, ty)); }

  function inCave(x, y) { return tileAt(Math.floor(x), Math.floor(y)) === 'C'; }

  function movePlayer(dx, dy) {
    const r = 0.32;
    const tryX = player.x + dx;
    if (!solid(Math.floor(tryX + Math.sign(dx) * r), Math.floor(player.y - r + 0.15)) &&
        !solid(Math.floor(tryX + Math.sign(dx) * r), Math.floor(player.y + r))) {
      player.x = tryX;
    }
    const tryY = player.y + dy;
    if (!solid(Math.floor(player.x - r), Math.floor(tryY + Math.sign(dy) * r + 0.15)) &&
        !solid(Math.floor(player.x + r), Math.floor(tryY + Math.sign(dy) * r))) {
      player.y = tryY;
    }
    /* cave bounds */
    if (inCave(player.x, player.y) || tileAt(Math.floor(player.x), Math.floor(player.y)) === 'E') {
      player.x = Kit.clamp(player.x, 17.2, 31.8);
      player.y = Kit.clamp(player.y, 3.2, 9.2);
    }
    player.x = Kit.clamp(player.x, 1.5, MAPW - 1.5);
    player.y = Kit.clamp(player.y, 1.5, MAPH - 1.5);
  }

  /* ---------------- interaction ---------------- */
  function findNear() {
    const px = player.x, py = player.y;
    for (const n of NPCS) {
      if (Math.hypot(n.x - px, n.y - py) < 1.25) return { kind: 'npc', obj: n };
    }
    for (const f of FRUITS) {
      if (!fruitTaken[f.id] && quests.fruit === 'active' && Math.hypot(f.x - px, f.y - py) < 0.9)
        return { kind: 'fruit', obj: f };
    }
    for (const s of SLATES) {
      if (!slateTaken[s.id] && Math.hypot(s.x - px, s.y - py) < 0.9)
        return { kind: 'slate', obj: s };
    }
    for (const b of BRAZIERS) {
      if (Math.hypot(b.x - px, b.y - py) < 1.1)
        return { kind: 'brazier', obj: b };
    }
    if (quests.cave === 'available' && items.lantern && !items.heart && Math.hypot(HEART.x - px, HEART.y - py) < 1.0)
      return { kind: 'heart', obj: HEART };
    return null;
  }

  function say(name, lines, onDone) {
    dlg = { name, lines, idx: 0, onDone: onDone || null };
    state = 'dialogue';
    renderDlg();
  }
  function advanceDlg() {
    if (!dlg) return;
    dlg.idx++;
    Audio.sfx('ui');
    if (dlg.idx >= dlg.lines.length) {
      const done = dlg.onDone;
      dlg = null;
      state = 'roam';
      document.querySelector('.dlg').classList.remove('on');
      if (done) done();
      saveGame();
    } else renderDlg();
  }
  function renderDlg() {
    const el = document.querySelector('.dlg');
    el.innerHTML = `<b>${dlg.name}</b><p>${dlg.lines[dlg.idx]}</p><span>▸ tap / E</span>`;
    el.classList.add('on');
  }

  function interact() {
    if (state === 'dialogue') { advanceDlg(); return; }
    if (!near) return;
    if (near.kind === 'npc') return talkTo(near.obj);
    if (near.kind === 'fruit') {
      fruitTaken[near.obj.id] = true;
      items.sunfruit++;
      Audio.sfx('coin');
      particles.spawn(pxOf(near.obj.x), pyOf(near.obj.y), { count: 10, color: '#FFB35C', spread: 90, decay: 2.2, glow: true });
      Mascot.react('item');
      if (items.sunfruit >= 3) Kit.toast('All sunfruit — back to Maren');
      else Kit.toast(`Sunfruit ${items.sunfruit} / 3`);
      saveGame();
    }
    if (near.kind === 'slate') {
      slateTaken[near.obj.id] = true;
      Audio.sfx('chime');
      particles.spawn(pxOf(near.obj.x), pyOf(near.obj.y), { count: 12, color: '#7FD8BE', spread: 110, decay: 2, glow: true });
      if (window.Learn && window.LEARN_DATA) {
        const card = Learn.nextCard();
        if (card) {
          Learn.show(card, { timer: 0, onOpen: () => { if (state !== 'dialogue') G.pause(); },
            onClose: () => G.resume() }).then(ok => {
            if (ok) {
              if (lanternTier < 3) { lanternTier++; Kit.toast(`Lantern brightens (LV ${lanternTier})`); }
              else Kit.toast('Slate wisdom kept — lantern at full burn');
              Audio.sfx('powerup');
              Mascot.react('questdone');
            } else {
              lanternTier = Math.max(0, lanternTier - 1);
              Audio.sfx('fail');
              Kit.toast('The lantern dims a little... read the slates again');
              Mascot.react('fail');
            }
          });
        }
      }
      saveGame();
    }
    if (near.kind === 'brazier') return lightBrazier(near.obj);
    if (near.kind === 'heart') {
      items.heart = true;
      Audio.sfx('fanfare');
      particles.spawn(pxOf(HEART.x), pyOf(HEART.y), { count: 24, color: '#FF8A5C', spread: 200, decay: 1.8, glow: true });
      Kit.toast('The Ember Heart is yours — bring it to Maren');
      Mascot.react('item');
      saveGame();
    }
  }

  function talkTo(n) {
    const met = talked[n.id];
    talked[n.id] = true;
    if (n.id === 'maren') {
      if (quests.fruit === 'available') {
        say(n.name, [
          'You came down the harbor road? Good. The big lamp is dry and the night is greedy.',
          'Three sunfruit grow in the Whisper Woods, east past the tall grass. Bring them and I will owe you a lantern.',
          'Sunfruit glows amber. You cannot miss it. Probably.'
        ], () => { quests.fruit = 'active'; Mascot.react('quest'); Kit.toast('Quest: Lantern Oil'); });
      } else if (quests.fruit === 'active' && items.sunfruit < 3) {
        say(n.name, [
          `Sunfruit: ${items.sunfruit} of 3. The woods are east, past the tall grass — watch the fireflies, they mark the clearings.`
        ]);
      } else if (quests.fruit === 'active') {
        say(n.name, [
          'All three! Still warm. The isle is generous this year.',
          'Here — the lantern. Oil, wick, glass. It will follow you into the dark places.',
          'One more thing. The cave north-east holds the Ember Heart. If you ever feel brave... bring it home.'
        ], () => {
          quests.fruit = 'done';
          items.lantern = true;
          quests.cave = 'available';
          Audio.sfx('fanfare');
          Mascot.react('questdone');
          Kit.toast('Got the Lantern — the cave is open');
        });
      } else if (items.heart) {
        say(n.name, [
          'Is that... you actually went into the dark and came back with IT.',
          'Set it down. Gently. ...',
          'Look at the windows. Look at the whole isle. That is you. That is your light now.',
          'Momo was right about you. Rest, wander, stay for the fireflies.'
        ], () => { if (!won) { won = true; Mascot.react('win'); } saveGame(); });
      } else {
        say(n.name, ['The lamp burns well tonight. The cave waits when you are ready — north-east, past the trees.']);
      }
    }
    if (n.id === 'selu') {
      if (quests.braziers === 'available' && quests.fruit === 'done') {
        say(n.name, [
          'The harbor beacons are dark and the ferries steer wide of us.',
          'Light the three braziers — but mind the ORDER. Dock first, then the well, then the north path.',
          'Wrong order and the wicks sulk. They are temperamental old things.'
        ], () => { quests.braziers = 'active'; Mascot.react('quest'); Kit.toast('Quest: Signal Embers'); });
      } else if (quests.braziers === 'active') {
        say(n.name, [
          `Beacons: ${braziersLit.length} of 3. Remember — dock, then well, then north path.`
        ]);
      } else if (quests.braziers === 'activeDone') {
        say(n.name, [
          'All three burn! The ferries will see us from miles out.',
          'Take the Keeper\'s Charm — a little warmth that stays with you.'
        ], () => { quests.braziers = 'done'; items.charm = true; Audio.sfx('fanfare'); Mascot.react('questdone'); });
      } else if (quests.braziers === 'done') {
        say(n.name, ['The beacons hold. Sailors name their ships after less.']);
      } else {
        say(n.name, ['You smell of adventure and sunfruit. The lamplighter is the one with quests — west end of the village.']);
      }
    }
    if (n.id === 'finn') {
      say(n.name, met
        ? ['Fish are talking. Something about a warm light in the cave. Probably nothing. Probably.']
        : ['Old Finn. I fish, I grumble, I mind the skiff. The lamplighter pays in stew — go see her for the exciting stuff.']);
    }
    if (n.id === 'tama') {
      say(n.name, met
        ? ['The fireflies like the tall grass best. They are tiny lanterns that got lost. Do not tell Maren.']
        : ['Shh — counting fireflies. Forty-two! No wait. Forty-one. One moved.']);
    }
  }

  function lightBrazier(b) {
    if (quests.braziers !== 'active' && quests.braziers !== 'activeDone') {
      say('Brazier', ['Cold wick. Someone who knows the signal order could light it.']);
      return;
    }
    if (braziersLit.includes(b.id)) { Kit.toast('Already burning'); return; }
    const expected = BRAZIER_ORDER[braziersLit.length];
    if (b.id === expected) {
      braziersLit.push(b.id);
      Audio.sfx('chime');
      particles.spawn(pxOf(b.x), pyOf(b.y), { count: 14, color: '#FFB35C', spread: 130, decay: 1.8, glow: true });
      if (braziersLit.length >= 3) {
        quests.braziers = 'activeDone';
        Kit.toast('All beacons burn — return to Selu');
        Mascot.react('questdone');
      } else Kit.toast(`Beacon lit ${braziersLit.length} / 3`);
    } else {
      braziersLit = [];
      Audio.sfx('fail');
      Kit.toast('Wrong order — the wicks sulk out');
      Mascot.react('fail');
    }
    saveGame();
  }

  /* ---------------- update ---------------- */
  function update(dt) {
    idleT += dt;
    if (idleT > 12 && state === 'roam') {
      idleT = 0;
      const q = activeQuestHint();
      if (q) { Mascot.say(q, 4200); Mascot.play('think', { once: true }); }
    }

    if (state === 'dialogue') {
      if (Kit.input.pressed('action') || Kit.input.pressed('enter')) advanceDlg();
      updateSlimes(dt, false);
      return;
    }
    if (state !== 'roam') return;

    const ax = Kit.input.axis();
    let dx = ax.x, dy = ax.y;
    if (Kit.input.pressed('action') || Kit.input.pressed('enter')) interact();
    if (Math.hypot(dx, dy) > 0.15) {
      const m = Math.hypot(dx, dy);
      dx /= m; dy /= m;
      movePlayer(dx * PLAYER_SPEED * dt / TILE, dy * PLAYER_SPEED * dt / TILE);
      player.moving = true;
      player.walkPhase += dt * 9;
      player.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
      if (Math.random() < dt * 6) particles.spawn(pxOf(player.x), pyOf(player.y) + 10, { count: 1, color: 'rgba(255,220,170,0.5)', spread: 14, vy: -6, decay: 2.6, size: 1.6 });
    } else player.moving = false;

    near = findNear();
    updateSlimes(dt, true);

    /* camera follows */
    cam.x = Kit.lerp(cam.x, Kit.clamp(player.x * TILE - W.w / 2, 0, MAPW * TILE - W.w), Math.min(1, dt * 6));
    cam.y = Kit.lerp(cam.y, Kit.clamp(player.y * TILE - W.h / 2, 0, MAPH * TILE - W.h), Math.min(1, dt * 6));
    if (MAPW * TILE < W.w) cam.x = (MAPW * TILE - W.w) / 2;
    if (MAPH * TILE < W.h) cam.y = (MAPH * TILE - W.h) / 2;

    particles.update(dt);
    updateHUD();
  }

  function updateSlimes(dt, hunt) {
    for (const s of slimes) {
      s.t = (s.t || Math.random() * 6) + dt;
      if (hunt && !items.heart) {
        const dxp = player.x - s.x, dyp = player.y - s.y;
        const d = Math.hypot(dxp, dyp);
        if (d < 4.5 && d > 0.2) {
          s.x += dxp / d * dt * 1.1;
          s.y += dyp / d * dt * 1.1;
        }
      }
      if (!solid(Math.floor(s.x), Math.floor(s.y)) || inCave(s.x, s.y)) {
        if (tileAt(Math.floor(s.x), Math.floor(s.y)) !== 'C') { s.x -= 0; } // slimes live in cave
      }
      /* bounce off player */
      const d2 = Math.hypot(player.x - s.x, player.y - s.y);
      if (d2 < 0.55 && inCave(player.x, player.y)) {
        const push = 0.9 / (d2 || 0.01);
        movePlayer((player.x - s.x) * push * 0.05, (player.y - s.y) * push * 0.05);
        if (!s.cool || s.t - s.cool > 1.2) {
          s.cool = s.t;
          Audio.sfx('jump');
          Kit.buzz(30);
          Kit.toast('The slime bounces you — lantern dims for a breath');
          G.shake(3);
        }
      }
    }
  }

  function activeQuestHint() {
    if (quests.fruit === 'active' && items.sunfruit < 3) return 'The sunfruit is east — past the tall grass, where the fireflies gather.';
    if (quests.fruit === 'active') return 'Three sunfruit pocketed. Maren waits at the west end of the village.';
    if (quests.braziers === 'active' && braziersLit.length < 3) return 'Beacons in order: the dock, then the well, then the north path.';
    if (quests.braziers === 'activeDone') return 'Selu by the harbor wants to hear the beacons are burning.';
    if (quests.cave === 'available' && items.lantern) return 'The cave mouth is north-east. The lantern will hold the dark back.';
    if (quests.cave === 'available' && !items.heart) return 'The Ember Heart sits in the far chamber. Mind the slimes.';
    if (items.heart) return 'The Heart is found. Maren — west end of the village.';
    return null;
  }

  /* ---------------- render ---------------- */
  function render(ctx, gg) {
    const { w, h } = W;
    ctx.fillStyle = '#141018';
    ctx.fillRect(0, 0, w, h);

    const x0 = Math.floor(cam.x / TILE) - 1, y0 = Math.floor(cam.y / TILE) - 1;
    const x1 = x0 + Math.ceil(w / TILE) + 3, y1 = y0 + Math.ceil(h / TILE) + 3;
    const t = gg.t;

    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const c = tileAt(tx, ty);
        const sx = tx * TILE - cam.x, sy = ty * TILE - cam.y;
        if (c === 'W') {
          const sh = Math.sin(t * 1.6 + tx * 0.9 + ty * 1.3) * 0.5 + 0.5;
          ctx.fillStyle = `rgb(${18 + sh * 10},${34 + sh * 16},${52 + sh * 18})`;
          ctx.fillRect(sx, sy, TILE, TILE);
          if ((tx * 7 + ty * 13) % 11 < 2) {
            ctx.fillStyle = 'rgba(127,216,190,0.14)';
            ctx.fillRect(sx + 6, sy + 10 + sh * 6, 14, 2);
          }
        } else if (c === 'S') {
          ctx.fillStyle = '#C9A36B';
          ctx.fillRect(sx, sy, TILE, TILE);
          if ((tx + ty) % 3 === 0) { ctx.fillStyle = 'rgba(120,90,50,0.18)'; ctx.fillRect(sx + 8, sy + 14, 5, 3); }
        } else if (c === 'K') {
          ctx.fillStyle = '#8A6B4A';
          ctx.fillRect(sx, sy, TILE, TILE);
          ctx.strokeStyle = 'rgba(60,44,28,0.5)'; ctx.lineWidth = 2;
          ctx.strokeRect(sx + 1, sy + 1, TILE - 2, TILE - 2);
        } else if (c === 'P') {
          ctx.fillStyle = '#C7A87E';
          ctx.fillRect(sx, sy, TILE, TILE);
          if ((tx * 5 + ty * 3) % 7 < 2) { ctx.fillStyle = 'rgba(150,120,80,0.35)'; ctx.fillRect(sx + 10, sy + 12, 8, 5); }
        } else if (c === 'C' || c === 'E') {
          ctx.fillStyle = c === 'E' ? '#4A3A30' : '#241C1E';
          ctx.fillRect(sx, sy, TILE, TILE);
          if ((tx * 3 + ty * 5) % 9 < 2) { ctx.fillStyle = 'rgba(90,70,60,0.3)'; ctx.fillRect(sx + 12, sy + 8, 6, 4); }
        } else if (c === 'X') {
          ctx.fillStyle = '#161116';
          ctx.fillRect(sx, sy, TILE, TILE);
          ctx.fillStyle = '#241C22';
          ctx.fillRect(sx + 2, sy + 2, TILE - 4, TILE - 4);
        } else if (c === 'H' || c === 'R') {
          const shh = ((tx * 13 + ty * 7) % 5) * 0.02;
          ctx.fillStyle = `rgb(${52 + shh * 90},${96 + shh * 70},${58 + shh * 60})`;
          ctx.fillRect(sx, sy, TILE, TILE);
        } else if (c === 'F') {
          ctx.fillStyle = '#C7A87E'; ctx.fillRect(sx, sy, TILE, TILE);
          ctx.fillStyle = '#8A6B4A'; ctx.fillRect(sx + 12, sy + 4, 6, 24);
        } else if (c === 'w') {
          drawWell(ctx, sx, sy);
        } else if (c === 'L') {
          drawLamp(ctx, sx, sy, t);
        } else { /* grass / tall grass */
          const sh = ((tx * 13 + ty * 7) % 5) * 0.02;
          ctx.fillStyle = `rgb(${52 + sh * 90},${96 + sh * 70},${58 + sh * 60})`;
          ctx.fillRect(sx, sy, TILE, TILE);
          if (c === 'T') {
            ctx.strokeStyle = 'rgba(30,60,30,0.65)'; ctx.lineWidth = 2;
            for (let i = 0; i < 4; i++) {
              const bx = sx + 5 + i * 7, sway = Math.sin(t * 2 + tx + i) * 2;
              ctx.beginPath(); ctx.moveTo(bx, sy + 28); ctx.quadraticCurveTo(bx + sway, sy + 16, bx + sway * 1.6, sy + 6); ctx.stroke();
            }
          } else if ((tx * 11 + ty * 17) % 13 < 3) {
            ctx.fillStyle = 'rgba(180,220,120,0.25)';
            ctx.fillRect(sx + 8, sy + 9, 3, 3); ctx.fillRect(sx + 20, sy + 20, 3, 3);
          }
        }
      }
    }

    /* cottages behind the player (painter's order; front pass follows the player) */
    const feetY = pyOf(player.y) + 13;
    for (const hs of HOUSES) {
      if ((hs.y + hs.h) * TILE - cam.y <= feetY) drawCottage(hs);
    }

  function drawCottage(hs) {
    const hx = pxOf(hs.x), hy = pyOf(hs.y);
    const hw = hs.w * TILE, hh = hs.h * TILE;
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(hx + 5, hy + hh - 2, hw, 7);
    /* wall */
    ctx.fillStyle = '#D9C29A';
    ctx.fillRect(hx + 4, hy + hh * 0.42, hw - 8, hh * 0.58);
    /* roof */
    ctx.fillStyle = '#B0603C';
    ctx.beginPath();
    ctx.moveTo(hx - 3, hy + hh * 0.45);
    ctx.lineTo(hx + hw / 2, hy - 2);
    ctx.lineTo(hx + hw + 3, hy + hh * 0.45);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(90,40,24,0.35)';
    for (let i = 1; i < 4; i++) ctx.fillRect(hx - 3 + i * (hw + 6) / 4 - 1, hy + hh * 0.1, 2, hh * 0.34);
    /* door + window */
    ctx.fillStyle = '#7A5A3C';
    ctx.fillRect(hx + hw / 2 - 6, hy + hh * 0.62, 12, hh * 0.38);
    ctx.fillStyle = 'rgba(255,205,120,0.85)';
    ctx.fillRect(hx + 10, hy + hh * 0.6, 9, 8);
  }

    /* braziers */
    for (const b of BRAZIERS) {
      const lit = braziersLit.includes(b.id);
      drawBrazier(ctx, pxOf(b.x), pyOf(b.y), lit, t);
    }
    /* sunfruit */
    if (quests.fruit === 'active') {
      for (const f of FRUITS) {
        if (fruitTaken[f.id]) continue;
        const fx = pxOf(f.x), fy = pyOf(f.y) + Math.sin(t * 2.4 + f.x) * 3;
        ctx.fillStyle = 'rgba(255,179,92,0.28)';
        ctx.beginPath(); ctx.arc(fx, fy, 13, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FFB35C';
        ctx.beginPath(); ctx.arc(fx, fy, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FFE08B';
        ctx.beginPath(); ctx.arc(fx - 2, fy - 2, 2.4, 0, Math.PI * 2); ctx.fill();
      }
    }
    /* slates */
    for (const s of SLATES) {
      if (slateTaken[s.id]) continue;
      const fx = pxOf(s.x), fy = pyOf(s.y) - 2 + Math.sin(t * 2 + s.y) * 2.5;
      ctx.save();
      ctx.translate(fx, fy); ctx.rotate(-0.12 + Math.sin(t) * 0.03);
      ctx.fillStyle = '#2A4A44'; ctx.strokeStyle = '#7FD8BE'; ctx.lineWidth = 1.6;
      roundedRect(ctx, -9, -12, 18, 24, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(127,216,190,0.9)';
      for (let i = 0; i < 3; i++) ctx.fillRect(-5, -7 + i * 7, 10 - i * 3, 2);
      ctx.restore();
    }
    /* heart */
    if (quests.cave === 'available' && items.lantern && !items.heart) {
      const fx = pxOf(HEART.x), fy = pyOf(HEART.y) + Math.sin(t * 2.2) * 4;
      ctx.fillStyle = 'rgba(255,138,92,0.3)';
      ctx.beginPath(); ctx.arc(fx, fy, 18 + Math.sin(t * 3) * 3, 0, Math.PI * 2); ctx.fill();
      drawHeart(ctx, fx, fy, 11, '#FF8A5C');
    }
    /* slimes */
    for (const s of slimes) {
      const fx = pxOf(s.x), fy = pyOf(s.y);
      const sq = 1 + Math.sin((s.t || 0) * 6) * 0.12;
      ctx.fillStyle = 'rgba(90,220,160,0.85)';
      ctx.beginPath(); ctx.ellipse(fx, fy, 9 * sq, 7 / sq, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0F241C';
      ctx.beginPath(); ctx.arc(fx - 3, fy - 2, 1.6, 0, Math.PI * 2); ctx.arc(fx + 3, fy - 2, 1.6, 0, Math.PI * 2); ctx.fill();
    }
    /* npcs */
    for (const n of NPCS) drawNPC(ctx, n, t);
    /* player */
    drawPlayer(ctx, t);
    /* cottages in front of the player (roof overhangs) */
    for (const hs of HOUSES) {
      if ((hs.y + hs.h) * TILE - cam.y > feetY) drawCottage(hs);
    }
    /* fireflies over the woods + village at "night" sides */
    for (const f of fireflies) {
      f.a += f.sp * 0.016;
      const fx = pxOf(f.bx + Math.cos(f.a) * f.r), fy = pyOf(f.by + Math.sin(f.a * 1.3) * f.r * 0.6);
      ctx.fillStyle = `rgba(255,220,130,${0.35 + 0.4 * Math.abs(Math.sin(t * 2 + f.p))})`;
      ctx.beginPath(); ctx.arc(fx, fy, 1.8, 0, Math.PI * 2); ctx.fill();
    }

    particles.render(ctx);

    /* lantern mask in the cave */
    if (inCave(player.x, player.y)) {
      const px = pxOf(player.x), py = pyOf(player.y);
      const r = 150 + lanternTier * 45 + Math.sin(t * 5) * 4;
      const g2 = ctx.createRadialGradient(px, py, 30, px, py, r);
      g2.addColorStop(0, 'rgba(0,0,0,0)');
      g2.addColorStop(0.7, 'rgba(8,4,8,0.75)');
      g2.addColorStop(1, 'rgba(8,4,8,0.96)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);
    }

    /* warm dusk grade + interact prompt */
    ctx.fillStyle = 'rgba(255,150,80,0.07)';
    ctx.fillRect(0, 0, w, h);
    if (near && state === 'roam') {
      const px = pxOf(near.obj.x), py = pyOf(near.obj.y) - 34;
      ctx.fillStyle = 'rgba(13,17,30,0.85)';
      roundedRect(ctx, px - 26, py - 15, 52, 20, 8); ctx.fill();
      ctx.fillStyle = '#EAF1FF';
      ctx.font = '700 11px Trebuchet MS, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(near.kind === 'npc' ? near.obj.name : 'E / ACT', px, py - 1);
      ctx.textAlign = 'left';
    }
  }

  function pxOf(x) { return x * TILE - cam.x; }
  function pyOf(y) { return y * TILE - cam.y; }

  function roundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawWell(ctx, sx, sy) {
    ctx.fillStyle = '#8A7A62'; ctx.fillRect(sx + 4, sy + 6, 24, 22);
    ctx.fillStyle = '#6B5D4A'; ctx.fillRect(sx + 8, sy + 12, 16, 12);
    ctx.fillStyle = '#B0603C'; ctx.fillRect(sx + 2, sy, 28, 7);
  }
  function drawLamp(ctx, sx, sy, t) {
    ctx.fillStyle = '#4A4038'; ctx.fillRect(sx + 13, sy + 8, 6, 22);
    const glow = 0.5 + 0.15 * Math.sin(t * 3);
    ctx.fillStyle = `rgba(255,190,110,${glow})`;
    ctx.beginPath(); ctx.arc(sx + 16, sy + 6, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgba(255,190,110,${glow * 0.25})`;
    ctx.beginPath(); ctx.arc(sx + 16, sy + 6, 16, 0, Math.PI * 2); ctx.fill();
  }
  function drawBrazier(ctx, x, y, lit, t) {
    ctx.fillStyle = '#4A4038';
    ctx.beginPath(); ctx.moveTo(x - 9, y + 8); ctx.lineTo(x + 9, y + 8); ctx.lineTo(x + 5, y + 16); ctx.lineTo(x - 5, y + 16); ctx.closePath(); ctx.fill();
    if (lit) {
      const fl = 1 + Math.sin(t * 9 + x) * 0.2;
      ctx.fillStyle = 'rgba(255,160,80,0.9)';
      ctx.beginPath(); ctx.ellipse(x, y - 4, 6 * fl, 10 * fl, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,224,139,0.95)';
      ctx.beginPath(); ctx.ellipse(x, y - 2, 3.4 * fl, 6 * fl, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,160,80,0.16)';
      ctx.beginPath(); ctx.arc(x, y - 4, 26 * fl, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = '#2A2622';
      ctx.beginPath(); ctx.ellipse(x, y - 1, 6, 3, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  function drawHeart(ctx, x, y, s, col) {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.7);
    ctx.bezierCurveTo(x - s * 1.3, y - s * 0.2, x - s * 0.6, y - s, x, y - s * 0.35);
    ctx.bezierCurveTo(x + s * 0.6, y - s, x + s * 1.3, y - s * 0.2, x, y + s * 0.7);
    ctx.fill();
  }

  function drawNPC(ctx, n, t) {
    const x = pxOf(n.x), y = pyOf(n.y);
    const bob = Math.sin(t * 2.2 + n.x) * 1.4;
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.ellipse(x, y + 13, 10, 3.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = n.tint;
    roundedRect(ctx, x - 8, y - 8 + bob, 16, 20, 6); ctx.fill();
    ctx.fillStyle = '#C1814E';
    ctx.beginPath(); ctx.arc(x, y - 14 + bob, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#242832';
    ctx.beginPath(); ctx.arc(x, y - 17 + bob, 8, Math.PI, 0); ctx.fill();
    /* quest indicator */
    let mark = null;
    if (n.id === 'maren' && (quests.fruit === 'available' || (quests.fruit === 'active' && items.sunfruit >= 3) || items.heart)) mark = '!';
    if (n.id === 'selu' && ((quests.fruit === 'done' && quests.braziers === 'available') || quests.braziers === 'activeDone')) mark = '!';
    if (mark) {
      const by = y - 34 + Math.sin(t * 4) * 3;
      ctx.fillStyle = '#FFD166';
      ctx.font = '800 15px Trebuchet MS, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(mark, x, by); ctx.textAlign = 'left';
    }
  }

  function drawPlayer(ctx, t) {
    const x = pxOf(player.x), y = pyOf(player.y);
    const bob = player.moving ? Math.abs(Math.sin(player.walkPhase)) * 2.2 : Math.sin(t * 2) * 1;
    const lean = player.moving ? (player.dir === 'left' ? -1 : player.dir === 'right' ? 1 : 0) * 0.06 : 0;
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath(); ctx.ellipse(x, y + 13, 10, 3.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.save();
    ctx.translate(x, y); ctx.rotate(lean);
    /* legs */
    const lp = player.moving ? Math.sin(player.walkPhase) * 4 : 0;
    ctx.fillStyle = '#33405F';
    ctx.fillRect(-6, 8 - (lp > 0 ? lp : 0), 5, 7);
    ctx.fillRect(1, 8 - (lp < 0 ? -lp : 0), 5, 7);
    /* body: teal scarf + satchel */
    ctx.fillStyle = '#3E6E62';
    roundedRect(ctx, -9, -8 + bob, 18, 18, 6); ctx.fill();
    ctx.fillStyle = '#7FD8BE';
    ctx.fillRect(-9, -8 + bob, 18, 4);
    ctx.fillStyle = '#8A6B4A';
    roundedRect(ctx, 4, 0 + bob, 8, 9, 2); ctx.fill();
    /* head */
    ctx.fillStyle = '#C1814E';
    ctx.beginPath(); ctx.arc(0, -16 + bob, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#242832';
    ctx.beginPath(); ctx.arc(0, -19 + bob, 9, Math.PI, 0); ctx.fill();
    /* eyes by facing */
    ctx.fillStyle = '#2A1E16';
    const ex = player.dir === 'left' ? -3 : player.dir === 'right' ? 3 : 0;
    if (player.dir !== 'up') {
      ctx.beginPath(); ctx.arc(-3 + ex, -15 + bob, 1.4, 0, Math.PI * 2); ctx.arc(3 + ex, -15 + bob, 1.4, 0, Math.PI * 2); ctx.fill();
    }
    /* lantern when owned */
    if (items.lantern) {
      const lx = 13, ly = 2 + Math.sin(t * 3) * 1.5;
      ctx.fillStyle = '#4A4038'; ctx.fillRect(lx - 1, ly - 6, 2, 4);
      ctx.fillStyle = 'rgba(255,190,110,0.95)';
      roundedRect(ctx, lx - 4, ly - 3, 8, 9, 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,190,110,0.2)';
      ctx.beginPath(); ctx.arc(lx, ly + 1, 14, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  /* ---------------- HUD ---------------- */
  let hudEls = null;
  function buildHUD() {
    const hud = document.getElementById('hud');
    hud.innerHTML = `
      <div class="hud-top">
        <div class="chip"><small>Where</small><span id="hw-region">Emberwick</span></div>
        <div class="chip" style="max-width:46vw"><small>Quest</small><span id="hw-quest" style="font-size:12px">Explore the isle</span></div>
      </div>
      <div class="dlg" id="dlg"></div>`;
    hudEls = {
      region: document.getElementById('hw-region'),
      quest: document.getElementById('hw-quest')
    };
    /* dialogue click-to-advance */
    document.getElementById('dlg').addEventListener('click', () => advanceDlg());
  }
  function updateHUD() {
    if (!hudEls) return;
    for (const r of REGION_NAMES) {
      if (r.test(player.x, player.y)) { hudEls.region.textContent = r.name; break; }
    }
    hudEls.quest.textContent = questLabel();
  }
  function questLabel() {
    if (won) return 'The isle is warm because of you';
    if (quests.fruit === 'active' && items.sunfruit < 3) return `Lantern Oil — sunfruit ${items.sunfruit}/3`;
    if (quests.fruit === 'active') return 'Lantern Oil — return to Maren';
    if (quests.braziers === 'active' && braziersLit.length < 3) return `Signal Embers — beacons ${braziersLit.length}/3 (dock, well, north)`;
    if (quests.braziers === 'activeDone') return 'Signal Embers — return to Selu';
    if (quests.cave === 'available' && !items.heart) return 'The Cave Heart — north-east cave';
    if (items.heart) return 'Bring the Ember Heart to Maren';
    return 'Explore the isle';
  }

  /* ---------------- songs ---------------- */
  Audio.defineSong('menu', {
    bpm: 88,
    layers: [
      { type: 'pad', wave: 'sawtooth', steps: 'D3 - - - - - - - - - - - - - - - A2 - - - - - - - - - - - - - - -', gain: 0.13, cutoff: 800, attack: 0.5, release: 1.8 },
      { type: 'arp', wave: 'triangle', steps: 'D4 . F4 . A4 . F4 . D4 . F4 . A4 . C5 . Bb3 . D4 . F4 . D4 . C4 . E4 . G4 . E4 .', gain: 0.16 },
      { type: 'bass', wave: 'triangle', steps: 'D2 . . . . . . . A1 . . . . . . . Bb1 . . . . . . . A1 . . . . . . .', gain: 0.26 },
      { type: 'hat', steps: '. . a . . . a . . . a . . . a .', gain: 0.07 }
    ]
  });
  Audio.defineSong('cave', {
    bpm: 72,
    layers: [
      { type: 'pad', wave: 'sawtooth', steps: 'D3 - - - - - - - - - - - - - - - C3 - - - - - - - - - - - - - - -', gain: 0.12, cutoff: 520, attack: 0.7, release: 2.2 },
      { type: 'bass', wave: 'sine', steps: 'D2 . . . . . . . . . . . . . . . C2 . . . . . . . . . . . . . . .', gain: 0.22 },
      { type: 'arp', wave: 'triangle', steps: '. . . . D5 . . . . . F5 . . . . . . . . C5 . . . . . A4 . . . . .', gain: 0.1, intensity: true }
    ]
  });

  /* ---------------- shell wiring ---------------- */
  window.GAME = {
    id: 'ember-isles-rpg',
    brand: 'EMBER ISLES',
    kicker: 'A Small Warm Adventure',
    title: 'EMBER <em>ISLES</em>',
    tagline: 'One cozy island at golden hour. Collect sunfruit for the lamplighter, light the beacon braziers in order, and carry a lantern into the dark cave. The isle remembers you.',
    best: null,
    controls: [
      { key: 'WASD', text: '<b>Walk.</b> Eight directions, soft collisions — the isle is small; every corner is reachable.' },
      { key: 'E', text: '<b>Interact.</b> Talk to villagers, pick sunfruit, read data-slates, light braziers. The prompt appears when you are close.' },
      { key: 'Braziers', text: '<b>Signal Embers:</b> light the three beacons in Selu\'s order — dock, well, north path. Wrong order and they sulk out.' },
      { key: 'Cave', text: '<b>The Ember Cave</b> is dark. Your lantern holds a circle of warmth around you; slimes bounce, they do not bite.' },
      { key: 'Slates', text: '<b>Data-slates</b> glow across the isle. Each opens a short lesson on working with AI assistants — asking well, checking evidence, granting little.' },
      { key: 'Saving', text: '<b>Progress saves automatically</b> on this device. Reset from Settings if you want a fresh isle.' }
    ],
    touch: {
      joy: true,
      buttons: [{ name: 'action', label: 'ACT', primary: true }]
    },
    mascot: {
      name: 'Momo — guide sprite',
      accent: '#FFB35C',
      lines: {
        welcome: [
          'Momo! You found the isle. Follow the warm lights — Maren is looking for you.',
          'Welcome to Emberwick. Everything here glows a little, even us.'
        ],
        return: [
          'The lanterns kept spinning while you were gone.',
          'Back! The fireflies missed you. I counted.'
        ],
        quest: ['A task! Say yes, say yes.', 'That sounds like an adventure with snacks.'],
        item: ['One more and Maren can light the big lamp!', 'Pocket that safely. Probably.'],
        questdone: ['Quest complete! The isle feels warmer already.', 'Told you it was a snack adventure.'],
        hint: ['Try the woods east of the well, past the tall grass.', 'The braziers want an order... listen to Selu again.'],
        win: ['The whole isle is glowing. That was you.', 'Ember Heart delivered. Momo is doing a proud spin.']
      },
      cooldowns: { quest: 10000, item: 6000, questdone: 15000 }
    },
    menuSong: 'menu',
    learn: {
      intro: window.LEARN_DATA.intro,
      banks: window.LEARN_DATA.banks
    },
    onStart() {
      buildHUD();
      if (!hasSave()) {
        player = { x: 7.5, y: 14.5, dir: 'down', moving: false, walkPhase: 0 };
        quests = { fruit: 'available', braziers: 'available', cave: 'locked' };
        items = { sunfruit: 0, lantern: false, charm: false, heart: false };
        talked = {}; fruitTaken = {}; slateTaken = {}; braziersLit = []; won = false; lanternTier = 0;
      } else loadGame();
      initSlimes();
      state = 'roam';
      G.resume();
      Audio.playSong('menu');
      Kit.showScreen('hud');
    },
    onRestart() { Kit.store.del('ember.save'); window.GAME.onStart(); },
    onPause() { G.pause(); Audio.duck(500); },
    onResume() { G.resume(); },
    onQuit() { G.stop(); Audio.stopSong(); }
  };

  /* ---------------- boot ---------------- */
  const canvas = document.getElementById('stage');
  G = Kit.game({
    canvas,
    onResize(dim) { W.w = dim.w; W.h = dim.h; },
    update,
    render
  });

  function initSlimes() {
    slimes = SLIMES.map(s => ({ ...s, t: Math.random() * 6 }));
    fireflies = [];
    for (let i = 0; i < 26; i++) {
      fireflies.push({
        bx: Kit.rand(18, 34), by: Kit.rand(10, 21), r: Kit.rand(0.6, 2.2),
        a: Math.random() * 6.28, sp: Kit.rand(0.4, 1.1), p: Math.random() * 6.28
      });
    }
    for (let i = 0; i < 10; i++) {
      fireflies.push({
        bx: Kit.rand(3, 15), by: Kit.rand(11, 21), r: Kit.rand(0.5, 1.4),
        a: Math.random() * 6.28, sp: Kit.rand(0.3, 0.8), p: Math.random() * 6.28
      });
    }
  }

  initSlimes();
  loadGame();
  toAttract();

  function toAttract() {
    /* menu backdrop: slow drift over the village */
    cam.x = 3 * TILE; cam.y = 12 * TILE;
    state = 'roam';
    G.start();
    Audio.playSong('menu');
  }

  /* attract drift */
  setInterval(() => {
    if (Kit.screens.active() !== 'hud' && G && !G.paused) {
      cam.x = Kit.clamp(cam.x + 0.18, 0, MAPW * TILE - W.w);
      cam.y = 12 * TILE + Math.sin(Date.now() / 4200) * 2.2 * TILE - W.h / 2 * 0;
      cam.y = Kit.clamp(12 * TILE - W.h / 2 + Math.sin(Date.now() / 4200) * 26, 0, MAPH * TILE - W.h);
    }
  }, 40);
})();
