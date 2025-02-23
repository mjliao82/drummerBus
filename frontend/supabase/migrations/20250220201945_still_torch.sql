/*
  # Initial Schema Setup for MusicBus

  1. New Tables
    - users
      - Standard user information
      - Role-based access control
    - students
      - Student information
      - Can be linked to parent/guardian
    - lesson_packages
      - Available lesson packages
      - Pricing information
    - bookings
      - Lesson booking requests
      - Multiple students per booking
    - lesson_credits
      - Track remaining lessons
      - Handle billing cycles
    - payments
      - Payment history
      - Multiple payment methods
    - referrals
      - Track referral bonuses
      - Link referrer and referee
    - promotional_slots
      - Special time slots
      - Promotional pricing

  2. Security
    - Enable RLS on all tables
    - Policies for user access
    - Admin-only access for sensitive data
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'client',
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Students table
CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their students"
  ON students
  FOR SELECT
  TO authenticated
  USING (parent_id = auth.uid());

-- Lesson packages table
CREATE TABLE lesson_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  lessons_count integer NOT NULL,
  price decimal(10,2) NOT NULL,
  duration_minutes integer NOT NULL,
  is_trial boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lesson_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lesson packages"
  ON lesson_packages
  FOR SELECT
  TO authenticated
  USING (true);

-- Bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  requested_date date,
  requested_time text,
  duration_minutes integer NOT NULL,
  location text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Booking students junction table
CREATE TABLE booking_students (
  booking_id uuid REFERENCES bookings(id),
  student_id uuid REFERENCES students(id),
  PRIMARY KEY (booking_id, student_id)
);

ALTER TABLE booking_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their booking students"
  ON booking_students
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM bookings 
    WHERE bookings.id = booking_students.booking_id 
    AND bookings.user_id = auth.uid()
  ));

-- Lesson credits table
CREATE TABLE lesson_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  package_id uuid REFERENCES lesson_packages(id) NOT NULL,
  credits_remaining integer NOT NULL,
  expiry_date date,
  billing_hold boolean DEFAULT false,
  billing_hold_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lesson_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own credits"
  ON lesson_credits
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Payments table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  amount decimal(10,2) NOT NULL,
  payment_method text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  package_id uuid REFERENCES lesson_packages(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Referrals table
CREATE TABLE referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES users(id) NOT NULL,
  referee_id uuid REFERENCES users(id) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  bonus_credited boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  credited_at timestamptz
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own referrals"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referee_id = auth.uid());

-- Promotional slots table
CREATE TABLE promotional_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  time text NOT NULL,
  description text,
  special_price decimal(10,2),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE promotional_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active promotional slots"
  ON promotional_slots
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Insert default lesson packages
INSERT INTO lesson_packages (name, lessons_count, price, duration_minutes, is_trial) VALUES
  ('Single Trial Lesson', 1, 50.00, 30, true),
  ('4 Lesson Package', 4, 200.00, 30, false),
  ('8 Lesson Package', 8, 400.00, 30, false),
  ('16 Lesson Package', 16, 800.00, 30, false);