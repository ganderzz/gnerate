---
layout: docs
title: Creating Templates
description: Creating reference templates to reduce boilerplate
---

Templates are files that will be referenced when creating files using Gnerate.

<br />

## Templates Directory

Gnerate will look for a templates directory in a order of highest -> lowest priority. This is the directory that will be searched for template files.

- If a `--templatePath=` is provided through the cli, Gnerate will look there first
- Next, Gnerate will use the templatePath provided in **gnerate.config.js**
- Lastly, if the two above methods aren't provided, Gnerate will look for a root directory called **__templates__**

<br />

## Creating a Template

We use [Nunjucks](https://mozilla.github.io/nunjucks/) as our templating engine, so any template being consumed by Gnerate has the full potential of what Nunjucks has to offer!

In our templatePath, generally **__templates__**, create a new file called `component.njs` (`.njs` is the common extension for Nunjucks, but any extension would work). Populating the file with any Nunjucks valid template would work. In this case, let's say we want a ReactJS boilerplate component. We could define our template like:

```
export default class {{ "{{ filename " }}}} extends React.Component {
    render() {
        return (
            <div>
                Gnerate!
            </div>
        );
    }
}
```

Some variables get provided automatically by Gnerate, like `filename`. We can provide our own variables to templates through params; this will be covered later.
