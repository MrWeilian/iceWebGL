import MarkdownItContainer from 'markdown-it-container'

export default function mdPlugin (md) {
  md.use(MarkdownItContainer, 'demo', {

    validate: function(params) {
      console.log(2222);
      return params.trim().match(/^demo\s+(.*)$/);
    },

    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(/^demo\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        // opening tag
        return '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary>\n';

      } else {
        // closing tag
        return '</details>\n';
      }
    }
  })
}