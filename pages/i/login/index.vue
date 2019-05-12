<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half box">
          <h2 class="title has-text-centered">ログイン</h2>

          <div class="field">
            <label class="label">メールアドレス</label>
            <div class="control">
              <input v-model="email" class="input" type="email" />
            </div>
          </div>

          <div class="field">
            <label class="label">パスワード</label>
            <div class="control">
              <input v-model="password" class="input" type="password" />
            </div>
            <n-link to="/i/login/forget">パスワードを忘れた方はこちら</n-link>
          </div>

          <div class="has-text-centered">
            <app-button @click="login" :disabled="$v.$invalid" type="primary"
              >ログイン</app-button
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { auth } from '~/plugins/firebase'
import { required, minLength, email } from 'vuelidate/lib/validators'
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
    },
    password: {
      required,
      minLength: minLength(8)
    }
  }
})
export default class extends Vue {
  email = ''
  password = ''

  async login() {
    const param = {
      email: this.email,
      password: this.password
    }

    auth
      .signInWithEmailAndPassword(param.email, param.password)
      .then(async () => {
        await this.$store.dispatch('user/initUser')
        this.$router.push('/')
      })
  }
}
</script>
