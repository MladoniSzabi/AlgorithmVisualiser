import React, { Component } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"

import './AlgorithmPage.css'
import GraphComponent from "component/GraphComponent";
import CodeEditorComponent from "component/CodeEditorComponent";

import graphFactory from "lib/graphFactory";
import CodeRunner from "lib/codeRunner";

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
        this.setState({ code })
        let runner = new CodeRunner(code, this.state.graph)
        let [output, history] = runner.run()
        this.setState({ output, history })
    }

    setGraph(newGraph) {
        // TODO: use historyIndex to set graph
        this.setState({ graph: newGraph })
    }

    onHistoryIndexChanged(event) {
        if (event.eventPhase === 3) {
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
                    {(this.state.history.length !== 0 && this.state.history.length !== 1) &&
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
