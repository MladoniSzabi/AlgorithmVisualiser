import CodeEditorComponent from "component/CodeEditorComponent";
import Graph from "graphology";
import { useState } from "react";

import "./NewAlgorithmPage.css"

export default function NewAlgorithm() {

    //document.title = "New Algorithm"
    const [currentFormPart, setCurrentFormPart] = useState(0)
    const [codeValue, setCodeValue] = useState("// Enter your code here")

    function onCodeChange(newCode) {
        setCodeValue(newCode)
    }

    function createAlgorithm(data) {
        let graph = new Graph()
        if (data["algorithm-graph"]) {
            graph.import(data["algorithm-graph"])
        }
        localStorage.setItem(data["algorithm-title"], JSON.stringify({
            code: data["algorithm-code"],
            graph: graph.export()
        }))

        window.location = "/algorithm/" + data["algorithm-title"]
    }

    function onFinished(event) {
        let form = event.target.form
        let formData = { "algorithm-code": codeValue }
        for (let el of form) {
            if (el.name) {
                if (el.files) {
                    formData[el.name] = el.files[0]
                } else {
                    formData[el.name] = el.value
                }
            }
        }

        if (formData["algorithm-graph"]) {
            formData["algorithm-graph"].text().then((val) => {
                formData["algorithm-graph"] = JSON.parse(val)
                createAlgorithm(formData)
            })
        } else {
            createAlgorithm(formData)
        }
        setCurrentFormPart(-1)
    }

    let formParts = [
        <>
            <p>
                <label htmlFor="algorithm-title">Name: </label>
                <input type="text" name="algorithm-title" id="algorithm-title"></input>
            </p>
            <p>
                <label htmlFor="algorithm-graph">Graph: </label>
                <input type="file" name="algorithm-graph" id="algorithm-graph"></input>
            </p>
        </>,

        <>
            <p>Code: </p>
            <div id="algorithm-code-container">
                <CodeEditorComponent savedCode={codeValue} onCodeChange={onCodeChange}></CodeEditorComponent>
            </div>
        </>
    ]

    return <form onSubmit={(event) => { event.preventDefault(); return false }}>
        <div id="form-container">
            {formParts.map((val, index) => <div key={index} className={"form-part" + (index !== currentFormPart && " form-part-hidden")}>
                {val}
                {
                    index === formParts.length - 1 ?
                        <button onClick={onFinished}>Submit</button> :
                        <button onClick={() => { setCurrentFormPart(currentFormPart + 1) }}>Next</button>
                }

            </div>)}
        </div>
    </form>
}