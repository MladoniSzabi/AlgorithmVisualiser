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
        this.selectedNode = null

        registerEvents({
            clickNode: this.clickNode.bind(this),
            mousedown: this.mousedown.bind(this)
        })

    }

    clickNode(event) {
        if (this.selectedNode) {
            let size = this.sigma.getGraph().getNodeAttribute(this.selectedNode, "size")
            this.sigma.getGraph().setNodeAttribute(this.selectedNode, "size", size / 1.5)
        }

        if (this.selectedNode === event.node) {
            this.selectedNode = null
            event.event.preventSigmaDefault();
            event.event.original.preventDefault();
            event.event.original.stopPropagation();
            return
        }

        this.selectedNode = event.node
        let size = this.sigma.getGraph().getNodeAttribute(this.selectedNode, "size")
        this.sigma.getGraph().setNodeAttribute(this.selectedNode, "size", size * 1.5)

        event.event.preventSigmaDefault();
        event.event.original.preventDefault();
        event.event.original.stopPropagation();

    }

    keypress(event) {
        console.log(event)
    }

    mousedown() {
        if (!this.sigma.getCustomBBox()) this.sigma.setCustomBBox(this.sigma.getBBox());
    }
}

// Have to store this since the useEffect callback gets called 4 times
// This way we can stop having 4 keypress event listeners on the sigma container
let keyDownCallback = null

function GraphComponent({ graph }) {

    function InitGraph() {
        const loadGraph = useLoadGraph();
        const registerEvents = useRegisterEvents();
        const sigma = useSigma()

        useEffect(() => { loadGraphEffect(graph, loadGraph) }, [loadGraph]);
        useEffect(() => {
            const eventRegistrationObject = new EventRegistration(sigma, registerEvents)
            sigma.getContainer().tabIndex = "0"
            console.log(keyDownCallback)
            sigma.getContainer().removeEventListener("keypress", keyDownCallback)
            keyDownCallback = eventRegistrationObject.keypress.bind(eventRegistrationObject)
            sigma.getContainer().addEventListener("keypress", keyDownCallback)

        }, [registerEvents, sigma]);

        return null;
    };

    return (
        <SigmaContainer settings={{ drawEdges: true, clone: false }}>
            <InitGraph />
        </SigmaContainer>
    )
}

export default GraphComponent