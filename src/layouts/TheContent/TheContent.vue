<template>
    <div class="content-container">
        
        <!-- Thanh công cụ -->
        <div class="function-bar">

            <!-- ô tìm kiếm tài sản -->
            <div class="search-input">
                <MInputWithIcon
                    :placeholder="filter.asset"
                    v-model="assetCodeOrName"
                    @keyup.enter="() => {assetSearch = assetCodeOrName}"
                >
                    <div class="search-icon-input"></div>
                </MInputWithIcon>
            </div>

            <!-- ô filter theo loại tài sản -->
            <div class="filter-product">
                <MComboboxWithIcon
                    :placeholder="filter.assetCategory"
                    :api="api.AssetCategoryGetAll"
                    entity="asset_category_name"
                    @emit="assetFilter($event, 'asset_category_id', 'assetCategorySearch')"
                >
                    <div class="filter-icon-combobox"></div>
                </MComboboxWithIcon>
            </div>

            <!-- ô filter theo bộ phận sử dụng -->
            <div class="filter-product">
                <MComboboxWithIcon
                    :placeholder="filter.department"
                    :api="api.DepartmentGetAll"
                    entity="department_name"
                    @emit="assetFilter($event, 'department_id', 'departmentSearch')"
                >
                    <div class="filter-icon-combobox"></div>
                </MComboboxWithIcon>
            </div>

            <!-- phần khoảng cách bỏ trống -->
            <div class="blank-content"></div>

            <!-- nút thêm tài sản -->
            <div 
                class="inline-block"
                     
            >
                <MButton
                    :text="button.add"
                    type="button-container"   
                    @click="handleForm"        
                ></MButton>
            </div>
            

            <!-- nút excel -->
            <div class="inline-block excel-button">
                <a :href="`https://localhost:7210/api/Assets/Export?txtSearch=${assetCodeOrName}&DepartmentId=${departmentSearch}&AssetCategoryId=${assetCategorySearch}`">
                    <MIconButton
                        :tooltipText="tooltip.excel"
                    >
                        <div class="excel-icon-button" ></div>
                    </MIconButton>
                </a>
            </div>    

            <!-- nút xóa -->
            <div 
                class="inline-block delete-button" 
            >               
                <MIconButton
                    :tooltipText="tooltip.delete"
                    @click="() => {
                        this.isShowPopup = true;
                    }"
                >
                    <div class="delete-icon-button"></div>
                </MIconButton>
            </div>

        </div>

        <!-- data table -->
        <div class="data-table-content">
            <MTable
                :api="api.FilterAndPaging" 
                :apiTotal="api.TotalResult"
                model="product"
                @emitData="getDataFromTable"
                @NumberOfRecords="NumberOfRecords"
                :filter="assetSearch"
                :filterDepartment="departmentSearch"
                :filterAssetCategory="assetCategorySearch"
                entity="asset_id"
                @showEditSuccessToast="showEditSuccessToast(toast.success)"
                @listAssetForDelete="emitDeleteAsset"
                :tableChange="this.tableChange"
                :numOfActivePage="activePage"
                :activeChange="activeChange"
                @cancelLoading="() => {this.$emit('cancelLoading')}"
                @startLoading="() => {this.$emit('startLoading')}"
                :key="key"
                :tableTh="tableInfo"
                :footer="'oldFooter'"
                typeTable="table-container"
                :allowFunctionCol="true"
                :allowCheckBox = "true"
                @listRowForEmit="validateActive"
                :dataAvailable="[]"
            ></MTable>
        </div>
        
        <!-- form thêm tài sản -->
        <MProductDetail
            v-if="isHide"
            @closeForm = handleForm
            @returnActiveIndex = "returnActiveIndex"
            :title="form.add"
            :data="this.dataFromTable"
            :dataForEdit="null"
            typeForm="add"
            @addSuccess="handleAfterAddSuccess"
        ></MProductDetail>

        <!-- toast message -->
        <MToast
            status="success"
            :content="this.toastMessage"
            @hideToast="hideToast"
            v-if="isShowToats"
        ></MToast>

        <!-- popup xóa tài sản khi có tài sản được chọn-->
        <MPopup
            content=""
            @exitPopup="exitPopup"
            v-if="isShowPopup"
            type="warning"
            typeButton="deleteOption"
            @deleteAction="deleteAsset"
            :isEmpty="listAssetForDelete == 0 ? true : false"
        >
            <span v-if="this.listAssetForDelete.length > 1 ? true : false">
                <span style="font-family: Roboto Bold;">{{ this.listAssetForDelete.length < 10 ? "0" + this.listAssetForDelete.length : this.listAssetForDelete.length }}</span> {{ popup.deleteMore }}
            </span>
            <span v-if="this.listAssetForDelete.length == 1 ? true : false">
                {{ popup.deleteOne }} <span style="font-family: Roboto Bold;">&lt;&lt;{{ this.assetForDeleteOne[0].asset_code }} - {{ this.assetForDeleteOne[0].asset_name }}>></span> ? 
            </span>
            <span v-if="this.listAssetForDelete.length == 0 ? true : false">
                {{ popup.deleteZero }}
            </span>
        </MPopup>

        <MPopup
            content=""
            v-if="isShowPopupDeleteError"
            type="warning"
            typeButton="closeOption"
            @exitPopup="() => {isShowPopupDeleteError = false, isShowPopup = false}"
        >
        <span v-if="listActive > 1 && listActive == listAssetForDelete.length">
            <span style="font-family: Roboto Bold;">{{msgPopupDeleteErrorNumber < 10 ? `0${msgPopupDeleteErrorNumber}` : `${msgPopupDeleteErrorNumber}`}}</span> {{msgPopupDeleteErrorText}}
        </span>
        <span v-if="listActive > 0 && listActive < listAssetForDelete.length">
            <span style="font-family: Roboto Bold;">{{msgPopupDeleteErrorNumber < 10 ? `0${msgPopupDeleteErrorNumber}` : `${msgPopupDeleteErrorNumber}`}}</span> {{msgPopupDeleteErrorText}}
        </span>
        <span v-if="listActive == 1 && listAssetForDelete.length == 1">
            Tài sản có mã <span style="font-family: Roboto Bold;">{{assetCodeForDeleteOnceError}}</span> đã phát sinh chứng từ ghi tăng có mã <span style="font-family: Roboto Bold;">{{voucherCodeForDeleteOnceError}}</span>
        </span>
        </MPopup>
        
    </div>

    
</template>

<script>
import MInputWithIcon from '@/components/MInput/MInputWithIcon.vue';
import MComboboxWithIcon from '@/components/MInput/MComboboxWithIcon.vue';
import MButton from '@/components/MButton/MButton.vue';
import MIconButton from '@/components/MButton/MIconButton.vue';
import MTable from '@/components/MTable/MTable.vue';
import MProductDetail from '@/pages/productDetail/MProductDetail.vue';
import MToast from '@/components/MToast/MToast.vue';
import MPopup from '@/components/MPopup/MPopup.vue';
import resource from '@/js/resource';
import axios from 'axios';

export default {
    name: "TheContent",
    components: {
        MInputWithIcon, MComboboxWithIcon, MButton, MIconButton,MTable ,MProductDetail, MToast, MPopup
    },
    methods: {
        /**
         * Hàm thực hiện kiểm tra phát sinh chứng từ phía front end sau khi bấm nút xóa trước khi bật popup xóa
         * Created by: NDCHIEN(9/5/2023)
         */
        deleteAssetAction() {
            if(this.listActive > 0){
                this.msgPopupDeleteErrorNumber = this.listAssetForDelete.length;
                this.msgPopupDeleteErrorText = "tài sản được chọn không thể xóa. Vui lòng kiểm tra lại tài sản trước khi thực hiện xóa";
                this.isShowPopupDeleteError = true;
                return;
            }
            else {
                this.isShowPopup = true;
            }            
        },
        /**
         * Hàm kiểm tra có bao nhiêu tài sản phát sinh chứng từ 
         * Created by: NDCHIEN(9/5/2023)
         */
        validateActive(data) {
            this.listActive = data.filter(item => item.active == 1 || item.active == "Đã sử dụng").length;
            if(data.length == 1) {
                this.voucherCodeForDeleteOnceError = data.filter(item => item.active == 1 || item.active == "Đã sử dụng").map(item => item.voucher_code)[0];
                this.assetCodeForDeleteOnceError = data.filter(item => item.active == 1 || item.active == "Đã sử dụng").map(item => item.asset_code)[0];
            }
            else {
                this.assetCodeForDeleteOnceError = "";
                this.voucherCodeForDeleteOnceError = "";
            }
        },

        returnActiveIndex() {
            this.activePage = 2;
            this.activeChange = !this.activeChange;
            this.addKey();
        },

        addKey() {
            return this.key ++;
        },

        /**
         * Hàm dùng để xử lý sau khi thêm mới tài sản thành công
         * Created by: NDCHIEN(9/3/2023)
         */
        handleAfterAddSuccess() {
            this.isHide = false;
            this.isShowToats = true;
            this.toastMessage = 'Lưu dữ liệu thành công';
            this.tableChange = !this.tableChange;
            this.activeChange = !this.activeChange;
        },


        /**
         * Hàm dùng để lấy dữ liệu được emit từ table phục vụ xóa bản ghi
         */
        emitDeleteAsset(listAssetForDelete) {
            this.listAssetForDelete = listAssetForDelete;
        },

        /**
         * Hàm dùng để xóa tài sản
         */
        deleteAsset() {
            if(this.listAssetForDelete.length > 0) {
                this.deleteAssetAction();
                this.$emit('startLoading');
                    axios.delete("https://localhost:7210/api/Assets", {
                        data: Object.values(this.listAssetForDelete)
                    })
                    .then(res => {
                        (console.log(res.data)),
                        // thay đổi biến tableChange để tác động vào table
                        (this.tableChange = !this.tableChange),
                        // ẩn popup
                        (this.isShowPopup = false),
                        // hiện toast
                        (this.showEditSuccessToast('Xóa tài sản thành công')),
                        (this.listAssetForDelete.length = 0),
                        (this.$emit('cancelLoading'))
                    })
                    .catch(res => {
                        this.msgPopupDeleteError = res.response.data;
                        this.isShowPopupDeleteError = true;
                        this.$emit('cancelLoading');
                    })
            }
        },

        /**
         * Hàm đóng mở form
         * Created by: NDCHIEN(2/3/2023)
         */
        handleForm() {
            this.isHide = !this.isHide;    
        },

        /**
         * Hàm đóng toast
         * Created by: NDCHIEN(2/3/2023)
         */
        hideToast() {
            this.isShowToats = false;
        },

        /**
         * Hàm đóng popup
         * Created by: NDCHIEN(2/3/2023)
         */
        exitPopup() {
            this.isShowPopup = false;
        },
        
        /**
         * Hàm lấy data từ table
         * @param {*} data 
         * Created by: NDCHIEN(2/3/2023)
         */
        getDataFromTable(data) {
            this.dataFromTable = data;
        },

        NumberOfRecords(value) {
            this.numberOfRecords = value;
            console.log(this.numberOfRecords)
        },

        /**
         * Hàm lọc dữ liệu theo phòng ban hoặc loại tài sản
         * @param {} value 
         */
        assetFilter(value, entity, entitySearch) {
            if(value == '') {
                this[entitySearch] = '';
                return;
            }
            this[entitySearch] = value[entity];
        },

        /**
         * Hàm hiển thị toast khi lưu dữ liệu thành công
         */
        showEditSuccessToast(toastMessage) {
            this.isShowToats = true;
            this.toastMessage = toastMessage;
        }
        
    },

    watch: {
        listAssetForDelete: function(newValue) {
            if(newValue.length == 1) {
                axios.get("https://localhost:7210/api/Assets/" + newValue[0])
                .then(res => {this.assetForDeleteOne = res.data});
            }
        },
        /**
         * Convert res msg sau khi xóa tài sản phát sinh chứng từ
         * Created by: NDCHIEN(9/5/2023)
         */
        msgPopupDeleteError: function(newValue) {
            var number = newValue.charAt(0);
            var text = newValue.slice(1);
            this.msgPopupDeleteErrorNumber = number;
            this.msgPopupDeleteErrorText = text;
        }
    },

    data() {
        return {
            tableInfo: resource.tableInfo,

            isHide: false,

            // biến lưu trạng thái ẩn hiện của toast
            isShowToats: false,

            // biến lưu trạng thái ẩn hiện của popup
            isShowPopup: false,

            // biến lưu data được emit từ table
            dataFromTable: [],

            // biến lưu api 
            api: {
                DepartmentGetAll: resource.API.DepartmentGetAll,
                AssetCategoryGetAll: resource.API.AssetCategoryGetAll,
                FilterAndPaging: resource.API.FilterAndPaging,
                TotalResult: resource.API.TotalResult,
                assetExport: resource.API.assetExport
            },

            filter: resource.filter,
            button: resource.button,
            tooltip: resource.tooltip,
            toast: resource.toast,
            form: resource.form,
            popup: resource.popup,

            // biến hứng dữ liệu search tài sản
            assetSearch: "",
            // biến hứng dữ liệu search phòng ban
            departmentSearch: "",
            // biến hứng dữ liệu search loại tài sản
            assetCategorySearch: "",
            // mảng hứng id tài sản phục vụ chức năng xóa
            listAssetForDelete: [],        
            // biến lưu message của toast
            toastMessage: "",
            // biến dùng để tác động vào table thông qua watch của table dùng để reset dữ liệu sau khi xóa
            tableChange: true,
            // biến hứng dữ liệu binding từ input search
            assetCodeOrName: "",

            // biến lưu tài sản phục vụ hiển thị tên-mã tài sản để xóa một
            assetForDeleteOne: [],

            // biến làm cho trang quay về trang 1 
            activePage: 1,

            key: 0,

            // biến dùng để hứng watch bên table
            activeChange: true,

            // biến ẩn hiện popup xóa phát sinh chứng từ
            isShowPopupDeleteError: false,
            // biến lưu msg xóa phát sinh chứng từ
            msgPopupDeleteError: "",
            msgPopupDeleteErrorNumber: "",
            msgPopupDeleteErrorText: "",
            // biến lưu số tài sản phát sinh chứng từ
            listActive: 0,
            // biến lưu mã chứng từ nếu chỉ xóa 1 tài sản có phát sinh chứng từ
            voucherCodeForDeleteOnceError: "",
            assetCodeForDeleteOnceError: ""
        }
    }
}
</script>

<style scoped>
@import url(./content.css);
</style>