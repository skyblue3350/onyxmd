import React from 'react'
import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItTableOfContents from 'markdown-it-table-of-contents'
import hljs from 'highlight.js'
import emoji from 'markdown-it-emoji'
import twemoji from 'twemoji'

interface Props {
    markdown: string
}

const Markdown = (props: Props) => {
    const md = MarkdownIt({
        breaks: true,
        linkify: true,
        highlight: (code, lang) => {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return '<pre class="hljs"><code>' + hljs.highlight(code, {language: lang}).value + '</code></pre>'
                } catch {
                    return '<pre class="hljs"><code>' + MarkdownIt().utils.escapeHtml(code) + '</code></pre>'
                }
            }
            return '<pre class="hljs"><code>' + MarkdownIt().utils.escapeHtml(code) + '</code></pre>'
        },
    })
    md.use(MarkdownItAnchor)
    md.use(MarkdownItTableOfContents)
    md.use(emoji)

    md.renderer.rules.emoji = (token, idx) => {
        return twemoji.parse(token[idx].content)
    }

    return <div dangerouslySetInnerHTML={{__html : md.render(props.markdown)}} />
}

export default Markdown
