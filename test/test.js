const picker = new ElementPicker({
    action: {
        trigger: "click", // click, dblclick, mouseover
        callback: (function (target) {
            // target.remove();
            // target.style.fontSize = "50px"; 
            target.classList.toggle("highlight");
        }),
    }
});