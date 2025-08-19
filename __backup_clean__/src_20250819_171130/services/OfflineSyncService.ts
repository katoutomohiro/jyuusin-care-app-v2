// services/OfflineSyncService.ts

/**
 * オフライン編集データをサーバーへ同期するサービス
 * 実際のAPI連携は未実装。現状はダミーの成功レスポンスを返す。
 */
const OfflineSyncService = {
  async syncEditedDataToServer(): Promise<{ success: boolean; message: string }> {
    // TODO: 実際のAPI連携処理を実装
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      message: '✅ オフライン編集データの同期が完了しました（ダミー）',
    };
  },
};

export default OfflineSyncService;
