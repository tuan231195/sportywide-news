import React from 'react';
import { MenuIcon } from 'src/components/common/navigation/Sidebar.styled';
import { Image, SemanticICONS, Label } from 'semantic-ui-react';
import styled from 'styled-components';

const CategoryBadge: any = styled(Label)`
    min-width: 38px;
    text-align: center;
`;

export const MenuLink = React.forwardRef(
    (
        {
            icon,
            image,
            text,
            badge,
            href,
        }: {
            icon?: SemanticICONS;
            image?: string;
            text?: string;
            badge?: string | number;
            href?: string;
        },
        ref
    ) => {
        return (
            <a
                className={'vn-raw-link-center vn-full-width'}
                href={href || null}
                // @ts-ignore
                ref={ref}
            >
                {!!icon && <MenuIcon name={icon} />}
                {!!image && <Image avatar src={image} />}
                <span className={'vn-flex-grow vn-ml1'}>{text}</span>
                {!!badge && (
                    <CategoryBadge size={'tiny'} color={'teal'}>
                        {badge}
                    </CategoryBadge>
                )}
            </a>
        );
    }
);

MenuLink.displayName = 'MenuLink';
