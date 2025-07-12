-- Seed data for SkillSwap Platform

-- Insert sample skills
INSERT INTO skills (name, category) VALUES
('React', 'Technology'),
('Node.js', 'Technology'),
('Python', 'Technology'),
('JavaScript', 'Technology'),
('HTML/CSS', 'Technology'),
('UI/UX Design', 'Design'),
('Photoshop', 'Design'),
('Photography', 'Creative'),
('Video Editing', 'Creative'),
('Spanish', 'Language'),
('French', 'Language'),
('German', 'Language'),
('Guitar', 'Music'),
('Piano', 'Music'),
('Singing', 'Music'),
('Cooking', 'Lifestyle'),
('Baking', 'Lifestyle'),
('Yoga', 'Fitness'),
('Personal Training', 'Fitness'),
('Excel', 'Business'),
('Marketing', 'Business'),
('Accounting', 'Business'),
('Writing', 'Communication'),
('Public Speaking', 'Communication'),
('Translation', 'Language')
ON CONFLICT (name) DO NOTHING;

-- Insert sample users (passwords would be hashed in real implementation)
INSERT INTO users (name, email, password_hash, location, bio, is_public, rating, swaps_completed) VALUES
('Alice Smith', 'alice@example.com', '$2b$10$hashedpassword1', 'San Francisco, CA', 'Language teacher and tech enthusiast', true, 4.9, 15),
('Bob Johnson', 'bob@example.com', '$2b$10$hashedpassword2', 'Austin, TX', 'Musician and music producer', true, 4.7, 8),
('Carol Davis', 'carol@example.com', '$2b$10$hashedpassword3', 'New York, NY', 'Professional chef and food blogger', true, 4.8, 22),
('David Wilson', 'david@example.com', '$2b$10$hashedpassword4', 'Seattle, WA', 'Software developer and photographer', true, 4.6, 5),
('Emma Brown', 'emma@example.com', '$2b$10$hashedpassword5', 'Los Angeles, CA', 'Fitness instructor and wellness coach', true, 4.9, 18),
('Admin User', 'admin@skillswap.com', '$2b$10$hashedpassword6', 'Remote', 'Platform administrator', false, 5.0, 0)
ON CONFLICT (email) DO NOTHING;

-- Insert user skills offered
INSERT INTO user_skills_offered (user_id, skill_id, proficiency_level) VALUES
(1, (SELECT id FROM skills WHERE name = 'Spanish'), 'expert'),
(1, (SELECT id FROM skills WHERE name = 'French'), 'advanced'),
(1, (SELECT id FROM skills WHERE name = 'Translation'), 'expert'),
(2, (SELECT id FROM skills WHERE name = 'Guitar'), 'expert'),
(2, (SELECT id FROM skills WHERE name = 'Piano'), 'intermediate'),
(2, (SELECT id FROM skills WHERE name = 'Singing'), 'advanced'),
(3, (SELECT id FROM skills WHERE name = 'Cooking'), 'expert'),
(3, (SELECT id FROM skills WHERE name = 'Baking'), 'expert'),
(3, (SELECT id FROM skills WHERE name = 'Photography'), 'intermediate'),
(4, (SELECT id FROM skills WHERE name = 'React'), 'expert'),
(4, (SELECT id FROM skills WHERE name = 'Node.js'), 'advanced'),
(4, (SELECT id FROM skills WHERE name = 'Photography'), 'expert'),
(5, (SELECT id FROM skills WHERE name = 'Yoga'), 'expert'),
(5, (SELECT id FROM skills WHERE name = 'Personal Training'), 'expert'),
(5, (SELECT id FROM skills WHERE name = 'Public Speaking'), 'advanced')
ON CONFLICT (user_id, skill_id) DO NOTHING;

-- Insert user skills wanted
INSERT INTO user_skills_wanted (user_id, skill_id, priority_level) VALUES
(1, (SELECT id FROM skills WHERE name = 'React'), 'high'),
(1, (SELECT id FROM skills WHERE name = 'UI/UX Design'), 'medium'),
(2, (SELECT id FROM skills WHERE name = 'Photography'), 'high'),
(2, (SELECT id FROM skills WHERE name = 'Video Editing'), 'medium'),
(3, (SELECT id FROM skills WHERE name = 'JavaScript'), 'high'),
(3, (SELECT id FROM skills WHERE name = 'Marketing'), 'medium'),
(4, (SELECT id FROM skills WHERE name = 'Spanish'), 'high'),
(4, (SELECT id FROM skills WHERE name = 'Guitar'), 'low'),
(5, (SELECT id FROM skills WHERE name = 'Cooking'), 'medium'),
(5, (SELECT id FROM skills WHERE name = 'Photography'), 'high')
ON CONFLICT (user_id, skill_id) DO NOTHING;

-- Insert user availability
INSERT INTO user_availability (user_id, availability_type) VALUES
(1, 'weekends'),
(1, 'evenings'),
(2, 'flexible'),
(3, 'weekends'),
(4, 'evenings'),
(4, 'weekdays'),
(5, 'mornings'),
(5, 'weekends')
ON CONFLICT (user_id, availability_type) DO NOTHING;

-- Insert sample swap requests
INSERT INTO swap_requests (requester_id, target_id, skill_offered_id, skill_wanted_id, message, status) VALUES
(4, 1, (SELECT id FROM skills WHERE name = 'React'), (SELECT id FROM skills WHERE name = 'Spanish'), 'Hi Alice! I would love to learn Spanish from you in exchange for React lessons. I have 5+ years of experience with React.', 'pending'),
(1, 2, (SELECT id FROM skills WHERE name = 'Spanish'), (SELECT id FROM skills WHERE name = 'Guitar'), 'Hi Bob! Would you be interested in trading Spanish lessons for guitar lessons? I am a native speaker.', 'accepted'),
(3, 4, (SELECT id FROM skills WHERE name = 'Cooking'), (SELECT id FROM skills WHERE name = 'JavaScript'), 'Hi David! I can teach you professional cooking techniques in exchange for JavaScript tutoring.', 'pending'),
(5, 3, (SELECT id FROM skills WHERE name = 'Personal Training'), (SELECT id FROM skills WHERE name = 'Cooking'), 'Hi Carol! I would love to learn cooking from a professional chef. I can offer personal training sessions in return.', 'completed')
ON CONFLICT DO NOTHING;

-- Insert sample feedback for completed swaps
INSERT INTO swap_feedback (swap_request_id, reviewer_id, reviewee_id, rating, feedback) VALUES
(4, 5, 3, 5, 'Carol is an amazing chef! She taught me so many professional techniques. Highly recommend!'),
(4, 3, 5, 5, 'Emma is a fantastic trainer. Very knowledgeable and patient. Great experience!')
ON CONFLICT DO NOTHING;

-- Insert sample admin message
INSERT INTO admin_messages (title, content, message_type, created_by) VALUES
('Welcome to SkillSwap!', 'Welcome to our skill sharing platform. Start by creating your profile and listing your skills.', 'announcement', 6),
('Platform Maintenance', 'Scheduled maintenance this weekend from 2-4 AM EST. Platform may be temporarily unavailable.', 'maintenance', 6)
ON CONFLICT DO NOTHING;
