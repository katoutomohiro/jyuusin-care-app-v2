/**
 * 薬剤管理サービス
 * 薬剤記録、投与管理、副作用監視
 */
export class MedicationManagementService {
    /**
     * 薬剤を追加
     */
    static addMedication(medication) {
        this.medications.set(medication.id, medication);
    }
    /**
     * 処方を追加
     */
    static addPrescription(prescription) {
        try {
            this.prescriptions.set(prescription.id, prescription);
            // スケジュールを更新
            this.updateMedicationSchedule(prescription.userId);
        }
        catch (error) {
            console.error('addPrescription error:', error);
            throw error;
        }
    }
    /**
     * 投与記録を追加
     */
    static addAdministration(administration) {
        try {
            this.administrations.push(administration);
            // 処方の残量を更新
            const prescription = this.prescriptions.get(administration.prescriptionId);
            if (prescription) {
                prescription.remainingQuantity = Math.max(0, prescription.remainingQuantity - 1);
                this.prescriptions.set(prescription.id, prescription);
            }
            // スケジュールを更新
            this.updateMedicationSchedule(administration.userId);
            // 副作用監視
            if (this.settings.sideEffectMonitoring) {
                this.monitorSideEffects(administration);
            }
            // 相互作用チェック
            if (this.settings.interactionChecking) {
                this.checkInteractions(administration);
            }
        }
        catch (error) {
            console.error('addAdministration error:', error);
            throw error;
        }
    }
    /**
     * 副作用を記録
     */
    static addSideEffect(administrationId, sideEffect) {
        try {
            const newSideEffect = {
                ...sideEffect,
                id: this.generateId()
            };
            const administration = this.administrations.find(a => a.id === administrationId);
            if (administration) {
                if (!administration.sideEffects) {
                    administration.sideEffects = [];
                }
                administration.sideEffects.push(newSideEffect);
            }
            // 副作用の深刻度に応じてアラート
            if (sideEffect.severity === 'severe' || sideEffect.severity === 'life_threatening') {
                this.alertSevereSideEffect(newSideEffect, administration);
            }
        }
        catch (error) {
            console.error('addSideEffect error:', error);
            throw error;
        }
    }
    /**
     * アレルギーを追加
     */
    static addAllergy(allergy) {
        try {
            const newAllergy = {
                ...allergy,
                id: this.generateId()
            };
            this.allergies.push(newAllergy);
            // アレルギーに基づいて処方をチェック
            if (this.settings.allergyChecking) {
                this.checkAllergyConflicts(newAllergy);
            }
        }
        catch (error) {
            console.error('addAllergy error:', error);
            throw error;
        }
    }
    /**
     * 薬剤スケジュールを更新
     */
    static updateMedicationSchedule(userId) {
        try {
            const userPrescriptions = Array.from(this.prescriptions.values())
                .filter(p => p.userId === userId && p.status === 'active');
            const today = new Date().toISOString().split('T')[0];
            const schedule = {
                id: `${userId}_${today}`,
                userId,
                userName: userPrescriptions[0]?.userName || '',
                date: today,
                medications: [],
                totalMedications: 0,
                administeredCount: 0,
                missedCount: 0,
                status: 'pending'
            };
            userPrescriptions.forEach(prescription => {
                const scheduledTimes = this.calculateScheduledTimes(prescription, today);
                scheduledTimes.forEach(scheduledTime => {
                    const administration = this.administrations.find(a => a.prescriptionId === prescription.id &&
                        a.scheduledTime === scheduledTime);
                    const scheduledMedication = {
                        prescriptionId: prescription.id,
                        medicationName: prescription.medicationName,
                        dosage: prescription.dosage,
                        scheduledTime,
                        status: administration ? administration.status : 'scheduled',
                        administrationId: administration?.id,
                        notes: administration?.notes
                    };
                    schedule.medications.push(scheduledMedication);
                    schedule.totalMedications++;
                    if (administration?.status === 'administered') {
                        schedule.administeredCount++;
                    }
                    else if (administration?.status === 'missed') {
                        schedule.missedCount++;
                    }
                });
            });
            // スケジュールの状態を更新
            if (schedule.totalMedications === 0) {
                schedule.status = 'completed';
            }
            else if (schedule.administeredCount === schedule.totalMedications) {
                schedule.status = 'completed';
            }
            else if (schedule.missedCount > 0) {
                schedule.status = 'overdue';
            }
            else {
                schedule.status = 'in_progress';
            }
            this.schedules.set(schedule.id, schedule);
        }
        catch (error) {
            console.error('updateMedicationSchedule error:', error);
            throw error;
        }
    }
    /**
     * 投与予定時刻を計算
     */
    static calculateScheduledTimes(prescription, date) {
        const times = [];
        const baseTime = new Date(date);
        switch (prescription.frequency) {
            case 'once_daily':
                times.push(new Date(baseTime.getTime() + 9 * 60 * 60 * 1000).toISOString()); // 9:00
                break;
            case 'twice_daily':
                times.push(new Date(baseTime.getTime() + 9 * 60 * 60 * 1000).toISOString()); // 9:00
                times.push(new Date(baseTime.getTime() + 21 * 60 * 60 * 1000).toISOString()); // 21:00
                break;
            case 'three_times_daily':
                times.push(new Date(baseTime.getTime() + 8 * 60 * 60 * 1000).toISOString()); // 8:00
                times.push(new Date(baseTime.getTime() + 14 * 60 * 60 * 1000).toISOString()); // 14:00
                times.push(new Date(baseTime.getTime() + 20 * 60 * 60 * 1000).toISOString()); // 20:00
                break;
            case 'four_times_daily':
                times.push(new Date(baseTime.getTime() + 6 * 60 * 60 * 1000).toISOString()); // 6:00
                times.push(new Date(baseTime.getTime() + 12 * 60 * 60 * 1000).toISOString()); // 12:00
                times.push(new Date(baseTime.getTime() + 18 * 60 * 60 * 1000).toISOString()); // 18:00
                times.push(new Date(baseTime.getTime() + 22 * 60 * 60 * 1000).toISOString()); // 22:00
                break;
            case 'custom':
                if (prescription.customSchedule) {
                    // カスタムスケジュールの解析
                    const customTimes = prescription.customSchedule.split(',').map(t => t.trim());
                    customTimes.forEach(timeStr => {
                        const [hours, minutes] = timeStr.split(':').map(Number);
                        const customTime = new Date(baseTime.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);
                        times.push(customTime.toISOString());
                    });
                }
                break;
        }
        return times;
    }
    /**
     * 副作用を監視
     */
    static monitorSideEffects(administration) {
        // 投与後の副作用チェック（実際は時間経過でチェック）
        setTimeout(() => {
            console.log(`副作用監視: ${administration.medicationName} (${administration.userName})`);
            // モック副作用データ
            const mockSideEffects = [
                { name: '吐き気', severity: 'mild', probability: 0.1 },
                { name: 'めまい', severity: 'moderate', probability: 0.05 },
                { name: '発疹', severity: 'moderate', probability: 0.03 },
                { name: '呼吸困難', severity: 'severe', probability: 0.01 }
            ];
            mockSideEffects.forEach(effect => {
                if (Math.random() < effect.probability) {
                    const sideEffect = {
                        name: effect.name,
                        severity: effect.severity,
                        onsetTime: new Date().toISOString(),
                        description: `${effect.name}が発生しました`,
                        actionTaken: '観察継続',
                        reportedTo: '看護職員',
                        reportedAt: new Date().toISOString(),
                        status: 'active'
                    };
                    this.addSideEffect(administration.id, sideEffect);
                }
            });
        }, 1000); // 1秒後にチェック（実際は数時間後）
    }
    /**
     * 相互作用をチェック
     */
    static checkInteractions(administration) {
        const prescription = this.prescriptions.get(administration.prescriptionId);
        if (!prescription)
            return;
        // 同じ利用者の他の処方をチェック
        const userPrescriptions = Array.from(this.prescriptions.values())
            .filter(p => p.userId === administration.userId && p.id !== administration.prescriptionId);
        userPrescriptions.forEach(otherPrescription => {
            const interaction = this.interactions.find(i => (i.medication1Id === prescription.medicationId && i.medication2Id === otherPrescription.medicationId) ||
                (i.medication1Id === otherPrescription.medicationId && i.medication2Id === prescription.medicationId));
            if (interaction) {
                console.warn(`薬剤相互作用検出: ${interaction.medication1Name} + ${interaction.medication2Name} (${interaction.severity})`);
                // 深刻な相互作用の場合はアラート
                if (interaction.severity === 'major' || interaction.severity === 'contraindicated') {
                    this.alertDrugInteraction(interaction, administration);
                }
            }
        });
    }
    /**
     * アレルギー衝突をチェック
     */
    static checkAllergyConflicts(allergy) {
        if (allergy.type !== 'medication')
            return;
        // アレルギー物質を含む処方をチェック
        const userPrescriptions = Array.from(this.prescriptions.values())
            .filter(p => p.userId === allergy.userId && p.status === 'active');
        userPrescriptions.forEach(prescription => {
            const medication = this.medications.get(prescription.medicationId);
            if (medication) {
                const hasAllergen = medication.activeIngredients.some(ingredient => ingredient.toLowerCase().includes(allergy.allergen.toLowerCase())) || medication.name.toLowerCase().includes(allergy.allergen.toLowerCase());
                if (hasAllergen) {
                    console.error(`アレルギー衝突検出: ${allergy.allergen} in ${medication.name}`);
                    this.alertAllergyConflict(allergy, prescription);
                }
            }
        });
    }
    /**
     * 深刻な副作用のアラート
     */
    static alertSevereSideEffect(sideEffect, administration) {
        console.error(`深刻な副作用アラート: ${sideEffect.name} (${sideEffect.severity})`);
        // 実際の実装では、緊急時対応システムに通知
        // EmergencyResponseService.detectEmergency(...)
    }
    /**
     * 薬剤相互作用のアラート
     */
    static alertDrugInteraction(interaction, administration) {
        console.error(`薬剤相互作用アラート: ${interaction.medication1Name} + ${interaction.medication2Name} (${interaction.severity})`);
        // 実際の実装では、医師や薬剤師に通知
    }
    /**
     * アレルギー衝突のアラート
     */
    static alertAllergyConflict(allergy, prescription) {
        console.error(`アレルギー衝突アラート: ${allergy.allergen} in ${prescription.medicationName}`);
        // 実際の実装では、処方医に通知
    }
    /**
     * 投与スケジュールを取得
     */
    static getMedicationSchedule(userId, date) {
        const scheduleId = `${userId}_${date}`;
        try {
            return this.schedules.get(scheduleId);
        }
        catch (error) {
            console.error('getMedicationSchedule error:', error);
            throw error;
        }
    }
    /**
     * 利用者の処方を取得
     */
    static getUserPrescriptions(userId) {
        try {
            return Array.from(this.prescriptions.values())
                .filter(p => p.userId === userId)
                .sort((a, b) => new Date(b.prescribedAt).getTime() - new Date(a.prescribedAt).getTime());
        }
        catch (error) {
            console.error('getUserPrescriptions error:', error);
            throw error;
        }
    }
    /**
     * 投与履歴を取得
     */
    static getAdministrationHistory(userId, startDate, endDate) {
        try {
            let filtered = this.administrations.filter(a => a.userId === userId);
            if (startDate) {
                filtered = filtered.filter(a => a.administeredAt >= startDate);
            }
            if (endDate) {
                filtered = filtered.filter(a => a.administeredAt <= endDate);
            }
            return filtered.sort((a, b) => new Date(b.administeredAt).getTime() - new Date(a.administeredAt).getTime());
        }
        catch (error) {
            console.error('getAdministrationHistory error:', error);
            throw error;
        }
    }
    /**
     * 副作用履歴を取得
     */
    static getSideEffectHistory(userId) {
        try {
            const userAdministrations = this.administrations.filter(a => a.userId === userId);
            const sideEffects = [];
            userAdministrations.forEach(administration => {
                if (administration.sideEffects) {
                    sideEffects.push(...administration.sideEffects);
                }
            });
            return sideEffects.sort((a, b) => new Date(b.onsetTime).getTime() - new Date(a.onsetTime).getTime());
        }
        catch (error) {
            console.error('getSideEffectHistory error:', error);
            throw error;
        }
    }
    /**
     * アレルギー履歴を取得
     */
    static getUserAllergies(userId) {
        try {
            return this.allergies
                .filter(a => a.userId === userId && a.isActive)
                .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
        }
        catch (error) {
            console.error('getUserAllergies error:', error);
            throw error;
        }
    }
    /**
     * 薬剤相互作用を取得
     */
    static getMedicationInteractions(medicationId) {
        return this.interactions.filter(i => i.medication1Id === medicationId || i.medication2Id === medicationId);
    }
    /**
     * 残量が少ない処方を取得
     */
    static getLowStockPrescriptions(threshold = 7) {
        return Array.from(this.prescriptions.values())
            .filter(p => p.status === 'active' && p.remainingQuantity <= threshold);
    }
    /**
     * 設定を更新
     */
    static updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }
    /**
     * 設定を取得
     */
    static getSettings() {
        return { ...this.settings };
    }
    // ヘルパーメソッド
    static generateId() {
        return `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
MedicationManagementService.medications = new Map();
MedicationManagementService.prescriptions = new Map();
MedicationManagementService.administrations = [];
MedicationManagementService.schedules = new Map();
MedicationManagementService.interactions = [];
MedicationManagementService.allergies = [];
MedicationManagementService.settings = {
    autoSchedulingEnabled: true,
    reminderNotifications: true,
    interactionChecking: true,
    sideEffectMonitoring: true,
    allergyChecking: true,
    refillReminders: true,
    notificationSettings: {
        beforeAdministration: 15,
        afterAdministration: 30,
        missedDose: 60,
        lowStock: 7
    }
};
