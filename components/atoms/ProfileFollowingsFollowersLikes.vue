<template>
  <div>
    <p>
      フォロー:
      <nuxt-link :to="'/' + id + '/followings'">{{ followingCount }}</nuxt-link>
    </p>
    <p>
      フォロワー:
      <nuxt-link :to="'/' + id + '/followers'">{{ followerCount }}</nuxt-link>
    </p>
    <p>
      いいね:
      <nuxt-link :to="'/' + id + '/likes'">{{ likeCount }}</nuxt-link>
    </p>
  </div>
</template>
<script>
export default {
  props: {
    id: {
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
