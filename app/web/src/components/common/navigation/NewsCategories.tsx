import React, { useMemo } from 'react';
import { sumBy } from 'lodash';
import { CATEGORY } from '@vdtn359/news-models';
import { Menu, Label } from 'semantic-ui-react';
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
    position: fixed;
`;
export const NewsCategories: React.FC<Props> = ({ categories }) => {
    const total = useMemo(() => sumBy(categories, 'count'), [categories]);
    return (
        <MenuContainer>
            <Menu vertical>
                <MenuItem key={'all'} name="all" routeOptions={{ route: '/' }}>
                    <MenuIcon name={'newspaper'} />
                    <Label color={'teal'}>{total}</Label>
                    All
                </MenuItem>
                {categories.map((category) => (
                    <MenuItem
                        key={category.category}
                        name={category.category}
                        routeOptions={{
                            as: categoryMap.get(category.category).url,
                            route: '/categories/[category]',
                        }}
                    >
                        <MenuIcon
                            name={categoryMap.get(category.category).icon}
                        />
                        {str.ucfirst(category.category)}
                        <Label color={'teal'}>{category.count}</Label>
                    </MenuItem>
                ))}
            </Menu>
        </MenuContainer>
    );
};
