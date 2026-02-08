export interface Preview {
  session_id: string;
  scenario: {
    id: string;
    title: string;
    category: string;
    description: string;
    ai_role: string;
  };
  ai_message: string;
  ai_hidden_meaning: string;
  visual_action: string;
  user_visual_action: string;
  situation_description: string | null;
  situation_context: string;
  max_turns: number;
}

export interface PreviewHint {
  hints: string[];
  explanations: string[];
}

export interface PreviewSendResponse {
  session_id: string;
  ai_message: string;
  ai_hidden_meaning: string;
  visual_action: string;
  user_visual_action: string;
  situation_description: string | null;
  feedback: {
    feedback_text: string;
    is_appropriate: boolean;
    suggested_alternatives: string[];
  };
  turn_count: number;
  turns_remaining: number;
  is_preview_ended: boolean;
}
