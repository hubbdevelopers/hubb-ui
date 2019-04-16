<template>
  <div class="is-clearfix page-box">
    <div class="is-clearfix">
      <div class="is-pulled-left left-area">
        <n-link :to="link">
          <h1 class="is-size-4">{{ page.Name }}</h1>
        </n-link>
        <div class="content">
          <p>{{ content }}</p>
        </div>
        <page-owner-info
          :owner="user"
          :page="page"
          :isUser="true"
          class="page-owner-info"
        />
      </div>
      <div class="is-pulled-right">
        <figure class="image is-96x96">
          <n-link :to="link">
            <img v-if="page.Image" v-bind:src="page.Image" alt="ページ画像" />
            <img
              v-else
              src="https://bulma.io/images/placeholders/128x128.png"
              alt="ページ画像"
            />
          </n-link>
        </figure>
        <div class="likes-comments">
          <span class="likes">
            <i class="far fa-heart" />
            {{ likes.length }}
          </span>
          <span class="comments">
            <i class="far fa-comment" />
            {{ comments.length }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateMixin from '~/mixins/dateMixin'
import PageOwnerInfo from '~/components/molecules/PageOwnerInfo.vue'
export default {
  components: {
    PageOwnerInfo
  },
  mixins: [dateMixin],
  props: {
    pageId: { type: String, required: true }
  },
  data() {
    return {
      page: {},
      user: {},
      comments: [],
      likes: []
    }
  },
  computed: {
    link() {
      if (this.page.OwnerType === 'users') {
        return '/' + this.user.AccountId + '/' + this.page.ID
      } else if (this.page.OwnerType === 'communities') {
        return '/i/community/' + this.page.OwnerId + '/' + this.page.ID
      } else {
        return '/'
      }
    },
    content() {
      const temp = document.createElement('div')
      temp.innerHTML = this.page.Content
      return temp.textContent || temp.innerText || ''
    }
  },
  async created() {
    try {
      this.page = (await this.$axios.$get(`pages/${this.pageId}`)).data
      if (this.page.OwnerType === 'users') {
        this.user = (await this.$axios.$get(`users/${this.page.OwnerId}`)).data
      } else if (this.page.OwnerType === 'communities') {
        // TODO
      }
      this.comments = (await this.$axios.$get(
        `comments?pageid=${this.pageId}`
      )).data
      this.likes = (await this.$axios.$get(`likes?pageid=${this.pageId}`)).data
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: gray;
}

a:hover {
  text-decoration: none;
  color: gray;
}

.page-box {
  max-width: 360px;
  position: relative;
  box-shadow: 1px 1px 2px gray;
  margin-top: 1px;
  padding: 5px 10px;
}

.left-area {
  width: 70%;
}

.content {
  overflow: hidden;
  width: 100%;
  p {
    font-size: 12px;
    height: 12px * 1.2 * 2;
    line-height: 1.2;
    position: relative;
    &:before,
    &:after {
      position: absolute;
    }
    &:after {
      content: '';
      height: 100%;
      width: 100%;
    }
  }
}

.is-ellipsis-1 {
  -webkit-line-clamp: 1;
}

.page-owner-info {
  position: absolute;
  bottom: 5px;
}

.likes-comments {
  font-size: 12px;
  margin-top: 5px;
}

.likes {
  margin-right: 5px;
}
</style>
