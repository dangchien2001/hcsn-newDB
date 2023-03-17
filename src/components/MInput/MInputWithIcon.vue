<template>
    <div class="input-with-icon-container">

        <!-- input -->
        <input 
            type="text" 
            class="input-with-icon-input"
            :placeholder="placeholder"
            @input="emitValue"
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
    },
    methods: {
        /**
         * Hàm xuất dữ liệu input ra ngoài đồng thời thay đổi dữ liệu biến value phục vụ validate
         * Created by: NDCHIEN(2/3/2023)
         */
        emitValue(event) {
            this.$emit('update:modelValue', event.target.value);
        }
    }
}
</script>

<style scoped>
@import url(input.css);
</style>