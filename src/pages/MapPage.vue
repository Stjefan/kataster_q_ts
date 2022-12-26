<template>
  <q-page padding>
    <!-- content -->
    <q-input type="file" v-model="imgFile" />
    <q-btn label="Undo" @click="undo" />
    <q-btn label="Redo" @click="redo" />
    <div style="background-color: lightgray; height: 50vh; overflow: hidden">
      <div id="zoomPan" style="
            height: 2000px;
            min-width: 2000px;
            background-color: darkgray;">
        <img :src="url" style="position: absolute" fit="none" position="0 0" />
        <svg style="
              height: 200%;
              width: 200%;
              pointer-events: all;
              position: absolute;" fit="none" position="0 0" @mousedown="showClickPosition">
          <circle :cx="b.pixel_x" :cy="b.pixel_y" r="5" v-for="b in pointsOnMap" :key="b.id" :style="{ fill: 'red' }" />
        </svg>


      </div>
    </div>
    <p>{{ positionPixelLastClick }}</p>
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
    <q-btn label="Refresh" @click="refresh" />

  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import panzoom from 'panzoom';

import { Georeferenzierungspunkt, georeferenzpunktFactory } from '../models/v1'



import { useRefHistory } from '@vueuse/core'


export default defineComponent({
  // name: 'PageName'
  setup() {



    const url = ref('https://placeimg.com/500/300/nature')

    const positionPixelLastClick = ref({ x: 0, y: 0 })

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

    const pointsOnMap: Ref<Georeferenzierungspunkt[]> = ref([])

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



    const imgFile = ref('')
    return {
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
    }
  }
})
</script>
