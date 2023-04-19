<template>
    <div class="layer-voucher-detail">
        <div class="form-voucher-detail">
            <div class="form-header-voucher-detail">
                <div class="form-title-voucher-detail">Thêm chứng từ ghi tăng</div>
                <div class="blank"></div>
                <div class="icon-exit" @click="() => {this.$emit('exitForm')}"></div>
            </div>
            <div class="form-body-voucher-detail">
                <div class="title-form-body-voucher-detail">Thông tin chứng từ</div>
                <div class="voucher-info">
                    <div class="voucher-info-row-1">                    
                        <div class="form-input-voucher-detail">
                            <MInput
                                fieldLabel="Mã chứng từ"
                                :important="true"
                            ></MInput>
                        </div>
                        <div class="form-input-voucher-detail">
                            <div class="text-input-voucher-detail">Ngày bắt đầu sử dụng <span class="important-input">*</span></div>
                            <MDatetime></MDatetime>
                        </div>
                        <div class="form-input-voucher-detail">
                            <div class="text-input-voucher-detail">Ngày ghi tăng <span class="important-input">*</span></div>
                            <MDatetime></MDatetime>
                        </div>
                    </div>

                    <div class="voucher-info-row-2">
                        <div class="note-input-voucher-detail">
                            <MInput
                                fieldLabel="Ghi chú"
                            ></MInput>
                        </div>
                    </div>
                </div>
                <div class="title-form-body-voucher-detail-2">Thông tin chi tiết</div>
                <div class="voucher-info-with-table-and-filter">
                    <div class="filter-input-voucher-detail-container">
                        <div class="filter-input-voucher-detail">
                            <MInputWithIcon
                                placeholder="Tìm kiếm theo mã, tên tài sản"
                            >
                                <div class="icon-search"></div>
                            </MInputWithIcon>
                        </div>
                        <div class="blank"></div>
                        <MButton
                            text="Chọn tài sản"
                            type="outline-button"
                            style="width: 130px"
                            @click="() => {this.$emit('openAssetList')}"
                        ></MButton>
                    </div>
                    <div class="table-voucher-detail">
                        <MTable
                            :tableTh="voucherDetailTh"
                            :footer="'newFooter'"
                            @cancelLoading="() => {this.$emit('cancelLoading')}"
                            @startLoading="() => {this.$emit('startLoading')}"   
                            model="voucherDetail"     
                            colspan="5"   
                            typeTable="table-container-non-border" 
                            :dataFooter="assetFooter"
                            :boldRow="true"
                            :allowFunctionCol="false"
                            :dataAvailable="dataForTest"
                        ></MTable>
                    </div>
                </div>
            </div>
            <div class="form-footer-voucher-detail">
                <div class="blank"></div>
                <MButton
                    text="Hủy bỏ"
                    type="outline-button"
                    @click="() => {this.$emit('exitForm')}"
                ></MButton>
                <MButton
                    text="Đồng ý"
                    type="button-container"
                    style="width: 100px; justify-content: center;margin-right: 17px;"
                ></MButton>
            </div>           
        </div>
    </div>
</template>

<script>
import MInput from '@/components/MInput/MInput.vue';
import MDatetime from '@/components/MDatetime/MDatetime.vue';
import MInputWithIcon from '@/components/MInput/MInputWithIcon.vue';
import MButton from '@/components/MButton/MButton.vue';
import MTable from '@/components/MTable/MTable.vue';
import resource from '@/js/resource';
export default {
    components: {
        MInput, MDatetime, MInputWithIcon, MButton, MTable
    },
    props: {
        dataAvailable: Array
    },
    watch: {
        /**
         * Lấy dữ liệu từ bảng chọn tài sản chưa active để hiển thị
         * Created by: NDCHIEN(19/4/2023)
         */
        dataAvailable: function(newValue) {
            this.dataForTest = newValue;
        }
    },
    data() {
        return {
            voucherTh: resource.voucherTh,
            voucherDetailTh: resource.voucherDetailTh,
            dataForTest: []
        }
    }
}
</script>

<style scoped>
@import url(./formDetail.css);
</style>