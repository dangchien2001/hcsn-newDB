<template>
    <div class="layer-voucher-detail">
        <div class="form-voucher-detail" v-show="!isShowFormEditAsset">
            <div class="form-header-voucher-detail">
                <div class="form-title-voucher-detail">{{ titleForm }}</div>
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
                                :isEmpty="isNullVoucherCode"                             
                            ></MInput>
                        </div>
                        <div class="form-input-voucher-detail">
                            <div class="text-input-voucher-detail">Ngày bắt đầu sử dụng <span class="important-input">*</span></div>
                            <MDatetime
                                v-model="voucher.voucher.voucher_date"
                                :key="componentKey"
                            ></MDatetime>
                        </div>
                        <div class="form-input-voucher-detail">
                            <div class="text-input-voucher-detail">Ngày ghi tăng <span class="important-input">*</span></div>
                            <MDatetime
                                v-model="voucher.voucher.increment_date"
                                :key="componentKey"
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
                                @keyup.enter="filterAsset"
                                v-model="keyWord"
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
                            :dataAvailable="dataForTable.map(formatAssetData)"
                            :allowEditAndDeleteCol="true"
                            @delete="deleteAssetFromFormDetail"
                            :allowPaging="false"
                            :arrayTotal="arrayTotal"
                            :allowCheckBox = "false"
                            @edit="isShowFormEditAsset = true"
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
                    @click="handleSubmit"
                ></MButton>
            </div>           
        </div>

        <MFormEditAsset
            v-if="isShowFormEditAsset"
        ></MFormEditAsset>
    </div>
</template>

<script>
import MInput from '@/components/MInput/MInput.vue';
import MDatetime from '@/components/MDatetime/MDatetime.vue';
import MInputWithIcon from '@/components/MInput/MInputWithIcon.vue';
import MButton from '@/components/MButton/MButton.vue';
import MTable from '@/components/MTable/MTable.vue';
import resource from '@/js/resource';
import MFormEditAsset from '../formEditAsset/MFormEditAsset.vue';

import axios from 'axios';
export default {
    components: {
        MInput, MDatetime, MInputWithIcon, MButton, MTable, MFormEditAsset
    },
    props: {
        dataAvailable: Array,
        // biến lưu loại form
        typeOfForm: Number,
        // biến lưu mã chứng từ
        voucherCode: String,

        
    },
    /**
     * Thay đổi form dựa theo props typeOfForm
     * Created by: NDCHIEN(26/4/2023)
     * Modified by: NDCHIEN(26/4/2023)
     */
    created() {        
        // gọi maxcode nếu là form thêm
        if(this.typeOfForm == 1) {
            this.titleForm = "Thêm chứng từ ghi tăng";
            this.getMaxCode();
        }
        // gọi api lấy chứng từ nếu là form sửa
        if(this.typeOfForm == 2) {
            this.titleForm = "Sửa chứng từ ghi tăng";
            this.selectVoucherByVoucherCode(this.voucherCode);
        }
    },
    /**
     * Làm rỗng mảng dữ liệu dùng để truyền cho danh sách tài sản chưa active sau khi hủy form
     * Created by: NDCHIEN(26/4/2023)
     */
    unmounted() {
        this.$emit("dataForListAssetNoActive", []);    
        this.$emit("assetForNoActive", []);   
    },
    methods: {
        /**
         * Hàm xử lý nút đồng ý dựa trên kiểu form
         * Created by: NDCHIEN(27/4/2023)
         */
        handleSubmit() {
            if(this.typeOfForm == 1) {
                this.insertVoucher();
            }
            if(this.typeOfForm == 2) {
                this.editVoucher();
            }
        },
        /**
         * Hàm sửa chứng từ
         * Created by: NDCHIEN(27/4/2023)
         * Modified by: NDCHIEN(28/4/2023)
         */
        editVoucher() {
            var validateResult = this.validate();
            if(validateResult) {            
                axios
                .put("https://localhost:7210/api/Vouchers/Detail/" + this.voucher.voucher.voucher_id, {
                    voucher: {
                        row_index: 0,
                        voucher_id: this.voucher.voucher.voucher_id,
                        voucher_code: this.voucher.voucher.voucher_code,
                        voucher_date: this.voucher.voucher.voucher_date,
                        increment_date: this.voucher.voucher.increment_date,
                        description: this.voucher.voucher.description,
                        price: this.voucher.voucher.price,
                        created_by: "",
                        created_date: "2023-04-28T01:43:40.564Z",
                        modified_by: "",
                        modified_date: "2023-04-28T01:43:40.564Z"
                    },
                    asset_code_active: this.voucher.assetIds,
                    asset_code_no_active: this.assetForNoActive.map(item => item.asset_id),
                    asset_ids: this.voucher.assetIds
                })
                .then(res => this.$emit('closeForm', res))
                .catch(res => this.$emit('showPopupError', res.response.data))
            }
        },
        /**
         * Hàm xóa tài sản ở table trong form thêm, sửa chứng từ
         * Created by: NDCHIEN(25/4/2023)
         * @param {*} asset_code 
         */
        deleteAssetFromFormDetail(asset_code) {
            // Hàm này loại bỏ đối tượng được xóa khỏi mảng dataForFormDetail(đây là mảng chứa tài sản bị loại khi gọi api tài sản chưa active)
            this.assetForNoActive = this.assetForNoActive.concat(this.dataForTable.filter(item => item.asset_code == asset_code));
            this.dataForTable = this.dataForTable.filter(item => item.asset_code !== asset_code);
            this.$emit("dataForListAssetNoActive", this.dataForTable);
            this.$emit('dataForCountAvailable', this.dataForTable);           
            this.totalValue(this.dataForTable);
        },
        /**
         * Hàm dùng để render datetime
         * Created by: NDCHIEN(26/4/2023)
         */
        forceRerender() {
            return ++this.componentKey;
        },
        /**
         * Hàm gọi API lấy dữ liệu theo mã chứng từ
         * Created by: NDCHIEN(26/4/2023)
         */
        selectVoucherByVoucherCode(voucher_code) {
            this.$emit('startLoading');
            axios
            .get('https://localhost:7210/api/Vouchers/Code?voucherCode=' + voucher_code)
            .then(res => { 
                this.voucher = {
                    assetIds: [],
                    voucher: {
                        row_index: 0,
                        voucher_id: res.data.voucher.voucher_id,
                        voucher_code: res.data.voucher.voucher_code,
                        voucher_date: res.data.voucher.voucher_date,
                        increment_date: res.data.voucher.increment_date,
                        description: res.data.voucher.description,
                        price: res.data.voucher.price,
                        created_by: res.data.voucher.created_by,
                        created_date: res.data.voucher.created_date,
                        modified_by: res.data.voucher.modified_by,
                        modified_date: res.data.voucher.modified_date
                    }
                };
                this.$emit('dataForCountAvailable', res.data.assets);
                this.totalValue(this.dataForTable);
                this.$emit('cancelLoading');
                this.forceRerender();
            })
            .catch(res => console.log(res))

        },
        /**
         * Hàm validate rồi thêm mới chứng từ
         * Created by: NDCHIEN(24/4/2023)
         * Modified by: NDCHIEN(25/4/2023)
         */
        insertVoucher() {
            var validateResult = this.validate();
            if(validateResult) {
                axios
                .post('https://localhost:7210/api/Vouchers/Detail', this.voucher)
                .then(res => this.$emit('closeForm', res))
                .catch(res => this.$emit('showPopupError', res.response.data))
            }
        },

        /**
         * Hàm gọi API lấy mã lớn nhất
         * Created by: NDCHIEN(24/4/2023)
         */
        getMaxCode() {
            this.$emit('startLoading');
            axios
            .get('https://localhost:7210/api/Vouchers/maxCode')
            .then(res => {this.voucher.voucher.voucher_code = res.data; this.$emit('cancelLoading');});
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
        },

        /**
         * Hàm filter tài sản
         * Created by: NDCHIEN(25/4/2023)
         */
        filterAsset() {
            this.$emit('startLoading');
            this.dataForTable = this.dataAvailable.filter(item => 
                item.asset_code.toLowerCase().includes(this.keyWord.toLowerCase()) || 
                item.asset_name.toLowerCase().includes(this.keyWord.toLowerCase())
            );
            this.$emit('cancelLoading');
        },

        /**
         * Hàm validate
         * Created by: NDCHIEN(25/4/2023)
         */
        validate() {
            // mã chứng từ không được để trống
            if(this.voucher.voucher.voucher_code.length < 1) {
                this.$emit('showPopupError', {UserMsg: "Mã chứng từ không được bỏ trống"});
                return false;
            }
            // phải chọn ít nhất 1 tài sản trong 1 chứng từ
            else if(this.voucher.assetIds.length < 1) {
                this.$emit('showPopupError', {UserMsg: "Chọn ít nhất 1 tài sản"});
                return false;
            }
            else return true;
        },

        /**
         * Hàm tính tổng các trường 
         * Created by: NDCHIEN(26/4/2023)
         */
        totalValue(listAsset) {
            var totalCost = 0;
            listAsset.forEach(item => totalCost += item.cost);
            var totalDepreciationValue = 0;
            listAsset.forEach(item => totalDepreciationValue += item.depreciation_value);
            var totalResidualValue = 0;
            listAsset.forEach(item => totalResidualValue += item.residual_value);
            this.arrayTotal = [totalCost, totalDepreciationValue, totalResidualValue];
        },
    },
    watch: {
        /**
         * Lấy dữ liệu mảng từ bảng chọn tài sản chưa active để tính tổng footer và format lại (chỉ lấy mảng chứa id)
         * Created by: NDCHIEN(19/4/2023)
         * Modified by: NDCHIEN(25/4/2023)
         */
        dataAvailable: function(newValue) {
            this.voucher.assetIds = newValue.map(item => item.asset_id);
            this.totalValue(newValue);
            if(newValue.length < 1) {
                this.dataForTable = this.dataForTable.concat(newValue);
            }
            else {
                this.dataForTable = newValue;
            }
            this.$emit("dataForListAssetNoActive", this.dataForTable);
            this.arrayForTableFixed = newValue;

            this.assetForNoActive = this.assetForNoActive.filter(item => {
                return !newValue.find((item2) => {
                    return item.asset_code === item2.asset_code;
                })
            })
        },

        /**
         * Tự động tính lại tổng sau khi chọn tài sản ở form sửa, gán giá trị mới cho biến arrayForTableFixed
         * Created by: NDCHIEN(26/4/2023)
         * Modified by: 
         * @param {*} newValue 
         */
        dataForTable: function(newValue) {
            this.totalValue(newValue);           
        },

        /**
         * Hiển thị tất cả tài sản sau khi xóa hết keyWord
         * Created by: NDCHIEN(25/4/2023)
         */
        keyWord: function(newValue) {
            if(newValue.length == 0) {
                this.filterAsset();
            }
        },

        /**
         * Hàm check trống mã chứng từ ở giao diện
         * Created by: NDCHIEN(26/4/2023)
         */
        voucher: {
            handler(newValue) {
                if(newValue.voucher.voucher_code.length < 1) {
                    this.isNullVoucherCode = true;
                }
                else {
                    this.isNullVoucherCode = false;
                }
            },
            deep: true
        },

        /**
         * Hàm xóa tài sản trùng khỏi mảng assetForNoActive
         * Created by: NDCHIEN(27/4/2023)
         */
        assetForNoActive: function(newValue) {
            const unique2 = newValue.filter((obj, index) => {
                return index === newValue.findIndex(o => obj.asset_id === o.asset_id && obj.asset_code === o.asset_code);
            });
            this.assetForNoActive = unique2;
            if(this.typeOfForm == 2) {
                this.$emit('assetForNoActive', this.assetForNoActive);  
            }         
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
            // mảng lưu data được truyền vào từ prop 
            dataForTable: [],
            // biến lưu từ khóa tìm kiếm
            keyWord: "",
            // biến lưu trạng thái trống mã chứng từ
            isNullVoucherCode: false,
            // biến lưu title form tương ứng với loại form
            titleForm: "",
            // biến phục vụ rende datetime
            componentKey: 1,
            // biến lưu mảng chứa các giá trị cho footer
            arrayTotal: [0, 0, 0],
            // biến lưu mảng cố định phục vụ chức năng phân trang
            arrayForTableFixed: [],
            // mảng chứa tài sản dùng để hủy active trong form sửa
            assetForNoActive: [],
            // biến lưu trạng thái form sửa tài sản
            isShowFormEditAsset: false,
        }
    }
}
</script>

<style scoped>
@import url(./formDetail.css);
</style>