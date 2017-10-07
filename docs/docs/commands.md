---
layout: docs
title: Commands
description: Using Gnerate through the terminal
---

### Format

Gnerate expects terminal arguments to be in the following format:

`gnerate [template] [generationLocation]`

The template name always comes first, followed by the location in which we will generate the template.

**Note:** Template name can be a substring of a template name. Gnerate will look for templates containing the provided name. If more than one exist, Gnerate will fail out asking for a more specific name.

### Arguments

Everything that can be done through a config file, can also be provided through command line arguments.

`--init`: Creates the scaffolding for Gnerate. This includes a **gnerate.config.js** file, and a **__templates__** directory. Both the config file, and directory will be placed in the location the command is ran from.

`--config=[configPath]`: Provide the path to a gnerate config file

`--templatePath=[templatesDirectory]`: A path to a templates directory

`--[paramKey]=[paramValue]`: These are key value pair variables that will be used in templates. **paramKey** will be the variable name to use in a template, where **paramValue** will be the value it renders to.

*Example:*

A template [elem.njs]:
```
Hello, {{ "{{ hello " }}}}!
```

If we run the command `gnerate elem ./elem.txt --hello=world`, we would see in *elem.txt*:
```
Hello, world!
```
