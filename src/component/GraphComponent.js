import { Component, createRef } from "react";
import { SigmaContainer, ControlsContainer } from "@react-sigma/core";

import "@react-sigma/core/lib/react-sigma.min.css";
import './GraphComponent.css'

const NODE_MOVE_AMOUNT = 0.01
const NODE_MOVE_AMOUNT_SMALL = 0.001

// Have to store this since the useEffect callback gets called 4 times
// This way we can stop having 4 keypress event listeners on the sigma container
let keyDownCallback = null

class GraphController extends Component {
    constructor({ setGraph }) {
        super()
        this.state = {
            selectedNode: null
        }
        this.sigma = createRef(null)
        this.hoveredNode = null
        this.mouseX = 0
        this.mouseY = 0
        this.setParentGraph = setGraph
        // TODO: Don't hardcode this
        this.defaultSize = 4
        this.keydown = this.keydown.bind(this)
        this.render = this.render.bind(this)
        this.onAttributeChange = this.onAttributeChange.bind(this)
        this.addNewAttribute = this.addNewAttribute.bind(this)
        this.setGraph = this.setGraph.bind(this)
    }

    setGraph(graph) {
        if (this.selectedNode) {
            let size = this.sigma.current.getGraph().getNodeAttribute(this.state.selectedNode, "size")
            this.sigma.current.getGraph().setNodeAttribute(this.selectedNode, "size", size / 1.5)
        }

        this.setParentGraph(graph)

        if (this.selectedNode) {
            let size = this.sigma.current.getGraph().getNodeAttribute(this.state.selectedNode, "size")
            this.sigma.current.getGraph().setNodeAttribute(this.selectedNode, "size", size * 1.5)
        }
    }

    componentDidMount() {
        console.log("sigma", this.sigma.current)
    }

    componentDidUpdate() {
        this.newNodeIndex = this.props.graph.order

        if (this.sigma.current) {
            this.sigma.current.setGraph(this.props.graph)
            this.sigma.current.removeAllListeners()

            console.log(this.sigma.current._eventsCount)
            this.sigma.current.on("clickNode", this.clickNode.bind(this))
            this.sigma.current.getMouseCaptor().on("mousedown", this.mousedown.bind(this))
            this.sigma.current.getMouseCaptor().on("mousemove", this.mousemove.bind(this))
            this.sigma.current.on("enterNode", this.enterNode.bind(this))
            this.sigma.current.on("leaveNode", this.leaveNode.bind(this))
            console.log(this.sigma.current._eventsCount)

            this.sigma.current.getContainer().tabIndex = "0"
            this.sigma.current.getContainer().removeEventListener("keydown", keyDownCallback)
            keyDownCallback = this.keydown
            this.sigma.current.getContainer().addEventListener("keydown", this.keydown)
        }
    }

    selectNode(node) {
        this.unselectNode()
        this.setState({ selectedNode: node })
        let size = this.sigma.current.getGraph().getNodeAttribute(node, "size")
        this.sigma.current.getGraph().setNodeAttribute(node, "size", size * 1.5)

        return node
    }

    unselectNode() {
        let selectedNode = this.state.selectedNode
        if (selectedNode) {
            let size = this.sigma.current.getGraph().getNodeAttribute(this.state.selectedNode, "size")
            this.sigma.current.getGraph().setNodeAttribute(this.state.selectedNode, "size", size / 1.5)
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
        console.log("jksahdkjhsjkfd")
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
            const pos = this.sigma.current.viewportToGraph({ x: this.mouseX, y: this.mouseY })
            const node = this.sigma.current.getGraph().addNode(this.newNodeIndex++, { x: pos.x, y: pos.y, color: "#000", size: this.defaultSize })
            this.setGraph(this.sigma.current.getGraph())
            this.selectNode(node)
        } else if (event.key === 'e') {
            if (!this.selectNode || !this.hoveredNode) {
                return
            }

            this.sigma.current.getGraph().addEdge(this.state.selectedNode, this.hoveredNode)
            this.setGraph(this.sigma.current.getGraph())
        } else if (event.key === 'd') {
            let confirmDelete = window.confirm("Are you sure you want to delete this node?")
            if (confirmDelete) {
                this.setState({ selectedNode: null })
                this.sigma.current.getGraph().dropNode(this.state.selectedNode)
                this.setGraph(this.sigma.current.getGraph())
            }
        } else if (event.key === "ArrowLeft") {
            if (!this.state.selectedNode)
                return

            const moveAmmount = event.shiftKey ? NODE_MOVE_AMOUNT_SMALL : NODE_MOVE_AMOUNT
            const x = this.sigma.current.getGraph().getNodeAttribute(this.state.selectedNode, "x")
            this.sigma.current.getGraph().setNodeAttribute(this.state.selectedNode, "x", x - moveAmmount)
            this.setGraph(this.sigma.current.getGraph())
        } else if (event.key === "ArrowRight") {
            if (!this.state.selectedNode)
                return

            const moveAmmount = event.shiftKey ? NODE_MOVE_AMOUNT_SMALL : NODE_MOVE_AMOUNT
            const x = this.sigma.current.getGraph().getNodeAttribute(this.state.selectedNode, "x")
            this.sigma.current.getGraph().setNodeAttribute(this.state.selectedNode, "x", x + moveAmmount)
            this.setGraph(this.sigma.current.getGraph())
        } else if (event.key === "ArrowUp") {
            if (!this.state.selectedNode)
                return

            const moveAmmount = event.shiftKey ? NODE_MOVE_AMOUNT_SMALL : NODE_MOVE_AMOUNT
            const y = this.sigma.current.getGraph().getNodeAttribute(this.state.selectedNode, "y")
            this.sigma.current.getGraph().setNodeAttribute(this.state.selectedNode, "y", y + moveAmmount)
            this.setGraph(this.sigma.current.getGraph())
        } else if (event.key === "ArrowDown") {
            if (!this.state.selectedNode)
                return

            const moveAmmount = event.shiftKey ? NODE_MOVE_AMOUNT_SMALL : NODE_MOVE_AMOUNT
            const y = this.sigma.current.getGraph().getNodeAttribute(this.state.selectedNode, "y")
            this.sigma.current.getGraph().setNodeAttribute(this.state.selectedNode, "y", y - moveAmmount)
            this.setGraph(this.sigma.current.getGraph())
        }
    }

    mousedown() {
        if (!this.sigma.current.getCustomBBox()) this.sigma.current.setCustomBBox(this.sigma.current.getBBox());
    }

    mousemove(event) {
        this.mouseX = event.x
        this.mouseY = event.y
    }

    onAttributeChange(key, event) {
        this.sigma.current.getGraph().setNodeAttribute(this.state.selectedNode, key, event.target.value)
        this.setGraph(this.sigma.current.getGraph())
        this.forceUpdate()
    }

    addNewAttribute() {
        let newAttribute = prompt("Enter name of new attribute: ")
        this.sigma.current.getGraph().setNodeAttribute(this.state.selectedNode, newAttribute, "")
        this.setGraph(this.sigma.current.getGraph())
        this.forceUpdate()
    }

    render() {

        let propertyControls = null
        if (this.state.selectedNode) {
            //const MANDATORY_ATTRIBUTES = ['size', 'color', 'x', 'y']
            let attributes = this.sigma.current.getGraph().getNodeAttributes(this.state.selectedNode)

            propertyControls = <ControlsContainer id="node-controls" position={"bottom-right"}>
                {Object.keys(attributes).map((key) =>
                    <div className="node-property" key={String(this.state.selectedNode) + ":" + String(key)}>
                        <p>{key}: <input onChange={(event) => this.onAttributeChange(key, event)} value={attributes[key]} /></p>
                    </div>
                )}

                <span onClick={this.addNewAttribute} className="material-symbols-outlined" id="add-attribute">add_circle</span>
            </ControlsContainer>
        }

        return <SigmaContainer
            ref={this.sigma}
            settings={{
                renderLabels: true,
                renderEdgeLabels: true,
                edgeLabelSize: "10",
                edgeLabelColor: "#000",
                enableEdgeClickEvents: true,
                enableEdgeHoverEvents: true,
                edgeReducer: (edge, data) =>
                ({
                    label: data.label,
                    size: data.size,
                    color: data.color,
                    hidden: data.hidde,
                    forceLabel: data.forceLabel || true,
                    zIndex: data.zIndex,
                    type: data.type,
                })
            }}>
            {propertyControls}
        </SigmaContainer>
    }
}

export default GraphController