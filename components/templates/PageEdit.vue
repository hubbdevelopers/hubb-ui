<template>
  <section class="section">
    <div class="container">
      <div v-if="canEdit">
        <div>
          <div class="field">
            <label class="label">ページ名</label>
            <div class="control">
              <input
                v-model="name"
                class="input"
                type="text"
                placeholder="Text input"
              />
            </div>
            <div v-if="!$v.name.maxLength" class="has-text-danger">
              ページ名は50文字まで使用できます
            </div>
          </div>

          <vue-editor
            @imageAdded="handleImageAdded"
            v-model="content"
            use-custom-image-handler
          />
          <div class="box image">
            <div class="is-size-5">メイン画像を選択</div>
            <croppa
              @file-choose="handleCroppaFileChoose"
              :width="100"
              :height="100"
            />
          </div>
          <div class="has-text-centered">
            <div>
              <app-button
                :disabled="$v.$invalid"
                @click="saveContent(false)"
                :width="250"
                type="primary"
                >保存</app-button
              >
            </div>
            <div>
              <app-button
                :disabled="$v.$invalid"
                @click="
                  $router.push(
                    `/${$route.params.id}/pages/${$route.params.pageId}/preview`
                  )
                "
                :width="250"
                type="primary"
                class="preview-button"
                >プレビュー</app-button
              >
            </div>
            <div>
              <app-button
                :disabled="$v.$invalid"
                v-if="page.data.isDraft"
                @click="saveContent(true)"
                :width="250"
                class="draft-button"
                >下書きとして保存</app-button
              >
            </div>
            <div>
              <app-button
                :disabled="$v.$invalid"
                @click="
                  $router.push(
                    `/${$route.params.id}/pages/${$route.params.pageId}`
                  )
                "
                :width="250"
                class="back-button"
                >戻る</app-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { required, maxLength } from 'vuelidate/lib/validators'
import { storage } from '~/plugins/firebase'
import { VueEditor } from 'vue2-editor'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Page } from '~/common/page'
import uuidv1 from 'uuid/v1'
import AppButton from '~/components/atoms/AppButton.vue'

@Component({
  validations: {
    name: {
      required,
      maxLength: maxLength(50)
    }
  },
  components: {
    VueEditor,
    AppButton
  }
})
export default class extends Vue {
  @Prop({ required: true }) readonly page!: Page
  @Prop({ required: true }) readonly canEdit!: boolean

  get name(): string {
    return this.$store.state.page.name
  }

  set name(name: string) {
    this.$store.dispatch('page/setName', name)
  }

  get content(): string {
    return this.$store.state.page.content
  }

  set content(content: string) {
    this.$store.dispatch('page/setContent', content)
  }

  get image(): string {
    return this.$store.state.page.image
  }

  set image(image: string) {
    this.$store.dispatch('page/setImage', image)
  }

  @Watch('page', { immediate: true, deep: true })
  onPageChanged(page: Page) {
    this.$store.dispatch('page/setPage', this.page)
    this.name = page.data.name
    this.content = page.data.content
    this.image = page.data.image
  }

  async saveContent(isDraft = false) {
    const param = {
      id: this.$route.params.pageId,
      isDraft: isDraft,
      name: this.name,
      content: this.content,
      image: this.image
    }
    await this.$store.dispatch('user/updatePage', param)
    this.$store.dispatch('page/resetPage')
    this.$router.push(`/${this.$store.state.user.id}/pages/${this.page.id}`)
  }

  // ページ内のイメージ
  handleImageAdded(file, Editor, cursorLocation, resetUploader) {
    const storageRef = storage.ref()
    const imagePath = 'pages/' + this.page.id + '/' + uuidv1()
    const imageRef = storageRef.child(imagePath)

    imageRef.put(file).then(() => {
      imageRef.getDownloadURL().then(url => {
        Editor.insertEmbed(cursorLocation, 'image', url)
        resetUploader()
      })
    })
  }

  // メインイメージ
  handleCroppaFileChoose(file) {
    const storageRef = storage.ref()
    const imagePath = 'pages/' + this.page.id + '/main-image'
    const imageRef = storageRef.child(imagePath)

    imageRef
      .put(file)
      .then(() => {
        imageRef.getDownloadURL().then(url => {
          this.image = url
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
.back {
  margin-top: 20px;
}
.draft-button,
.preview-button,
.back-button {
  margin-top: 10px;
}
</style>
