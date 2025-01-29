import { RenderHTML } from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

export default function CustomRenderHTML({ source }) {
  const { width } = useWindowDimensions();
  
  const systemFonts = ['David', 'Guttman Keren', 'Ezra SIL SR', 'Times New Roman', 'Arial', 'System'];
  
  // Process HTML content
  const processedHtml = source.html
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/\u00A0/g, ' ')
    .replace(/<o:p>[^<]*<\/o:p>/g, '')
    .replace(/\s+/g, ' ');

  const renderConfig = {
    renderersProps: {
      img: {
        enableExperimentalPercentWidth: true
      }
    },
    defaultViewProps: {
      style: {
        direction: 'rtl'
      }
    },
    defaultTextProps: {
      selectable: true
    }
  };

  return (
    <RenderHTML
      {...renderConfig}
      contentWidth={width}
      source={{ html: processedHtml }}
      systemFonts={systemFonts}
      enableExperimentalBRCollapsing
      enableExperimentalRTL
      baseStyle={{
        direction: 'rtl'
      }}
      ignoreDomNode={(node) => ['colgroup', 'col'].includes(node.name)}
      tagsStyles={{
        table: {
          display: 'flex',
          flexDirection: 'column'
        },
        tr: {
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderColor: '#e5e5e5'
        },
        td: {
          flex: 1,
          padding: 8
        }
      }}
      classesStyles={{
        'col-1': {
          fontFamily: 'Ezra SIL SR',
          width: '5%'
        },
        'col-2': {
          fontFamily: 'Ezra SIL SR',
          width: '5%'
        },
        'col-3': {
          fontFamily: 'Ezra SIL SR',
          width: '45%'
        },
        'col-4': {
          fontFamily: 'Guttman Keren',
          width: '45%'
        },
        'comment': {
          fontFamily: 'David'
        }
      }}
    />
  );
}