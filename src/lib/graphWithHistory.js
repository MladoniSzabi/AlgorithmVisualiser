import Graph from "graphology";

// Changes mutating methods so that they store 
export default class GraphWithHistory extends Graph {

    changeImplementation(functionName, addHistory) {
        this[functionName] = (...args) => {
            super[functionName](...args)
            addHistory(Graph.from(this))
        }
    }

    constructor(...args) {
        super(...args)
        Object.defineProperty(this, "implementation", {
            enumerable: true,
            configurable: true,
            get: () => "graphWithHistory"
        })
    }

    overwriteMethods(addHistory) {

        let functions = [
            "addNode", "mergeNode", "updateNode", "addEdge", "addEdgeWithKey", "mergeEdge", "mergeEdgeWithKey", "updateEdge", "updateEdgeWithKey", "dropNode",
            "dropEdge", "clear", "clearEdges", "updateAttribute", "removeAttribute", "replaceAttributes", "mergeAttributes", "updateAttributes", "setNodeAttribute",
            "updateNodeAttribute", "removeNodeAttribute", "replaceNodeAttributes", "mergeNodeAttributes", "updateNodeAttributes", "updateEachNodeAttributes",
            "setEdgeAttribute", "updateEdgeAttribute", "removeEdgeAttribute", "replaceEdgeAttributes", "mergeEdgeAttributes", "updateEdgeAttributes",
            "updateEachEdgeAttributes", "import"
        ]

        functions.forEach(element => {
            this.changeImplementation(element, addHistory)
        });
    }

    static from(data, options) {

        const instance = new GraphWithHistory(options);
        instance.import(data);

        return instance;
    }

}