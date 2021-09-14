<template>
  <div>
    <div class="row">
      <div class="col s8">
        <Draggable v-model="sort" tag="ul" class="collection">
          <li
            v-for="(item, index) in value"
            :key="index"
            class="collection-item"
          >
            <CancelButton @click="handleClickRemoveItem(index)" />
            {{ item.name }}
          </li>
        </Draggable>
      </div>
      <div class="col s2">
        <AddButton
          v-if="actualOptions.length > 0"
          class="add-button"
          @click="handleClickAdd"
        />
      </div>
    </div>
    <div>
      <ModalContainer ref="modal">
        <div class="card">
          <CancelButton
            class="cancel-button"
            @click="handleClickCancel"
          ></CancelButton>
          <div class="card-content">
            <h6 v-if="displayName" class="card-title">
              {{ displayName }}の選択
            </h6>
            <div>
              <select
                class="browser-default"
                :value="null"
                @input="handleSelect"
              >
                <option :value="null" disabled>選択してください</option>
                <option
                  v-for="option in actualOptions"
                  :key="option.id"
                  :value="option.id"
                  >{{ option.name }}</option
                >
              </select>
            </div>
          </div>
          <div class="card-action">
            <ButtonContainer type="secondary" @click="handleClickCancel"
              >キャンセル</ButtonContainer
            >
          </div>
        </div>
      </ModalContainer>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import CancelButton from '@/components/atoms/button/CancelButton'
import AddButton from '@/components/atoms/button/AddButton'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import ModalContainer from '@/components/molecules/modal/ModalContainer'
import { createDict } from '@/utils/dataStructure'

export default {
  name: 'SortableListSelect',
  components: {
    Draggable,
    CancelButton,
    AddButton,
    ModalContainer,
    ButtonContainer,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Array,
      default: () => [],
    },
    displayName: {
      type: String,
      default: null,
    },
  },
  computed: {
    dict() {
      return this.value.reduce(
        (dict, item) => ({ ...dict, [item.id]: item }),
        {}
      )
    },
    optionDict() {
      return createDict(this.options)
    },
    actualOptions() {
      return this.options.filter(({ id }) => !this.dict[id])
    },
    sort: {
      get() {
        return [...this.value].sort((v1, v2) => v1.sort - v2.sort)
      },
      set(sortedItems) {
        const newValue = sortedItems.map((item, index) => ({
          ...item,
          sort: index + 1,
        }))

        this.$emit('input', newValue)
      },
    },
  },
  methods: {
    handleClickAdd() {
      this.$refs.modal.open()
    },
    handleSelect(event) {
      this.$refs.modal.close()

      const value = this.optionDict[event.target.value]

      const sort =
        (this.value.length === 0
          ? 0
          : Math.max(...this.value.map(({ sort }) => sort))) + 1

      this.$emit('input', [...this.value, { ...value, sort }])
    },
    handleClickRemoveItem(index) {
      const value = [...this.value]

      value.splice(index, 1)

      const newValue = value.map((item, index) => ({
        ...item,
        sort: index + 1,
      }))

      this.$emit('input', newValue)
    },
    handleClickCancel() {
      this.$refs.modal.close()
    },
  },
}
</script>

<style lang="scss" scoped>
.collection-item:hover {
  cursor: pointer;
}
.collection {
  margin-top: 0;
}
.card {
  min-width: 30%;
  position: relative;

  .cancel-button {
    position: absolute;
    right: 0;
    top: 4px;
  }

  .card-action {
    justify-content: flex-end;
    display: flex;
  }
}
</style>
