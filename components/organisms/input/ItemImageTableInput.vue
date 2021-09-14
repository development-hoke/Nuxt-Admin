<template>
  <div class="row">
    <div class="col s1"></div>
    <div class="col s10">
      <table class="bordered striped">
        <thead>
          <tr>
            <th data-field=""></th>
            <th data-field="">ファイル名</th>
            <th data-field="">カラーパネル</th>
            <th data-field="">表示色番名</th>
            <th data-field="">写真情報</th>
            <th data-field=""></th>
          </tr>
        </thead>
        <draggable v-if="!$fetchState.pending" v-model="innerValue" tag="tbody">
          <tr
            v-for="(image, index) in innerValue"
            :key="image.id"
            class="draggable"
          >
            <td>
              <item-thumbnail
                :width="60"
                :height="80"
                :url="image.urlM || image.rawImage"
              />
            </td>
            <td>{{ image.fileName }}</td>
            <td>
              <color-panel
                v-if="image.colorId"
                :color="colorDict[image.colorId].colorPanel"
              />
              <template v-else>-</template>
            </td>
            <select-input
              v-model="image.colorId"
              wrapper-tag="td"
              input-class="select2 browser-default"
              :name="`itemImages.${index}.colorId`"
              :options="colorOptions"
            />
            <td>
              <text-field
                v-model="image.caption"
                :name="`itemImages.${index}.caption`"
                valid-name="写真情報"
                rules="max:255"
              />
            </td>
            <td class="control">
              <medium-delete-button @click="handleClickRemove(index)" />
            </td>
          </tr>
        </draggable>
      </table>
    </div>
    <div class="col s12 mt-2 center-align">
      <medium-add-button @click="showImageUploadModal = true" />
      <image-upload-modal
        v-if="showImageUploadModal"
        v-on="$listeners"
        @close="showImageUploadModal = false"
      />
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import api from '@/api'
import ItemThumbnail from '@/components/atoms/thumbnail/ItemThumbnail'
import ColorPanel from '@/components/atoms/colorPanel/ColorPanel'
import SelectInput from '@/components/molecules/form/SelectInput'
import TextField from '@/components/molecules/form/TextField'
import MediumDeleteButton from '@/components/atoms/button/MediumDeleteButton'
import MediumAddButton from '@/components/atoms/button/MediumAddButton'
import { createOptions, createDict } from '@/utils/dataStructure'
import ImageUploadModal from '@/components/templates/item/ImageUploadModal'

const createNewItemImage = (file, sort) => ({
  fileName: file.name,
  rawImage: file.base64, // 新規と既存の判断がしづらくなるので、urlとはしない
  caption: null,
  colorId: null,
  isNew: true,
  sort,
})

export default {
  name: 'ItemImageTableInput',
  components: {
    Draggable,
    ItemThumbnail,
    ColorPanel,
    SelectInput,
    MediumDeleteButton,
    MediumAddButton,
    TextField,
    ImageUploadModal,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    colors: {
      type: Array,
      default: () => [],
    },
  },
  async fetch() {
    if (this.colors.length === 0) {
      const { data } = await api.color.fetch()
      this.innerColors = data
    } else {
      this.innerColors = [...this.colors]
    }
  },
  data() {
    return {
      innerColors: [],
      openFileSelect: false,
      showImageUploadModal: false,
    }
  },
  computed: {
    innerValue: {
      get() {
        return [...this.value].sort((i1, i2) => i1.sort - i2.sort)
      },
      set(value) {
        const newValue = value.map((item, index) => ({
          ...item,
          sort: index + 1,
        }))
        this.$emit('input', newValue)
      },
    },
    colorOptions() {
      return createOptions(this.innerColors)
    },
    colorDict() {
      return createDict(this.innerColors)
    },
  },
  methods: {
    handleClickRemove(index) {
      const value = [...this.value]
      value.splice(index, 1)

      this.$emit(
        'input',
        value
          .sort((i1, i2) => i1.sort - i2.sort)
          .map((image, i) => ({ ...image, sort: i + 1 }))
      )
    },
    handleAddFileImage(file) {
      const sort =
        this.value.length === 0
          ? 1
          : Math.max(...this.value.map(({ sort }) => sort)) + 1
      const value = this.value.concat(createNewItemImage(file, sort))
      this.$emit('input', value)
    },
  },
}
</script>

<style lang="scss" scoped>
.draggable {
  .control:hover {
    cursor: default;
  }
}
.draggable:hover {
  cursor: pointer;
}
</style>
