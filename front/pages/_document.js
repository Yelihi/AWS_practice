import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } catch (error) {
      console.error(error);
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015%2Ces2016%2Ces2017%2Ces2018%2Ces2019%2Ces2020%2Ces2021%2Ces2022" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// 아직까지는 클래스 문법
// 이 문서는 _app 보다 상위 문서
// 여기에서는 getInitalProps(ctx) 를 사용... 곧 사라질듯한 느낌.
// ie 에서 실행하면 안돌아가서 이에 대해 polyfill io 를 넣어주어야 한다.
// map.set promise 등등이 babel 로도 안되고, babel.polyfill 역시 무거워서 대신 사용
