<template>
  <div>
    <MediumTitle class="center-align">メインバナー追加</MediumTitle>
    <div class="row center">
      <div class="col s12">
        SP用バナー :
        <div class="input-field inline">
          <input type="file" @change="onImageUploadedSp" />
        </div>
      </div>
    </div>
    <div class="row center">
      <div class="col s12">
        PC用バナー :
        <div class="input-field inline">
          <input type="file" @change="onImageUploadedPc" />
        </div>
      </div>
    </div>
    <div class="row center">
      <div class="col s12">
        公開設定 :
        <div class="input-field inline">
          <radiobox
            v-model="status"
            name="status"
            :options="statusOptions"
          ></radiobox>
        </div>
      </div>
    </div>
    <div class="row center">
      <div class="col s12">
        URL :
        <div class="input-field inline">
          <text-field
            v-model="url"
            name="URL"
            label="URL"
            rules="required|max:255"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MediumTitle from '@/components/atoms/title/MediumTitle'
import TextField from '@/components/molecules/form/TextField'
import Radiobox from '@/components/molecules/form/RadioBox'

export default {
  name: 'TopContentMainVisualSortAddTable',
  components: {
    MediumTitle,
    TextField,
    Radiobox,
  },
  data() {
    return {
      openFileSelect: false,
      spPath: null,
      pcPath: null,
      status: false,
      url: '',
    }
  },
  computed: {
    statusOptions() {
      return this.$store.getters['enum/options']['common/status'] || []
    },
  },
  methods: {
    async onImageUploadedSp(event) {
      const file = event.target.files[0]
      const base64 = await this.getBase64(file)
      this.spPath = {
        fileName: file.name,
        rawImage: base64,
      }
    },
    async onImageUploadedPc(event) {
      const file = event.target.files[0]
      const base64 = await this.getBase64(file)
      this.pcPath = {
        fileName: file.name,
        rawImage: base64,
      }
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },
    getInputs() {
      return {
        spPath: this.spPath,
        pcPath: this.pcPath,
        status: this.status,
        url: this.url,
      }
    },
  },
}
</script>
