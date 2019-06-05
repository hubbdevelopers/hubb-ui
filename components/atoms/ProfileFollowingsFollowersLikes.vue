<template>
  <div>
    <div>
      フォロー:
      <nuxt-link :to="'/' + id + '/followings'">{{ followingCount }}</nuxt-link>
    </div>
    <div>
      フォロワー:
      <nuxt-link :to="'/' + id + '/followers'">{{ followerCount }}</nuxt-link>
    </div>
    <div>
      いいね:
      <nuxt-link :to="'/' + id + '/likes'">{{ likeCount }}</nuxt-link>
    </div>
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
