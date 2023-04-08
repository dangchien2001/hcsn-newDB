<template>

    <!-- input chỉ nhận số -->
    <div class="number-input-container">
        
        <!-- label -->
        <div 
            class="number-input-container-label"
        >
            {{ label }}
            <span
                style="color: red;font-size: 13px;"
                v-if="isImportant"
            >*</span>
        </div>

        <!-- input -->
        <input 
            type="text" 
            :class="[paddingInput, isEqualZero ? 'number-input-container-input-error' : 'number-input-container-input']"
            :value="Math.round(this.modelValue * 10000) / 100"
            :disabled="isDisable"
            @input="handleInput"
        >

        <!-- thẻ chứa hai mũi tên lên xuống -->
        <div 
            :class="[!isEqualZero ? 'number-input-container-arrow' : 'number-input-container-arrow-warning']" 
            v-if="isHideArrow"
        >

            <!-- nút mũi tên lên -->
            <div 
                class="number-input-container-arrow-up"
                @click="handleValue('up')"
            ></div>

            <!-- nút mũi tên xuống -->
            <div 
                class="number-input-container-arrow-down"
                @click="handleValue('down')"
            ></div>

        </div>

        <!-- warning -->
        <div 
            class="warning"
            v-if="isEqualZero"
        >
            Cần phải nhập thông tin {{ label }} 
        </div>

    </div>

</template>

<script>
import comon from "@/js/comon";

export default {
    props: {
        label: String,
        allowArrow: Boolean,
        disabled: Boolean,
        important: Boolean,
        alowNull: Boolean,
        modelValue: String,
        isEqualZero: Boolean,
    },
    methods: {

        /**
         * Hàm lên xuống số
         * @param {*} action 
         */
        handleValue(action) {
            if(action == "up") {
                if(this.modelValue < 100) {
                    this.$emit('update:modelValue', Math.round((this.modelValue + 0.1) * 10) /10 );
                }
            }
            if(action == "down") {
                if(this.modelValue > 0) {
                    this.$emit('update:modelValue', Math.round((this.modelValue - 0.1) * 10) /10 );
                }
                
            }
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
            if(value <= 0 || value == null) {
                return true;
            }
            else {
                return false;
            }
        },

        /**
         * Hàm dùng để kiểm tra value có nằm trong 0 - 100 hay không
         * @param {*} value z
         */
        limitValue(value) {
            if(value < 0 && value > 100) {
                return true;
            }
            return false;
        },

        /**
         * Hàm dùng để emit dữ liệu input ra ngoài khi nhập vào ô input
         * @param {*} event 
         */
        handleInput(event) {
            if(this.alowNull == false) {
                const result = this.checkInputIsError(Number(event.target.value.replaceAll('.', ''))); 
                this.$emit("result", result);
            }
            this.$emit('update:modelValue', Number(event.target.value.replaceAll('.', '')));
        },

        /**
         * Hàm format tiền việt
         * Created by: NDCHIEN(2/3/2023)
         */
        formatMoney(money) {
            return comon.formatMoney(money);
        },

    },
    created() {
        // Thay đổi padding input bằng cách thêm class number-input-container-input-padding
        if(this.allowArrow == false) {
            this.paddingInput = "number-input-container-input-padding";
        }

    },
    watch: {

        /**
         * Hàm kiểm tra sự thay đổi của value để phục vụ validate, hàm chỉ được thực hiện khi props allowNull là false, sau đó emit dữ liệu biến value ra ngoài phục vụ bindding những component có mũi tên 
         * @param {*} newValue 
         */
        value: function(newValue) {
            if(this.alowNull == false) {
                const result = this.checkInputIsError(newValue); 
                this.$emit("result", result);
            }
            this.$emit('update:modelValue', newValue);
        },

        modelValue: function(newValue) {
            const result = this.checkInputIsError(newValue);
            this.$emit("result", result);
        }
        
    },
    data() {
        return {

            // biến hứng giá trị input
            value: this.modelValue,

            // biến dùng để hiện mũi tên nếu được cho phép
            isHideArrow: this.allowArrow,

            // biến dùng để thay đổi padding input ko có mũi tên
            paddingInput: String,

            // biến dùng để disable
            isDisable: this.disabled,

            // biến dùng để hiện dấu sao đỏ
            isImportant: this.important,

            // biến dùng để hiện trạng thái warning phục vụ validate
            isError: !this.alowNull,

        }
    }
}
</script>

<style scoped>
@import url(./input.css);
</style>