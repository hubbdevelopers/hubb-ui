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

          <div class="has-text-centered">
            <app-button @click="submit" :disabled="$v.$invalid" type="primary"
              >設定変更</app-button
            >
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
import { Vue, Component } from 'vue-property-decorator'
import AppButton from '~/components/atoms/AppButton.vue'

@Component({
  components: {
    AppButton
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
  },
  beforeRouteEnter(to, from, next) {
    if (from.path !== '/i/signup') {
      next('/')
    } else {
      next()
    }
  },
  head() {
    return {
      meta: [{ name: 'robots', content: 'noindex' }]
    }
  }
})
export default class extends Vue {
  accountId = ''
  name = ''
  isValidAccountId = true
  errMsg = ''

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
}
</script>
