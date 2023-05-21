<template>
    <div 
        class="content-container content-container-v2"
        v-insert="handleInsertByKeyBoard"
    >
        <div class="asset-header">
            <div class="title-asset">{{ assetView.title }}</div>
            <div class="header-asset-blank"></div>
            <div class="add-btn-voucher-container">
                <MButton
                    text="Thêm"
                    type="button-container"
                    style="min-width: 100px; justify-content: center; margin-right: 17px;"
                    @click="() => {isShowForm = true; typeOfForm = assetView.typeOfForm.addForm}"
                ></MButton>
                <MTooltip class="add-btn-voucher-tooltip" text="Ctrl + 1"></MTooltip>
            </div>
            
            <MIconButton
                class="icon-btn-asset"
                style="border-radius: 3px 0px 0px 3px;"
            >
                <div class="icon-toggle-voucher-detail" v-if="isShowDetailTable == true"></div>
                <div class="icon-toggle-voucher-detail-2" v-if="isShowDetailTable == false"></div>
            </MIconButton>
            <div 
                class="toggle-detail-table"                
            >
                <MIconButton
                    class="icon-btn-asset"
                    style="border-radius: 0px 3px 3px 0px;"
                    @click="() => {isShowSelectBox = !isShowSelectBox}"
                >
                    <div class="icon-arrow-down-header" v-if="!isShowSelectBox"></div>
                    <div class="icon-arrow-up-header" v-if="isShowSelectBox"></div>
                </MIconButton>
                <div class="select-toggle-detail" v-if="isShowSelectBox">
                    <div class="select-toggle-detail-row" @click="() => {isShowDetailTable = false; isShowSelectBox = false}">
                        <div class="open-detail-table"></div>
                        <span class="select-toggle-detail-text" >{{assetView.typeOfLayout.vertical}}</span>
                    </div>
                    <div class="select-toggle-detail-row" @click="() => {isShowDetailTable = true; isShowSelectBox = false}">
                        <div class="close-detail-table"></div>
                        <span class="select-toggle-detail-text" >{{assetView.typeOfLayout.horizontal}}</span>
                    </div>
                </div>
            </div>            
        </div>

        <splitpanes  class="asset-table default-theme" horizontal>
            <Pane class="voucher-container" :size="[isZoom ? '0' : '50']">
                <div class="function-bar-asset">
                    <div class="search-asset">
                        <MInputWithIcon
                            :placeholder="assetView.placeholderText"
                            v-model="keyWord"
                            @keyup.enter="searchVoucher"
                            :code="true"
                        >
                            <div class="icon-search-asset"></div>
                        </MInputWithIcon>              
                    </div>

                    <div class="header-asset-blank"></div>

                    <MIconButton
                        :tooltipText="assetView.tooltipText.delete"
                        class="icon-btn-asset"
                        v-if="voucherCodeForDelete.length > 1 ? true : false"
                        @click="isShowPopUpDelete = true"
                    >
                        <div class="icon-voucher-delete"></div>
                    </MIconButton>

                    <MIconButton
                        class="icon-btn-asset"
                    >
                        <div class="icon-asset-print"></div>
                    </MIconButton>

                    <MIconButton
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
                        @updateCurrentPage="updateCurrentPage"
                        numOfActivePage="1"
                        @updateNumberOfRecord="(e) => {pageSizeVoucher = e}"
                        :allowPaging="true"
                        :allowCheckBox = "true"
                        @edit="handleEdit"
                        entity="voucher_code"
                        @listAssetForDelete="(data) => voucherCodeForDelete = data"
                        @delete="data => {voucherCodeForDeleteOnce = data; isShowPopUpDeleteOnce = true}"
                        :tableChange2 = "tableChange2"
                        :activeRow="activeRow"
                    ></MTable>
                </div>
            </Pane>
            
            <Pane v-if="isShowDetailTable" :size="[isZoom ? '100' : '50']">
                <div class="voucher-detail-header">
                    <div class="voucher-detail-title">{{ assetView.subtitle }}</div>
                    <div class="header-asset-blank"></div>
                    <div class="zoom-detail-container">
                        <div class="zoom-detail-icon" v-show="!isZoom" @click="() => {isZoom = !isZoom; size = 100; textTooltipZoom = 'Thu nhỏ'}"></div>
                        <div class="tiny-detail-icon" v-show="isZoom" @click="() => {isZoom = !isZoom; size = 50; textTooltipZoom = 'Phóng to'}"></div>
                        <MTooltip :text="textTooltipZoom" class="zoom-tooltip"></MTooltip>
                    </div>
                </div>

                <div class="voucher-detail-table-container" v-if="!isLoading">
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

                <div class="voucher-detail-loading" v-if="isLoading">
                    <MLoadingTiny></MLoadingTiny>
                </div>
            </Pane>
        </splitpanes >

        <MFormDetail 
            v-if="isShowForm"
            @exitForm="() => {
                if(isShowListAsset == false) {
                    isShowForm = false; 
                    dataForFormDetail.length = 0;
                }              
            }"
            @exitFormWithChange="() => {
                isShowForm = false; 
                dataForFormDetail.length = 0;
                voucherFilter(this.keyWord, this.pageSizeVoucher, this.currentPageVoucher);
            }"
            @openAssetList="() => {isShowListAsset = true}"
            :dataAvailable="dataForFormDetail"
            @closeForm="handleAfterInsertVoucher"
            @cancelLoading="() => {this.$emit('cancelLoading')}"
            @startLoading="() => {this.$emit('startLoading')}"
            @showPopupError="handleContentPopupAfterInsertVoucher"
            @dataForListAssetNoActive="(dataForTable) => {dataForListAssetNoActive = dataForTable;}"
            @dataForCountAvailable="(data) => {dataForFormDetail = data}"
            @assetForNoActive="(data) => {assetForNoActive = data}"
            :typeOfForm="typeOfForm"
            :voucherCode="voucherCode"
            @editSuccess="editSuccess"
            v-save="() => {
                if(isShowListAsset == false && $refs.formDetail.isShowFormEditAsset == false) {
                    $refs.formDetail.handleSaveByKeyBoard();
                }                
            }"
            v-esc="() => {
                if(isShowListAsset == false && $refs.formDetail.isShowFormEditAsset == false) {
                    $refs.formDetail.cancelAfterFindChange();
                    this.$emit('cancelLoading');
                    allowEsc = false;
                }
            }"
            ref="formDetail"
        ></MFormDetail>

        <MListAssetNoActive 
            v-if="isShowListAsset"
            @exitListAsset="() => {isShowListAsset = false; $refs.formDetail.focusDefault();}"
            @cancelLoading="() => {this.$emit('cancelLoading')}"
            @startLoading="() => {this.$emit('startLoading')}"
            @assetForVoucher="handleDataForDetail"
            :dataAvailable="dataForListAssetNoActive"
            :assetForNoActive="assetForNoActive"        
            v-esc="() => {
                isShowListAsset = false;
                
                if(isShowForm == true) {
                    $refs.formDetail.focusDefault();
                }
                
            }"
            v-save="() => {
                $refs.listAssetNoActive.selectAssetForEmit();
            }"
            ref="listAssetNoActive"
        ></MListAssetNoActive>

        <MPopup
            content=""
            @exitPopup="isShowPopUpDelete = false"
            v-if="isShowPopUpDelete"
            type="warning"
            typeButton="deleteOption"
            @deleteAction="deleteMore"
        >
            <span style="font-family: Roboto Bold;">{{ this.voucherCodeForDelete.length < 10 ? "0" + this.voucherCodeForDelete.length : this.voucherCodeForDelete.length }} </span> {{assetView.popupText.deleteMoreText}}
        </MPopup>

        <MPopup
            content=""
            @exitPopup="isShowPopUpDeleteOnce = false"
            v-if="isShowPopUpDeleteOnce"
            type="warning"
            typeButton="deleteOption"
            @deleteAction="deleteOnce"
        >
            {{assetView.popupText.deleteOnce}} <span style="font-family: Roboto Bold;">{{ voucherCodeForDeleteOnce }}</span>?
        </MPopup>

        <MPopup
            type="warning"
            v-if="isShowPopUp"
            :content="contentPopup"
            typeButton="closeOption"
            @exitPopup="exitPopup"
            :title="titlePopUp"
            :listContent="listContentPopup"
            :forcus="true"
        ></MPopup>

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
import config from '@/js/config';
import MFormDetail from '../../pages/formDetail/MFormDetail.vue'
import MListAssetNoActive from '@/pages/listAssetNoActive/MListAssetNoActive.vue'
import MPopup from '@/components/MPopup/MPopup.vue'
import axios from 'axios'
import MLoadingTiny from '@/components/MLoading/MLoadingTiny.vue'
import MTooltip from '@/components/MTooltip/MTooltip.vue'

export default {
    name: 'AssetView',
    props: {
        
    },
    components: {
        MButton, MIconButton, MInputWithIcon, Splitpanes, Pane, MTable, MFormDetail, MListAssetNoActive, MPopup, MLoadingTiny, MTooltip
    },
    async created() {
        // gọi api phân trang bảng voucher đổ chứng từ vào table
        // Created by: NDCHIEN(19/4/2023)
        await this.voucherFilter(this.keyWord, this.pageSizeVoucher, this.currentPageVoucher);
        
        this.getVoucherDetail(this.dataVoucherFirst);
    },
    methods: {
        /**
         * Hàm xử lí nội dung popup sau khi thêm chứng từ
         * Created by: NDCHIEN(25/4/2023)
         * Modified by: NDCHIEN(26/4/2023)
         */
        handleContentPopupAfterInsertVoucher(res) {  
            this.contentPopup = res.UserMsg;
            if(res.MoreInfo != null) {
                this.titlePopUp = this.assetView.warning;
                this.listContentPopup = res.MoreInfo;
            }
            else {
                this.titlePopUp = "";
                this.listContentPopup = null;
            }
            this.isShowPopUp = true;
        },
        /**
         * Hàm gọi sau khi bấm đóng popup
         * Created by: NDCHIEN(10/5/2023)
         */
        exitPopup() {
            this.isShowPopUp = false;
            this.$refs.formDetail.focusDefault();
        },
        /**
         * Hàm mở form thêm mới bằng bàn phím
         * Created by: NDCHIEN(12/5/2023)
         */
        handleInsertByKeyBoard() {
            this.isShowForm = true; 
            this.typeOfForm = this.assetView.typeOfForm.addForm;
        },
        /**
         * Hàm xử lí sau khi chuyển trang
         * Created by: NDCHIEN(7/5/2023)
         */
        updateCurrentPage(currentPage) {
            this.currentPageVoucher = currentPage;
        },
        /**
         * Hàm chạy sau khi sửa tài sản thành công
         * Created by: NDCHIEN(6/5/2023)
         */
        async editSuccess(data) {
            this.$emit('showToast', this.assetView.emitText.editSuccess);
            await this.voucherFilter(this.keyWord, this.pageSizeVoucher, this.currentPageVoucher);
            this.getVoucherDetail(data);
            this.idVoucher = data;
        },
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
            .delete(this.voucherAPI.deleteVoucher, {
                data: Object.values(listVoucherCode)
            })
            .then(async () => {
                this.isShowPopUpDelete = false,
                this.isShowPopUpDeleteOnce = false,
                this.$emit('afterDeleteSuccess', this.assetView.emitText.deleteVoucherSuccess),
                await this.voucherFilter(this.keyWord, this.pageSizeVoucher, this.currentPageVoucher);
                this.getVoucherDetail(this.dataVoucherFirst);
                this.idVoucher = this.dataVoucherFirst;
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
            this.typeOfForm = this.assetView.typeOfForm.editForm;
            this.voucherCode = voucher_code;
            this.isShowForm = true;
        },
        /**
         * Hàm xử lý sự kiện sau khi insert chứng từ
         * Created by: NDCHIEN(24/4/2023)
         */
        async handleAfterInsertVoucher(msg) {
            this.isShowForm = false;
            await this.voucherFilter(this.keyWord, this.pageSizeVoucher, this.currentPageVoucher);    
            this.idVoucher = this.dataVoucherFirst;
            this.getVoucherDetail(this.dataVoucherFirst);
            this.dataForFormDetail.length = 0;
            this.$emit('showToast', msg); 
            this.activeRow = 0;      
        },
        /**
         * Hàm tìm kiếm trong bảng voucher sau khi ấn enter
         * Created by: NDCHIEN(19/4/2023)
         */
        async searchVoucher() {
            await this.voucherFilter(this.keyWord, this.pageSizeVoucher, this.currentPageVoucher);
            this.getVoucherDetail(this.dataVoucherFirst);
            this.idVoucher = this.dataVoucherFirst;
            this.activeRow = 0;
        },

        /**
         * Hàm lấy id của bảng voucher sau khi click phục vụ gọi api hiển thị bảng voucher detail
         * Created by: NDCHIEN(18/4/2023)
         */
        handleVoucherIdAfterClickRow(object) {
            this.idVoucher = object.voucher_id;
            if(object.row_index <= this.pageSizeVoucher) {
                this.activeRow = object.row_index - 1;
            }
            if(object.row_index > this.pageSizeVoucher) {
                this.activeRow = object.row_index - this.pageSizeVoucher*(this.currentPageVoucher - 1) - 1;
            }
        },

        /**
         * Hàm gọi api phân trang bảng voucher
         * Created by: NDCHIEN(19/4/2023)
         */
        async voucherFilter(keyWord, pageSize, pageNumber) {
            this.$emit('startLoading');
            await axios       
            .get(this.voucherAPI.filterVoucher(keyWord, pageSize, pageNumber))
            .then(res => {
                this.dataVoucher = res.data.Data;
                this.dataTotalVoucher = res.data.MoreInfo;
                this.totalRecordVoucher = res.data.TotalRecord;
                this.totalPageVoucher = res.data.TotalPage;
                this.currentPageVoucher = res.data.CurrentPage;
                
                if(this.dataVoucher.length > 0) {
                    this.dataVoucherFirst = this.dataVoucher[0].voucher_id;
                }

                this.$emit('cancelLoading');
                if(this.dataVoucher.length == 0) {
                    this.dataVoucherFirst = '';
                }
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
            this.isLoading = true;
            axios
            .get(this.voucherAPI.getVoucherDetail(voucherID))
            .then(res => {
                this.dataVoucherDetail = res.data;
                this.isLoading = false;
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
        currentPageVoucher: async function(newValue) {
            await this.voucherFilter(this.keyWord, this.pageSizeVoucher, newValue);
            this.getVoucherDetail(this.dataVoucherFirst);
            this.idVoucher = this.dataVoucherFirst;
            this.activeRow = 0;
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
        keyWord: async function(newValue) {
            if(newValue.length == 0) {
                await this.voucherFilter(newValue, this.pageSizeVoucher, 1);
                this.getVoucherDetail(this.dataVoucherFirst);
                this.idVoucher = this.dataVoucherFirst;
                this.activeRow = 0;
            }
        }
    },
    data() {
        return {
            voucherAPI: config.voucherAPI,
            voucherTh: resource.voucherTh,
            voucherDetailTh: resource.voucherDetailTh,
            assetView: resource.assetView,
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
            // biến dùng để lưu dòng active
            activeRow: 0,
            // biến lưu trạng thái ẩn hiện loading
            isLoading: false,
            // biến lưu trạng thái hộp ẩn hiện detail
            isShowSelectBox: false,
            // biến lưu nội dung tooltip zoom
            textTooltipZoom: "Phóng to",

            isShowPopUp: false,
            contentPopup: "",
            titlePopUp: "",
            listContentPopup: [],
            
        }
    }
}
</script>
<style scoped>
@import url(./asset.css);
</style>