<template>
    <div 
        class="combobox-container"
        @keyup.down="keyDown"
        @keyup.up="keyUp"
        @keyup.enter="enter"
    >

        <!-- label -->
        <div class="label-combobox">
            {{ label }}
            <span 
                style="color: red;font-size: 13px;"
                v-if="isImportant"
            >*</span>
        </div>

        <!-- input -->
        <input 
            type="text" 
            :class="[isEmpty ? 'error-combobox' : 'input-combobox']"
            :placeholder="placeholder"
            :value="modelValue"
            @input="filterItem"
            @blur="hideDropDown"
            :ref="refProp"
            :tabindex="tabindex"
            :maxlength="maxlength"
        >

        <!-- nút mở combobox -->
        <div 
            :class="label == undefined ? 'dropdown-icon-without-lable' : 'dropdown-icon'"
            @click="toogleComboboxList('open')"
            v-if="!isOpen"
        ></div>

        <!-- nút đóng combobox -->
        <div 
            :class="label == undefined ? 'dropup-icon-without-lable' : 'dropup-icon'"
            @click="toogleComboboxList('close')"
            v-if="isOpen"
        ></div>

        <!-- box chứa dữ liệu -->
        <div 
            :class="positionAbsolute ? 'combobox-list' : 'combobox-list-non-absolute'"
            v-if="isOpen"
            @mousedown="(event)=>{event.preventDefault()}"
        >
            <div 
                :class="['item-combobox', {'item-combobox-active' : index == this.index}]"
                @click="selectData(data[entity], data[entityEmit])"
                v-for="(data, index) in datas"
                :key="index"
            >
                <div class="icon-tick-v"></div>
                {{ data[entity] }}
            </div>          
        </div>

        <!-- warning -->
        <div 
            class="warning"
            v-if="isEmpty"
        >
            {{ msg }} {{ label }} 
        </div>

    </div>
</template>

<script>
import axios from "axios"

export default {
    props: {
        api: String,     
        label: String,   
        placeholder: String,
        entity: String,
        important: Boolean,
        alowNull: Boolean,
        modelValue: String,
        isEmpty: Boolean,
        entityEmit: String,
        dataAvailable: Array,
        positionAbsolute: Boolean,
        msg: String,
        code: Boolean,
        refProp: String,
        tabindex: Number,
        maxlength: Number,
    },
    watch: {
        /**
         * Forcus lại sau khi props code thay đổi
         * Created by: NDCHIEN(10/5/2023)
         */
        code: function(newValue) {
            if(newValue == true) {
                this.$refs.input.focus();
            }
        },

        /**
         * Hàm kiểm tra sự thay đổi của value để phục vụ validate, hàm chỉ được thực hiện khi props allowNull là false
         * @param {*} newValue 
         * Created by: NDCHIEN(2/3/2023)
         */
        dataSelected: function(newValue) {
            if(this.alowNull == false) {
                const result = this.checkInputIsError(newValue);
                this.$emit("result", result);
            }
        },    
        dataAvailable: function(newValue) {
            if(newValue != undefined) {
                this.datas = newValue,
                this.fullDatas = newValue,
                this.totalIndex = newValue.length,
                this.filterResult = newValue
            }
        }
    },
    methods: {

        /**
         * Hàm dùng để check lỗi bỏ trống
         * Trả về:
         * -    true: nếu value bị bỏ trống
         * -    false: nếu value không bị bỏ trống
         * @param {nội dung trong input} value 
         * created by: NDChiến (10/02/2023)
         */
        checkInputIsError(dataSelected) {
            if(dataSelected.length < 1) {
                return true;
            }
            else {
                return false;
            }
        },

        /**
         * Hàm dùng để đóng/mở combobox
         * nếu đầu vào là open => isOpen = true
         * nếu đầu vào là close => isOpen = false
         * @param {} action 
         * created by: NDChien (10/02/2023)
         */
        toogleComboboxList(action) {
            if(action == "open") {
                this.isOpen = true;      
                this.$refs[this.refProp].focus();         
            }
            if(action == "close") {
                this.isOpen = false;
                this.$refs[this.refProp].focus();
            }
        },

        /**
         * Hàm dùng để chọn data trong combobox list sau đó emit dữ liệu được chọn ra ngoài
         * @param {*} data 
         * created by: NDChien (10/02/2023)
         */
        selectData(data, dataEmit) {
            this.dataSelected = data;
            this.isOpen = false;
            this.$emit('update:modelValue', data);
            this.$emit("dataEmit", dataEmit);
        },

        /**
         * Hàm filter value mỗi khi người dùng nhập input
         * @param {*} value 
         * Created by: NDCHIEN(2/3/2023)
         */
        filterItem(value) {
            this.$emit('update:modelValue', event.target.value);
            this.isOpen = true;
            if(value.target.value.length > 0) {
                this.filterResult = this.fullDatas.filter((data) => data[this.entity].toLowerCase().includes(value.target.value.toLowerCase()));
                this.datas = this.filterResult;
                this.totalIndex = this.filterResult.length;
                this.index = 0;
            }
            if(value.target.value.length < 1) {
                this.datas = this.fullDatas;
                this.filterResult = this.fullDatas;
                this.totalIndex = this.fullDatas.length;
            }
            
        },

        /**
         * Các hàm thao tác bàn phím phục vụ thao tác combobox với 2 nút lên xuống và enter để chọn item trong combobox
         * Created by: NDCHIEN(2/3/2023)
         */

        keyDown() {
            if (this.index < this.totalIndex - 1) {
                this.isOpen = true;
                this.index++;
            }
            if(this.index == this.totalIndex - 1) {
                this.isOpen = true;
            }
        },

        keyUp() {
            if (this.index > 0) {
                this.isOpen = true;
                this.index--;
            }
            if (this.index <= 0) {
                this.isOpen = true;
            }
        },

        enter() {
            this.selectData(this.filterResult[this.index][this.entity], this.filterResult[this.index][this.entityEmit]);
        },

        /**
         * Hàm dùng để ẩn dropdown khi nhấn vào chỗ khác
         */
        hideDropDown() {
            this.isOpen = false;
            this.$emit("unForcus");
        }

    },
    created() {

        // gọi api được truyền vào từ props
            if(this.api != undefined) {
            axios
                .get(this.api)
                .then(res => {(this.datas = res.data), (this.fullDatas = res.data), (this.filterResult = res.data), (this.totalIndex = res.data.length)})
            }
            if(this.dataAvailable != undefined) {
                this.datas = this.dataAvailable;
                this.fullDatas = this.dataAvailable;
                this.totalIndex = this.dataAvailable.length;
                this.filterResult = this.dataAvailable;
            }
    },
    mounted() {
        if(this.code) {
            this.$refs.input.focus();
        }
    },
    data() {
        return {
            isOpen: false,
            dataSelected: "",
            datas: [] ,
            isError: !this.alowNull,

            // biến dùng để hiện dấu sao đỏ 
            isImportant: this.important,

            // mảng dùng để hứng dữ liệu filter
            filterResult: [],

            // mảng dùng để hứng full dữ liệu từ api (đây là biến ko đc thay đổi)
            fullDatas: [],

            // biến dùng để hứng item đang được chọn
            index: -1,

            // biến dùng để hứng số lượng item
            totalIndex: 0,
        }
    }
}
</script>

<style scoped>
@import url(./input.css);
</style>