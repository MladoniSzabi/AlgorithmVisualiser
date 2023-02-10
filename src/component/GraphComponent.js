import { Component, useEffect } from "react";
import { SigmaContainer, useLoadGraph, useRegisterEvents, useSigma, ControlsContainer } from "@react-sigma/core";

import "@react-sigma/core/lib/react-sigma.min.css";
import './GraphComponent.css'

function loadGraphEffect(graph, loadGraph) {
    loadGraph(graph)
}

const NODE_MOVE_AMOUNT = 0.01
const NODE_MOVE_AMOUNT_SMALL = 0.001

// Have to store this since the useEffect callback gets called 4 times
// This way we can stop having 4 keypress event listeners on the sigma container
let keyDownCallback = null

class GraphController extends Component {
    constructor({ sigma, registerEvents }) {
        super()
        this.state = {
            selectedNode: null
        }
        this.sigma = sigma
        this.hoveredNode = null
        this.mouseX = 0
        this.mouseY = 0
        // TODO: Don't hardcode this
        this.defaultSize = 4
        this.keydown = this.keydown.bind(this)
        this.render = this.render.bind(this)
        this.onAttributeChange = this.onAttributeChange.bind(this)
        this.addNewAttribute = this.addNewAttribute.bind(this)

        registerEvents({
            clickNode: this.clickNode.bind(this),
            mousedown: this.mousedown.bind(this),
            mousemove: this.mousemove.bind(this),
            enterNode: this.enterNode.bind(this),
            leaveNode: this.leaveNode.bind(this),
        })
    }

    componentDidMount() {

        this.newNodeIndex = this.sigma.getGraph().order

        this.sigma.getContainer().tabIndex = "0"
        this.sigma.getContainer().removeEventListener("keydown", keyDownCallback)
        keyDownCallback = this.keydown
        this.sigma.getContainer().addEventListener("keydown", this.keydown)
    }

    selectNode(node) {
        this.unselectNode()
        this.setState({ selectedNode: node })
        let size = this.sigma.getGraph().getNodeAttribute(node, "size")
        this.sigma.getGraph().setNodeAttribute(node, "size", size * 1.5)

        return node
    }

    unselectNode() {
        let selectedNode = this.state.selectedNode
        if (selectedNode) {
            let size = this.sigma.getGraph().getNodeAttribute(this.state.selectedNode, "size")
            this.sigma.getGraph().setNodeAttribute(this.state.selectedNode, "size", size / 1.5)
            this.setState({ selectedNode: null })
        }

        return selectedNode
    }

    preventDefault(event) {
        event.event.preventSigmaDefault();
        event.event.original.preventDefault();
        event.event.original.stopPropagation();
    }

    clickNode(event) {

        if (this.state.selectedNode === event.node) {
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
        if (event.key === 'a') {
            const pos = this.sigma.viewportToGraph({ x: this.mouseX, y: this.mouseY })
            const node = this.sigma.getGraph().addNode(this.newNodeIndex++, { x: pos.x, y: pos.y, color: "#000", size: this.defaultSize })
            this.selectNode(node)
        } else if (event.key === 'e') {
            if (!this.selectNode || !this.hoveredNode) {
                return
            }

            this.sigma.getGraph().addEdge(this.state.selectedNode, this.hoveredNode)
        } else if (event.key === "ArrowLeft") {
            if (!this.state.selectedNode)
                return

            const moveAmmount = event.shiftKey ? NODE_MOVE_AMOUNT_SMALL : NODE_MOVE_AMOUNT
            const x = this.sigma.getGraph().getNodeAttribute(this.state.selectedNode, "x")
            this.sigma.getGraph().setNodeAttribute(this.state.selectedNode, "x", x - moveAmmount)
        } else if (event.key === "ArrowRight") {
            if (!this.state.selectedNode)
                return

            const moveAmmount = event.shiftKey ? NODE_MOVE_AMOUNT_SMALL : NODE_MOVE_AMOUNT
            const x = this.sigma.getGraph().getNodeAttribute(this.state.selectedNode, "x")
            this.sigma.getGraph().setNodeAttribute(this.state.selectedNode, "x", x + moveAmmount)
        } else if (event.key === "ArrowUp") {
            if (!this.state.selectedNode)
                return

            const moveAmmount = event.shiftKey ? NODE_MOVE_AMOUNT_SMALL : NODE_MOVE_AMOUNT
            const y = this.sigma.getGraph().getNodeAttribute(this.state.selectedNode, "y")
            this.sigma.getGraph().setNodeAttribute(this.state.selectedNode, "y", y + moveAmmount)
        } else if (event.key === "ArrowDown") {
            if (!this.state.selectedNode)
                return

            const moveAmmount = event.shiftKey ? NODE_MOVE_AMOUNT_SMALL : NODE_MOVE_AMOUNT
            const y = this.sigma.getGraph().getNodeAttribute(this.state.selectedNode, "y")
            this.sigma.getGraph().setNodeAttribute(this.state.selectedNode, "y", y - moveAmmount)
        }
    }

    mousedown() {
        if (!this.sigma.getCustomBBox()) this.sigma.setCustomBBox(this.sigma.getBBox());
    }

    mousemove(event) {
        this.mouseX = event.x
        this.mouseY = event.y
    }

    onAttributeChange(key, event) {
        this.sigma.getGraph().setNodeAttribute(this.state.selectedNode, key, event.target.value)
        this.forceUpdate()
    }

    addNewAttribute() {
        let newAttribute = prompt("Enter name of new attribute: ")
        this.sigma.getGraph().setNodeAttribute(this.state.selectedNode, newAttribute, "")
        this.forceUpdate()
    }

    render() {
        if (!this.state.selectedNode) {
            return null
        }

        const MANDATORY_ATTRIBUTES = ['size', 'color', 'x', 'y']
        let attributes = this.sigma.getGraph().getNodeAttributes(this.state.selectedNode)
        return <ControlsContainer id="node-controls" position={"bottom-right"}>
            {Object.keys(attributes).map((key) =>
                <div className="node-property" key={String(this.state.selectedNode) + ":" + String(key)}>
                    <p>{key}: <input onChange={(event) => this.onAttributeChange(key, event)} value={attributes[key]} /></p>
                </div>
            )}

            <span onClick={this.addNewAttribute} className="material-symbols-outlined" id="add-attribute">add_circle</span>
        </ControlsContainer>
    }
}

function GraphComponent({ graph }) {

    function InitGraph() {
        const loadGraph = useLoadGraph();
        const registerEvents = useRegisterEvents();
        const sigma = useSigma()

        useEffect(() => { loadGraphEffect(graph, loadGraph) }, [loadGraph]);

        return <GraphController sigma={sigma} registerEvents={registerEvents}></GraphController>;
    };

    return (
        <SigmaContainer settings={{ drawEdges: true, clone: false }}>
            <InitGraph />
        </SigmaContainer>
    )
}

export default GraphComponent