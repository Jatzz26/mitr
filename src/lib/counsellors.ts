export type Counsellor = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  specialties: string[];
  languages: string[];
  availability: Record<number, string[]>; // 0=Sun..6=Sat => ["HH:MM"]
};

export const COUNSELLORS: Counsellor[] = [
  {
    id: "c1",
    name: "Asha Verma",
    role: "Student Mentor",
    specialties: ["Anxiety", "Exam Stress", "Time Management"],
    languages: ["English", "Hindi"],
    availability: {
      1: ["10:00", "10:30", "11:00", "15:00", "15:30"],
      2: ["09:00", "09:30", "14:00", "14:30", "16:00"],
      4: ["10:00", "10:30", "11:00", "11:30"],
    },
  },
  {
    id: "c2",
    name: "Rahul Mehta",
    role: "Faculty Counsellor",
    specialties: ["Burnout", "Career", "Motivation"],
    languages: ["English"],
    availability: {
      1: ["13:00", "13:30", "14:00"],
      3: ["10:00", "10:30", "11:00", "17:00"],
      5: ["09:00", "09:30", "10:00"],
    },
  },
  {
    id: "c3",
    name: "Neha Gupta",
    role: "Student Mentor",
    specialties: ["Self-esteem", "Relationships"],
    languages: ["English", "Hindi"],
    availability: {
      2: ["11:00", "11:30", "12:00", "16:30"],
      4: ["09:00", "09:30", "10:00"],
    },
  },
  {
    id: "c4",
    name: "Vikram Singh",
    role: "Faculty Counsellor",
    specialties: ["Depression", "Stress", "Habits"],
    languages: ["Hindi"],
    availability: {
      1: ["09:00", "09:30", "10:00"],
      2: ["15:00", "15:30", "16:00"],
      4: ["11:00", "11:30"],
    },
  },
  {
    id: "c5",
    name: "Sara Khan",
    role: "Student Mentor",
    specialties: ["Exam Stress", "Procrastination"],
    languages: ["English", "Urdu"],
    availability: {
      2: ["10:00", "10:30", "11:00", "14:00"],
      3: ["09:00", "09:30"],
      5: ["15:00", "15:30"],
    },
  },
  {
    id: "c6",
    name: "Anil Kumar",
    role: "Faculty Counsellor",
    specialties: ["Career", "Decision Making"],
    languages: ["English", "Hindi"],
    availability: {
      1: ["16:00", "16:30", "17:00"],
      3: ["13:00", "13:30", "14:00"],
    },
  },
  {
    id: "c7",
    name: "Priya Das",
    role: "Student Mentor",
    specialties: ["Anxiety", "Sleep"],
    languages: ["English", "Bengali"],
    availability: {
      0: ["10:00", "10:30"],
      6: ["11:00", "11:30", "12:00"],
    },
  },
];
