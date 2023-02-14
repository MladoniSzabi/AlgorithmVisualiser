export default function drawEdgeLabel(
    renderingContext,
    edgeData,
    sourceNodeData,
    targetNodeData,
    settings
) {
    const size = settings.edgeLabelSize,
        font = settings.edgeLabelFont,
        weight = settings.edgeLabelWeight,
        color = settings.edgeLabelColor.attribute
            ? edgeData[settings.edgeLabelColor.attribute] || settings.edgeLabelColor.color || "#000"
            : settings.edgeLabelColor.color,
        positionWeight = edgeData.labelPositionWeight || settings.edgeLabelPositionWeight || 0.5

    let label = edgeData.label;

    if (!label) return;

    renderingContext.fillStyle = color;
    renderingContext.font = `${weight} ${size}px ${font}`;

    // Computing positions without considering nodes sizes:
    const sSize = sourceNodeData.size;
    const tSize = targetNodeData.size;
    let sx = sourceNodeData.x;
    let sy = sourceNodeData.y;
    let tx = targetNodeData.x;
    let ty = targetNodeData.y;
    let cx = sx * positionWeight + tx * (1 - positionWeight);
    let cy = sy * positionWeight + ty * (1 - positionWeight);
    let dx = tx - sx;
    let dy = ty - sy;
    let d = Math.sqrt(dx * dx + dy * dy);

    if (d < sSize + tSize) return;

    // Adding nodes sizes:
    sx += (dx * sSize) / d;
    sy += (dy * sSize) / d;
    tx -= (dx * tSize) / d;
    ty -= (dy * tSize) / d;
    cx = sx * positionWeight + tx * (1 - positionWeight);
    cy = sy * positionWeight + ty * (1 - positionWeight);
    dx = tx - sx;
    dy = ty - sy;
    d = Math.sqrt(dx * dx + dy * dy);

    // Handling ellipsis
    let textLength = renderingContext.measureText(label).width;

    if (textLength > d) {
        const ellipsis = "…";
        label = label + ellipsis;
        textLength = renderingContext.measureText(label).width;

        while (textLength > d && label.length > 1) {
            label = label.slice(0, -2) + ellipsis;
            textLength = renderingContext.measureText(label).width;
        }

        if (label.length < 4) return;
    }

    let angle;
    if (dx > 0) {
        if (dy > 0) angle = Math.acos(dx / d);
        else angle = Math.asin(dy / d);
    } else {
        if (dy > 0) angle = Math.acos(dx / d) + Math.PI;
        else angle = Math.asin(dx / d) + Math.PI / 2;
    }

    renderingContext.save();
    renderingContext.translate(cx, cy);
    renderingContext.rotate(angle);

    //renderingContext.fillText(label, -textLength / 2, edgeData.size / 2 + size);
    renderingContext.fillText(label, 0, 0)

    renderingContext.restore();
}