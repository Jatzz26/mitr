export type HealthRecord = {
  id: string;
  user_id: string;
  record_type: string;
  uploaded_at: string;
  metadata: any;
  file_url: string;
};

export type ReportInsight = {
  id: string;
  health_record_id: string;
  generated_at: string;
  summary_text: string;
  chart_data: any;
};

export type ChatHistoryItem = {
  id: string;
  user_id: string;
  ts: string;
  user_message: string;
  bot_response: string;
  context: any;
};
