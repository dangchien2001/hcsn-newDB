<template>
    <div class="input-container">
        <div class="label">
            {{ fieldLabel }}
            <span
                style="color:red; font-size: 13px;"
                v-if="isImportant"
            >*</span>
        </div>
        <input 
            type="text" 
            :class="[isEmpty ? 'error' : '', isDisabled ? 'input-disable' : 'input']" 
            :placeholder="placeholder"
            :disabled="isDisabled"
            @click="selectAllText"
            @input="emitValue"
            :value="modelValue"
            :style="'text-align:' + textAlign"     
            :ref="refProp"   
            @blur="unForcus"
            :maxlength="maxlength"
            :tabindex="tabindex"
        >
        <div 
            class="warning"
            v-if="isEmpty"
        >
            Cần phải nhập thông tin {{ fieldLabel }} 
        </div>
    </div>
</template>

<script>
export default {
    props: {
        fieldLabel: String,
        placeholder: String,
        alowNull: Boolean,
        alowDisabled: Boolean,
        important: Boolean,
        modelValue: String,
        isEmpty: Boolean,
        textAlign: String,
        code: Boolean,
        maxlength: Number,
        refProp: String,
        tabindex: Number,
    },
    methods: {
        /**
         * làm cho biến được truyền vào từ bên ngoài qua prop code thành false
         * Created by: NDCHIEN(10/5/2023)   
         */
        unForcus() {
            this.$emit("unForcus");
        },

        /**
         * Hàm dùng để check lỗi bỏ trống
         * Trả về:
         * -    true: nếu value bị bỏ trống
         * -    false: nếu value không bị bỏ trống
         * @param {nội dung trong input} value 
         * created by: NDChiến (10/02/2023)
         */
        checkInputIsError(value) {
            if(value.length < 1) {
                return true;
            }
            else {
                return false;
            }
        },

        /**
         * Hàm xuất dữ liệu input ra ngoài đồng thời thay đổi dữ liệu biến value phục vụ validate
         * Created by: NDCHIEN(2/3/2023)
         */
        emitValue(event) {
            this.$emit('update:modelValue', event.target.value);
            this.value = event.target.value;
        }

    },
    watch: {

        /**
         * Hàm kiểm tra sự thay đổi của value để phục vụ validate, hàm chỉ được thực hiện khi props allowNull là false
         * @param {*} newValue 
         * Created by: NDCHIEN(2/3/2023)
         */
        value: function(newValue) {
            if(this.alowNull == false) {
                const result = this.checkInputIsError(newValue);
                this.$emit("result", result);
            }
        },
        /**
         * Forcus lại sau khi props code thay đổi
         * Created by: NDCHIEN(10/5/2023)
         */
        code: function(newValue) {
            if(newValue == true) {
                this.$refs.focusMe.focus();
                this.$refs.focusMe.select();
            }
        }
    },
    data() {
        return {
            isError: this.isEmpty,
            isDisabled: this.alowDisabled,
            value: "",

            // biến dùng để hiện dấu sao đỏ
            isImportant: this.important,
        }
    }
}
</script>

<style scoped>
@import url(./input.css);
</style>