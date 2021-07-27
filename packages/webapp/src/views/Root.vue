<template>
  <img alt="Faculty logo" src="../assets/fiat.png" style="width: 200px" />
  <ControlPanel />
  <div style="width: 350px; margin: 0 auto;">
    <h3>What's left</h3>
    <ul>
      <li>Saving config in database</li>
      <li>Saving entries to and fetching it from db</li>
      <li><s>REST API access for frontend</s></li>
      <li>Admin panel with ability to change global configuration</li>
      <li>Authorization to admin panel</li>
    </ul>
  </div>
  <Calendar />
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
import Calendar from "../components/Calendar.vue";
import ControlPanel from "../components/ControlPanel.vue";

export default {
  name: "App",
  components: {
    // HelloWorld,
    Calendar,
    ControlPanel,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
