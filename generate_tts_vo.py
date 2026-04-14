# 15s TVC VO Script - Text-to-Speech Generator
# This script generates Cantonese TTS audio for the 15-second TVC

import win32com.client
import time

def generate_tts_audio():
    """Generate Cantonese TTS audio for TVC script"""
    
    # Initialize SAPI voice
    speaker = win32com.client.Dispatch("SAPI.SpVoice")
    
    # Get available voices
    voices = speaker.GetVoices()
    print(f"Available voices: {voices.Count}")
    
    # Try to find Cantonese voice
    cantonese_voice = None
    for i in range(voices.Count):
        voice = voices.Item(i)
        print(f"Voice {i}: {voice.GetDescription()}")
        if 'Cantonese' in voice.GetDescription() or 'Chinese' in voice.GetDescription():
            cantonese_voice = voice
    
    # Set voice (use first Chinese/Cantonese voice found, or default)
    if cantonese_voice:
        speaker.Voice = cantonese_voice
        print(f"Using voice: {cantonese_voice.GetDescription()}")
    else:
        print("Warning: No Cantonese voice found, using default")
    
    # Set speech rate and volume
    speaker.Rate = 0  # Normal speed (-10 to 10)
    speaker.Volume = 100  # Full volume (0 to 100)
    
    # TVC Script - Version 1 (Standard)
    script_parts = [
        ("", 2),  # 0-2s: No voice, just sound effect
        ("計錯數?睇錯匯率?漏咗帳?", 3),  # 2-5s
        ("外遊象寶,一App搞掂!", 4),  # 5-9s
        ("外遊象寶——外幣好管家,旅遊好夥伴!", 4),  # 9-13s
        ("", 2)  # 13-15s: Jumbo sound only
    ]
    
    print("\n=== Generating TTS Audio ===\n")
    
    for i, (text, duration) in enumerate(script_parts):
        if text:
            print(f"Part {i+1} ({duration}s): {text}")
            speaker.Speak(text)
            time.sleep(0.5)  # Small pause between parts
        else:
            print(f"Part {i+1} ({duration}s): [Sound Effect Only]")
            time.sleep(duration)
    
    print("\n=== TTS Generation Complete ===")
    print("Note: This is a preview. For production, use professional recording.")

if __name__ == "__main__":
    generate_tts_audio()
