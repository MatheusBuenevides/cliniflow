import type { PaymentMethod, PaymentStatus } from '../types';

// Interface para logs de auditoria
interface AuditLog {
  id: string;
  timestamp: string;
  userId?: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
}

type AuditAction = 
  | 'payment_created'
  | 'payment_processed'
  | 'payment_failed'
  | 'payment_cancelled'
  | 'payment_refunded'
  | 'payment_status_checked'
  | 'payment_link_created'
  | 'payment_link_updated'
  | 'payment_link_deleted'
  | 'payment_link_accessed'
  | 'refund_requested'
  | 'refund_processed'
  | 'refund_failed'
  | 'webhook_received'
  | 'webhook_processed'
  | 'webhook_failed'
  | 'gateway_config_updated'
  | 'security_alert'
  | 'suspicious_activity';

type AuditResource = 
  | 'payment'
  | 'payment_link'
  | 'refund'
  | 'webhook'
  | 'gateway'
  | 'security'
  | 'user';

// Interface para configurações de segurança
interface SecurityConfig {
  maxFailedAttempts: number;
  lockoutDuration: number; // em minutos
  suspiciousActivityThreshold: number;
  enableIpWhitelist: boolean;
  allowedIpRanges: string[];
  enableRateLimiting: boolean;
  rateLimitRequests: number;
  rateLimitWindow: number; // em minutos
}

// Interface para alertas de segurança
interface SecurityAlert {
  id: string;
  type: 'suspicious_activity' | 'multiple_failures' | 'unusual_location' | 'rate_limit_exceeded';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: Record<string, any>;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

class AuditService {
  private logs: AuditLog[] = [];
  private securityAlerts: SecurityAlert[] = [];
  private securityConfig: SecurityConfig = {
    maxFailedAttempts: 5,
    lockoutDuration: 30,
    suspiciousActivityThreshold: 10,
    enableIpWhitelist: false,
    allowedIpRanges: [],
    enableRateLimiting: true,
    rateLimitRequests: 100,
    rateLimitWindow: 15
  };

  /**
   * Registra um log de auditoria
   */
  async logAuditEvent(
    action: AuditAction,
    resource: AuditResource,
    resourceId: string,
    details: Record<string, any>,
    options: {
      userId?: string;
      ipAddress?: string;
      userAgent?: string;
      success?: boolean;
      errorMessage?: string;
    } = {}
  ): Promise<void> {
    const auditLog: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: options.userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      success: options.success ?? true,
      errorMessage: options.errorMessage
    };

    this.logs.push(auditLog);

    // Verificar se há atividade suspeita
    await this.checkSuspiciousActivity(auditLog);

    // Em produção, salvar no banco de dados
    console.log('Audit Log:', auditLog);
  }

  /**
   * Registra evento de pagamento
   */
  async logPaymentEvent(
    action: AuditAction,
    paymentId: string,
    paymentData: {
      amount: number;
      method: PaymentMethod;
      status: PaymentStatus;
      customerEmail?: string;
      customerDocument?: string;
    },
    options: {
      userId?: string;
      ipAddress?: string;
      userAgent?: string;
      success?: boolean;
      errorMessage?: string;
    } = {}
  ): Promise<void> {
    await this.logAuditEvent(
      action,
      'payment',
      paymentId,
      {
        amount: paymentData.amount,
        method: paymentData.method,
        status: paymentData.status,
        customerEmail: paymentData.customerEmail,
        customerDocument: paymentData.customerDocument
      },
      options
    );
  }

  /**
   * Registra evento de link de pagamento
   */
  async logPaymentLinkEvent(
    action: AuditAction,
    linkId: string,
    linkData: {
      amount: number;
      method: PaymentMethod;
      expiresAt: string;
      url: string;
    },
    options: {
      userId?: string;
      ipAddress?: string;
      userAgent?: string;
      success?: boolean;
      errorMessage?: string;
    } = {}
  ): Promise<void> {
    await this.logAuditEvent(
      action,
      'payment_link',
      linkId,
      {
        amount: linkData.amount,
        method: linkData.method,
        expiresAt: linkData.expiresAt,
        url: linkData.url
      },
      options
    );
  }

  /**
   * Registra evento de estorno
   */
  async logRefundEvent(
    action: AuditAction,
    refundId: string,
    refundData: {
      originalPaymentId: string;
      amount: number;
      reason: string;
      status: string;
    },
    options: {
      userId?: string;
      ipAddress?: string;
      userAgent?: string;
      success?: boolean;
      errorMessage?: string;
    } = {}
  ): Promise<void> {
    await this.logAuditEvent(
      action,
      'refund',
      refundId,
      {
        originalPaymentId: refundData.originalPaymentId,
        amount: refundData.amount,
        reason: refundData.reason,
        status: refundData.status
      },
      options
    );
  }

  /**
   * Registra evento de webhook
   */
  async logWebhookEvent(
    action: AuditAction,
    webhookId: string,
    webhookData: {
      gateway: string;
      eventType: string;
      payload: any;
      signature?: string;
    },
    options: {
      userId?: string;
      ipAddress?: string;
      userAgent?: string;
      success?: boolean;
      errorMessage?: string;
    } = {}
  ): Promise<void> {
    await this.logAuditEvent(
      action,
      'webhook',
      webhookId,
      {
        gateway: webhookData.gateway,
        eventType: webhookData.eventType,
        payload: webhookData.payload,
        signature: webhookData.signature
      },
      options
    );
  }

  /**
   * Verifica atividade suspeita
   */
  private async checkSuspiciousActivity(log: AuditLog): Promise<void> {
    const recentLogs = this.logs.filter(
      l => l.timestamp > new Date(Date.now() - 60 * 60 * 1000).toISOString() // Última hora
    );

    // Verificar múltiplas falhas do mesmo IP
    const failedAttempts = recentLogs.filter(
      l => l.ipAddress === log.ipAddress && !l.success
    );

    if (failedAttempts.length >= this.securityConfig.maxFailedAttempts) {
      await this.createSecurityAlert({
        type: 'multiple_failures',
        severity: 'high',
        message: `Múltiplas tentativas de falha detectadas do IP ${log.ipAddress}`,
        details: {
          ipAddress: log.ipAddress,
          failedAttempts: failedAttempts.length,
          timeWindow: '1 hour'
        }
      });
    }

    // Verificar atividade suspeita por usuário
    if (log.userId) {
      const userActivity = recentLogs.filter(l => l.userId === log.userId);
      if (userActivity.length >= this.securityConfig.suspiciousActivityThreshold) {
        await this.createSecurityAlert({
          type: 'suspicious_activity',
          severity: 'medium',
          message: `Atividade suspeita detectada para o usuário ${log.userId}`,
          details: {
            userId: log.userId,
            activityCount: userActivity.length,
            timeWindow: '1 hour'
          }
        });
      }
    }
  }

  /**
   * Cria um alerta de segurança
   */
  async createSecurityAlert(alertData: {
    type: SecurityAlert['type'];
    severity: SecurityAlert['severity'];
    message: string;
    details: Record<string, any>;
  }): Promise<void> {
    const alert: SecurityAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: alertData.type,
      severity: alertData.severity,
      message: alertData.message,
      details: alertData.details,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    this.securityAlerts.push(alert);

    // Em produção, enviar notificação para administradores
    console.warn('Security Alert:', alert);
  }

  /**
   * Resolve um alerta de segurança
   */
  async resolveSecurityAlert(alertId: string, resolvedBy: string): Promise<void> {
    const alert = this.securityAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date().toISOString();
      alert.resolvedBy = resolvedBy;
    }
  }

  /**
   * Obtém logs de auditoria com filtros
   */
  async getAuditLogs(filters: {
    action?: AuditAction;
    resource?: AuditResource;
    userId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<AuditLog[]> {
    let filteredLogs = [...this.logs];

    if (filters.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action);
    }

    if (filters.resource) {
      filteredLogs = filteredLogs.filter(log => log.resource === filters.resource);
    }

    if (filters.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }

    if (filters.startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!);
    }

    if (filters.endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!);
    }

    // Ordenar por timestamp (mais recente primeiro)
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Aplicar paginação
    const offset = filters.offset || 0;
    const limit = filters.limit || 100;

    return filteredLogs.slice(offset, offset + limit);
  }

  /**
   * Obtém alertas de segurança
   */
  async getSecurityAlerts(filters: {
    type?: SecurityAlert['type'];
    severity?: SecurityAlert['severity'];
    resolved?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<SecurityAlert[]> {
    let filteredAlerts = [...this.securityAlerts];

    if (filters.type) {
      filteredAlerts = filteredAlerts.filter(alert => alert.type === filters.type);
    }

    if (filters.severity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === filters.severity);
    }

    if (filters.resolved !== undefined) {
      filteredAlerts = filteredAlerts.filter(alert => alert.resolved === filters.resolved);
    }

    // Ordenar por timestamp (mais recente primeiro)
    filteredAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Aplicar paginação
    const offset = filters.offset || 0;
    const limit = filters.limit || 100;

    return filteredAlerts.slice(offset, offset + limit);
  }

  /**
   * Obtém estatísticas de auditoria
   */
  async getAuditStats(period: 'day' | 'week' | 'month' = 'day'): Promise<{
    totalEvents: number;
    successfulEvents: number;
    failedEvents: number;
    eventsByAction: Record<AuditAction, number>;
    eventsByResource: Record<AuditResource, number>;
    securityAlerts: number;
  }> {
    const now = new Date();
    const periodStart = new Date();

    switch (period) {
      case 'day':
        periodStart.setDate(now.getDate() - 1);
        break;
      case 'week':
        periodStart.setDate(now.getDate() - 7);
        break;
      case 'month':
        periodStart.setMonth(now.getMonth() - 1);
        break;
    }

    const periodLogs = this.logs.filter(
      log => log.timestamp >= periodStart.toISOString()
    );

    const eventsByAction: Record<string, number> = {};
    const eventsByResource: Record<string, number> = {};

    periodLogs.forEach(log => {
      eventsByAction[log.action] = (eventsByAction[log.action] || 0) + 1;
      eventsByResource[log.resource] = (eventsByResource[log.resource] || 0) + 1;
    });

    const periodAlerts = this.securityAlerts.filter(
      alert => alert.timestamp >= periodStart.toISOString()
    );

    return {
      totalEvents: periodLogs.length,
      successfulEvents: periodLogs.filter(log => log.success).length,
      failedEvents: periodLogs.filter(log => !log.success).length,
      eventsByAction: eventsByAction as Record<AuditAction, number>,
      eventsByResource: eventsByResource as Record<AuditResource, number>,
      securityAlerts: periodAlerts.length
    };
  }

  /**
   * Atualiza configurações de segurança
   */
  updateSecurityConfig(newConfig: Partial<SecurityConfig>): void {
    this.securityConfig = { ...this.securityConfig, ...newConfig };
  }

  /**
   * Obtém configurações de segurança
   */
  getSecurityConfig(): SecurityConfig {
    return { ...this.securityConfig };
  }
}

// Instância singleton do serviço
export const auditService = new AuditService();

// Exportar tipos para uso em outros módulos
export type {
  AuditLog,
  AuditAction,
  AuditResource,
  SecurityConfig,
  SecurityAlert
};
