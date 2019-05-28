<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  middleware: 'pageRedirect'
})
export default class extends Vue {}
</script>
