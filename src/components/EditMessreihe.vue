<template>
  <q-table :rows="messwertereihen" v-model:selected="selected" selection="single" :columns="cols" row-key="id"
    :pagination="{ rowsPerPage: 10 }">
    <template v-slot:top>
      <q-btn label="Messpunkt hinzufügen" @click="$emit('addMesswertereihe')" />
    </template>
    <template v-slot:body-cell-used="props">
      <q-td>
        <tr>
          <q-toggle v-model="props.row.fremdpegelVorhanden" />
        </tr>

      </q-td>
    </template>

    <template v-slot:body-cell-hz31_5="props">
      <q-td>
        <tr>
          <q-input type="number" v-model.number="props.row.gesamtpegel.hz31_5" />
        </tr>
        <tr>
          <q-input type="number" v-model.number="props.row.fremdpegel.hz31_5" v-if="props.row.fremdpegelVorhanden" />
        </tr>
      </q-td>
    </template>
    <template v-slot:body-cell-hz63="props">
      <q-td>
        <tr>
          <q-input type="number" v-model="props.row.gesamtpegel.hz63" />
        </tr>
        <tr>
          <q-input type="number" v-model="props.row.fremdpegel.hz63" v-if="props.row.fremdpegelVorhanden" />
        </tr>
      </q-td>
    </template>
    <template v-slot:body-cell-hz125="props">
      <q-td>
        <tr>
          <q-input type="number" v-model="props.row.gesamtpegel.hz125" />
        </tr>
        <tr>
          <q-input type="number" v-model="props.row.fremdpegel.hz125" v-if="props.row.fremdpegelVorhanden" />
        </tr>
      </q-td>
    </template>
    <template v-slot:body-cell-hz250="props">
      <q-td>
        <tr>
          <q-input type="number" v-model="props.row.gesamtpegel.hz250" />
        </tr>
        <tr>
          <q-input type="number" v-model="props.row.fremdpegel.hz250" v-if="props.row.fremdpegelVorhanden" />
        </tr>
      </q-td>
    </template>
    <template v-slot:body-cell-hz500="props">
      <q-td>
        <tr>
          <q-input type="number" v-model="props.row.gesamtpegel.hz500" />
        </tr>
        <tr>
          <q-input type="number" v-model="props.row.fremdpegel.hz500" v-if="props.row.fremdpegelVorhanden" />
        </tr>
      </q-td>
    </template>
    <template v-slot:body-cell-hz1000="props">
      <q-td>
        <tr>
          <q-input type="number" v-model="props.row.gesamtpegel.hz1000" />
        </tr>
        <tr>
          <q-input type="number" v-model="props.row.fremdpegel.hz1000" v-if="props.row.fremdpegelVorhanden" />
        </tr>
      </q-td>
    </template>
    <template v-slot:body-cell-hz2000="props">
      <q-td>
        <tr>
          <q-input type="number" v-model="props.row.gesamtpegel.hz2000" />
        </tr>
        <tr>
          <q-input type="number" v-model="props.row.fremdpegel.hz2000" v-if="props.row.fremdpegelVorhanden" />
        </tr>
      </q-td>
    </template>
    <template v-slot:body-cell-hz4000="props">
      <q-td>
        <tr>
          <q-input type="number" v-model="props.row.gesamtpegel.hz4000" />
        </tr>
        <tr>
          <q-input type="number" v-model="props.row.fremdpegel.hz4000" v-if="props.row.fremdpegelVorhanden" />
        </tr>
      </q-td>
    </template>
    <template v-slot:body-cell-hz8000="props">
      <q-td>
        <tr>
          <q-input type="number" v-model="props.row.gesamtpegel.hz8000" />
        </tr>
        <tr>
          <q-input type="number" v-model="props.row.fremdpegel.hz8000" v-if="props.row.fremdpegelVorhanden" />
        </tr>
      </q-td>
    </template>
    <template v-slot:body-cell-messgeraet="props">
      <q-td>
        <tr>
          <q-input v-model="props.row.metainfoGesamtpegel.name_messfile" />
        </tr>
        <tr>
          <q-input v-model="props.row.metainfoFremdpegel.name_messfile" v-if="props.row.fremdpegelVorhanden" />
        </tr>
      </q-td>
    </template>
    <template v-slot:body-cell-messdatum="props">
      <q-td>
        <tr>
          <q-input v-model="props.row.metainfoGesamtpegel.messdatum" type="date" />
        </tr>
        <tr>
          <q-input v-model="props.row.metainfoFremdpegel.messdatum" type="date" v-if="props.row.fremdpegelVorhanden" />
        </tr>

      </q-td>
    </template>
    <template v-slot:body-cell-messfile="props">
      <q-td>
        <tr>
          <q-select v-model="props.row.metainfoGesamtpegel.messgeraet" :options="messgeraete" option-label="name" />
        </tr>
        <tr>
          <q-select v-model="props.row.metainfoFremdpegel.messgeraet" :options="messgeraete" option-label="name"
            v-if="props.row.fremdpegelVorhanden" />
        </tr>

      </q-td>
    </template>
    <template v-slot:body-cell-entfernen="props">
      <q-td>

        <q-btn label="Entfernen" class="dense" v-if="!(props.row.type == 'Fremdpegel')"
          @click="$emit('removeMesswertereihe', props.row.id)" />
      </q-td>
    </template>
    <template v-slot:body-cell-einlesen="props">
      <q-td>
        <tr>
          <q-btn label="Einlesen" @click="einlesen(props.row)" />
        </tr>
        <tr>
          <q-btn label="Einlesen" v-if="props.row.fremdpegelVorhanden" @click="einlesen(props.row)" />
        </tr>
      </q-td>
    </template>
    <template v-slot:body-cell-einfuegen="props">
      <q-td>
        <tr>
          <q-btn label="Einfügen" v-if="props.row.fremdpegelVorhanden" @click="pasteFromClipboard(props.row)" />
        </tr>
        <tr>
          <q-btn label="Einfügen" v-if="props.row.fremdpegelVorhanden" @click="pasteFromClipboard(props.row)" />
        </tr>
      </q-td>
    </template>

  </q-table>
</template>

<script lang="ts">
import { defineComponent, ref, defineEmits, computed } from 'vue';
import { useKatasterStore } from '../stores/kataster-store'

export default defineComponent({
  name: 'MessungenPage',
  props: ['messwertereihen'],
  setup(props, { emit }) {
    const store = useKatasterStore()
    const messgeraete = computed(() => store.messgeraete)
    defineEmits(['addMesswertereihe', 'pasteWerte']);
    /*
    const messwertereihen = computed(() => {
      const result = [];
      for (const r of props.wrappedMesswertereihen.messpositionpegelreihe_set) {
        result.push({
          data: r.gesamtpegel,
          type: "Gesamtpegel",
          idOnFrontend: r.idOnFrontend,
        });
        result.push({
          data: r.fremdpegel,
          type: "Fremdpegel",
          idOnFrontend: r.idOnFrontend,
          isUsed: {
            isUsed: r.fremdpegel.vorhanden != null ? true : false,
          },
        });
      }
      return result;
    });
    */
    function pasteFromClipboard(args: any) {
      /*
      console.log("args", args);
      navigator.clipboard.readText().then((clipText) => {
        const clipboardContent = clipText.split("\t");

        console.log(clipboardContent, clipboardContent.length);
        const parsingResult = {};
        const arrOfFrequenzen = [
          "hz31_5",
          "hz63",
          "hz125",
          "hz250",
          "hz500",
          "hz1000",
          "hz2000",
          "hz4000",
          "hz8000",
        ];
        for (let i = 0; i < Math.min(clipboardContent.length, 8); i++) {
          let currParsingResult = parser(clipboardContent[i], {
            us: 0.25,
            fr: 0.75,
          });
          if (currParsingResult == null || currParsingResult == NaN) {
            throw new Error("Parsing failed");
          }
          parsingResult[arrOfFrequenzen[i]] = currParsingResult; //parseFloat(clipboardContent[i]);
        }
        const eventPayload = {
          parsedData: parsingResult,
          target: args,
        };
        console.log(eventPayload);
        emit("pasteWerte", eventPayload);
      });
      */
    }
    const selected = ref([]);
    const cols = [
      {
        name: 'used',
        label: 'Fremdpegel vorhanden',
        field: 'vorhanden',
      },
      {
        name: 'hz31_5',
        label: '31.5 Hz',
        field: 'type',
      },
      {
        name: 'hz63',
        label: '63 Hz',
        //style: 'width: 50px',
        field: 'type',
      },
      {
        name: 'hz125',
        label: '125 Hz',
        // style: 'width: 50px',
        field: 'type',
      },
      {
        name: 'hz250',
        label: '250 Hz',
        field: 'type',
      },
      {
        name: 'hz500',
        label: '500 Hz',
        field: 'type',
      },
      {
        name: 'hz1000',
        label: '1000 Hz',
        field: 'type',
      },
      {
        name: 'hz2000',
        label: '2000 Hz',
        field: 'type',
      },
      {
        name: 'hz4000',
        label: '4000 Hz',
        field: 'type',
      },
      {
        name: 'hz8000',
        label: '8000 Hz',
        field: 'type',
      },
      {
        name: 'messgeraet',
        label: 'Messgerät',
        field: 'type',
      },
      {
        name: 'messdatum',
        label: 'Messdatum',
        field: 'type',
      },
      {
        name: 'messfile',
        label: 'Messfile',
        field: 'type',
      },
      {
        name: 'einlesen',
        label: '',
        field: 'type',
      },
      {
        name: 'einfuegen',
        label: '',
        field: 'type',
      },
      {
        name: 'entfernen',
        label: '',
        field: 'type',
      },
      // '100 Hz',
      // '120 Hz',
      // '160 Hz',
      // '200 Hz',
      // 'overview',
      //'messfile',
    ];
    const y = ref(0);
    function einlesen(target: any) {
      console.log(einlesen);
    }
    return { y, cols, selected, pasteFromClipboard, einlesen, messgeraete };
  },
  methods: {},
});
</script>
