import React, { useState } from "react";
import { useParams } from "react-router-dom"

import './AlgorithmPage.css'
import CodeEditorComponent from "component/CodeEditorComponent";

function AlgorithmPage() {

    const { algorithmName } = useParams()
    let [output, setOutput] = useState([])

    function onRunCode(code) {
        let newOutput = output.slice()

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
            other.forEach((el) => {newOutput.push(JSON.stringify(el))})
        }
        console.warn = console.log
        console.error = console.log

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
            eval(code)
        } catch(error) {
            newOutput.push(error.toString())
        } finally {
            // Restore console object so it works as expected
            console.log = consoleBackup.log
            console.warn = consoleBackup.warn
            console.error = consoleBackup.error

            setOutput(newOutput)
        }
    }

    return (
        <div id="algorithm">
            <div id="algorithm_name"><h1>{algorithmName}</h1></div>
            <div id="code-editor">
                <CodeEditorComponent onRunCode={onRunCode}></CodeEditorComponent>
            </div>
            <div id="graph-visualisation"></div>
            <div id="code-output">{output.map((el, index) => <p key={index}>{el}</p>)}</div>
        </div>
    )
}

export default AlgorithmPage
