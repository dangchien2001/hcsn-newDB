<template>
    <div class="account-manage-header">
        <div class="account-manage-header-title">Hệ thống tài khoản</div>
        <a class="account-manage-header-out"><span v-html="'<'"></span> Tất cả danh mục</a>
    </div>
    <div class="account-manage-body">
        <div class="account-manage-body-header">
            <div class="blank"></div>
            <div class="account-manage-add-button" @click="addAccount">Thêm</div>
        </div>
        <div class="account-manage-body-body">
            <TableTree
                @accountIdSelectedForAdd="handleIdSelectedForAdd"
                ref="table"
            ></TableTree>
        </div>
    </div>
    <TheForm 
        @exitForm="handleExitForm" 
        @idParentForReload="handleReload"
        v-if="isShowForm" 
        :idForAdd="idForSelected"
    ></TheForm>
</template>

<script>
import TableTree from './TableTree.vue'
import TheForm from './TheForm.vue'

export default {
    components: {
        TableTree, TheForm
    },
    mounted() {
        this.$emit('cancelLoading');
    },
    methods: {
        /**
         * Hàm đóng form
         * Created by: NDCHIEN(25/5/2023)
         */
        handleExitForm() {
            this.isShowForm = false;
        },
        /**
         * Hàm mở form add tài khoản
         * Created by: NDCHIEN(25/5/2023)
         */
        addAccount() {
            this.isShowForm = true;
        },
        /**
         * Hàm chuyển id từ table sang form để add
         * Created by: NDCHIEN(25/5/2023)
         * @param {*} id 
         */
        handleIdSelectedForAdd(id) {
            this.idForSelected = id;
        },
        /**
         * Hàm dùng để gọi các phần tử con dựa trên id cha và add vào vị trí tương ứng trong table (hàm này được thực hiện trong component table)
         * Created by: NDCHIEN(25/5/2023)
         */
        handleReload(idParent) {
            this.$refs.table.handleAccountId(idParent);
        }
    },
    data() {
        return {
            isShowForm: false,
            idForSelected: '',
        }
    }
}
</script>

<style scoped>
@import url(./tableTree.css);
</style>