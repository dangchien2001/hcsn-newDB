<template>
  <div id="app">

    <!-- component sidebar -->
    <TheSidebar></TheSidebar>

    <!-- thẻ div chứa header và main content -->
    <div class="header-main">
      <TheHeader></TheHeader>
      <TheContent></TheContent>
    </div>
    
  </div>
</template>

<script>
import TheSidebar from "./layouts/TheSidebar/TheSidebar.vue"
import TheHeader from "./layouts/TheHeader/TheHeader.vue"
import TheContent from "./layouts/TheContent/TheContent.vue"  

export default {
  name: 'App',
  components: {
    TheSidebar, TheHeader, TheContent
  }
}
</script>

<style >

@font-face {
    font-family: Roboto Regular;
    src: url(./assets/fonts/Roboto/Roboto-Regular.ttf);
    font-weight: 400;
    font-size: 13px;
}

@font-face {
    font-family: Roboto Bold;
    src: url(./assets/fonts/Roboto/Roboto-Bold.ttf);
    font-weight: 700;
    font-size: 13px;
}

@font-face {
    font-family: Roboto Medium;
    src: url(./assets/fonts/Roboto/Roboto-Medium.ttf);
    font-weight: 500;
    font-size: 13px;
}

@font-face {
    font-family: Roboto Italic;
    src: url(./assets/fonts/Roboto/Roboto-Italic.ttf);
    font-weight: 500;
    font-size: 13px;
}

body {
    margin: 0;
    font-family: Roboto Regular;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-size: 14px;
}

#app {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100vh;
}

.header-main {
  width: calc(100% - 200px);
  flex: 1;
  z-index: 1;
}

</style>
