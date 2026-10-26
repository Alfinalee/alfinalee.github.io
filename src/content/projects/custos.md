---
title: Custos
summary: A personal companion agent I run every day, built on an open-source chat bridge and hardened so it stays honest about what it actually did.
tags: [AI agents, Node.js, Reliability, Telegram]
date: 2026-10-24
---

Custos is an AI companion that lives in my Telegram. It keeps a diary, a timeline and reminders for me as plain files on my own machine, checks in during the day, and can reply by text, voice or sticker. It started as a fork of [CyberBoss](https://github.com/WenXiaoWendy/cyberboss), an open-source (AGPL) bridge between WeChat and coding agents like Codex and Claude Code. Since June 2026 I've been extending and running it.

## Problem

A companion agent is only useful if you can trust it over months, not minutes. Left unconstrained, an LLM agent in a chat will:

- say "saved" or "I'll remind you" when no tool call actually succeeded,
- fail silently: the model errors out, the bridge reports healthy, and the user just gets nothing,
- lose the thread whenever a session is refreshed, and start again as a stranger,
- make confident, permanent-sounding judgments about who the user is.

The first two break trust in everything else it says. The last two make it worse to live with the longer you use it.

## Design

**Plain files are the source of truth.** Diary, timeline, reminders and notes live as local files under one directory. Models, runtimes and chat channels are all replaceable; the memory isn't, so it never sits inside any of them.

**Memory in layers, each with its own update rhythm.** Instead of one growing memory dump, Custos keeps a few small files with different jobs:

- a **diary** for things worth knowing a few days later,
- **`now.md`** for what changes week to week (current focus, ongoing threads, things to avoid right now). It's edited the moment a lasting change comes up and fully rewritten every Sunday against that week's diary.
- **`taste.md`** for likes and dislikes by category, recorded with *what specifically* landed or didn't, so later suggestions can be specific.

A new thread starts with the tail of the previous conversation, `now.md`, `taste.md` and the last three days of diary. It doesn't get the whole history.

**My notes stay mine.** Custos can search my Obsidian vault ([Brain](/projects/brain/)), but only read-only and only on demand. It checks its own diary first, searches the vault only if the answer isn't there, and reads just the notes that match. It follows each folder's own rules file, skips sensitive folders unless I ask, and says when something came from my notes instead of pretending to remember it. If it thinks something belongs in the vault, it tells me rather than writing it there.

**Claims need evidence.** The runtime instructions forbid claiming to have remembered, saved, scheduled or sent anything without a successful tool result, and require a short honest explanation when a tool fails. Interpretations are kept separate from events, and the agent doesn't make final judgments about the user's identity.

**Failures are visible, in the right voice.** Runtime errors are mapped to explicit failure events and recorded in bridge health, instead of turning into empty replies. They're also kept out of the companion's own voice: an infrastructure error should look like an error, not like Custos speaking.

**Channel and runtime are adapters.** The core orchestrates; channel adapters (WeChat, Telegram) and runtime adapters (Codex, Claude Code) are swappable. That made it possible to move channels without touching memory or persona.

## Result

<!-- TODO: 2–3 redacted screenshots (no conversation content, no personal info) -->

Custos runs daily as a background service on my Mac. Things I built on top of the fork:

- **Telegram migration.** A dry-run-by-default migration script that moves the session binding and pending queues from WeChat to Telegram, backs up files before changing them, refuses conflicting bindings, and can be reversed. Telegram pairing uses a one-time code and only accepts one private chat.
- **Voice and stickers.** Voice messages through a locally cloned voice model, a standing voice mode, and stickers from Telegram sticker packs.
- **Continuity.** The last conversation, `now.md`, `taste.md` and recent diaries carry into each new thread. After each soft refresh, a separate pass reads the thread that just ended, finds what I said that neither the diary nor `now.md` recorded, and writes it in. Edits to `now.md` must quote an exact existing line, so it can't rewrite the file freely.
- **Reliability.** Retry or restart when the runtime goes silent, replace the runtime client when credentials expire or instructions change mid-thread, and never discard a reply without a trace.
- **Incident review.** After a silent outage in September 2026 (the health check said OK while every model request was rejected), I led the investigation and fix with a coding agent: a postmortem, a runtime health check, and regression tests.

## What I learned

- "Healthy" has to mean the thing the user cares about. A server answering `/readyz` didn't prove that the model could answer.
- With agents, the most dangerous bug is a confident report of an action that never happened. Making the agent prove it with a tool result fixed more than any prompt wording did.
- Building on someone else's open-source project is a real skill: read their architecture first, keep the seams they designed, and credit them clearly.

## Where it's going

I keep a separate design document for what Custos should become. It covers memory stored as a revision history of interpretations rather than conclusions, forgiven matters sealed instead of deleted, and a monthly check on whether the project is thickening or thinning my real-world relationships. None of that is built yet, so it isn't listed above.
