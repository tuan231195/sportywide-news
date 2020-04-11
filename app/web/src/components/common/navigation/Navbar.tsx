import React, { useEffect, useState } from 'react';
import { Icon, Image, Input, Menu } from 'semantic-ui-react';
import styled from 'styled-components';
import {
    VnBigScreen,
    VnMobile,
} from 'src/components/common/responsive/Responsive';
import { MenuItem } from 'src/components/common/navigation/MenuItem';
import { device } from 'src/utils/device/size';
import Router from 'next/router';
import { toQueryString } from 'src/utils/filter';
import { useSearch } from 'src/utils/hooks/search';
import { SearchResults } from 'src/components/search/SearchResults';
import { useContainer } from 'src/utils/container/context';
import { NewsService } from 'src/services/news.service';
import {
    TrackingService,
    TrackingType,
} from 'src/utils/tracking/tracking.service';

const AppLogo = styled(Image)`
    &&&& {
        max-width: 25px;
        margin-right: 8px;
    }
`;

const NavbarMenu = styled(Menu)`
    &&&& {
        margin: 0;
        background-color: ${(props) => props.theme.colors.primary};
        border-radius: 0;
        position: fixed;
        width: 100%;
        display: flex;
        z-index: 10;
        height: ${(props) => props.theme.dimen.navBar};

        .active.item {
            background-color: ${(props) => props.theme.colors.accent};
        }
    }
`;

const SearchInputMenuItem = styled(Menu.Item)`
    &&&& {
        flex: 1 0 0 !important;
    }
`;

const SearchInputContainer = styled.div`
    position: relative;
    width: 100%;
    @media ${device.tablet} {
        width: 500px !important;
    }
`;

const SearchInput = styled(Input)`
    width: 100%;
`;

interface Props {
    onSidebarClicked: Function;
}

export const NavBar: React.FC<Props> = function ({
    onSidebarClicked,
    children,
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocus, setFocus] = useState(false);
    const container = useContainer();
    const newsService = container.get(NewsService);
    const [{ results, loading }, setSearch] = useSearch(async (search) => {
        const { items } = await newsService.searchNews({
            search,
            size: 5,
            inline: true,
        });
        return items;
    });
    useEffect(() => setSearch(searchQuery), [searchQuery]);
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

            <VnBigScreen>
                <MenuItem
                    routeOptions={{ route: '/' }}
                    showActive={false}
                    showLink={true}
                >
                    <a className={'vn-raw-link vn-flex vn-flex-center'}>
                        <AppLogo src={'/favicon.ico'} />
                        Tuan&apos;s news
                    </a>
                </MenuItem>
            </VnBigScreen>

            <SearchInputMenuItem>
                <SearchInputContainer>
                    <SearchInput
                        loading={loading}
                        value={searchQuery}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
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
                    {!loading && isFocus && (
                        <SearchResults
                            query={searchQuery}
                            items={results}
                            onClick={() => {
                                setSearchQuery('');
                            }}
                        />
                    )}
                </SearchInputContainer>
            </SearchInputMenuItem>
            <VnBigScreen>
                <Menu.Menu position="right">{children}</Menu.Menu>
            </VnBigScreen>
        </NavbarMenu>
    );

    function search() {
        setSearchQuery('');
        if (searchQuery) {
            const trackingService = container.get(TrackingService);
            trackingService.track({
                id: searchQuery,
                type: TrackingType.TERM,
            });
        }
        return Router.push(
            `/search?filter=${toQueryString({
                search: searchQuery,
            })}`
        );
    }
};
