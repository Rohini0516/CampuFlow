const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {
  User,
  Department,
  Course,
  Subject,
  Student,
  Faculty,
  Attendance,
  Assignment,
  Submission,
  Exam,
  Mark,
  Timetable,
  Event,
  EventRegistration,
  Company,
  PlacementDrive,
  PlacementApplication,
  Internship,
  Complaint,
  CertificateRequest,
  Notification,
  Announcement,
} = require('../models');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusflow';
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Department.deleteMany(),
      Course.deleteMany(),
      Subject.deleteMany(),
      Student.deleteMany(),
      Faculty.deleteMany(),
      Attendance.deleteMany(),
      Assignment.deleteMany(),
      Submission.deleteMany(),
      Exam.deleteMany(),
      Mark.deleteMany(),
      Timetable.deleteMany(),
      Event.deleteMany(),
      EventRegistration.deleteMany(),
      Company.deleteMany(),
      PlacementDrive.deleteMany(),
      PlacementApplication.deleteMany(),
      Internship.deleteMany(),
      Complaint.deleteMany(),
      CertificateRequest.deleteMany(),
      Notification.deleteMany(),
      Announcement.deleteMany(),
    ]);

    console.log('🧹 Existing database collections cleared.');

    // 1. Create Core Users
    console.log('👤 Creating demo users...');
    const adminUser = await User.create({
      name: 'Dr. Arthur Vance (Dean)',
      email: 'admin@campusflow.edu',
      password: 'Admin@123',
      role: 'ADMIN',
      phone: '+1 (555) 019-2831',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });

    const facultyUser = await User.create({
      name: 'Prof. Sarah Jenkins',
      email: 'faculty@campusflow.edu',
      password: 'Faculty@123',
      role: 'FACULTY',
      phone: '+1 (555) 018-9432',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    });

    const facultyUser2 = await User.create({
      name: 'Dr. Robert Chen',
      email: 'robert.chen@campusflow.edu',
      password: 'Faculty@123',
      role: 'FACULTY',
      phone: '+1 (555) 017-6655',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    });

    const studentUser = await User.create({
      name: 'Alex Rivera',
      email: 'student@campusflow.edu',
      password: 'Student@123',
      role: 'STUDENT',
      phone: '+1 (555) 014-7788',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    });

    const studentUser2 = await User.create({
      name: 'Elena Rostova',
      email: 'elena@campusflow.edu',
      password: 'Student@123',
      role: 'STUDENT',
      phone: '+1 (555) 012-3344',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    });

    const placementOfficerUser = await User.create({
      name: 'Marcus Sterling',
      email: 'placement@campusflow.edu',
      password: 'Placement@123',
      role: 'PLACEMENT_OFFICER',
      phone: '+1 (555) 011-8899',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    });

    // 2. Create Departments
    console.log('🏢 Creating departments...');
    const cseDept = await Department.create({
      name: 'Computer Science & Engineering',
      code: 'CSE',
      description: 'Department of Computer Science and Engineering & AI Research',
      hodName: 'Dr. Arthur Vance',
      hodEmail: 'admin@campusflow.edu',
      establishedYear: 2004,
    });

    const itDept = await Department.create({
      name: 'Information Technology',
      code: 'IT',
      description: 'Department of Applied Information Technology and Cybersecurity',
      hodName: 'Dr. Gregory House',
      hodEmail: 'it.hod@campusflow.edu',
      establishedYear: 2008,
    });

    const eceDept = await Department.create({
      name: 'Electronics & Communication',
      code: 'ECE',
      description: 'Department of Microelectronics, Embedded Systems & IoT',
      hodName: 'Dr. Linda Morales',
      hodEmail: 'ece.hod@campusflow.edu',
      establishedYear: 2006,
    });

    // 3. Create Courses
    console.log('📚 Creating courses...');
    const btechCse = await Course.create({
      name: 'B.Tech in Computer Science & Engineering',
      code: 'BTECH-CSE',
      department: cseDept._id,
      durationYears: 4,
      totalSemesters: 8,
      description: 'Undergraduate Program in Computer Systems, Algorithms and Software Engineering',
    });

    const btechIt = await Course.create({
      name: 'B.Tech in Information Technology',
      code: 'BTECH-IT',
      department: itDept._id,
      durationYears: 4,
      totalSemesters: 8,
      description: 'Undergraduate Program in Network Architecture and Information Engineering',
    });

    // 4. Create Subjects
    console.log('📖 Creating subjects...');
    const subDbms = await Subject.create({
      name: 'Database Management Systems',
      code: 'CS501',
      department: cseDept._id,
      course: btechCse._id,
      semester: 5,
      credits: 4,
      type: 'THEORY',
    });

    const subDsa = await Subject.create({
      name: 'Data Structures & Algorithms',
      code: 'CS502',
      department: cseDept._id,
      course: btechCse._id,
      semester: 5,
      credits: 4,
      type: 'THEORY',
    });

    const subCn = await Subject.create({
      name: 'Computer Networks & Security',
      code: 'CS503',
      department: cseDept._id,
      course: btechCse._id,
      semester: 5,
      credits: 3,
      type: 'THEORY',
    });

    const subOs = await Subject.create({
      name: 'Operating Systems & Cloud',
      code: 'CS504',
      department: cseDept._id,
      course: btechCse._id,
      semester: 5,
      credits: 3,
      type: 'THEORY',
    });

    const subWebLab = await Subject.create({
      name: 'Full-Stack Web Development Lab',
      code: 'CS505P',
      department: cseDept._id,
      course: btechCse._id,
      semester: 5,
      credits: 2,
      type: 'PRACTICAL',
    });

    // 5. Create Faculty Profiles
    console.log('👨‍🏫 Creating faculty profiles...');
    const facultyProfile1 = await Faculty.create({
      user: facultyUser._id,
      employeeId: 'FAC-CSE-001',
      department: cseDept._id,
      designation: 'Associate Professor',
      qualification: 'Ph.D. in Distributed Database Systems',
      experienceYears: 8,
      subjects: [subDbms._id, subDsa._id, subWebLab._id],
      cabinNumber: 'IT-304B',
    });

    const facultyProfile2 = await Faculty.create({
      user: facultyUser2._id,
      employeeId: 'FAC-CSE-002',
      department: cseDept._id,
      designation: 'Assistant Professor',
      qualification: 'M.Tech in Cybersecurity',
      experienceYears: 5,
      subjects: [subCn._id, subOs._id],
      cabinNumber: 'IT-306A',
    });

    // Link subjects to faculty
    await Subject.findByIdAndUpdate(subDbms._id, { faculty: facultyProfile1._id });
    await Subject.findByIdAndUpdate(subDsa._id, { faculty: facultyProfile1._id });
    await Subject.findByIdAndUpdate(subWebLab._id, { faculty: facultyProfile1._id });
    await Subject.findByIdAndUpdate(subCn._id, { faculty: facultyProfile2._id });
    await Subject.findByIdAndUpdate(subOs._id, { faculty: facultyProfile2._id });

    // 6. Create Student Profiles
    console.log('🎓 Creating student profiles...');
    const studentProfile1 = await Student.create({
      user: studentUser._id,
      rollNumber: '22CSE101',
      department: cseDept._id,
      course: btechCse._id,
      currentYear: 3,
      currentSemester: 5,
      academicYear: '2025-2026',
      dob: new Date('2004-05-14'),
      gender: 'Male',
      address: '742 Evergreen Terrace, Tech District',
      guardianName: 'George Rivera',
      guardianPhone: '+1 (555) 998-1122',
      cgpa: 8.85,
      attendancePercentage: 88,
    });

    const studentProfile2 = await Student.create({
      user: studentUser2._id,
      rollNumber: '22CSE102',
      department: cseDept._id,
      course: btechCse._id,
      currentYear: 3,
      currentSemester: 5,
      academicYear: '2025-2026',
      dob: new Date('2004-09-21'),
      gender: 'Female',
      address: '128 Silicon Valley Way, West Campus',
      guardianName: 'Anna Rostova',
      guardianPhone: '+1 (555) 776-3399',
      cgpa: 9.2,
      attendancePercentage: 94,
    });

    // 7. Seed Attendance records
    console.log('📅 Seeding attendance records...');
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const pastDate = new Date(today);
      pastDate.setDate(pastDate.getDate() - i);
      pastDate.setHours(0, 0, 0, 0);

      // Student 1 attendance
      await Attendance.create({
        student: studentProfile1._id,
        subject: subDbms._id,
        faculty: facultyProfile1._id,
        date: pastDate,
        period: 1,
        status: i % 7 === 0 ? 'ABSENT' : i % 5 === 0 ? 'LATE' : 'PRESENT',
        semester: 5,
        academicYear: '2025-2026',
      });

      await Attendance.create({
        student: studentProfile1._id,
        subject: subDsa._id,
        faculty: facultyProfile1._id,
        date: pastDate,
        period: 2,
        status: i % 6 === 0 ? 'LEAVE' : 'PRESENT',
        semester: 5,
        academicYear: '2025-2026',
      });

      // Student 2 attendance
      await Attendance.create({
        student: studentProfile2._id,
        subject: subDbms._id,
        faculty: facultyProfile1._id,
        date: pastDate,
        period: 1,
        status: 'PRESENT',
        semester: 5,
        academicYear: '2025-2026',
      });
    }

    // 8. Create Timetable
    console.log('⏰ Creating timetable schedule...');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const periods = [
      { period: 1, start: '09:00 AM', end: '10:00 AM', sub: subDbms, fac: facultyProfile1, room: 'IT-302' },
      { period: 2, start: '10:00 AM', end: '11:00 AM', sub: subDsa, fac: facultyProfile1, room: 'IT-302' },
      { period: 3, start: '11:15 AM', end: '12:15 PM', sub: subCn, fac: facultyProfile2, room: 'IT-304' },
      { period: 4, start: '01:15 PM', end: '02:15 PM', sub: subOs, fac: facultyProfile2, room: 'IT-304' },
      { period: 5, start: '02:30 PM', end: '04:30 PM', sub: subWebLab, fac: facultyProfile1, room: 'CS-LAB-4' },
    ];

    for (const d of days) {
      for (const p of periods) {
        await Timetable.create({
          dayOfWeek: d,
          periodNumber: p.period,
          startTime: p.start,
          endTime: p.end,
          subject: p.sub._id,
          faculty: p.fac._id,
          department: cseDept._id,
          course: btechCse._id,
          semester: 5,
          roomNumber: p.room,
          academicYear: '2025-2026',
        });
      }
    }

    // 9. Create Assignments & Submissions
    console.log('📝 Creating assignments & submissions...');
    const assign1 = await Assignment.create({
      title: 'B-Tree & Indexing Optimization Lab',
      description: 'Implement B+ Tree indexing algorithm with node balancing and query performance benchmarks.',
      subject: subDbms._id,
      faculty: facultyProfile1._id,
      department: cseDept._id,
      course: btechCse._id,
      semester: 5,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
      maxMarks: 50,
      instructions: 'Submit GitHub repository link or zipped source code with test suites.',
    });

    const assign2 = await Assignment.create({
      title: 'Dynamic Programming Challenge Set',
      description: 'Solve LeetCode hard problems on DP: Matrix Chain Multiplication, Edit Distance, and Traveling Salesman.',
      subject: subDsa._id,
      faculty: facultyProfile1._id,
      department: cseDept._id,
      course: btechCse._id,
      semester: 5,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      maxMarks: 100,
      instructions: 'Document time & space complexity analysis for every solution.',
    });

    const assign3 = await Assignment.create({
      title: 'REST API & Microservice Architecture',
      description: 'Build an Express.js JWT microservice with MongoDB database schema and rate limiting.',
      subject: subWebLab._id,
      faculty: facultyProfile1._id,
      department: cseDept._id,
      course: btechCse._id,
      semester: 5,
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      maxMarks: 100,
      instructions: 'Include Postman export or OpenAPI specification.',
    });

    // Seed student submission
    await Submission.create({
      assignment: assign3._id,
      student: studentProfile1._id,
      submissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      content: 'Here is my GitHub repository with full test suite: https://github.com/alexrivera/campus-microservice',
      fileUrl: 'https://example.com/submissions/alex_microservice_v1.zip',
      status: 'GRADED',
      marksObtained: 94,
      facultyFeedback: 'Excellent code modularity, solid test coverage and clean error handling!',
      gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    // 10. Create Exams & Marks
    console.log('📊 Creating exams and grades...');
    const midTermExam = await Exam.create({
      title: 'Mid-Semester Examinations 2026',
      type: 'MID_TERM',
      department: cseDept._id,
      course: btechCse._id,
      semester: 5,
      academicYear: '2025-2026',
      startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      status: 'SCHEDULED',
      instructions: 'Hall ticket and College ID mandatory. No scientific calculators allowed for CS502.',
    });

    const internalExam = await Exam.create({
      title: 'Continuous Internal Assessment 1 (CIA-1)',
      type: 'INTERNAL',
      department: cseDept._id,
      course: btechCse._id,
      semester: 5,
      academicYear: '2025-2026',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      status: 'COMPLETED',
    });

    // Marks for student 1 in CIA-1
    await Mark.create({
      exam: internalExam._id,
      student: studentProfile1._id,
      subject: subDbms._id,
      internalMarks: 27,
      externalMarks: 65,
      maxMarks: 100,
      remarks: 'Outstanding conceptual clarity in SQL joins and Normalization.',
      enteredBy: facultyUser._id,
    });

    await Mark.create({
      exam: internalExam._id,
      student: studentProfile1._id,
      subject: subDsa._id,
      internalMarks: 29,
      externalMarks: 68,
      maxMarks: 100,
      remarks: 'Great graph traversal problem-solving skills.',
      enteredBy: facultyUser._id,
    });

    await Mark.create({
      exam: internalExam._id,
      student: studentProfile1._id,
      subject: subCn._id,
      internalMarks: 24,
      externalMarks: 58,
      maxMarks: 100,
      remarks: 'Good understanding of TCP/IP protocol suite.',
      enteredBy: facultyUser2._id,
    });

    // 11. Create Events
    console.log('🎉 Creating campus events...');
    const hackathon = await Event.create({
      title: 'InnovateX 2026: 36-Hour National Hackathon',
      description: 'Join top student innovators across the country to build cutting-edge AI and Web3 solutions. Prizes worth $15,000!',
      category: 'Hackathon',
      date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      time: '09:00 AM - Next Day 09:00 PM',
      venue: 'Main Auditorium & Innovation Center',
      organizer: 'CampusFlow Tech Council & ACM Student Chapter',
      capacity: 250,
      bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600',
      status: 'Upcoming',
      registrationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      createdBy: adminUser._id,
    });

    const aiWorkshop = await Event.create({
      title: 'Mastering LLMs, RAG & Agentic Workflows',
      description: 'Hands-on masterclass on building autonomous AI agents with DeepMind researchers and industry leaders.',
      category: 'Workshop',
      date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      time: '02:00 PM - 06:00 PM',
      venue: 'Seminar Hall 3, IT Block',
      organizer: 'Department of CSE',
      capacity: 120,
      bannerImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600',
      status: 'Upcoming',
      registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      createdBy: facultyUser._id,
    });

    const culturalFest = await Event.create({
      title: 'Aura 2026: Annual Inter-College Cultural Gala',
      description: 'Electrifying musical performances, dance face-offs, theater, and celebrity pro-nights.',
      category: 'Cultural',
      date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      time: '05:00 PM - 11:00 PM',
      venue: 'Open Air Amphitheatre',
      organizer: 'Student Cultural Affairs Board',
      capacity: 1500,
      bannerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
      status: 'Upcoming',
      createdBy: adminUser._id,
    });

    // Register student 1 for hackathon
    await EventRegistration.create({
      event: hackathon._id,
      student: studentProfile1._id,
      status: 'REGISTERED',
    });

    // 12. Create Companies & Placement Drives
    console.log('💼 Creating placement companies & drives...');
    const google = await Company.create({
      name: 'Google LLC',
      website: 'https://careers.google.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      industry: 'Technology / Cloud / AI',
      contactPerson: 'Jessica Sterling',
      contactEmail: 'campus-recruiting@google.com',
      contactPhone: '+1 (800) 555-0199',
      address: '1600 Amphitheatre Pkwy, Mountain View, CA',
      description: 'Global technology leader organizing worldwide information.',
    });

    const microsoft = await Company.create({
      name: 'Microsoft Corporation',
      website: 'https://careers.microsoft.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
      industry: 'Software / Cloud Systems',
      contactPerson: 'David Miller',
      contactEmail: 'university-hiring@microsoft.com',
      contactPhone: '+1 (800) 555-0144',
      address: 'One Microsoft Way, Redmond, WA',
      description: 'Empowering every person and organization on the planet to achieve more.',
    });

    const amazon = await Company.create({
      name: 'Amazon AWS',
      website: 'https://amazon.jobs',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      industry: 'E-commerce / Cloud Services',
      contactPerson: 'Rachel Adams',
      contactEmail: 'aws-campus@amazon.com',
      address: '410 Terry Ave N, Seattle, WA',
      description: 'Earth’s most customer-centric company.',
    });

    const googleDrive = await PlacementDrive.create({
      company: google._id,
      title: 'Software Development Engineer I (Full-Stack & Cloud)',
      role: 'SDE-I',
      jobDescription: 'Build high-scale distributed backend systems, low-latency microservices and modern frontend applications.',
      packageLPA: 24.5,
      location: 'Bangalore / Hyderabad / Remote',
      eligibilityCriteria: {
        minCgpa: 8.0,
        allowedDepartments: [cseDept._id, itDept._id],
        maxBacklogs: 0,
        graduatingYear: 2026,
      },
      driveDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      venue: 'Campus Placement Center / Google Meet',
      status: 'ACTIVE',
      createdBy: placementOfficerUser._id,
    });

    const msftDrive = await PlacementDrive.create({
      company: microsoft._id,
      title: 'Cloud Solutions & Systems Engineer',
      role: 'Cloud Engineer',
      jobDescription: 'Design Azure infrastructure, automate Kubernetes pipelines and architect fault-tolerant distributed solutions.',
      packageLPA: 21.0,
      location: 'Hyderabad / Noida',
      eligibilityCriteria: {
        minCgpa: 7.5,
        allowedDepartments: [cseDept._id, itDept._id, eceDept._id],
        maxBacklogs: 0,
        graduatingYear: 2026,
      },
      driveDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      venue: 'Auditorium Hall 1',
      status: 'ACTIVE',
      createdBy: placementOfficerUser._id,
    });

    // Placement application for student 1
    await PlacementApplication.create({
      placementDrive: googleDrive._id,
      student: studentProfile1._id,
      resumeUrl: 'https://campusflow.edu/resumes/alex_rivera_sde_resume.pdf',
      status: 'TECHNICAL_ROUND',
      notes: 'Passed Online Coding Assessment with 100% test cases.',
      roundFeedback: [
        {
          roundName: 'Applied',
          status: 'Passed',
          feedback: 'Resume shortlisted based on CGPA and project portfolio.',
        },
        {
          roundName: 'Online Coding Assessment',
          status: 'Passed',
          feedback: 'Completed 3/3 algorithmic problems in 45 mins.',
        },
      ],
    });

    // 13. Create Internships
    console.log('🚀 Creating internship postings...');
    await Internship.create({
      title: 'Full-Stack React & Node.js Developer Intern',
      company: 'Stripe India Engineering',
      role: 'Software Engineering Intern',
      location: 'Bengaluru (Hybrid)',
      duration: '6 Months',
      stipend: '₹60,000/month',
      startDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 220 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      description: 'Work with core payment processing and dashboard UX engineering teams building high-throughput financial infrastructure.',
      skillsRequired: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Redis'],
      postedBy: placementOfficerUser._id,
      status: 'OPEN',
      applicants: [
        {
          student: studentProfile1._id,
          appliedAt: new Date(),
          status: 'SHORTLISTED',
        },
      ],
    });

    await Internship.create({
      title: 'Machine Learning & Computer Vision Research Intern',
      company: 'Adobe Systems Research',
      role: 'Research Intern',
      location: 'Noida (On-site)',
      duration: '3 Months',
      stipend: '₹75,000/month',
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      description: 'Innovate on generative AI image editing models, diffusion models, and edge device model quantization.',
      skillsRequired: ['Python', 'PyTorch', 'Computer Vision', 'Deep Learning'],
      postedBy: placementOfficerUser._id,
      status: 'OPEN',
    });

    // 14. Create Grievance Complaints & Certificate Requests
    console.log('📌 Creating complaints and certificate requests...');
    await Complaint.create({
      student: studentProfile1._id,
      category: 'Infrastructure',
      title: 'Projector HDMI port flickering in Lab IT-302',
      description: 'The multimedia projector frequently drops video signal during database lab demonstrations.',
      assignedDepartment: itDept._id,
      priority: 'MEDIUM',
      status: 'In Progress',
      resolutionNotes: 'IT maintenance engineer dispatched with replacement cabling.',
    });

    await CertificateRequest.create({
      student: studentProfile1._id,
      certificateType: 'Bonafide Certificate',
      reason: 'Application for Government Merit Scholarship Scheme 2026',
      status: 'APPROVED',
      certificateNumber: 'CERT-2026-8891',
      processedBy: adminUser._id,
      processedAt: new Date(),
    });

    // 15. Create Announcements & Notifications
    console.log('📢 Creating announcements & notifications...');
    await Announcement.create({
      title: 'Mid-Semester Examination Schedule Published',
      description: 'The timetable for Mid-Semester Examinations (Spring 2026) has been published on the student portal. Please check examination halls and timings.',
      category: 'EXAM',
      audience: 'ALL',
      author: adminUser._id,
      isPinned: true,
    });

    await Announcement.create({
      title: 'Google & Microsoft Campus Placement Drive Registration Open',
      description: 'Eligible students of CSE, IT and ECE (CGPA >= 7.5, no active backlogs) must apply before the deadline.',
      category: 'PLACEMENT',
      audience: 'STUDENTS',
      author: placementOfficerUser._id,
      isPinned: true,
    });

    await Notification.create({
      recipient: studentUser._id,
      title: 'Assignment Due Reminder',
      message: 'Assignment "B-Tree & Indexing Optimization Lab" is due in 5 days.',
      type: 'ASSIGNMENT',
      link: `/assignments/${assign1._id}`,
    });

    await Notification.create({
      recipient: studentUser._id,
      title: 'Google SDE-I Placement Drive',
      message: 'Your application has progressed to Technical Round 1.',
      type: 'PLACEMENT',
      link: `/placements/${googleDrive._id}`,
    });

    await Notification.create({
      recipient: facultyUser._id,
      title: 'New Student Submission',
      message: 'Alex Rivera submitted "REST API & Microservice Architecture".',
      type: 'ASSIGNMENT',
      link: `/assignments/${assign3._id}`,
    });

    console.log('✨ Seed database populated successfully!');
    console.log('----------------------------------------------------');
    console.log('DEMO LOGIN CREDENTIALS:');
    console.log('  Admin:            admin@campusflow.edu      / Admin@123');
    console.log('  Faculty:          faculty@campusflow.edu    / Faculty@123');
    console.log('  Student:          student@campusflow.edu    / Student@123');
    console.log('  Placement Officer:placement@campusflow.edu  / Placement@123');
    console.log('----------------------------------------------------');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
