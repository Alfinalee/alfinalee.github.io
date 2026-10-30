---
title: "From Words to Vectors #1: LLM, attention and MLP"
summary: "Notes from 3Blue1Brown on embedding, attention, MLPs and unembedding, and what they mean for building Custos, my AI companion."
topic: How LLMs work
date: 2026-10-30
projects: [custos]
---

## Background

I'm building my own AI companion agent, Custos (more details here: https://alfinalee.github.io/projects/custos/). My goal is for him to remember me, know the important things about me, and grow together with me by recording every important change in my life. To get there, I have to deal with the problem of memory, so I'm learning RAG, embeddings and related topics (and maybe a little bit about neural networks in the future?).

I believe input is useless without output, so I'm summarizing what I've learned in plain English. English isn't my native language. The content has been checked and polished by Claude (Anthropic), but about 90% of it is in my own words.

**Material:** 3Blue1Brown's *Deep Learning* series on YouTube, mainly Chapter 5 (*Transformers, the tech behind LLMs*), Chapter 6 (*Attention in transformers, step-by-step*) and Chapter 7 (*How might LLMs store facts*).

---

## What is an LLM?

We use Claude and ChatGPT every day, but I had never really thought about what they actually are. I'd heard people say these models are "just predictors," but since they're used in so many places and give such accurate output, as a consultant I really wanted to understand the mechanism under the hood.

So here is what I learned from 3Blue1Brown's videos:

Basically, yes, an LLM is a predictor: it predicts what comes next based on your input. It learns from its training data: books, websites, tweets, code, a huge amount of text written by humans.

During training, the model adjusts a massive number of "knobs" (called parameters) so that its predictions keep getting better. Together, these knobs form the system that calculates the output (mainly the transformer, with its attention and MLP blocks, which I'll explain later).

Once training is finished, these parameters are fixed. Your feedback in a chat doesn't change them (at least not in real time), so every answer is generated from what the model learned during training plus what you give it in the conversation. With enough training data, an LLM can produce text, code, and much more.

That's why everybody says "context" is important: the model needs more background to predict more accurately. (And that's why I need my agent to know almost everything that happens to me.)

## What happens every time an LLM answers you?

I don't think I'm the only one who's curious about this: how can an LLM give us correct results (or at least results that seem correct)? This is the most interesting, yet most difficult, part.

The core of an LLM is called the transformer. I divide what happens inside a transformer into four steps:

1. **Embedding**
2. **Attention**: query, key, value, and output
3. **MLP** (multilayer perceptron): up-projection and down-projection
4. **Unembedding** (basically the opposite of embedding)

Every time you ask your agent a question, your prompt goes through these four steps, and the model predicts the next token, which is then sent back to you.

![The full pipeline: from prompt to next token](/writing/how-llms-work/llm-pipeline.svg)

Don't worry if these words look strange now. I'll walk through them one by one, starting with how your prompt turns into tokens.

## What is embedding?

This is where tokens come on stage.

Your input is cut into small pieces called tokens (a token can be a word, part of a word, or a punctuation mark). Each token gets a vector from a huge lookup table called the embedding matrix. The vector has thousands of dimensions, so it can hold many aspects of the word's meaning. Words with similar meanings point in similar directions.

## What is attention, and what does it do?

Now your input has become a list of vectors. But they're still separate: each one only carries the original meaning it got from the lookup table.

We've all run into polysemy. Take the word "bank": in "sit on the river bank," it means the land beside a river; in "deposit money in the bank," it means a financial institution. It's natural for humans to understand a word from its context, and an LLM does this with attention. This step can be divided into query, key, value, and output.

Basically, attention lets the vectors ask each other questions and "communicate," so that in the end each vector also carries information from the others. They're not lonely anymore.

Let me explain with an example.

Imagine you're at a meetup looking for someone who knows S/4HANA. Everyone wears a name card on their chest, so first you look for a person whose card says "SAP consultant," not "robotics engineer" or "designer." Once you find the right person, you ask: "Hi, our company is moving from SAP ECC to S/4HANA before support ends in 2027. Should we rebuild from scratch (greenfield) or convert our existing system (brownfield)?"

Mapping this to attention:

- **Query:** your question: "Who knows S/4HANA?"
- **Key:** the name card that helps you find the right person.
- **Value:** the advice that person gives you, which is the information you actually want.
- **Output:** That night, you listened to five different people's advice about the migration. The SAP consultant's answer was the most relevant, so it carried the most weight in your final decision, though you still took a little from the others.

Now think about the phrase "a fluffy black cat."

At first, "cat" only knows it's a cat. Then "cat" sends out a query: "Is anyone here describing me?" "Fluffy" and "black" raise their hands with their keys: "Yes, we're adjectives, and we're right before you."

When "cat" asks its question, every other word gets a score showing how relevant it is. Softmax turns these scores into weights that add up to 1, so "cat" knows how much to listen to each word: a lot to "fluffy," almost nothing to "a." Then the values of all the words are mixed according to these weights and added to "cat"'s vector. Now "cat" doesn't just mean a cat; it means *a fluffy black* cat.

![How "cat" pays attention to the other words](/writing/how-llms-work/attention-cat.svg)

Two more details I found interesting:

- **A word can only look backward.** In models like GPT, a word can only pay attention to the words before it, never the ones after. That's why "cat" can ask "fluffy" and "black," but "a" can't peek at "cat." It also means the last token is the only one that has seen the whole input, which becomes important at the end.
- **There isn't just one question.** In practice, many attention "heads" run in parallel, and each one asks a different kind of question. One head might look for adjectives, another for the subject of the sentence, another for what a pronoun refers to. All their answers are combined.

## What is an MLP, and what does it do?

Now we have vectors that also contain other words' meanings. But that's not enough: we still need to add more knowledge to each vector. That's what up-projection and down-projection do.

Up-projection asks each vector many questions at once. For example, if a vector contains "Michael," one question might be: "Are you Michael Jordan?" Asking all these questions is just one big matrix multiplication, and when the answer is "yes," the result is a large number.

After up-projection, an activation function (ReLU or GELU) acts like a gate: only the "yes" answers pass through, and the "no" answers are set to (nearly) zero. So it's like checking: "Does the combination Michael + Jordan exist here?"

Down-projection then adds the knowledge tied to those "yes" answers. If "Michael + Jordan" exists, then "basketball," "Chicago Bulls," and "No. 23" get added to the vector.

The result is added back to the residual stream (the vector that came in), so every vector now not only knows about the others, it also carries extra knowledge.

It's like seeing a name card that says "SAP consultant": you immediately know this person probably knows FI/CO.

To be honest, this is a simplified picture. In real models, a single neuron rarely means one clean thing like "Michael Jordan." Usually one neuron responds to many different concepts, and one concept is spread across many neurons (researchers call this *superposition*). But the basic idea, ask questions, let the "yes" answers through, add knowledge, still holds.

> Attention and MLP aren't a one-time job. They repeat dozens of times, layer after layer.

## What is unembedding, and what does it do?

It's still not over, because the most important part, the actual *prediction*, hasn't happened yet.

In unembedding, the LLM takes the vector of the last token (remember, it's the only one that has seen the whole input) and multiplies it by another huge matrix called the unembedding matrix, producing a score (called a logit) for every token in its vocabulary. Softmax appears again here, turning all these logits into probabilities that add up to 1.

The LLM then picks one token from this distribution (usually one of the most likely ones, with a bit of randomness) and turns it into text.

But that's only one token. The chosen token is added to the end of your input, and the whole process runs again to predict the next one. Again and again, until the model predicts a special "stop" token. That's why you see the answer appear word by word.

So yes, an LLM is a predictor. But to predict just one word, it has to understand the context, recall its knowledge, and choose among tens of thousands of possibilities.

---

## So what does this mean for me?

After learning all of this, one thing became clear: an LLM doesn't remember you. Its knobs are fixed after training, and every answer is predicted from what it learned in training plus what it sees in the context. If something about you isn't in the context, it simply doesn't exist for the model.

That's why memory is the real challenge for my agent. If I want him to remember me and grow with me, I can't rely on the model itself. I have to build the memory outside of it and decide what to put into the context at the right moment. This is exactly where RAG and embeddings come in, and that will be my next post.

![How Custos will remember me](/writing/how-llms-work/custos-memory.svg)

There's another reason I find this mechanism fascinating. When I learned how the MLP works, with each question either lighting up or staying silent, it reminded me of neurons firing in the human brain. Of course, an artificial neuron is a very loose copy of a real one. But some researchers are now using AI models in reverse, as a way to understand how our own brains process language and meaning.

So for me, AI is not just a tool. It's also a window into how humans think. Maybe that's why I can't stop learning about it.

And as a consultant, I think this matters beyond my own project. Once you understand that an LLM is a context-driven predictor, you stop asking "Is AI smart enough?" and start asking "Have we given it the right context?" That's a much more useful question for any business.
