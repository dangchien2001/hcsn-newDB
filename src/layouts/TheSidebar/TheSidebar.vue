<template>

    <!-- sidebar có hai dạng ngắn và dài dựa vào tên class -->
    <div 
        :class="sidebarStatus.sidebarWidth + ' sidebar-container'"
    >

        <!-- logo -->
        <router-link to="/">
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
        </router-link>

        <!-- side-bar-items -->
        <router-link              
            v-for="(sidebarItemIcon, index) in sidebarItemIcons"
            :key="index"
            :class="sidebarItemIcon.active + ' sidebar-item ' 
            + sidebarStatus.sidebarItemWidth" 
            :to="sidebarItemIcon.link"
            style="display: block"
        >
            
                <div style="display: flex; height: 100%; align-items: center; height: 40px; cursor: pointer;">
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

                    <div class="toggle-item-bonus" v-if="sidebarItemIcon.items != undefined && this.isOpen == false" @click="() => {this.isOpen = !this.isOpen}"></div>

                    <div class="toggle-item-bonus-2" v-if="sidebarItemIcon.items != undefined && this.isOpen == true" @click="() => {this.isOpen = !this.isOpen}"></div>
                </div>
            

            <div class="side-bar-item-bonus-container" v-if="isOpen">
                <router-link 
                    :class="[this.$route.path == item.link ? 'side-bar-item-bonus-active' : 'side-bar-item-bonus']" 
                    v-for="(item, index) in sidebarItemIcon.items"
                    :key="index"
                    :to="item.link"
                >
                    {{ item.text }}
                </router-link>                
            </div>        
        </router-link >

        

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
        },
    },
    data() {
        return {
            sidebarItemIcons: resource.sidebarItemIcons,

            // Đối tượng phục vụ cho đóng mở sidebar
            sidebarStatus: {
                sidebarWidth: "long-sidebar",
                hide: true,
                sidebarItemWidth: "sidebar-item-long"
            },
            // biến phục vụ mở item bonus
            isOpen: false
        }
    }
}
</script>

<style scoped>
@import url(./sidebar.css);
</style>