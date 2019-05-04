<template>
  <div :class="{ 'is-active': isActive }" class="modal">
    <div @click="close" class="modal-background" />
    <div class="modal-card">
      <modal-card-header @close="close">ページ設定</modal-card-header>
      <modal-card-body>
        <div>
          <button @click="goEditPage" class="button is-primary">
            ページ編集
          </button>
          <button @click="deletePage" class="button is-danger">
            ページ削除
          </button>
        </div>
      </modal-card-body>
      <modal-card-footer :display-buttons="false" />
    </div>
  </div>
</template>
<script>
import ModalCardHeader from '~/components/molecules/ModalCardHeader'
import ModalCardBody from '~/components/molecules/ModalCardBody'
import ModalCardFooter from '~/components/molecules/ModalCardFooter'
export default {
  components: {
    ModalCardHeader,
    ModalCardBody,
    ModalCardFooter
  },
  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    deletePage() {
      this.$emit('delete-page')
    },
    goEditPage() {
      this.$router.push({ path: 'edit', append: true })
    }
  }
}
</script>
