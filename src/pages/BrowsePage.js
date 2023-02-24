import { getGraphList } from "lib/graphFactory"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import "./BrowsePage.css"

function BrowsePage() {

    let [graphList, setGraphList] = useState(null)
    useEffect(() => {
        getGraphList().then((graphList) => { setGraphList(graphList) })
    })

    if (!graphList) {
        return <p>Loading...</p>
    }

    return (
        <div id="graph-list">
            {
                Object.entries(graphList).map(
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
    )
}

export default BrowsePage