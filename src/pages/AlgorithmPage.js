import { useParams } from "react-router-dom"

function AlgorithmPage() {

    const { algorithmName } = useParams()

    return (
        <>
            <h1>Algorithm Page</h1>
            <p>{algorithmName}</p>
        </>
    )
}

export default AlgorithmPage
