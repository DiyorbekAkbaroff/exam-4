import fs from "fs/promises";
import path from "path";
export const model = (req, res, next) => {
    req.readFile = async (filename) => {
        let data = await fs.readFile(path.join(process.cwd(), "db", filename + ".json"), "utf-8");
        return JSON.parse(data);
    };  
    req.writeFile = async (filename, data) => {
        await fs.writeFile(path.join(process.cwd(), "db", filename + ".json"), JSON.stringify(data, null, 4))
        return true
    };
    return next()
}