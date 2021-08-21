import { createStore } from "vuex";
import { API } from "../helpers/api";
import { initializeState } from "@bwi/shared/utils";
import { generateDays, generateEntries } from "../helpers";
// import createPersistedState from "vuex-persistedstate";

export const storeObject = {
  state: initializeState({}),
  mutations: {
    setYear: (state, payload) => {
      let year = parseFloat(payload.year);
      if (!year) return null;
      state.currentYear = year;
    },
    setMonth: (state, payload) => {
      let month = parseFloat(payload.month);
      if (!month) return null;
      state.currentMonth = month;
    },
    addCleanEntry: (state, payload) => {
      const { entry } = payload;
      if (!entry.id) return null;
      state.entries = [
        ...state.entries.filter((e) => entry.id !== e.id),
        entry,
      ];
    },
    incrementEntry: (state, payload) => {
      const { entryId } = payload;
      state.entries.find((e) => e.id === entryId).counter += 1;
    },
  },
  actions: {
    initEntry: async ({ commit }) => {
      let flag = false;
      if (flag) return null;
      const response = await API.get("/entry");
      const { data: entries } = response;
      const filtered = [];
      for (let idx in entries) {
        if (!entries[idx].time) continue;
        filtered.push(entries[idx]);
      }
      filtered.forEach((entry) => commit("addCleanEntry", { entry }));
    },
    addEntry: async ({ dispatch, state }, payload) => {
      const entry = payload.entry;
      entry.counter += 1;
      entry.faculty = state.faculty;
      entry.name = payload.fullName;
      entry.phone = payload.phone;
      return new Promise((resolve, reject) => {
        API.post("/entry", entry)
          .then(() => {
            // const splitted = entry.date.split('-');
            // let localizedDate = { day: "", month: "", year: "" };
            // localizedDate.day = splitted[0] + 'го';
            // localizedDate.month = ["січня"];
            resolve(
              `Запис створено успішно! Приходьте ${entry.date} о ${entry.time}.`
            );
          })
          .catch(({ response }) => {
            let error;
            switch (response.status) {
              case 406: {
                error =
                  "Помилка запису, певно хтось вже обрав даний час, спробуйте ще раз.";
                break;
              }
              default: {
                error = "Помилка запису, спробуйте ще раз.";
              }
            }
            reject(error);
          });
        (async () => {
          // const loader = $loading.show({
          //   // Optional parameters
          //   container: null,
          //   canCancel: true,
          //   onCancel: this.onCancel,
          // });
          await dispatch("initEntry");
        })();
      });
    },
  },
  getters: {
    getFaculty: ({ faculty }) => faculty,
    getBookingMaxPerEntry: ({ bookingMaxPerEntry }) => bookingMaxPerEntry,
    getDays: ({
      availableDayFrom,
      availableDayTo,
      exclusiveDates,
      filterRules,
    }) => {
      return generateDays({
        availableDayFrom,
        availableDayTo,
        exclusiveDates,
        filterRules,
      });
    },
    getEntries:
      ({ entries, timeRange, bookingMaxPerEntry, delayedEntriesTimes }) =>
      (date) =>
        generateEntries(
          entries,
          date,
          timeRange,
          bookingMaxPerEntry,
          delayedEntriesTimes
        ),
    getEntry:
      ({ entries }) =>
      (id) =>
        entries[id],
    getYear: ({ currentYear }) => currentYear,
    getMonth: ({ currentMonth }) => currentMonth,
    getAvailableDayFrom: ({ availableDayFrom }) => availableDayFrom,
    getAvailableDayTo: ({ availableDayTo }) => availableDayTo,
    getAcceptableYears: ({ acceptableYears }) => acceptableYears,
    getAcceptableMonths: ({ acceptableMonths }) => acceptableMonths,
    getDaysInCurrentMonth: ({ daysInCurrentMonth }) => daysInCurrentMonth,
    getInput:
      ({ input }) =>
      (key) =>
        input[key],
  },
  modules: {},
  // plugins: [createPersistedState()],
};

// store.dispatch('initEntry');

export default createStore(storeObject);
