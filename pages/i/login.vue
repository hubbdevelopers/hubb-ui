<template>
  <section class="section">
    <div class="container">

      <div class="columns is-centered">
        <div class="column is-half box">
          <h2 class="title has-text-centered">Login To Hubb!</h2>

          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input class="input" type="email" v-model="email" placeholder="e.g. alexsmith@gmail.com">
            </div>
          </div>

          <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input class="input" type="password" v-model="password">
            </div>
          </div>

          <div class="has-text-centered">
              <button class="button is-primary is-medium" id="submit" @click='login' v-bind:disabled="$v.email.$invalid || $v.password.$invalid">ログイン</button>
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
import firebase from 'firebase/app'
import { auth } from '~/plugins/firebase'
import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
  data(){
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    async login() {
      const param = {
        email: this.email,
        password: this.password
      }

      auth.signInWithEmailAndPassword(param.email, param.password).then(async res => {
        await this.$store.dispatch('user/initUser')
        this.$router.push('/')
      })

		},
		async googleAuth() {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider).then(async result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;

        await this.$store.dispatch('user/initUser')

        if(result.additionalUserInfo.isNewUser) {
          this.$router.push('/i/init')
        } else {
          this.$router.push('/' + this.$store.state.user.accountId )
        }

      }).catch(error => {
        console.log(error)
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // ...
      });
    },
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