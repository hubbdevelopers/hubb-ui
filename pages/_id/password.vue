<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half box">
          <h2 class="title">パスワード変更</h2>

          <div class="field">
            <label class="label">古いパスワード</label>
            <div class="control">
              <input v-model="oldPassword" class="input" type="password" />
            </div>
            <p v-if="errMsg" class="help is-danger">{{ errMsg }}</p>
          </div>

          <div class="field">
            <label class="label">新しいパスワード</label>
            <div class="control">
              <input v-model="newPassword" class="input" type="password" />
            </div>
            <p v-if="errMsg" class="help is-danger" />
          </div>

          <div class="field">
            <div class="control">
              <button
                @click="change"
                v-bind:disabled="
                  $v.newPassword.$invalid || $v.oldPassword.$invalid
                "
                id="submit"
                class="button is-danger"
              >
                変更する
              </button>
              <n-link :to="'/' + $store.state.user.id" class="button is-link"
                >Back</n-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      errMsg: ''
    }
  },
  methods: {
    async change() {
      this.errMsg = ''

      try {
        await this.$store.dispatch('user/reauthenticate', {
          password: this.oldPassword
        })
        await this.$store.dispatch('user/updatePassword', {
          password: this.newPassword
        })
        window.alert('パスワードを変更しました')
        this.$router.push(`/${this.$store.state.user.id}`)
      } catch (e) {
        console.log(e)
        if (e.code === 'auth/wrong-password') {
          this.errMsg = 'パスワードが正しくありません'
        } else {
          window.alert(
            'パスワードの変更に失敗しました。もう一度やり直してください'
          )
        }
      }
    }
  },
  validations: {
    oldPassword: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(20)
    },
    newPassword: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(20)
    }
  }
}
</script>
