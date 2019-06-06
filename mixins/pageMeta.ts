/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { getPage } from '~/common/page'
import striptags from 'striptags'
export default {
  async asyncData({ params }) {
    const page = await getPage(params.pageId)
    return {
      page: page
    }
  },
  head() {
    return {
      title: `${(this as any).page.data.name}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: striptags((this as any).page.data.content)
        },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${(this as any).page.data.name}`
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: striptags((this as any).page.data.content)
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${(this as any).page.data.image}`
        },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: `${(this as any).page.data.name}` },
        { name: 'twitter:image', content: `${(this as any).page.data.image}` },
        {
          name: 'twitter:description',
          content: striptags((this as any).page.data.content)
        }
      ]
    }
  }
}
