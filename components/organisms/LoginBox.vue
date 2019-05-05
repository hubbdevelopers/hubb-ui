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

    <div class="buttons">
      <div class="buttons">
        <app-button @click="login" :disabled="$v.$invalid" type="primary"
          >ログイン</app-button
        >

        <app-button @click="$router.push('/i/signup')"
          >新規登録ページへ</app-button
        >
      </div>
    </div>

    <!--div>
        <button class="button is-link" id="google_submit" @click='googleAuth'>Google</button>
    </div-->
  </div>
</template>
<script>
import firebase from 'firebase/app'
import { auth } from '~/plugins/firebase'
import { required, minLength, email } from 'vuelidate/lib/validators'
import AppButton from '~/components/atoms/AppButton.vue'
export default {
  components: {
    AppButton
  },
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
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
    },
    async googleAuth() {
      const provider = new firebase.auth.GoogleAuthProvider()
      auth
        .signInWithPopup(provider)
        .then(async result => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // var token = result.credential.accessToken
          // The signed-in user info.
          // var user = result.user

          await this.$store.dispatch('user/initUser')

          if (result.additionalUserInfo.isNewUser) {
            this.$router.push('/i/init')
          } else {
            this.$router.push(`/${this.$store.state.user.id}`)
          }
        })
        .catch(error => {
          console.log(error)
          // Handle Errors here.
          // var errorCode = error.code
          // var errorMessage = error.message
          // The email of the user's account used.
          // var email = error.email
          // The firebase.auth.AuthCredential type that was used.
          // var credential = error.credential

          // ...
        })
    }
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
}
</script>
