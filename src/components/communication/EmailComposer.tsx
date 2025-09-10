import React, { useState } from 'react';
import { Mail, Send, Save, Eye, X, Plus, Trash2 } from 'lucide-react';
import type { NotificationTemplate, Patient } from '../../types';

interface EmailComposerProps {
  patients?: Patient[];
  templates?: NotificationTemplate[];
  onSend: (emailData: EmailData) => Promise<void>;
  onSaveTemplate?: (template: Partial<NotificationTemplate>) => Promise<void>;
  initialData?: Partial<EmailData>;
  isOpen: boolean;
  onClose: () => void;
}

interface EmailData {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  content: string;
  templateId?: string;
  variables?: Record<string, string>;
  attachments?: File[];
}

interface EmailVariable {
  key: string;
  value: string;
  description: string;
}

const EmailComposer: React.FC<EmailComposerProps> = ({
  templates = [],
  onSend,
  onSaveTemplate,
  initialData,
  isOpen,
  onClose
}) => {
  const [emailData, setEmailData] = useState<EmailData>({
    to: '',
    subject: '',
    content: '',
    variables: {},
    attachments: [],
    ...initialData
  });

  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    content: '',
    event: 'booking_confirmation' as const
  });

  // Variáveis disponíveis para templates
  const availableVariables: EmailVariable[] = [
    { key: '{{patientName}}', value: '', description: 'Nome do paciente' },
    { key: '{{patientEmail}}', value: '', description: 'Email do paciente' },
    { key: '{{appointmentDate}}', value: '', description: 'Data da consulta' },
    { key: '{{appointmentTime}}', value: '', description: 'Horário da consulta' },
    { key: '{{psychologistName}}', value: '', description: 'Nome do psicólogo' },
    { key: '{{confirmationCode}}', value: '', description: 'Código de confirmação' },
    { key: '{{price}}', value: '', description: 'Valor da consulta' },
    { key: '{{contactPhone}}', value: '', description: 'Telefone de contato' }
  ];

  // Aplicar template selecionado
  const applyTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setEmailData(prev => ({
      ...prev,
      subject: template.subject || '',
      content: template.template,
      templateId: template.id
    }));
  };

  // Substituir variáveis no conteúdo
  const replaceVariables = (content: string, variables: Record<string, string>): string => {
    let result = content;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(key.replace(/[{}]/g, '\\$&'), 'g');
      result = result.replace(regex, value);
    });
    return result;
  };

  // Preview do email
  const getPreviewContent = () => {
    return replaceVariables(emailData.content, emailData.variables || {});
  };

  // Enviar email
  const handleSend = async () => {
    if (!emailData.to || !emailData.subject || !emailData.content) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSending(true);
    try {
      await onSend(emailData);
      setEmailData({ to: '', subject: '', content: '', variables: {}, attachments: [] });
      onClose();
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      alert('Erro ao enviar email. Tente novamente.');
    } finally {
      setIsSending(false);
    }
  };

  // Salvar template
  const handleSaveTemplate = async () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
      alert('Preencha todos os campos do template');
      return;
    }

    if (onSaveTemplate) {
      await onSaveTemplate(newTemplate);
      setShowTemplateModal(false);
      setNewTemplate({ name: '', subject: '', content: '', event: 'booking_confirmation' });
    }
  };

  // Adicionar anexo
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setEmailData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...files]
    }));
  };

  // Remover anexo
  const removeAttachment = (index: number) => {
    setEmailData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || []
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Compositor de Email</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar com templates e variáveis */}
          <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
            {/* Templates */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Templates</h3>
              <div className="space-y-2">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{template.event}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {template.subject}
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-gray-600"
                >
                  <Plus className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-sm">Novo Template</div>
                </button>
              </div>
            </div>

            {/* Variáveis */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Variáveis</h3>
              <div className="space-y-2">
                {availableVariables.map(variable => (
                  <div key={variable.key} className="text-xs">
                    <div className="font-mono bg-gray-200 px-2 py-1 rounded mb-1">
                      {variable.key}
                    </div>
                    <div className="text-gray-600">{variable.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Área principal */}
          <div className="flex-1 flex flex-col">
            {/* Controles */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      isPreviewMode
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    {isPreviewMode ? 'Editar' : 'Preview'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTemplateModal(true)}
                    className="px-3 py-1 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <Save className="w-4 h-4 inline mr-1" />
                    Salvar Template
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={isSending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isSending ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="flex-1 p-4 overflow-y-auto">
              {isPreviewMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Para
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {emailData.to}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assunto
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {emailData.subject}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Conteúdo
                    </label>
                    <div 
                      className="p-4 bg-gray-50 rounded-lg min-h-64 prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Destinatário */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Para *
                    </label>
                    <input
                      type="email"
                      value={emailData.to}
                      onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  {/* CC e BCC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CC
                      </label>
                      <input
                        type="email"
                        value={emailData.cc || ''}
                        onChange={(e) => setEmailData(prev => ({ ...prev, cc: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="copia@exemplo.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        BCC
                      </label>
                      <input
                        type="email"
                        value={emailData.bcc || ''}
                        onChange={(e) => setEmailData(prev => ({ ...prev, bcc: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="copia.oculta@exemplo.com"
                      />
                    </div>
                  </div>

                  {/* Assunto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assunto *
                    </label>
                    <input
                      type="text"
                      value={emailData.subject}
                      onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Assunto do email"
                    />
                  </div>

                  {/* Conteúdo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Conteúdo *
                    </label>
                    <textarea
                      value={emailData.content}
                      onChange={(e) => setEmailData(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={12}
                      placeholder="Digite o conteúdo do email. Use as variáveis da sidebar para personalização."
                    />
                  </div>

                  {/* Anexos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Anexos
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {emailData.attachments && emailData.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {emailData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <button
                              onClick={() => removeAttachment(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de Template */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4">Salvar Template</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Template
                  </label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome do template"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assunto
                  </label>
                  <input
                    type="text"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Assunto padrão"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conteúdo
                  </label>
                  <textarea
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={6}
                    placeholder="Conteúdo do template"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailComposer;
