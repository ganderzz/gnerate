<h1 align="center">
    gnerate
</h1>

### Getting Started

Gnerate is a cli generation tool to help reduce boilerplate. This is achieved by creating templates, and then referencing those templates whenever we want to create a new file.

### Installing Gnerate

**NPM:** `npm install gnerate --save`

**Yarn:** `yarn add gnerate`


### Commands

`gnerate --init` - Generates a config file in the current working directory.

`gnerate [template] [path/name] --config=[path/to/config.js]` - Generates a template to a path/name location.


example: `gnerate container ./MainPage.js`