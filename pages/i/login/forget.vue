<template>
  <section class="section">
    <div class="container">

      <div class="columns is-centered">
        <div class="column is-half box">
          <h2 class="title has-text-centered">パスワード再設定</h2>

          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input class="input" type="email" v-model="email" placeholder="e.g. alexsmith@gmail.com">
            </div>
          </div>

          <div class="has-text-centered">
              <button class="button is-primary is-medium" id="submit" @click='send' :disabled="$v.email.$invalid">送信</button>
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
  data(){
    return {
      email: "",
    }
  },
  methods: {
    async send() {

      auth.languageCode = 'ja'
      auth.sendPasswordResetEmail(this.email).then(() => {
        window.alert("メールが送信されました。")
        this.$router.push('/i/login')
      }).catch(error => {
        window.alert("メール送信できませんでした。メールアドレスをお確かめください。")
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