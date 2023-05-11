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
                    <div class="popup-content-text" v-if="listContent == undefined || listContent == null">
                        {{ content }}                        
                        <slot></slot>
                    </div>
                    <div class="popup-content-text" v-if="listContent != undefined || listContent != null">
                        

                        <div 
                            class="popup-list-content-text"
                            v-for="(item, index) in listContent"
                            :key="index"
                        >
                            - {{ item }}
                            <slot></slot>
                        </div>
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
                        @click="exitPopup"
                    ></MButton>

                    <!-- sub button -->
                    <MButton
                        text="Không lưu"
                        type="sub-button"
                        class="sub-button"
                        v-if="fullOption"
                        @click="() => {this.$emit('notSave')}"
                    ></MButton>

                    <!-- main button -->
                    <MButton
                        text="Lưu"
                        type="button-container"
                        class="main-button"
                        v-if="fullOption"
                        @click="() => {this.$emit('save')}"
                        :code="true"
                    ></MButton>

                    <!-- main button đồng ý -->
                    <MButton
                        text="Đồng ý"
                        type="button-container"
                        class="main-button"
                        v-if="acceptOption"
                        :code="true"
                    ></MButton>

                    <!-- close button -->
                    <MButton
                        text="Đóng"
                        type="button-container"
                        class="main-button"
                        v-if="closeOption"
                        @click="exitPopup"
                        :code="true"
                    ></MButton>

                    <!-- deleteOption -->
                    

                    <MButton
                        text="Không"
                        type="button-container"
                        class="sub-button"
                        v-if="deleteOption && !isEmpty"
                        @click="exitPopup"
                        tabIndex=2
                    ></MButton>

                    <MButton
                        text="Xóa"
                        type="button-container"
                        class="main-button"
                        v-if="deleteOption && !isEmpty"
                        @click="() => {this.$emit('deleteAction')}"
                        :code="true"
                        tabIndex=1
                    ></MButton>

                    <MButton
                        text="Hủy bỏ"
                        type="button-container"
                        class="main-button"
                        v-if="isEmpty"
                        @click="exitPopup"
                        :code="true"
                    ></MButton>

                    <!-- outline-main option -->
                    <MButton
                        text="Không"
                        type="outline-button"
                        class="outline-button"
                        v-if="cancelOption"   
                        @click="exitPopup"                    
                    ></MButton>

                    <MButton
                        text="Hủy bỏ"
                        type="button-container"
                        class="main-button"
                        v-if="cancelOption"
                        @click="() => {this.$emit('cancel')}"
                        :code="true"
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
        listContent: Array,
        isEmpty: Boolean,
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
        if(this.typeButton == "cancelOption") {
            this.cancelOption = true;
        }
        
    },
    data() {
        return {
            fullOption: false,
            acceptOption: false,
            closeOption: false,
            deleteOption: false,
            cancelOption: false,
        }
    }
}
</script>

<style scoped>
@import url(./popup.css);
</style>