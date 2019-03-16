<template>
  <section class="section">
    <div class="container">

      <div class="columns is-centered">
        <div class="column is-half box">
          <h2 class="title">退会</h2>

          <div class="field">
            <label class="label">パスワード確認</label>
            <div class="control">
              <input class="input" type="password" v-model="password">
            </div>
            <p class="help is-danger" v-if="err_msg">{{err_msg}}</p>
          </div>

          <div class="field">
            <div class="control">
              <button class="button is-danger" id="submit" @click='withdraw' v-bind:disabled="$v.password.$invalid">退会する</button>
              <n-link class="button is-link" :to="'/' + $store.state.user.id">Back</n-link>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase'
import { auth } from '~/plugins/firebase'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  data(){
    return {
      password: '',
      err_msg: ''
    }
  },
  methods: {
    async withdraw() {
      this.err_msg = ''

      const user = auth.currentUser;
      const credentials = firebase.auth.EmailAuthProvider.credential(
        this.$store.state.user.user.email,
        this.password
      );

      user.reauthenticateWithCredential(credentials).then(() => {

        if(window.confirm('アカウントを削除しますがよろしいですか？')){
          user.delete().then(() => {
            this.$store.dispatch('user/clearUserState')
            this.$router.push('/')
          }).catch(err => {
            console.log(err)
            window.alert("削除に失敗しました")
          })
        }
      }).catch(err => {
        if(err.code === "auth/wrong-password") {
          this.err_msg = "パスワードが正しくありません"
        }
      })
      
    }
  },
  validations: {
    password: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(20)
    }
  },
}
</script>


