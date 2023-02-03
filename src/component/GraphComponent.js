import { useEffect } from "react";
import { SigmaContainer, useLoadGraph } from "@react-sigma/core";
import { Graph } from "graphology"

import "@react-sigma/core/lib/react-sigma.min.css";

function loadGraphEffect(graph, loadGraph) {
    loadGraph(graph)
}

function GraphComponent({ graph }) {

    function LoadGraph () {
        const loadGraph = useLoadGraph();
      
        useEffect(() => {loadGraphEffect(graph, loadGraph)}, [loadGraph]);
      
        return null;
      };

    return (
        <SigmaContainer settings={{ drawEdges: true, clone: false }}>
            <LoadGraph />
        </SigmaContainer>
    )
}

export default GraphComponent