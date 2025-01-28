import { RenderHTML } from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function CustomRenderHTML({ source }) {
  const { width } = useWindowDimensions();
  const { theme, isDarkMode } = useTheme();
  
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
          color: theme.text,
          backgroundColor: theme.background
        },
        col: {
          width: '45%' // Default width
        },
        'col:first-child': {
          width: '5%'
        },
        'col:nth-child(2)': {
          width: '5%'
        },
        'col:nth-child(3)': {
          width: '45%'
        },
        'col:nth-child(4)': {
          width: '45%'
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