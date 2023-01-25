<template>
  <q-page padding>
    <!-- content -->
    <div>
      {{ karteOwner }}
    </div>
    <div class="row">
      <q-input type="file" v-model="imgFile" class="col-2" />
      <q-btn label="Karte anzeigen" @click="showImage" />
    </div>
    <q-btn label="Undo" @click="undo" />
    <q-btn label="Redo" @click="redo" />
    <q-btn label="Speichern" @click="transfer2store" />
    <q-btn label="Refresh" @click="refresh" />
    <q-btn label="Georeferenzieren" @click="georeferenzieren" />
    <div class="row">

      <div style="background-color: lightgray; height: 50vh; overflow: hidden" class="col-5">
        <div id="zoomPan" style="
            height: 2000px;
            min-width: 2000px;
            background-color: darkgray;">
          <img :src="url" style="position: absolute" fit="none" position="0 0" id="myimage" />
          <svg style="
              height: 200%;
              width: 200%;
              pointer-events: all;
              position: absolute;" fit="none" position="0 0" @mousedown="showClickPosition">
            <circle :cx="b.pixel_x" :cy="b.pixel_y" r="5" v-for="b in pointsOnMap" :key="b.id"
              :style="{ fill: 'red' }" />
          </svg>


        </div>

      </div>

      <div class="col-4">
        <q-btn label="Referenzpunkt hinzufügen" @click="createReferenzpunkt" />
        <q-table :rows="pointsOnMap" :columns="cols">
          <template v-slot:top>

          </template>
          <template v-slot:body-cell-pixelx="props">
            <q-td>
              <q-input v-model.number="props.row.pixel_x" type="number" />
            </q-td>
          </template>
          <template v-slot:body-cell-pixely="props">
            <q-td>
              <q-input v-model.number="props.row.pixel_y" type="number" />
            </q-td>
          </template>
          <template v-slot:body-cell-gkrechts="props">
            <q-td>
              <q-input v-model.number="props.row.gk_rechts" type="number" />
            </q-td>
          </template>
          <template v-slot:body-cell-gkhoch="props">
            <q-td>
              <q-input v-model.number="props.row.gk_hoch" type="number" />
            </q-td>
          </template>
          <template v-slot:body-cell-delete="props">
            <q-td>
              <q-btn label="X" @click="remove(props.row)" />
            </q-td>
          </template></q-table>
      </div>


    </div>
    <p>{{ positionPixelLastClick }}</p>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref, computed } from 'vue'
import panzoom from 'panzoom';

import { georeferenzierungFactory, Georeferenzierungspunkt, georeferenzpunktFactory, karteDetailsFactory } from '../models/v1'


import { georeferenzieren as createGeoreferenzierung, compute2PointGeoref as create2PointGeoreferenzierung, px_2_gk } from '../utility/georeferenzieren'
import { useRefHistory } from '@vueuse/core'


import { useKatasterStore } from 'src/stores/kataster-store';

import * as _ from 'lodash'

export default defineComponent({
  // name: 'PageName'
  setup() {

    const store = useKatasterStore()
    console.log(store.karte2edit)

    const karteOwner = computed(() => store.karte2editZuordnung?.name)
    const karte = _.cloneDeep(store.karte2edit) //


    const url = ref(karte?.url ?? '')

    const positionPixelLastClick = ref({ x: 0, y: 0, gk_rechts: NaN, gk_hoch: NaN })

    onMounted(() => {
      console.log('On mounted');
      // Enable zooming
      const element = document.getElementById('zoomPan');
      if (element != null)
        panzoom(element, {
          bounds: true,
          boundsPadding: 0.1,
          maxZoom: 5,
          minZoom: 0.1,
        });
    })

    function showImage() {
      console.log('showimage', imgFile.value)

      url.value = URL.createObjectURL(imgFile.value[0]!);



    }

    function createReferenzpunkt() {
      console.log(pointsOnMap.value)
      pointsOnMap.value.push(georeferenzpunktFactory.build())
    }

    function remove(row: unknown) {
      console.log('row', row);
      const idx = pointsOnMap.value.findIndex((i) => i === row);
      if (idx != -1) {
        console.log('Removing', idx);
        pointsOnMap.value.splice(idx, 1);
      }
    }

    function georeferenzieren() {
      console.log('georeferenzieren')

      const img = document.getElementById('myimage')

      if (img != null && karte != null) {



        if (pointsOnMap.value.length == 2) {
          Object.assign(karte.georeferenzierung!, create2PointGeoreferenzierung(pointsOnMap.value, img))
        } else {
          Object.assign(karte.georeferenzierung!, createGeoreferenzierung(pointsOnMap.value, img))

        }
      }



    }

    function transfer2store() {
      if (karte != null) {
        console.log('transfer2store')
        karte.url = url.value
        store.$patch((state) => {

          Object.assign(state.karte2edit!, karte)
          // state.karte2edit = karte
        })

        store.createKarteDetailsBackend(karte, imgFile.value.length > 0 ? imgFile.value[0] as File : null)

      }
    }



    const pointsOnMap: Ref<Georeferenzierungspunkt[]> = ref(karte!.georeferenzierung!.referenzierungspunkt_set)

    const cols = [
      {
        field: 'pixel_x',
        label: 'Pixel X',
        name: 'pixelx',
      },
      {
        field: 'pixel_y',
        label: 'Pixel Y',
        name: 'pixely',
      },
      {
        field: 'gk_rechts',
        label: 'GK-Rechts',
        name: 'gkrechts',
      },
      {
        field: 'gk_hoch',
        label: 'GK-Hoch',
        name: 'gkhoch',
      },
      {
        label: '',
        name: 'delete',
        field: 'id'
      },
    ];

    function showClickPosition(arg: MouseEvent) {
      console.log('Show click position');
      positionPixelLastClick.value.x = arg.offsetX;
      positionPixelLastClick.value.y = arg.offsetY;

      if (karte?.georeferenzierung != null) {
        const r = px_2_gk({ px_x: arg.offsetX, px_y: arg.offsetY }, karte?.georeferenzierung)
        positionPixelLastClick.value.gk_rechts = r.gk_rechts
        positionPixelLastClick.value.gk_hoch = r.gk_hoch
        console.log(positionPixelLastClick)
      }
      /*
      positionGkLastClick.value = transform_pixel_2_gk(
        arg.offsetX,
        arg.offsetY
      );
      transform_gk_2_pixel(
        positionGkLastClick.value.gk_rechts,
        positionGkLastClick.value.gk_hoch
      );
      */
    }

    const { history, undo, redo } = useRefHistory(pointsOnMap, {
      deep: true,
    })



    const imgFile = ref([] as (Blob | null)[])
    return {
      transfer2store,

      showImage,
      georeferenzieren,
      imgFile,
      url,
      cols,
      pointsOnMap,
      positionPixelLastClick,
      showClickPosition,
      createReferenzpunkt,
      remove,
      refresh() {
        url.value = 'https://placeimg.com/700/500/nature?t=' + Math.random()
      },
      undo,
      redo,
      karteOwner
    }
  }
})
</script>
