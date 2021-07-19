<template>
  <div class="panel-container">
    <label :for="`curr${label}`">{{ label }}</label>
    <select
      :name="`curr${label}name`"
      :id="`curr${label}`"
      :value="value"
      @change.prevent="$emit(action, $event.currentTarget.value)"
    >
      <option
        :key="`${label.split(' ').join('1')}avyr${idx}`"
        v-for="(oval, idx) in options"
        :value="oval"
      >
        {{ oval }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "PanelSelect",
  props: ["label", "value", "class", "action", "options"],
};
</script>

<style scoped lang="scss">
#main {
}
.panel-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100px;
}
</style>
