import { createApp } from "./index.mjs";

import { MovieModel } from "./models/mysql/movies.js";

createApp({ movieModel: MovieModel });
