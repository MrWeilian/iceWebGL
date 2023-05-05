import MarkdownItContainer from 'markdown-it-container'
import fs from 'fs'
import path from 'path'
import Prism from 'prismjs'

const rootPath = path.resolve(__dirname, '../../../')

export default function mdPlugin (md) {
  md.use(MarkdownItContainer, 'demo', {

    validate: function(params) {
      return params.trim().match(/^demo\s*(.*)$/);
    },

    render: function (tokens, idx) {
      if (tokens[idx].nesting === 1) {
        const sourceFileToken = tokens[idx + 2]
        let source = ''

        const content = sourceFileToken?.children?.[0].content ?? ''
        const componentName = content.replace('/', '')
        console.log('sourceFile', componentName)

        source = fs.readFileSync(
          path.resolve(rootPath, 'src', 'demo', `${content}.vue`),
          'utf-8'
        )
        console.log('source', encodeURIComponent(source))
        const warp = code => `<pre v-pre><code>${code}</code></pre>`
        // opening tag
        return `
          <vp-demo 
            source-code="${encodeURIComponent(source)}"
            highlight-code="${encodeURIComponent(warp(Prism.highlight(source, Prism.languages.markup, 'javascript')))}"
          >
            <template #demo>
              <${componentName} />
            </template>
        `
      } else {
        // closing tag
        return `
          </vp-demo>
        `
      }
    }
  })
}
