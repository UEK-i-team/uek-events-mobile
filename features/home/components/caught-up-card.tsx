import { ThemedText } from '@/shared/components/themed-text';
import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';

interface CaughtUpCardProps {
  cardHeight: number;
  isVisible?: boolean; // Czy karta jest aktualnie widoczna na ekranie
}

// Komponent dla kulki krążącej po orbicie
const OrbitingParticle = ({ index, radius, duration, startAnimation }: { index: number; radius: number; duration: number; startAnimation: boolean }) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hasStarted = useRef(false);

  useEffect(() => {
    // Animacja startuje TYLKO gdy startAnimation === true i nie była wcześniej uruchomiona
    if (!startAnimation || hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

    // Ciągła rotacja
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: duration,
        delay: index * 200, // Każda kulka startuje z opóźnieniem
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [startAnimation, rotation, opacity, index, duration]);

  const rotateValue = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const colors = ['#833AB4', '#FD1D1D', '#FCB045', '#F77737', '#E100FF'];
  const color = colors[index % colors.length];

  return (
    <Animated.View
      style={[
        styles.orbitContainer,
        {
          transform: [{ rotate: rotateValue }],
          opacity,
        },
      ]}>
      <View style={[styles.orbitingParticle, { backgroundColor: color, top: -radius }]} />
    </Animated.View>
  );
};

// Komponent dla pojedynczego "wybuchu" z okręgu
const BurstParticle = ({ angle, delay, startAnimation }: { angle: number; delay: number; startAnimation: boolean }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hasStarted = useRef(false);

  useEffect(() => {
    // Animacja startuje TYLKO gdy startAnimation === true i nie była wcześniej uruchomiona
    if (!startAnimation || hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    const distance = 80;
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: endX,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: endY,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1,
            duration: 200,
            easing: Easing.out(Easing.back(2)),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0,
            duration: 400,
            delay: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 400,
            delay: 100,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, [startAnimation, angle, delay, translateX, translateY, scale, opacity]);

  const colors = ['#833AB4', '#FD1D1D', '#FCB045', '#F77737', '#E100FF'];
  const colorIndex = Math.floor(angle / (Math.PI * 2 / colors.length));
  const color = colors[colorIndex % colors.length];

  return (
    <Animated.View
      style={[
        styles.burstParticle,
        {
          backgroundColor: color,
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
    />
  );
};

export function CaughtUpCard({ cardHeight, isVisible = false }: CaughtUpCardProps) {
  const colorScheme = useColorScheme();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const isDark = colorScheme === 'dark';
  
  // Animacje
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowScale = useRef(new Animated.Value(1)).current;
  const glowOpacityAnim = useRef(new Animated.Value(0.3)).current;
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Animacja startuje TYLKO gdy karta staje się widoczna i nie była wcześniej animowana
    if (!isVisible || hasAnimated.current) {
      return;
    }

    hasAnimated.current = true;

    // Animacja wejścia - energiczne pojawienie się (natychmiastowy start!)
    Animated.sequence([
      // Fade in karty
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Wielki pop ikony
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        friction: 3,
        tension: 50,
        useNativeDriver: true,
      }),
      // Lekki bounce back
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation - subtelny efekt "życia" dla ikony (startuje po głównej animacji)
    const pulseTimer = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 800); // Startuje po głównej animacji

    // Glow animation - pulsujący blask (startuje po głównej animacji)
    const glowTimer = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(glowOpacityAnim, {
              toValue: 0.6,
              duration: 2000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(glowScale, {
              toValue: 1.05,
              duration: 2000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(glowOpacityAnim, {
              toValue: 0.3,
              duration: 2000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(glowScale, {
              toValue: 1,
              duration: 2000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    }, 800); // Startuje po głównej animacji

    // Cleanup timers
    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(glowTimer);
    };
  }, [isVisible, scaleAnim, fadeAnim, pulseAnim, glowScale, glowOpacityAnim]);

  const backgroundColor = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const secondaryTextColor = isDark ? '#CCCCCC' : '#666666';

  // Generuj burst particles wokół okręgu
  const burstParticles = Array.from({ length: 12 }).map((_, i) => ({
    angle: (i / 12) * Math.PI * 2,
    delay: 400 + i * 30,
  }));

  // Orbiting particles - kulki krążące wokół
  const orbitingParticles = [
    { radius: 85, duration: 4000 }, // Szybsza, bliższa
    { radius: 95, duration: 5000 },
    { radius: 105, duration: 6000 }, // Wolniejsza, dalsza
  ];

  return (
    <View
      style={[
        styles.container,
        {
          width: SCREEN_WIDTH,
          height: cardHeight,
        },
      ]}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor,
            width: SCREEN_WIDTH - 32,
            height: cardHeight - 32,
            opacity: fadeAnim,
          },
        ]}>
        
        {/* Gradient overlay - subtelny */}
        <View style={[styles.gradientOverlay, { 
          backgroundColor: isDark 
            ? 'rgba(131, 58, 180, 0.08)' 
            : 'rgba(131, 58, 180, 0.04)',
          borderRadius: 16,
        }]} />

        {/* Ikona z burst particles i orbiting particles */}
        <View style={styles.iconWrapper}>
          {/* Burst particles - wyskakują promienisto */}
          {burstParticles.map((particle, i) => (
            <BurstParticle 
              key={i} 
              angle={particle.angle} 
              delay={particle.delay}
              startAnimation={isVisible}
            />
          ))}

          {/* Orbiting particles - kulki krążące wokół */}
          {orbitingParticles.map((orbit, i) => (
            <OrbitingParticle 
              key={`orbit-${i}`} 
              index={i} 
              radius={orbit.radius} 
              duration={orbit.duration}
              startAnimation={isVisible}
            />
          ))}

          {/* Glow effect */}
          <Animated.View
            style={[
              styles.glowCircle,
              {
                opacity: glowOpacityAnim,
                transform: [{ scale: glowScale }],
              },
            ]}
          />


          {/* Ikona container z animacją */}
          <Animated.View 
            style={[
              styles.iconContainer,
              { 
                transform: [
                  { scale: Animated.multiply(scaleAnim, pulseAnim) }
                ] 
              }
            ]}>
            <View style={styles.iconCircleOuter}>
              <View style={styles.iconCircleInner}>
                <MaterialIcons
                  name="verified"
                  size={64}
                  color="#FFFFFF"
                />
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Główny tekst */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <ThemedText
            style={[
              styles.title,
              {
                color: textColor,
              },
            ]}>
            Jesteś na bieżąco!
          </ThemedText>

          {/* Subtitle */}
          <ThemedText
            style={[
              styles.subtitle,
              {
                color: secondaryTextColor,
              },
            ]}>
            Gratulacje! 
          </ThemedText>

          {/* Opis */}
          <ThemedText
            style={[
              styles.description,
              {
                color: secondaryTextColor,
              },
            ]}>
            Przejrzałeś wszystkie nowe wydarzenia. 👏
          </ThemedText>

          {/* Separator line */}
          <View style={[styles.separator, { 
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' 
          }]} />

          {/* Strzałka bez animacji */}
          <View style={styles.arrowContainer}>
            <View style={styles.arrowIconWrapper}>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={32}
                color="#833AB4"
              />
            </View>
            <ThemedText
              style={[
                styles.arrowText,
                {
                  color: '#833AB4',
                },
              ]}>
              Przesuń w dół
            </ThemedText>
          </View>

          {/* Zachęta */}
          <ThemedText
            style={[
              styles.encouragement,
              {
                color: secondaryTextColor,
              },
            ]}>
            Zobacz ponownie poprzednie wydarzenia
          </ThemedText>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    overflow: 'hidden',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
    shadowColor: '#833AB4',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  burstParticle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  orbitContainer: {
    position: 'absolute',
    width: 1,
    height: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbitingParticle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  glowCircle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#833AB4',
    shadowColor: '#833AB4',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  iconContainer: {
    zIndex: 10,
  },
  iconCircleOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#833AB4',
    shadowColor: '#833AB4',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 15,
  },
  iconCircleInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#833AB4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    marginTop: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  separator: {
    width: '60%',
    height: 1,
    marginVertical: 16,
    alignSelf: 'center',
  },
  arrowContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  arrowIconWrapper: {
    backgroundColor: 'rgba(131, 58, 180, 0.1)',
    borderRadius: 20,
    padding: 4,
  },
  arrowText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  encouragement: {
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
  },
});
