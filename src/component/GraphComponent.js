import { useEffect } from "react";
import { SigmaContainer, useLoadGraph, useRegisterEvents, useSigma } from "@react-sigma/core";

import "@react-sigma/core/lib/react-sigma.min.css";

function loadGraphEffect(graph, loadGraph) {
    loadGraph(graph)
}

class EventRegistration {
    constructor(sigma, registerEvents) {
        this.sigma = sigma
        this.newNodeIndex = sigma.getGraph().order

        registerEvents({
            mousedown: this.mousedown.bind(this)
        })
    }

    mousedown() {
        if (!this.sigma.getCustomBBox()) this.sigma.setCustomBBox(this.sigma.getBBox());
    }
}

function GraphComponent({ graph }) {

    function InitGraph () {
        const loadGraph = useLoadGraph();
        const registerEvents = useRegisterEvents();
        const sigma = useSigma()
      
        useEffect(() => {loadGraphEffect(graph, loadGraph)}, [loadGraph]);
        useEffect(() => {new EventRegistration(sigma, registerEvents)}, [registerEvents, sigma]);
      
        return null;
      };

    return (
        <SigmaContainer settings={{ drawEdges: true, clone: false }}>
            <InitGraph />
        </SigmaContainer>
    )
}

export default GraphComponent