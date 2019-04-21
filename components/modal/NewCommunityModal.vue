<template>
  <div :class="{ 'is-active': showModal }" class="modal">
    <div @click="$emit('closeModal')" class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">コミュニティ作成</p>
        <button
          @click="$emit('closeModal')"
          class="delete"
          aria-label="close"
        />
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">コミュニティ名</label>
          <div class="control">
            <input
              v-model="newCommunityName"
              class="input"
              type="text"
              placeholder="Text input"
            />
          </div>
          <p v-if="errMsg" class="help is-danger">{{ errMsg }}</p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button
          @click="createCommunity"
          v-bind:disabled="$v.newCommunityName.$invalid || isCreating"
          class="button is-primary"
        >
          作成
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
    }
  },
  data() {
    return {
      newCommunityName: '',
      isCreating: false,
      errMsg: ''
    }
  },
  methods: {
    createCommunity() {
      this.isCreating = true
      this.errMsg = ''

      this.checkCommunity()
        .then(() => {
          this.$store
            .dispatch('user/createCommunity', this.newCommunityName)
            .then(res => {
              console.log(res)
              this.$router.push({ path: '/i/community/' + res.ID })
            })
            .finally(() => {
              this.isCreating = false
            })
        })
        .catch(err => {
          this.isCreating = false
          this.errMsg = err
        })
    },
    // TODO
    checkCommunity() {
      return new Promise(async (resolve, reject) => {
        try {
          const communities = await this.$axios.$get(
            `communities?name=${this.newCommunityName}`
          )
          if (communities.data.length == 0) {
            resolve()
          } else {
            reject('すでにコミュニティ名が使用されています')
          }
        } catch (e) {
          console.log(e)
          reject(e.message)
        }
      })
    }
  },
  validations: {
    newCommunityName: {
      required,
      maxLength: maxLength(20)
    }
  }
}
</script>
