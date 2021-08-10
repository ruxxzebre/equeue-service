// store global
export const storeGlobal = {
  state: {
    modal: {
      hidden: true,
    },
    modalForm: {
      phone: "",
      name: "",
    },
    currentEntry: null,
  },
  mutations: {
    toggleModalVisibility: (state) => {
      state.modal.hidden = !state.modal.hidden;
      if (!state.modal.hidden) {
        state.modalForm.phone = "";
        state.modalForm.name = "";
      }
    },
    /**
     *
     * @param state
     * @param {{ type: string, value: string }} payload
     */
    setInput: (state, payload) => {
      state.modalForm[payload.type] = payload.value;
    },
    setCurrentEntry: (state, payload) => {
      state.currentEntry = payload;
    }
  },
  actions: {},
  getters: {
    getModalVisibility: ({ modal }) => modal.hidden,
    getFormData: ({ modalForm }) => {
      console.log(modalForm);
      return modalForm;
    },
    getCurrentEntry: ({ currentEntry }) => currentEntry,
  },
}
