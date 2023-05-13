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
        document.addEventListener("keydown", el.clickEscEvent, true);
    },
    unmounted: el => {
        document.removeEventListener("keydown", el.clickEscEvent, true);
    },
};
export const insert = {
    beforeMount: (el, binding) => {
        let keysPressed = {};
        el.clickEscEvent = event => {           
            keysPressed[event.key] = true;
            if(keysPressed['Control'] && event.key === '1') {
                event.preventDefault();
                binding.value()
            }
        };
        document.addEventListener("keydown", el.clickEscEvent, true);
    },
    unmounted: el => {
        document.removeEventListener("keydown", el.clickEscEvent, true);
    },
};
export const esc = {
    beforeMount: (el, binding) => {
        el.clickEscEvent = event => {
            if(event.key === 'Escape') {
                binding.value()
            }
        };
        document.addEventListener("keydown", el.clickEscEvent, true);
    },
    unmounted: el => {
        document.removeEventListener("keydown", el.clickEscEvent, true);
    },
};

