import Link from 'next/link'
import React from 'react'
import { Icon, Label, Menu } from 'semantic-ui-react'

interface Props {
    onClickEdit: () => void
    onClickBoth: () => void
    onClickView: () => void
    mode: string
}

const Nav = (props: Props) => {
    return (
        <Menu inverted icon style={{margin: 0}}>
            <Menu.Item position='left'>
                <Link href='/'>onyxmd</Link>
            </Menu.Item>
            <Menu.Item fitted>
                <Menu icon inverted>
                    <Menu.Item active={props.mode==='edit'} onClick={props.onClickEdit}>
                        <Icon inverted name='pencil' />
                    </Menu.Item>
                    <Menu.Item active={props.mode==='both'} onClick={props.onClickBoth}>
                        <Icon inverted name='columns' />
                    </Menu.Item>
                    <Menu.Item active={props.mode==='view'} onClick={props.onClickView}>
                        <Icon inverted name='eye' />
                    </Menu.Item>
                </Menu>
            </Menu.Item>
            <Menu.Item position='right'>
                <Label color='blue' size='large'>
                    <Icon name='users' />
                    1 Online
                </Label>
            </Menu.Item>
        </Menu>
    )
}

export default Nav
