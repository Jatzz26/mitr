import Chatbot from "@/pages/Chatbot";

// Simple wrapper to enable triage mode via query param or context later.
export default function SymptomChecker() {
  // If your Chatbot reads URL params, it can pick up ?mode=triage. For now, just render Chatbot.
  return <Chatbot />;
}
