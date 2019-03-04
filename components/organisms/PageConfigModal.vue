<template>
<div class="modal" :class="{'is-active': isActive}">
  <div class="modal-background"></div>
  <div class="modal-card">
    <modal-header @close="close">ページ設定</modal-header>
    <modal-body>
      <div>
				<div><nuxt-link to="edit" append>編集ページ</nuxt-link></div>
				<button class="button is-primary" @click="deletePage">ページ削除</button>
			</div>
    </modal-body>
  </div>
</div>
</template>
<script>
import ModalHeader from '~/components/molecules/ModalHeader'
import ModalBody from '~/components/molecules/ModalBody'
import ModalFooter from '~/components/molecules/ModalFooter'
export default {
  components: {
    ModalHeader,
    ModalBody,
    ModalFooter
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
    }
  }
}
</script>
