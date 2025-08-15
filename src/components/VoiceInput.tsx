import React, { useState } from 'react';

export const VoiceInput: React.FC<{
  onResult: (text: string) => void;
  label?: string;
}> = ({ onResult, label }) => {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const [interim, setInterim] = useState('');
  let recognition: any;

  const start = () => {
    setError('');
    setInterim('');
    if (!('webkitSpeechRecognition' in window)) {
      setError('音声認識非対応ブラウザです');
      return;
    }
    // @ts-ignore
    recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.interimResults = true;
    recognition.onresult = (event: any) => {
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          setInterim(event.results[i][0].transcript);
        }
      }
      if (final) {
        onResult(final);
        setListening(false);
      }
    };
    recognition.onerror = (e: any) => {
      setError('音声認識エラー: ' + e.error);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
  };

  const stop = () => {
    if (recognition) recognition.stop();
    setListening(false);
  };

  return (
    <div className="my-2">
      {label && <label className="block font-bold mb-1">{label}</label>}
      <button
        className={`px-4 py-2 rounded ${listening ? 'bg-red-500' : 'bg-green-600'} text-white`}
        onClick={listening ? stop : start}
        type="button"
      >
        {listening ? '停止' : '音声入力'}
      </button>
      {interim && <span className="ml-2 text-gray-500">{interim}</span>}
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </div>
  );
};
