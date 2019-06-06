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
            <app-button @click="send" :disabled="$v.$invalid" type="primary"
              >送信</app-button
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { auth } from '~/plugins/firebase'
import { required, email } from 'vuelidate/lib/validators'
import { Vue, Component } from 'vue-property-decorator'
import AppButton from '~/components/atoms/AppButton.vue'

@Component({
  components: {
    AppButton
  },
  validations: {
    email: {
      required,
      email
    }
  },
  head() {
    return {
      title: 'パスワード再設定'
    }
  }
})
export default class extends Vue {
  email = ''

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
}
</script>
<style lang="scss" scoped>
.explain {
  margin-bottom: 15px;
}
</style>
