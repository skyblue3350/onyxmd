import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItTableOfContents from 'markdown-it-table-of-contents'
import MarkdownItTitle from 'markdown-it-title'
import hljs from 'highlight.js'
import emoji from 'markdown-it-emoji'
import twemoji from 'twemoji'

interface Env {
    title: string
    excerpt: string[]
}

export const getMarkdown = (markdown: string) => {
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
    md.use(MarkdownItTitle, {level: 1, excerpt: 1})

    md.renderer.rules.emoji = (token, idx) => {
        return twemoji.parse(token[idx].content)
    }

    const env: Env = {title: '', excerpt: []}
    const html = md.render(markdown, env)

    return {
        env,
        html,
    }
}
