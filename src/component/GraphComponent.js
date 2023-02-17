import { Component, createRef } from "react";
import { SigmaContainer, ControlsContainer } from "@react-sigma/core";

import "@react-sigma/core/lib/react-sigma.min.css";
import './GraphComponent.css'
import drawEdgeLabel from "lib/sigmaJSEdgeLabelRenderer";

const NODE_MOVE_AMOUNT = 0.01
const NODE_MOVE_AMOUNT_SMALL = 0.001

const NODE_DEFAULT_SIZE = 6
const EDGE_DEFAULT_SIZE = 4

// Have to store this since the useEffect callback gets called 4 times
// This way we can stop having 4 keypress event listeners on the sigma container
let keyDownCallback = null

class GraphComponent extends Component {
    constructor({ setGraph }) {
        super()
        this.state = {
            selectedNode: null,
            selectedEdge: null
        }
        this.sigma = createRef(null)
        this.hoveredNode = null
        this.hoveredEdge = null
        this.mouseX = 0
        this.mouseY = 0
        this.setParentGraph = setGraph
        // TODO: Don't hardcode this
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

    componentDidUpdate() {
        this.newNodeIndex = this.props.graph.order

        if (this.sigma.current && this.sigma.current._eventsCount === 0) {
            this.sigma.current.setGraph(this.props.graph)
            this.sigma.current.removeAllListeners()

            this.sigma.current.getMouseCaptor().on("mousedown", this.mousedown.bind(this))
            this.sigma.current.getMouseCaptor().on("mousemove", this.mousemove.bind(this))
            this.sigma.current.on("clickNode", this.clickNode.bind(this))
            this.sigma.current.on("enterNode", this.enterNode.bind(this))
            this.sigma.current.on("leaveNode", this.leaveNode.bind(this))
            this.sigma.current.on("enterEdge", this.enterEdge.bind(this))
            this.sigma.current.on("leaveEdge", this.leaveEdge.bind(this))
            this.sigma.current.on("clickEdge", this.clickEdge.bind(this))

            this.sigma.current.getContainer().tabIndex = "0"
            this.sigma.current.getContainer().removeEventListener("keydown", keyDownCallback)
            keyDownCallback = this.keydown
            this.sigma.current.getContainer().addEventListener("keydown", this.keydown)
        }
    }

    selectNode(node) {
        this.unselectNode()
        this.unselectEdge()
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

    enterEdge(event) {
        this.hoveredEdge = event.edge
        let size = this.sigma.current.getGraph().getEdgeAttribute(this.hoveredEdge, "size") || EDGE_DEFAULT_SIZE
        this.sigma.current.getGraph().setEdgeAttribute(this.hoveredEdge, "size", size * 2)
    }

    leaveEdge(event) {
        let size = this.sigma.current.getGraph().getEdgeAttribute(this.hoveredEdge, "size")
        this.sigma.current.getGraph().setEdgeAttribute(this.hoveredEdge, "size", size / 2)
        this.hoveredEdge = null
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

    addNode(position) {
        const node = this.sigma.current.getGraph().addNode(this.newNodeIndex++, { x: position.x, y: position.y, color: "#000", size: NODE_DEFAULT_SIZE })
        this.setGraph(this.sigma.current.getGraph())
        this.selectNode(node)
    }

    selectEdge(edge) {
        this.unselectNode()
        this.unselectEdge()
        this.setState({ selectedEdge: edge })
        let size = this.sigma.current.getGraph().getEdgeAttribute(edge, "size")
        this.sigma.current.getGraph().setEdgeAttribute(edge, "size", size * 1.5)

        return edge
    }

    unselectEdge() {
        let selectedEdge = this.state.selectedEdge
        if (selectedEdge) {
            let size = this.sigma.current.getGraph().getEdgeAttribute(this.state.selectedEdge, "size")
            this.sigma.current.getGraph().setEdgeAttribute(this.state.selectedEdge, "size", size / 1.5)
            this.setState({ selectedEdge: null })
        }

        return selectedEdge
    }

    clickEdge(event) {
        if (this.state.selectedEdge === event.edge) {
            this.unselectEdge()
            this.preventDefault(event)
            return
        }

        console.log(event)
        this.selectEdge(event.edge)
        this.preventDefault(event)
    }

    addEdge() {
        if (!this.selectNode || !this.hoveredNode) {
            return
        }

        this.sigma.current.getGraph().addEdge(this.state.selectedNode, this.hoveredNode)
        this.setGraph(this.sigma.current.getGraph())
    }

    deleteNode() {
        let confirmDelete = window.confirm("Are you sure you want to delete this node?")
        if (confirmDelete) {
            this.sigma.current.getGraph().dropNode(this.state.selectedNode)
            this.setState({ selectedNode: null })
            this.setGraph(this.sigma.current.getGraph())
        }
    }

    deleteEdge() {
        let confirmDelete = window.confirm("Are you sure you want to delete this edge?")
        if (confirmDelete) {
            this.sigma.current.getGraph().dropEdge(this.state.selectedEdge)
            this.setState({ selectedEdge: null })
            this.setGraph(this.sigma.current.getGraph())
        }
    }

    moveNode([x, y]) {
        if (!this.state.selectedNode)
            return


        x += this.sigma.current.getGraph().getNodeAttribute(this.state.selectedNode, "x")
        this.sigma.current.getGraph().setNodeAttribute(this.state.selectedNode, "x", x)

        y += this.sigma.current.getGraph().getNodeAttribute(this.state.selectedNode, "y")
        this.sigma.current.getGraph().setNodeAttribute(this.state.selectedNode, "y", y)

        this.setGraph(this.sigma.current.getGraph())
    }

    keydown(event) {
        if (event.key === 'a') {
            const pos = this.sigma.current.viewportToGraph({ x: this.mouseX, y: this.mouseY })
            this.addNode(pos)
        } else if (event.key === 'e') {
            this.addEdge()
        } else if (event.key === 'd') {
            if (this.state.selectedNode) {
                this.deleteNode()
            } else if (this.state.selectedEdge) {
                this.deleteEdge()
            }
        } else if (event.key === "ArrowLeft") {
            const moveAmmount = event.shiftKey ? NODE_MOVE_AMOUNT_SMALL : NODE_MOVE_AMOUNT
            this.moveNode([-moveAmmount, 0])
        } else if (event.key === "ArrowRight") {
            const moveAmmount = event.shiftKey ? NODE_MOVE_AMOUNT_SMALL : NODE_MOVE_AMOUNT
            this.moveNode([moveAmmount, 0])
        } else if (event.key === "ArrowUp") {
            const moveAmmount = event.shiftKey ? NODE_MOVE_AMOUNT_SMALL : NODE_MOVE_AMOUNT
            this.moveNode([0, moveAmmount])
        } else if (event.key === "ArrowDown") {
            const moveAmmount = event.shiftKey ? NODE_MOVE_AMOUNT_SMALL : NODE_MOVE_AMOUNT
            this.moveNode([0, -moveAmmount])
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
        if (this.state.selectedNode)
            this.sigma.current.getGraph().setNodeAttribute(this.state.selectedNode, key, event.target.value)
        else
            this.sigma.current.getGraph().setEdgeAttribute(this.state.selectedEdge, key, event.target.value)
        this.setGraph(this.sigma.current.getGraph())
        this.forceUpdate()
    }

    addNewAttribute() {
        let newAttribute = prompt("Enter name of new attribute: ")
        if (this.state.selectedNode)
            this.sigma.current.getGraph().setNodeAttribute(this.state.selectedNode, newAttribute, "")
        else
            this.sigma.current.getGraph().setEdgeAttribute(this.state.selectedEdge, newAttribute, "")
        this.setGraph(this.sigma.current.getGraph())
        this.forceUpdate()
    }

    render() {

        let propertyControls = null
        let attributes = null
        //const MANDATORY_ATTRIBUTES = ['size', 'color', 'x', 'y']
        if (this.state.selectedNode) {
            attributes = this.sigma.current.getGraph().getNodeAttributes(this.state.selectedNode)
            attributes.size = attributes.size || NODE_DEFAULT_SIZE * 1.5
        } else if (this.state.selectedEdge) {
            attributes = this.sigma.current.getGraph().getEdgeAttributes(this.state.selectedEdge)
            attributes.size = attributes.size || EDGE_DEFAULT_SIZE * 1.5
        }

        if (attributes) {
            propertyControls = <ControlsContainer id="property-controls" position={"bottom-right"}>
                {Object.keys(attributes).map((key) =>
                    <div className="property-control" key={String(this.state.selectedNode) + ":" + String(key)}>
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
                edgeLabelRenderer: drawEdgeLabel,
                edgeReducer: (edge, data) =>
                ({
                    label: data.label,
                    size: data.size || EDGE_DEFAULT_SIZE,
                    color: data.color,
                    hidden: data.hidden,
                    forceLabel: data.forceLabel || true,
                    zIndex: data.zIndex,
                    type: data.type,
                    labelPositionWeight: data.labelPositionWeight || 0.2
                }),

                nodeReducer: (node, data) => ({
                    label: data.label,
                    size: data.size || NODE_DEFAULT_SIZE,
                    color: data.color,
                    hidden: data.hidden,
                    forceLabel: data.forceLabel || true,
                    zIndex: data.zIndex,
                    type: data.type,
                    highlighted: data.highlighted,
                    x: data.x,
                    y: data.y
                })
            }}>
            {propertyControls}
        </SigmaContainer>
    }
}

export default GraphComponent