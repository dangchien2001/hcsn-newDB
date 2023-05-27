<template>
    <tr 
        v-show="isShow" 
        :class="['row-check', {'row-select' : accountIdSelected == account.accountId}]"
    >
        <td 
            v-for="(itemCol, index) in col"
            :key="index"
            :class="['body-row-check']"
            :style="[
                itemCol.style, 
                index == 0 ? `padding-left: calc(${number} * 10px)` : ``, 
                account.haveChild == 1 ? `font-family: Roboto Bold` : ``
            ]"
            @click="handleSelectRow(account.accountId)"
        >
            <div style="display: flex"> 
                <div style="display: flex" v-if="index == 0 && account.haveChild == 1">
                    <div class="more-button" v-if="!more" @click="handleClickMore(account.accountId, account.accountCode)"></div>
                    <div class="no-more-button" v-if="more" @click="handleClickMore(account.accountId, account.accountCode)"></div>
                </div>
                <div style="width: 28px;" v-if="index == 0 && account.haveChild == 0"></div>
                {{ account[itemCol.entityField] }}
            </div>
        </td>
    </tr>
    <RowTree
        v-for="(item) in account.listChildAccount"
        :key="item.accountId"
        :account="item"
        :col="col"
        :number="number + 1"     
        :isShow="isShowData"  
        :accountIdSelected = accountIdSelected
        @emitAccountId="(accountId, accountCode) => {$emit('emitAccountId', accountId, accountCode)}"
        @accountIdSelected="(accountId) => {$emit('accountIdSelected', accountId)}"
        @deleteAccountChild="(listAccount) => {$emit('deleteAccountChild', listAccount)}"
    ></RowTree>
</template>

<script>
export default {
    props: {
        account: Object,
        col: Array,
        number: Number,
        isShow: Boolean,
        accountIdSelected: String,
    },
    watch: {
        /**
         * Đóng tất cả các dòng con của dòng con sau khi đóng dòng cha
         * Created by: NDCHIEN(24/5/2023) 
         */
        isShow(newValue) {
            if(newValue == false) {
                this.isShowData = false;
                this.more = false;            
                // biến này tự dưng biến thành các object con
                // this.$emit('deleteAccountChild', this.account);
            }
        }
    },
    methods: {
        /**
         * Hàm xử lý sau khi click vào từng dòng trong bảng
         * Created by: NDCHIEN(25/5/2023)
         */
        handleSelectRow(accountId) {
            this.$emit('accountIdSelected', accountId);
        },
        /**
         * Hàm xử lý sau khi click vào nút mở rộng
         * Created by: NDCHIEN(24/5/2023)
         */
        handleClickMore(accountId, accountCode) {
            // thay đổi biểu tượng nút
            this.more = !this.more;
            // truyền id cha ra ngoài để gọi api lấy ra các con(chỉ thực hiện 1 lần)
            if(this.isFirst == true) {
                this.emitAccountId(accountId, 1, accountCode);
                this.isFirst = false;
            }            
            // ẩn hiện các dòng con
            this.isShowData = !this.isShowData;           
        },
        /**
         * Hàm emit id tài khoản ra ngoài
         * Created by: NDCHIEN(22/5/2023)
         */
        emitAccountId(accountId, type, accountCode) {
            // nếu chỉ là bấm more lần đầu
            if(type == 1) {
                this.$emit('emitAccountId', accountId, accountCode);
            }
            // sau khi bấm add
            if(type == 2) {
                this.$emit('emitAccountIdForAdd', accountId, accountCode);
            }
        }
    },
    data() {
        return {
            more: false,
            isShowData: false,
            isFirst: true,
        }
    }
}
</script>

<style scoped>
@import url(./tableTree.css);
</style>