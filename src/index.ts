#!/usr/bin/env node
"use strict";

import Rgen from "./Classes/rgen";

const app = new Rgen(process.argv.slice(2));
app.run();
