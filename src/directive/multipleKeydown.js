export const save = {
    beforeMount: (el, binding) => {
        let keysPressed = {};
        el.clickEscEvent = event => {           
            keysPressed[event.key] = true;
            if(keysPressed['Control'] && event.key === 's') {
                event.preventDefault();
                binding.value()
            }
        };
        document.addEventListener("keydown", el.clickEscEvent);
    },
    unmounted: el => {
        document.removeEventListener("keydown", el.clickEscEvent);
    },
};
export const insert = {
    beforeMount: (el, binding) => {
        let keysPressed = {};
        el.clickEscEvent = event => {           
            keysPressed[event.key] = true;
            if(keysPressed['Control'] && event.key === '1') {
                event.preventDefault();
                binding.value();
            }
        };
        document.addEventListener("keydown", el.clickEscEvent);
    },
    unmounted: el => {
        document.removeEventListener("keydown", el.clickEscEvent);
    },
};
export const esc = {
    beforeMount: (el, binding) => {
        console.log(el)
        el.clickEscEvent = event => {
            if(event.key === 'Escape') {
                binding.value()
            }
        };
        document.addEventListener("keydown", el.clickEscEvent);
    },
    unmounted: el => {
        document.removeEventListener("keydown", el.clickEscEvent);
    },
};
export const up = {
    beforeMount: (el, binding) => {
        el.clickEscEvent = event => {
            if(event.key === 'ArrowUp') {
                event.preventDefault();
                binding.value()
            }
        };
        document.addEventListener("keydown", el.clickEscEvent);
    },
    unmounted: el => {
        document.removeEventListener("keydown", el.clickEscEvent);
    },
};
export const down = {
    beforeMount: (el, binding) => {
        el.clickEscEvent = event => {
            if(event.key === 'ArrowDown') {
                event.preventDefault();
                binding.value()
            }
        };
        document.addEventListener("keydown", el.clickEscEvent);
    },
    unmounted: el => {
        document.removeEventListener("keydown", el.clickEscEvent);
    },
};
export const move = {
    mounted(el) {
        window.onmousemove = function (e) {
            var x = e.clientX,
                y = e.clientY;
            el.style.top = (y + 20) + 'px';
            el.style.left = (x + 20) + 'px';
        };
    },
}