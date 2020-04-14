import React from 'react';
import { Icon } from 'semantic-ui-react';
import Link from 'next/link';
import Head from 'next/head';
import {
    ErrorContainer,
    ErrorHeader,
    ErrorStatusText,
} from 'src/components/common/navigation/ErrorPage.styled';

export default class ErrorPage extends React.Component<any, any> {
    static getInitialProps({ res, err }) {
        const statusCode = res ? res.statusCode : err ? err.statusCode : 500;
        return { statusCode: statusCode || 500 };
    }
    render() {
        return (
            <ErrorContainer>
                <Head>
                    <title>Error</title>
                </Head>
                <div className={'vn-absolute-center'}>
                    <ErrorStatusText color={'red'}>
                        {this.props.statusCode}
                    </ErrorStatusText>
                    <ErrorHeader>Oops! Something wrong happened</ErrorHeader>
                    <Link href={'/'}>
                        <a>
                            <div
                                className={
                                    'vn-flex vn-flex-center vn-flex-justify-center'
                                }
                            >
                                <Icon name="arrow circle left" />
                                <div className={'vn-mt1'}>
                                    Return to home page
                                </div>
                            </div>
                        </a>
                    </Link>
                </div>
            </ErrorContainer>
        );
    }
}
