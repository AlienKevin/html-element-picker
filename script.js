const hoverBox = document.createElement("div");
console.log("hoverBox: ", hoverBox);
hoverBox.style.position = "absolute";
// change to whatever highlight color you want
hoverBox.style.background = "rgba(153, 235, 255, 0.5)";
// avoid blocking the hovered element and its surroundings
hoverBox.style.zIndex = "0";
document.body.appendChild(hoverBox);
let previousTarget;
document.addEventListener("mousemove", (e) => {
    let target = e.target;
    console.log("TCL: target", target);
    if (target === hoverBox) {
        // the truely hovered element behind the added hover box
        const hoveredElement = document.elementsFromPoint(e.clientX, e.clientY)[1];
        console.log("screenX: " + e.screenX);
        console.log("screenY: " + e.screenY);
		console.log("TCL: hoveredElement", hoveredElement);
        if (previousTarget === hoveredElement){
            // avoid repeated calculation and rendering
            return;
        } else{
            target = hoveredElement;
        }
    } else{
        previousTarget = target;
    }
    const targetOffset = target.getBoundingClientRect();
    const targetHeight = targetOffset.height;
    const targetWidth = targetOffset.width;
    // add a border around hover box
    const boxBorder = 5;
    hoverBox.style.width = targetWidth + boxBorder * 2 + "px";
    hoverBox.style.height = targetHeight + boxBorder * 2 + "px";
    // need scrollX and scrollY to account for scrolling
    hoverBox.style.top = targetOffset.top + window.scrollY - boxBorder + "px";
    hoverBox.style.left = targetOffset.left + window.scrollX - boxBorder + "px";
});
// document.addEventListener("click", (e) => {
//     const target = e.target;
//     target.remove();
// });