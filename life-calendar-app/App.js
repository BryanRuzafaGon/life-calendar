import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Dimensions, Alert, StatusBar } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LifeGrid from './components/LifeGrid';
import SettingsPanel from './components/SettingsPanel';

const QUOTES = [
  "La disciplina es libertad.",
  "Memento Mori: Recuerda que morirás.",
  "Amor Fati: Ama tu destino.",
  "Lo que haces hoy es lo que serás mañana.",
  "Enfócate en lo que puedes controlar."
];

export default function App() {
    const viewShotRef = useRef(null);
    const [settings, setSettings] = useState({
        birthday: '2006-08-10',
        title: 'Bryan Ruzafa Gonçalves',
        theme: 'black',
        shape: 'circle',
        group: 'decades'
    });
    
    const [quote, setQuote] = useState(QUOTES[0]);
    const [weeksLived, setWeeksLived] = useState(0);

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        // Calculate weeks
        const bdate = new Date(settings.birthday);
        const now = new Date();
        const diff = Math.abs(now - bdate);
        const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
        setWeeksLived(isNaN(weeks) ? 0 : weeks);
        saveSettings(settings);
    }, [settings]);

    const loadSettings = async () => {
        try {
            const saved = await AsyncStorage.getItem('lc_settings');
            if (saved) setSettings(JSON.parse(saved));
            setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
        } catch(e) {}
    };

    const saveSettings = async (s) => {
        try {
            await AsyncStorage.setItem('lc_settings', JSON.stringify(s));
        } catch(e) {}
    };

    const handleDownload = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Necesitamos permiso para guardar en Fotos.');
                return;
            }

            // viewShot automatically scales to standard physical pixels, 
            // but we enforce a high high-res output multiplier directly in ViewShot options conceptually,
            // or simply save the URI it gives.
            const uri = await viewShotRef.current.capture();
            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert('¡Magia Hecha!', 'Fondo guardado en tu galería de Fotos. Ponlo e impresiona a todos.');
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const isWhite = settings.theme === 'white';
    
    // Year progress
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);
    const percent = Math.min(Math.max(((now - start) / (end - start)) * 100, 0), 100).toFixed(1);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView style={styles.scrollArea}>
                <SafeAreaView>
                    <View style={styles.previewSection}>
                        <Text style={styles.helperText}>PREVIEW (Scaled for screen)</Text>
                        
                        <View style={styles.wallpaperWrapper}>
                            {/* The Invisible Canvas for 4K Export */}
                            <ViewShot 
                                ref={viewShotRef} 
                                options={{ format: "png", quality: 1 }}
                                style={[styles.wallpaper, isWhite ? styles.bgWhite : styles.bgBlack]}
                            >
                                {/* Exact top space for iOS lock screen widget/clock clearance */}
                                <View style={{ height: 260 }} />
                                
                                <View style={styles.header}>
                                    <Text style={[styles.appTitle, isWhite ? styles.textBlack : styles.textWhite]}>
                                        {settings.title}
                                    </Text>
                                </View>
                                
                                <LifeGrid 
                                    weeksLived={weeksLived} 
                                    theme={settings.theme}
                                    shape={settings.shape}
                                    group={settings.group}
                                />

                                <View style={styles.bottomContent}>
                                    <Text style={[styles.quote, isWhite ? styles.textMutedDark : styles.textMuted]}>"{quote}"</Text>
                                    
                                    <View style={styles.progressContainer}>
                                        <View style={styles.progressInfo}>
                                            <Text style={[styles.progressLabel, isWhite ? styles.textBlack : undefined]}>{now.getFullYear()} PROGRESS</Text>
                                            <Text style={[styles.progressLabel, isWhite ? styles.textBlack : undefined]}>{percent}%</Text>
                                        </View>
                                        <View style={[styles.progressTrack, isWhite ? styles.trackWhite : styles.trackBlack]}>
                                            <View style={[styles.progressFill, { width: `${percent}%` }, isWhite ? {backgroundColor:'#000'} : {}]} />
                                        </View>
                                    </View>
                                </View>
                            </ViewShot>
                        </View>
                    </View>

                    <View style={styles.settingsSection}>
                        <SettingsPanel settings={settings} setSettings={setSettings} onSave={handleDownload} />
                    </View>
                </SafeAreaView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    scrollArea: { flex: 1 },
    previewSection: { alignItems: 'center', paddingVertical: 20 },
    helperText: { color: '#555', fontSize: 10, letterSpacing: 2, marginBottom: 10 },
    
    // The wrapper scales the 430x932 frame down so it elegantly fits the phone screen while editing
    wallpaperWrapper: {
        width: 430,
        height: 932,
        transform: [{ scale: 0.65 }], // Fits most mobile screens
        marginBottom: -300, // Counteracts the visual whitespace created by scale shrink
    },
    
    wallpaper: {
        width: 430, 
        height: 932, // Logical iPhone Pro Max bounds
        borderRadius: 40,
        overflow: 'hidden',
        borderWidth: 8,
        borderColor: '#222',
    },
    
    bgBlack: { backgroundColor: '#000' },
    bgWhite: { backgroundColor: '#fff' },
    textWhite: { color: '#fff' },
    textBlack: { color: '#000' },
    textMuted: { color: '#888' },
    textMutedDark: { color: '#555' },
    
    header: { alignItems: 'center', marginBottom: 20 },
    appTitle: { fontSize: 16, fontWeight: '600', opacity: 0.8 },
    
    bottomContent: { marginTop: 'auto', marginBottom: 120, paddingHorizontal: 30, alignItems: 'center', gap: 15 },
    quote: { fontSize: 12, fontStyle: 'italic', textAlign: 'center' },
    
    progressContainer: { width: '100%', marginTop: 10 },
    progressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    progressLabel: { fontSize: 10, color: '#888', fontWeight: 'bold' },
    progressTrack: { height: 4, borderRadius: 2 },
    trackBlack: { backgroundColor: 'rgba(255,255,255,0.15)' },
    trackWhite: { backgroundColor: 'rgba(0,0,0,0.15)' },
    progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 2 },
    
    settingsSection: { paddingBottom: 50 }
});
