import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { Menu, Dropdown } from 'semantic-ui-react'

import Markdown from "./markdown"

const MarkdownSlide =  dynamic(async ()=> await import('./MarkdownSlide'), {ssr: false})

interface Props {
    markdown: string
}

const MDViewer = (props: Props) => {
    const modes = ['md', 'slide']
    const [mode, setMode] = useState(localStorage.getItem('viewMode') || modes[0])

    useEffect(() => {
        localStorage.setItem('viewMode', mode)
    }, [mode])

    const md =  <Markdown markdown={props.markdown} style={{minHeight: 'calc(100% - 50px)', padding: 10}} />
    const mdSlide = <MarkdownSlide markdown={props.markdown} height='calc(100% - 50px)' width='100%' />

    const component = mode === 'md' ? md : mdSlide

    return (
        <>
            {component}
            <Menu className='editor-menu' inverted>
                <Dropdown item text={mode} style={{width: 100}}>
                    <Dropdown.Menu>
                        {modes.map(item => {
                        return <Dropdown.Item key={item} text={item} active={item===mode} onClick={() => setMode(item)} />
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            </Menu>
        </>)
}

export default MDViewer
