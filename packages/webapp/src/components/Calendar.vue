<template>
  <div class="calendar calendar-wrapper">
    <div :key="`calendarDay${day}`" class="row" v-for="day in days">
      {{ day.date.split("-").slice(0, 2).join("/") }}
      <div class="time-entries">
        <div
          :key="`entry${entry.time}`"
          class="entry"
          v-for="entry in getEntries(day.date)"
          @click="registerModal(entry)"
        >
          {{ entry.time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import _ from "lodash";

export default {
  name: "Calendar",
  computed: {
    ...mapGetters({
      days: "getDays",
    }),
  },
  methods: {
    ...mapMutations({ toggleModal: "toggleModalVisibility" }),
    getEntries(date) {
      return this.$store.getters.getEntries(date);
    },
    registerModal(entry) {
      this.$store.commit("setCurrentEntry", entry);
      this.toggleModal();
      entry = _.cloneDeep(entry);
      if (entry) return;
      this.$swal({
        title: "Зареєструватись",
        showCancelButton: true,
        html: `
          <div class="book-modal">
            <label for="swal-input1" style="align-self: center;">ПІБ</label>
            <input id="swal-input1" placeholder="Іваненко Іван Іванович" class="swal2-input">
            <label for="swal-input2" style="align-self: center;">Телефон</label>
            <input id="swal-input2" placeholder="+380 XXX XX XX XXX" class="swal2-input">
            </div>
        `,
        focusConfirm: false,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value === "oranges") {
              resolve();
            } else {
              resolve("You need to select oranges :)");
            }
          });
        },
        preConfirm: () => {
          const errors = [];
          const phoneRegExp =
            /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

          const fullName = document.getElementById("swal-input1").value;
          let phone = document.getElementById("swal-input2").value;

          if (
            !phone.startsWith("+380") ||
            !phone.replace("+380", "").match(phoneRegExp)
            // phone.length !== 13
          ) {
            errors.push("Увведіть коректний номер телефону.");
          }

          if (fullName.length < 3 || fullName.length > 100)
            errors.push("Увведіть коректне ім'я.");

          errors.forEach(this.$swal.showValidationMessage);
          if (!errors.length) {
            this.bookEntry(fullName, phone, entry);
          }
        },
      });
    },
    bookEntry(fullName, phone, entry) {
      const { $swal: swal } = this;
      this.$store.dispatch("addEntry", { entry, fullName, phone })
        .then((message) => {
          swal.fire({
            title: "Успіх",
            text: message,
          });
        })
        .catch((message) => {
          swal.fire({
            title: "Помилка",
            text: message,
          });
        });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/styles/main.scss";

.calendar-wrapper {
  max-width: 740px;
  margin: 0 auto;
}

.calendar {
  .row {
    border-top: 1px solid #2c3e50;
    margin: 5px;
    padding: 10px;
    display: flex;
    align-items: flex-start;
    @include disable-selection;
  }
  .time-entries {
    display: flex;
    flex-direction: row;
    margin: auto 10px auto 10px;
    //flex-grow: 0.5;
    //flex-basis: 100%;
    flex-wrap: wrap;

    .entry {
      min-width: 8%;
      cursor: pointer;
      border: 1px solid black;
      border-radius: 3px;
      padding: 5px 15px 5px 15px;
      margin: 5px 10px 5px 0;
      background-color: rgba(195, 155, 211, 0.2);

      &:hover {
        background-color: white;
      }
    }
  }
}
</style>
