import NextDocument,{ Html, Head, Main, NextScript, DocumentInitialProps, DocumentContext } from 'next/document';
import { readFileSync } from "fs";
import { join } from "path";

class InlineStylesHead extends Head {
  getCssLinks: Head["getCssLinks"] = ({ allFiles }) => {
    const { assetPrefix } = this.context;
    if (!allFiles || allFiles.length === 0) return null;
    return allFiles
      .filter((file: any) => /\.css$/.test(file))
      .map((file: any) => (
        <style
          key={file}
          nonce={this.props.nonce}
          data-href={`${assetPrefix}/_next/${file}`}
          dangerouslySetInnerHTML={{
            __html: readFileSync(join(process.cwd(), ".next", file), "utf-8"),
          }}
        />
      ));
  };
}
 
export default function Document(props: DocumentInitialProps & { nonce: string | undefined }) {
  const { nonce } = props;
  return (
    <Html>
      <InlineStylesHead nonce={nonce} />
      <body data-nonce={nonce}>
        <Main />
        <NextScript nonce={nonce} />
      </body>
    </Html>
  )
}

Document.getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps & { nonce: string | undefined }> => {
  // read nonce value from headers
  const nonce = ctx.req?.headers?.['x-nonce'] as string | undefined;
  
  const initialProps = await NextDocument.getInitialProps(ctx);
  
  return {
    ...initialProps,
    nonce
  }
}