/**
 * 音声・画像認識サービス
 * 音声入力、画像認識による記録支援機能
 */
export class VoiceImageRecognitionService {
    /**
     * 音声認識を開始
     */
    static async startVoiceRecognition(onResult, onError) {
        try {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                throw new Error('音声認識がサポートされていません');
            }
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.lang = this.settings.language;
            this.recognition.continuous = this.settings.enableContinuous;
            this.recognition.interimResults = true;
            this.recognition.onstart = () => {
                this.isListening = true;
                console.log('音声認識を開始しました');
            };
            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    }
                    else {
                        interimTranscript += transcript;
                    }
                }
                if (finalTranscript) {
                    const result = {
                        text: this.processVoiceText(finalTranscript),
                        confidence: this.calculateConfidence(event.results),
                        timestamp: new Date().toISOString(),
                        duration: this.calculateDuration(event.results),
                        language: this.settings.language
                    };
                    onResult(result);
                }
            };
            this.recognition.onerror = (event) => {
                this.isListening = false;
                onError(`音声認識エラー: ${event.error}`);
            };
            this.recognition.onend = () => {
                this.isListening = false;
                console.log('音声認識を終了しました');
            };
            this.recognition.start();
            return true;
        }
        catch (error) {
            console.error('音声認識開始エラー:', error);
            onError(`音声認識の開始に失敗しました: ${error}`);
            return false;
        }
    }
    /**
     * 音声認識を停止
     */
    static stopVoiceRecognition() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }
    /**
     * 音声認識の状態を取得
     */
    static isVoiceRecognitionActive() {
        return this.isListening;
    }
    /**
     * 画像認識を実行
     */
    static async recognizeImage(imageFile, onProgress) {
        try {
            // 画像ファイルのバリデーション
            if (!imageFile || !imageFile.type || !imageFile.type.startsWith('image/')) {
                throw new Error('画像ファイル以外は処理できません');
            }
            
            // 画像を読み込み
            const image = await this.loadImage(imageFile);
            // 進捗を報告
            if (onProgress)
                onProgress(20);
            // オブジェクト検出
            const objects = this.settings.enableObjectDetection ?
                await this.detectObjects(image) : [];
            if (onProgress)
                onProgress(40);
            // 顔検出
            const faces = this.settings.enableFaceDetection ?
                await this.detectFaces(image) : [];
            if (onProgress)
                onProgress(60);
            // テキスト認識
            const text = this.settings.enableTextRecognition ?
                await this.recognizeText(image) : [];
            if (onProgress)
                onProgress(80);
            // 感情分析
            const emotions = await this.analyzeEmotions(image);
            if (onProgress)
                onProgress(100);
            return {
                objects,
                text,
                faces,
                emotions,
                timestamp: new Date().toISOString(),
                confidence: this.calculateImageConfidence(objects, faces, text)
            };
        }
        catch (error) {
            console.error('画像認識エラー:', error);
            throw new Error(`画像認識に失敗しました: ${error}`);
        }
    }
    /**
     * 音声テキストを処理
     */
    static processVoiceText(text) {
        let processedText = text;
        // 不適切な表現のフィルタリング
        if (this.settings.enableProfanityFilter) {
            processedText = this.filterProfanity(processedText);
        }
        // 自動句読点の追加
        if (this.settings.enableAutoPunctuation) {
            processedText = this.addPunctuation(processedText);
        }
        // 医療用語の正規化
        processedText = this.normalizeMedicalTerms(processedText);
        return processedText;
    }
    /**
     * 不適切な表現をフィルタリング
     */
    static filterProfanity(text) {
        // モック実装（実際はより包括的なフィルタリング）
        const profanityList = ['不適切な表現1', '不適切な表現2'];
        let filteredText = text;
        profanityList.forEach(word => {
            filteredText = filteredText.replace(new RegExp(word, 'gi'), '***');
        });
        return filteredText;
    }
    /**
     * 自動句読点を追加
     */
    static addPunctuation(text) {
        // モック実装（実際はNLPライブラリを使用）
        let punctuatedText = text;
        // 文末に句点を追加
        if (!punctuatedText.endsWith('。') && !punctuatedText.endsWith('！') && !punctuatedText.endsWith('？')) {
            punctuatedText += '。';
        }
        return punctuatedText;
    }
    /**
     * 医療用語を正規化
     */
    static normalizeMedicalTerms(text) {
        // モック実装（実際は医療用語辞書を使用）
        const medicalTerms = {
            'てんかん': 'てんかん',
            'けいれん': 'けいれん',
            '発作': '発作',
            '体温': '体温',
            '血圧': '血圧',
            '脈拍': '脈拍'
        };
        let normalizedText = text;
        Object.entries(medicalTerms).forEach(([original, normalized]) => {
            normalizedText = normalizedText.replace(new RegExp(original, 'gi'), normalized);
        });
        return normalizedText;
    }
    /**
     * 信頼度を計算
     */
    static calculateConfidence(results) {
        if (results.length === 0)
            return 0;
        const confidences = results.map(result => result[0].confidence || 0.5);
        return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    }
    /**
     * 音声の長さを計算
     */
    static calculateDuration(results) {
        // モック実装
        return results.length * 0.5; // 推定値
    }
    /**
     * 画像を読み込み
     */
    static loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
            img.src = URL.createObjectURL(file);
        });
    }
    /**
     * オブジェクトを検出
     */
    static async detectObjects(image) {
        // モック実装（実際はTensorFlow.jsやOpenCV.jsを使用）
        const mockObjects = [
            {
                name: '人',
                confidence: 0.95,
                boundingBox: { x: 100, y: 100, width: 200, height: 300 }
            },
            {
                name: '椅子',
                confidence: 0.87,
                boundingBox: { x: 50, y: 350, width: 150, height: 100 }
            }
        ];
        // 実際の実装では、TensorFlow.jsのCOCO-SSDモデルなどを使用
        return mockObjects;
    }
    /**
     * 顔を検出
     */
    static async detectFaces(image) {
        // モック実装（実際はface-api.jsなどを使用）
        const mockFaces = [
            {
                age: 25,
                gender: '女性',
                emotion: '笑顔',
                confidence: 0.92,
                boundingBox: { x: 120, y: 120, width: 160, height: 200 }
            }
        ];
        return mockFaces;
    }
    /**
     * テキストを認識
     */
    static async recognizeText(image) {
        // モック実装（実際はTesseract.jsなどを使用）
        const mockText = ['体温 36.8度', '血圧 120/80'];
        return mockText;
    }
    /**
     * 感情を分析
     */
    static async analyzeEmotions(image) {
        // モック実装（実際はface-api.jsの感情認識を使用）
        return {
            primary: '笑顔',
            confidence: 0.85,
            allEmotions: {
                '笑顔': 0.85,
                '普通': 0.10,
                '悲しい': 0.05
            }
        };
    }
    /**
     * 画像認識の信頼度を計算
     */
    static calculateImageConfidence(objects, faces, text) {
        const objectConfidence = objects.length > 0 ?
            objects.reduce((sum, obj) => sum + obj.confidence, 0) / objects.length : 0;
        const faceConfidence = faces.length > 0 ?
            faces.reduce((sum, face) => sum + face.confidence, 0) / faces.length : 0;
        const textConfidence = text.length > 0 ? 0.8 : 0; // テキスト認識の信頼度
        const totalConfidence = (objectConfidence + faceConfidence + textConfidence) / 3;
        return Math.min(totalConfidence, 1.0);
    }
    /**
     * 設定を更新
     */
    static updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }
    /**
     * 現在の設定を取得
     */
    static getSettings() {
        return { ...this.settings };
    }
    /**
     * 音声認識のサポート状況を確認
     */
    static isVoiceRecognitionSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }
    /**
     * 利用可能な言語を取得
     */
    static getAvailableLanguages() {
        return [
            { code: 'ja-JP', name: '日本語' },
            { code: 'en-US', name: '英語（アメリカ）' },
            { code: 'en-GB', name: '英語（イギリス）' },
            { code: 'ko-KR', name: '韓国語' },
            { code: 'zh-CN', name: '中国語（簡体字）' }
        ];
    }
    /**
     * 音声認識の品質をテスト
     */
    static async testVoiceRecognition() {
        try {
            if (!this.isVoiceRecognitionSupported()) {
                return { success: false, message: '音声認識がサポートされていません' };
            }
            // 簡単なテストを実行
            const testResult = await new Promise((resolve) => {
                let testCompleted = false;
                this.startVoiceRecognition((result) => {
                    if (!testCompleted) {
                        testCompleted = true;
                        this.stopVoiceRecognition();
                        resolve(true);
                    }
                }, (error) => {
                    if (!testCompleted) {
                        testCompleted = true;
                        resolve(false);
                    }
                });
                // 5秒後にタイムアウト
                setTimeout(() => {
                    if (!testCompleted) {
                        testCompleted = true;
                        this.stopVoiceRecognition();
                        resolve(false);
                    }
                }, 5000);
            });
            return {
                success: testResult,
                message: testResult ? '音声認識テストが成功しました' : '音声認識テストが失敗しました'
            };
        }
        catch (error) {
            return {
                success: false,
                message: `音声認識テストエラー: ${error}`
            };
        }
    }
    /**
     * 画像認識の品質をテスト
     */
    static async testImageRecognition(testImage) {
        try {
            const result = await this.recognizeImage(testImage);
            return {
                success: result.confidence > 0.5,
                message: `画像認識テスト完了。信頼度: ${(result.confidence * 100).toFixed(1)}%`
            };
        }
        catch (error) {
            return {
                success: false,
                message: `画像認識テストエラー: ${error}`
            };
        }
    }
}
VoiceImageRecognitionService.recognition = null;
VoiceImageRecognitionService.isListening = false;
VoiceImageRecognitionService.settings = {
    language: 'ja-JP',
    enableContinuous: false,
    enableProfanityFilter: true,
    enableAutoPunctuation: true,
    imageQuality: 'medium',
    enableFaceDetection: true,
    enableObjectDetection: true,
    enableTextRecognition: true
};
