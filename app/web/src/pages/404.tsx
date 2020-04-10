import React from 'react';
import styled from 'styled-components';
import { Segment, Icon } from 'semantic-ui-react';
import { device } from 'src/utils/device/size';
import Link from 'next/link';

const ErrorHeader = styled.h2`
    font-size: 22px;
    font-weight: 400;
    text-transform: uppercase;
    color: #222;
    margin-bottom: 20px;
    margin-top: 5px;
`;

const Container = styled(Segment)`
    text-align: center;
    position: relative;
    min-height: 70vh;
    margin-top: var(--space-3);

    @media ${device.tablet} {
        min-height: 600px;
    }
`;

const StatusText = styled.h1`
    &&& {
        height: 200px;
        color: ${(props) => props.theme.colors.accent};
        font-size: 168px;
        text-transform: uppercase;
        line-height: 200px;
        margin-top: -100px;
    }
`;

export default function NotFoundPage() {
    return (
        <Container>
            <div className={'vn-absolute-center'}>
                <StatusText>404</StatusText>
                <ErrorHeader>Page Not Found</ErrorHeader>
                <Link href={'/'}>
                    <a>
                        <div
                            className={
                                'vn-flex vn-flex-center vn-flex-justify-center'
                            }
                        >
                            <Icon name="arrow circle left" />
                            <div className={'vn-mt1'}>Return to home page</div>
                        </div>
                    </a>
                </Link>
            </div>
        </Container>
    );
}
