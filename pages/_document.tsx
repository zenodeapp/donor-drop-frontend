import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { getCsp } from "../helpers/csp";
import { SiteUrl } from "../layout.config";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    let csp = getCsp(NextScript.getInlineScriptSource(this.props));

    return (
      <Html lang='en'>
        <Head>
          <meta charSet='utf-8' />
          <meta name='referrer' content='strict-origin-when-cross-origin' />
          <meta httpEquiv='Content-Security-Policy' content={csp} />
          <meta name='apple-mobile-web-app-title' content='Donation Drop' />
          <meta name='application-name' content='Donation Drop' />
          <meta name='theme-color' content='#031214' />
          <link rel='icon' type='image/svg+xml' href='/icon.svg' />
          <link
            rel='icon'
            type='image/png'
            href='/icon-light.png'
            media='(prefers-color-scheme: light)'
          />
          <link
            rel='icon'
            type='image/png'
            href='/icon-dark.png'
            media='(prefers-color-scheme: dark)'
          />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/apple-touch-icon.png'
          />
          <link rel='manifest' href='/site.manifest' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:site' content='zenodeapp' />
          <meta
            name='og:image'
            property='og:image'
            content={
              process.env.NODE_ENV == "production"
                ? `${SiteUrl}/og.webp`
                : "/og.webp"
            }
          />
          <meta
            name='og:image:width'
            property='og:image:width'
            content='1200'
          />
          <meta
            name='og:image:height'
            property='og:image:height'
            content='630'
          />
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
