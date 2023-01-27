import { useParams } from "react-router-dom"
import AceEditor from 'react-ace'
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

import './AlgorithmPage.css'

function AlgorithmPage() {

    const { algorithmName } = useParams()

    function onLoad(editor) {
        console.log(editor)
    }

    return (
        <div id="algorithm">
            <div id="algorithm_name"><h1>{algorithmName}</h1></div>
            <div id="code-editor">
            <AceEditor
                placeholder="Placeholder Text"
                mode="javascript"
                theme="monokai"
                name="blah2"
                onLoad={onLoad}
                // onChange={this.onChange}
                width="100%"
                height="100%"
                fontSize="1rem"
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 4,
            }}/>
            </div>
            <div id="graph-visualisation"></div>
            <div id="code-output"></div>
        </div>
    )
}

export default AlgorithmPage
