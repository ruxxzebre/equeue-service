<template>
  <div class="modal-wrapper" :hidden="isHidden" @click="closeIfOutsideClick">
    <form class="modal-form" @submit.prevent="submitForm">
      <div :class="['modal-content', errorClass]">
        <h2 class="title">Зареєструватись</h2>
        <div class="label1">
          <label for="swal-input1">ПІБ</label>
        </div>
        <div class="input1">
          <input
            @change="input('name', $event.target.value)"
            :value="formData.name"
            id="swal-input1"
            placeholder="Іваненко Іван Іванович"
            class="modal-input"
          />
        </div>
        <div class="label2">
          <label for="swal-input2">Телефон</label>
        </div>
        <div class="input2">
          <input
            @change="input('phone', $event.target.value)"
            :value="formData.phone"
            id="swal-input2"
            placeholder="+380 XXX XX XX XXX"
            class="modal-input"
          />
        </div>
        <div class="errors" v-if="Object.keys(errors).length">
          {{ errors.phone[0] }}<br />
          {{ errors.name[0] }}
        </div>
        <button class="button" type="submit">Надіслати</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "Modal",
  data() {
    return {
      errors: {},
      errorClass: null,
    };
  },
  computed: {
    ...mapGetters({
      isHidden: "getModalVisibility",
      formData: "getFormData",
      currentEntry: "getCurrentEntry",
    }),
  },
  methods: {
    closeIfOutsideClick(e) {
      const elementMouseIsOver = document.elementFromPoint(
        e.clientX,
        e.clientY
      );
      if (
        elementMouseIsOver.classList.contains("modal-wrapper") ||
        elementMouseIsOver.classList.contains("modal-form")
      ) {
        this.toggleModal();
      }
    },
    submitForm() {
      // this.toggleModal();
      this.validate("phone", this.formData.phone);
      this.validate("name", this.formData.name);
      const { $swal: swal } = this;
      if (this.formData) return;
      this.$store
        .dispatch("addEntry", {
          entry: this.currentEntry,
          fullName: this.formData.name,
          phone: this.formData.phone,
        })
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
    /**
     *
     * @param {'phone' | 'name'} type
     * @param {string} value
     */
    validate(type, value) {
      const errors = [];
      const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

      switch (type) {
        case "name": {
          if (value.length < 3 || value.length > 100)
            errors.push("Увведіть коректне ім'я.");
          break;
        }
        case "phone": {
          if (
            !value.startsWith("+380") ||
            !value.replace("+380", "").match(phoneRegExp)
            // phone.length !== 13
          ) {
            errors.push("Увведіть коректний номер телефону.");
          }
          break;
        }
        default:
          return null;
      }

      errors.forEach(this.$swal.showValidationMessage);
      this.errors[type] = errors;
      if (!errors.length) {
        delete this.errors[type];
        this.errorClass = null;
        // this.$store.commit("setInput", { type, value });
      } else {
        this.errorClass = "error";
        console.log();
      }
    },
    input(type, value) {
      this.validate("phone", this.formData.phone);
      this.validate("name", this.formData.name);
      if (!["phone", "name"].includes(type)) return null;
      this.$store.commit("setInput", { type, value });
    },
    ...mapMutations({ toggleModal: "toggleModalVisibility" }),
  },
};
</script>

<style scoped lang="scss">
.modal-content {
  display: grid;
  grid-template-columns: 0.3fr 1.7fr;
  gap: 20px 0px;
  grid-template-rows: 1fr 1fr 0.5fr 1.5fr;
  grid-template-areas:
    "title title"
    "label1 input1"
    "label2 input2"
    "button button";

  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;

  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 40%; /* Could be more or less, depending on screen size */
}

.error {
  grid-template-rows: 1fr 1fr 0.5fr 0.3fr 1.5fr;
  grid-template-areas:
    "title title"
    "label1 input1"
    "label2 input2"
    "errors errors"
    "button button";
}

.modal-input {
  box-sizing: border-box;
  width: auto;
  transition: border-color 0.1s, box-shadow 0.1s;
  /*border: 1px solid #d9d9d9;*/
  border: 1px solid #d9d9d9;
  border-radius: 0.1875em;
  background: inherit;
  /*border-color: red;*/
  box-shadow: inset 0 1px 1px rgb(0 0 0 / 60%), 0 0 0 3px transparent;
  color: inherit;
  font-size: 1.125em;
  height: 2.625em;
  padding: 0 0.75em;
}

.input1 {
  grid-area: input1;
}
.input2 {
  grid-area: input2;
}
.label1 {
  grid-area: label1;
}
.label2 {
  grid-area: label2;
}
.button {
  grid-area: button;
}
.title {
  grid-area: title;
}
.errors {
  grid-area: errors;
  color: crimson;
}

.modal-wrapper {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

.button {
  width: 130px;
  height: 40px;
  padding: 10px 25px;
  border: 2px solid #000;
  font-family: "Lato", sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  /*transition: all 0.3s ease;*/
}
.button:hover {
  box-shadow: -7px -7px 20px 0px #fff9, -4px -4px 5px 0px #fff9,
    7px 7px 20px 0px #0002, 4px 4px 5px 0px #0001;
}
</style>
