<template>
  <div class="modal-wrapper" :hidden="isHidden" @click="closeIfOutsideClick">
    <form class="modal-form" @submit.prevent="submitForm">
      <div class="modal-content">
        <h2 class="title">{{ title }}</h2>
        <slot></slot>
        <span v-if="showOkButton">
          <button class="button" type="submit">{{ okButtonText }}</button>
        </span>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "GModal",
  props: {
    title: {
      type: String,
      default: ""
    },
    okButtonText: {
      type: String,
      default: "OK"
    },
    showOkButton: {
      type: Boolean,
      default: false
    },
    submitForm: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({ isHidden: "getModalVisibility" }),
  },
  methods: {
    ...mapMutations({ toggleModal: "toggleModalVisibility" }),
    closeIfOutsideClick(e) {
      const elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
      if (
          elementMouseIsOver.classList.contains("modal-wrapper")
          || elementMouseIsOver.classList.contains("modal-form")
      ) {
        this.toggleModal();
      }
    },
  }
}
</script>

<style>

.modal-content {
  display: grid;
  grid-template-columns: 0.3fr 1.7fr;
  grid-template-rows: 1fr 1fr 0.5fr 1.5fr;
  gap: 20px 0px;
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

.button {
  grid-area: button;
}
.title {
  grid-area: title;
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
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  /*transition: all 0.3s ease;*/
}
.button:hover {
  box-shadow:
      -7px -7px 20px 0px #fff9,
      -4px -4px 5px 0px #fff9,
      7px 7px 20px 0px #0002,
      4px 4px 5px 0px #0001;
}
</style>
