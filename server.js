
import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY. Check your environment variables.');
  process.exit(1);
}

const app = express();
const port = Number(process.env.PORT) || 3000;
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

app.use(express.json({ limit: '20kb' }));

app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false
}));

// Serve website files from the public folder
app.use(express.static('public'));

// Homepage route: open home.html at the root URL
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/public/home.html');
});

// API health check
app.get('/api/health', (_req, res) => {
  res.json({ message: 'Hari Om admission API is running.' });
});

const text = (value, max = 200) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

// Admission form API
app.post('/api/admissions', async (req, res) => {
  try {
    const b = req.body ?? {};

    const application = {
      student_name: text(b.studentName, 120),
      date_of_birth: text(b.dob, 10),
      gender: text(b.gender, 10).toLowerCase(),
      class_applying_for: text(b.classApplyingFor, 20),
      father_name: text(b.fatherName, 120),
      mother_name: text(b.motherName, 120),
      phone: text(b.phone, 10),
      email: text(b.email, 254).toLowerCase() || null,
      address: text(b.address, 1000),
      city: text(b.city, 100),
      state: text(b.state, 100),
      pincode: text(b.pincode, 6),
      previous_school: text(b.previousSchool, 200) || null,
      previous_class: text(b.previousClass, 50) || null,
      declaration_accepted: b.agreement === true
    };

    const classOptions = [
      'Nursery', 'LKG', 'UKG',
      '1st', '2nd', '3rd', '4th', '5th', '6th',
      '7th', '8th', '9th', '10th', '11th', '12th'
    ];

    const dateLooksValid =
      /^\d{4}-\d{2}-\d{2}$/.test(application.date_of_birth) &&
      !Number.isNaN(Date.parse(application.date_of_birth));

    if (
      application.student_name.length < 2 ||
      !dateLooksValid ||
      !['male', 'female', 'other'].includes(application.gender) ||
      !classOptions.includes(application.class_applying_for) ||
      application.father_name.length < 2 ||
      application.mother_name.length < 2 ||
      !/^\d{10}$/.test(application.phone) ||
      !application.address ||
      !application.city ||
      !application.state ||
      !/^\d{6}$/.test(application.pincode) ||
      !application.declaration_accepted ||
      (application.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email))
    ) {
      return res.status(400).json({
        error: 'Please check the required fields and try again.'
      });
    }

    const { data, error } = await supabase
      .from('admission_applications')
      .insert(application)
      .select('id, created_at')
      .single();

    if (error) {
      console.error('Supabase insert error:', error.message);

      return res.status(500).json({
        error: 'Application could not be saved. Please try again later.'
      });
    }

    return res.status(201).json({
      message: 'Admission application saved successfully.',
      applicationId: data.id,
      createdAt: data.created_at
    });

  } catch (error) {
    console.error('Unexpected admission API error:', error.message);

    return res.status(500).json({
      error: 'Unexpected server error. Please try again later.'
    });
  }
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
