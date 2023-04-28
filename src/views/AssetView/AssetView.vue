<template>
    <div class="content-container content-container-v2">
        <div class="asset-header">
            <div class="title-asset">Ghi tăng tài sản</div>
            <div class="header-asset-blank"></div>
            <MButton
                text="Thêm"
                type="button-container"
                style="min-width: 100px; justify-content: center; margin-right: 17px;"
                @click="() => {isShowForm = true; typeOfForm = 1}"
            ></MButton>
            <MIconButton
                :tooltipText="'abc'"
                class="icon-btn-asset"
                @click="() => {isShowDetailTable = !isShowDetailTable}"
            >
                <div class="icon-toggle-voucher-detail"></div>
            </MIconButton>
            <MIconButton
                :tooltipText="'abc'"
                class="icon-btn-asset"
            >
                <div class="icon-arrow-down-header"></div>
            </MIconButton>
        </div>

        <splitpanes  class="asset-table default-theme" horizontal>
            <Pane class="voucher-container" :size="[isZoom ? '0' : '50']">
                <div class="function-bar-asset">
                    <div class="search-asset">
                        <MInputWithIcon
                            :placeholder="'Tìm kiếm theo số chứng từ, nội dung'"
                            v-model="keyWord"
                            @keyup.enter="searchVoucher"
                        >
                            <div class="icon-search-asset"></div>
                        </MInputWithIcon>              
                    </div>

                    <div class="header-asset-blank"></div>

                    <MIconButton
                        :tooltipText="'abc'"
                        class="icon-btn-asset"
                        v-if="voucherCodeForDelete.length > 1 ? true : false"
                        @click="isShowPopUpDelete = true"
                    >
                        <div class="icon-voucher-delete"></div>
                    </MIconButton>

                    <MIconButton
                        :tooltipText="'abc'"
                        class="icon-btn-asset"
                    >
                        <div class="icon-asset-print"></div>
                    </MIconButton>

                    <MIconButton
                        :tooltipText="'abc'"
                        class="icon-btn-asset"
                    >
                        <div class="icon-asset-3-dot"></div>
                    </MIconButton>
                </div>

                <div class="voucher-table-container">
                    <MTable
                        :tableTh="voucherTh"
                        :footer="'newFooter'"
                        :arrayTotal="dataTotalVoucher"
                        @cancelLoading="() => {this.$emit('cancelLoading')}"
                        @startLoading="() => {this.$emit('startLoading')}"   
                        model="voucher"     
                        colspan="5"   
                        typeTable="table-container-non-border" 
                        :dataFooter="assetFooter"
                        :boldRow="true"
                        :allowEditAndDeleteCol="true"
                        :allowGetAll="false"
                        @objectAfterClickRow="(object) => {handleVoucherIdAfterClickRow(object)}"
                        :dataAvailable="dataVoucher"
                        :totalRecord="totalRecordVoucher"
                        :totalPageProp="totalPageVoucher"
                        :currentPageProp="currentPageVoucher"
                        @updateCurrentPage="(e) => {currentPageVoucher = e}"
                        numOfActivePage="1"
                        @updateNumberOfRecord="(e) => {pageSizeVoucher = e}"
                        :allowPaging="true"
                        :allowCheckBox = "true"
                        @edit="handleEdit"
                        entity="voucher_code"
                        @listAssetForDelete="(data) => voucherCodeForDelete = data"
                        @delete="data => {voucherCodeForDeleteOnce = data; isShowPopUpDeleteOnce = true}"
                        :tableChange2 = "tableChange2"
                    ></MTable>
                </div>
            </Pane>
            
            <Pane v-if="isShowDetailTable" :size="[isZoom ? '100' : '50']">
                <div class="voucher-detail-header">
                    <div class="voucher-detail-title">Thông tin chi tiết</div>
                    <div class="header-asset-blank"></div>
                    <div class="zoom-detail-container">
                        <div class="zoom-detail-icon" v-show="!isZoom" @click="() => {isZoom = !isZoom; size = 100}"></div>
                        <div class="tiny-detail-icon" v-show="isZoom" @click="() => {isZoom = !isZoom; size = 50}"></div>
                    </div>
                </div>

                <div class="voucher-detail-table-container">
                    <MTable
                        :tableTh="voucherDetailTh"
                        :footer="''"                       
                        @cancelLoading="() => {this.$emit('cancelLoading')}"
                        @startLoading="() => {this.$emit('startLoading')}"   
                        model="voucherDetail"     
                        colspan="5"   
                        typeTable="table-container-non-border" 
                        :dataFooter="assetFooter"
                        :boldRow="true"
                        :allowFunctionCol="false"                        
                        :dataAvailable="dataVoucherDetail"  
                        :allowCheckBox = "false"                 
                    ></MTable>
                </div>
            </Pane>
        </splitpanes >

        <MFormDetail 
            v-if="isShowForm"
            @exitForm="() => {isShowForm = false; dataForFormDetail.length = 0}"
            @openAssetList="() => {isShowListAsset = true}"
            :dataAvailable="dataForFormDetail"
            @closeForm="handleAfterInsertVoucher"
            @cancelLoading="() => {this.$emit('cancelLoading')}"
            @startLoading="() => {this.$emit('startLoading')}"
            @showPopupError="(res) => {this.$emit('showPopupError', res)}"
            @dataForListAssetNoActive="(dataForTable) => {dataForListAssetNoActive = dataForTable;}"
            @dataForCountAvailable="(data) => {dataForFormDetail = data}"
            @assetForNoActive="(data) => {assetForNoActive = data}"
            :typeOfForm="typeOfForm"
            :voucherCode="voucherCode"
        ></MFormDetail>

        <MListAssetNoActive 
            v-if="isShowListAsset"
            @exitListAsset="() => {isShowListAsset = false}"
            @cancelLoading="() => {this.$emit('cancelLoading')}"
            @startLoading="() => {this.$emit('startLoading')}"
            @assetForVoucher="handleDataForDetail"
            :dataAvailable="dataForListAssetNoActive"
            :assetForNoActive="assetForNoActive"        
            
        ></MListAssetNoActive>

        <MPopup
            content=""
            @exitPopup="isShowPopUpDelete = false"
            v-if="isShowPopUpDelete"
            type="warning"
            typeButton="deleteOption"
            @deleteAction="deleteMore"
        >
            <span style="font-family: Roboto Bold;">{{ this.voucherCodeForDelete.length < 10 ? "0" + this.voucherCodeForDelete.length : this.voucherCodeForDelete.length }} </span> chứng từ đã được chọn. Bạn có muốn xóa các chứng từ này khỏi danh sách?
        </MPopup>

        <MPopup
            content=""
            @exitPopup="isShowPopUpDeleteOnce = false"
            v-if="isShowPopUpDeleteOnce"
            type="warning"
            typeButton="deleteOption"
            @deleteAction="deleteOnce"
        >
            Bạn có muốn xóa chứng từ có mã <span style="font-family: Roboto Bold;">{{ voucherCodeForDeleteOnce }}</span>?
        </MPopup>

    </div>
</template>

<script>
import MButton from '@/components/MButton/MButton.vue'
import MIconButton from '@/components/MButton/MIconButton.vue'
import MInputWithIcon from '@/components/MInput/MInputWithIcon.vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import MTable from '@/components/MTable/MTable.vue';
import resource from '@/js/resource';
import MFormDetail from '../../pages/formDetail/MFormDetail.vue'
import MListAssetNoActive from '@/pages/listAssetNoActive/MListAssetNoActive.vue'
import MPopup from '@/components/MPopup/MPopup.vue'
import axios from 'axios'

export default {
    name: 'AssetView',
    components: {
        MButton, MIconButton, MInputWithIcon, Splitpanes, Pane, MTable, MFormDetail, MListAssetNoActive, MPopup
    },
    async created() {
        // gọi api phân trang bảng voucher đổ chứng từ vào table
        // Created by: NDCHIEN(19/4/2023)
        await this.voucherFilter(this.keyWord, this.pageSizeVoucher, this.currentPageVoucher);
        
        this.getVoucherDetail(this.dataVoucherFirst);
    },
    methods: {
        /**
         * Hàm xóa 1 chứng từ
         * Created by: NDCHIEN(28/4/2023)
         */
        deleteOnce() {
            const listVoucherCode = [];
            listVoucherCode.push(this.voucherCodeForDeleteOnce);
            this.deleteVoucher(listVoucherCode);
        },
        /**
         * Hàm xóa nhiều chứng từ
         * Created by: NDCHIEN(28/4/2023)
         */
        deleteMore() {
            this.deleteVoucher(this.voucherCodeForDelete);
        },
        
        /**
         * Hàm gọi API xóa chứng từ
         * Created by: NDCHIEN(28/4/2023)
         * @param {*} listVoucherCode 
         */
        deleteVoucher(listVoucherCode) {
            axios
            .delete("https://localhost:7210/api/Vouchers/List", {
                data: Object.values(listVoucherCode)
            })
            .then(() => {
                this.isShowPopUpDelete = false,
                this.isShowPopUpDeleteOnce = false,
                this.$emit('afterDeleteSuccess', 'Xóa chứng từ thành công !'),
                this.voucherFilter(this.keyWord, this.pageSizeVoucher, this.currentPageVoucher);
                this.tableChange2 = !this.tableChange2;
                this.voucherCodeForDelete = [];
            })
            .catch((res) => {
                console.log(res)
            })
        },
        /**
         * Xử lý dũ liệu được truyền vào bảng detail trong form thêm, sửa
         * Created by: NDCHIEN(27/4/2023)
         */
        handleDataForDetail(data) {
            if(this.dataForFormDetail.length > 0) {
                this.dataForFormDetail = this.dataForFormDetail.concat(data);               
            }
            else this.dataForFormDetail = data;

            
        },
        /**
         * Hàm thực hiện sau khi bấm icon sửa chứng từ
         * Created by: NDCHIEN(26/4/2023)
         * @param {*} voucher_code 
         */
        handleEdit(voucher_code) {
            this.typeOfForm = 2;
            this.voucherCode = voucher_code;
            this.isShowForm = true;
        },
        /**
         * Hàm xử lý sự kiện sau khi insert chứng từ
         * Created by: NDCHIEN(24/4/2023)
         */
        handleAfterInsertVoucher() {
            this.isShowForm = false;
            this.voucherFilter(this.keyWord, this.pageSizeVoucher, this.currentPageVoucher);    
            this.dataForFormDetail.length = 0;
            this.$emit('showToast');       
        },
        /**
         * Hàm tìm kiếm trong bảng voucher sau khi ấn enter
         * Created by: NDCHIEN(19/4/2023)
         */
        searchVoucher() {
            this.voucherFilter(this.keyWord, this.pageSizeVoucher, this.currentPageVoucher);
        },

        /**
         * Hàm lấy id của bảng voucher sau khi click phục vụ gọi api hiển thị bảng voucher detail
         * Created by: NDCHIEN(18/4/2023)
         */
        handleVoucherIdAfterClickRow(object) {
            this.idVoucher = object.voucher_id;
        },

        /**
         * Hàm gọi api phân trang bảng voucher
         * Created by: NDCHIEN(19/4/2023)
         */
        async voucherFilter(keyWord, pageSize, pageNumber) {
            this.$emit('startLoading');
            await axios       
            .get(`https://localhost:7210/api/Vouchers/filter?voucherFilter=${keyWord}&pageSize=${pageSize}&pageNumber=${pageNumber}`)
            .then(res => {
                this.dataVoucher = res.data.Data;
                this.dataTotalVoucher = res.data.MoreInfo;
                this.totalRecordVoucher = res.data.TotalRecord;
                this.totalPageVoucher = res.data.TotalPage;
                this.currentPageVoucher = res.data.CurrentPage;
                
                this.dataVoucherFirst = this.dataVoucher[0].voucher_id;

                this.$emit('cancelLoading');
            })
            .catch(res => {
                console.log(res);
            })
        },

        /**
         * lấy dữ liệu chi tiết của chứng từ
         * Created by: NDCHIEN(21/4/2023)
         */
        getVoucherDetail(voucherID) {
            this.$emit('startLoading');
            axios
            .get('https://localhost:7210/api/VoucherDetails/filter?voucherId=' + voucherID)
            .then(res => {
                this.dataVoucherDetail = res.data;
                this.$emit('cancelLoading');
            })
            .catch(res => {
                console.log(res);
            })
        },

        
    },
    watch: {
        // gọi api bảng voucher detail mỗi khi idVoucher thay đổi (sau khi click vào từng dòng trong bảng voucher)
        // Created by: NDCHIEN(19/4/2023)
        idVoucher: function(newValue) {
            this.getVoucherDetail(newValue);
        },

        /**
         * Gọi api sau khi biến currentPageVoucher thay đổi (sau khi bấm chuyển trang)
         * Created by: NDCHIEN(19/4/2023) 
         */
        currentPageVoucher: function(newValue) {
            this.voucherFilter(this.keyWord, this.pageSizeVoucher, newValue);
        },

        /**
         * Gọi api sau khi biến pageSizeVoucher thay dổi (sau khi bấm chọn pagesize, cho về trang 1)
         * Created by: NDCHIEN(19/4/2023)
         */
        pageSizeVoucher: function(newValue) {
            this.voucherFilter(this.keyWord, newValue, 1);
        },
        /**
         * Search tự động sau khi ô tìm kiếm trở về rỗng
         * Created by: NDCHIEN(20/4/2023)
         * @param {*} newValue 
         */
        keyWord: function(newValue) {
            if(newValue.length == 0) {
                this.voucherFilter(this.keyWord, newValue, 1);
            }
        }
    },
    data() {
        return {
            voucherTh: resource.voucherTh,
            voucherDetailTh: resource.voucherDetailTh,
            api: resource.API,
            assetFooter: resource.assetFooter,
            isShowDetailTable: true,
            isZoom: false,
            size: 50,

            // biến hứng từ khóa được search
            keyWord: '',

            // biến hứng id của bảng voucher sau khi click vào dòng
            idVoucher: '',

            isShowForm: false,
            isShowListAsset: false,

            // data được lấy từ bảng chứa tài sản chưa active
            dataForFormDetail: [],

            // data của bảng voucher sau kh gọi api phân trang
            dataVoucher: [],
            // data footer bảng voucher
            dataTotalVoucher: [],
            // tổng số bản ghi sau filter bảng voucher
            totalRecordVoucher: 0,
            // tổng số trang sau khi filter bảng voucher
            totalPageVoucher: 0,
            // trang hiện tại bảng voucher
            currentPageVoucher: 1,
            // số bản ghi trên 1 trang bảng voucher
            pageSizeVoucher: 20,
            // data của bảng voucher detail sau kh gọi api phân trang
            dataVoucherDetail: [],
            // biến lưu phần tử đầu tiên của mảng dataVoucher dùng để hiển thị chi tiết ngay khi load trang
            dataVoucherFirst: {},
            // biến lưu kiểu form
            typeOfForm: 0,
            // biến lưu mã chứng từ cho form
            voucherCode: "",
            test: 0,
            // mảng lưu giá trị được emit từ form chứng từ sang bảng tài sản chưa active
            dataForListAssetNoActive: [],
            // biến lưu mảng tài sản noActive
            assetForNoActive: [],
            // mảng lưu danh sách mã chứng từ để xóa nhiều
            voucherCodeForDelete: [],
            // biến lưu mã chứng từ để xóa 1
            voucherCodeForDeleteOnce: "",
            // biến lưu trạng thái popup xóa chứng từ
            isShowPopUpDelete: false,
            // biến lưu trạng thái popup xóa một chứng từ
            isShowPopUpDeleteOnce: false,
            // biến dùng để bỏ checkbox
            tableChange2: true,
        }
    }
}
</script>
<style scoped>
@import url(./asset.css);
</style>