# EMBER ISLES

**One small warm island, and it remembers you.** A cozy top-down adventure at golden hour: collect sunfruit for the lamplighter, light the beacon braziers in the right order, and carry a lantern into the dark cave — where slimes bounce but never bite.

[▶ Play Ember Isles](https://siddhant-pardeshi.github.io/ember-isles-rpg/) — free, no install, no login. Phones and desktops.

## The pitch

Emberwick village is five cottages, a well, and a lamplighter with a problem: the big lamp is dry and the night is greedy. East of the village the Whisper Woods hold glowing sunfruit and fireflies that mark the clearings. South, Harbor Point's beacons have gone cold and the ferries steer wide. And north-east, past the trees, the Ember Cave waits with its far chamber and its famous, impossible Heart.

Three quests, one save that lives on your device, and an isle that keeps your progress between visits. There is no combat and no score — just warm light, in more ways than one.

## Data-slates: learn to work with AI

Glowing slates are scattered across the isle. Each one opens a short lesson on working with AI assistants — how to ask well, why confident is not the same as correct, what least-privilege means for connected tools, why you verify a citation before you act on it. Right answers **brighten your lantern** (up to LV3 — a wider circle of light in the cave); wrong answers dim it. Every slate you read is tracked in the menu's **Concepts** codex, and three correct reads masters a card.

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Walk | `WASD` / arrows | Joystick |
| Interact | `E` | ACT button |
| Pause | `Esc` / `P` | Pause icon |

- **Sunfruit** glows amber in the woods — you cannot miss it, probably.
- **The braziers** want Selu's order: dock, well, north path. Wrong order and the wicks sulk out.
- **The cave** is dark. Your lantern holds a warm circle around you; its light is your map.
- Full guide: [docs/HOW_TO_PLAY.md](docs/HOW_TO_PLAY.md).

## Momo, your guide sprite

The character in the corner is Momo — the isle's small enthusiastic guide. They greet you, celebrate quest completions with real animations, nudge you with hints if you idle near an objective, and nap when you pause. Hide or mute them in Settings. Rig details: [docs/mascot-guide.md](docs/mascot-guide.md).

## Accessibility & settings

Volume sliders and mute (`M`), quality tiers, reduced motion, hideable mascot, fullscreen, keyboard-playable menus, touch targets ≥ 44px, and a calm pace by design — nothing here is timed. Fully playable muted.

## Under the hood

One shared game kit, zero downloaded assets: a 40×30 hand-authored tile island rendered with canvas paths (swaying grass, shimmering water, fireflies, long shadows), dialogue with a typewriter, a real quest state machine, and a versioned local save. The soundtrack — warm triangle arps, and a darker pad variation underground — is synthesized live with WebAudio.

- [docs/HOW_TO_PLAY.md](docs/HOW_TO_PLAY.md)
- [docs/mascot-guide.md](docs/mascot-guide.md)
- [docs/QA.md](docs/QA.md)

## Run it locally

```bash
python -m http.server 8000
# open http://localhost:8000
```

## License

MIT — see [LICENSE](LICENSE). All code, art, characters and music are original work.

A cozy tribute to small adventures. Not affiliated with or endorsed by any studio or publisher.
