import React, { useRef } from 'react';
import { useEffectOnce, useStateRef } from 'src/utils/hooks/basic';
import { useApp } from 'src/utils/container/context';
import {
    MenuIcon,
    MenuSegment,
    Pushable,
} from 'src/components/common/navigation/Sidebar.styled';
import { Menu, Sidebar, Label } from 'semantic-ui-react';
import { NavBar } from './Navbar';
import { MenuItem } from 'src/components/common/navigation/MenuItem';
import { str } from '@vdtn359/news-utils';
import { CATEGORY } from '@vdtn359/news-models';
import { categoryMap } from 'src/utils/categories';

interface Props {
    categories: {
        category: CATEGORY;
        count: number;
    }[];
}
export const SideBarPushable: React.FC<Props> = ({ children, categories }) => {
    const [getSideBarVisible, setSidebarVisible] = useStateRef(false);
    const sideBarRef = useRef<any>();
    const app = useApp();
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
                <Menu.Menu>
                    {categories.map((category) => {
                        return (
                            <MenuItem
                                route={categoryMap.get(category.category).url}
                                key={category.category}
                            >
                                <MenuIcon
                                    name={
                                        categoryMap.get(category.category).icon
                                    }
                                />
                                {str.ucfirst(category.category)}
                                <Label as="span" size={'tiny'} color={'teal'}>
                                    {category.count}
                                </Label>
                            </MenuItem>
                        );
                    })}
                </Menu.Menu>
            </Sidebar>
            <Sidebar.Pusher>
                <NavBar
                    onSidebarClicked={() =>
                        setSidebarVisible(!getSideBarVisible())
                    }
                />
                {children}
            </Sidebar.Pusher>
        </Pushable>
    );
};
