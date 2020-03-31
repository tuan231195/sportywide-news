import styled from 'styled-components';
import { Container } from 'semantic-ui-react';

export const NewsContainer = styled(Container).attrs({ fluid: true })`
	background-color: ${(props) => props.theme.colors.grey};
	padding: var(--space-2);
	padding-top: ${(props) => props.theme.dimen.navBar};
	width: 100%;
	height: 100%;
	min-height: 100vh;
	display: flex;
`;
