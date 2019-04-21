<template>
  <div>
    <div class="tabs">
      <ul>
        <li class="is-active">
          <a>ページ</a>
        </li>
      </ul>
    </div>

    <div class="columns is-multiline">
      <div
        v-for="page in pages"
        :key="page.id"
        class="column is-three-fifths is-offset-one-fifth"
      >
        <page-box :page="page" :user="user" />
      </div>
    </div>

    <!--h2 class="is-size-3">コミュニティ一覧</h2>
		<div class="columns is-multiline">
			<div v-for="community in communities" :key="community.id" class="column is-one-third">
				<div class="card">
					<div class="card-image">
						<nuxt-link :to="'/i/community/' + community.ID">
						<figure class="image is-4by3">
							<img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
						</figure>
						</nuxt-link>
					</div>
					<div class="card-content">

						<div class="content">
							<p class="title">
								{{community.data.name}}
							</p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							Phasellus nec iaculis mauris.
						</div>
					</div>
				</div>
			</div>
    </div-->
  </div>
</template>
<script lang="ts">
import PageBox from '~/components/molecules/PageBox.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { User } from '~/common/user'
import { Page } from '~/common/page'

@Component({
  components: {
    PageBox
  }
})
export default class extends Vue {
  @Prop({ required: true }) readonly user!: User
  @Prop({ required: true }) readonly pages!: Page[]
  @Prop({ required: true }) readonly communities!: any
}
</script>
