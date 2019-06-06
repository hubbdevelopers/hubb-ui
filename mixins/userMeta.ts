/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { getUser } from '~/common/user'
export default {
  async asyncData({ params }) {
    const user = await getUser(params.id)
    return {
      user: user
    }
  },
  head() {
    return {
      title: (this as any).user.data.name,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: (this as any).user.data.description
        },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${(this as any).user.data.name}`
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: (this as any).user.data.description
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${(this as any).user.data.image}`
        },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: `${(this as any).user.data.name}` },
        { name: 'twitter:image', content: `${(this as any).user.data.image}` },
        {
          name: 'twitter:description',
          content: (this as any).user.data.description
        }
      ]
    }
  }
}
