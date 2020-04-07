import React, { useMemo } from 'react';
import { sumBy } from 'lodash';
import { CATEGORY } from '@vdtn359/news-models';
import { Label, Menu } from 'semantic-ui-react';
import { str } from '@vdtn359/news-utils';
import styled from 'styled-components';
import { MenuItem } from 'src/components/common/navigation/MenuItem';
import { MenuIcon } from 'src/components/common/navigation/Sidebar.styled';
import { categoryMap } from 'src/utils/categories';

interface Props {
    categories: {
        category: CATEGORY;
        count: number;
    }[];
}

const MenuContainer = styled.div`
    &&& {
        position: fixed;
        min-width: 245px;
        z-index: 2;

        > .menu {
            width: 100%;
        }
    }
`;

const CategoryBadge = styled(Label)`
    min-width: 40px;
    text-align: center;
`;

const CategoryItem = styled(MenuItem)`
    &&&&&& {
        padding-top: 10px;
        padding-bottom: 10px;
        margin-bottom: -1px;
        min-height: 50px;
        display: flex;
        align-items: center;
    }
`;
export const NewsCategories: React.FC<Props> = ({ categories }) => {
    const total = useMemo(() => sumBy(categories, 'count'), [categories]);
    return (
        <MenuContainer>
            <Menu vertical>
                <CategoryItem
                    key={'hot'}
                    name="hot"
                    routeOptions={{ route: '/hot-news' }}
                    showLink={true}
                >
                    <a
                        className={
                            'vn-raw-link vn-flex vn-flex-center vn-full-width'
                        }
                    >
                        <MenuIcon name={'favorite'} />
                        <span className={'vn-flex-grow vn-ml1'}>Hot news</span>
                    </a>
                </CategoryItem>
                <CategoryItem
                    key={'recommendation'}
                    name="recommendation"
                    routeOptions={{ route: '/recommendation' }}
                    showLink={true}
                >
                    <a
                        className={
                            'vn-raw-link vn-flex vn-flex-center vn-full-width'
                        }
                    >
                        <MenuIcon name={'like'} />
                        <span className={'vn-flex-grow vn-ml1'}>
                            You may like
                        </span>
                    </a>
                </CategoryItem>
            </Menu>
            <Menu vertical>
                <CategoryItem
                    key={'all'}
                    name="all"
                    routeOptions={{ route: '/' }}
                    showLink={true}
                >
                    <a
                        className={
                            'vn-raw-link vn-flex vn-flex-center vn-full-width'
                        }
                    >
                        <MenuIcon name={'newspaper'} />
                        <span className={'vn-flex-grow vn-ml1'}>All</span>
                        <CategoryBadge color={'teal'}>{total}</CategoryBadge>
                    </a>
                </CategoryItem>
                {categories.map((category) => (
                    <CategoryItem
                        showLink={true}
                        key={category.category}
                        name={category.category}
                        routeOptions={{
                            as: categoryMap.get(category.category).url,
                            route: '/categories/[category]',
                        }}
                    >
                        <a
                            className={
                                'vn-raw-link vn-flex vn-flex-center vn-full-width'
                            }
                        >
                            <MenuIcon
                                name={categoryMap.get(category.category).icon}
                            />
                            <span className={'vn-flex-grow vn-ml1'}>
                                {str.ucfirst(category.category)}
                            </span>
                            <CategoryBadge color={'teal'}>
                                {category.count}
                            </CategoryBadge>
                        </a>
                    </CategoryItem>
                ))}
            </Menu>
        </MenuContainer>
    );
};
