import HeaderElement from "component/HeaderComponent"

import './HelpPage.css'

const helpPageSections = [
    {
        id: "graph-interactivity",
        header: "Interacting with the Graph",
        content: [
            {
                id: "control",
                header: "Moving Around",
                content: [
                    "You can move around the graph by clicking on white space and dragging your mouse.",
                    "You can zoom in and out using the mouse wheel."
                ]
            },
            {
                id: "add-vertex",
                header: "Adding a New Vertex",
                content: [
                    "To add a vertex, make sure the graph view is focused, then press 'a'.",
                    "A vertex will be placed where the cursor is."
                ]
            },
            {
                id: "delete-vertex",
                header: "Deleting a Vertex",
                content: [

                    "To delete a vertex, make sure it is selected by clicking on it, then press the 'd' button.",
                    "This will then show a popup asking you to confirm that you want to delete the vertex.",
                    "Click 'ok'",
                ]
            },
            {
                id: "attributes",
                header: "Viewing and Modifying Attributes",
                content: [

                    "To view the attributes of either a vertex or an edge, select them by clicking on them.",
                    "To modify an attribute, use the input field to the right of the name of the attribute.",
                ]
            },
            {
                id: "add-attributes",
                header: "Adding New Attributes",
                content: [

                    "To add a new attribute, click the '+' button at the end of the list of attributes.",
                    "A dialogue will pop up, with a box where you can enter the name of the attribute.",
                    "After you enter the name of the attribute, click 'ok'",
                ]
            },
            {
                id: "delete-attributes",
                header: "Deleting Attributes",
                content: [

                    "To delete an attribute, click on the 'x' to the right of the input box.",
                    "Once you clicked on the 'x', a popup will ask you to confirm that you want to delete the attribute.",
                    "Click 'ok'.",
                ]
            }
        ]
    },
    {
        id: "algorithm-about",
        header: "Your Algorithm",
        content: [
            {
                id: "tech-stack",
                header: "Tech Stack",
                content: [
                    "When writing your algorithm you are given a variable named 'graph'.",
                    "The library that provides the graph is the graphology library.",
                    "You can find the documentation about all of its methods and attributes here:",
                    "https://graphology.github.io/"
                ]
            },
            {
                id: "algorithm-run",
                header: "How to Run Your Algorithm",
                content: [
                    "To run your algorithm, press CTRL + ENTER.",
                    "Once you run your algorithm, markers will be generated that show how your graph changed over time.",
                    "The new graphs generated at these markers cannot be modified."
                ]
            },
            {
                id: "algorithm-history",
                header: "Marker Generation",
                content: [
                    "When running your algorithm, markers are created to show the progression of your graph.",
                    "A marker is generated each time a mutating method is called on the graph (eg. changeVertexAttribute, addNode, etc).",
                    "If you would like to group several mutating operations into one marker, call the groupHistory() method before calling the methods.",
                    "You also have to call finishHistoryGroup() after the last mutating operation."
                ]
            },
            {
                id: "algorithm-reset",
                header: "Resetting the Graph",
                content: [
                    "If you would like to remove the markers or edit your original graph, click the reset button on the top left of the graph."
                ]
            },
            {
                id: "algorithm-new",
                header: "New Algorithm",
                content: [
                    "If you would like to create your own algorithm, go to the browse page and click on the '+' button.",
                    "This will then take you to the algorithm creation page, where first you will need to give your algorithm a name.",
                    "Optionally you could upload a JSON file which contains a serialised graphology graph data for your graph.",
                    "Click next, and then you can enter the code for your algorithm and then click submit.",
                ]
            },
            {
                id: "algorithm-storage",
                header: "Where are your algorithms stored?",
                content: [
                    "All your algorithms and code are stored on your computer in your browser's local storage.",
                    "This means that giving someone the URL the oage with your algorithm will not necessarily mean that they can see it.",
                ]
            }
        ]
    }
]

export default function HelpPage() {

    function renderTableOfContent(content, level) {
        if (level === 1) {
            return <div>
                {content.map((el) => (
                    el.header ?
                        <p>
                            <a href={"#" + el.id}>{el.header}</a>
                            {/* Use reduce to remove empty ul elements. */}
                            {el.content.reduce(((hasChildren, el) => (hasChildren || typeof el == "object")), false) && renderTableOfContent(el.content, level + 1)}
                        </p> :
                        null
                ))}
            </div>
        }

        return <ul>
            {content.map((el) => (
                el.header ?
                    <li>
                        <a href={"#" + el.id}>{el.header}</a>
                        {/* Use reduce to remove empty ul elements. */}
                        {el.content.reduce(((hasChildren, el) => (hasChildren || typeof el == "object")), false) && renderTableOfContent(el.content, level + 1)}
                    </li> :
                    null
            ))}
        </ul>
    }

    function renderContent(sections, level, increment = 1) {
        return <>
            {sections.map((el) => (
                typeof el === 'object' ?
                    <div id={el.id}>
                        <HeaderElement number={level}>{el.header}</HeaderElement>
                        {renderContent(el.content, level + increment)}
                    </div> :
                    <p>{el}</p>
            ))}
        </>
    }

    return <div id="help-page">
        <div class="title-bar">
            <a href="/" class="back-button">
                <span className="material-symbols-outlined">
                    arrow_back
                </span>
            </a>
            <h1>Help</h1>
        </div>
        <div id="table-of-content">
            <h3>Contents</h3>
            <nav>
                {renderTableOfContent(helpPageSections, 1)}
            </nav>
        </div>
        <div id="content">
            {renderContent(helpPageSections, 3)}
        </div>
    </div>
}