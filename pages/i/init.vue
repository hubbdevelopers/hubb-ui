<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half box">
          <h2 class="title">初期設定</h2>

          <div class="field">
            <label class="label">アカウントID</label>
            <div class="control">
              <input
                v-model="accountId"
                :class="{ 'is-danger': !isValidAccountId }"
                class="input"
                type="text"
              />
            </div>
            <p class="help">3文字以上の英数字</p>
            <p v-if="!isValidAccountId" class="help is-danger">
              {{ errMsg }}
            </p>
          </div>

          <div class="field">
            <label class="label">ニックネーム(登録後に変更可能)</label>
            <div class="control">
              <input v-model="name" class="input" type="text" />
            </div>
            <p class="help">日本語入力可能</p>
          </div>

          <div class="field">
            <div class="control">
              <button
                @click="submit"
                v-bind:disabled="$v.accountId.$invalid || $v.name.$invalid"
                id="submit"
                class="button is-link"
              >
                Submit
              </button>
              <nuxt-link class="button is-link" to="/">Back</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  required,
  minLength,
  maxLength,
  alphaNum
} from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      accountId: '',
      name: '',
      isValidAccountId: true,
      errMsg: ''
    }
  },
  methods: {
    submit() {
      this.isValidAccountId = true
      this.errMsg = ''

      const param = {
        accountId: this.accountId,
        name: this.name
      }

      this.$store
        .dispatch('user/initialUpdate', param)
        .then(() => {
          this.$router.push(`/${this.$store.state.user.id}`)
        })
        .catch(err => {
          window.alert(err)
        })

      // this.checkAccountId().then(async () => {

      //   //await this.$store.dispatch('user/initialUpdate', param)
      //   // this.$store.dispatch('user/updateAccountId', this.accountId)
      //   // this.$store.dispatch('user/updateName', this.name)

      //   //this.$router.push('/' + this.accountId)
      // }).catch((err) => {
      //   console.log(err)
      //   this.isValidAccountId = false
      //   this.errMsg = 'このアカウントIDはすでに使用されています'
      // })
    }
  },
  validations: {
    accountId: {
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
