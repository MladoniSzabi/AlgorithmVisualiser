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
            clickStage: this.clickStage.bind(this),
            mousedown: this.mousedown.bind(this)
        })
    }

    clickStage(event) {
        const pos = this.sigma.viewportToGraph(event.event);
        console.log(pos)
        this.sigma.getGraph().addNode(this.newNodeIndex++, {x: pos.x, y: pos.y, color: "#000"})
        event.event.preventSigmaDefault();
        event.event.original.preventDefault();
        event.event.original.stopPropagation();
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