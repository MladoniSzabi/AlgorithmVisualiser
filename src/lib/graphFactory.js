import { Graph } from "graphology"

const graphs = {
    "Travelling Salesman": "graphs/travellingSalesman.json"
}

export default async function graphFactory(graphName) {

    console.log(graphName)
    // It is a prebuild graph
    if (graphName in graphs) {
        const graph = new Graph()
        const graphContent = await (await fetch(graphs[graphName])).json()
        graph.import(graphContent)
        return [graph, graphContent.code]
    }

    // It is a custom built graph
    throw Error("Cannot load custom graphs yet")
}