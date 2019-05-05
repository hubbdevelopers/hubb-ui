<template>
  <section class="section">
    <div class="container">
      <div v-if="canEdit">
        <div>
          <div class="field">
            <label class="label">ページ名</label>
            <div class="control">
              <input
                v-model="page.data.name"
                class="input"
                type="text"
                placeholder="Text input"
              />
            </div>
          </div>

          <vue-editor
            @imageAdded="handleImageAdded"
            v-model="page.data.content"
            use-custom-image-handler
          />
          <div class="box image">
            <div class="is-size-5">メイン画像を選択</div>
            <croppa
              :v-model="myCroppa"
              @file-choose="handleCroppaFileChoose"
              :width="100"
              :height="100"
            />
          </div>
          <div class="buttons">
            <button @click="saveContent(false)" class="button is-primary">
              保存
            </button>
            <button @click="saveContent(true)" class="button">
              下書きとして保存
            </button>
          </div>
        </div>
        <div class="back">
          <nuxt-link :to="'/' + $store.state.user.id + '/' + page.id"
            >戻る</nuxt-link
          >
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { storage } from '~/plugins/firebase'
import { VueEditor } from 'vue2-editor'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Page } from '~/common/page'
import uuidv1 from 'uuid/v1'

@Component({
  components: {
    VueEditor
  }
})
export default class extends Vue {
  @Prop({ required: true }) readonly page!: Page
  @Prop({ required: true }) readonly canEdit!: boolean

  myCroppa: string = ''

  async saveContent(isDraft = false) {
    const param = {
      id: this.$route.params.pageId || '',
      isDraft: isDraft,
      name: this.page.data.name || '',
      content: this.page.data.content || '',
      image: this.page.data.image || ''
    }
    await this.$store.dispatch('user/updatePage', param)
    this.$router.push(`/${this.$store.state.user.id}/${this.page.id}`)
  }
  handleImageAdded(file, Editor, cursorLocation, resetUploader) {
    const storageRef = storage.ref()
    const imagePath = 'images/page/' + this.page.id + '/' + uuidv1()
    const imageRef = storageRef.child(imagePath)

    imageRef.put(file).then(() => {
      imageRef.getDownloadURL().then(url => {
        Editor.insertEmbed(cursorLocation, 'image', url)
        resetUploader()
      })
    })
  }
  handleCroppaFileChoose(file) {
    const storageRef = storage.ref()
    const imagePath = 'images/page/' + this.page.id + '/main-image'
    const imageRef = storageRef.child(imagePath)

    imageRef
      .put(file)
      .then(() => {
        imageRef.getDownloadURL().then(url => {
          this.page.data.image = url
        })
      })
      .catch(e => {
        console.log(e)
      })
  }
}
</script>
<style lang="scss" scoped>
.image {
  margin: 10px;
}
.buttons {
  margin: 40px 0;
}
.back {
  margin-top: 20px;
}
</style>
