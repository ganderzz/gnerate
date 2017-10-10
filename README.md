<h1 align="center">
    gnerate
</h1>

[![CircleCI](https://circleci.com/gh/ganderzz/gnerate/tree/master.svg?style=svg)](https://circleci.com/gh/ganderzz/gnerate/tree/master)

### Getting Started

Gnerate is a cli generation tool to help reduce boilerplate. This is achieved by creating templates, and then referencing those templates whenever we want to create a new file.

### Installing Gnerate

**NPM:** `npm install gnerate --save`

**Yarn:** `yarn add gnerate`


### Commands

`gnerate --init` - Generates a config file in the current working directory

`gnerate --help` - Show 'how-to-use' documentation

`gnerate --version` - Show the currently installed version

`gnerate [template] [path/name] --config=[path/to/config.js]` - Generates a template to a path/name location. The config argument is optional. If no config is given, generate will look for a directory named `__templates__` in the root of the project.


example: `gnerate container ./MainPage.js`

---

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/QKTF1y1CFGC8JTAHGqMSLezW/ganderzz/gnerate'>  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/QKTF1y1CFGC8JTAHGqMSLezW/ganderzz/gnerate.svg' /></a>