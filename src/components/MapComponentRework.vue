<template>
  <q-btn label="Change" @click="changeImage" />
  <q-select label="Modus" v-model="modus" :options="choices" />
  <div>Karte für Dach {{ mapOwner }}</div>
  <table>
    <tr>
      <td>x/y</td>
      <td>{{ positionPixelLastClick.x }}</td>
      <td>{{ positionPixelLastClick.y }}</td>
    </tr>
    <tr>
      <td>GK-Rechts/GK-Hoch</td>
      <td>{{ NaN }}</td>
      <td>{{ NaN }}</td>
    </tr>
  </table>
  {{ imagePreviewUrl }}
  <div style="background-color: lightgrey; overflow: hidden; height: 50vh;">
    <div id="zoomPan">
      <img :src="imagePreviewUrl" v-if="imagePreviewUrl" style="position: absolute; " position="0 0"
        @contextmenu="bubbleEvent" id="map-image" />
      <svg style="height: 10000px; width: 10000px; pointer-events: all; position: absolute;" fit="none" position="0 0"
        @contextmenu.prevent="showContextMenu" @click="handleClickOnMap">
        <circle :cx="b.pixelX" :cy="b.pixelY" r="5" v-for="b in values" :key="b.id" :style="{ fill: 'red' }"
          @contextmenu.stop="showContextMenuReferenzpunkt" />
        <circle :cx="b.pixel_x" :cy="b.pixel_y" r="5" v-for="b in emittentsOnMap" :key="b.id" :style="{ fill: 'green' }"
          @contextmenu.stop="showContextMenuReferenzpunkt">
          <title>XXX</title>
        </circle>
        <polygon :points="p.points" v-for="p in rectsOnMap" :key="p.id"
          style="opacity: 0.5;fill:lime;stroke:purple;stroke-width:1">
          <title>{{ p.nameCorrespondingRoof }} ({{ p.idCorrespondingRoof }})</title>
        </polygon>
      </svg>


      <div v-if="contextMenuVisible == 1"
        :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }" position="0 0"
        class="context-menu">
        <q-list dense style="min-width: 100px">
          <q-item clickable @click="addReferenzpunktContextmenu">
            <q-item-section>Markierung setzen</q-item-section>
          </q-item>
          <q-item clickable @click="addEmittent">
            <q-item-section>Emittent anlegen</q-item-section>
          </q-item>
        </q-list>
      </div>
      <div v-if="contextMenuVisible == 2"
        :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }" position="0 0"
        class="context-menu">
        <q-list dense style="min-width: 100px">
          <q-item clickable @click="handleMenuItemClick('Löschen')">
            <q-item-section>Referenzpunkt löschen</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { pointOnMapFactory, rectOnMapFactory, uuidv4 } from 'src/models/v1'
import { useKatasterStore } from 'src/stores/kataster-store'

import panzoom from 'panzoom';

import { defineComponent, ref, onMounted } from 'vue'
export default defineComponent({
  // name: 'ComponentName'
  setup() {

    onMounted(() => {
      console.log('On mounted');
      // Enable zooming
      const element = document.getElementById('zoomPan');
      if (element != null) {
        panzoom(element, {
          // bounds: true,
          // boundsPadding: 0.1,
          maxZoom: 5,
          minZoom: 0.1,
        })
      }
      else throw Error('This should not happen')
    })
    const imagePreviewUrl = ref('https://picsum.photos/id/237/200/300')
    const contextMenuVisible = ref(0)
    const contextMenuPosition = ref({ x: 0, y: 0 });
    const positionPixelLastClick = ref({ x: 0, y: 0 })

    function changeImage() {
      imagePreviewUrl.value = `https://picsum.photos/${Math.floor(Math.random() * 10) * 100 + 500}/${Math.floor(Math.random() * 10) * 100 + 300}`

    }
    function showContextMenu(e: any) {
      console.log('showContextMenu')

      e.preventDefault();
      contextMenuVisible.value = 1;
      contextMenuPosition.value = { x: e.offsetX, y: e.offsetY };
    }

    function handleClickOnMap(e: any) {
      positionPixelLastClick.value = { x: e.offsetX, y: e.offsetY };
      hideContextMenu()
    }

    function showContextMenuReferenzpunkt(e: any) {
      e.preventDefault();
      contextMenuVisible.value = 2;
      contextMenuPosition.value = { x: e.offsetX, y: e.offsetY };

    }
    function hideContextMenu() {
      contextMenuVisible.value = 0;
    }
    function handleMenuItemClick(item: any) {
      console.log(item + ' clicked');

      hideContextMenu();
    }

    function bubbleEvent(args: Event) {
      args.preventDefault()
      console.log('bubbleEvent')

    }

    const values = ref([{ pixelX: 340, pixelY: 400, id: uuidv4() }])

    const rectsOnMap = ref([rectOnMapFactory.build(), rectOnMapFactory.build(), rectOnMapFactory.build()])

    const emittentsOnMap = ref([pointOnMapFactory.build(),])

    async function addReferenzpunktContextmenu() {
      // items.value.push(uuidv4())

      const val = { pixelX: contextMenuPosition.value.x, pixelY: contextMenuPosition.value.y, id: uuidv4() }
      values.value.push(val)
      hideContextMenu()
    }

    function removeMarker(id: string) {
      console.log(id)
    }

    const choices = ['roof', 'plant']
    const modus = ref(choices[0])
    const mapOwner = ref('D1')
    function addEmittent() {
      emittentsOnMap.value.push(pointOnMapFactory.build({ pixel_x: contextMenuPosition.value.x, pixel_y: contextMenuPosition.value.y }))
      hideContextMenu()

    }
    return {
      mapOwner,
      removeMarker,
      emittentsOnMap,
      addEmittent,
      choices,
      modus,
      values,
      handleClickOnMap,
      showContextMenu,
      handleMenuItemClick,
      hideContextMenu,
      showContextMenuReferenzpunkt,
      imagePreviewUrl,
      contextMenuVisible,
      positionPixelLastClick,
      contextMenuPosition,
      bubbleEvent,
      changeImage,
      addReferenzpunktContextmenu,
      rectsOnMap
    }
  }
})
</script>
<style>
.context-menu {
  position: absolute;
  background-color: white;
  border: 1px solid gray;
  z-index: 999;
}
</style>
