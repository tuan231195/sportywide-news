import React, { useState } from 'react';
import { Icon, Input, Menu } from 'semantic-ui-react';
import styled from 'styled-components';
import { VnMobile } from 'src/components/common/responsive/Responsive';
import { MenuItem } from 'src/components/common/navigation/MenuItem';
import { device } from 'src/utils/device/size';
import Router from 'next/router';
import { toQueryString } from 'src/utils/filter';

const NavbarMenu = styled(Menu)`
    &&&& {
        margin: 0;
        background-color: ${(props) => props.theme.colors.primary};
        border-radius: 0;
        position: fixed;
        width: 100%;
        display: flex;
        z-index: 1500;
        height: ${(props) => props.theme.dimen.navBar};

        .active.item {
            background-color: ${(props) => props.theme.colors.accent};
        }
    }
`;

const SearchInput = styled(Input)`
    width: 100%;
    @media ${device.tablet} {
        width: 500px !important;
    }
`;

interface Props {
    onSidebarClicked: Function;
}

export const NavBar: React.FC<Props> = function ({ onSidebarClicked }) {
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <NavbarMenu inverted>
            <VnMobile>
                <Menu.Item
                    data-element-name={'sidebar-open'}
                    onClick={() => onSidebarClicked()}
                >
                    <Icon name="th" />
                </Menu.Item>
            </VnMobile>

            <MenuItem
                routeOptions={{ route: '/' }}
                showActive={false}
                showLink={true}
            >
                <a className={'vn-raw-link'}>
                    <Icon name="newspaper" />
                    Tuan&apos;s news
                </a>
            </MenuItem>
            <Menu.Item>
                <SearchInput
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') search();
                    }}
                    icon={
                        <Icon
                            name={'search'}
                            className={'vn-cursor-pointer'}
                            onClick={search}
                        />
                    }
                    placeholder="Search..."
                />
            </Menu.Item>
        </NavbarMenu>
    );

    function search() {
        setSearchQuery('');
        return Router.push(
            `/search?filter=${toQueryString({
                search: searchQuery,
            })}`
        );
    }
};
