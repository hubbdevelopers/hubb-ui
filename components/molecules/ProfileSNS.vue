<template>
  <div>
    <profile-icon-homepage v-if="homepageUrl" :url="homepageUrl" />
    <profile-icon-twitter v-if="twitterId" :twitter-id="twitterId" />
    <profile-icon-instagram v-if="instagramId" :instagram-id="instagramId" />
    <profile-icon-facebook v-if="facebookId" :facebook-id="facebookId" />
  </div>
</template>
<script>
import ProfileIconFacebook from '~/components/atoms/ProfileIconFacebook'
import ProfileIconHomepage from '~/components/atoms/ProfileIconHomepage'
import ProfileIconInstagram from '~/components/atoms/ProfileIconInstagram'
import ProfileIconTwitter from '~/components/atoms/ProfileIconTwitter'

export default {
  components: {
    ProfileIconHomepage,
    ProfileIconTwitter,
    ProfileIconInstagram,
    ProfileIconFacebook
  },
  props: {
    homepageUrl: {
      type: String,
      default: ''
    },
    facebookId: {
      type: String,
      default: ''
    },
    instagramId: {
      type: String,
      default: ''
    },
    twitterId: {
      type: String,
      default: ''
    }
  }
}
</script>
