import "dotenv/config";
import { Config } from "../interfaces/config"
import { TOKEN } from "../../config.json"

let config: Config;

try {
    config = require("../../config.json");
}
catch (error) {
    config = {
        TOKEN: process.env.TOKEN || TOKEN,
        PREFIX: process.env.PREFIX || "!",
        MAX_PLAYLIST_SIZE: parseInt(process.env.MAX_PLAYLIST_SIZE!) || 10,
        PRUNING: process.env.PRUNING === "true" ? true : false,
        STAY_TIME: parseInt(process.env.STAY_TIME!) || 30,
        DEFAULT_VOLUME: parseInt(process.env.DEFAULT_VOLUME!) || 100,
        LOCALE: process.env.LOCALE || "en"
    };
}

export { config };