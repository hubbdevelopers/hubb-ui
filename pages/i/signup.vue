<template>
  <section class="section">
    <div class="container">

      <div class="columns is-centered">
        <div class="column is-half box">
          <h2 class="title  has-text-centered">Signup To Hubb!</h2>

          <div class="field">
            <label class="label">メールアドレス</label>
            <div class="control">
              <input class="input" type="email" v-model="email" placeholder="e.g. alexsmith@gmail.com" :class="{ 'is-danger': !is_valid_email }">
            </div>
            <p class="help is-danger" v-if="!is_valid_email">{{err_msg}}</p>
          </div>

          <div class="field">
            <label class="label">パスワード(英数字8文字以上)</label>
            <div class="control">
              <input class="input" type="password" v-model="password">
            </div>
          </div>

          <div class="has-text-centered">
            <button class="button is-primary" id="submit" @click='signup' v-bind:disabled="$v.email.$invalid || $v.password.$invalid">Submit</button>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase'
import { auth } from '~/plugins/firebase'
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'

export default {
  data(){
    return {
      email: '',
      password: '',
      is_valid_email: true,
      err_msg: ''
    }
  },
  methods: {
    async signup() {
      this.is_valid_email = true
      this.err_msg = ''

      const param = {
        email: this.email,
        password: this.password
      }

      try {
        // TODO check email address
        await this.$store.dispatch('user/signup', param)
        this.$router.push('/i/init')
      } catch(e) {
        if(e.code === "auth/email-already-in-use") {
          this.is_valid_email = false
          this.err_msg = 'このメールアドレスはすでに使用されています'
        }
        console.log(e)
      }
     

      // auth.createUserWithEmailAndPassword(param.email, param.password).then(async res => {
      //   //await this.$store.dispatch('user/initUser')
      //   this.$router.push('/i/init')
      // }).catch(err => {
      //   if(err.code === "auth/email-already-in-use") {
      //     this.is_valid_email = false
      //     this.err_msg = 'このメールアドレスはすでに使用されています'
      //   }
      // })
      
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(20)
    }
  }
}
</script>


