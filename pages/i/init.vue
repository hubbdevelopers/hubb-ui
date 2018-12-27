<template>
  <section class="section">
    <div class="container">

      <div class="columns is-centered">
        <div class="column is-half box">
          <h2 class="title">初期設定</h2>

          <div class="field">
            <label class="label">アカウントID</label>
            <div class="control">
              <input class="input" type="text" v-model="account_id" :class="{ 'is-danger': !is_valid_account_id }" >
            </div>
            <p class="help">3文字以上の英数字</p>
            <p class="help is-danger" v-if="!is_valid_account_id">{{err_msg}}</p>
          </div>

          <div class="field">
            <label class="label">ニックネーム(登録後に変更可能)</label>
            <div class="control">
              <input class="input" type="text" v-model="name">
            </div>
            <p class="help">日本語入力可能</p>
          </div>

          <div class="field">
            <div class="control">
              <button class="button is-link" id="submit" @click='submit' v-bind:disabled="$v.account_id.$invalid || $v.name.$invalid">Submit</button>
              <nuxt-link class="button is-link" to="/">Back</nuxt-link>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { required, minLength, maxLength, alphaNum } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'

export default {
  data(){
    return {
      account_id: "",
      name: "",
      is_valid_account_id: true,
      is_valid_name: true,
      err_msg: ''
    }
  },
  methods: {
    submit() {
      this.is_valid_account_id = true
      this.err_msg = ''

      const param = {
        account_id: this.account_id,
        name: this.name
      }

      this.$store.dispatch('user/initialUpdate', param).then(res => {
        this.$store.commit('user/updateAccountId', this.account_id)
        this.$router.push('/' + this.account_id)
      }).catch(err => {
        window.alert(err)
      })

      // this.checkAccountId().then(async () => {

      //   //await this.$store.dispatch('user/initialUpdate', param)
      //   // this.$store.dispatch('user/updateAccountId', this.account_id)
      //   // this.$store.dispatch('user/updateName', this.name)



      //   //this.$router.push('/' + this.account_id)
      // }).catch((err) => {
      //   console.log(err)
      //   this.is_valid_account_id = false
      //   this.err_msg = 'このアカウントIDはすでに使用されています'
      // })


    }
  },
  validations: {
    account_id: {
      required,
      alphaNum,
      minLength: minLength(3),
      maxLength: maxLength(20)
    },
    name: {
      required
    }
  }
}
</script>


