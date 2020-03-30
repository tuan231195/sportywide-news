import React, { useMemo } from 'react';
import { sumBy } from 'lodash';
import { CATEGORY } from '@vdtn359/news-models';
import { Menu, Label } from 'semantic-ui-react';
import { str } from '@vdtn359/news-utils';
interface Props {
    categories: {
        category: CATEGORY;
        count: number;
    }[];
}
export const SideBar: React.FC<Props> = ({ categories }) => {
    const total = useMemo(() => sumBy(categories, 'count'), [categories]);
    return (
        <Menu vertical>
            <Menu.Item key={'all'} name="all" active={true}>
                <Label color={'teal'}>{total}</Label>
                All
            </Menu.Item>
            {categories.map((category) => (
                <Menu.Item key={category.category} name={category.category}>
                    <Label>{category.count}</Label>
                    {str.ucfirst(category.category)}
                </Menu.Item>
            ))}
        </Menu>
    );
};
