<template>
  <section class="section">
    <div class="container">
      <div v-if="canEdit">
        編集可能です
        <button @click="saveContent" class="button is-primary">保存</button>
        <input v-model="page.data.isDraft" id="draft" type="checkbox" />
        <label for="draft">下書きとして保存</label>
        <div>
          <div class="field">
            <croppa :v-model="myCroppa" @file-choose="handleCroppaFileChoose" />
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
        </div>
        <nuxt-link :to="'/' + $store.state.user.accountId + '/' + page.ID"
          >戻る</nuxt-link
        >
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { storage } from '~/plugins/firebase'
import { VueEditor } from 'vue2-editor'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Page } from '~/common/page'

@Component({
  components: {
    VueEditor
  }
})
export default class extends Vue {
  @Prop({ required: true }) readonly page!: Page
  @Prop({ required: true }) readonly canEdit!: boolean

  myCroppa: string = ''

  async saveContent() {
    const param = {
      id: this.$route.params.pageId || '',
      isDraft: this.page.data.isDraft || true,
      name: this.page.data.name || '',
      content: this.page.data.content || '',
      image: this.page.data.image || ''
    }
    await this.$store.dispatch('user/updatePage', param)
    this.$router.push(`/${this.$store.state.user.id}/${this.page.id}`)
  }
  handleImageAdded(file, Editor, cursorLocation, resetUploader) {
    const storageRef = storage.ref()
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const uuidv1 = require('uuid/v1')
    const imagePath = 'images/page/' + this.page.id + '/' + uuidv1()
    const imageRef = storageRef.child(imagePath)

    console.log(imageRef)
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
    console.log(imageRef)

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
