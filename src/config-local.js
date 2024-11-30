import { createApp } from "./index.mjs";

import { MovieModel } from "./models/local/file-movies.js";

createApp({ movieModel: MovieModel });
