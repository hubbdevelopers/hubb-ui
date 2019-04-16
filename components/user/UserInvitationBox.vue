<template>
  <div>
    <div v-if="user" class="card">
      <div class="card-image">
        <nuxt-link :to="'/' + user.id">
          <figure class="image is-4by3">
            <img
              v-if="user.data.image"
              v-bind:src="user.data.image"
              alt="ユーザー画像"
            />
            <img
              v-else
              src="https://bulma.io/images/placeholders/1280x960.png"
              alt="Placeholder image"
            />
          </figure>
        </nuxt-link>
      </div>
      <div class="card-content">
        <p class="title">{{ user.data.name }}</p>
        <p class="subtitle">@{{ user.id }}</p>
        <!--div class="content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Phasellus nec iaculis mauris.
        </div-->
        <div v-if="!isMyself">
          <button
            v-if="isFollowingUser"
            @click="unFollow"
            class="button is-primary"
          >
            フォロー中
          </button>
          <button v-else @click="follow" class="button is-primary is-outlined">
            フォローする
          </button>
        </div>
        <div>
          <button @click="withdraw" class="button is-danger">
            招待を取り下げる
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { db } from '~/plugins/firebase'

export default {
  props: {
    user: {
      type: Object,
      default: function() {
        return {}
      }
    },
    community: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    isFollowingUser: function() {
      return this.$store.getters['user/isFollowingUser'](this.user.id)
    },
    isMyself: function() {
      return this.$store.getters['user/isMyAccountId'](this.user.id)
    }
  },
  methods: {
    follow() {
      this.$store.dispatch('user/followUser', this.user.id).catch(err => {
        console.log(err)
        window.alert('error')
      })
    },
    unFollow() {
      this.$store.dispatch('user/unFollowUser', this.user.id).catch(err => {
        console.log(err)
        window.alert('error')
      })
    },
    async withdraw() {
      const usersRef = db.collection('/users')
      const communitiesRef = db.collection('/communities')

      const batch = db.batch()

      const notificationQuery = await usersRef
        .doc(this.user.id)
        .collection('notifications')
        .where('type', '==', 'community_invitation')
        .where('community', '==', this.community.id)
        .get()
      const notificationRef = notificationQuery.docs[0].ref
      batch.delete(notificationRef)

      const invitationRef = communitiesRef
        .doc(this.community.id)
        .collection('invitations')
        .doc(this.user.id)
      batch.delete(invitationRef)

      batch
        .commit()
        .then(() => {
          window.alert('コミュニティへの招待を取り下げました。')
        })
        .catch(error => {
          console.log(error)
          window.alert('エラーが発生しました')
        })
    }
  }
}
</script>
