import { Graph } from "graphology"
import GraphWithHistory from "lib/graphWithHistory";

export default class CodeRunner {
    constructor(code, graph) {
        this.code = code
        this.graph = new Graph()
        this.graph.import(graph.export())

        this.groupHistory = false
        this.latestGraph = null
        this.output = []
        this.history = [{ graph: this.graph, output: [] }]
    }

    run() {
        // Back up console object so that we can restore it later
        let consoleBackup = {
            log: console.log,
            warn: console.warn,
            error: console.error,
        }

        // Overwrite console object so that we can store its output and render it in
        // the output tab
        console.log = (message, ...other) => {
            this.output.push(JSON.stringify(message))
            other.forEach((el) => { this.output.push(JSON.stringify(el)) })
        }
        console.warn = console.log
        console.error = console.log

        // Wrap user code in a function so we can pass in the graph
        let codeAsFunction = "(graph, groupHistory, finishHistoryGroup) => {" + this.code + "}"

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
            let graph = new GraphWithHistory()
            graph.import(this.graph.export())
            graph.overwriteMethods((graph) => {
                if (this.groupingHistory) {
                    this.latestGraph = graph
                    return
                }

                this.history.push({ graph, output: this.output.slice() })
            })

            let groupHistory = () => {
                if (this.groupingHistory) {
                    throw new Error("Already grouping")
                }
                this.groupingHistory = true
            }

            let finishHistoryGroup = () => {
                if (!this.groupingHistory) {
                    throw new Error("Grouping not started")
                }

                if (this.latestGraph !== null) {
                    this.history.push({ graph: this.latestGraph, output: this.output.slice() })
                }
                this.groupingHistory = false
                this.latestGraph = null
            }

            func(graph, groupHistory, finishHistoryGroup)
        } catch (error) {
            this.output.push(error.toString())
            throw error
        } finally {
            // Restore console object so it works as expected
            console.log = consoleBackup.log
            console.warn = consoleBackup.warn
            console.error = consoleBackup.error
            this.history[this.history.length - 1].output = this.output.slice()
            this.history.push({ graph: this.graph, output: this.output.slice() })

            return this.history
        }
    }
}