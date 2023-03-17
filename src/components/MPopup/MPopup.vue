<template>

    <!-- popup -->
    <div class="popup">
        
        <!-- phần layer popup -->
        <div class="popup-layer">

            <!-- hộp popup -->
            <div class="popup-box">

                <!-- title -->
                <div class="popup-title">{{ title }}</div>

                <!-- content -->
                <div class="popup-content">
                    <div :class="
                        [
                            {'popup-content-icon-warning' : type == 'warning'},
                            {'popup-content-icon-success' : type == 'success'},
                            {'popup-content-icon-fail' : type == 'fail'}
                        ]"
                    ></div>
                    <div class="popup-content-text">
                        {{ content }}
                        <slot></slot>
                    </div>
                </div>

                <!-- thanh button -->
                <div class="popup-group-button">

                    <!-- khoảng trống -->
                    <div class="popup-blank"></div>

                    <!-- outline button -->
                    <MButton
                        text="Hủy bỏ"
                        type="outline-button"
                        class="outline-button"
                        v-if="fullOption"
                    ></MButton>

                    <!-- sub button -->
                    <MButton
                        text="Không lưu"
                        type="sub-button"
                        class="sub-button"
                        v-if="fullOption"
                    ></MButton>

                    <!-- main button -->
                    <MButton
                        text="Lưu"
                        type="button-container"
                        class="main-button"
                        v-if="fullOption"
                    ></MButton>

                    <!-- main button đồng ý -->
                    <MButton
                        text="Đồng ý"
                        type="button-container"
                        class="main-button"
                        v-if="acceptOption"
                    ></MButton>

                    <!-- close button -->
                    <MButton
                        text="Đóng"
                        type="button-container"
                        class="main-button"
                        v-if="closeOption"
                        @click="exitPopup"
                    ></MButton>

                    <!-- deleteOption -->
                    

                    <MButton
                        text="Không"
                        type="button-container"
                        class="sub-button"
                        v-if="deleteOption"
                        @click="exitPopup"
                    ></MButton>

                    <MButton
                        text="Xóa"
                        type="button-container"
                        class="main-button"
                        v-if="deleteOption"
                        @click="() => {this.$emit('deleteAction')}"
                    ></MButton>

                </div>

                <!-- nút x  -->
                <!-- <div 
                    class="popup-exit"
                    @click="exitPopup"
                ></div> -->

            </div>

        </div>

    </div>

</template>

<script>
import MButton from '../MButton/MButton.vue';
export default {
    props: {
        title: String,
        content: String,
        typeButton: String,
        type: String,
    },
    components: {
        MButton,
    },
    methods: {

        /**
         * Hàm exit popup
         */
        exitPopup() {
            this.$emit("exitPopup");
        }
        
    },
    created() {

        /**
         * Kiểm tra kiểu nút thông qua props
         */
        if(this.typeButton == "acceptOption") {
            this.acceptOption = true;
        }
        if(this.typeButton == "fullOption") {
            this.fullOption = true;
        }
        if(this.typeButton == "closeOption") {
            this.closeOption = true;
        }
        if(this.typeButton == "deleteOption") {
            this.deleteOption = true;
        }
        
    },
    data() {
        return {
            fullOption: false,
            acceptOption: false,
            closeOption: false,
            deleteOption: false,
        }
    }
}
</script>

<style scoped>
@import url(./popup.css);
</style>