<template>
  <span class="main-container">
    <div id="panel-wrapper">
      <p>control panel</p>
      <div class="select-container">
        <p>Date</p>
        <PanelSelect
          label="Year"
          :value="year"
          action="changeYear"
          @changeYear="setYear($event)"
          :options="acceptableYears"
        />
        <PanelSelect
          label="Month"
          :value="month"
          action="changeMonth"
          @changeMonth="setMonth($event)"
          :options="acceptableMonths"
        />
      </div>
      <div class="select-container">
        <p>Constraints</p>
        <PanelSelect
          label="From"
          :value="dayFrom"
          action="changeConstraintsDayFrom"
          @changeConstraintsDayFrom="setDayFrom($event)"
          :options="createRange(dayFrom, daysInCurrentMonth)"
        />
        <PanelSelect
          label="To"
          :value="dayTo"
          action="changeConstraintsDayTo"
          @changeConstraintsDayTo="setDayTo($event)"
          :options="createRange(dayFrom + 1, daysInCurrentMonth)"
        />
      </div>
      <div class="select-container">
        <p>Unavailable Times</p>
        <PanelSelect
          label="From"
          :value="dayFrom"
          action="changeConstraintsDayFrom"
          @changeConstraintsDayFrom="setDayFrom($event)"
          :options="createRange(dayFrom, daysInCurrentMonth)"
        />
        <PanelSelect
          label="To"
          :value="dayTo"
          action="changeConstraintsDayTo"
          @changeConstraintsDayTo="setDayTo($event)"
          :options="createRange(dayFrom + 1, daysInCurrentMonth)"
        />
      </div>
    </div>
  </span>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import PanelSelect from "./PanelSelect.vue";
import { createRange } from "@bwi/shared/utils";

export default {
  name: "ControlPanel.vue",
  methods: {
    createRange,
    ...mapMutations(["setYear", "setMonth"]),
    setDayFrom(day) {
      this.$store.commit("setAvailableDays", { from: day });
    },
    setDayTo(day) {
      this.$store.commit("setAvailableDays", { to: day });
    },
  },
  computed: {
    ...mapGetters({
      year: "getYear",
      month: "getMonth",
      dayFrom: "getAvailableDayFrom",
      dayTo: "getAvailableDayTo",
      getEntries: "getEntries",
      acceptableYears: "getAcceptableYears",
      acceptableMonths: "getAcceptableMonths",
      daysInCurrentMonth: "getDaysInCurrentMonth",
    }),
  },
  components: {
    PanelSelect,
  },
};
</script>

<style scoped>
#main {
  /*margin: 0 auto;*/
  /*display: flex;*/
  /*justify-content: center;*/
}

.main-container {
  /*padding: 10px;*/
}

#panel-wrapper {
  margin: 25px auto;
  max-width: 320px;
  padding: 25px;
  display: flex;
  justify-content: center;
  border: 1px solid black;
}

.select-container {
  display: grid;
  grid-template-rows: auto;
  grid-row-gap: 10px;
}
</style>
