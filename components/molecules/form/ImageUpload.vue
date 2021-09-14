<template>
  <div class="upload-form-wrapper">
    <div v-if="files.length == 0" class="description">
      ドラッグ＆ドロップ
    </div>
    <input
      id="files"
      ref="files"
      name="files"
      type="file"
      class="custom-file-input"
      accept="image/*"
      multiple
      @change="handleFilesUpload"
    />
    <div class="image-list image-preview">
      <div v-for="(file, key) in files" :key="key" class="image-list-item">
        <div class="item-image">
          <img :ref="'image' + parseInt(key)" class="preview" />
        </div>
        <div class="item-detail">
          <div class="file-size"></div>
          <div class="file-name">{{ file.name }}</div>
        </div>
        <div class="item-remove" @click="removeFile(key)">
          <span>削除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { files: [], uploadPercentage: 0 }
  },
  computed: {
    itemId() {
      return this.$route.params.id
    },
  },
  methods: {
    handleFilesUpload() {
      const uploadedFiles = this.$refs.files.files

      for (let i = 0; i < uploadedFiles.length; i++) {
        this.files.push(uploadedFiles[i])
      }

      this.getImagePreviews()
    },

    async submitUpload() {
      if (this.files.length === 0) return
      try {
        for (const file of this.files) {
          const formData = new FormData()

          formData.append('image', file)
          await this.$api.item.uploadImage(this.itemId, formData)
        }
      } catch (error) {
        console.log(error)
        throw error
      } finally {
      }
    },

    getImagePreviews() {
      for (let i = 0; i < this.files.length; i++) {
        if (/\.(jpe?g|png|gif)$/i.test(this.files[i].name)) {
          const reader = new FileReader()

          reader.addEventListener(
            'load',
            function () {
              this.$refs['image' + parseInt(i)][0].src = reader.result
            }.bind(this),
            false
          )

          reader.readAsDataURL(this.files[i])
        }
      }
    },

    removeFile(key) {
      this.files.splice(key, 1)
      this.getImagePreviews()
    },
  },
}
</script>

<style lang="scss" scoped>
input[type='file'] {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  opacity: 0;
}
.upload-form-wrapper {
  position: relative;
  min-height: 250px;
  width: 100%;
  border: 2px dashed #03a9f4;
  cursor: pointer;
}
.description {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #03a9f4;
  font-size: 22px;
}

div.image-list-item {
  border-radius: 20px;
  overflow: hidden;
  width: 120px;
  height: 120px;
  position: relative;
  z-index: 10;
  display: inline-block;
  vertical-align: top;
  margin: 16px;
  min-height: 100px;
  .item-image {
    border-radius: 20px;
    overflow: hidden;
    width: 120px;
    height: 120px;
    position: relative;
    display: block;
    z-index: 10;
    .preview {
      width: 100%;
    }
  }
  .item-detail {
    z-index: 20;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    font-size: 13px;
    min-width: 100%;
    max-width: 100%;
    padding: 2em 1em;
    text-align: center;
    color: rgba(0, 0, 0, 0.9);
    line-height: 150%;
    .file-name {
      overflow: hidden;
      text-overflow: ellipsis;
      background-color: rgba(255, 255, 255, 0.4);
      padding: 0 0.4em;
      border-radius: 3px;
    }
  }
  .item-remove {
    z-index: 20;
    position: absolute;
    bottom: 0;
    left: 0;
    opacity: 0;
    font-size: 13px;
    min-width: 100%;
    max-width: 100%;
    padding: 1em 1em;
    text-align: center;
    color: rgba(0, 0, 0, 0.9);
    line-height: 150%;
  }
}
div.image-list-item:hover {
  .item-image img {
    -webkit-transform: scale(1.05, 1.05);
    -moz-transform: scale(1.05, 1.05);
    -ms-transform: scale(1.05, 1.05);
    -o-transform: scale(1.05, 1.05);
    transform: scale(1.05, 1.05);
    -webkit-filter: blur(8px);
    filter: blur(8px);
  }
  .item-detail {
    opacity: 1;
  }
  .item-remove {
    opacity: 1;
    span {
      border: 1px solid red;
      display: inline-block;
      color: red;
      padding: 3px 10px;
    }
  }
}
</style>
