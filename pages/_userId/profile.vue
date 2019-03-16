<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-three-quarters box">
          <croppa
            v-model="myCroppa"
            :initial-image="$store.state.user.user.image"/>
          <button class="button is-link" id="submit" @click="uploadCroppedImage">Submit</button>
          <h2 class="title">設定</h2>

          <div class="field">
            <label class="label">ニックネーム</label>
            <div class="control">
              <input class="input" type="text" v-model="name">
            </div>
          </div>

          <div class="field">
            <label class="label">自己紹介</label>
            <div class="control">
              <textarea class="textarea" v-model="description"></textarea>
            </div>
          </div>

          <div class="field">
            <label class="label">ホームページ</label>
            <div class="control">
              <input class="input" type="text" v-model="homepage" placeholder="https://google.com">
            </div>
          </div>
          <label class="label">Twitter</label>
          <div class="field has-addons">
            <p class="control">
              <a class="button is-static">
               https://twitter.com/
              </a>
            </p>
            <div class="control is-expanded">
              <input class="input" type="text" v-model="twitter">
            </div>
          </div>

          <label class="label">Facebook</label>
          <div class="field has-addons">
            <p class="control">
              <a class="button is-static">
               https://www.facebook.com/
              </a>
            </p>
            <div class="control is-expanded">
              <input class="input" type="text" v-model="facebook">
            </div>
          </div>

          <label class="label">Instagram</label>
          <div class="field has-addons">
            <p class="control">
              <a class="button is-static">
                https://www.instagram.com/
              </a>
            </p>
            <div class="control is-expanded">
              <input class="input" type="text" v-model="instagram">
            </div>
          </div>
          <div class="field">
            <label class="label">誕生日</label>
            <div class="control">
              <input class="input" type="date" v-model="birthday">
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button class="button is-link" id="submit" @click="update">Submit</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      name_input: '',
      description_input: '',
      birthday_input: '',
      homepage_input: '',
      facebook_input: '',
      twitter_input: '',
      instagram_input: '',
      myCroppa: {}
    }
  },
  methods: {
    update() {
      const param = {
        name: this.name_input,
        description: this.description_input,
        birthday: this.birthday_input,
        homepage: this.homepage_input,
        facebook: this.facebook_input,
        twitter: this.twitter_input,
        instagram: this.instagram_input
      }

      this.$store.dispatch('user/updateProfile', param).then(res => {
        this.$router.push('/' + this.$store.state.user.id )
      }).catch(err => {
        window.alert("error")
      })
    },

    uploadCroppedImage() {
      this.myCroppa.generateBlob(
        blob => {
        if(!blob) { return }

        this.$store.dispatch('user/updateImage', blob).then(res => {
          this.$router.push('/' + this.$store.state.user.id )
        }).catch(err => {
          window.alert("error")
        })
  
        },
        'image/*', 0.8
        ); // 80% compressed jpeg file
    }
  },
  computed: {
    name: {
      get: function () {
        this.name_input = this.$store.state.user.user.Name || ''
        return this.$store.state.user.user.Name
      },
      set: function (newValue) {
        this.name_input = newValue
      }
    },
    description: {
      get: function () {
        this.description_input = this.$store.state.user.user.Description || ''
        return this.$store.state.user.user.Description
      },
      set: function (newValue) {
        this.description_input = newValue
      }
    },
    birthday: {
      get: function () {
        this.birthday_input = this.$store.state.user.user.Birthday || ''
        return moment(this.$store.state.user.user.Birthday).format('YYYY-MM-DD')
      },
      set: function (newValue) {
        this.birthday_input = newValue
      }
    },
    homepage: {
      get: function () {
        this.homepage_input = this.$store.state.user.user.Homepage || ''
        return this.$store.state.user.user.Homepage
      },
      set: function (newValue) {
        this.homepage_input = newValue
      }
    },
    facebook: {
      get: function () {
        this.facebook_input = this.$store.state.user.user.Facebook || ''
        return this.$store.state.user.user.Facebook
      },
      set: function (newValue) {
        this.facebook_input = newValue
      }
    },
    twitter: {
      get: function () {
        this.twitter_input = this.$store.state.user.user.Twitter || ''
        return this.$store.state.user.user.Twitter
      },
      set: function (newValue) {
        this.twitter_input = newValue
      }
    },
    instagram: {
      get: function () {
        this.instagram_input = this.$store.state.user.user.Instagram || ''
        return this.$store.state.user.user.Instagram
      },
      set: function (newValue) {
        this.instagram_input = newValue
      }
    }
  }
}
</script>
