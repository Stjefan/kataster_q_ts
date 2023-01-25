<template>
  <div>Karte {{ karte?.id }} von {{ mapOwner }}</div>
  {{ lastClickedPosition }}
  <div><q-btn label="Refresh" @click="refresh" /><q-btn label="Zoom zurücksetzen" @click="resetZoom" /><q-btn
      label="Disable" @click="disablePanZoom" /></div>
  <div style="background-color: lightgray; height: 50vh; overflow: hidden">
    <div id="zoomPan" style="height: 100%" @contextmenu="handleContextMenu">
      <q-menu touch-position context-menu>

        <q-list dense style="min-width: 100px">
          <q-item clickable v-close-popup @click="handleContextMenuAdd">
            <q-item-section>Open...</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>New</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
      <!--<img :src="url" style="position:absolute" />-->
      <svg style="position:absolute; background-color:darkgray" height="500%" width="500%" ref="elref">


        <image :href="karte?.url" />
        <circle v-for="p in pointsOnMap" :key="p.id" :cx="p.pixel_x" :cy="p.pixel_y" r="5"
          :fill="markedPoint == p.id ? 'red' : 'blue'" @click="handleCircleClick(p)"
          @contextmenu.prevent="handleContextMenu"></circle>
        <polygon :points="p.points" v-for="p in rectsOnMap" :key="p.id"
          style="opacity: 0.5;fill:lime;stroke:purple;stroke-width:1" />
      </svg>
    </div>

  </div>
  <div>
    {{ text.elementX }} | {{ text.elementY }}
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
import { KarteDetails, karteDetailsFactory, pointOnMapFactory, PointOnMap, rectOnMapFactory } from 'src/models/v1';

import { useKatasterStore } from 'src/stores/kataster-store';

export default defineComponent({
  // name: 'ComponentName'
  setup(props, { emit }) {
    const store = useKatasterStore()
    const url = ref('')
    const elref = ref(null);
    const mouse = useMouseInElement(elref)
    const mapOwner = computed(() => store.karteMainPageZuordnung?.name)
    const p = usePointer({ target: elref })

    const text = ref(mouse)
    const text2 = ref(p)

    const markedPoint = ref('0')

    const lastClickedPosition = ref({ x: 0, y: 0 })




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
    function handleContextMenu(eventArgs: any) {
      lastClickedPosition.value = {
        x: eventArgs.offsetX,
        y: eventArgs.offsetY

      }
      console.log('handleContextMenu', eventArgs)
    }

    function handleContextMenuAdd() {
      console.log(store.karteMainPageZuordnung)
      if (store.karteMainPageZuordnung?.body == 'dach') {
        emit('add-emittent', { koordinaten: { gk_rechts: lastClickedPosition.value.x, gk_hoch: lastClickedPosition.value.y } })

      } else {

        pointsOnMap.value.push(pointOnMapFactory.build({
          pixel_x: lastClickedPosition.value.x,
          pixel_y: lastClickedPosition.value.y
        }))
      }

    }

    function handleContextMenuContainer(eventArgs: MouseEvent) {
      console.log('handleContextMenuContainer', eventArgs)
      pointsOnMap.value.push(pointOnMapFactory.build({
        pixel_x: eventArgs.offsetX,
        pixel_y: eventArgs.offsetY
      }))
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
      mapOwner,
      rectsOnMap,
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
          pointsOnMap: pointOnMapFactory.buildList(7),
          rectsOnMap: rectOnMapFactory.buildList(2)
        })
        url.value = karte.value?.url ?? '' //`https://placeimg.com/${(Math.floor(Math.random() * 3) + 3) * 100}/${(Math.floor(Math.random() * 3) + 3) * 100}/nature?t=` + Math.random()
        console.log(url.value)
      },
      handleContextMenuAdd,
      lastClickedPosition
    }
  }
})
</script>
