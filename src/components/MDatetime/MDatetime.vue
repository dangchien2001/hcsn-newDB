<template>
    <div 
        class="datetime-picker-container"
    >

        <!-- input datetime picker -->
        <input 
            type="number" 
            class="input-datetime-picker"
            v-model="date"
            placeholder="DD"
            :tabindex="tabindex"
        >
        <span>/</span>
        <input 
            type="number" 
            class="input-datetime-picker"
            v-model="month"
            placeholder="MM"
            :tabindex="tabindex + 1"
        >
        <span>/</span>
        <input 
            type="number" 
            class="input-datetime-picker-year"
            v-model="year"
            placeholder="YYYY"
            @blur="hideDateSelectBox"
            :tabindex="tabindex + 2"
        >

        <!-- icon datetime picker -->
        <div 
            class="datetime-picker-icon"
            @click="handleDatetimeSelectBox"
            
        ></div>

        <!-- hộp chọn ngày tháng -->
        <div 
            :class="[bottom ? 'datetime-picker-select-box-bottom' : 'datetime-picker-select-box']"
            v-if="isHide"                      
        >

            <!-- phần header của hộ chọn ngày tháng -->
            <div class="datetime-picker-header">

                <!-- giá trị ngày được chọn -->
                <div class="datetime-value">
                    Tháng {{ month }}, {{ year }}
                </div>

                <!-- nút thay đổi giá trị năm -->
                <div class="year-select-box">
                    <div class="year-select-icon"></div>
                </div>

                <!-- khoảng trống ngăn cách ở giữa -->
                <div class="blank-datetime-picker"></div>

                <!-- nút giảm 1 tháng -->
                <div class="pre-month-box" @click="handleMonth('pre')">
                    <div class="pre-month-icon"></div>
                </div>

                <!-- nút tăng 1 tháng -->
                <div class="next-month-box" @click="handleMonth('next')">
                    <div class="next-month-icon"></div>
                </div>

            </div>
            
            <!-- thanh chứa các thứ trong tuần -->
            <div class="day-bar">

                <div class="monday">T2</div>
                <div class="tuesday">T3</div>
                <div class="wednesday">T4</div>
                <div class="thursday">T5</div>
                <div class="friday">T6</div>
                <div class="saturday">T7</div>
                <div class="sunday">CN</div>

            </div>

            <!-- thanh chứa các ngày trong 1 tuần (có 6 thanh như vậy) -->
            <div 
                class="week-bar" 
                v-for="n in 6"
                :key="n"
            >

                <div 
                    :class="[{ 'active-date-time': dateActive == 7*(n - 1) + i }, ' day' + i]" 
                    :id="7*(n - 1) + i"
                    v-for="i in 7"
                    :key="i"
                    @click="selectDate(this['day' + (7*(n - 1) + i)])"
                >
                    {{ this['day' + (7*(n - 1) + i)] }}
                </div>

            </div>

            <!-- Nút chọn ngày hiện tại -->
            <div 
                class="today-button"
                @click="returnToday"
            >
                Hôm nay
            </div>

        </div>

        <!-- warning -->
        <div 
            class="warning"
            v-if="isError"
        >
            {{ label }} không đúng định dạng 
        </div>

    </div>
</template>

<script>

export default {
    props: {
        label: String,
        alowNull: Boolean,
        modelValue: String,
        bottom: Boolean,
        tabindex: Number,
    },
    mounted() {
        /**
         * Gán ngày tháng cho biến nếu có ngày tháng truyền từ ngoài vào
         * Created by: NDCHIEN (16/3/2023)
         */
        if(this.modelValue != null) {
            const modelValue = new Date(this.modelValue);
            const fullDateModelValue = modelValue.getDate()+'-'+(modelValue.getMonth() + 1)+'-'+modelValue.getFullYear();
            const dayModelValue = modelValue.getDay();
            const fullYearModelValue = modelValue.getFullYear();
            const monthModelValue = modelValue.getMonth() + 1;
            const dateModelValue = modelValue.getDate();

            this.fullDate = fullDateModelValue;
            this.day = dayModelValue;
            this.date = dateModelValue;
            this.month = monthModelValue;
            this.year = fullYearModelValue;
            this.handleNumberOfMonth(this.month);
        }

        if(this.modelValue == "") {
            /**
             * Logic lấy fullDate('DD-MM-YYYY') sau khi component được tạo
             * Created by: NDCHIEN(2/3/2023)
             */
            const today = new Date();
            const fullDate = today.getDate()+'-'+(today.getMonth() + 1)+'-'+today.getFullYear();
            const day = today.getDay();
            const date = today.getDate();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();

            /**
             * Gán giá trị ngày tháng hiện tại cho biến
             * Created by: NDCHIEN(2/3/2023)
             */
        
            this.fullDate = fullDate;
            this.day = day;
            this.date = date;
            this.month = month;
            this.year = year;
            this.handleNumberOfMonth(this.month); 
            this.selectDate(date);
        }

        
        
        

        /**
         * Logic lấy ngày đầu tiên trong tháng
         * Created by: NDCHIEN(2/3/2023)
         */
        const firstDay = new Date(this.year + "-" + this.month + "-" + 1);
        const dayOfFirstDay = firstDay.getDay();

        /**
         * Login gán từng giá trị ngày vào ô ma trận thích hợp
         * T2 là dayOfFirstDay = 1
         * Created by: NDCHIEN(2/3/2023)
         */
        if(dayOfFirstDay == 1) {
            this['day' + 1] = 1;            
            for(let i = 1 ; i <= this.numberOfMonth; i++ ) {
                this['day' + (i + 1)] = i + 1; 
            }
        }

        if(dayOfFirstDay == 2) {
            this['day' + 2] = 1;            
            for(let i = 2 ; i <= this.numberOfMonth + 1; i++ ) {
                this['day' + (i + 1)] = i; 
            }
        }

        if(dayOfFirstDay == 3) {
            this['day' + 3] = 1;            
            for(let i = 3 ; i <= this.numberOfMonth + 3; i++ ) {
                this['day' + (i + 1)] = i - 1; 
            }
        }

        if(dayOfFirstDay == 4) {
            this['day' + 4] = 1;            
            for(let i = 4 ; i <= this.numberOfMonth + 3; i++ ) {
                this['day' + (i + 1)] = i - 2; 
            }
        }

        if(dayOfFirstDay == 5) {
            this['day' + 5] = 1;            
            for(let i = 5 ; i <= this.numberOfMonth + 4; i++ ) {
                this['day' + (i + 1)] = i - 3; 
            }
        }

        if(dayOfFirstDay == 6) {
            this['day' + 6] = 1;            
            for(let i = 6 ; i <= this.numberOfMonth + 5; i++ ) {
                this['day' + (i + 1)] = i - 4; 
            }
        }

        if(dayOfFirstDay == 0) {
            this['day' + 7] = 1;            
            for(let i = 7 ; i <= this.numberOfMonth + 6; i++ ) {
                this['day' + (i + 1)] = i - 5; 
            }
        }

        // tìm ngày được active mỗi khi gọi component
        if(dayOfFirstDay == 0) {
            this.dateActive = this.date + 6;
        }
        if(dayOfFirstDay == 1) {
            this.dateActive = this.date;
        }
        if(dayOfFirstDay == 2) {
            this.dateActive = this.date + 1;
        }
        if(dayOfFirstDay == 3) {
            this.dateActive = this.date + 2;
        }
        if(dayOfFirstDay == 4) {
            this.dateActive = this.date + 3;
        }
        if(dayOfFirstDay == 5) {
            this.dateActive = this.date + 4;
        }
        if(dayOfFirstDay == 6) {
            this.dateActive = this.date + 5;
        }

    },
    methods: {
        /**
         * Hàm tắt hộp chọn ngày tháng sau khi bấm ra ngoài
         * Created by: NDCHIEN(9/5/2023)
         */
        hideDateSelectBox() {
            this.isHide = false;
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
         * Hàm thay đổi giá trị các tháng
         * @param {} action 
         */
        handleMonth(action) {
            if(action == "pre") {
                if(this.month == 1) {
                    this.year --;
                    this.month = 12;
                    return;
                }
                this.month --;
                this.handleNumberOfMonth(this.month);
            }
            if(action == "next") {
                if(this.month == 12) {
                    this.year ++;
                    this.month = 1;
                    return;
                }
                this.month ++;
                this.handleNumberOfMonth(this.month);
            }
        },

        /**
         * Hàm làm cho tất cả các biến trong ma trận ngày có giá trị null
         * Created by: NDCHIEN(2/3/2023)
         */
        resetDateValue() {
            for(let i = 1; i <= 42; i++) {
                this['day' + i] = null;
            }
        },

        /**
         * Hàm tính số ngày trong tháng được chọn
         * Created by: NDCHIEN(2/3/2023)
         */
        handleNumberOfMonth(month) {
            if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                this.numberOfMonth = 31;
            }
            if(month == 4 || month == 6 || month == 9 || month == 11) {
                this.numberOfMonth = 30;
            }
            if(month == 2) {
                if(this.year % 400 == 0) {
                    this.numberOfMonth = 29;
                }
                if (this.year % 4 == 0 && this.year % 100 !== 0) {
                    this.numberOfMonth = 29;
                }
                else
                {
                    this.numberOfMonth = 28;
                }
            }           
        },

        /**
         * Hàm dùng để ẩn hiện hộp chọn ngày tháng
         * Created by: NDCHIEN(2/3/2023)
         */
        handleDatetimeSelectBox() {
            this.isHide = !this.isHide;
        },

        /**
         * Hàm dùng để trở về ngày hiện tại
         * Created by: NDCHIEN(2/3/2023)
         */
        returnToday() {

            /**
             * Logic lấy ngày hiện tại sau khi component được tạo
             */
            const today = new Date();
            const fullDate = today.getDate()+'-'+(today.getMonth() + 1)+'-'+today.getFullYear();
            const day = today.getDay();
            const date = today.getDate();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();

            /**
             * Gán giá trị ngày tháng hiện tại cho biến
             */
            this.fullDate = fullDate;
            this.day = day;
            this.date = date;
            this.month = month;
            this.year = year;
            this.handleNumberOfMonth(this.month);

            /**
             * Đóng hộp chọn ngày sau khi thực hiện hàm xong
             */
            this.isHide = false;
        },

        /**
         * Hàm dùng để chọn ngày khi click vào
         * Created by: NDCHIEN(2/3/2023)
         */
        selectDate(date) {
            this.date = date;
            if(this.date < 10) {
                this.date = "0" + Number(this.date);
            }
            if(this.month < 10) {
                this.month = "0" + Number(this.month);
            }
            this.isHide = false;
            const selectedDate = this.year + '-' + this.month + '-' + this.date + 'T00:00:00';
            this.$emit('update:modelValue', selectedDate);
        },

    },
    watch: {    

        /**
         * Gán lại vị trí các ngày mỗi khi tháng thay đổi
         * Created by: NDCHIEN(2/3/2023)
         */
        month: function(newValue) {
            /**
             * Hàm thêm số 0 vào tháng có 1 đơn vị (cần lưu ý: hàm này khiến biến month thành String)
             */
            this.month = String(this.month).padStart(2, '0');

            /**
             * Hàm kiểm tra sự thay đổi của value để phục vụ validate, hàm chỉ được thực hiện khi props allowNull là false
             * @param {*} newValue 
             */
            if(this.alowNull == false) {
                const result = this.checkInputIsError(newValue);
                this.isError = result;
            }

            /**
             * Logic lấy ngày đầu tiên trong tháng
             */
            const firstDay = new Date(this.year + "-" + this.month + "-" + 1);
            const dayOfFirstDay = firstDay.getDay();

            /**
             * Login gán từng giá trị ngày vào ô ma trận thích hợp
             */
            if(dayOfFirstDay == 1) {
                this.resetDateValue();
                this['day' + 1] = 1;            
                for(let i = 1 ; i <= this.numberOfMonth - 1; i++ ) {
                    this['day' + (i + 1)] = i + 1; 
                }
            }

            if(dayOfFirstDay == 2) {
                this.resetDateValue();
                this['day' + 2] = 1;            
                for(let i = 2 ; i <= this.numberOfMonth; i++ ) {
                    this['day' + (i + 1)] = i; 
                }
            }

            if(dayOfFirstDay == 3) {
                this.resetDateValue();
                this['day' + 3] = 1;            
                for(let i = 3 ; i <= this.numberOfMonth + 1; i++ ) {
                    this['day' + (i + 1)] = i - 1; 
                }
            }

            if(dayOfFirstDay == 4) {
                this.resetDateValue();
                this['day' + 4] = 1;            
                for(let i = 4 ; i <= this.numberOfMonth + 2; i++ ) {
                    this['day' + (i + 1)] = i - 2; 
                }
            }

            if(dayOfFirstDay == 5) {
                this.resetDateValue();
                this['day' + 5] = 1;            
                for(let i = 5 ; i <= this.numberOfMonth + 3; i++ ) {
                    this['day' + (i + 1)] = i - 3; 
                }
            }

            if(dayOfFirstDay == 6) {
                this.resetDateValue();
                this['day' + 6] = 1;            
                for(let i = 6 ; i <= this.numberOfMonth + 4; i++ ) {
                    this['day' + (i + 1)] = i - 4; 
                }
            }

            if(dayOfFirstDay == 0) {
                this.resetDateValue();
                this['day' + 7] = 1;            
                for(let i = 7 ; i <= this.numberOfMonth + 5; i++ ) {
                    this['day' + (i + 1)] = i - 5; 
                }
            }

            // thay đổi ngày active mỗi khi tháng thay đổi
            if(dayOfFirstDay == 0) {
            this.dateActive = Number(this.date) + 6;
            }
            if(dayOfFirstDay == 1) {
                this.dateActive = Number(this.date);
            }
            if(dayOfFirstDay == 2) {
                this.dateActive = Number(this.date) + 1;
            }
            if(dayOfFirstDay == 3) {
                this.dateActive = Number(this.date) + 2;
            }
            if(dayOfFirstDay == 4) {
                this.dateActive = Number(this.date) + 3;
            }
            if(dayOfFirstDay == 5) {
                this.dateActive = Number(this.date) + 4;
            }
            if(dayOfFirstDay == 6) {
                this.dateActive = Number(this.date) + 5;
            }
        },

        /**
         * Gán lại vị trí các ngày mỗi khi ngày thay đổi
         * Created by: NDCHIEN(2/3/2023)
         */
        date: function(newValue) {
            /**
             * Hàm thêm số 0 vào ngày có 1 đơn vị (cần lưu ý: hàm này khiến biến date thành String)
             */
            this.date = String(this.date).padStart(2, '0');

            /**
             * Hàm kiểm tra sự thay đổi của value để phục vụ validate, hàm chỉ được thực hiện khi props allowNull là false
             * @param {*} newValue 
             */
            if(this.alowNull == false) {
                const result = this.checkInputIsError(newValue);
                this.isError = result;
            }

            /**
             * Logic lấy ngày đầu tiên trong tháng
             */
            const firstDay = new Date(this.year + "-" + this.month + "-" + 1);
            const dayOfFirstDay = firstDay.getDay();

            /**
             * Login gán từng giá trị ngày vào ô ma trận thích hợp
             */
            if(dayOfFirstDay == 1) {
                this.resetDateValue();
                this['day' + 1] = 1;            
                for(let i = 1 ; i <= this.numberOfMonth - 1; i++ ) {
                    this['day' + (i + 1)] = i + 1; 
                }
            }

            if(dayOfFirstDay == 2) {
                this.resetDateValue();
                this['day' + 2] = 1;            
                for(let i = 2 ; i <= this.numberOfMonth; i++ ) {
                    this['day' + (i + 1)] = i; 
                }
            }

            if(dayOfFirstDay == 3) {
                this.resetDateValue();
                this['day' + 3] = 1;            
                for(let i = 3 ; i <= this.numberOfMonth + 1; i++ ) {
                    this['day' + (i + 1)] = i - 1; 
                }
            }

            if(dayOfFirstDay == 4) {
                this.resetDateValue();
                this['day' + 4] = 1;            
                for(let i = 4 ; i <= this.numberOfMonth + 2; i++ ) {
                    this['day' + (i + 1)] = i - 2; 
                }
            }

            if(dayOfFirstDay == 5) {
                this.resetDateValue();
                this['day' + 5] = 1;            
                for(let i = 5 ; i <= this.numberOfMonth + 3; i++ ) {
                    this['day' + (i + 1)] = i - 3; 
                }
            }

            if(dayOfFirstDay == 6) {
                this.resetDateValue();
                this['day' + 6] = 1;            
                for(let i = 6 ; i <= this.numberOfMonth + 4; i++ ) {
                    this['day' + (i + 1)] = i - 4; 
                }
            }

            if(dayOfFirstDay == 0) {
                this.resetDateValue();
                this['day' + 7] = 1;            
                for(let i = 7 ; i <= this.numberOfMonth + 5; i++ ) {
                    this['day' + (i + 1)] = i - 5; 
                }
            }

            // thay đổi ngày active mỗi khi ngày thay đổi
            if(dayOfFirstDay == 0) {
            this.dateActive = Number(this.date) + 6;
            }
            if(dayOfFirstDay == 1) {
                this.dateActive = Number(this.date);
            }
            if(dayOfFirstDay == 2) {
                this.dateActive = Number(this.date) + 1;
            }
            if(dayOfFirstDay == 3) {
                this.dateActive = Number(this.date) + 2;
            }
            if(dayOfFirstDay == 4) {
                this.dateActive = Number(this.date) + 3;
            }
            if(dayOfFirstDay == 5) {
                this.dateActive = Number(this.date) + 4;
            }
            if(dayOfFirstDay == 6) {
                this.dateActive = Number(this.date) + 5;
            }
        },

        /**
         * Gán lại vị trí các ngày mỗi khi năm thay đổi
         * Created by: NDCHIEN(2/3/2023)
         */
        year: function(newValue) {

            /**
             * Hàm kiểm tra sự thay đổi của value để phục vụ validate, hàm chỉ được thực hiện khi props allowNull là false
             * @param {*} newValue 
             */
            if(this.alowNull == false) {
                const result = this.checkInputIsError(newValue);
                this.isError = result;
            }

            /**
             * Logic lấy ngày đầu tiên trong tháng
             */
            const firstDay = new Date(this.year + "-" + this.month + "-" + 1);
            const dayOfFirstDay = firstDay.getDay();

            /**
             * Login gán từng giá trị ngày vào ô ma trận thích hợp
             */
            if(dayOfFirstDay == 1) {
                this.resetDateValue();
                this['day' + 1] = 1;            
                for(let i = 1 ; i <= this.numberOfMonth - 1; i++ ) {
                    this['day' + (i + 1)] = i + 1; 
                }
            }

            if(dayOfFirstDay == 2) {
                this.resetDateValue();
                this['day' + 2] = 1;            
                for(let i = 2 ; i <= this.numberOfMonth; i++ ) {
                    this['day' + (i + 1)] = i; 
                }
            }

            if(dayOfFirstDay == 3) {
                this.resetDateValue();
                this['day' + 3] = 1;            
                for(let i = 3 ; i <= this.numberOfMonth + 1; i++ ) {
                    this['day' + (i + 1)] = i - 1; 
                }
            }

            if(dayOfFirstDay == 4) {
                this.resetDateValue();
                this['day' + 4] = 1;            
                for(let i = 4 ; i <= this.numberOfMonth + 2; i++ ) {
                    this['day' + (i + 1)] = i - 2; 
                }
            }

            if(dayOfFirstDay == 5) {
                this.resetDateValue();
                this['day' + 5] = 1;            
                for(let i = 5 ; i <= this.numberOfMonth + 3; i++ ) {
                    this['day' + (i + 1)] = i - 3; 
                }
            }

            if(dayOfFirstDay == 6) {
                this.resetDateValue();
                this['day' + 6] = 1;            
                for(let i = 6 ; i <= this.numberOfMonth + 4; i++ ) {
                    this['day' + (i + 1)] = i - 4; 
                }
            }

            if(dayOfFirstDay == 0) {
                this.resetDateValue();
                this['day' + 7] = 1;            
                for(let i = 7 ; i <= this.numberOfMonth + 5; i++ ) {
                    this['day' + (i + 1)] = i - 5; 
                }
            }

            // thay đổi ngày active mỗi khi năm thay đổi
            if(dayOfFirstDay == 0) {
            this.dateActive = Number(this.date) + 6;
            }
            if(dayOfFirstDay == 1) {
                this.dateActive = Number(this.date);
            }
            if(dayOfFirstDay == 2) {
                this.dateActive = Number(this.date) + 1;
            }
            if(dayOfFirstDay == 3) {
                this.dateActive = Number(this.date) + 2;
            }
            if(dayOfFirstDay == 4) {
                this.dateActive = Number(this.date) + 3;
            }
            if(dayOfFirstDay == 5) {
                this.dateActive = Number(this.date) + 4;
            }
            if(dayOfFirstDay == 6) {
                this.dateActive = Number(this.date) + 5;
            }
        }

    },
    data() {
        return {

            // biến lưu trạng thái warning
            isError: !this.alowNull,

            // biến lưu ngày được active 
            dateActive: String,

            // Biến lưu trạng thái ẩn hiện hộp chọn ngày tháng
            isHide: false,

            // Biến lưu số ngày trong một tháng
            numberOfMonth: null,

            // fullDate là ngày đầy đủ theo định dạng ('DD-MM-YYYY')
            fullDate: String,

            // date là ngày trong tháng (1 - 31)
            date: Number,

            // day là ngày trong tuần (0 - 6) 
            // CN là 0
            // T2 là 1
            // ...
            day: Number,

            // month là tháng trong năm (1 - 12)
            month: Number,

            // year là năm (yyyy)
            year: Number,

            // DS các biến tương ứng với các ô trong ma trận ngày dùng để hứng giá trị
            day1: null, 
            day2: null, 
            day3: null, 
            day4: null, 
            day5: null, 
            day6: null, 
            day7: null, 
            day8: null, 
            day9: null, 
            day10: null, 
            day11: null, 
            day12: null, 
            day13: null, 
            day14: null, 
            day15: null, 
            day16: null, 
            day17: null, 
            day18: null, 
            day19: null, 
            day20: null, 
            day21: null, 
            day22: null, 
            day23: null, 
            day24: null, 
            day25: null, 
            day26: null, 
            day27: null, 
            day28: null, 
            day29: null, 
            day30: null, 
            day31: null, 
            day32: null, 
            day33: null, 
            day34: null, 
            day35: null, 
            day36: null, 
            day37: null, 
            day38: null, 
            day39: null, 
            day40: null, 
            day41: null, 
            day42: null, 
        }
    }
}
</script>

<style scoped>
@import url(./datetime.css);
</style>