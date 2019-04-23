<template>
  <div :class="{ 'is-active': showModal }" class="modal">
    <div @click="close" class="modal-background" />
    <div class="modal-card">
      <modal-card-header @close="close">ページ追加</modal-card-header>
      <modal-card-body>
        <div class="field">
          <label class="label">ページ名</label>
          <div class="control">
            <input v-model="newPageName" class="input" type="text" />
          </div>
        </div>
      </modal-card-body>
      <modal-card-footer
        @close="close"
        @submit="createPage"
        :can-submit="!($v.newPageName.$invalid || isCreating)"
        >追加</modal-card-footer
      >
    </div>
  </div>
</template>
<script>
import { required, maxLength } from 'vuelidate/lib/validators'
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
    showModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newPageName: '',
      isCreating: false
    }
  },
  methods: {
    createPage() {
      this.isCreating = true
      this.$store
        .dispatch('user/createPage', this.newPageName)
        .then(res => {
          this.$router.push({
            path: `/${this.$store.state.user.id}/${res.id}`
          })
          this.newPageName = ''
          this.$emit('close')
        })
        .finally(() => {
          this.isCreating = false
        })
    },
    close() {
      this.$emit('close')
    }
  },
  validations: {
    newPageName: {
      required,
      maxLength: maxLength(20)
    }
  }
}
</script>
