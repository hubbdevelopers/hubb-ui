// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function({ params, redirect }): any {
  return redirect(`/${params.id}/pages/${params.pageId}`)
}
