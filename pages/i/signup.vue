<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half box">
          <h2 class="title has-text-centered">新規登録</h2>

          <div class="field">
            <label class="label">メールアドレス</label>
            <div class="control">
              <input
                v-model="email"
                :class="{ 'is-danger': !isValidEmail }"
                class="input"
                type="email"
              />
            </div>
            <p v-if="!isValidEmail" class="help is-danger">{{ errMsg }}</p>
          </div>

          <div class="field">
            <label class="label">パスワード(英数字8文字以上)</label>
            <div class="control">
              <input v-model="password" class="input" type="password" />
            </div>
          </div>

          <div class="has-text-centered">
            <app-button @click="signup" :disabled="$v.$invalid" type="primary"
              >新規登録</app-button
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'
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
      minLength: minLength(8),
      maxLength: maxLength(20)
    }
  }
})
export default class extends Vue {
  email = ''
  password = ''
  isValidEmail = true
  errMsg = ''

  async signup() {
    this.isValidEmail = true
    this.errMsg = ''

    const param = {
      email: this.email,
      password: this.password
    }

    try {
      // TODO check email address
      await this.$store.dispatch('user/signup', param)
      this.$router.push('/i/init')
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        this.isValidEmail = false
        this.errMsg = 'このメールアドレスはすでに使用されています'
      }
      console.log(e)
    }
  }
}
</script>
<style lang="scss" scoped></style>
