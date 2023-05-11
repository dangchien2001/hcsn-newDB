const esc = {
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

export default esc;