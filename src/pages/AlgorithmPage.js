import React, { Component } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"

import './AlgorithmPage.css'
import GraphComponent from "component/GraphComponent";
import CodeEditorComponent from "component/CodeEditorComponent";

import graphFactory from "lib/graphFactory";
import GraphWithHistory from "lib/graphWithHistory";

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }

    return ComponentWithRouterProp;
}

class AlgorithmPage extends Component {
    constructor() {
        super()
        this.state = {
            output: [],
            graph: null,
            code: "",
            history: [],
            historyIndex: -1
        }

        this.onRunCode = this.onRunCode.bind(this)
        this.fetchGraph = this.fetchGraph.bind(this)
        this.setGraph = this.setGraph.bind(this)
        this.onHistoryIndexChanged = this.onHistoryIndexChanged.bind(this)
        this.onHistoryForward = this.onHistoryForward.bind(this)
        this.onHistoryBack = this.onHistoryBack.bind(this)

    }

    componentDidMount() {
        this.fetchGraph()
    }

    async fetchGraph() {
        const [graph, code] = await graphFactory(this.props.router.params.algorithmName)
        this.setState({ code, graph })
    }

    onRunCode(code) {
        this.setState(prevState => ({ history: [prevState.graph] }))
        let newOutput = this.state.output.slice()

        // Back up console object so that we can restore it later
        let consoleBackup = {
            log: console.log,
            warn: console.warn,
            error: console.error,
        }

        // Overwrite console object so that we can store its output and render it in
        // the output tab
        console.log = (message, ...other) => {
            newOutput.push(JSON.stringify(message))
            other.forEach((el) => { newOutput.push(JSON.stringify(el)) })
            this.setState({ output: newOutput })
        }
        console.warn = console.log
        console.error = console.log

        // Wrap user code in a function so we can pass in the graph
        let codeAsFunction = "(graph) => {" + code + "}"

        // Run code in editor
        //
        // Normally this is not a good idea because it allows remote code execution,
        // however we don't have a backend or a way to share code.
        // All the code will exclusively be stored on the user's computer.
        // 
        // Only problem is if the code is copy pasted from a shady source so for this case
        // it would be a good idea to disable any way of damaging your own computer
        // Leaking information should not be a problem since we are not storing any
        // sensitive data.
        try {
            // eslint-disable-next-line
            let func = eval(codeAsFunction)
            let graph = GraphWithHistory.from(this.state.graph)
            graph.overwriteMethods((graph) => {
                this.setState(prevState => {
                    let newHistory = [...prevState.history]
                    newHistory.push(graph)
                    consoleBackup.log(newHistory)
                    return { history: newHistory }
                })
            })
            func(graph)
        } catch (error) {
            newOutput.push(error.toString())
        } finally {
            // Restore console object so it works as expected
            console.log = consoleBackup.log
            console.warn = consoleBackup.warn
            console.error = consoleBackup.error

            this.setState({ output: newOutput, code })
        }
    }

    setGraph(newGraph) {
        // TODO: use historyIndex to set graph
        this.setState({ graph: newGraph })
    }

    onHistoryIndexChanged(event) {
        if (event.eventPhase == 3) {
            this.setState({ historyIndex: event.target.value })
        }
    }

    onHistoryBack() {
        this.setState(prevState => {
            if (prevState.historyIndex > 0)
                return { historyIndex: prevState.historyIndex - 1 }
        })
    }

    onHistoryForward() {
        this.setState(prevState => {
            if (prevState.historyIndex < prevState.history.length - 1)
                return { historyIndex: prevState.historyIndex + 1 }
        })
    }

    render() {
        let graph = this.state.graph
        if (this.state.historyIndex !== -1) {
            graph = this.state.history[this.state.historyIndex]
        }
        return (
            <div id="algorithm">
                <div id="algorithm_name"><h1>{this.props.router.params.algorithmName}</h1></div>
                <div id="code-editor">
                    <CodeEditorComponent savedCode={this.state.code} onRunCode={this.onRunCode}></CodeEditorComponent>
                </div>
                <div id="history-slider">
                    {(this.state.history.length != 0 && this.state.history.length != 1) &&
                        <>
                            <span className="material-symbols-outlined" onClick={this.onHistoryBack}>arrow_left</span>
                            <input type="range" min="0" max={this.state.history.length - 1} value={this.state.historyIndex} onChange={this.onHistoryIndexChanged} />
                            <span className="material-symbols-outlined" onClick={this.onHistoryForward}>arrow_right</span>
                        </>
                    }
                </div>
                <div id="graph-visualisation">
                    {graph && <GraphComponent setGraph={this.setGraph} graph={graph}></GraphComponent>}
                </div>
                <div id="code-output">{this.state.output.map((el, index) => <p key={index}>{el}</p>)}</div>
            </div>
        )
    }
}

export default withRouter(AlgorithmPage)
