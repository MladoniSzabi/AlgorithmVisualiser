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
        this.mouseX = 0
        this.mouseY = 0
        // TODO: Don't hardcode this
        this.defaultSize = 4

        registerEvents({
            clickNode: this.clickNode.bind(this),
            mousedown: this.mousedown.bind(this),
            mousemove: this.mousemove.bind(this),
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
        if(event.key == 'a') {
            const pos = this.sigma.viewportToGraph({x: this.mouseX, y: this.mouseY})
            const node = this.sigma.getGraph().addNode(this.newNodeIndex++, {x: pos.x, y: pos.y, color: "#000", size: this.defaultSize})
            this.selectNode(node)
        }
    }

    mousedown() {
        if (!this.sigma.getCustomBBox()) this.sigma.setCustomBBox(this.sigma.getBBox());
    }

    mousemove(event) {
        this.mouseX = event.x
        this.mouseY = event.y
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