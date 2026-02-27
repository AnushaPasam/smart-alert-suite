export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "high" | "normal" | "low";
  pinned: boolean;
  expiryDate: string;
  createdAt: string;
  isRead: boolean;
  isBookmarked: boolean;
  views: number;
  attachment?: { name: string; type: string };
}

export const categories = [
  "Academic",
  "Events",
  "Administrative",
  "Sports",
  "Library",
  "Examination",
  "Placement",
  "Hostel",
];

export const colleges = [
  { id: "c1", name: "National Institute of Technology, Delhi" },
  { id: "c2", name: "Indian Institute of Technology, Mumbai" },
  { id: "c3", name: "Delhi Technological University" },
  { id: "c4", name: "BITS Pilani" },
  { id: "c5", name: "VIT Vellore" },
];

export const dummyAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Mid-Semester Examination Schedule Released",
    description:
      "The mid-semester examination schedule for all departments has been released. Students are advised to check the timetable and prepare accordingly. Hall tickets will be available from the examination cell starting next Monday. Any discrepancies in the schedule should be reported to the respective department coordinator within 48 hours.",
    category: "Examination",
    priority: "high",
    pinned: true,
    expiryDate: "2026-03-15",
    createdAt: "2026-02-25",
    isRead: false,
    isBookmarked: false,
    views: 342,
    attachment: { name: "exam_schedule.pdf", type: "pdf" },
  },
  {
    id: "2",
    title: "Campus Placement Drive – TCS & Infosys",
    description:
      "TCS and Infosys will be conducting a joint placement drive on campus on March 10th. Eligible students from CSE, IT, ECE, and EEE branches with CGPA above 7.0 are encouraged to register before March 5th. Pre-placement talks will be held on March 8th in the main auditorium.",
    category: "Placement",
    priority: "high",
    pinned: true,
    expiryDate: "2026-03-10",
    createdAt: "2026-02-24",
    isRead: false,
    isBookmarked: true,
    views: 567,
    attachment: { name: "placement_brochure.pdf", type: "pdf" },
  },
  {
    id: "3",
    title: "Annual Cultural Festival – Euphoria 2026",
    description:
      "Registration is now open for Euphoria 2026, the annual cultural festival. Events include dance, music, drama, art exhibitions, and literary competitions. Register your teams before March 1st. Volunteers are also welcome to help with event coordination.",
    category: "Events",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-20",
    createdAt: "2026-02-23",
    isRead: true,
    isBookmarked: false,
    views: 234,
  },
  {
    id: "4",
    title: "Library Timings Extended During Exams",
    description:
      "The central library will remain open from 7:00 AM to 11:00 PM during the examination period (March 10–25). Additional reading rooms on the second floor will also be made available. Students must carry their ID cards for access after 8:00 PM.",
    category: "Library",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-25",
    createdAt: "2026-02-22",
    isRead: false,
    isBookmarked: true,
    views: 189,
  },
  {
    id: "5",
    title: "Hostel Maintenance – Water Supply Interruption",
    description:
      "Due to maintenance work on the water supply system, there will be a water supply interruption in hostels A, B, and C on March 2nd from 9:00 AM to 3:00 PM. Students are advised to store water in advance. Tanker facility will be available on request.",
    category: "Hostel",
    priority: "high",
    pinned: false,
    expiryDate: "2026-03-02",
    createdAt: "2026-02-26",
    isRead: false,
    isBookmarked: false,
    views: 156,
  },
  {
    id: "6",
    title: "Workshop on Machine Learning with Python",
    description:
      "A 3-day workshop on Machine Learning with Python will be conducted by the CSE department in collaboration with Google Developers Group. Topics include regression, classification, neural networks, and hands-on projects. Registration fee: ₹200.",
    category: "Academic",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-12",
    createdAt: "2026-02-21",
    isRead: true,
    isBookmarked: false,
    views: 298,
  },
  {
    id: "7",
    title: "Inter-College Cricket Tournament",
    description:
      "The annual inter-college cricket tournament will be held from March 15–22 at the main sports complex. Teams can register through their respective sports coordinators. Last date for registration is March 8th. Practice nets will be available from March 1st.",
    category: "Sports",
    priority: "low",
    pinned: false,
    expiryDate: "2026-03-22",
    createdAt: "2026-02-20",
    isRead: true,
    isBookmarked: false,
    views: 145,
  },
  {
    id: "8",
    title: "Fee Payment Deadline Extended",
    description:
      "The last date for payment of tuition fees for the current semester has been extended to March 10th. Students who have not paid their fees are advised to do so immediately through the online portal. Late fee of ₹500 will be applicable after the deadline.",
    category: "Administrative",
    priority: "high",
    pinned: false,
    expiryDate: "2026-03-10",
    createdAt: "2026-02-19",
    isRead: false,
    isBookmarked: false,
    views: 412,
  },
  {
    id: "9",
    title: "Guest Lecture – Blockchain in Finance",
    description:
      "Dr. Ramesh Kumar from IIT Delhi will deliver a guest lecture on 'Blockchain Applications in Modern Finance' on March 5th at 3:00 PM in Seminar Hall 2. All students and faculty members are welcome to attend.",
    category: "Academic",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-05",
    createdAt: "2026-02-18",
    isRead: true,
    isBookmarked: true,
    views: 178,
  },
  {
    id: "10",
    title: "New Books Added to Digital Library",
    description:
      "Over 500 new e-books and journals have been added to the digital library portal covering topics in Computer Science, Electronics, Management, and Humanities. Access them through the library portal using your student credentials.",
    category: "Library",
    priority: "low",
    pinned: false,
    expiryDate: "2026-04-30",
    createdAt: "2026-02-17",
    isRead: true,
    isBookmarked: false,
    views: 98,
  },
  {
    id: "11",
    title: "Student Council Elections – Nominations Open",
    description:
      "Nominations for the Student Council Elections 2026-27 are now open. Interested candidates can collect nomination forms from the Dean of Students' office. Last date for submission is March 7th. Campaign period starts March 10th.",
    category: "Administrative",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-07",
    createdAt: "2026-02-16",
    isRead: false,
    isBookmarked: false,
    views: 223,
  },
  {
    id: "12",
    title: "Yoga & Meditation Camp",
    description:
      "A week-long yoga and meditation camp will be organized at the sports complex from March 3–9. Sessions will be held from 6:00–7:30 AM. Open to all students and staff. No registration required, just bring your yoga mat.",
    category: "Sports",
    priority: "low",
    pinned: false,
    expiryDate: "2026-03-09",
    createdAt: "2026-02-15",
    isRead: true,
    isBookmarked: false,
    views: 67,
  },
  {
    id: "13",
    title: "Semester Result Publication Notice",
    description:
      "Results for the previous semester will be published on the university portal by March 1st. Students with backlogs should contact their department for revaluation procedures. The revaluation window will remain open until March 15th.",
    category: "Examination",
    priority: "high",
    pinned: false,
    expiryDate: "2026-03-15",
    createdAt: "2026-02-14",
    isRead: false,
    isBookmarked: true,
    views: 534,
  },
  {
    id: "14",
    title: "Hackathon 2026 – Code for Change",
    description:
      "Join the 24-hour hackathon themed 'Code for Change' on March 18th. Build solutions for real-world problems in healthcare, education, and sustainability. Prizes worth ₹1,00,000. Teams of 2-4 members. Register on the event portal.",
    category: "Events",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-18",
    createdAt: "2026-02-13",
    isRead: true,
    isBookmarked: false,
    views: 312,
  },
  {
    id: "15",
    title: "Hostel Room Allocation – New Semester",
    description:
      "Room allocation for the upcoming semester will begin on March 5th. Current residents must confirm their room preferences through the hostel portal by March 3rd. New allotments will be announced on March 8th.",
    category: "Hostel",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-08",
    createdAt: "2026-02-12",
    isRead: false,
    isBookmarked: false,
    views: 201,
  },
  {
    id: "16",
    title: "Research Paper Submission Deadline",
    description:
      "The deadline for submitting research papers for the annual college journal 'TechVista' is March 20th. Papers must follow IEEE format. Submit through the research portal or email to research@campus.edu.",
    category: "Academic",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-20",
    createdAt: "2026-02-11",
    isRead: true,
    isBookmarked: false,
    views: 87,
  },
  {
    id: "17",
    title: "Blood Donation Camp",
    description:
      "The NSS unit is organizing a blood donation camp on March 6th in collaboration with Red Cross Society. All healthy students above 18 years are encouraged to participate. Refreshments will be provided. Register at the NSS office.",
    category: "Events",
    priority: "low",
    pinned: false,
    expiryDate: "2026-03-06",
    createdAt: "2026-02-10",
    isRead: true,
    isBookmarked: false,
    views: 134,
  },
  {
    id: "18",
    title: "Wi-Fi Network Upgrade Notice",
    description:
      "The campus Wi-Fi network will be upgraded over the weekend (March 1–2). Expect intermittent connectivity issues. The new network will offer 3x faster speeds. Updated credentials will be shared via email.",
    category: "Administrative",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-02",
    createdAt: "2026-02-09",
    isRead: false,
    isBookmarked: false,
    views: 345,
  },
  {
    id: "19",
    title: "Photography Club – Photo Walk",
    description:
      "The Photography Club is organizing a heritage photo walk on March 8th. Meet at the main gate at 7:00 AM. Bring your cameras or smartphones. Best photographs will be featured in the college magazine.",
    category: "Events",
    priority: "low",
    pinned: false,
    expiryDate: "2026-03-08",
    createdAt: "2026-02-08",
    isRead: true,
    isBookmarked: false,
    views: 56,
  },
  {
    id: "20",
    title: "Scholarship Applications Open",
    description:
      "Applications for merit-based and need-based scholarships for the academic year 2026-27 are now open. Eligible students can apply through the scholarship portal. Required documents include income certificate and academic transcripts. Deadline: March 25th.",
    category: "Administrative",
    priority: "high",
    pinned: false,
    expiryDate: "2026-03-25",
    createdAt: "2026-02-07",
    isRead: false,
    isBookmarked: true,
    views: 456,
  },
  {
    id: "21",
    title: "Lab Safety Training – Mandatory",
    description:
      "All students enrolled in laboratory courses must complete the online safety training module by March 5th. Failure to complete the training will result in restricted lab access. Access the module on the LMS portal.",
    category: "Academic",
    priority: "high",
    pinned: false,
    expiryDate: "2026-03-05",
    createdAt: "2026-02-06",
    isRead: false,
    isBookmarked: false,
    views: 267,
  },
  {
    id: "22",
    title: "Alumni Meet 2026 – Save the Date",
    description:
      "The annual alumni meet is scheduled for March 28th. Current students are invited to network with alumni from various industries. RSVP through the alumni portal by March 20th.",
    category: "Events",
    priority: "low",
    pinned: false,
    expiryDate: "2026-03-28",
    createdAt: "2026-02-05",
    isRead: true,
    isBookmarked: false,
    views: 89,
  },
  {
    id: "23",
    title: "Canteen Menu Updated",
    description:
      "The campus canteen has updated its menu with healthier options including salads, smoothies, and whole grain items. Check the new menu posted at the canteen entrance. Feedback welcome at canteen@campus.edu.",
    category: "Administrative",
    priority: "low",
    pinned: false,
    expiryDate: "2026-04-30",
    createdAt: "2026-02-04",
    isRead: true,
    isBookmarked: false,
    views: 112,
  },
  {
    id: "24",
    title: "Internship Fair – March 2026",
    description:
      "Over 30 companies will participate in the internship fair on March 14th. Companies from IT, finance, manufacturing, and consulting sectors will be present. Prepare your resumes and dress professionally. Pre-registration is mandatory.",
    category: "Placement",
    priority: "normal",
    pinned: false,
    expiryDate: "2026-03-14",
    createdAt: "2026-02-03",
    isRead: false,
    isBookmarked: false,
    views: 378,
    attachment: { name: "participating_companies.pdf", type: "pdf" },
  },
  {
    id: "25",
    title: "Campus Clean-Up Drive",
    description:
      "Join the campus clean-up drive organized by the Eco Club on March 7th from 8:00 AM to 12:00 PM. Gloves and cleaning supplies will be provided. Let's make our campus greener and cleaner together!",
    category: "Events",
    priority: "low",
    pinned: false,
    expiryDate: "2026-03-07",
    createdAt: "2026-02-02",
    isRead: true,
    isBookmarked: false,
    views: 45,
  },
];

export function sortAnnouncements(announcements: Announcement[]): Announcement[] {
  return [...announcements].sort((a, b) => {
    // Pinned first
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    // Then by priority
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority])
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    // Then by expiry date (nearest first)
    return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
  });
}
