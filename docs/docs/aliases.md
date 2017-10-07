---
layout: docs
title: Using Aliases
description: Introduction to using aliases
---

Aliases make it easier to generate multiple files using one command. We can only create aliases through a config file.

To create an alias, open `gnerate.config.js`, and add an `alias` key.

*Example:*

```
modules.export = {
    templatePath: path.resolve(__dirname, "./__templates__"),
    alias: {
        componentAndReducer: {
            component: {
                filename: "component.js"
            },
            reducer: {
                filename: "reducer.js"
            }
        }
    }
};
```

Let's break down the structure of the alias.

### Alias Structure

##### Alias Name

Aliases come in two parts. The first is what we will call the alias. This alias name will be the first set of keys in the alias object.

*Example:*
```
alias: {
    aliasName1: {},
    aliasName2: {}
}
```

The alias name is what we will tell Gnerate to use when creating files. Say we want to use **aliasName2**. Our command would look like: `gnerate aliasName2 ./dest`. (*NOTE:* Notice that we don't provide a filename as the second argument. Aliases require that only a directory is provided.)

##### Template Names

The second part of the alias object tells Gnerate what templates to use. From our first example, **componentAndReducer** will generate two files using two templates. These templates are **component** and **reducer**.

*Example:*
```
alias: {
        componentAndReducer: {
            // the template component found in the __templates__ directory
            component: { 
                filename: "component.js"
            },
            // the template reducer found in the __templates__ directory
            reducer: {
                filename: "reducer.js"
            }
        }
    }
```

Since aliases generate more than one file, we need a way to specify what we will name these files. this is done through using **filename**, which requires a name and an extension.

### Using Aliases in the Terminal

Aliases are simple to use, but differ from the regular Gnerate command. As mentioned, when using an alias we have to provide a directory to write to instead of a file.
`gnerate [aliasName] [directory]`

All regular command line arguments are valid with aliases.
