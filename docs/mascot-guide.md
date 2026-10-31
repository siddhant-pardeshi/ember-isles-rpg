# Momo — the mascot guide

Momo is the isle's guide sprite: the deck's shared layered-SVG character — chibi kid in the pale-blue fox hoodie with the gold star charm — rebuilt from the studio's reference sheet as vector layers with a real animation state machine. Ears, eyes, mouth, arms, tail and head all move independently.

## Character invariants

- Pale-blue fox hoodie, cream lining and belly, gold four-point star charm, navy shorts, blue boots, cream-tipped tail.
- Wide-set angled fox ears, big brown eyes, soft blush.
- The reference sheet wins over any written description.

## States used in this game

| Trigger | Performance | Line |
| --- | --- | --- |
| First visit | Entrance + wave | "Momo! You found the isle." |
| Return visit | Wave | "The lanterns kept spinning while you were gone." |
| Quest accepted | Cheer | "A task! Say yes, say yes." |
| Item picked up | Cheer | "Pocket that safely. Probably." |
| Quest complete | Cheer | "The isle feels warmer already." |
| Idle near objective | Think + hint | "The braziers want an order…" |
| The isle lights up | Cheer | "Momo is doing a proud spin." |
| Pause | Sleep (z's) | — |

Lines rotate without back-to-back repeats; cooldowns gate rapid events. Bubbles dismiss on tap.

## Where Momo lives

Bottom-right dock on desktop, bottom-left on touch, scaled down on small screens — never over the dialogue panel or the joystick. Settings → **Show Momo** hides them; reduced motion keeps only slow blinks.

## Replacing the art

The character is one SVG string + one stylesheet in `js/mascot.js`. Keep the element ids (`m-armR`, `m-earL`, `m-eyeL`, `m-mouth`, `m-tail`, `m-charm`…), keep the layer order, swap colors in the palette object, and preview every state via `?mascot=gallery` on any game URL.
