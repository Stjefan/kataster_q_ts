import { defineStore } from 'pinia';
import { KarteDetails, Messgeraet, Plant, PointOnMap, Vorlage } from 'src/models/v1';

export const useKatasterStore = defineStore('kataster', {
  state: () => ({
    counter: 0,
    emittent: 'hello',
    messgeraete: [] as Messgeraet[],
    vorlagen: [] as Vorlage[],
    plants: [] as Plant[],
    karteMainPage: null as KarteDetails | null,
    pointsOnMap: [] as PointOnMap[],
    rectsOnMap: []
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
  },
});
