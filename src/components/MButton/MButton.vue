<template>
    <button 
        :class="
        [
            { 'sub-button': isSubButton == type }, 
            { 'button-container': isButtonContainer == type },
            { 'outline-button': isOutlineButton == type }, 
        ]"
        ref='focusMe'
        :tabindex="tabIndex"
    >
        <div class="text-button">{{ text }}</div>
    </button>
</template>

<script>
export default {
    props: {
        text: String,
        type: String,
        code: Boolean,
        tabIndex: Number,
    }, 
    mounted() {
        if(this.code) {
            this.$refs.focusMe.focus();
        }
    },
    data() {
        return {
            isSubButton: "sub-button",
            isButtonContainer: "button-container",
            isOutlineButton: "outline-button",
        }
    },
}
</script>

<style scoped>
@import url(./button.css);
</style>