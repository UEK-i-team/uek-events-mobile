import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExternalLink } from '@/shared/components/external-link';
import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';
import { IconSymbol } from '@/shared/components/ui/icon-symbol';
import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';

export default function InfoScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? Colors.dark.background : Colors.light.background;
  const textColor = isDark ? Colors.dark.text : Colors.light.text;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
            O aplikacji
          </ThemedText>
          <ThemedView style={[
            styles.creatorsSection,
              { backgroundColor: isDark ? 'rgba(33, 150, 243, 0.2)' : '#F9FCFF' }
            ]}>
            <ThemedText style={[styles.creatorsTitle, { color: textColor }]}>
              CEL APLIKACJI ORAZ TWÓRCY:
            </ThemedText>
            <ThemedText style={[styles.creatorsText, { color: textColor }]}>
              Ile razy przegapiłeś ważny event, bo ogłoszenie zaginęło w mailach? My też mieliśmy dość. Dlatego stworzyliśmy aplikację, która zbiera wszystkie wydarzenia, konkursy i oferty w jednym miejscu.
            </ThemedText>
            <ThemedText style={[styles.creatorsText, { color: textColor }]}>
            </ThemedText>
            <ThemedText style={[styles.creatorsText, { color: textColor }]}>
              Jesteśmy Koło Naukowe Informatyki i::team, studenci UEK, którzy rozwiązują problemy z kodem w ręku. Stworzono przez studentów, dla studentów. 🚀
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.linkItem}>
            <ExternalLink href="https://example.com/polityka-prywatnosci" style={styles.link}>
              <ThemedText style={[styles.linkText, { color: textColor }]}>
                Polityka prywatności
              </ThemedText>
            </ExternalLink>
            <IconSymbol name="arrow.up.right" size={20} color={isDark ? '#9BA1A6' : '#687076'} />
          </ThemedView>
          
          <ThemedView style={styles.linkItem}>
            <ExternalLink href="https://example.com/regulamin" style={styles.link}>
              <ThemedText style={[styles.linkText, { color: textColor }]}>
                Regulamin
              </ThemedText>
            </ExternalLink>
            <IconSymbol name="arrow.up.right" size={20} color={isDark ? '#9BA1A6' : '#687076'} />
          </ThemedView>

          <ThemedView style={styles.linkItem}>
            <ExternalLink href="https://example.com/formualrz_kontaktowy" style={styles.link}>
              <ThemedText style={[styles.linkText, { color: textColor }]}>
                Formularz kontaktowy
              </ThemedText>
            </ExternalLink>
            <IconSymbol name="arrow.up.right" size={20} color={isDark ? '#9BA1A6' : '#687076'} />
          </ThemedView>
        </ThemedView>
        
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 34,
    fontWeight: '700',
    paddingHorizontal: 20,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
  },
  link: {
    flex: 1,
  },
  linkText: {
    fontSize: 16,
  },
  creatorsSection: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 32,
    borderRadius: 12,
  },
  creatorsTitle: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 12,
  },
  creatorsText: {
    fontSize: 15,
    lineHeight: 22,
  },
});

