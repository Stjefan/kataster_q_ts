<template>
  <div><q-btn label="Refresh" @click="refresh" /><q-btn label="Zoom zurücksetzen" @click="resetZoom" /><q-btn
      label="Disable" @click="disablePanZoom" /></div>
  <div style="background-color: lightgray; height: 50vh; overflow: hidden">
    <div id="zoomPan" style="height: 100%">
      <!--<img :src="url" style="position:absolute" />-->
      <svg style="position:absolute; background-color:darkgray" height="500%" width="500%" ref="elref"
        @contextmenu.prevent="handleContextMenuContainer">

        <image :href="karte?.url" />
        <circle v-for="p in pointsOnMap" :key="p.id" :cx="p.pixel_x" :cy="p.pixel_y" r="5"
          :fill="markedPoint == p.id ? 'red' : 'blue'" @click="handleCircleClick(p)"
          @contextmenu.prevent="handleContextMenu"></circle>

      </svg>
    </div>

  </div>
  {{ text }}
  {{ text2 }}
  {{ pointsOnMap }}
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import { usePointer } from '@vueuse/core'

import panzoom, { PanZoom } from 'panzoom';
import { KarteDetails, karteDetailsFactory, pointOnMapFactory, PointOnMap } from 'src/models/v1';

import { useKatasterStore } from 'src/stores/kataster-store';

export default defineComponent({
  // name: 'ComponentName'
  setup() {
    const store = useKatasterStore()
    const url = ref('')
    const elref = ref(null);
    const mouse = useMouseInElement(elref)

    const p = usePointer({ target: elref })

    const text = ref(mouse)
    const text2 = ref(p)

    const markedPoint = ref('0')




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
    function handleCircleClick(eventArgs: PointOnMap) {
      console.log('handleCircleClick', eventArgs)
      markedPoint.value = eventArgs.id
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
      if (!panzoomInstance?.isPaused()) {
        panzoomInstance?.pause()
        console.log(panzoomInstance?.isPaused())

      } else {
        panzoomInstance?.resume()
      }
    }

    const karte = computed(() => store.karteMainPage)

    const pointsOnMap = computed(() => store.pointsOnMap) // ref([{ pixel_x: 10, pixel_y: 30, id: '1' } as PointOnMap])

    const rectsOnMap = computed(() => store.rectsOnMap) // ref([{ pixel_x: 10, pixel_y: 30, id: '1' } as PointOnMap])




    const dragHandler = (dragState: any, p: PointOnMap) => {
      console.log(dragState)
      console.log(dragState.movement)
      if (!dragState.first) {

        p.pixel_x = dragState.movement[0]
        p.pixel_y = dragState.movement[1]
      }

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
      markedPoint,
      handleCircleClick,
      handleContextMenu,
      handleContextMenuContainer,
      refresh() {
        store.$patch({
          karteMainPage: karteDetailsFactory.build(),
          pointsOnMap: pointOnMapFactory.buildList(7)
        })
        url.value = karte.value?.url ?? '' //`https://placeimg.com/${(Math.floor(Math.random() * 3) + 3) * 100}/${(Math.floor(Math.random() * 3) + 3) * 100}/nature?t=` + Math.random()
        console.log(url.value)
      },
    }
  }
})
</script>
