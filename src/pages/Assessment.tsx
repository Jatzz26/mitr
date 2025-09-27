import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Heart, 
  Phone,
  BarChart3,
  PieChart,
  Activity,
  Info,
  ArrowLeft,
  RefreshCw
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from "recharts";

const questions = [
  {
    text: "Feeling nervous, anxious, or on edge",
    description: "General feelings of unease or tension"
  },
  {
    text: "Not being able to stop or control worrying",
    description: "Difficulty managing anxious thoughts"
  },
  {
    text: "Worrying too much about different things",
    description: "Excessive concern about various life areas"
  },
  {
    text: "Trouble relaxing",
    description: "Difficulty finding calm or peace"
  },
  {
    text: "Being so restless that it is hard to sit still",
    description: "Physical agitation or inability to stay calm"
  },
  {
    text: "Becoming easily annoyed or irritable",
    description: "Quick to anger or frustration"
  },
  {
    text: "Feeling afraid as if something awful might happen",
    description: "Sense of impending doom or danger"
  }
];

const choices = [
  { label: "Not at all", value: 0, color: "#10B981" },
  { label: "Several days", value: 1, color: "#F59E0B" },
  { label: "More than half the days", value: 2, color: "#EF4444" },
  { label: "Nearly every day", value: 3, color: "#DC2626" },
];

const severityLevels = {
  minimal: { label: "Minimal", color: "#10B981", description: "Low anxiety levels" },
  mild: { label: "Mild", color: "#F59E0B", description: "Some anxiety symptoms" },
  moderate: { label: "Moderate", color: "#EF4444", description: "Significant anxiety" },
  severe: { label: "Severe", color: "#DC2626", description: "High anxiety levels" }
};

// Mock historical data for charts
const historicalData = [
  { date: "Week 1", score: 8, sentiment: 65 },
  { date: "Week 2", score: 6, sentiment: 72 },
  { date: "Week 3", score: 5, sentiment: 78 },
  { date: "Week 4", score: 7, sentiment: 70 },
  { date: "Week 5", score: 4, sentiment: 82 },
  { date: "Today", score: 0, sentiment: 0 }
];

const sentimentData = [
  { name: "Positive", value: 65, color: "#10B981" },
  { name: "Neutral", value: 25, color: "#F59E0B" },
  { name: "Negative", value: 10, color: "#EF4444" }
];

const stressTrendData = [
  { time: "9 AM", level: 3 },
  { time: "12 PM", level: 5 },
  { time: "3 PM", level: 4 },
  { time: "6 PM", level: 6 },
  { time: "9 PM", level: 2 }
];

export default function Assessment() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [answers, setAnswers] = useState<number[]>(Array(7).fill(-1));
  const [saving, setSaving] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showEmergencyCard, setShowEmergencyCard] = useState(false);

  const score = answers.every((a) => a >= 0) ? answers.reduce((a, b) => a + b, 0) : null;
  const severity = score === null ? "" : 
    score <= 4 ? "minimal" : 
    score <= 9 ? "mild" : 
    score <= 14 ? "moderate" : "severe";

  const progress = ((answers.filter(a => a >= 0).length / 7) * 100);

  const submit = async () => {
    if (!user) {
      toast({ title: "Please sign in", variant: "destructive" });
      return;
    }
    if (score === null) {
      toast({ title: "Answer all questions", variant: "destructive" });
      return;
    }
    setSaving(true);
    
    // Update historical data with current score
    historicalData[historicalData.length - 1].score = score;
    historicalData[historicalData.length - 1].sentiment = Math.max(20, 100 - (score * 8));

    const { error } = await supabase.from("assessments").insert({
      user_id: user.id,
      type: "GAD-7",
      score,
      answers,
      severity,
    } as any);
    
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    
    toast({ title: "Assessment completed!", description: `Your anxiety score: ${score} (${severityLevels[severity as keyof typeof severityLevels].label})` });
    setShowDashboard(true);
  };

  const resetAssessment = () => {
    setAnswers(Array(7).fill(-1));
    setCurrentQuestion(0);
    setShowDashboard(false);
  };

  const getSeverityColor = (severity: string) => {
    return severityLevels[severity as keyof typeof severityLevels]?.color || "#6B7280";
  };

  const getSeverityInfo = (severity: string) => {
    return severityLevels[severity as keyof typeof severityLevels] || severityLevels.minimal;
  };

  if (showDashboard) {
    return (
      <div className="bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assessment Results</h1>
              <p className="text-gray-600 mt-2">Your mental health insights and recommendations</p>
            </div>
            <Button 
              onClick={resetAssessment}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </Button>
          </div>

          {/* Score Card */}
          <Card className="border border-card-border shadow-card bg-card">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${getSeverityColor(severity)}20` }}
                >
                  <Brain 
                    className="w-10 h-10" 
                    style={{ color: getSeverityColor(severity) }}
                  />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold text-foreground">{score}</CardTitle>
              <CardDescription className="text-lg">
                <Badge 
                  className="px-4 py-2 text-sm font-semibold"
                  style={{ 
                    backgroundColor: getSeverityColor(severity),
                    color: "white"
                  }}
                >
                  {getSeverityInfo(severity).label} Anxiety
                </Badge>
              </CardDescription>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                {getSeverityInfo(severity).description}. {score <= 9 ? "Consider practicing mindfulness and stress management techniques." : "It may be helpful to speak with a mental health professional."}
              </p>
            </CardHeader>
          </Card>

          {/* Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Anxiety Trend Chart */}
            <Card className="lg:col-span-2 border border-card-border shadow-card bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Anxiety Trend Over Time</span>
                </CardTitle>
                <CardDescription>Your anxiety levels and sentiment over the past weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "white", 
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                      dot={{ fill: "#EF4444", strokeWidth: 2, r: 6 }}
                      name="Anxiety Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sentiment Analysis */}
            <Card className="border border-card-border shadow-card bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <span>Current Sentiment</span>
                </CardTitle>
                <CardDescription>Your emotional state today</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPieChart>
                    <RechartsPieChart
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {sentimentData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Concerns */}
            <Card className="border border-card-border shadow-card bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  <span>Trending Concerns</span>
                </CardTitle>
                <CardDescription>Common stress factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Exam Stress</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      85%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Social Anxiety</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      72%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Future Planning</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      68%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sleep Issues</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      54%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stress Level Chart */}
            <Card className="lg:col-span-2 border border-card-border shadow-card bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <span>Daily Stress Levels</span>
                </CardTitle>
                <CardDescription>Your stress patterns throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stressTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="time" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "white", 
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar 
                      dataKey="level" 
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="border border-card-border shadow-card bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Emergency Support</span>
                </CardTitle>
                <CardDescription>Available 24/7 for crisis situations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-card p-4 rounded-lg border border-card-border">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-foreground">KIRAN Helpline</p>
                      <p className="text-2xl font-bold">1800-599-0019</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-foreground">
                    <strong>Immediate Help:</strong> If you're having thoughts of self-harm, please reach out immediately.
                  </p>
                  <p className="text-muted-foreground">
                    Our crisis counselors are available around the clock to provide support and guidance.
                  </p>
                </div>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => window.open("tel:18005990019")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">GAD-7 Anxiety Assessment</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            This assessment will help us understand your anxiety levels over the past two weeks. 
            Your responses are confidential and will be used to provide personalized recommendations.
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="border border-card-border shadow-card bg-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                Question {answers.filter(a => a >= 0).length} of {questions.length}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Card Toggle */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowEmergencyCard(!showEmergencyCard)}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            {showEmergencyCard ? "Hide" : "Show"} Emergency Contacts
          </Button>
        </div>

        {/* Emergency Card */}
        {showEmergencyCard && (
          <Card className="border border-card-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Crisis Support Available</h3>
                  <p className="text-muted-foreground mb-4">
                    If you're experiencing a mental health crisis or having thoughts of self-harm, 
                    please reach out immediately. Help is available 24/7.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => window.open("tel:18005990019")}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      KIRAN Helpline: 1800-599-0019
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-100"
                      onClick={() => window.open("tel:108")}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Emergency: 108
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, qi) => (
            <Card key={qi} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {qi + 1}. {question.text}
                    </h3>
                    <p className="text-gray-600 text-sm flex items-center space-x-2">
                      <Info className="w-4 h-4" />
                      <span>{question.description}</span>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {choices.map((choice) => (
                      <label 
                        key={choice.value} 
                        className={`
                          relative flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                          ${answers[qi] === choice.value 
                            ? "border-blue-500 bg-blue-50 shadow-md" 
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                          }
                        `}
                      >
                        <input 
                          type="radio" 
                          name={`q-${qi}`} 
                          value={choice.value}
                          checked={answers[qi] === choice.value}
                          onChange={() => setAnswers((arr) => { 
                            const copy = [...arr]; 
                            copy[qi] = choice.value; 
                            return copy; 
                          })}
                          className="sr-only"
                        />
                        <div 
                          className={`w-4 h-4 rounded-full mb-2 ${
                            answers[qi] === choice.value ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        />
                        <span className="text-sm font-medium text-center text-gray-700">
                          {choice.label}
                        </span>
                        {answers[qi] === choice.value && (
                          <CheckCircle className="w-5 h-5 text-blue-500 absolute top-2 right-2" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submission */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                {score !== null ? (
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-gray-900">
                      Your Score: <span style={{ color: getSeverityColor(severity) }}>{score}</span>
                    </p>
                    <p className="text-gray-600">
                      Severity: <Badge 
                        style={{ 
                          backgroundColor: getSeverityColor(severity),
                          color: "white"
                        }}
                      >
                        {getSeverityInfo(severity).label}
                      </Badge>
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600">Complete all questions to see your score</p>
                )}
              </div>
              <Button 
                onClick={submit} 
                disabled={saving || score === null}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Complete Assessment
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


