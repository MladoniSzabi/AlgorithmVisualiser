import AceEditor from 'react-ace'
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

function CodeEditorComponent({onRunCode}) {

    function onRunTriggered(editor) {
        onRunCode(editor.getValue())
    }

    return <AceEditor
        placeholder="Enter your code here..."
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
}

export default CodeEditorComponent