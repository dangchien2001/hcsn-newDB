<template>
    <splitpanes class="form-account-container">
        <pane size="50"></pane>
        <pane size="50" class="form-account">
            <div class="block-1-form-account">
                <div class="title-form-account">Thêm tài khoản</div>
                <div class="icon-block">
                    <div class="question-icon">
                        <div class="tooltip-help" v-move>Hỗ trợ</div>
                    </div>
                    <div class="exit-icon-form-account" @click="handleExit">
                        <div class="tooltip-exit" v-move>Thoát</div>
                    </div>                   
                </div>
                <div class="row-1-form-account">
                    <div class="block-form-account">
                        <div class="lable-form-account">Số tài khoản<span style="color:red">*</span></div>
                        <input type="text" class="input-form-account" v-model="accountCode">
                    </div>
                    <div class="blank-form-account"></div>
                    <div class="block-form-account"></div>
                    <div class="blank-form-account"></div>
                    <div class="block-form-account"></div>
                    <div class="blank-form-account"></div>
                    <div class="block-form-account"></div>
                </div>
                <div class="row-1-form-account">
                    <div class="block-form-account-2">
                        <div class="lable-form-account">Tên tài khoản<span style="color:red">*</span></div>
                        <input type="text" class="input-form-account" v-model="accountName">
                    </div>
                    <div class="blank-form-account"></div>
                    <div class="block-form-account-2">
                        <div class="lable-form-account">Tên Tiếng Anh</div>
                        <input type="text" class="input-form-account" v-model="accountNameEN">
                    </div>
                </div>
                <div class="row-1-form-account">
                    <div class="block-form-account">
                        <div class="lable-form-account">Tài khoản tổng hợp</div>
                        <input type="text" class="input-form-account" v-model="accountParentCode">
                    </div>
                    <div class="blank-form-account"></div>
                    <div class="block-form-account">
                        <div class="lable-form-account">Tính chất<span style="color:red">*</span></div>
                        <input type="text" class="input-form-account" v-model="property">
                    </div>
                    <div class="blank-form-account"></div>
                    <div class="block-form-account"></div>
                    <div class="blank-form-account"></div>
                    <div class="block-form-account"></div>
                </div>
                <div class="row-1-form-account">
                    <div class="block-form-account-3">
                        <div class="lable-form-account">Diễn giải</div>
                        <textarea type="field" class="input-form-account-3" v-model="explain"></textarea>
                    </div>                    
                </div>
            </div>
            <div class="block-2-form-account">
                <button class="cancel-btn">Hủy</button>
                <div class="blank"></div>
                <button class="cancel-btn" @click="handleAdd">Cất</button>
                <button class="cancel-add">Cất và thêm</button>
            </div>
        </pane>
    </splitpanes >
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import axios from 'axios';

export default {
    props: {
        idForAdd: String,
    },
    components: { Splitpanes, Pane },
    created() {
        this.getAccountCode();
    },
    methods: {
        /**
         * Hàm đóng form
         * Created by: NDCHIEN(25/5/2023)
         */
        handleExit() {
            this.$emit('exitForm');
        },
        /**
         * Hàm gọi API lấy code
         * Created by: NDCHIEN(25/5/2023)
         */
        getAccountCode() {
            axios
            .get(`https://localhost:7210/api/AccountSystems/${this.idForAdd}`)
            .then(res => this.accountParentCode = res.data[0].AccountCode);
        },
        /**
         * Hàm thêm tài khoản và xử lý sau khi thêm tài khoản
         * Created by: NDCHIEN(25/5/2023)
         */
        handleAdd() {
            axios
            .post(`https://localhost:7210/api/AccountSystems`,
                {
                    AccountId: '00000000-0000-0000-0000-000000000000',
                    AccountCode: this.accountCode,
                    AccountName: this.accountName,
                    Property: this.property,
                    AccountNameEN: this.accountNameEN,
                    Explain: this.explain,
                    State: '',
                    AccountParentId: this.idForAdd,
                    HaveChild: 0,
                }
            )
            .then(() => {
                this.handleExit();
                this.$emit('idParentForReload', this.idForAdd);
            })
        }
    },
    data() {
        return {
            accountCode: '',
            accountName: '',
            accountNameEN: '',
            property: '',
            explain: '',
            accountParentCode: '',
        }
    }
}
</script>

<style scoped>
@import url(./form.css);
</style>