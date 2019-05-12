<template>
  <div class="box">
    <h2 class="title">ログイン</h2>

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
    <div class="has-text-danger is-size-7 error">{{ errMsg }}</div>

    <div class="buttons">
      <app-button @click="login" :disabled="$v.$invalid" type="primary"
        >ログイン</app-button
      >

      <app-button @click="$router.push('/i/signup')"
        >新規登録ページへ</app-button
      >
    </div>

    <!--div>
        <button class="button is-link" id="google_submit" @click='googleAuth'>Google</button>
    </div-->
  </div>
</template>
<script lang="ts">
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
  errMsg = ''

  async login() {
    this.errMsg = ''
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
      .catch(e => {
        if (e.code === 'auth/user-not-found') {
          this.errMsg = 'メールアドレスまたはパスワードが正しくありません'
        }
      })
  }
}
</script>
<style lang="scss" scoped>
.error {
  margin-bottom: 10px;
}
</style>
