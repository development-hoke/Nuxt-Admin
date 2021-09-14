<template>
  <div>
    <div class="row">
      <form class="col s12">
        <div class="control-fields">
          <label for="title" class="control-label">タイトル</label>
          <text-field
            id="title"
            v-model="inputs.title"
            name="title"
            type="text"
            class="form-control medium"
            valid-name="タイトル"
            rules="required|max:255"
          />
        </div>
        <div class="control-fields">
          <label for="slug" class="control-label">ページURL</label>
          <p class="default-url">{{ planPageUrl }}</p>
          <text-field
            id="slug"
            v-model="inputs.slug"
            name="slug"
            type="text"
            class="form-control small"
            valid-name="ページURL"
            rules="required|alpha_dash|max:255"
          />
        </div>
        <div class="row">
          <div class="col s3 image-uploader" @click="clickFile">
            サムネイル登録
            <img :src="selectedImg" />
            <input
              id="select-file"
              ref="fileBtn"
              type="file"
              style="display: none;"
              @change="onFileChange"
            />
          </div>
          <div class="col s9">
            <div class="row">
              <div class="col s4">
                <label for="brand" class="control-label"
                  >表示ストアブランド</label
                >
              </div>
              <div class="col s8 mt-1">
                <radiobox
                  v-model="inputs.storeBrand"
                  valid-name="表示ストアブランド"
                  name="storeBrand"
                  :options="storeBrandOptions"
                  rules="required"
                ></radiobox>
              </div>
            </div>
            <p v-if="isFormTypeEdit" class="text-center">
              ※表示ストアブランドを変更すると、商品一覧掲載設定に紐付いた商品は削除されます。
            </p>
            <div class="row">
              <div class="col s4">
                <label for="brand" class="control-label">表示箇所</label>
              </div>
              <div class="col s8 mt-2">
                <radiobox
                  v-model="inputs.place"
                  valid-name="表示箇所"
                  name="place"
                  :options="placeOptions"
                ></radiobox>
              </div>
            </div>
          </div>
        </div>
        <div class="control-fields">
          <label for="body" class="control-label">本文</label>
          <editor-field
            id="body"
            v-model="inputs.body"
            name="body"
            valid-name="本文"
            rules="required|max:10000"
          />
        </div>
        <p class="text-center">
          ※htmlおよびcssのみここに記載できます。JavaScriptは、セキュリティ上記載できません。
        </p>
        <div class="control-fields">
          <label for="status" class="control-label">公開ステータス</label>
          <radiobox
            v-model="inputs.status"
            name="status"
            :options="statusOptions"
          ></radiobox>
        </div>
        <div v-if="inputs.status">
          <div class="control-fields">
            <label class="control-label">開始日時</label>
            <DateitemPickerField
              v-model="inputs.periodFrom"
              name="periodFrom"
              rules="required|date_required|date_lt:periodTo"
              :clear-button="false"
              valid-name="開始日時"
            />
            <span class="">時 : 分</span>
          </div>
          <div class="control-fields">
            <label for="e_date" class="control-label">終了日時</label>
            <DateitemPickerField
              v-model="inputs.periodTo"
              name="periodTo"
              :clear-button="false"
              valid-name="終了日時"
            />
            <span class="">時 : 分</span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Radiobox from '@/components/molecules/form/RadioBox'
import TextField from '@/components/molecules/form/TextField'
import DateitemPickerField from '@/components/molecules/form/DateitemPickerField'
import EditorField from '@/components/molecules/form/EditorField'

export default {
  components: {
    Radiobox,
    TextField,
    DateitemPickerField,
    EditorField,
  },
  props: {
    inputs: {
      type: Object,
      required: true,
    },
    formType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      planPageUrl: '',
      selectedImg: this.inputs.thumbnail,
    }
  },
  computed: {
    ...mapGetters({
      enumOptions: 'enum/options',
      plan: 'plan/data',
      loading: 'common/loading',
    }),
    statusOptions() {
      return this.enumOptions['common/status'] || []
    },
    storeBrandOptions() {
      return this.enumOptions['common/storeBrand'] || []
    },
    placeOptions() {
      const options = [{ name: 'なし', code: null }]

      return options.concat(this.enumOptions['plan/place'] ?? [])
    },
    isFormTypeEdit() {
      return this.formType === 'edit'
    },
  },
  mounted() {
    this.planPageUrl = process.env.planPageUrl
  },
  methods: {
    clickFile() {
      const elem = this.$refs.fileBtn
      elem.click()
    },
    async onFileChange(e) {
      const file = e.target.files[0]
      if (file) {
        this.selectedImg = URL.createObjectURL(file)
        const base64 = await this.getBase64(file)
        this.inputs.thumbnail = {
          fileName: file.name,
          rawImage: base64,
          isNew: true,
        }
      } else {
        this.selectedImg = ''
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
  },
}
</script>

<style scoped>
form .control-fields {
  display: flex;
  align-items: center;
  min-height: 54px;
}
form .control-label {
  font-size: 1rem;
  line-height: 3rem;
  text-align: right;
  padding-right: 3rem;
  min-width: 15%;
}
form .form-control {
  margin: 0 1rem 8px 0 !important;
}
form .form-control.medium {
  width: 30%;
  min-width: 30%;
}
form .form-control.small {
  width: 18%;
  min-width: 18%;
}
form span {
  font-size: 1rem;
  line-height: 3rem;
  margin-right: 1rem;
}
.control-fields >>> input {
  border-top: 0 !important;
  border-right: 0 !important;
  border-left: 0 !important;
}
.text-center {
  text-align: center;
  font-size: 0.85rem;
}
.row .col.image-uploader {
  min-height: 300px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: solid 1px #ccc;
}
.image-uploader img {
  max-width: 100%;
  max-height: 100%;
  position: absolute;
}
</style>
