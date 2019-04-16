<template>
  <section class="section">
    <div class="container">
      <div v-if="canEdit">
        編集可能です
        <button @click="saveContent" class="button is-primary">保存</button>
        <input v-model="page.Draft" id="draft" type="checkbox" />
        <label for="draft">下書きとして保存</label>
        <div>
          <div class="field">
            <croppa :v-model="myCroppa" @file-choose="handleCroppaFileChoose" />
            <label class="label">ページ名</label>
            <div class="control">
              <input
                v-model="page.Name"
                class="input"
                type="text"
                placeholder="Text input"
              />
            </div>
          </div>

          <vue-editor
            @imageAdded="handleImageAdded"
            v-model="page.Content"
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
<script>
import { storage } from '~/plugins/firebase'
import { VueEditor } from 'vue2-editor'

export default {
  components: {
    VueEditor
  },
  props: {
    canEdit: {
      type: Boolean,
      default: false
    },
    page: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      myCroppa: ''
    }
  },
  methods: {
    saveContent: async function() {
      const param = {
        draft: this.page.Draft,
        name: this.page.Name,
        content: this.page.Content,
        image: this.page.Image
      }
      await this.$axios.$put(`/pages/${this.$route.params.pageId}`, param)
      this.$router.push(`/${this.$store.state.user.id}/${this.page.ID}`)
    },
    handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
      const storageRef = storage.ref()
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const uuidv1 = require('uuid/v1')
      const imagePath = 'images/page/' + this.page.ID + '/' + uuidv1()
      const imageRef = storageRef.child(imagePath)

      imageRef.put(file).then(() => {
        imageRef.getDownloadURL().then(url => {
          Editor.insertEmbed(cursorLocation, 'image', url)
          resetUploader()
        })
      })
    },
    handleCroppaFileChoose(file) {
      const storageRef = storage.ref()
      const imagePath = 'images/page/' + this.page.ID + '/main-image'
      const imageRef = storageRef.child(imagePath)

      imageRef.put(file).then(() => {
        imageRef.getDownloadURL().then(url => {
          this.page.Image = url
        })
      })
    }
  }
}
</script>
