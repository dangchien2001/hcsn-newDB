<template>
    <div class="content-container content-container-v2">
        <div class="asset-header">
            <div class="title-asset">Ghi tăng tài sản</div>
            <div class="header-asset-blank"></div>
            <MButton
                text="Thêm"
                type="button-container"
                style="min-width: 100px; justify-content: center; margin-right: 17px;"
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
                        :footer="true"
                        :api="api.voucherFilterAndPaging" 
                        @cancelLoading="() => {this.$emit('cancelLoading')}"
                        @startLoading="() => {this.$emit('startLoading')}"   
                        model="voucher"     
                        colspan="5"   
                        typeTable="table-container-non-border" 
                        :dataFooter="assetFooter"
                        :boldRow="true"
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
                        :tableTh="voucherTh"
                        :footer="true"
                        :api="api.voucherFilterAndPaging" 
                        @cancelLoading="() => {this.$emit('cancelLoading')}"
                        @startLoading="() => {this.$emit('startLoading')}"   
                        model="voucher"     
                        colspan="5"   
                        typeTable="table-container-non-border" 
                        :dataFooter="assetFooter"
                        :boldRow="true"
                    ></MTable>
                </div>
            </Pane>
        </splitpanes >
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

export default {
    name: 'AssetView',
    components: {
        MButton, MIconButton, MInputWithIcon, Splitpanes, Pane, MTable
    },
    created() {
        // gọi api đổ chứng từ vào table
        
    },
    data() {
        return {
            voucherTh: resource.voucherTh,
            api: resource.API,
            assetFooter: resource.assetFooter,
            isShowDetailTable: true,
            isZoom: false,
            size: 50
        }
    }
}
</script>
<style scoped>
@import url(./asset.css);
</style>