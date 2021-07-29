<template>
  <div>Адмін панель</div>
  <a href="http://localhost:3000/api/export">
    <button type="button">Експортувати у EXCEL (XLSX)</button>
  </a>
  <select @change="setSelFac">
    <option :key="fac.key" :value="fac.key" v-for="fac in faculties">
      {{ fac.heading }}
    </option>
  </select>
  <br />
  <span v-if="fStates && fStates[selectedFaculty]">
    <form
      @submit.prevent="saveEditState(selectedFaculty, fStates[selectedFaculty])"
    >
      <h3>Сьогоднішня дата</h3>
      <div class="ingroup">
        <label for="fssf_cd" class="selable">День</label>
        <input
          id="fssf_cd"
          type="number"
          :value="fStates[selectedFaculty].currentDay"
        />
      </div>
      <div class="ingroup">
        <label for="fssf_cm" class="selable">Місяць</label>
        <input
          id="fssf_cm"
          type="number"
          :value="fStates[selectedFaculty].currentMonth"
        />
      </div>
      <div class="ingroup">
        <label for="fssf_cy" class="selable">Рік</label>
        <input
          id="fssf_cy"
          type="number"
          :value="fStates[selectedFaculty].currentYear"
        />
      </div>
      <h3>Проміжок роботи (дні)</h3>
      <div class="ingroup">
        <label for="fssf_cda" class="selable">З</label>
        <input
          id="fssf_cda"
          type="number"
          :value="fStates[selectedFaculty].availableDayFrom"
        />
        <label for="fssf_cda2" class="selable">по</label>
        <input
          id="fssf_cda2"
          type="number"
          :value="fStates[selectedFaculty].availableDayTo"
        />
      </div>
      <h3>Робочий день</h3>
      <div class="ingroup">
        <label for="fssf_cdatr" class="selable">Час початку робочого дня</label>
        <input
          id="fssf_cdatr"
          type="text"
          :value="fStates[selectedFaculty].timeRange.dayStartsAt"
        />
      </div>
      <div class="ingroup">
        <label for="fssf_cdatr2" class="selable">Час закінчення роботи</label>
        <input
          id="fssf_cdatr2"
          type="text"
          :value="fStates[selectedFaculty].timeRange.dayEndsAt"
        />
      </div>
      <div class="ingroup">
        <label for="fssf_cdatr3" class="selable">Інтервал (в хвилинах)</label>
        <input
          id="fssf_cdatr3"
          type="number"
          :value="fStates[selectedFaculty].timeRange.minuteInterval"
        />
      </div>
      <div class="ingroup">
        <label for="fssf_bmpe" class="selable">
          Кількість людей на один час
        </label>
        <input
          id="fssf_bmpe"
          type="number"
          :value="fStates[selectedFaculty].bookingMaxPerEntry"
        />
      </div>
      <button type="submit" class="">Зберегти</button>
    </form>
  </span>
</template>

<script>
import { facultyStrings } from "@bwi/shared/constants";
import { API } from "../helpers/api";

export default {
  name: "Admin",
  methods: {
    fetchStates() {
      return API.get("/get-all-states");
    },
    putStates() {
      return "";
    },
    setSelFac(e) {
      this.selectedFaculty = e.target.value;
    },
    saveEditState(selfuk, fukstate) {
      console.log(selfuk);
      console.log(fukstate);
    },
    exportXLSX() {
    },
  },
  data() {
    return {
      facultyStrings,
      faculties: Object.keys(facultyStrings).map((k) => {
        const st = facultyStrings[k];
        st.key = k;
        return st;
      }),
      selectedFaculty: "FIAT",
      fStates: null,
    };
  },
  created() {
    this.fetchStates().then((res) => (this.fStates = res.data));
  },
};
</script>

<style scoped>
.selable {
  margin: 10px;
}
.ingroup {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
