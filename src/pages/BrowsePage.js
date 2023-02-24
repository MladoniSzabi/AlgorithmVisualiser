import { getGraphList } from "lib/graphFactory"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

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
            <div id="filters">
                <p><label htmlFor="alg-search">Search:</label> <input id="alg-search" type="search" value={searchBarText} list="algs-datalist" onChange={onSearchBarChange}></input></p>
            </div>
            <datalist id="algs-datalist">
                {Object.entries(graphList).map(([key, value]) => <option value={key} key={key}>{key}</option>)}
            </datalist>
            <div id="graph-list">
                {
                    Object.entries(graphList).filter(([key, value]) => (key.includes(searchBarText))).map(
                        ([key, value]) =>
                            <div key={key} className="graph">
                                <Link to={key}>
                                    <img src="graph-icon.svg" alt={"graph-icon"}></img>
                                    <p>{key}</p>
                                </Link>
                            </div>
                    )
                }
            </div>
        </>
    )
}

export default BrowsePage