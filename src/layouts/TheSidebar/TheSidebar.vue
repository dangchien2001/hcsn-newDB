<template>

    <!-- sidebar có hai dạng ngắn và dài dựa vào tên class -->
    <div 
        :class="sidebarStatus.sidebarWidth + ' sidebar-container'"
    >

        <!-- logo -->
        <div 
            :class="'logo'"
        >
            <div class="logo-img"></div>
            <div 
                class="logo-text" 
                v-if="sidebarStatus.hide"
            >
                MISA QLTS
            </div>
        </div>

        <!-- side-bar-items -->
        <div             
            v-for="(sidebarItemIcon, index) in sidebarItemIcons"
            :key="index"
            :class="sidebarItemIcon.active + ' sidebar-item ' 
            + sidebarStatus.sidebarItemWidth" 
        >
            <div 
                :class="sidebarItemIcon.class" 
            ></div>
            <div 
                class="sidebar-item-text" 
                v-if="sidebarStatus.hide"
            >
                {{ sidebarItemIcon.text }}
            </div>

            <MTooltip
            :text="sidebarItemIcon.text"
            class="sidebar-tooltip"
            ></MTooltip>
        </div>

        

        <!-- open close sidebar -->
        <div class="toggle-sidebar">
            <div 
                class="close-sidebar-icon" 
                @click="closeSidebar"
                v-if="sidebarStatus.hide"
            ></div>
            <div 
                class="open-sidebar-icon" 
                @click="openSidebar"
                v-if="!sidebarStatus.hide"
            >               
            </div>
        </div>
    </div>
</template> 

<script>
import MTooltip from '@/components/MTooltip/MTooltip.vue';
import resource from "../../js/resource.js"

export default {
    name: "TheSidebar",
    components: {
        MTooltip
    },
    methods: {
        closeSidebar() {
            this.sidebarStatus.hide = false;
            this.sidebarStatus.sidebarWidth = "";
            this.sidebarStatus.sidebarItemWidth = "short-sidebar";
        },
        openSidebar() {
            this.sidebarStatus.hide = true;
            this.sidebarStatus.sidebarWidth = "long-sidebar";
            this.sidebarStatus.sidebarItemWidth = "sidebar-item-long";
        }
    },
    data() {
        return {
            sidebarItemIcons: resource.sidebarItemIcons,

            // Đối tượng phục vụ cho đóng mở sidebar
            sidebarStatus: {
                sidebarWidth: "long-sidebar",
                hide: true,
                sidebarItemWidth: "sidebar-item-long"
            }
        }
    }
}
</script>

<style scoped>
@import url(./sidebar.css);
</style>