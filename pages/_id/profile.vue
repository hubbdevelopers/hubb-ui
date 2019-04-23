<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-three-quarters box">
          <croppa
            v-model="myCroppa"
            :initial-image="$store.getters['user/getImage']"
          />
          <button
            @click="uploadCroppedImage"
            id="submit"
            class="button is-link"
          >
            Submit
          </button>
          <h2 class="title">設定</h2>

          <div class="field">
            <label class="label">ニックネーム</label>
            <div class="control">
              <input v-model="name" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">自己紹介</label>
            <div class="control">
              <textarea v-model="description" class="textarea" />
            </div>
          </div>

          <div class="field">
            <label class="label">ホームページ</label>
            <div class="control">
              <input
                v-model="homepage"
                class="input"
                type="text"
                placeholder="https://google.com"
              />
            </div>
          </div>
          <label class="label">Twitter</label>
          <div class="field has-addons">
            <p class="control">
              <a class="button is-static">https://twitter.com/</a>
            </p>
            <div class="control is-expanded">
              <input v-model="twitter" class="input" type="text" />
            </div>
          </div>

          <label class="label">Facebook</label>
          <div class="field has-addons">
            <p class="control">
              <a class="button is-static">https://www.facebook.com/</a>
            </p>
            <div class="control is-expanded">
              <input v-model="facebook" class="input" type="text" />
            </div>
          </div>

          <label class="label">Instagram</label>
          <div class="field has-addons">
            <p class="control">
              <a class="button is-static">https://www.instagram.com/</a>
            </p>
            <div class="control is-expanded">
              <input v-model="instagram" class="input" type="text" />
            </div>
          </div>
          <div class="field">
            <label class="label">誕生日</label>
            <div class="control">
              <input v-model="birthday" class="input" type="date" />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button @click="update" id="submit" class="button is-link">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
/* eslint-disable vue/no-side-effects-in-computed-properties */
import moment from 'moment'
import Croppa from 'vue-croppa'
import { Vue, Component } from 'vue-property-decorator'
import PageEdit from '~/components/templates/PageEdit.vue'
import { Page, blankPage, getPage } from '~/common/page'

@Component({
  components: {
    PageEdit
  }
})
export default class extends Vue {
  nameInput: string = this.$store.state.user.data.name
  descriptionInput: string = this.$store.state.user.data.description
  birthdayInput: string = this.$store.state.user.data.birthday
  homepageInput: string = this.$store.state.user.data.homepage
  facebookInput: string = this.$store.state.user.data.facebook
  twitterInput: string = this.$store.state.user.data.twitter
  instagramInput: string = this.$store.state.user.data.instagram
  myCroppa: Croppa = {}

  get name() {
    return this.$store.state.user.data.name
  }

  set name(newValue) {
    this.nameInput = newValue
  }

  get description() {
    return this.$store.state.user.data.description
  }

  set description(newValue) {
    this.descriptionInput = newValue
  }

  get birthday() {
    return this.$store.state.user.data.birthday
  }

  set birthday(newValue) {
    this.birthdayInput = newValue
  }

  get homepage() {
    return this.$store.state.user.data.homepage
  }

  set homepage(newValue) {
    this.homepageInput = newValue
  }

  get facebook() {
    return this.$store.state.user.data.facebook
  }

  set facebook(newValue) {
    this.facebookInput = newValue
  }

  get twitter() {
    return this.$store.state.user.data.twitter
  }

  set twitter(newValue) {
    this.twitterInput = newValue
  }

  get instagram() {
    return this.$store.state.user.data.instagram
  }

  set instagram(newValue) {
    this.instagramInput = newValue
  }

  update() {
    console.log(this.descriptionInput)
    if (this.descriptionInput && this.descriptionInput.length > 100) {
      window.alert('自己紹介は100文字までです')
      return
    }
    const param = {
      name: this.nameInput,
      description: this.descriptionInput,
      birthday: this.birthdayInput,
      homepage: this.homepageInput,
      facebook: this.facebookInput,
      twitter: this.twitterInput,
      instagram: this.instagramInput
    }

    this.$store
      .dispatch('user/updateProfile', param)
      .then(() => {
        this.$router.push(`/${this.$store.state.user.id}`)
      })
      .catch(err => {
        console.log(err)
        window.alert('error')
      })
  }

  uploadCroppedImage() {
    this.myCroppa.generateBlob(
      blob => {
        if (!blob) {
          return
        }

        this.$store
          .dispatch('user/updateImage', blob)
          .then(() => {
            this.$router.push(`/${this.$store.state.user.id}`)
          })
          .catch(err => {
            console.log(err)
            window.alert('error')
          })
      },
      'image/*',
      0.8
    ) // 80% compressed jpeg file
  }
}
</script>
