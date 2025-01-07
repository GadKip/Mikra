import { RenderHTML } from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

export default function CustomRenderHTML({ source }) {
  const { width } = useWindowDimensions();
  
  const systemFonts = ['David', 'Guttman Keren', 'Ezra SIL SR', 'Times New Roman', 'Arial', 'System'];
  
  const processedHtml = source.html
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/\u00A0/g, ' ')
    .replace(/<o:p>[^<]*<\/o:p>/g, '')
    .replace(/\s+/g, ' ');
  
  return (
    <RenderHTML
      contentWidth={width}
      source={{ html: processedHtml }}
      systemFonts={systemFonts}
      enableExperimentalMarginCollapsing={true}
      defaultViewProps={{
        style: {
          direction: 'rtl'
        }
      }}
      tagsStyles={{
        body: {
          color: '#ffffff',
          backgroundColor: '#1a1a1a'
        },
        table: {
          width: '100%',
          direction: 'rtl'
        },
        td: {
          padding: 10,
          verticalAlign: 'top'
        }
      }}
      classesStyles={{
        'col-1': {
          fontFamily: 'Ezra SIL SR',
          width: '25%'
        },
        'col-2': {
          fontFamily: 'Ezra SIL SR',
          width: '25%'
        },
        'col-3': {
          fontFamily: 'Ezra SIL SR',
          width: '25%'
        },
        'col-4': {
          fontFamily: 'Guttman Keren',
          width: '25%'
        },
        'comment': {
          fontFamily: 'David'
        }
      }}
    />
  );
}