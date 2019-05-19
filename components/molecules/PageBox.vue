<template>
  <section class="page-box">
    <div class="is-clearfix">
      <div class="is-pulled-left left-area">
        <div class="name">
          <n-link :to="link">
            <h1 class="">
              {{ page.data.name }}
            </h1>
          </n-link>
        </div>
        <span v-if="page.data.isDraft" class="is-size-7 has-text-danger"
          >下書き</span
        >
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
      <div class="is-pulled-right right-area">
        <figure class="image is-96x96 image-box">
          <n-link :to="link">
            <img
              v-if="page.data.image"
              v-bind:src="page.data.image"
              class=" image-box"
              alt="ページ画像"
            />
            <img
              v-else
              src="https://bulma.io/images/placeholders/128x128.png"
              alt="ページ画像"
            />
          </n-link>
        </figure>
        <template v-if="!isTimeline">
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
        </template>
      </div>
    </div>
  </section>
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
  @Prop({ default: false }) readonly isTimeline!: boolean
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
      return '/' + this.page.data.ownerId + '/pages/' + this.page.id
    } else if (this.page.data.ownerType === 'community') {
      return '/i/community/' + this.page.data.ownerId + '/pages/' + this.page.id
    } else {
      return '/'
    }
  }

  get likeCount(): number {
    return this.page.likedBy ? this.page.likedBy.length : 0
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
  width: 100%;
  position: relative;
  box-shadow: 0 2px 3px rgba($black, 0.1), 0 0 0 1px rgba($black, 0.1);
  padding: 5px 10px;
  border-radius: 5px;
}

.left-area {
  width: 70%;
}

.right-area {
  width: 30%;
  text-align: center;
  vertical-align: middle;
}

.content {
  margin-top: 5px;
  overflow: hidden;
  word-wrap: break-word;
  width: 100%;
  p {
    font-size: 12px;
    height: 12px * 1.2 * 2;
    line-height: 1.4;
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

.likes-comments {
  font-size: 12px;
  margin-top: 5px;
}

.likes {
  margin-right: 5px;
}

.name {
  font-size: 15px;
  line-height: 20px;
}

.image {
  padding: 10px;
  margin: auto;
}
</style>
