import { useEffect } from "react";
import { SigmaContainer, useLoadGraph } from "@react-sigma/core";
import { Graph } from "graphology"

import "@react-sigma/core/lib/react-sigma.min.css";

function GraphComponent() {

    function LoadGraph () {
        const loadGraph = useLoadGraph();
      
        useEffect(() => {
            const graph = new Graph();
            graph.addNode("n1", { x: 0, y: 0, size: 10, color: "#aaa" });
            graph.addNode("n2", { x: -5, y: 5, size: 10, color: "#bbb" });
            graph.addNode("n3", { x: 5, y: 5, size: 10, color: "#ccc" });
            graph.addNode("n4", { x: 0, y: 10, size: 10, color: "#ddd" });
            graph.addEdge("n1", "n2");
            graph.addEdge("n2", "n4");
            graph.addEdge("n4", "n3");
            graph.addEdge("n3", "n1");
            loadGraph(graph);
        }, [loadGraph]);
      
        return null;
      };

    const graph = new Graph();

    return (
        <SigmaContainer graph={graph} settings={{ drawEdges: true, clone: false }}>
            <LoadGraph />
        </SigmaContainer>
    )
}

export default GraphComponent