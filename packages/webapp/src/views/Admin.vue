<template>
  <div>
    <h1>Адмін панель</h1>
    <a :href="`${ip}/export`">
      <button type="button">Експортувати у EXCEL (XLSX)</button>
    </a>
  </div>
</template>

<script>
import { getServerURL } from "../helpers/api.js";

export default {
  name: "Admin",
  data() {
    return { ip: getServerURL() };
  },
};
</script>

<style scoped></style>
