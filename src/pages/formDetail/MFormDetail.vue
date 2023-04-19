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
            <div class="form-footer-voucher-detail">
                
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
    data() {
        return {
            voucherTh: resource.voucherTh,
            voucherDetailTh: resource.voucherDetailTh,
            dataForTest: [
                {
                    row_index:1,
                    voucher_detail_id:"0d56760e-461f-449f-8fe0-a041cace3df2",
                    voucher_id:"153105e0-6702-29ed-7632-03c92da59c43",
                    asset_id:"4760d71f-6e2f-5b32-19cb-66948daf6128",
                    asset_code:"TS-66418",
                    asset_name:"IPhone 14",
                    department_name:"Phòng hành chính",
                    cost:40741890,
                    depreciation_value:6790328.5586,
                    residual_value:33951561.4414
                }
            ]
        }
    }
}
</script>

<style scoped>
@import url(./formDetail.css);
</style>