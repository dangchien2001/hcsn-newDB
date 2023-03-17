<template>
    <div class="header-container">

        <!-- title -->
        <div class="header-title">Danh sách tài sản</div>

        <!-- khoảng trống -->
        <div class="blank"></div>   

        <!-- Tên đơn vị -->
        <div class="name">Sở tài chính</div>

        <!-- Box chọn năm -->
        <div class="year-box">
            <div class="year-label">Năm</div>
            <div class="year">{{ currentYear }}</div>
            <div class="select-box">
                <div 
                    class="select-up" 
                    @click="changeYear('up')"
                ></div>
                <div class="blank"></div>
                <div 
                    class="select-down" 
                    @click="changeYear('down')"
                ></div>
            </div>
        </div>

        <!-- Danh sách các icon trên header -->
        <div class="noitification-icon"></div>
        <div class="menu-icon"></div>
        <div class="sp-icon"></div>
        <div class="user-icon"></div>
        <div class="header-dropdown"></div>
    </div>
</template>

<script>
export default {
    name: "TheHeader",
    methods: {

        /**
         * Hàm lấy năm hiện tại
         * created by: NDChien (10/02/2023)
         */
        getNow() {
            const today = new Date();
            const date = today.getFullYear();
            this.currentYear = date;
        },

        /**
         * Hàm thay đổi năm
         * @param {tăng hoặc giảm} type 
         * created by: NDChien (10/02/2023)
         */
        changeYear(type) {
            if(type == "up") {
                this.currentYear ++;
            }
            if(type == "down") {
                this.currentYear --;
            }
        }
    },
    created() {
        this.getNow();
    },
    data() {
        return {
            currentYear: "",
        }
    }
}
</script>

<style scoped>
@import url(./header.css);
</style>