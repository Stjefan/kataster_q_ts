<template>
  <div><q-btn label="Refresh" @click="refresh" /><q-btn label="Zoom zurücksetzen" @click="resetZoom" /><q-btn
      label="Disable" /></div>
  <div style="background-color: lightgray; height: 50vh; overflow: hidden">
    <div id="zoomPan" style="height: 100%">
      <!--<img :src="url" style="position:absolute" />-->
      <svg style="position:absolute; background-color:darkgray" height="500%" width="500%" ref="elref"
        @contextmenu.prevent="handleContextMenuContainer">

        <image :href="url" />
        <circle cx="150" cy="25" r="15" fill="red" @contextmenu.prevent="handleContextMenu" v-drag="dragHandler">
        </circle>
        <circle cx="150" cy="50" r="5" fill="red" @click="handleCircleClick"></circle>
        <circle v-for="p in pointsOnMap" :key="p.id" :cx="p.pixel_x" :cy="p.pixel_y" r="5" fill="blue"
          @click="handleCircleClick"></circle>

      </svg>
    </div>

  </div>
  {{ text }}
  {{ text2 }}
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import { usePointer } from '@vueuse/core'

import panzoom, { PanZoom } from 'panzoom';
import { KarteDetails, karteDetailsFactory, pointOnMapFactory, PointOnMap } from 'src/models/v1';
import { text } from 'body-parser';
import { url } from 'inspector';
import { QBtn } from 'quasar';



export default defineComponent({
  // name: 'ComponentName'
  setup() {
    const url = ref('')
    const elref = ref(null);
    const mouse = useMouseInElement(elref)

    const p = usePointer({ target: elref })

    const text = ref(mouse)
    const text2 = ref(p)

    const pointsOnMap = ref([{ pixel_x: 10, pixel_y: 30, id: '1' } as PointOnMap])


    let panzoomInstance = null as (null | PanZoom)

    onMounted(() => {
      const element = document.getElementById('zoomPan');
      if (element != null)

        panzoomInstance = panzoom(element, {
          bounds: true,
          boundsPadding: 0.1,
          maxZoom: 5,
          minZoom: 0.1,
        });

      console.log('...')
    })
    function handleCircleClick(eventArgs: unknown) {
      console.log('handleCircleClick', eventArgs)
    }
    function handleContextMenu(eventArgs: unknown) {
      console.log('handleContextMenu', eventArgs)
    }

    function handleContextMenuContainer(eventArgs: MouseEvent) {
      console.log('handleContextMenuContainer', eventArgs)
      pointsOnMap.value.push(pointOnMapFactory.build())
    }
    function resetZoom() {
      let xys = panzoomInstance!.getTransform();
      console.log(xys);
      const element = document.getElementById('zoomPan');
      if (element != null)
        panzoom(element, {
          // bounds: true,
          // boundsPadding: 0.1,
        }).zoomAbs(0, 0, 1);
      xys = panzoomInstance!.getTransform();
      console.log(xys);
    }

    function disablePanZoom() {
      const element = document!.getElementById('zoomPan');
      panzoomInstance!.pause()
    }

    const karte = ref(null as KarteDetails | null)

    const dragHandler = (dragState: unknown) => {
      console.log(dragState)
      // Do something with dragState
    }

    return {
      disablePanZoom,
      dragHandler,
      karte,
      resetZoom,
      elref,
      text,
      url,
      text2,
      pointsOnMap,
      handleCircleClick,
      handleContextMenu,
      handleContextMenuContainer,
      refresh() {
        karte.value = karteDetailsFactory.build()
        url.value = karte.value.url //`https://placeimg.com/${(Math.floor(Math.random() * 3) + 3) * 100}/${(Math.floor(Math.random() * 3) + 3) * 100}/nature?t=` + Math.random()
        console.log(url.value)
      },
    }
  }
})
</script>
