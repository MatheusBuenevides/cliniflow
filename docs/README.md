# Documentação CliniFlow

## 📋 Visão Geral

O CliniFlow é uma plataforma completa desenvolvida especificamente para psicólogos, oferecendo quatro módulos principais:

1. **Agendamento Online e Gestão de Agenda** - Portal público com URL personalizada
2. **Prontuário Eletrônico e Fichas de Pacientes** - Sistema seguro com criptografia
3. **Sessões Online (Telepsicologia)** - Videoconferência integrada e segura
4. **Módulo Financeiro e Pagamentos** - Controle completo das finanças

## 📚 Documentação Disponível

### 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md)
**Arquitetura técnica completa do sistema**
- Stack tecnológica (React 19, TypeScript, Tailwind CSS v4)
- Estrutura de pastas e organização do código
- Padrões arquiteturais e convenções
- Módulos principais detalhados
- Segurança e criptografia
- Próximos passos de desenvolvimento

### ✨ [FEATURES.md](./FEATURES.md)
**Especificação detalhada de todas as funcionalidades**
- **Módulo 1**: Agendamento online com URL personalizada por psicólogo
- **Módulo 2**: Prontuário eletrônico com criptografia end-to-end
- **Módulo 3**: Telepsicologia com videoconferência segura
- **Módulo 4**: Sistema financeiro com gateway de pagamentos
- Regras de negócio específicas para psicólogos
- Conformidade com CFP e LGPD

### 🛠️ [DEVELOPMENT.md](./DEVELOPMENT.md)
**Guia completo de desenvolvimento**
- Configuração do ambiente de desenvolvimento
- Convenções de código e nomenclatura
- Estrutura de componentes React
- Padrões TypeScript e gerenciamento de estado
- Integração com APIs e tratamento de erros
- Otimizações de performance
- Setup de testes e deploy

### 🎨 [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
**Sistema de design especializado para psicólogos**
- Filosofia de design acolhedora e profissional
- Paleta de cores terapêuticas e funcionais
- Componentes especializados (AgendamentoCard, VideoSessionCard)
- Estados visuais específicos (status de consulta, pagamento)
- Ícones contextualizados para psicologia
- Elementos de privacidade e criptografia
- Acessibilidade e usabilidade

### 🔌 [API_SPECIFICATION.md](./API_SPECIFICATION.md)
**Especificação completa da API RESTful**
- Autenticação e autorização
- Endpoints para página pública de agendamento
- API de pacientes e prontuários
- Sistema de agendamentos e agenda
- Telepsicologia e sessões de vídeo
- Módulo financeiro e pagamentos
- Configurações e relatórios
- Códigos de erro e rate limiting

### 📝 [types/index.ts](../src/types/index.ts)
**Definições TypeScript completas**
- Interfaces para todos os módulos principais
- Tipos específicos para psicólogos e pacientes
- Estruturas de agendamento e sessões
- Tipos financeiros e de pagamento
- Interfaces de formulários e validação
- Tipos para videochamadas e chat
- Estados da aplicação e contextos

## 🚀 Como Usar Esta Documentação

### Para Desenvolvedores
1. **Começar com**: `ARCHITECTURE.md` - Entenda a estrutura geral
2. **Setup**: `DEVELOPMENT.md` - Configure seu ambiente
3. **Tipos**: `types/index.ts` - Familiarize-se com as interfaces
4. **API**: `API_SPECIFICATION.md` - Entenda os endpoints
5. **UI**: `DESIGN_SYSTEM.md` - Implemente a interface

### Para Product Managers
1. **Funcionalidades**: `FEATURES.md` - Visão completa do produto
2. **Arquitetura**: `ARCHITECTURE.md` - Entenda as capacidades técnicas
3. **API**: `API_SPECIFICATION.md` - Planeje integrações

### Para Designers
1. **Design System**: `DESIGN_SYSTEM.md` - Guia visual completo
2. **Funcionalidades**: `FEATURES.md` - Contexto de uso
3. **Tipos**: `types/index.ts` - Entenda as estruturas de dados

## 🎯 Principais Diferenciais

### Especialização em Psicologia
- URL personalizada por profissional (clinicflow.com/nomedopsicologo)
- Conformidade com resoluções do CFP (Conselho Federal de Psicologia)
- Terminologia e fluxos específicos da área
- Design acolhedor e profissional

### Segurança e Privacidade
- Criptografia end-to-end para dados sensíveis
- Conformidade total com LGPD
- Videoconferência segura sem necessidade de apps externos
- Auditoria completa de acessos

### Facilidade de Uso
- Interface intuitiva para psicólogos e pacientes
- Agendamento online automatizado
- Lembretes automáticos por e-mail/WhatsApp
- Dashboard financeiro simplificado

### Tecnologia Moderna
- React 19 com TypeScript
- Tailwind CSS v4 (zero configuração)
- WebRTC para videoconferência
- Gateway de pagamento integrado

## 📋 Status do Projeto

### ✅ Concluído
- [ ] Documentação técnica completa
- [ ] Especificação de funcionalidades
- [ ] Design system especializado
- [ ] Definições TypeScript
- [ ] Especificação da API

### 🚧 Em Desenvolvimento
- [ ] Implementação do frontend React
- [ ] API backend em Node.js
- [ ] Sistema de videoconferência
- [ ] Gateway de pagamentos

### 📋 Próximas Etapas
1. Implementar página pública de agendamento
2. Desenvolver sistema de prontuário eletrônico
3. Integrar videoconferência WebRTC
4. Configurar gateway de pagamentos
5. Implementar notificações automáticas

## 📞 Contato e Suporte

Para dúvidas sobre a documentação ou implementação:
- Consulte os arquivos específicos na pasta `docs/`
- Verifique os tipos TypeScript em `src/types/`
- Utilize a especificação da API para desenvolvimento

---

**Nota**: Esta documentação é atualizada conforme o desenvolvimento do projeto. Sempre consulte a versão mais recente no repositório.
