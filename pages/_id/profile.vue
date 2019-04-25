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
              <input v-model="nameInput" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">自己紹介</label>
            <div class="control">
              <textarea v-model="descriptionInput" class="textarea" />
            </div>
          </div>

          <div class="field">
            <label class="label">ホームページ</label>
            <div class="control">
              <input
                v-model="homepageInput"
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
              <input v-model="twitterInput" class="input" type="text" />
            </div>
          </div>

          <label class="label">Facebook</label>
          <div class="field has-addons">
            <p class="control">
              <a class="button is-static">https://www.facebook.com/</a>
            </p>
            <div class="control is-expanded">
              <input v-model="facebookInput" class="input" type="text" />
            </div>
          </div>

          <label class="label">Instagram</label>
          <div class="field has-addons">
            <p class="control">
              <a class="button is-static">https://www.instagram.com/</a>
            </p>
            <div class="control is-expanded">
              <input v-model="instagramInput" class="input" type="text" />
            </div>
          </div>
          <div class="field">
            <label class="label">誕生日</label>
            <div class="control">
              <input v-model="birthdayInput" class="input" type="date" />
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
import Croppa from 'vue-croppa'
import { Vue, Component, Watch } from 'vue-property-decorator'
import PageEdit from '~/components/templates/PageEdit.vue'

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

  @Watch('$store.state.user.data.name')
  onNameChanged(val: string) {
    this.nameInput = val
  }

  @Watch('$store.state.user.data.description')
  onDescriptionChanged(val: string) {
    this.descriptionInput = val
  }

  @Watch('$store.state.user.data.birthday')
  onBirthdayChanged(val: string) {
    this.birthdayInput = val
  }

  @Watch('$store.state.user.data.homepage')
  onHomepageChanged(val: string) {
    this.homepageInput = val
  }

  @Watch('$store.state.user.data.facebook')
  onFacebookChanged(val: string) {
    this.facebookInput = val
  }

  @Watch('$store.state.user.data.twitter')
  onTwitterChanged(val: string) {
    this.twitterInput = val
  }

  @Watch('$store.state.user.data.instagram')
  onInstagramChanged(val: string) {
    this.instagramInput = val
  }

  update() {
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
