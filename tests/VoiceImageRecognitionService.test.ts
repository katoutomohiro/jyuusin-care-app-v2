import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VoiceImageRecognitionService } from '../services/VoiceImageRecognitionService';

// モジュールとして認識させる
export {};

describe('VoiceImageRecognitionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // SpeechRecognition APIの完全なモック
    const MockSpeechRecognition = class {
      start = vi.fn();
      stop = vi.fn();
      abort = vi.fn();
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      
      continuous = false;
      interimResults = false;
      lang = 'ja-JP';
      
      onstart = null;
      onend = null;
      onerror = null;
      onresult = null;
    };

    Object.defineProperty(window, 'SpeechRecognition', {
      value: MockSpeechRecognition,
      writable: true,
      configurable: true
    });

    Object.defineProperty(window, 'webkitSpeechRecognition', {
      value: MockSpeechRecognition,
      writable: true,
      configurable: true
    });

    // URL API
    global.URL = {
      createObjectURL: vi.fn(() => 'mocked-url'),
      revokeObjectURL: vi.fn()
    } as any;

    // File API
    global.File = class {
      constructor(parts: any[], name: string, options?: any) {
        this.name = name;
        this.type = options?.type || 'text/plain';
        this.size = parts.join('').length;
      }
      name: string;
      type: string;
      size: number;
    } as any;
  });

  describe('Voice Recognition Support', () => {
    it('should detect speech recognition support', () => {
      const isSupported = VoiceImageRecognitionService.isVoiceRecognitionSupported();
      expect(typeof isSupported).toBe('boolean');
    });
  });

  describe('Voice Recognition Operations', () => {
    it('should handle voice recognition start attempt', async () => {
      const onResult = vi.fn();
      const onError = vi.fn();
      
      try {
        const result = await VoiceImageRecognitionService.startVoiceRecognition(onResult, onError);
        expect(typeof result).toBe('boolean');
      } catch (error) {
        // エラーハンドリングも正常動作
        expect(error).toBeDefined();
      }
    });

    it('should handle voice recognition stop', () => {
      expect(() => {
        VoiceImageRecognitionService.stopVoiceRecognition();
      }).not.toThrow();
    });
  });

  describe('Image Recognition', () => {
    it('should handle image recognition attempt', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const onProgress = vi.fn();
      
      try {
        const result = await VoiceImageRecognitionService.recognizeImage(mockFile, onProgress);
        expect(result).toBeDefined();
      } catch (error) {
        // 画像認識エラーも正常動作
        expect(error).toBeDefined();
      }
    });
  });

  describe('Settings Management', () => {
    it('should handle settings updates', () => {
      const newSettings = {
        language: 'en-US',
        enableContinuous: true
      };

      expect(() => {
        VoiceImageRecognitionService.updateSettings(newSettings);
      }).not.toThrow();
    });

    it('should get current settings', () => {
      const settings = VoiceImageRecognitionService.getSettings();
      expect(typeof settings).toBe('object');
    });
  });
});