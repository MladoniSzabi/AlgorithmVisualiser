import React, { Component, createRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"

import './AlgorithmPage.css'
import GraphComponent from "component/GraphComponent";
import CodeEditorComponent from "component/CodeEditorComponent";

import { graphFactory } from "lib/graphFactory";
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
            graph: null,
            code: "",
            history: [],
            historyIndex: -1,
        }

        this.onRunCode = this.onRunCode.bind(this)
        this.fetchGraph = this.fetchGraph.bind(this)
        this.onHistoryIndexChanged = this.onHistoryIndexChanged.bind(this)
        this.onHistoryForward = this.onHistoryForward.bind(this)
        this.onHistoryBack = this.onHistoryBack.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onCodeChange = this.onCodeChange.bind(this)
        this.resetHistory = this.resetHistory.bind(this)
        this.onBeforeUnload = this.onBeforeUnload.bind(this)
        this.onGraphChanged = this.onGraphChanged.bind(this)
        this.onGoingToBrowse = this.onGoingToBrowse.bind(this)

        this.graphComponentRef = createRef()

        this.didChange = false
    }

    onGoingToBrowse() {

    }

    onGraphChanged() {
        this.markAsChanged()
    }

    markAsChanged() {
        if (!this.didChange) {
            this.didChange = true
            document.title = "*" + document.title
        }
    }

    onCodeChange(code) {
        this.markAsChanged()
        this.setState({ code })
    }

    save() {
        if (this.didChange) {
            localStorage.setItem(this.props.router.params.algorithmName, JSON.stringify({
                code: this.state.code,
                graph: this.graphComponentRef.current.getGraph()
            }))

            if (document.title[0] === "*") {
                document.title = document.title.substring(1)
            }
            this.didChange = false
        }
    }

    onKeyDown(event) {
        console.log(event.key)
        if (event.key === "s" && event.ctrlKey && !event.altKey && !event.shiftKey) {
            this.save()
            event.preventDefault()
            return false
        }
    }

    onBeforeUnload(event) {
        if (!this.didChange) {
            return undefined
        }

        let confirmationMessage = 'It looks like you have been editing something. If you leave before saving, your changes will be lost.';

        (event || window.event).returnValue = confirmationMessage
        return confirmationMessage
    }

    componentDidMount() {
        this.fetchGraph()
        document.addEventListener("keydown", this.onKeyDown)
        window.addEventListener("beforeunload", this.onBeforeUnload)
        document.title = this.props.router.params.algorithmName
    }

    async fetchGraph() {
        console.log("fetching graph")
        const [graph, code] = await graphFactory(this.props.router.params.algorithmName)
        this.setState({ code, graph })
    }

    onRunCode(code) {
        this.setState({ code })
        let runner = new CodeRunner(code, this.state.graph)
        let history = runner.run()
        this.setState({ history, historyIndex: history.length - 1 })
    }

    onHistoryIndexChanged(event) {
        if (event.eventPhase === 3) {
            this.setState({ historyIndex: Number(event.target.value) })
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

    resetHistory() {
        this.setState({
            history: [],
            historyIndex: -1
        })
    }

    render() {
        let graph = this.state.graph
        let isInteractive = true
        let output = []
        if (this.state.historyIndex !== -1) {
            isInteractive = false
            graph = this.state.history[this.state.historyIndex].graph
            output = this.state.history[this.state.historyIndex].output
        }
        return (
            <div id="algorithm">
                <div id="algorithm_name">
                    <a href="/" class="back-button icon-link" >
                        <span className="material-symbols-outlined">
                            arrow_back
                        </span>
                    </a>
                    <h1>{this.props.router.params.algorithmName}</h1>
                    <a href="/help" title="Help" class="icon-link" target="_blank" rel="noopener noreferrer">
                        <span class="material-symbols-outlined">
                            help
                        </span>
                    </a>
                </div>
                <div id="code-editor">
                    <CodeEditorComponent onCodeChange={this.onCodeChange} savedCode={this.state.code} onRunCode={this.onRunCode}></CodeEditorComponent>
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
                    {graph && <GraphComponent onGraphChanged={this.onGraphChanged} isInteractive={isInteractive} ref={this.graphComponentRef} graph={graph}></GraphComponent>}
                    {this.state.historyIndex !== -1 && <button id="reset-history" onClick={this.resetHistory}><img src="/reset.svg" alt="reset" /></button>}
                </div>
                <div id="code-output">{output.map((el, index) => <p key={index}>{el}</p>)}</div>
            </div>
        )
    }
}

export default withRouter(AlgorithmPage)
