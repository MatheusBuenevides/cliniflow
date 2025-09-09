import React, { useState, useEffect, useRef } from 'react';
import { useVideoStore } from '../../stores/useVideoStore';
import LoadingSpinner from '../ui/LoadingSpinner';

interface EquipmentTestProps {
  onTestComplete: (result: any) => void;
  onSkip: () => void;
}

export const EquipmentTest: React.FC<EquipmentTestProps> = ({
  onTestComplete,
  onSkip
}) => {
  const { testEquipment } = useVideoStore();
  const [testStep, setTestStep] = useState<'microphone' | 'camera' | 'internet' | 'complete'>('microphone');
  const [testResults, setTestResults] = useState<any>(null);
  const [microphoneLevel, setMicrophoneLevel] = useState(0);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isTestRunning, setIsTestRunning] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (testStep === 'microphone') {
      startMicrophoneTest();
    } else if (testStep === 'camera') {
      startCameraTest();
    } else if (testStep === 'internet') {
      startInternetTest();
    }

    return () => {
      cleanup();
    };
  }, [testStep]);

  const cleanup = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const startMicrophoneTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Configurar análise de áudio
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Monitorar nível do microfone
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const updateLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setMicrophoneLevel(average);
          animationFrameRef.current = requestAnimationFrame(updateLevel);
        }
      };
      updateLevel();

      // Parar teste após 3 segundos
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setTestStep('camera');
      }, 3000);
    } catch (error) {
      console.error('Erro ao testar microfone:', error);
      setTestStep('camera');
    }
  };

  const startCameraTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Parar teste após 3 segundos
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
        setTestStep('internet');
      }, 3000);
    } catch (error) {
      console.error('Erro ao testar câmera:', error);
      setTestStep('internet');
    }
  };

  const startInternetTest = async () => {
    setIsTestRunning(true);
    try {
      const result = await testEquipment();
      setTestResults(result);
      setTestStep('complete');
    } catch (error) {
      console.error('Erro ao testar internet:', error);
      setTestStep('complete');
    } finally {
      setIsTestRunning(false);
    }
  };

  const handleComplete = () => {
    onTestComplete(testResults);
  };

  const getMicrophoneStatus = () => {
    if (microphoneLevel > 50) return { status: 'excellent', color: 'text-green-500', text: 'Excelente' };
    if (microphoneLevel > 25) return { status: 'good', color: 'text-yellow-500', text: 'Bom' };
    if (microphoneLevel > 10) return { status: 'fair', color: 'text-orange-500', text: 'Regular' };
    return { status: 'poor', color: 'text-red-500', text: 'Ruim' };
  };

  const microphoneStatus = getMicrophoneStatus();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Teste de Equipamentos
            </h1>
            <p className="text-slate-400">
              Vamos verificar se seus equipamentos estão funcionando corretamente
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Progresso</span>
              <span className="text-sm text-slate-400">
                {testStep === 'microphone' && '1/3'}
                {testStep === 'camera' && '2/3'}
                {testStep === 'internet' && '3/3'}
                {testStep === 'complete' && 'Concluído'}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: testStep === 'microphone' ? '33%' : 
                         testStep === 'camera' ? '66%' : 
                         testStep === 'internet' ? '100%' : '100%'
                }}
              />
            </div>
          </div>

          {/* Teste do Microfone */}
          {testStep === 'microphone' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Testando Microfone</h3>
              <p className="text-slate-400 mb-6">
                Fale normalmente para testar seu microfone
              </p>
              
              {/* Nível do microfone */}
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-sm text-slate-400">Nível:</span>
                  <span className={`text-sm font-medium ${microphoneStatus.color}`}>
                    {microphoneStatus.text}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-200 ${
                      microphoneLevel > 50 ? 'bg-green-500' :
                      microphoneLevel > 25 ? 'bg-yellow-500' :
                      microphoneLevel > 10 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(microphoneLevel * 2, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Teste da Câmera */}
          {testStep === 'camera' && (
            <div className="text-center">
              <div className="w-64 h-48 bg-slate-700 rounded-lg mx-auto mb-6 overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Testando Câmera</h3>
              <p className="text-slate-400 mb-6">
                Verifique se sua imagem está aparecendo corretamente
              </p>
            </div>
          )}

          {/* Teste da Internet */}
          {testStep === 'internet' && (
            <div className="text-center">
              {isTestRunning ? (
                <div>
                  <LoadingSpinner size="lg" text="Testando conexão..." />
                  <p className="text-slate-400 mt-4">
                    Medindo velocidade e latência da internet...
                  </p>
                </div>
              ) : (
                <div>
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Teste Concluído</h3>
                  <p className="text-slate-400 mb-6">
                    Todos os equipamentos foram testados com sucesso
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Resultados */}
          {testStep === 'complete' && testResults && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Teste Concluído</h3>
                <p className="text-slate-400 mb-6">
                  Seus equipamentos estão prontos para a sessão
                </p>
              </div>

              {/* Resumo dos resultados */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <span className="text-white font-medium">Microfone</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Nível: {testResults.microphone.level}%
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white font-medium">Câmera</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    {testResults.camera.resolution}
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                    <span className="text-white font-medium">Internet</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    {testResults.internet.speed} Mbps
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            {testStep === 'complete' ? (
              <>
                <button
                  onClick={handleComplete}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Continuar para Sessão
                </button>
                <button
                  onClick={onSkip}
                  className="flex-1 bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors font-medium"
                >
                  Pular Teste
                </button>
              </>
            ) : (
              <button
                onClick={onSkip}
                className="w-full bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors font-medium"
              >
                Pular Teste
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
