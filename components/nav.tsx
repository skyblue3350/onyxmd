import Link from 'next/link'
import React from 'react'
import { Icon, Label, Menu } from 'semantic-ui-react'

const Nav = () => {
    return (
        <Menu fixed='top' inverted icon>
            <Menu.Item position='left'>
                <Link href='/'>onyxmd</Link>
            </Menu.Item>
            <Menu.Item fitted>
                <Menu icon inverted>
                    <Menu.Item>
                        <Icon inverted name='pencil' />
                    </Menu.Item>
                    <Menu.Item>
                        <Icon inverted name='columns' />
                    </Menu.Item>
                    <Menu.Item>
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
