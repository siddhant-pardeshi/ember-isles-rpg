# QA notes — Ember Isles

## What was tested

**Environment:** Windows 10 desktop, Chromium (in-app), 1280×720; local server via `python -m http.server`.

- Menu with live drifting village scene; Concept Codex lists the AI-assistant bank.
- Boot → Play → world render: village cottages (roof/wall/door/window pass), tall-grass sway, water shimmer, fireflies, cave with wandering slimes, slate objects.
- Movement and collision: spawn fix verified (original spawn sat inside a solid cottage tile and froze the player — moved to the road), house/well/tree solids hold, water blocks.
- Interaction primitives: proximity prompt, dialogue open/advance/close (a stuck-dialogue bug was found and fixed — the interact check returned before the dialogue branch), quest acceptance flow, brazier "wrong order" logic path, region name chip.
- Placement bugs found and fixed by playtesting: Maren originally stood inside her own cottage (unreachable), Tama inside a tree, the well brazier on top of the well — all repositioned to reachable spots.
- A logic bug was found by review and fixed: the Ember Heart required a quest state that was never set (unpickable). Condition now matches the quest flow.
- Save/resume: versioned localStorage save written on every dialogue/pickup; reset path via Settings.
- Note: during the review session the shared test browser was heavily throttled by concurrent automation (rAF ~700ms), so the full three-quest walkthrough was verified by code-path review plus targeted interaction probes rather than one continuous playthrough.

## What was NOT tested (honest gaps)

- Physical mobile devices; touch controls verified in emulated frames only (joystick + ACT button bound via the kit).
- Audio judged by engine paths and lint (song data validated); no human listened in this pass.
- The win-state scene (full island light-up) verified by code review only.
- Firefox/Safari untested.

## Known limitations

- Slimes are a gentle bounce hazard by design; there is no combat or death anywhere on the isle.
- The cave's lantern mask is a radial gradient approximation, not true light occlusion.
