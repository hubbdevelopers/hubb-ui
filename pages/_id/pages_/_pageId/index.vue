<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class extends Vue {
  beforeCreate() {
    this.$router.push(
      `/${this.$route.params.id}/pages/${this.$route.params.pageId}`
    )
  }
}
</script>
