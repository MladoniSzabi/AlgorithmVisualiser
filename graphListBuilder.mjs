import * as fs from 'node:fs';

let graphs = fs.readdirSync("public/graphs")
let fileContent = {}
for (let graph of graphs) {
    let content = JSON.parse(fs.readFileSync("public/graphs/" + graph))
    fileContent[content.name] = "graphs/" + graph
}

fs.writeFileSync("public/graphs.json", JSON.stringify(fileContent))