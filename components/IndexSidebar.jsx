import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import ThemedText from './ThemedText';
import { Ionicons } from '@expo/vector-icons';

export const IndexSidebar = ({ headings, onJump, onClose, isOpen }) => {
    const { colors } = useTheme();

    if (!isOpen) {
        return null;
    }

    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: 280,
                backgroundColor: colors.card,
                zIndex: 100,
                borderLeftWidth: 1,
                borderLeftColor: colors.border || colors.highlight,
                paddingTop: 12,
            }}
        >
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingBottom: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border || colors.highlight,
                }}
            >
                <ThemedText style={{ fontSize: 16, fontWeight: 'bold' }}>
                    תוכן עניינים
                </ThemedText>
                <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* Headings List */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingVertical: 8 }}
            >
                {headings && headings.length > 0 ? (
                    headings.map((heading) => (
                        <TouchableOpacity
                            key={heading.id}
                            onPress={() => {
                                onJump(heading.id);
                                onClose();
                            }}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderBottomWidth: 0.5,
                                borderBottomColor: colors.border || colors.highlight,
                            }}
                        >
                            <ThemedText
                                numberOfLines={2}
                                style={{
                                    fontSize: 14,
                                    color: colors.text,
                                    lineHeight: 20,
                                }}
                            >
                                {heading.text}
                            </ThemedText>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={{ padding: 16 }}>
                        <ThemedText style={{ fontSize: 14, textAlign: 'center' }}>
                            אין כותרות בדף זה
                        </ThemedText>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};
