---
title: Brain
summary: My second brain, an Obsidian vault I own so my context isn't locked inside any AI company, set up so agents can work in it without flattening my words.
tags: [Knowledge management, AI agents, Obsidian]
date: 2026-10-26
---

Brain is my second brain, an Obsidian vault in plain Markdown. It isn't a catch-all note dump. It's a vault with specific jobs:

- **Identity anchor:** it keeps and develops *how I think*, so Claude responds the way I would.
- **Thinking partner:** it helps with what's happening right now: decisions, confusion, spotting patterns.
- **Content output:** it holds the deep context and craft specs behind what I write for Xiaohongshu, WeChat articles and copy.

Claude Code works in it with me, and [Custos](/projects/custos/) and my [Solo Business × AI Agent](https://alfinalee.github.io/solo-business-agent-system/) system read from it. This page covers how the vault is set up for that. None of its contents are shown here.

## Problem

At some point I realized that the most detailed picture of who I am, how I think and what I'm working on lived on AI companies' servers: in chat histories and in each assistant's memory. I had no copy of my own. Every month of use made switching harder, so I was becoming more dependent on whichever company held that context.

I want the opposite. Whatever AI I use in the future, from whichever company, the core material should stay in my hands. Switching should be as simple as handing the new model my files, not starting over.

Keeping the material myself creates a second problem. Once an agent can read and write those files, a few things go wrong quickly:

- it reads everything on every request, including notes that have nothing to do with the question or are too private for the task,
- it "tidies up" by summarizing, merging or rewording notes, and your own voice slowly turns into the model's,
- it moves or deletes notes on its own and you only find out afterwards,
- it says a note doesn't exist after looking in one folder.

## Design

**Owned and portable.** Everything is plain Markdown in a folder on my own disk. Any model can read it, and no app or account is required to open it. The agent instructions are plain text files too, so a different AI can follow the same rules. The vault is the source of truth, and an AI's memory is at most a cache of it.

**Rules live next to the notes.** The vault root has a `CLAUDE.md` with a routing table: what kind of request goes to which folder. Most folders have their own `CLAUDE.md` with that folder's rules, and an agent has to read it before entering the folder. Rules sit where they apply instead of in one prompt that grows forever.

**Read access is tiered.** Some folders are core memory that an agent may recall on its own. Sensitive ones are off by default and only opened when I ask explicitly. Anything written for the public leaves those folders out of the source material entirely.

**My words stay verbatim.** When notes are reorganized, text is moved word for word. The agent doesn't write summaries in my voice.

**Plan before changing anything.** Before splitting, moving or deleting notes, the agent shows a mapping of what goes where and what gets dropped, and waits for my OK. Before saying something doesn't exist, it searches the whole vault.

**Soft status, not more folders.** Notes in the personal section carry a status: *integrated* (already absorbed, kept lightly) or *still open* (worth coming back to, also linked from one index note). The test for keeping something isn't "is this worth analyzing?" but "will I want to remember this years from now?". Status never changes where a note lives.

**Consistent naming.** File names are English kebab-case with a `YYYY-MM-DD-` prefix, so they sort and link reliably. The note itself stays in whatever language I wrote it in.

**Separate from agent memory.** Custos keeps its own diary and state files. Brain is never synced into them automatically, and Custos only reads it. That keeps a clear line between what I wrote and what an agent wrote about me.

## Result

The top level of the vault. `[rules]` marks a folder with its own `CLAUDE.md`.

```
Brain/
├── CLAUDE.md      routing table and default rules
├── inbox/         timestamped raw thoughts, sorted later   [rules]
├── daily/         work logs with Claude                    [rules]
├── self/          personal; sensitive parts off by default [rules]
├── principles/    values and decision rules                [rules]
├── context/       background and history                   [rules]
├── ideas/         intellectual explorations
├── reading/                                                [rules]
├── clippings/                                              [rules]
├── work/                                                   [rules]
├── business/                                               [rules]
├── tech/          AI, automation, personal systems
└── assets/        images
```

A vault that three agents work with (Claude Code, Custos and my Solo Business system) without rewriting it. I write in it when something in my life moves forward or is worth keeping. Raw thoughts land in an inbox with timestamps and are sorted into folders later, together with an agent, under the rules above.

## What I learned

- An agent's instructions work best when they sit right where it's working. A per-folder `CLAUDE.md` gets followed. A long global rule list tends to get skimmed.
- Privacy isn't one switch. It works better as tiers of "may recall on its own", "only when asked" and "never in public output".
- The closest call wasn't a wrong answer. It was an agent starting to split my notes on its own, until I stopped it. "Show me the plan first" became a hard rule that day.
