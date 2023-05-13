import { createApp } from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory} from 'vue-router'
import AssetView from './views/AssetView/AssetView.vue'
import TheContent from './layouts/TheContent/TheContent.vue'
import clickOutSide from '@/directive/clickOutSide'
import {save, insert, esc} from '@/directive/multipleKeydown'


const routers = [
    {path: "/", component: TheContent},
    {path: "/asset", component: AssetView},
]

const router = createRouter({
    history: createWebHistory(),
    routes: routers
})


createApp(App)
.use(router)
.directive('outside', clickOutSide)
.directive('esc', esc)
.directive('save', save)
.directive('insert', insert)
.mount('#app')
