<template>
  <div>
    <p>
      フォロー:
      <nuxt-link :to="'/' + userId + '/followings'">{{
        followingCount
      }}</nuxt-link>
    </p>
    <p>
      フォロワー:
      <nuxt-link :to="'/' + userId + '/followers'">{{
        followerCount
      }}</nuxt-link>
    </p>
    <p>
      いいね:
      <nuxt-link :to="'/' + userId + '/likes'">{{ likeCount }}</nuxt-link>
    </p>
  </div>
</template>
<script>
export default {
  props: {
    userId: {
      type: Number,
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
