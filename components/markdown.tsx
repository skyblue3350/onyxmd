import React from 'react'
import { getMarkdown } from '../lib/markdown'

interface Props {
    markdown: string
    style: any
}

const Markdown = (props: Props) => {
    const html = getMarkdown(props.markdown).html
    return <div dangerouslySetInnerHTML={{__html : html}} className='markdown-body' {...props}/>
}

export default Markdown
