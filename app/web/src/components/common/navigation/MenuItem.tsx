import { NextRouter } from 'next/router';
import React, { ReactNode, useContext } from 'react';
import { Menu } from 'semantic-ui-react';
import { ContainerContext } from 'src/utils/container/context';
import { EventDispatcher } from 'src/utils/events/event-dispatcher';
import { func } from '@vdtn359/news-utils';
import { match as pathMatch } from 'path-to-regexp';
import { SIDEBAR_CLOSED } from 'src/utils/events/event.constants';
import { withRouter } from 'src/utils/hoc/with-router';
import styled from 'styled-components';

const Item = styled(Menu.Item)`
    &&&&.active {
        color: white;
        background-color: ${(props) => props.theme.colors.accent} !important;

        &:hover {
            color: white !important;
            background-color: ${(props) =>
                props.theme.colors.secondaryAccent} !important;
        }
    }
`;

interface Props {
    name?: string;
    as?: any;
    className?: string;
    routeOptions?: any;
    router?: NextRouter;
    showActive?: boolean;
    onClick?: any;
    children?: ReactNode;
}

const MenuItemComponent: React.FC<Props> = function ({
    name,
    as,
    className,
    router,
    onClick,
    routeOptions,
    showActive = true,
    children,
}) {
    const container = useContext(ContainerContext);
    const eventDispatcher = container.get(EventDispatcher);
    return (
        <Item
            as={as}
            name={name}
            className={className}
            active={showActive && isActive(routeOptions)}
            onClick={() => (onClick || defaultClickHandler || func.noop)()}
        >
            {children}
        </Item>
    );

    function isActive(routeOptions) {
        if (!routeOptions?.route) {
            return false;
        }
        const currentPath = router.asPath;
        return !!pathMatch(routeOptions.as || routeOptions.route)(currentPath);
    }

    function defaultClickHandler() {
        if (!routeOptions?.route) {
            return false;
        }
        eventDispatcher.trigger(SIDEBAR_CLOSED);
        return router.push(
            routeOptions.route,
            routeOptions.as,
            routeOptions.options
        );
    }
};

export const MenuItem = withRouter(MenuItemComponent);
