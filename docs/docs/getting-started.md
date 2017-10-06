---
layout: docs
title: Getting Started
description: Getting started using Gnerate
---

Gnerate is a cli generation tool to help reduce boilerplate. This is achieved by creating templates, and then referencing those templates during file generation.

<br />

## Installation

**NPM:** `npm install -g gnerate`

**Yarn:** `yarn global add gnerate`

<br />

## Initialization

There are two ways to use Gnerate. The first, creating a **gnerate.config.js** file in the root of our project. This is great for source controlling gnerate. Second, use the terminal to supply arguments to Gnerate. Our philosophy is that anything that can be done in a config file, can also be done using only the terminal. To start out, we'll use the first method, using a config file.

Let's initialize Gnerate in our project.

In the root directory, run: `gnerate --init`

The `--init` argument creates a new **__templates__** directory in the location the command is ran from. It will also create a **gnerate.config.js** file that links Gnerate to the **__templates** directory.