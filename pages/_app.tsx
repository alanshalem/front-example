import React, { Fragment } from 'react';
import { Typings } from '@galicia-toolkit/core';
import App from 'next/app';
import Head from 'next/head';
import { MsalAuthenticationTemplate, MsalProvider } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { loginRequest, msalInstance } from '../config/msal-config';

interface AppProps {
  pageProps: Typings.AppConfig;
  cdnBasepath: string;
}

export default class MyApp extends App<AppProps> {
  static displayName = 'MyApp';

  static async getInitialProps({ Component, ctx }) {
    let pageProps: any = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return {
      pageProps: {
        ...pageProps,
        isServer: 'req' in ctx,
      },
    };
  }

  state = {
    isServer: this.props.pageProps.isServer,
    hasError: false,
    error: null,
    errorInfo: null,
  };

  componentDidMount() {
    this.setState({ isServer: false });
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true, error, errorInfo });
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { Component, pageProps } = this.props;

    // Next renders error pages on export so we should catch this options
    if (pageProps.statusCode) {
      return <p>error {pageProps.statusCode}</p>;
    }

    // Don't render Server Side Rendering
    if (this.state.isServer) {
      return null;
    }

    const authRequest = {
      ...loginRequest,
    };

    return (
      <Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
          />
          <title>OASYS</title>
        </Head>
        <MsalProvider instance={msalInstance}>
          <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect}
            authenticationRequest={authRequest}
          >
            <Component {...pageProps} /> {/* index.tsx */}
          </MsalAuthenticationTemplate>
        </MsalProvider>
      </Fragment>
    );
  }
}
