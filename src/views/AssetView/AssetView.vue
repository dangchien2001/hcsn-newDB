<template>
    <div class="content-container content-container-v2">
        <div class="asset-header">
            <div class="title-asset">Ghi tăng tài sản</div>
            <div class="header-asset-blank"></div>
            <MButton
                text="Thêm"
                type="button-container"
                style="min-width: 100px; justify-content: center; margin-right: 17px;"
                @click="() => {isShowForm = true}"
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
                        :allowFunctionCol="true"
                        :allowGetAll="false"
                        @objectAfterClickRow="(object) => {handleVoucherIdAfterClickRow(object)}"
                        :dataAvailable="dataVoucher"
                        :totalRecord="totalRecordVoucher"
                        :totalPageProp="totalPageVoucher"
                        :currentPageProp="currentPageVoucher"
                        @updateCurrentPage="(e) => {currentPageVoucher = e}"
                        numOfActivePage="1"
                        @updateNumberOfRecord="(e) => {pageSizeVoucher = e}"
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
                    ></MTable>
                </div>
            </Pane>
        </splitpanes >

        <MFormDetail 
            v-if="isShowForm"
            @exitForm="() => {isShowForm = false; dataForFormDetail.length = 0}"
            @openAssetList="() => {isShowListAsset = true}"
            :dataAvailable="dataForFormDetail"
        ></MFormDetail>

        <MListAssetNoActive 
            v-if="isShowListAsset"
            @exitListAsset="() => {isShowListAsset = false}"
            @cancelLoading="() => {this.$emit('cancelLoading')}"
            @startLoading="() => {this.$emit('startLoading')}"
            @assetForVoucher="(e) => {dataForFormDetail = dataForFormDetail.concat(e)}"
            :dataAvailable="dataForFormDetail"
        ></MListAssetNoActive>

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
import axios from 'axios'

export default {
    name: 'AssetView',
    components: {
        MButton, MIconButton, MInputWithIcon, Splitpanes, Pane, MTable, MFormDetail, MListAssetNoActive
    },
    async created() {
        // gọi api phân trang bảng voucher đổ chứng từ vào table
        // Created by: NDCHIEN(19/4/2023)
        await this.voucherFilter(this.keyWord, this.pageSizeVoucher, this.currentPageVoucher);
        
        this.getVoucherDetail(this.dataVoucherFirst);
    },
    methods: {
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

            test: 0,
        }
    }
}
</script>
<style scoped>
@import url(./asset.css);
</style>