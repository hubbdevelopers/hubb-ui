<template>
  <div>
    <p>
      フォロー:
      <nuxt-link :to="'/' + uid + '/followings'">{{
        followingCount
      }}</nuxt-link>
    </p>
    <p>
      フォロワー:
      <nuxt-link :to="'/' + uid + '/followers'">{{ followerCount }}</nuxt-link>
    </p>
    <p>
      いいね:
      <nuxt-link :to="'/' + uid + '/likes'">{{ likeCount }}</nuxt-link>
    </p>
  </div>
</template>
<script>
export default {
  props: {
    uid: {
      type: String,
      required: true
    },
    followingCount: {
      type: Number,
      required: true
    },
    followerCount: {
      type: Number,
      required: true
    },
    likeCount: {
      type: Number,
      required: true
    }
  }
}
</script>
