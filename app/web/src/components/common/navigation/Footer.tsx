import React from 'react';
import { Divider, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import Link from 'next/link';

const FooterSegment = styled(Segment)`
    &&&& {
        margin: 0;
        padding: 20px 0;
        border-radius: 0;
        width: 100%;
    }
`;

const FooterDivider = styled(Divider)`
    &&& {
        width: 300px;
        margin-left: 50%;
        border-color: ${(props) => props.theme.colors.grey} !important;
        transform: translateX(-50%);
    }
`;
export const Footer = () => {
    return (
        <FooterSegment inverted>
            <Grid divided inverted stackable columns={'equal'}>
                <Grid.Column
                    className={'vn-flex vn-flex-column vn-flex-center'}
                >
                    <Header as={'h3'} inverted>
                        About me
                    </Header>
                    <div className={'vn-ml2'}>
                        <div>
                            <Icon name={'user'} /> Tuan Nguyen
                        </div>
                        <div>
                            <Icon name={'mail outline'} /> vdtn359@gmail.com
                        </div>
                    </div>
                </Grid.Column>
                <Grid.Column
                    className={'vn-flex vn-flex-column vn-flex-center'}
                >
                    <Header as={'h3'} inverted>
                        Links
                    </Header>
                    <Link href={'/contact'}>
                        <a className={'vn-raw-link vn-flex vn-flex-center'}>
                            <span>Contact Us</span>
                        </a>
                    </Link>
                    <Link href={'/subscribe'}>
                        <a className={'vn-raw-link vn-flex vn-flex-center '}>
                            <span>Subscribe</span>
                        </a>
                    </Link>
                </Grid.Column>
                <Grid.Column
                    className={'vn-flex vn-flex-column vn-flex-center'}
                >
                    <Header as={'h3'} inverted>
                        Media
                    </Header>
                    <span>
                        <Icon name={'github'} />
                        <Icon name={'linkedin'} />
                    </span>
                </Grid.Column>
            </Grid>
            <FooterDivider inverted />
            <div className={'vn-center vn-mt3'}>@Made by Tuan Nguyen</div>
        </FooterSegment>
    );
};
