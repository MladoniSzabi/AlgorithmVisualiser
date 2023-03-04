import { getGraphList } from "lib/graphFactory"
import { useEffect, useState } from "react"

import "./BrowsePage.css"

function BrowsePage() {

    let [graphList, setGraphList] = useState(null)
    let [searchBarText, setSearchBarText] = useState("")
    useEffect(() => {
        getGraphList().then((graphList) => { setGraphList(graphList) })
    })

    function onSearchBarChange(event) {
        setSearchBarText(event.target.value)
    }

    if (!graphList) {
        return <p>Loading...</p>
    }

    return (
        <>
            <nav class="title-bar">
                <div id="search-bar">
                    <label htmlFor="alg-search">Search:</label>
                    <input id="alg-search" type="search" value={searchBarText} list="algs-datalist" onChange={onSearchBarChange} />
                </div>

                <a href="/help" title="Help" class="icon-link help-page-link">
                    <span class="material-symbols-outlined">
                        help
                    </span>
                </a>

                <a href="/new-algorithm" id="new-algorithm" title="New Algorithm" class="icon-link">
                    <span className="material-symbols-outlined">
                        add_circle
                    </span>
                </a>
            </nav >
            <datalist id="algs-datalist">
                {Object.entries(graphList).map(([key, value]) => <option value={key} key={key}>{key}</option>)}
            </datalist>
            <div id="graph-list">
                {
                    Object.entries(graphList).filter(([key, value]) => (key.includes(searchBarText))).map(
                        ([key, value]) =>
                            <div key={key} className="graph">
                                <a href={"algorithm/" + key}>
                                    <img src="graph-icon.svg" alt={"graph-icon"}></img>
                                    <p>{key}</p>
                                </a>
                            </div>
                    )
                }
            </div>
        </>
    )
}

export default BrowsePage