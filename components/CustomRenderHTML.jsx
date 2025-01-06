import React from 'react';
import RenderHTML from 'react-native-render-html';

export default function CustomRenderHTML({ contentWidth, source, baseStyle }) {
  const processedSource = {
    html: source.html
      .replace(/–/g, '—')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/<\/?o:p>/g, '')
      .replace(/<\/?w:[^>]*>/g, '')
      .replace(/style='([^']*?)'/g, (match) => match)
      .replace(/class=[^>\s]*/g, '')
      .replace(/<table[^>]*>/g, '<table style="width: 100%; direction: rtl; unicode-bidi: embed; background-color: transparent;">')
      .replace(/&#(\d+);/g, (match, dec) => {
        const hex = parseInt(dec, 10).toString(16).toUpperCase();
        if (dec >= 1424 && dec <= 1535) {
          return String.fromCharCode(dec);
        }
        return match;
      })
  };

  return (
    <RenderHTML
      contentWidth={contentWidth}
      source={processedSource}
      baseStyle={{
        ...baseStyle,
        direction: 'rtl',
        unicodeBidi: 'embed',
        fontSize: 10,
        fontFamily: 'Times New Roman',
        textAlign: 'right',
        color: '#000000',
        backgroundColor: 'transparent',
      }}
      tagsStyles={{
        table: {
          width: '100%',
          direction: 'rtl',
          backgroundColor: 'transparent',
        },
        td: {
          padding: '0cm 5.4pt 0cm 5.4pt',
          verticalAlign: 'top',
          backgroundColor: 'transparent',
        },
        p: {
          marginBottom: 0,
          marginTop: 0,
          lineHeight: '10.0pt',
          backgroundColor: 'transparent',
        },
        span: {
          direction: 'rtl',
          unicodeBidi: 'embed',
          backgroundColor: 'transparent',
        }
      }}
      enableExperimentalMarginCollapsing={true}
      ignoredDomTags={[
        'noscript', 
        'script', 
        'style',
        'meta',
        'link',
        'o:p',
        'xml',
        'head'
      ]}
      systemFonts={['Times New Roman', 'Ezra SIL SR', 'Guttman Keren']}
      defaultTextProps={{
        selectable: true
      }}
    />
  );
}