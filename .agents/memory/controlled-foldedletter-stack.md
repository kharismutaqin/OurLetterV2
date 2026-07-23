---
name: Controlled FoldedLetter in stacks
description: How to let a parent stack control open/close while keeping the FoldedLetter 3-D animation self-contained.
---

When a `FoldedLetter` is used inside a gesture-driven stack (e.g., a swipeable deck), make it controlled via `isOpen` and `onOpenChange` and disable its own pointer handler with `interactive={false}`.

**Why:** The stack must own all gestures (tap, swipe) so it can decide whether to toggle the front letter, cycle the stack, or ignore. If the letter also toggles itself, gestures and state conflict.

**How to apply:** Keep `FoldedLetter` self-contained for standalone use, but add optional controlled props. In a stack, pass the front letter's open state from the stack and render all letters with `interactive={false}`.
