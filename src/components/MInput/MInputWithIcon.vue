<template>
    <div class="input-with-icon-container">

        <!-- input -->
        <input 
            type="text" 
            class="input-with-icon-input"
            :placeholder="placeholder"
            @input="emitValue"
            ref='focusMe'
            @blur="unForcus"
            :tabindex="tabindex"
        >

        <!-- icon -->
        <div class="input-with-icon-icon-container">
            <slot></slot>
        </div>

    </div>
</template>

<script>
export default {    
    props: {
        placeholder: String,
        modelValue: String,
        code: Boolean,
        tabindex: Number,
    },
    methods: {
        /**
         * Hàm xuất dữ liệu input ra ngoài đồng thời thay đổi dữ liệu biến value phục vụ validate
         * Created by: NDCHIEN(2/3/2023)
         */
        emitValue(event) {
            this.$emit('update:modelValue', event.target.value);
        },
        unForcus() {
            this.$emit("unForcus");
        },
    },
    mounted() {
        if(this.code) {
            this.$refs.focusMe.focus();
        }
    },
    watch: {
        /**
         * Forcus lại sau khi props code thay đổi
         * Created by: NDCHIEN(10/5/2023)
         */
        code: function(newValue) {
            if(newValue == true) {
                this.$refs.focusMe.focus();
                this.$refs.focusMe.select();
            }
        }
    }
}
</script>

<style scoped>
@import url(input.css);
</style>