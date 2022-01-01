// pages/_document.js
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html data-theme="light" lang="pt-BR">
        <Head />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          key="materialIcons"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          key="materialUI"
        />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
