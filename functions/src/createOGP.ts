import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const striptags = require('striptags')
const db = admin.firestore()
const OGP_IMG_WIDTH = 1200
const OGP_IMG_HEIGHT = 630

const createHtml = (
  userId: string,
  pageId: string,
  pageName: string,
  pageImage: string,
  pageContent: string
): string => {
  const SITEURL = 'https://hubb.dev'
  const PAGEURL = `${SITEURL}/${userId}/pages/${pageId}`
  const TITLE = `${pageName} | Hubb`
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Hubb</title>
    <meta name="description" content="${pageContent}">
    <meta property="og:title" content="${TITLE}">
    <meta property="og:image" content="${pageImage}">
    <meta property="og:image:width" content="${OGP_IMG_WIDTH}">
    <meta property="og:image:height" content="${OGP_IMG_HEIGHT}">
    <meta property="og:description" content="${pageContent}">
    <meta property="og:url" content="${PAGEURL}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Hubb">
    <meta name="twitter:site" content="${SITEURL}">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${TITLE}">
    <meta name="twitter:image" content="${pageImage}">
    <meta name="twitter:description" content="${pageContent}">
  </head>
  <body>
    <script type="text/javascript">window.location="/${userId}/pages_/${pageId}";</script>
  </body>
</html>
`
}

export default functions.https.onRequest(
  async (req, res): Promise<void> => {
    const [, userId, , pageId] = req.path.split('/')

    const page = await db
      .collection('pages')
      .doc(pageId)
      .get()

    if (page.exists) {
      const data = page.data()
      const pageName = data ? data.name : ''
      const pageImage = data ? data.image : ''
      const pageContent = data ? striptags(data.content).slice(0, 120) : ''
      const html = createHtml(userId, pageId, pageName, pageImage, pageContent)
      console.log(html)
      res.set('Cache-Control', 'public, max-age=600, s-maxage=600')
      res.status(200).end(html)
    } else {
      console.log('page does not exist')
      res.status(404).end()
    }
  }
)
