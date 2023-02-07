import { useEffect } from "react";
import { SigmaContainer, useLoadGraph, useRegisterEvents, useSigma } from "@react-sigma/core";

import "@react-sigma/core/lib/react-sigma.min.css";

function loadGraphEffect(graph, loadGraph) {
    loadGraph(graph)
}

const NODE_MOVE_AMOUNT = 0.01
const NODE_MOVE_AMOUNT_SMALL = 0.001

class EventRegistration {
    constructor(sigma, registerEvents) {
        this.sigma = sigma
        this.newNodeIndex = sigma.getGraph().order
        this.selectedNode = null
        this.hoveredNode = null
        this.mouseX = 0
        this.mouseY = 0
        // TODO: Don't hardcode this
        this.defaultSize = 4

        registerEvents({
            clickNode: this.clickNode.bind(this),
            mousedown: this.mousedown.bind(this),
            mousemove: this.mousemove.bind(this),
            enterNode: this.enterNode.bind(this),
            leaveNode: this.leaveNode.bind(this),
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

    enterNode(event) {
        this.hoveredNode = event.node
    }

    leaveNode() {
        this.hoveredNode = null
    }

    keydown(event) {
        if (event.key == 'a') {
            const pos = this.sigma.viewportToGraph({ x: this.mouseX, y: this.mouseY })
            const node = this.sigma.getGraph().addNode(this.newNodeIndex++, { x: pos.x, y: pos.y, color: "#000", size: this.defaultSize })
            this.selectNode(node)
        } else if (event.key == 'e') {
            if (!this.selectNode || !this.hoveredNode) {
                return
            }

            this.sigma.getGraph().addEdge(this.selectedNode, this.hoveredNode)
        } else if (event.key == "ArrowLeft") {
            if (!this.selectedNode)
                return

            const moveAmmount = event.shiftKey ? NODE_MOVE_AMOUNT_SMALL : NODE_MOVE_AMOUNT
            const x = this.sigma.getGraph().getNodeAttribute(this.selectedNode, "x")
            this.sigma.getGraph().setNodeAttribute(this.selectedNode, "x", x - moveAmmount)
        } else if (event.key == "ArrowRight") {
            if (!this.selectedNode)
                return

            const moveAmmount = event.shiftKey ? NODE_MOVE_AMOUNT_SMALL : NODE_MOVE_AMOUNT
            const x = this.sigma.getGraph().getNodeAttribute(this.selectedNode, "x")
            this.sigma.getGraph().setNodeAttribute(this.selectedNode, "x", x + moveAmmount)
        } else if (event.key == "ArrowUp") {
            if (!this.selectedNode)
                return

            const moveAmmount = event.shiftKey ? NODE_MOVE_AMOUNT_SMALL : NODE_MOVE_AMOUNT
            const y = this.sigma.getGraph().getNodeAttribute(this.selectedNode, "y")
            this.sigma.getGraph().setNodeAttribute(this.selectedNode, "y", y + moveAmmount)
        } else if (event.key == "ArrowDown") {
            if (!this.selectedNode)
                return

            const moveAmmount = event.shiftKey ? NODE_MOVE_AMOUNT_SMALL : NODE_MOVE_AMOUNT
            const y = this.sigma.getGraph().getNodeAttribute(this.selectedNode, "y")
            this.sigma.getGraph().setNodeAttribute(this.selectedNode, "y", y - moveAmmount)
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
            sigma.getContainer().removeEventListener("keydown", keyDownCallback)
            keyDownCallback = eventRegistrationObject.keydown.bind(eventRegistrationObject)
            sigma.getContainer().addEventListener("keydown", keyDownCallback)

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