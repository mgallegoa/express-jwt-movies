import { createApp } from "./index.mjs";

import { MovieModel } from "./models/mongo/movies.js";

createApp({ movieModel: MovieModel });
