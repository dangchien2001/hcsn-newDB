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
                                v-model="voucher.voucher.voucher_code"
                            ></MInput>
                        </div>
                        <div class="form-input-voucher-detail">
                            <div class="text-input-voucher-detail">Ngày bắt đầu sử dụng <span class="important-input">*</span></div>
                            <MDatetime
                                v-model="voucher.voucher.voucher_date"
                            ></MDatetime>
                        </div>
                        <div class="form-input-voucher-detail">
                            <div class="text-input-voucher-detail">Ngày ghi tăng <span class="important-input">*</span></div>
                            <MDatetime
                                v-model="voucher.voucher.increment_date"
                            ></MDatetime>
                        </div>
                    </div>

                    <div class="voucher-info-row-2">
                        <div class="note-input-voucher-detail">
                            <MInput
                                fieldLabel="Ghi chú"
                                v-model="voucher.voucher.description"
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
                            :tableTh="voucherDetailThForm"
                            :footer="'newFooter'"
                            @cancelLoading="() => {this.$emit('cancelLoading')}"
                            @startLoading="() => {this.$emit('startLoading')}"   
                            model="voucherDetailForm"     
                            colspan="5"   
                            typeTable="table-container-non-border" 
                            :dataFooter="assetFooter"
                            :boldRow="true"
                            :allowFunctionCol="false"
                            :dataAvailable="dataAvailable.map(formatAssetData)"
                            :allowEditAndDeleteCol="true"
                            @delete="(asset_code) => {this.$emit('deleteAsset', asset_code)}"
                            :allowPaging="false"
                            :arrayTotal="test"
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
                    @click="insertVoucher"
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
import axios from 'axios';
export default {
    components: {
        MInput, MDatetime, MInputWithIcon, MButton, MTable
    },
    props: {
        dataAvailable: Array
    },
    created() {
        this.getMaxCode();
    },
    methods: {
        /**
         * Hàm thêm mới chứng từ
         * Created by: NDCHIEN(24/4/2023)
         */
        insertVoucher() {
            axios
            .post('https://localhost:7210/api/Vouchers/Detail', this.voucher)
            .then(res => this.$emit('closeForm', res))
            .catch(res => this.$emit('closeForm', res))
        },

        /**
         * Hàm gọi API lấy mã lớn nhất
         * Created by: NDCHIEN(24/4/2023)
         */
        getMaxCode() {
            axios
            .get('https://localhost:7210/api/Vouchers/maxCode')
            .then(res => this.voucher.voucher.voucher_code = res.data);
        },

        /**
         * Hàm format lại data được truyền vào bảng tài sản (format chỗ STT)
         * Created by: NDCHIEN(25/4/2023)
         */
        formatAssetData(asset, index) {
            var row_index = index + 1;
            return {
                row_index: row_index,
                asset_code: asset.asset_code,
                asset_name: asset.asset_name,
                department_name: asset.department_name,
                cost: asset.cost,
                depreciation_value: asset.depreciation_value,
                residual_value: asset.residual_value
            };
        }
    },
    watch: {
        /**
         * Lấy dữ liệu mảng từ bảng chọn tài sản chưa active để tính tổng footer và format lại (chỉ lấy mảng chứa id)
         * Created by: NDCHIEN(19/4/2023)
         * Modified by: NDCHIEN(25/4/2023)
         */
        dataAvailable: function(newValue) {
            this.voucher.assetIds = newValue.map(item => item.asset_id);
            var totalCost = 0;
            newValue.forEach(item => totalCost += item.cost);
            var totalDepreciationValue = 0;
            newValue.forEach(item => totalDepreciationValue += item.depreciation_value);
            var totalResidualValue = 0;
            newValue.forEach(item => totalResidualValue += item.residual_value);
            this.test = [totalCost, totalDepreciationValue, totalResidualValue];
        }
    },
    data() {
        return {
            voucherTh: resource.voucherTh,
            voucherDetailThForm: resource.voucherDetailThForm,
            // biến hứng data được truyền tù ngoài vào
            dataForTest: [],
            // đối tượng voucher phục vụ xóa, sửa
            voucher: {
                assetIds: [

                ],
                voucher: {
                    row_index: 0,
                    voucher_id: "00000000-0000-0000-0000-000000000000",
                    voucher_code: "",
                    voucher_date: "",
                    increment_date: "",
                    description: "",
                    price: 0,
                    created_by: "",
                    created_date: "2023-04-24T00:00:00",
                    modified_by: "",
                    modified_date: "2023-04-24T00:00:00"
                },
            },
            test: [0, 0, 0]
        }
    }
}
</script>

<style scoped>
@import url(./formDetail.css);
</style>