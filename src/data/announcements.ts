export type AnnouncementStatus =
  | "Draft"
  | "Pending Admin Approval"
  | "Pending Principal Approval"
  | "Rejected"
  | "Approved by Principal"
  | "Scheduled"
  | "Published"
  | "Expired"
  | "Archived";

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  priority: "high" | "normal" | "low";
  pinned: boolean;
  expiryDate: string;
  createdAt: string;
  isRead: boolean;
  isBookmarked: boolean;
  views: number;
  status: AnnouncementStatus;
  isUrgent: boolean;
  rejectionReason?: string;
  attachment?: { name: string; type: string; size?: string };
  comments?: Comment[];
  eventDate?: string; // Specific date for when the event happens
  archivedAt?: string;
}

export interface Comment {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
  resolved?: boolean;
  replies?: Comment[];
}

export const categories = [
  "Academic",
  "Events",
  "Administrative",
  "Sports",
  "Library",
  "Examination",
  "Placement",
];

export const branches = [
  "CSE",
  "ECE",
  "EEE",
  "IT",
  "Mechanical",
  "Civil",
  "MCA",
  "MBA",
];

export const dummyAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Mid-Semester Examination Schedule Released",
    description:
      "The mid-semester examination schedule for all departments has been released. Students are advised to check the timetable and prepare accordingly. Hall tickets will be available from the examination cell starting next Monday. Any discrepancies in the schedule should be reported to the respective department coordinator within 48 hours.",
    category: "Examination",
    department: "General",
    priority: "high",
    pinned: true,
    expiryDate: "2026-03-15",
    createdAt: "2026-02-25",
    isRead: false,
    isBookmarked: false,
    views: 342,
    status: "Published",
    isUrgent: true,
    eventDate: "2026-03-10",
    attachment: { name: "exam_schedule.pdf", type: "pdf", size: "2.4 MB" },
    comments: [
      {
        id: "c1",
        author: "Prof. Sharma",
        role: "admin",
        text: "Please verify the CSE schedule.",
        timestamp: "2026-02-25T10:00:00",
        replies: [
          {
            id: "c1r1",
            author: "Vikram Singh",
            role: "announcer",
            text: "Verified and corrected.",
            timestamp: "2026-02-25T11:30:00",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Campus Placement Drive – TCS & Infosys",
    description:
      "TCS and Infosys will be conducting a joint placement drive on campus on March 10th. Eligible students from CSE, IT, ECE, and EEE branches with CGPA above 7.0 are encouraged to register before March 5th.",
    category: "Placement",
    department: "CSE",
    priority: "high",
    pinned: true,
    expiryDate: "2026-03-10",
    createdAt: "2026-02-24",
    isRead: false,
    isBookmarked: true,
    views: 567,
    status: "Published",
    isUrgent: false,
    eventDate: "2026-03-05",
    attachment: { name: "placement_brochure.pdf", type: "pdf", size: "1.8 MB" },
  },
  {
    id: "3",
    title: "Annual Cultural Festival – Euphoria 2026",
    description:
      "Registration is now open for Euphoria 2026, the annual cultural festival. Events include dance, music, drama, art exhibitions, and literary competitions. Register your teams before March 1st.",
    category: "Events",
    department: "General",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-20",
    createdAt: "2026-02-23",
    isRead: true,
    isBookmarked: false,
    views: 234,
    status: "Published",
    isUrgent: false,
    eventDate: "2026-03-15",
  },
  {
    id: "4",
    title: "Library Timings Extended During Exams",
    description:
      "The central library will remain open from 7:00 AM to 11:00 PM during the examination period (March 10–25). Additional reading rooms on the second floor will also be made available.",
    category: "Library",
    department: "General",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-25",
    createdAt: "2026-02-22",
    isRead: false,
    isBookmarked: true,
    views: 189,
    status: "Published",
    isUrgent: false,
  },
  {
    id: "6",
    title: "Workshop on Machine Learning with Python",
    description:
      "A 3-day workshop on Machine Learning with Python will be conducted by the CSE department in collaboration with Google Developers Group. Topics include regression, classification, neural networks, and hands-on projects.",
    category: "Academic",
    department: "CSE",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-12",
    createdAt: "2026-02-21",
    isRead: true,
    isBookmarked: false,
    views: 298,
    status: "Published",
    isUrgent: false,
    eventDate: "2026-03-08",
  },
  {
    id: "7",
    title: "Inter-College Cricket Tournament",
    description:
      "The annual inter-college cricket tournament will be held from March 15–22 at the main sports complex. Teams can register through their respective sports coordinators.",
    category: "Sports",
    department: "General",
    priority: "low",
    pinned: false,
    expiryDate: "2026-03-22",
    createdAt: "2026-02-20",
    isRead: true,
    isBookmarked: false,
    views: 145,
    status: "Published",
    isUrgent: false,
  },
  {
    id: "8",
    title: "Fee Payment Deadline Extended",
    description:
      "The last date for payment of tuition fees for the current semester has been extended to March 10th. Students who have not paid their fees are advised to do so immediately through the online portal.",
    category: "Administrative",
    department: "General",
    priority: "high",
    pinned: false,
    expiryDate: "2026-03-10",
    createdAt: "2026-02-19",
    isRead: false,
    isBookmarked: false,
    views: 412,
    status: "Published",
    isUrgent: false,
  },
  {
    id: "9",
    title: "Guest Lecture – Blockchain in Finance",
    description:
      "Dr. Ramesh Kumar from IIT Delhi will deliver a guest lecture on 'Blockchain Applications in Modern Finance' on March 5th at 3:00 PM in Seminar Hall 2.",
    category: "Academic",
    department: "CSE",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-05",
    createdAt: "2026-02-18",
    isRead: true,
    isBookmarked: true,
    views: 178,
    status: "Published",
    isUrgent: false,
  },
  {
    id: "10",
    title: "New Books Added to Digital Library",
    description:
      "Over 500 new e-books and journals have been added to the digital library portal covering topics in Computer Science, Electronics, Management, and Humanities.",
    category: "Library",
    department: "General",
    priority: "low",
    pinned: false,
    expiryDate: "2026-04-30",
    createdAt: "2026-02-17",
    isRead: true,
    isBookmarked: false,
    views: 98,
    status: "Published",
    isUrgent: false,
  },
  {
    id: "11",
    title: "Student Council Elections – Nominations Open",
    description:
      "Nominations for the Student Council Elections 2026-27 are now open. Interested candidates can collect nomination forms from the Dean of Students' office.",
    category: "Administrative",
    department: "General",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-07",
    createdAt: "2026-02-16",
    isRead: false,
    isBookmarked: false,
    views: 223,
    status: "Published",
    isUrgent: false,
  },
  {
    id: "12",
    title: "Yoga & Meditation Camp",
    description:
      "A week-long yoga and meditation camp will be organized at the sports complex from March 3–9. Sessions will be held from 6:00–7:30 AM.",
    category: "Sports",
    department: "General",
    priority: "low",
    pinned: false,
    expiryDate: "2026-03-09",
    createdAt: "2026-02-15",
    isRead: true,
    isBookmarked: false,
    views: 67,
    status: "Published",
    isUrgent: false,
  },
  {
    id: "13",
    title: "Semester Result Publication Notice",
    description:
      "Results for the previous semester will be published on the university portal by March 1st. Students with backlogs should contact their department for revaluation procedures.",
    category: "Examination",
    department: "General",
    priority: "high",
    pinned: false,
    expiryDate: "2026-03-15",
    createdAt: "2026-02-14",
    isRead: false,
    isBookmarked: true,
    views: 534,
    status: "Published",
    isUrgent: true,
  },
  {
    id: "14",
    title: "Hackathon 2026 – Code for Change",
    description:
      "Join the 24-hour hackathon themed 'Code for Change' on March 18th. Build solutions for real-world problems in healthcare, education, and sustainability. Prizes worth ₹1,00,000.",
    category: "Events",
    department: "CSE",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-18",
    createdAt: "2026-02-13",
    isRead: true,
    isBookmarked: false,
    views: 312,
    status: "Published",
    isUrgent: false,
  },
  // Workflow demo items - not published
  {
    id: "16",
    title: "Research Paper Submission Deadline",
    description:
      "The deadline for submitting research papers for the annual college journal 'TechVista' is March 20th.",
    category: "Academic",
    department: "CSE",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-20",
    createdAt: "2026-02-11",
    isRead: false,
    isBookmarked: false,
    views: 0,
    status: "Pending Admin Approval",
    isUrgent: false,
  },
  {
    id: "17",
    title: "Blood Donation Camp",
    description:
      "The NSS unit is organizing a blood donation camp on March 6th in collaboration with Red Cross Society.",
    category: "Events",
    department: "General",
    priority: "low",
    pinned: false,
    expiryDate: "2026-03-06",
    createdAt: "2026-02-10",
    isRead: false,
    isBookmarked: false,
    views: 0,
    status: "Pending Principal Approval",
    isUrgent: false,
  },
  {
    id: "18",
    title: "Wi-Fi Network Upgrade Notice",
    description:
      "The campus Wi-Fi network will be upgraded over the weekend (March 1–2). Expect intermittent connectivity issues.",
    category: "Administrative",
    department: "IT",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-02",
    createdAt: "2026-02-09",
    isRead: false,
    isBookmarked: false,
    views: 0,
    status: "Approved by Principal",
    isUrgent: false,
  },
  {
    id: "19",
    title: "Photography Club – Photo Walk",
    description:
      "The Photography Club is organizing a heritage photo walk on March 8th. Meet at the main gate at 7:00 AM.",
    category: "Events",
    department: "General",
    priority: "low",
    pinned: false,
    expiryDate: "2026-03-08",
    createdAt: "2026-02-08",
    isRead: false,
    isBookmarked: false,
    views: 0,
    status: "Rejected",
    isUrgent: false,
    rejectionReason:
      "Event conflicts with examination schedule. Please reschedule.",
  },
  {
    id: "20",
    title: "Scholarship Applications Open",
    description:
      "Applications for merit-based and need-based scholarships for the academic year 2026-27 are now open. Deadline: March 25th.",
    category: "Administrative",
    department: "General",
    priority: "high",
    pinned: false,
    expiryDate: "2026-03-25",
    createdAt: "2026-02-07",
    isRead: false,
    isBookmarked: true,
    views: 456,
    status: "Published",
    isUrgent: false,
  },
  {
    id: "21",
    title: "Lab Safety Training – Mandatory",
    description:
      "All students enrolled in laboratory courses must complete the online safety training module by March 5th.",
    category: "Academic",
    department: "General",
    priority: "high",
    pinned: false,
    expiryDate: "2026-03-05",
    createdAt: "2026-02-06",
    isRead: false,
    isBookmarked: false,
    views: 267,
    status: "Published",
    isUrgent: true,
  },
  {
    id: "22",
    title: "Alumni Meet 2026 – Save the Date",
    description:
      "The annual alumni meet is scheduled for March 28th. Current students are invited to network with alumni from various industries.",
    category: "Events",
    department: "General",
    priority: "low",
    pinned: false,
    expiryDate: "2026-03-28",
    createdAt: "2026-02-05",
    isRead: true,
    isBookmarked: false,
    views: 89,
    status: "Draft",
    isUrgent: false,
  },
  {
    id: "23",
    title: "Canteen Menu Updated",
    description:
      "The campus canteen has updated its menu with healthier options including salads, smoothies, and whole grain items.",
    category: "Administrative",
    department: "General",
    priority: "low",
    pinned: false,
    expiryDate: "2026-04-30",
    createdAt: "2026-02-04",
    isRead: true,
    isBookmarked: false,
    views: 112,
    status: "Scheduled",
    isUrgent: false,
  },
  {
    id: "24",
    title: "Internship Fair – March 2026",
    description:
      "Over 30 companies will participate in the internship fair on March 14th. Pre-registration is mandatory.",
    category: "Placement",
    department: "General",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-14",
    createdAt: "2026-02-03",
    isRead: false,
    isBookmarked: false,
    views: 378,
    status: "Published",
    isUrgent: false,
    attachment: {
      name: "participating_companies.pdf",
      type: "pdf",
      size: "3.1 MB",
    },
  },
  {
    id: "25",
    title: "Campus Clean-Up Drive",
    description:
      "Join the campus clean-up drive organized by the Eco Club on March 7th from 8:00 AM to 12:00 PM.",
    category: "Events",
    department: "General",
    priority: "low",
    pinned: false,
    expiryDate: "2026-03-07",
    createdAt: "2026-02-02",
    isRead: true,
    isBookmarked: false,
    views: 45,
    status: "Published",
    isUrgent: false,
  },
];

export function sortAnnouncements(
  announcements: Announcement[],
): Announcement[] {
  return [...announcements].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority])
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
  });
}
