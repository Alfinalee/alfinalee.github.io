---
title: "Notes on agent memory: teach the why, layer the memory"
summary: "My takeaways from Anthropic's article on agent memory: why agents need the why, the four layers of memory, and why memory can still be wrong."
topic: Agent design
date: 2026-11-08
projects: [custos]
---

These are my notes on Anthropic's [The components of agent memory](https://www.anthropic.com/research/components-of-agent-memory).

Here's my take:

Agents are like humans: as they become more capable and smarter, you should teach them why, not just how (e.g. "don't do this, do that"), along with the background, the goal, and why the task matters. The same logic applies to training an employee. I'm the kind of person who, without a clear understanding of a task, will act on my own hypothesis (which is often wrong).

It's important to design different layers for an agent's memory system. I'm not sure it has to be exactly four, but basically what Anthropic does is build a system with four parts:

- **Injected context:** the first and most important part. It's read at the start of every session, so it should be short.
- **Memory representations:** my understanding is that they're more organized, condensed, and abstract than memory notes.
- **Memory notes:** salient observations Claude has written down.
- **Transcripts:** the original conversation of every session.

I think memory matters so much because it carries across sessions, so Claude won't forget important things. But just as humans can misunderstand and misremember, Claude's memory can be outdated or wrong too. That's where dreaming is most powerful. Dreaming is when an agent goes back over its logs to fix mistakes and produce new notes and representations, for example by testing a note against the original transcript. Even so, we still can't say Claude's memory is 100% correct.
