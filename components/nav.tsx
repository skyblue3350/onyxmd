import { signIn, useSession } from 'next-auth/client'
import Link from 'next/link'
import React from 'react'
import { Icon, Label, List, Menu, Popup, Image } from 'semantic-ui-react'

interface Props {
    onClickEdit: () => void
    onClickBoth: () => void
    onClickView: () => void
    mode: string
    state: string
    userList: {name: string, color: string, icon: string}[]
}

const Nav = (props: Props) => {
    const [ session, loading ] = useSession()

    if (loading) {
        return <>loading</>
    }

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
                {session && session.user.name}
                {!session && <Label content='login' onClick={() => signIn()} as='a' />}
                <Popup
                    trigger={<Label color={props.state == 'connected' ? 'blue' : 'yellow'} size='large'><Icon name='users' />{props.state == 'connected' ? `${props.userList.length} Online` : props.state}</Label>}
                    position='bottom center'>
                    <List>
                        {props.userList.map((user, index) => {
                            return <List.Item key={index}>
                                {user.icon ? <Image avatar alt='icon' src={user.icon} style={{height: 18, width: 18}} /> : <Icon name='user' />}
                                <List.Content>{user.name}</List.Content>
                            </List.Item>
                        })}
                    </List>
                </Popup>
            </Menu.Item>
        </Menu>
    )
}

export default Nav
