import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const SegmentedControl = ({ options, value, onChange }) => (
    <View style={styles.segmentContainer}>
        {options.map(opt => (
            <TouchableOpacity 
                key={opt.value} 
                style={[styles.segmentBtn, value === opt.value && styles.segmentBtnActive]}
                onPress={() => onChange(opt.value)}
            >
                <Text style={[styles.segmentText, value === opt.value && styles.segmentTextActive]}>
                    {opt.label}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

export default function SettingsPanel({ settings, setSettings, onSave }) {
    const updateSetting = (key, val) => setSettings(s => ({ ...s, [key]: val }));

    return (
        <ScrollView style={styles.panel} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.title}>Life Calendar</Text>
            <Text style={styles.subtitle}>Your entire life in weeks.</Text>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>YOUR BIRTHDAY (YYYY-MM-DD)</Text>
                <TextInput 
                    style={styles.input} 
                    value={settings.birthday} 
                    onChangeText={t => updateSetting('birthday', t)} 
                    placeholder="2006-08-10"
                    placeholderTextColor="#555"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>TITLE</Text>
                <TextInput 
                    style={styles.input} 
                    value={settings.title} 
                    onChangeText={t => updateSetting('title', t)} 
                    placeholder="Bryan Ruzafa Gonçalves"
                    placeholderTextColor="#555"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>BACKGROUND</Text>
                <SegmentedControl 
                    options={[{label: 'Black', value: 'black'}, {label: 'White', value: 'white'}]}
                    value={settings.theme}
                    onChange={v => updateSetting('theme', v)}
                />
            </View>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>DOT SHAPE</Text>
                <SegmentedControl 
                    options={[{label: 'Circle', value: 'circle'}, {label: 'Square', value: 'square'}, {label: 'Rounded', value: 'rounded'}]}
                    value={settings.shape}
                    onChange={v => updateSetting('shape', v)}
                />
            </View>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>GROUPING</Text>
                <SegmentedControl 
                    options={[{label: 'None', value: 'none'}, {label: 'Decades', value: 'decades'}]}
                    value={settings.group}
                    onChange={v => updateSetting('group', v)}
                />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
                <Text style={styles.saveBtnText}>Save High-Res Wallpaper to Photos</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    panel: { flex: 1, padding: 20, backgroundColor: '#0a0a0a' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
    subtitle: { fontSize: 14, color: '#888', marginBottom: 20 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 11, fontWeight: 'bold', color: '#888', marginBottom: 8, letterSpacing: 1 },
    input: { backgroundColor: '#111', color: '#fff', borderRadius: 8, padding: 12, fontSize: 15, borderWidth: 1, borderColor: '#333' },
    segmentContainer: { flexDirection: 'row', backgroundColor: '#111', borderRadius: 8, padding: 3 },
    segmentBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
    segmentBtnActive: { backgroundColor: '#fff' },
    segmentText: { color: '#888', fontSize: 13, fontWeight: '600' },
    segmentTextActive: { color: '#000' },
    saveBtn: { backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    saveBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' }
});
