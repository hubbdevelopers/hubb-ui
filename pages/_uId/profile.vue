<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-three-quarters box">
          <croppa
            v-model="myCroppa"
            :initial-image="$store.state.user.user.image"
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
<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import moment from 'moment'
export default {
  data() {
    return {
      nameInput: '',
      descriptionInput: '',
      birthdayInput: '',
      homepageInput: '',
      facebookInput: '',
      twitterInput: '',
      instagramInput: '',
      myCroppa: {}
    }
  },
  computed: {
    name: {
      get: function() {
        this.nameInput = this.$store.state.user.user.Name || ''
        return this.$store.state.user.user.Name
      },
      set: function(newValue) {
        this.nameInput = newValue
      }
    },
    description: {
      get: function() {
        this.descriptionInput = this.$store.state.user.user.Description || ''
        return this.$store.state.user.user.Description
      },
      set: function(newValue) {
        this.descriptionInput = newValue
      }
    },
    birthday: {
      get: function() {
        this.birthdayInput = this.$store.state.user.user.Birthday || ''
        return moment(this.$store.state.user.user.Birthday).format('YYYY-MM-DD')
      },
      set: function(newValue) {
        this.birthdayInput = newValue
      }
    },
    homepage: {
      get: function() {
        this.homepageInput = this.$store.state.user.user.Homepage || ''
        return this.$store.state.user.user.Homepage
      },
      set: function(newValue) {
        this.homepageInput = newValue
      }
    },
    facebook: {
      get: function() {
        this.facebookInput = this.$store.state.user.user.Facebook || ''
        return this.$store.state.user.user.Facebook
      },
      set: function(newValue) {
        this.facebookInput = newValue
      }
    },
    twitter: {
      get: function() {
        this.twitterInput = this.$store.state.user.user.Twitter || ''
        return this.$store.state.user.user.Twitter
      },

      set: function(newValue) {
        this.twitterInput = newValue
      }
    },
    instagram: {
      get: function() {
        this.instagramInput = this.$store.state.user.user.Instagram || ''
        return this.$store.state.user.user.Instagram
      },
      set: function(newValue) {
        this.instagramInput = newValue
      }
    }
  },
  methods: {
    update() {
      if (this.descriptionInput.length > 100) {
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
    },

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
}
</script>
