<template>
  <div>
    <div class="row">
      <form class="col s12">
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
        <div class="control-fields">
          <label for="" class="control-label"></label>
          <checkbox
            v-model="inputs.status"
            name="status"
            label="表示する"
            vid="status"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Checkbox from '@/components/molecules/form/Checkbox'
import EditorField from '@/components/molecules/form/EditorField'

export default {
  components: {
    Checkbox,
    EditorField,
  },
  props: {
    inputs: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {},
}
</script>
