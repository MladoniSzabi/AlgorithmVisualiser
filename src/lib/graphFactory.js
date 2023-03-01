import { Graph } from "graphology"

let graphs = null

export async function graphFactory(graphName) {

    if (!graphs) {
        await getGraphList()
    }

    let saved = localStorage.getItem(graphName)
    if (saved) {
        saved = JSON.parse(saved)
        const graph = new Graph()
        graph.import(saved.graph)
        return [graph, saved.code]
    }

    // It is a prebuilt graph
    if (graphName in graphs) {
        const graph = new Graph()
        const graphContent = await (await fetch(graphs[graphName])).json()
        graph.import(graphContent)
        return [graph, graphContent.code]
    }

    // It is a custom built graph
    throw Error("Cannot load custom graphs yet")
}

export async function getGraphList() {
    if (graphs) {
        return graphs
    }

    let response = await fetch("/graphs.json")
    graphs = await response.json()

    return graphs
}