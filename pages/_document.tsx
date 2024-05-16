import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import favIcon from '../public/assets/favicon.ico';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="es">
        <Head>
          {/* <script src="http://localhost:8097" />{' '} */}
          {/* for React dev tools with npm run devtools */}
          {/* Descomentar la siguiente para usar la spa en modo StandAlone*/}
          <script type="text/javascript" src="/conf/env-config.js" />
          <link rel="shortcut icon" href={favIcon} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
