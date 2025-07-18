import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { DataContextType, User, DailyLog, Staff, FacilityInfo, Notice, DailyLogTemplate, DailyLogDraft, NotificationType, Gender } from '../types';
import { SAMPLE_USERS, SAMPLE_STAFF, FACILITY_INFO, SAMPLE_LOGS_BASE } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';
import { StorageService } from '../services/StorageService';

const storageService = new StorageService();

const getSampleLogs = (): DailyLog[] => {
  if (SAMPLE_USERS.length < 2 || SAMPLE_STAFF.length < 2) return [];
  return SAMPLE_LOGS_BASE.map((baseLog, index) => {
    const userIndex = index % 2;
    return {
      ...baseLog,
      id: uuidv4(),
      log_id: uuidv4(),
      userId: SAMPLE_USERS[userIndex].id,
      user_id: SAMPLE_USERS[userIndex].id,
      staff_id: SAMPLE_STAFF[userIndex].id,
      recorder_name: SAMPLE_STAFF[userIndex].name,
      author: SAMPLE_STAFF[userIndex].name,
      authorId: SAMPLE_STAFF[userIndex].id,
    };
  });
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [facilityInfo, setFacilityInfo] = useState<FacilityInfo | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [dailyLogTemplates, setDailyLogTemplates] = useState<DailyLogTemplate[]>([]);
  const [dailyLogDrafts, setDailyLogDrafts] = useState<DailyLogDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();
  const { user: authUser } = useAuth();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const initialized = await storageService.get<string | null>('jyushin_care_initialized', null);
      
      if (!initialized) {
        const sampleLogs = getSampleLogs();
        setUsers(SAMPLE_USERS);
        setStaff(SAMPLE_STAFF);
        setFacilityInfo(FACILITY_INFO);
        setDailyLogs(sampleLogs);
        setNotices([]);
        setDailyLogTemplates([]);
        setDailyLogDrafts([]);

        await storageService.set('users', SAMPLE_USERS);
        await storageService.set('staff', SAMPLE_STAFF);
        await storageService.set('facilityInfo', FACILITY_INFO);
        await storageService.set('dailyLogs', sampleLogs);
        await storageService.set('notices', []);
        await storageService.set('templates', []);
        await storageService.set('drafts', []);
        await storageService.set('jyushin_care_initialized', 'true');
      } else {
        const sampleLogs = getSampleLogs(); // Ensure sample logs are available as a fallback
        const storedUsers = await storageService.get<User[]>('users', SAMPLE_USERS);
        const storedStaff = await storageService.get<Staff[]>('staff', SAMPLE_STAFF);
        const storedLogs = await storageService.get<DailyLog[]>('dailyLogs', sampleLogs);
        const storedFacilityInfo = await storageService.get<FacilityInfo | null>('facilityInfo', FACILITY_INFO);
        const storedNotices = await storageService.get<Notice[]>('notices', []);
        const storedTemplates = await storageService.get<DailyLogTemplate[]>('templates', []);
        const storedDrafts = await storageService.get<DailyLogDraft[]>('drafts', []);
        
        setUsers(storedUsers);
        setStaff(storedStaff);
        setDailyLogs(storedLogs);
        setFacilityInfo(storedFacilityInfo);
        setNotices(storedNotices);
        setDailyLogTemplates(storedTemplates);
        setDailyLogDrafts(storedDrafts);
      }
    } catch (e) {
      console.error('Failed to load data:', e);
      setError('データの読み込みに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authUser) {
      loadData();
    }
  }, [authUser, loadData]);

  useEffect(() => { if (!isLoading) storageService.set('users', users); }, [users, isLoading]);
  useEffect(() => { if (!isLoading) storageService.set('staff', staff); }, [staff, isLoading]);
  useEffect(() => { if (!isLoading) storageService.set('dailyLogs', dailyLogs); }, [dailyLogs, isLoading]);
  useEffect(() => { if (!isLoading) storageService.set('facilityInfo', facilityInfo); }, [facilityInfo, isLoading]);
  useEffect(() => { if (!isLoading) storageService.set('notices', notices); }, [notices, isLoading]);
  useEffect(() => { if (!isLoading) storageService.set('templates', dailyLogTemplates); }, [dailyLogTemplates, isLoading]);
  useEffect(() => { if (!isLoading) storageService.set('drafts', dailyLogDrafts); }, [dailyLogDrafts, isLoading]);

  const addUser = useCallback(async (user: Partial<User>) => {
    const newUser: User = { 
        id: uuidv4(),
        name: user.name || '',
        initials: user.initials || '',
        age: user.age || 0,
        gender: user.gender || Gender.MALE,
        serviceType: user.serviceType || [],
        ...user
    };
    setUsers(prev => [...prev, newUser]);
    showNotification('利用者を追加しました', NotificationType.SUCCESS);
  }, [showNotification]);
  
  const updateUser = useCallback(async (updatedUser: User) => {
    setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
    showNotification('利用者情報を更新しました', NotificationType.SUCCESS);
  }, [showNotification]);
  
  const deleteUser = useCallback(async (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    showNotification('利用者を削除しました', NotificationType.SUCCESS);
  }, [showNotification]);

  const addStaff = useCallback(async (staffMember: Partial<Staff>) => {
    const newStaff: Staff = { 
        id: uuidv4(),
        username: staffMember.name || 'new.staff',
        name: staffMember.name || '',
        role: staffMember.role || 'staff',
        isFullTime: staffMember.isFullTime || false,
        permissions: staffMember.permissions || [],
        templateId: staffMember.templateId || 'default-template',
        templateName: staffMember.templateName || 'デフォルト',
    };
    setStaff(prev => [...prev, newStaff]);
    showNotification('スタッフを追加しました', NotificationType.SUCCESS);
  }, [showNotification]);
  
  const updateStaff = useCallback(async (updatedStaff: Staff) => {
    setStaff(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
    showNotification('スタッフ情報を更新しました', NotificationType.SUCCESS);
  }, [showNotification]);
  
  const deleteStaff = useCallback(async (staffId: string) => {
    setStaff(prev => prev.filter(s => s.id !== staffId));
    showNotification('スタッフを削除しました', NotificationType.SUCCESS);
  }, [showNotification]);
  
  const addDailyLog = useCallback(async (log: DailyLog) => {
    const newLog = { ...log, id: uuidv4(), log_id: uuidv4() };
    setDailyLogs(prev => [...prev, newLog]);
  }, []);
  
  const updateDailyLog = useCallback(async (logId: string, updates: Partial<DailyLog>) => {
    setDailyLogs(prev => prev.map(log => 
      (log.log_id || log.id) === logId ? { ...log, ...updates } : log
    ));
  }, []);
  
  const deleteDailyLog = useCallback(async (logId: string) => {
    setDailyLogs(prev => prev.filter(log => (log.log_id || log.id) !== logId));
  }, []);
  
  const getDailyLog = useCallback(async (logId: string) => {
    return dailyLogs.find(log => (log.log_id || log.id) === logId) || null;
  }, [dailyLogs]);

  const getStaffById = useCallback(async (staffId: string) => {
    return staff.find(s => s.id === staffId) || null;
  }, [staff]);

  const getUserById = useCallback(async (userId: string) => {
    return users.find(u => u.id === userId) || null;
  }, [users]);
  
  const addNotice = useCallback(async (notice: Partial<Notice>) => { 
      const newNotice = { ...notice, id: uuidv4(), date: new Date().toISOString(), readBy: [] };
      setNotices(prev => [newNotice as Notice, ...prev]);
  }, []);

  const markNoticeAsRead = useCallback(async (noticeId: string, userId: string) => {
      setNotices(prev => prev.map(n => n.id === noticeId ? {...n, readBy: [...n.readBy, userId]} : n))
  }, []);

  const updateFacilityInfo = useCallback(async (info: FacilityInfo) => {
    setFacilityInfo(info);
    showNotification('施設情報を更新しました', NotificationType.SUCCESS);
  }, [showNotification]);

  const value: DataContextType = useMemo(() => ({
    users, dailyLogs, staff, facilityInfo, notices, isLoading, error,
    dailyLogTemplates: [], addDailyLogTemplate: async () => {}, updateDailyLogTemplate: async () => {}, deleteDailyLogTemplate: async () => {}, getTemplatesByUser: async () => [],
    clearError: async () => {}, addUser, updateUser, deleteUser, addStaff, updateStaff, addDailyLog,
    updateDailyLog, deleteDailyLog, getDailyLog, getStaffById, getUserById,
    saveUser: async () => {}, saveDailyLog: async () => {}, saveStaff: async () => {}, deleteStaff, updateFacilityInfo, createBackup: async () => {},
    importData: async () => {}, clearAllData: async () => {}, getStorageUsage: async () => ({ used: 0, total: 0 }), dailyLogDrafts: [], saveDailyLogDraft: async () => {},
    deleteDailyLogDraft: async () => {}, getDraftByUser: async () => null, addNotice, markNoticeAsRead
  }), [
    users, dailyLogs, staff, facilityInfo, notices, isLoading, error,
    addUser, updateUser, deleteUser, addStaff, updateStaff, deleteStaff,
    addDailyLog, updateDailyLog, deleteDailyLog, getDailyLog, getStaffById, getUserById,
    addNotice, markNoticeAsRead, updateFacilityInfo
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}; 