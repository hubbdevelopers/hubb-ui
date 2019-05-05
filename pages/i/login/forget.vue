<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half box">
          <h2 class="title has-text-centered">パスワード再設定</h2>

          <div class="field">
            <label class="label">メールアドレス</label>
            <div class="control">
              <input v-model="email" class="input" type="email" />
            </div>
          </div>
          <div class="explain">
            パスワード再設定メールを送信します
          </div>

          <div class="has-text-centered">
            <button
              @click="send"
              :disabled="$v.email.$invalid"
              id="submit"
              class="button is-primary"
            >
              送信
            </button>
          </div>

          <!--div>
              <button class="button is-link" id="google_submit" @click='googleAuth'>Google</button>
          </div-->
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { auth } from '~/plugins/firebase'
import { required, email } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      email: ''
    }
  },
  methods: {
    async send() {
      auth.languageCode = 'ja'
      auth
        .sendPasswordResetEmail(this.email)
        .then(() => {
          window.alert('メールが送信されました。')
          this.$router.push('/i/login')
        })
        .catch(error => {
          window.alert(
            'メール送信できませんでした。メールアドレスをお確かめください。'
          )
          console.log(error)
        })
    }
  },
  validations: {
    email: {
      required,
      email
    }
  }
}
</script>
<style lang="scss" scoped>
.explain {
  margin-bottom: 15px;
}
</style>
