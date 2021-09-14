<template>
  <div class="editor">
    <ckeditor
      v-model="innerValue"
      :editor="editor"
      :config="innerConfig"
    ></ckeditor>
  </div>
</template>

<script>
import { component as CKEditor } from '@ckeditor/ckeditor5-vue2'
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import Image from '@ckeditor/ckeditor5-image/src/image'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload'
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize'
import Link from '@ckeditor/ckeditor5-link/src/link'
import List from '@ckeditor/ckeditor5-list/src/list'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import HtmlEmbed from '@ckeditor/ckeditor5-html-embed/src/htmlembed'

export default {
  name: 'Editor',
  components: {
    ckeditor: CKEditor,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    config: {
      type: Object,
      default: () => ({
        toolbar: [
          'heading',
          '|',
          'htmlEmbed',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          'imageUpload',
          'blockQuote',
          'insertTable',
          'undo',
          'redo',
        ],
      }),
    },
  },
  data() {
    return {
      editor: ClassicEditor,
    }
  },
  computed: {
    innerConfig() {
      return Object.assign({}, this.config, {
        plugins: [
          Essentials,
          Autoformat,
          Bold,
          Italic,
          BlockQuote,
          Heading,
          Image,
          ImageCaption,
          ImageStyle,
          ImageToolbar,
          ImageUpload,
          ImageResize,
          Link,
          List,
          Paragraph,
          Table,
          TableToolbar,
          SimpleUploadAdapter,
          HtmlEmbed,
        ],
        image: {
          resizeUnit: '%',
          toolbar: [
            'imageStyle:full',
            'imageStyle:side',
            '|',
            'imageTextAlternative',
          ],
        },
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
        },
        simpleUpload: {
          uploadUrl: `${process.env.apiBaseUrl}/content_images`,
          withCredentials: true,
          headers: {
            Authorization:
              'Bearer ' + this.$store.getters['currentUser/accessToken'],
          },
        },
      })
    },
    innerValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.editor::v-deep {
  .table {
    margin-left: 0;
  }
}
</style>
