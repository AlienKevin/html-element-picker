class ElementPicker {
    constructor(options) {
        const defaultOptions = {
            container: document.body,
            selectors: "*", // default to pick all elements
            background: "rgba(153, 235, 255, 0.5)", // transparent light blue
            borderWidth: 5,
            transition: "all 150ms ease", // set to "" (empty string) to disable
            ignoreElements: [document.body],
        }
        const mergedOptions = {
            ...defaultOptions,
            ...options
        };
        Object.keys(mergedOptions).forEach((key) => {
            this[key] = mergedOptions[key];
        });

        const hoverBox = document.createElement("div");
        // console.log("hoverBox: ", hoverBox);
        hoverBox.style.position = "absolute";
        // change to whatever highlight color you want
        hoverBox.style.background = this.background;
        // avoid blocking the hovered element and its surroundings
        hoverBox.style.zIndex = "0";
        hoverBox.style.transition = this.transition;
        this.container.appendChild(hoverBox);
        let previousTarget;
        this.container.addEventListener("mousemove", (e) => {
            let target = e.target;
            if (this.ignoreElements.indexOf(target) === -1 && target.matches(this.selectors)) { // is NOT ignored elements
                // console.log("TCL: target", target);
                if (target === hoverBox) {
                    // the truely hovered element behind the added hover box
                    const hoveredElement = document.elementsFromPoint(e.clientX, e.clientY)[1];
                    // console.log("screenX: " + e.screenX);
                    // console.log("screenY: " + e.screenY);
                    // console.log("TCL: hoveredElement", hoveredElement);
                    if (previousTarget === hoveredElement) {
                        // avoid repeated calculation and rendering
                        return;
                    } else {
                        target = hoveredElement;
                    }
                } else {
                    previousTarget = target;
                }
                const targetOffset = target.getBoundingClientRect();
                const targetHeight = targetOffset.height;
                const targetWidth = targetOffset.width;

                hoverBox.style.width = targetWidth + this.borderWidth * 2 + "px";
                hoverBox.style.height = targetHeight + this.borderWidth * 2 + "px";
                // need scrollX and scrollY to account for scrolling
                hoverBox.style.top = targetOffset.top + window.scrollY - this.borderWidth + "px";
                hoverBox.style.left = targetOffset.left + window.scrollX - this.borderWidth + "px";
            }
        });
    }
}
new ElementPicker({
    background: "rgba(20,20,20,0.5)",
    transition: "",
    // container: document.querySelector("main"),
    // borderWidth: -5,
    // selectors: "button",
});