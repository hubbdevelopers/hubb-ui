<template>
  <div class="is-clearfix page-box">
    <div class="is-clearfix">
      <div class="is-pulled-left left-area">
        <n-link :to="link">
          <h1 class="is-size-4">{{ page.data.name }}</h1>
        </n-link>
        <div class="content">
          <p>{{ parsedContent }}</p>
        </div>
        <page-owner-info
          :owner="displayUser"
          :page="page"
          :isUser="true"
          class="page-owner-info"
        />
      </div>
      <div class="is-pulled-right">
        <figure class="image is-96x96">
          <n-link :to="link">
            <img
              v-if="page.data.image"
              v-bind:src="page.data.image"
              alt="ページ画像"
            />
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
            {{ likeCount }}
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

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import PageOwnerInfo from '~/components/molecules/PageOwnerInfo.vue'
import { Page } from '~/common/page'
import { User, blankUser, getUser } from '~/common/user'
import { Comment, getCommentsByPageId } from '~/common/comment'

@Component({
  components: {
    PageOwnerInfo
  }
})
export default class extends Vue {
  @Prop({
    default: blankUser
  })
  readonly user!: User
  @Prop({ required: true }) readonly page!: Page
  comments: Comment[] = []

  createdUser: User = blankUser

  get displayUser() {
    return this.user.id ? this.user : this.createdUser
  }

  get parsedContent() {
    var span = document.createElement('span')
    span.innerHTML = this.page.data.content || ''
    return span.textContent || span.innerText
  }
  get link() {
    if (this.page.data.ownerType === 'user') {
      return '/' + this.page.data.ownerId + '/' + this.page.id
    } else if (this.page.data.ownerType === 'community') {
      return '/i/community/' + this.page.data.ownerId + '/' + this.page.id
    } else {
      return '/'
    }
  }

  get likeCount(): number {
    return this.page.data.likedBy ? this.page.data.likedBy.length : 0
  }

  async created() {
    try {
      this.comments = await getCommentsByPageId(this.page.id)
      if (this.user.id === '') {
        this.createdUser = await getUser(this.page.data.ownerId)
      }
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
  word-wrap: break-word;
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
