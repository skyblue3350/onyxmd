import React from 'react'
import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItTableOfContents from 'markdown-it-table-of-contents'

interface Props {
    markdown: string
}

const Markdown = (props: Props) => {
    const md = MarkdownIt({
        breaks: true,
        linkify: true,
    })
    md.use(MarkdownItAnchor)
    md.use(MarkdownItTableOfContents)
    return <div dangerouslySetInnerHTML={{__html : md.render(props.markdown)}} />
}

export default Markdown
