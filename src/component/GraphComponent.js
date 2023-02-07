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
            mousedown: this.mousedown.bind(this),
        })

    }

    selectNode(node) {
        this.unselectNode()
        this.selectedNode = node
        let size = this.sigma.getGraph().getNodeAttribute(this.selectedNode, "size")
        this.sigma.getGraph().setNodeAttribute(this.selectedNode, "size", size * 1.5)

        return node
    }

    unselectNode() {
        let selectedNode = this.selectedNode
        if (selectedNode) {
            let size = this.sigma.getGraph().getNodeAttribute(this.selectedNode, "size")
            this.sigma.getGraph().setNodeAttribute(this.selectedNode, "size", size / 1.5)
            this.selectedNode = null
        }

        return selectedNode
    }

    preventDefault(event) {
        event.event.preventSigmaDefault();
        event.event.original.preventDefault();
        event.event.original.stopPropagation();
    }

    clickNode(event) {

        if (this.selectedNode === event.node) {
            this.unselectNode()
            this.preventDefault(event)
            return
        }

        this.selectNode(event.node)
        this.preventDefault(event)
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