<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half box">
          <h2 class="title">退会</h2>

          <div class="field">
            <label class="label">パスワード確認</label>
            <div class="control">
              <input v-model="password" class="input" type="password" />
            </div>
            <p v-if="errMsg" class="help is-danger">{{ errMsg }}</p>
          </div>

          <div class="field">
            <div class="control">
              <button
                @click="withdraw"
                v-bind:disabled="$v.password.$invalid"
                id="submit"
                class="button is-danger"
              >
                退会する
              </button>
              <n-link :to="'/' + $store.state.user.id" class="button"
                >戻る</n-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      password: '',
      errMsg: ''
    }
  },
  methods: {
    async withdraw() {
      this.errMsg = ''

      try {
        await this.$store.dispatch('user/reauthenticate', {
          password: this.password
        })

        if (window.confirm('アカウントを削除しますがよろしいですか？')) {
          await this.$store.dispatch('user/deleteUser')
          window.alert('アカウントを削除しました')
          this.$router.push('/')
        }
      } catch (e) {
        if (e.code === 'auth/wrong-password') {
          this.errMsg = 'パスワードが正しくありません'
        } else {
          window.alert('退会に失敗しました。再度やり直してください。')
        }
      }
    }
  },
  validations: {
    password: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(20)
    }
  }
}
</script>
