import { createStore } from "vuex";
import { API } from "../helpers/api";
import { initializeState } from "@bwi/shared/utils";
import { generateDays, generateEntries } from "../helpers";
import createPersistedState from "vuex-persistedstate";

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
    setInput: (state, payload) => {
      let { key, value } = payload;
      switch (key) {
        case "phone": {
          if (value.length < 4) {
            state.input[key] = "+380";
          }
          break;
        }
        case "fullName": {
          state.input[key] = value;
          break;
        }
        default:
          return null;
      }
    },
  },
  actions: {
    initEntry: async ({ commit }) => {
      let flag = false;
      if (flag) return null;
      const response = await API.get("/entry");
      const { data: { entries } } = response;
      const filtered = [];
      for (let idx in entries) {
        if (!entries[idx].time) continue;
        filtered.push(entries[idx]);
      }
      filtered.forEach((entry) =>
        commit("addCleanEntry", { entry }));
    },
    addEntry: async ({ dispatch }, payload) => {
      const entry = payload.entry;
      entry.counter += 1;
      entry.faculty = ctx.state.faculty;
      entry.name = payload.fullName;
      entry.phone = payload.phone;
      const res = await API.post("/entry", entry);
      console.log(res);
      // TODO: failure handling
      dispatch("initEntry");
    },
  },
  getters: {
    getFaculty: ({ faculty }) => faculty,
    getBookingMaxPerEntry: ({ bookingMaxPerEntry }) => bookingMaxPerEntry,
    getDays: ({availableDayFrom, availableDayTo, exclusiveDates}) => {
      return generateDays({
        availableDayFrom,
        availableDayTo,
        exclusiveDates,
      });
    },
    getEntries: ({ entries, timeRange, bookingMaxPerEntry, delayedEntriesTimes }) => (date) =>
      generateEntries(
        entries,
        date,
        timeRange,
        bookingMaxPerEntry,
        delayedEntriesTimes
      ),
    getEntry: ({ entries }) => (id) => entries[id],
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
  plugins: [createPersistedState()],
};

// store.dispatch('initEntry');

export default createStore(storeObject);
