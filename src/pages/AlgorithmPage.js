import React, { useState } from "react";
import { useParams } from "react-router-dom"
import AceEditor from 'react-ace'
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

import './AlgorithmPage.css'

function AlgorithmPage() {

    const { algorithmName } = useParams()
    let [output, setOutput] = useState([])

    function runCode(code) {
        let output = []
        let consoleBackup = {
            log: console.log,
            warn: console.warn,
            error: console.error,
        }

        console.log = (message, ...other) => {

            output.push(JSON.stringify(message))
            other.forEach((el) => {output.push(JSON.stringify(el))})
        }
        console.warn = console.log
        console.error = console.log

        eval(code)

        console.log = consoleBackup.log
        console.warn = consoleBackup.warn
        console.error = consoleBackup.error

        return output
    }

    function onRunTriggered(editor) {
        setOutput(runCode(editor.getValue()))
    }

    return (
        <div id="algorithm">
            <div id="algorithm_name"><h1>{algorithmName}</h1></div>
            <div id="code-editor">
            <AceEditor
                placeholder="Placeholder Text"
                mode="javascript"
                theme="monokai"
                width="100%"
                height="100%"
                fontSize="1rem"
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                commands={[{
                    name:"run",
                    bindKey: {win: "Ctrl-Return", mac:"Cmd-Return"},
                    exec: onRunTriggered
                }]}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 4,
            }}/>
            </div>
            <div id="graph-visualisation"></div>
            <div id="code-output">{output.map((el, index) => <p key={index}>{el}</p>)}</div>
        </div>
    )
}

export default AlgorithmPage
