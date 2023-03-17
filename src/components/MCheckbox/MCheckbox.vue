<template>

    <!-- checkbox -->
    <div
        :class="
            [
                {'checkbox-with-active' : modelValue == true}, 
                {'checkbox-without-active' : modelValue == false},
                ' checkbox-container'
            ]"
        @click="handleCheckbox"
    >
    </div>

</template>

<script>
export default {
    props: {
        modelValue: Boolean,
    },
    methods: {
        
        /**
         * Hàm dùng để thay đổi trạng thái checkbox khi nhấn
         * Created by: NDCHIEN(2/3/2023)
         */
        handleCheckbox() {
            this.$emit('update:modelValue', !this.modelValue);
        }
    },
    data() {
        return {
            
        }
    }
}
</script>

<style scoped>
@import url(./checkbox.css);
</style>