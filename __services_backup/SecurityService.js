import CryptoJS from 'crypto-js';
export class SecurityService {
    /**
     * ユーザー認証
     */
    static async authenticateUser(userId, password, ipAddress, userAgent) {
        try {
            // ログイン試行回数のチェック
            const attempts = this.loginAttempts.get(userId);
            if (attempts && attempts.count >= this.config.maxLoginAttempts) {
                const timeSinceLastAttempt = Date.now() - new Date(attempts.lastAttempt).getTime();
                if (timeSinceLastAttempt < 15 * 60 * 1000) { // 15分間ロック
                    this.logAuditEvent(userId, 'LOGIN_ATTEMPT', 'auth', 'ログイン試行回数制限', ipAddress, userAgent, false, 'high');
                    return {
                        success: false,
                        error: 'ログイン試行回数が上限に達しました。15分後に再試行してください。'
                    };
                }
                else {
                    // ロック解除
                    this.loginAttempts.delete(userId);
                }
            }
            // 実際の認証処理（ここでは簡易版）
            const isValidPassword = await this.validatePassword(userId, password);
            if (!isValidPassword) {
                this.recordLoginAttempt(userId);
                this.logAuditEvent(userId, 'LOGIN_FAILED', 'auth', 'パスワード認証失敗', ipAddress, userAgent, false, 'medium');
                return {
                    success: false,
                    error: 'ユーザーIDまたはパスワードが正しくありません。'
                };
            }
            // セッション作成
            const session = this.createSession(userId, ipAddress, userAgent);
            // ログイン試行回数をリセット
            this.loginAttempts.delete(userId);
            this.logAuditEvent(userId, 'LOGIN_SUCCESS', 'auth', 'ログイン成功', ipAddress, userAgent, true, 'low');
            return {
                success: true,
                session
            };
        }
        catch (error) {
            console.error('認証エラー:', error);
            this.logAuditEvent(userId, 'LOGIN_ERROR', 'auth', `認証エラー: ${error}`, ipAddress, userAgent, false, 'high');
            return {
                success: false,
                error: '認証処理中にエラーが発生しました。'
            };
        }
    }
    /**
     * セッション検証
     */
    static validateSession(sessionToken, ipAddress) {
        try {
            const session = this.findSessionByToken(sessionToken);
            if (!session) {
                return {
                    valid: false,
                    error: 'セッションが見つかりません。'
                };
            }
            if (!session.isActive) {
                return {
                    valid: false,
                    error: 'セッションが無効化されています。'
                };
            }
            if (new Date() > new Date(session.expiresAt)) {
                this.invalidateSession(session.id);
                return {
                    valid: false,
                    error: 'セッションが期限切れです。'
                };
            }
            // IPアドレスの変更を検知（セキュリティ強化）
            if (session.ipAddress !== ipAddress) {
                this.logAuditEvent(session.userId, 'SESSION_IP_CHANGE', 'session', `IPアドレス変更: ${session.ipAddress} → ${ipAddress}`, ipAddress, session.userAgent, false, 'high');
                this.invalidateSession(session.id);
                return {
                    valid: false,
                    error: 'セッションのIPアドレスが変更されました。再ログインしてください。'
                };
            }
            // 最終アクティビティを更新
            session.lastActivity = new Date().toISOString();
            return {
                valid: true,
                session
            };
        }
        catch (error) {
            console.error('セッション検証エラー:', error);
            return {
                valid: false,
                error: 'セッション検証中にエラーが発生しました。'
            };
        }
    }
    /**
     * セッション無効化
     */
    static invalidateSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.isActive = false;
            this.logAuditEvent(session.userId, 'SESSION_INVALIDATED', 'session', 'セッション無効化', session.ipAddress, session.userAgent, true, 'low');
            return true;
        }
        return false;
    }
    /**
     * アクセス権限チェック
     */
    static checkPermission(userId, permission, resource) {
        try {
            const accessControl = this.accessControls.get(userId);
            if (!accessControl) {
                return {
                    allowed: false,
                    reason: 'アクセス制御設定が見つかりません。'
                };
            }
            // 権限チェック
            if (!accessControl.permissions.includes(permission)) {
                this.logAuditEvent(userId, 'PERMISSION_DENIED', resource || 'unknown', `権限不足: ${permission}`, 'unknown', 'unknown', false, 'medium');
                return {
                    allowed: false,
                    reason: '必要な権限がありません。'
                };
            }
            // 時間制限チェック
            if (accessControl.restrictions.timeRestrictions) {
                const now = new Date();
                const currentTime = now.getHours() * 60 + now.getMinutes();
                const startTime = this.parseTimeString(accessControl.restrictions.timeRestrictions.startTime);
                const endTime = this.parseTimeString(accessControl.restrictions.timeRestrictions.endTime);
                if (currentTime < startTime || currentTime > endTime) {
                    this.logAuditEvent(userId, 'TIME_RESTRICTION', resource || 'unknown', '時間制限によりアクセス拒否', 'unknown', 'unknown', false, 'medium');
                    return {
                        allowed: false,
                        reason: 'アクセス可能時間外です。'
                    };
                }
            }
            return { allowed: true };
        }
        catch (error) {
            console.error('権限チェックエラー:', error);
            return {
                allowed: false,
                reason: '権限チェック中にエラーが発生しました。'
            };
        }
    }
    /**
     * データ暗号化
     */
    static encryptData(data) {
        try {
            return CryptoJS.AES.encrypt(data, this.config.encryptionKey).toString();
        }
        catch (error) {
            console.error('暗号化エラー:', error);
            throw new Error('データの暗号化に失敗しました。');
        }
    }
    /**
     * データ復号化
     */
    static decryptData(encryptedData) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, this.config.encryptionKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        }
        catch (error) {
            console.error('復号化エラー:', error);
            throw new Error('データの復号化に失敗しました。');
        }
    }
    /**
     * パスワードハッシュ化
     */
    static hashPassword(password) {
        return CryptoJS.SHA256(password + this.config.encryptionKey).toString();
    }
    /**
     * 監査ログの取得
     */
    static getAuditLogs(filters) {
        let logs = [...this.auditLogs];
        if (filters?.userId) {
            logs = logs.filter(log => log.userId === filters.userId);
        }
        if (filters?.action) {
            logs = logs.filter(log => log.action === filters.action);
        }
        if (filters?.severity) {
            logs = logs.filter(log => log.severity === filters.severity);
        }
        if (filters?.startDate) {
            logs = logs.filter(log => log.timestamp >= filters.startDate);
        }
        if (filters?.endDate) {
            logs = logs.filter(log => log.timestamp <= filters.endDate);
        }
        return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    /**
     * アクティブセッションの取得
     */
    static getActiveSessions(userId) {
        const sessions = Array.from(this.sessions.values()).filter(session => session.isActive);
        return userId ? sessions.filter(session => session.userId === userId) : sessions;
    }
    /**
     * 古いセッションのクリーンアップ
     */
    static cleanupExpiredSessions() {
        const now = new Date();
        for (const [sessionId, session] of this.sessions.entries()) {
            if (new Date(session.expiresAt) < now) {
                this.sessions.delete(sessionId);
            }
        }
    }
    /**
     * 古い監査ログのクリーンアップ
     */
    static cleanupOldAuditLogs() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.config.auditLogRetention);
        this.auditLogs = this.auditLogs.filter(log => new Date(log.timestamp) > cutoffDate);
    }
    // プライベートメソッド
    static async validatePassword(userId, password) {
        // 実際の実装ではデータベースからハッシュ化されたパスワードを取得して比較
        // ここでは簡易版として固定パスワードを使用
        const hashedPassword = this.hashPassword('password123');
        const inputHash = this.hashPassword(password);
        return hashedPassword === inputHash;
    }
    static createSession(userId, ipAddress, userAgent) {
        const sessionId = this.generateSessionId();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + this.config.sessionTimeout);
        const session = {
            id: sessionId,
            userId,
            token: this.generateToken(),
            ipAddress,
            userAgent,
            loginTime: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            expiresAt: expiresAt.toISOString(),
            isActive: true
        };
        this.sessions.set(sessionId, session);
        return session;
    }
    static findSessionByToken(token) {
        return Array.from(this.sessions.values()).find(session => session.token === token);
    }
    static recordLoginAttempt(userId) {
        const attempts = this.loginAttempts.get(userId) || { count: 0, lastAttempt: '' };
        attempts.count += 1;
        attempts.lastAttempt = new Date().toISOString();
        this.loginAttempts.set(userId, attempts);
    }
    static logAuditEvent(userId, action, resource, details, ipAddress, userAgent, success, severity) {
        const auditLog = {
            id: this.generateId(),
            userId,
            action,
            resource,
            details,
            ipAddress,
            userAgent,
            timestamp: new Date().toISOString(),
            severity,
            success
        };
        this.auditLogs.push(auditLog);
    }
    static generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    static generateToken() {
        return CryptoJS.lib.WordArray.random(32).toString();
    }
    static generateId() {
        return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    static parseTimeString(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }
}
SecurityService.sessions = new Map();
SecurityService.auditLogs = [];
SecurityService.accessControls = new Map();
SecurityService.loginAttempts = new Map();
SecurityService.config = {
    sessionTimeout: 480,
    maxLoginAttempts: 5,
    passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
    },
    encryptionKey: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ENCRYPTION_KEY) ? import.meta.env.VITE_ENCRYPTION_KEY : 'default-key-change-in-production',
    auditLogRetention: 90
};
