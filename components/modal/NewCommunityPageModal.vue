<template>
  <div :class="{ 'is-active': showModal }" class="modal">
    <div @click="$emit('closeModal')" class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">ページ追加</p>
        <button
          @click="$emit('closeModal')"
          class="delete"
          aria-label="close"
        />
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">ページ名</label>
          <div class="control">
            <input
              v-model="newPageName"
              class="input"
              type="text"
              placeholder="Text input"
            />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button
          @click="createPage"
          v-bind:disabled="$v.newPageName.$invalid || isCreating"
          class="button is-primary"
        >
          ページ追加
        </button>
        <button @click="$emit('closeModal')" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>
<script>
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    communityId: {
      type: String,
      required: true
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

      const param = {
        pageName: this.newPageName,
        communityId: this.communityId
      }
      this.$store
        .dispatch('user/createCommunityPage', param)
        .then(res => {
          console.log(res)
          this.$router.push({ path: res.ID, append: true })
        })
        .finally(() => {
          this.isCreating = false
        })
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
