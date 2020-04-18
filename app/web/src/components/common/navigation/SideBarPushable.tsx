import React, { useMemo, useRef } from 'react';
import { useEffectOnce, useStateRef } from 'src/utils/hooks/basic';
import { useApp } from 'src/utils/container/context';
import {
    MenuIcon,
    MenuSegment,
    Pushable,
} from 'src/components/common/navigation/Sidebar.styled';
import { Label, Menu, Sidebar, Image } from 'semantic-ui-react';
import { NavBar } from './Navbar';
import { MenuItem } from 'src/components/common/navigation/MenuItem';
import { str } from '@vdtn359/news-utils';
import { CATEGORY } from '@vdtn359/news-models';
import { categoryMap } from 'src/utils/categories';
import {
    VnBigScreen,
    VnMobile,
} from 'src/components/common/responsive/Responsive';
import styled from 'styled-components';
import { sumBy } from 'lodash';
import { useUser } from 'src/auth/context';
import { MenuLink } from 'src/components/common/navigation/MenuLink';
import { Avatar } from 'src/components/common/navigation/Avatar';
import { standardiseName } from 'src/utils/profile';

interface Props {
    categories: {
        category: CATEGORY;
        count: number;
    }[];
}

export const SideBarPushable: React.FC<Props> = ({ children, categories }) => {
    const total = useMemo(() => sumBy(categories, 'count'), [categories]);
    const [getSideBarVisible, setSidebarVisible] = useStateRef(false);
    const sideBarRef = useRef<any>();
    const app = useApp();
    const user = useUser();
    useEffectOnce(() => {
        const clickDisposal = app.onWindowClick((eventType, e: MouseEvent) => {
            if (!getSideBarVisible()) {
                return;
            }
            const sideBarDiv: HTMLElement = sideBarRef.current?.ref?.current;
            const targetNode = e.target as HTMLElement;
            if (
                !sideBarDiv ||
                sideBarDiv.contains(targetNode) ||
                targetNode.closest('[data-element-name=sidebar-open]')
            ) {
                return;
            }
            setSidebarVisible(false);
        });
        const eventDisposal = app.onSideBarClosed(() => {
            setSidebarVisible(false);
        });

        return () => {
            clickDisposal();
            eventDisposal();
        };
    });
    return (
        <Pushable as={MenuSegment} className={'vn-full-screen-height'}>
            <Sidebar
                ref={sideBarRef}
                as={Menu}
                animation="overlay"
                inverted
                vertical
                visible={getSideBarVisible()}
            >
                <MenuItem>
                    Popular
                    <Menu.Menu>
                        <MenuItem
                            key={'hot'}
                            name="hot"
                            showLink={true}
                            routeOptions={{ route: '/hot-news' }}
                        >
                            <MenuLink icon={'favorite'} text={'Hot news'} />
                        </MenuItem>
                        <MenuItem
                            key={'recommendation'}
                            name="recommendation"
                            showLink={true}
                            routeOptions={{ route: '/recommendation' }}
                        >
                            <MenuLink icon={'like'} text={'Recommendation'} />
                        </MenuItem>
                    </Menu.Menu>
                </MenuItem>
                <MenuItem>
                    Categories
                    <Menu.Menu>
                        <MenuItem showLink={true} routeOptions={{ route: '/' }}>
                            <MenuLink
                                icon={'newspaper'}
                                text={'All'}
                                badge={total}
                            />
                        </MenuItem>
                        {categories.map((category) => {
                            return (
                                <MenuItem
                                    showLink={true}
                                    routeOptions={{
                                        as: categoryMap.get(category.category)
                                            .url,
                                        route: '/categories/[category]',
                                    }}
                                    key={category.category}
                                >
                                    <MenuLink
                                        icon={
                                            categoryMap.get(category.category)
                                                .icon
                                        }
                                        text={str.ucfirst(category.category)}
                                        badge={category.count}
                                    />
                                </MenuItem>
                            );
                        })}
                    </Menu.Menu>
                </MenuItem>
                <MenuItem>
                    Links
                    <Menu.Menu>{navLinks(user)}</Menu.Menu>
                </MenuItem>
            </Sidebar>
            <Sidebar.Pusher>
                <VnMobile onChange={() => setSidebarVisible(false)} />
                <NavBar
                    onSidebarClicked={() =>
                        setSidebarVisible(!getSideBarVisible())
                    }
                >
                    {navLinks(user)}
                </NavBar>
                {children}
            </Sidebar.Pusher>
        </Pushable>
    );
};

const navLinks = (user) => (
    <>
        <MenuItem
            showLink={true}
            routeOptions={{
                route: '/contact',
            }}
        >
            <MenuLink icon={'mail outline'} text={'Contact Us'} />
        </MenuItem>
        <VnBigScreen>
            {!!user && (
                <MenuItem showLink={false}>
                    <Avatar user={user} />
                    <span className={'vn-ml1'}>
                        {standardiseName(user.name)}
                    </span>
                </MenuItem>
            )}
        </VnBigScreen>
        <VnMobile>
            {!!user && (
                <MenuItem showLink={false}>
                    <MenuLink
                        icon={'log out'}
                        text={'Log out'}
                        href={'/api/auth/logout'}
                    />
                </MenuItem>
            )}
        </VnMobile>
        {!user && (
            <MenuItem showLink={false}>
                <MenuLink
                    icon={'sign in'}
                    text={'Log in'}
                    href={'/api/auth/login'}
                />
            </MenuItem>
        )}
    </>
);
