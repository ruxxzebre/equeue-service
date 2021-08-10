<template>
  <div>
    <h1>Адмін панель</h1>
    <a :href="`${ipconfig.ip}/export`">
      <button type="button">Експортувати у EXCEL (XLSX)</button>
    </a>
  </div>
</template>

<script>
import { ipconfig } from "@bwi/shared/configs";

export default {
  name: "Admin",
  data() {
    return { ipconfig };
  },
};
</script>

<style scoped></style>
