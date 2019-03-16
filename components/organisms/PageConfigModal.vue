<template>
<div class="modal" :class="{'is-active': isActive}">
  <div class="modal-background" @click="close"></div>
  <div class="modal-card">
    <modal-card-header @close="close">ページ設定</modal-card-header>
    <modal-card-body>
      <div>
				<div><nuxt-link to="edit" append>編集ページ</nuxt-link></div>
				<button class="button is-primary" @click="deletePage">ページ削除</button>
			</div>
    </modal-card-body>
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
    }
  }
}
</script>
