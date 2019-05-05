<template>
  <button
    @click="click"
    :disabled="disabled"
    :class="classProp"
    :style="styleProp"
    class="button is-rounded"
  >
    <slot />
  </button>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class extends Vue {
  @Prop({ default: false }) readonly disabled!: boolean
  @Prop({ default: '' }) readonly type!: string
  @Prop(Number) readonly width!: number

  get classProp() {
    if (this.type === 'primary') {
      return 'is-primary'
    }
    return ''
  }

  get styleProp() {
    if (this.width > 0) {
      return {
        width: this.width + 'px'
      }
    }
    return {}
  }
  click() {
    this.$emit('click')
  }
}
</script>
<style lang="scss" scoped>
.dummy {
  color: white;
}
</style>
