<template>
  <button @click="read">Read</button>
  <FormKit type="button" @click="createMap" label="Neue Karte anlegen" />
  <q-select v-model="item" :options="options" option-label="id" />
  <FormKit type="button" label="Bearbeiten" @click="editSelected" />
  <FormKit type="form" @submit="handleSubmit" id="form-karte" v-model="form">
    <FormKit type="text" name="id" :disabled="true" />
    <div class="row">
      <FormKit type="file" name="image" v-model="fileInput" @update:modelValue="handleUpdateImage" accept=".png,.bmp,.jpg"
        validation="required" />
    </div>
    <FormKit type="button" label="Zoom zurücksetzen" />
    <table>
      <tr>
        <td>x/y</td>
        <td>{{ positionPixelLastClick.x }}</td>
        <td>{{ positionPixelLastClick.y }}</td>
      </tr>
      <tr>
        <td>GK-Rechts/GK-Hoch</td>
        <td>{{ positionGKLastClick.gkRechts }}</td>
        <td>{{ positionGKLastClick.gkHoch }}</td>
      </tr>
    </table>
    <div style="background-color: lightgrey; overflow: hidden; height: 50vh;">
      <div id="zoomPan">
        <img :src="imagePreviewUrl" v-if="imagePreviewUrl" style="position: absolute; " position="0 0"
          @contextmenu="bubbleEvent" id="map-image" />
        <svg style="height: 10000px; width: 10000px; pointer-events: all; position: absolute;" fit="none" position="0 0"
          @contextmenu.prevent="showContextMenu" @click="handleClickOnMap">
          <circle :cx="b.pixelX" :cy="b.pixelY" r="5" v-for="b in values" :key="b" :style="{ fill: 'red' }"
            @contextmenu.stop="showContextMenuReferenzpunkt" />
        </svg>


        <div v-if="contextMenuVisible == 1"
          :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }" position="0 0"
          class="context-menu">
          <q-list dense style="min-width: 100px">
            <q-item clickable @click="addReferenzpunktContextmenu">
              <q-item-section>Referenzpunkt setzen</q-item-section>
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
    <FormKit type="list" v-model="values" validation="length:2," id="blabla" name="referenzierungspunkt_set">
      <FormKit v-for="key in items" :key="key" type="group" label="Group">
        <div class="row">
          <FormKit type="text" name="id" label="ID" :disabled="true" />
          <FormKit type="number" name="pixelX" :plugins="[castNumber]" label="Pixel X" />
          <FormKit type="number" name="pixelY" :plugins="[castNumber]" label="Pixel Y" />
          <FormKit type="number" name="gkRechts" :plugins="[castNumber]" label="GK-Rechts" />
          <FormKit type="number" name="gkHoch" :plugins="[castNumber]" label="GK-Hoch" />
          <a :data-key="key" href="#" @click="removeItem" class="formkit-remove">Entfernen</a>
        </div>

      </FormKit>
    </FormKit>
    <FormKit type="button" @click.prevent="addItem" label="+" />
    <FormKit type="button" @click.prevent="deleteDoc" label="Karte löschen" />

  </FormKit>
  <div></div>

  <table v-if="bisherigeGeoreferenzierung">
    <tr>
      <td>
        {{ bisherigeGeoreferenzierung.x00 }}
      </td>
      <td>
        {{ bisherigeGeoreferenzierung.x01 }}
      </td>
      <td>
        {{ bisherigeGeoreferenzierung.x02 }}
      </td>
    </tr>
    <tr>
      <td>
        {{ bisherigeGeoreferenzierung.x10 }}
      </td>
      <td>
        {{ bisherigeGeoreferenzierung.x11 }}
      </td>
      <td>
        {{ bisherigeGeoreferenzierung.x12 }}
      </td>
    </tr>
  </table>
  <div>Ergebnisse Georeferezierung: {{ resultsGeoreferenzierung }}</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { uuidv4 } from 'src/models/v1'
import { useKatasterStore } from 'src/stores/kataster-store'

import panzoom from 'panzoom';
import { getNode } from '@formkit/core';
import { georeferenzieren, compute2PointGeoref as create2PointGeoreferenzierung, get_gk_2_px_matrix, px_2_gk, gk_2_px, } from 'src/utility/georeferenzieren';
import { mapper } from 'src/mappings/mapper';
import { PouchMap } from 'src/models/pouch-api';
export default defineComponent({
  // name: 'ComponentName'
  setup() {

    const idMap = '38c7fc82-1c46-400d-840b-be40da75d97a'
    const store = useKatasterStore()

    const resultsGeoreferenzierung = ref(null as any)
    const positionGKLastClick = ref({ gkRechts: NaN, gkHoch: NaN })
    const contextMenuVisible = ref(0);
    const contextMenuPosition = ref({ x: 0, y: 0 });
    const bisherigeGeoreferenzierung = ref(null as any)
    function showContextMenu(e: any) {
      console.log('showContextMenu')

      e.preventDefault();
      contextMenuVisible.value = 1;
      contextMenuPosition.value = { x: e.offsetX, y: e.offsetY };
    }

    function handleClickOnMap(e: any) {
      positionPixelLastClick.value = { x: e.offsetX, y: e.offsetY };
      if (bisherigeGeoreferenzierung.value != null) {
        const m = get_gk_2_px_matrix(bisherigeGeoreferenzierung.value)
        console.log(m)
        const gk = px_2_gk({ px_x: e.offsetX, px_y: e.offsetY }, bisherigeGeoreferenzierung.value)
        console.log('GK', gk)
        positionGKLastClick.value = { gkRechts: Math.round(gk.gk_rechts), gkHoch: Math.round(gk.gk_hoch) }
        console.log(gk_2_px(gk, m))
      }
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

    const castNumber = (node: any) => {
      node.hook.input((value: any, next: any) => next(Number(value)))
    }

    function bubbleEvent(args: Event) {
      args.preventDefault()
      console.log('bubbleEvent')

    }


    async function readDocs() {
      console.log('read')
      const mapDocs = await store.getDb.rel.find('map')
      console.log(mapDocs.maps)


      options.value = mapper.mapArray(mapDocs.maps, 'PouchMap', 'KarteForm')

    }

    async function editSelected() {
      console.log('editSelected')
      console.log('Current', item.value.georeferenzierung)
      bisherigeGeoreferenzierung.value = item.value.georeferenzierung
      const mapped = mapper.map<any, any>(item.value, 'KarteForm', 'KarteForm')

      console.log(item.value, mapped, mapped.georeferenzierung.referenzierungspunkt_set.length)

      form.value = mapped
      const node1 = getNode('form-karte');

      await node1?.isSettled;
      items.value = mapped.georeferenzierung.referenzierungspunkt_set.map((i: any) => i.id)
      // values.value = mapped.georeferenzierung.referenzierungspunkt_set

      await node1?.isSettled;

      values.value = mapped.georeferenzierung.referenzierungspunkt_set

      const imageMap = await store.getDb.rel.getAttachment('map', item.value.id, 'image')
      console.log(imageMap)
      imagePreviewUrl.value = URL.createObjectURL(imageMap as Blob);

      fileInput.value = [{ name: item.value.filename }]



    }




    async function deleteDoc() {
      if (item.value != null) {
        const docs = await store.getDb.rel.find('map', item.value.id)
        const fromDb = docs.maps[0]

        await store.getDb.rel.del('map', fromDb)

        readDocs()
      }

    }


    const form = ref({} as any)
    const values = ref([] as any[])
    const items = ref([] as string[])

    async function addItem() {
      const val = { pixelX: 0, pixelY: 0, gkRechts: 0, gkHoch: 0, id: uuidv4() }
      values.value.push(val)

      const node1 = getNode('form-karte');
      console.log('node1', node1)
      console.log(getNode('blabla'))
      await node1?.isSettled;

      items.value.push(val.id)
    }

    function handleUpdateImage(eventArgs: any) {
      console.log(eventArgs)
      showImage()
    }

    const xInit = ref(0)
    const yInit = ref(0)

    async function addReferenzpunktContextmenu() {
      // items.value.push(uuidv4())
      xInit.value = contextMenuPosition.value.x
      yInit.value = contextMenuPosition.value.y
      console.log(xInit.value, yInit.value)

      const val = { pixelX: contextMenuPosition.value.x, pixelY: contextMenuPosition.value.y, gkRechts: 0, gkHoch: 0, id: uuidv4() }
      values.value.push(val)

      const node1 = getNode('form-karte');
      console.log('node1', node1)
      console.log(getNode('blabla'))
      await node1?.isSettled;

      items.value.push(val.id)



      // insertedNode.pxX = contextMenuPosition.value.x
      // insertedNode.pxY = contextMenuPosition.value.y

      console.log(contextMenuPosition, contextMenuPosition.value.x)

      hideContextMenu()
    }

    function removeItem(e: any) {
      e.preventDefault()
      const key = e.target.getAttribute('data-key')
      console.log(items.value, key)

      items.value = items.value.filter(item => item !== key)
    }

    const fileInput = ref(null as any | null)

    const imagePreviewUrl = ref(null as string | null)

    function showImage() {
      if (fileInput.value?.length) {
        console.log(fileInput.value)
        if (fileInput.value[0].file != null) {
          imagePreviewUrl.value = URL.createObjectURL(fileInput.value[0].file);
        }
      } else {
        imagePreviewUrl.value = null
      }


    }

    async function handleSubmit(args: any) {
      console.log('handleSubmit', args)
      const img = document.getElementById('map-image')
      if (img != null) {
        if (args.referenzierungspunkt_set.length >= 3) {
          resultsGeoreferenzierung.value = georeferenzieren(args.referenzierungspunkt_set, img)

        } else if (args.referenzierungspunkt_set.length == 2) {

          resultsGeoreferenzierung.value = create2PointGeoreferenzierung(args.referenzierungspunkt_set, img)
        } else {
          throw Error('This should not happen')
        }

      }

      console.log(args)



      if (args.image.length) {
        const file = args.image[0]
        const foo = {
          id: args.id ?? uuidv4(), georeferenzierung: {
            id: uuidv4(),
            referenzierungspunkt_set: args.referenzierungspunkt_set, ...resultsGeoreferenzierung.value
          }, filename: file.name
        }
        const mapped = mapper.map(foo, 'KarteForm', 'PouchMap')
        console.log(foo, mapped)

        if (true) {
          let saveResult
          if (args.id) {
            console.log('Bereits vorhanden')
            const bisherDocs = await store.getDb.rel.find('map', args.id)
            const bisher = bisherDocs.maps[0]
            saveResult = await store.getDb.rel.save('map', { ...bisher, ...mapped })
          } else {
            saveResult = await store.getDb.rel.save('map', { ...mapped, ...mapped })
          }


          console.log(saveResult)

          const currentlyCreated = await store.getDb.rel.find('map', saveResult.id)

          const current = currentlyCreated.maps[0]

          console.log(currentlyCreated)

          if (file.file != null) {
            await store.getDb.rel.putAttachment('map', current, 'image', file.file, file.file.type)
          }

        }

      }

      // update()
    }

    async function createMap() {
      form.value = {} as any
      const node1 = getNode('form-karte');
      await node1?.isSettled;
      items.value = []
      // values.value = mapped.georeferenzierung.referenzierungspunkt_set

      await node1?.isSettled;

      values.value = []

      imagePreviewUrl.value = '' // URL.createObjectURL(imageMap as Blob);

      fileInput.value = []
    }

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

    const positionPixelLastClick = ref({ x: NaN, y: NaN })

    function handleMousedown(arg: any) {
      console.log('Show click position');
      positionPixelLastClick.value.x = arg.offsetX;
      positionPixelLastClick.value.y = arg.offsetY;

      console.log('Px', positionPixelLastClick.value)

      hideContextMenu()


    }

    const item = ref(null as any)
    const options = ref([] as any)

    return {
      item,
      options,
      handleSubmit,
      imagePreviewUrl,
      fileInput,
      showImage,
      addItem,
      removeItem,
      items,
      values,
      castNumber,
      read: readDocs,
      positionPixelLastClick,
      handleMousedown,
      showContextMenu,
      handleMenuItemClick,
      hideContextMenu,
      contextMenuVisible,
      contextMenuPosition,
      showContextMenuReferenzpunkt,
      addReferenzpunktContextmenu,
      xInit,
      yInit,
      bubbleEvent,
      form,
      handleUpdateImage,
      handleClickOnMap,
      resultsGeoreferenzierung,
      editSelected,
      deleteDoc,
      createMap,
      bisherigeGeoreferenzierung,
      positionGKLastClick


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

.formkit-remove {
  color: red;
}

button {
  align-self: flex-start;
}

.wrapper {
  display: flex;
}

.half {
  flex: 0 0 50%;
  padding-right: 20px;
}
</style>
