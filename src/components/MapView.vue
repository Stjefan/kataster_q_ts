<template>
  <div>Karte {{ karte?.id }} von {{ mapOwner }}</div>

  <div><q-btn label="Refresh" @click="refresh" /><q-btn label="Zoom zurücksetzen" @click="resetZoom" /><q-btn
      label="Disable" @click="disablePanZoom" /></div>
  <div class="row">
    Markergröße:
    <q-slider v-model="pointSize" :min="0" :max="50" class="col-3" />
  </div>
  <div class="row">
    <div class="col-3">
      Pixel-Koordinaten {{ lastClickedPosition?.px_x }} | {{ lastClickedPosition?.px_y }}
    </div>
    <div class="col-3">
      GK-Koordinaten: {{ lastClickedPosition?.gk_rechts }} | {{ lastClickedPosition?.gk_hoch }}
    </div>
  </div>
  <div style="background-color: lightgray; height: 50vh; overflow: hidden">
    <div id="zoomPan" style="height: 100%;" @contextmenu="handleContextMenu">
      <q-menu touch-position context-menu>

        <q-list dense style="min-width: 100px">
          <q-item clickable v-close-popup @click="handleContextMenuSelect">
            <q-item-section>Open...</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="handleContextMenuAdd">
            <q-item-section>New</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
      <!--<img :src="url" style="position:absolute" />-->
      <svg style="position:absolute; background-color:darkgray" height="1000%" width="1000%" ref="elref"
        @mousedown="handleMouseOver">


        <image :href="karte?.url" />
        <circle v-for="p in pointsOnMap" :key="p.id" :cx="p.pixel_x" :cy="p.pixel_y" :r="pointSize"
          :fill="markedPoint == p.id ? 'red' : 'blue'" @click="handleCircleClick(p)"
          @contextmenu.prevent="handleContextMenu"></circle>
        <polygon :points="p.points" v-for="p in rectsOnMap" :key="p.id"
          style="opacity: 0.5;fill:lime;stroke:purple;stroke-width:1" />
      </svg>
    </div>

  </div>
  <div v-if="false">

    {{ pointsOnMap }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import { usePointer } from '@vueuse/core'

import panzoom, { PanZoom } from 'panzoom';
import { KarteDetails, karteDetailsFactory, pointOnMapFactory, PointOnMap, rectOnMapFactory, Emittent } from 'src/models/v1';

import { px_2_gk, get_gk_2_px_matrix, gk_2_px } from 'src/utility/georeferenzieren'
import { useKatasterStore } from 'src/stores/kataster-store';

export default defineComponent({
  // name: 'ComponentName'
  setup(props, { emit }) {
    const store = useKatasterStore()
    const url = ref('')
    const elref = ref(null);
    //const mouse = useMouseInElement(elref)
    const mapOwner = computed(() => store.karteMainPageZuordnung?.name)
    // const p = usePointer({ target: elref })

    // const text = ref(mouse)

    const markedPoint = ref(null) as unknown as any

    const currentlyMarkedPoint = ref(null as PointOnMap | null)

    const lastClickedPosition = ref({ px_x: NaN, px_y: NaN, gk_rechts: NaN, gk_hoch: NaN })


    const pointSize = ref(5)

    let panzoomInstance = null as (null | PanZoom)

    onMounted(() => {
      const element = document.getElementById('zoomPan');
      if (element != null)

        panzoomInstance = panzoom(element, {
          bounds: false,
          boundsPadding: 0.1,
          maxZoom: 5,
          minZoom: 0.1,
        });

      console.log('...')
    })
    function handleCircleClick(eventArgs: PointOnMap) {
      console.log('handleCircleClick', eventArgs)
      markedPoint.value = eventArgs.id
      currentlyMarkedPoint.value = eventArgs

    }

    function handleMouseOver(eventArgs: any) {
      console.log(eventArgs)
      lastClickedPosition.value = {
        px_x: eventArgs.offsetX,
        px_y: eventArgs.offsetY,
        gk_rechts: NaN,
        gk_hoch: NaN

      }
      if (store.karteMainPage?.georeferenzierung) {
        const m = get_gk_2_px_matrix(store.karteMainPage?.georeferenzierung)
        console.log(m)
        const gk = px_2_gk({ px_x: eventArgs.offsetX, px_y: eventArgs.offsetY }, store.karteMainPage?.georeferenzierung)
        console.log('GK', gk)
        console.log(gk_2_px(gk, m))
        lastClickedPosition.value.gk_rechts = gk.gk_rechts
        lastClickedPosition.value.gk_hoch = gk.gk_hoch

      }
    }
    function handleContextMenu(eventArgs: any) {
      lastClickedPosition.value = {
        px_x: eventArgs.offsetX,
        px_y: eventArgs.offsetY,
        gk_rechts: NaN,
        gk_hoch: NaN

      }
      if (store.karteMainPage?.georeferenzierung) {
        const m = get_gk_2_px_matrix(store.karteMainPage?.georeferenzierung)
        console.log(m)
        const gk = px_2_gk({ px_x: eventArgs.offsetX, px_y: eventArgs.offsetY }, store.karteMainPage?.georeferenzierung)
        console.log('GK', gk)
        lastClickedPosition.value.gk_rechts = gk.gk_rechts
        lastClickedPosition.value.gk_hoch = gk.gk_hoch
        console.log(gk_2_px(gk, m))

      }
      console.log('handleContextMenu', eventArgs)
    }

    function handleContextMenuAdd() {
      console.log(store.karteMainPageZuordnung)
      if (store.karteMainPageZuordnung?.body == 'dach') {
        emit('add-emittent', { koordinaten: { gk_rechts: lastClickedPosition.value.px_x, gk_hoch: lastClickedPosition.value.px_y } })

      } else {

        pointsOnMap.value.push(pointOnMapFactory.build({
          pixel_x: lastClickedPosition.value.px_x,
          pixel_y: lastClickedPosition.value.px_y
        }))
      }

    }

    function handleContextMenuSelect() {
      console.log('MarkedPoint', currentlyMarkedPoint.value, currentlyMarkedPoint.value?.idCorrespondingEmittent)
      if (currentlyMarkedPoint.value != null) {
        store.setEmittentDetailsFromEmittent({ id: `${currentlyMarkedPoint.value.idCorrespondingEmittent}` } as Emittent)
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
      url,
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
      lastClickedPosition,
      handleMouseOver,
      pointSize,
      handleContextMenuSelect
    }
  }
})
</script>
