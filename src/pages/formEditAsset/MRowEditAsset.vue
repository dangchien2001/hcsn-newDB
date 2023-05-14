<template>
                <div class="buget-item">
                    <div class="budget-place-cmb">
                        <MCombobox
                            :dataAvailable="dataAvailable"
                            entity="budget_place_name"
                            entityEmit="budget_place_id"
                            v-model="budgetPlace.budgetPlaceName"
                            @dataEmit="(data) => {
                                budgetPlace.budgetPlaceId = data; 
                                $emit('budgetPlace', {
                                    budget_place_id: this.budgetPlace.budgetPlaceId,
                                    budget_place_name: this.budgetPlace.budgetPlaceName,
                                    value: this.budgetPlace.value.toString()
                                })
                            }"
                            :positionAbsolute="false"
                            :isEmpty="isEmpty"
                            :msg="msg"
                            :code="code"
                            :refProp="refComboboxProp"
                            :ref="refComboboxProp"
                        ></MCombobox>
                    </div>
                    <div class="budget-value">
                        <MNumberInput
                            v-model="budgetPlace.value"
                            @valueSelected="() => 
                            {
                                $emit('budgetPlace', {
                                budget_place_id: this.budgetPlace.budgetPlaceId,
                                budget_place_name: this.budgetPlace.budgetPlaceName,
                                value: this.budgetPlace.value.toString()
                            })}"
                            :isEqualZero="isEqualZero"
                            :msg="msgInput"
                            :alowNull="false"
                            :refProp="refInputProp"
                            :ref="refInputProp"
                        ></MNumberInput>
                    </div>
                    <div class="add-delete">
                        <div class="add-budget-icon" @click="this.$emit('add-budget-place')"></div>
                        <div class="delete-budget-icon" @click="this.$emit('delete-budget-place')"></div>
                    </div>
                </div>   
</template>

<script>
import MCombobox from '@/components/MInput/MCombobox.vue';
import MNumberInput from '@/components/MInput/MNumberInput.vue';
export default {
    props: {
        dataAvailable: Array,
        budgetPlaceNameProp: String,
        costProp: String,
        budgetPlaceIdProp: String,
        change: Boolean,
        isEmpty: Boolean,
        code: Boolean,
        refComboboxProp: String,
        refInputProp: String,
        msg: String,
        isEqualZero: Boolean,
        msgInput: String,
    },
    components: {
        MCombobox, MNumberInput
    },
    created() {
        /**
         * Gán giá trị nơi hình thành và giá
         * Created by: NDCHIEN(5/4/2023)
         */
        this.budgetPlace.budgetPlaceName = this.budgetPlaceNameProp;
        this.budgetPlace.value = Number(this.costProp);
        this.budgetPlace.budgetPlaceId = this.budgetPlaceIdProp;
    },
    watch: {
        /**
         * emit ra ngoài sau khi thay đổi nguồn hình thành và giá
         * Created by: NDCHIEN(4/5/2023)
         */
        // budgetPlace: {
        //     handler(newValue) {
        //         this.$emit('budgetPlace', newValue);
        //     },
        //     deep: true
        // },

        /**
         * Hứng sự thay đổi sau khi thêm hoặc xóa nguồn hình thành
         * Created by: NDCHIEN(4/5/2023)
         */
        budgetPlaceNameProp: function(newValue) {
            this.budgetPlace.budgetPlaceName = newValue;
        },
        costProp: function(newValue) {
            this.budgetPlace.value = Number(newValue);
        },
        budgetPlaceIdProp: function(newValue) {
            this.budgetPlace.budgetPlaceId = newValue;
        }
    },
    data() {
        return {
            budgetPlace: {
                budgetPlaceName: "",
                budgetPlaceId: "",
                value: 0,
            }            
        }
    }
}
</script>

<style scoped>
@import url(./formEditAsset.css);
</style>