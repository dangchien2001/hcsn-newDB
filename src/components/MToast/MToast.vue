<template>

    <!-- toast container -->
    <div class="toast-container" v-if="isShow">
        
        <!-- icon -->
        <div :class="'toast-container-icon ' + toastIcon"></div>

        <!-- title status -->
        <!-- <div 
            :class="'toast-container-title ' +  
            colorTitle"
        >{{ title }}</div>&nbsp; -->

        <!-- content status -->
        <div class="toast-container-content">{{ content }}</div>

        <!-- hoàn tác -->
        <!-- <div class="toast-container-return">Hoàn tác</div> -->

        <!-- hủy -->
        <!-- <div 
            class="toast-container-cancel"
            @click="hideToast"
        ></div> -->

    </div>

</template>

<script>
export default {
    props: {
        status: String,
        content: String,
    },
    created() {
        
        // xác định trạng thái toast dựa vào props status
        // Created by: NDCHIEN(2/3/2023)
        if(this.status == "success") {
            this.title = "Thành công!";
            this.toastIcon = "toast-container-icon-success";
            this.colorTitle = "toast-container-title-success";
        }
        if(this.status == "error") {
            this.title = "Lỗi!";
            this.toastIcon = "toast-container-icon-error";
            this.colorTitle = "toast-container-title-error";
        }
        if(this.status == "warning") {
            this.title = "Cảnh báo!";
            this.toastIcon = "toast-container-icon-warning";
            this.colorTitle = "toast-container-title-warning";
        }

        // trạng thái information hiện tại đang không có icon
        if(this.status == "information") {
            this.title = "Thông tin!";
        }

        // component ẩn sau 5s
        setTimeout(() => {this.isShow = false, this.$emit('hideToast')}, 5000);

    },
    methods: {

        /**
         * Hàm ẩn toast bằng nút x
         * Created by: NDCHIEN(2/3/2023)
         */
        hideToast() {
            this.$emit("hideToast");
        }

    },
    data() {
        return {

            // biến dùng để lưu title trạng thái
            title: String,

            // biến dùng để lưu nội dung toast
            toastContent: this.content,

            // biến dùng để lưu icon
            toastIcon: String,

            // biến dùng để lưu màu của title
            colorTitle: String,

            // biến dùng để lưu trạng thái ẩn hiện của component
            isShow: true,

        }
    }
}
</script>

<style scoped>
@import url(./toast.css);
</style>