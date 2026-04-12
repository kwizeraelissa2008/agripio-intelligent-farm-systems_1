-- ============================================================
-- AgriPio — Run this entire script in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- 1. farmer_works
CREATE TABLE IF NOT EXISTS public.farmer_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'other',
  description TEXT,
  created_date DATE,
  is_registered TEXT DEFAULT 'no',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.farmer_works ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own works" ON public.farmer_works;
CREATE POLICY "Users can manage own works" ON public.farmer_works FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2. learning_progress
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own progress" ON public.learning_progress;
CREATE POLICY "Users can manage own progress" ON public.learning_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. ip_pledges
CREATE TABLE IF NOT EXISTS public.ip_pledges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  statement TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.ip_pledges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone authenticated can read pledges" ON public.ip_pledges;
DROP POLICY IF EXISTS "Users can create own pledge" ON public.ip_pledges;
DROP POLICY IF EXISTS "Users can delete own pledge" ON public.ip_pledges;
CREATE POLICY "Anyone authenticated can read pledges" ON public.ip_pledges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create own pledge" ON public.ip_pledges FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own pledge" ON public.ip_pledges FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 4. quiz_questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT,
  category TEXT
);
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone authenticated can read quiz questions" ON public.quiz_questions;
CREATE POLICY "Anyone authenticated can read quiz questions" ON public.quiz_questions FOR SELECT TO authenticated USING (true);

-- 5. quiz_attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.quiz_questions(id),
  selected_index INTEGER,
  is_correct BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Anyone can read quiz attempts for leaderboard" ON public.quiz_attempts;
CREATE POLICY "Users can manage own quiz attempts" ON public.quiz_attempts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can read quiz attempts for leaderboard" ON public.quiz_attempts FOR SELECT TO authenticated USING (true);

-- 6. scenarios
CREATE TABLE IF NOT EXISTS public.scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT
);
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone authenticated can read scenarios" ON public.scenarios;
CREATE POLICY "Anyone authenticated can read scenarios" ON public.scenarios FOR SELECT TO authenticated USING (true);

-- 7. scenario_attempts
CREATE TABLE IF NOT EXISTS public.scenario_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scenario_id UUID REFERENCES public.scenarios(id),
  selected_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.scenario_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own scenario attempts" ON public.scenario_attempts;
DROP POLICY IF EXISTS "Anyone can read scenario attempts for leaderboard" ON public.scenario_attempts;
CREATE POLICY "Users can manage own scenario attempts" ON public.scenario_attempts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can read scenario attempts for leaderboard" ON public.scenario_attempts FOR SELECT TO authenticated USING (true);

-- 8. club_sessions
CREATE TABLE IF NOT EXISTS public.club_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  session_date DATE NOT NULL,
  description TEXT,
  debate_proposition TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.club_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone authenticated can read sessions" ON public.club_sessions;
DROP POLICY IF EXISTS "Authenticated users can create sessions" ON public.club_sessions;
CREATE POLICY "Anyone authenticated can read sessions" ON public.club_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create sessions" ON public.club_sessions FOR INSERT TO authenticated WITH CHECK (true);

-- 9. session_attendance
CREATE TABLE IF NOT EXISTS public.session_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.club_sessions(id),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);
ALTER TABLE public.session_attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own attendance" ON public.session_attendance;
DROP POLICY IF EXISTS "Anyone can read attendance" ON public.session_attendance;
CREATE POLICY "Users can manage own attendance" ON public.session_attendance FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can read attendance" ON public.session_attendance FOR SELECT TO authenticated USING (true);

-- 10. debate_posts
CREATE TABLE IF NOT EXISTS public.debate_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.club_sessions(id),
  proposition TEXT,
  position TEXT,
  argument_text TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.debate_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone authenticated can read debate posts" ON public.debate_posts;
DROP POLICY IF EXISTS "Users can create debate posts" ON public.debate_posts;
CREATE POLICY "Anyone authenticated can read debate posts" ON public.debate_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create debate posts" ON public.debate_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SEED: Quiz questions (20)
-- ============================================================
INSERT INTO public.quiz_questions (question, options, correct_index, explanation, category) VALUES
('Under Rwanda Law No. 31/2009, when does copyright begin?',
 '["When you register with RDB","When you publish your work","The moment you create and express an original work","When a lawyer approves it"]',
 2,'Copyright is automatic at creation. Registration at RDB is voluntary.','copyright'),
('A farmer writes a detailed guide about her irrigation method. Is it protected by copyright?',
 '["No, farming knowledge cannot be copyrighted","Yes, it is a literary work protected by copyright","Only if she registers it first","Only if published in a book"]',
 1,'Written guides are literary works protected automatically.','copyright'),
('What are related rights also known as?',
 '["Extra rights","Neighbouring rights","Secondary rights","Moral rights"]',
 1,'Related rights (neighbouring rights) protect performers, producers, and broadcasters.','related_rights'),
('How long does copyright last in Rwanda after the author''s death?',
 '["25 years","50 years","70 years","Forever"]',
 1,'Rwanda Law No. 31/2009 Article 228: life of author plus 50 years.','copyright'),
('Which body handles copyright registration in Rwanda?',
 '["ARIPO directly","Rwanda Development Board (RDB)","The Ministry of Agriculture","WIPO Geneva"]',
 1,'RDB manages IP registration in Rwanda. Registration is voluntary.','registration'),
('Are computer programs protected by copyright in Rwanda?',
 '["No, software is not creative enough","Yes, as literary works under Article 5","Only if the company registers them","Only commercial software"]',
 1,'Rwanda Law No. 31/2009 Article 5 explicitly protects computer programs.','copyright'),
('If a cooperative records a farmer training session, who holds related rights?',
 '["No one — it was informal","The farmers who spoke","The cooperative as producer of the recording","The Rwanda government"]',
 2,'The cooperative as producer holds related rights for 50 years.','related_rights'),
('Can someone use a farmer''s photo in their business without permission?',
 '["Yes, if posted online","Yes, for educational use","No — the farmer owns copyright and must give permission","Yes, photos of nature are not protected"]',
 2,'Photographs are artistic works. Permission is required.','copyright'),
('What does the ARIPO Kampala Protocol 2021 cover?',
 '["Patent registration only","Voluntary registration of copyright and related rights","Trademark applications","Agricultural land rights"]',
 1,'The Kampala Protocol provides voluntary copyright registration across ARIPO member states.','registration'),
('What is NOT protected by copyright?',
 '["A written cultivation guide","A farming idea not yet written down","A farm photograph","A recorded training video"]',
 1,'Copyright protects expressions, not ideas.','copyright'),
('What is a Collective Management Organization (CMO)?',
 '["Sells IP rights for the government","Manages copyright and distributes royalties to rights holders","Registers patents for businesses","Issues farming licenses"]',
 1,'CMOs license works and distribute royalties to creators.','related_rights'),
('How long do related rights last under the WIPO WPPT 1996?',
 '["25 years","50 years from end of year of performance","70 years","Forever"]',
 1,'WIPO WPPT 1996 sets a minimum of 50 years for related rights.','related_rights'),
('If a farmer posts their guide on WhatsApp, do they lose copyright?',
 '["Yes, public posting means public domain","Yes, WhatsApp own it now","No, copyright is retained regardless of where it is posted","Only if more than 1000 people see it"]',
 2,'Public posting does not transfer copyright.','copyright'),
('What are moral rights in copyright?',
 '["The right to make money from your work","The right to claim authorship and object to harmful changes","The right to vote on IP law","The right to use others'' work for free"]',
 1,'Moral rights include authorship claim and objection to harmful modifications.','copyright'),
('Rwanda became an ARIPO member state in which year?',
 '["2000","2005","2010","2015"]',
 2,'Rwanda became the 18th ARIPO member state on March 24, 2010.','aripo'),
('ARIPO was established under which agreement?',
 '["The Harare Agreement","The Lusaka Agreement","The Kampala Agreement","The Kigali Agreement"]',
 1,'ARIPO was established under the Lusaka Agreement, December 9, 1976.','aripo'),
('What is the 2025 ARIPO IP Club competition theme?',
 '["Innovation and Technology in Africa","Intellectual Property and the Creative Industries: a perfect tool for development","Copyright for the Digital Age","Trademarks and African Business"]',
 1,'Theme: Intellectual Property and the Creative Industries: a perfect tool for development.','theme'),
('Agriculture is part of the creative industries when farmers do what?',
 '["Sell crops at market","Create original guides, videos, and training materials about farming","Use fertilizer","Own more than 5 hectares"]',
 1,'Agriculture connects to creative industries through original content creation.','creative_economy'),
('What should a farmer do first if someone copies their guide without permission?',
 '["Do nothing","Contact the infringer and ask them to stop, then report to RDB if they refuse","Immediately go to court","Post about it on social media"]',
 1,'Contact the infringer first, then report to RDB if they refuse.','enforcement'),
('What makes AgriPio itself a copyrighted work?',
 '["It is registered with a government agency","Its source code is a computer program — a literary work under Rwanda Law No. 31/2009 Article 5","It has a logo","It has many users"]',
 1,'AgriPio source code, UI, content, and AI persona are all protected from creation.','copyright')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: Scenarios (5)
-- ============================================================
INSERT INTO public.scenarios (story_text, options, correct_index, explanation) VALUES
('Amina photographed her unique drip irrigation setup and shared it on WhatsApp. Her neighbour used it in his business flyer without asking. What should Amina do?',
 '["Do nothing","Just ask him to remove it politely","Report to RDB and formally request takedown","Copy his work in return"]',
 2,'Amina''s photo is protected. She can demand removal and file with RDB.'),
('Jean wrote a 10-page composting guide. A farming NGO wants to print 500 copies for free. What must the NGO do first?',
 '["Nothing — educational use is always free","Get written permission from Jean first","Pay a government printing fee","Only ask if they plan to sell the copies"]',
 1,'Jean''s guide is copyrighted. Permission is required regardless of whether it is sold.'),
('A radio station wants to rebroadcast audio from a cooperative''s recorded training session. Who must give permission?',
 '["No one — recordings are public once made","The farmers who spoke","The cooperative as producer of the recording","The Rwanda government"]',
 2,'The cooperative holds related rights as producer. The radio station needs their permission.'),
('Claudine created a seed planting calendar with hand-drawn illustrations. A website is selling copies without her knowledge. What can she do?',
 '["Nothing, it is already online so it is public","Contact the website and demand they stop selling","Only act if she had registered with RDB first","Give it away for free so no one profits"]',
 1,'Claudine owns copyright from creation. She can legally demand the website stop.'),
('A student club wants to use a farmer''s educational video in their school presentation. The farmer posted it publicly on YouTube. Do they need permission?',
 '["No, YouTube videos are public domain","No, school use is always allowed","Yes, they should ask the farmer for permission first","Only if the video has a copyright symbol"]',
 2,'Public posting does not mean public domain. Ask for permission before use.')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: Club sessions (3)
-- ============================================================
INSERT INTO public.club_sessions (title, session_date, description, debate_proposition)
SELECT 'Session 1: Introduction to Copyright', CURRENT_DATE - INTERVAL '21 days',
  'Introduction to copyright and related rights. What works can farmers protect?',
  'Copyright protection helps Rwandan farmers more than it restricts them.'
WHERE NOT EXISTS (SELECT 1 FROM public.club_sessions WHERE title = 'Session 1: Introduction to Copyright');

INSERT INTO public.club_sessions (title, session_date, description, debate_proposition)
SELECT 'Session 2: Related Rights and Cooperatives', CURRENT_DATE - INTERVAL '14 days',
  'How do related rights protect performers and producers? Cooperative recording rights.',
  'Cooperatives should automatically own related rights in all recordings they produce.'
WHERE NOT EXISTS (SELECT 1 FROM public.club_sessions WHERE title = 'Session 2: Related Rights and Cooperatives');

INSERT INTO public.club_sessions (title, session_date, description, debate_proposition)
SELECT 'Session 3: IP and the Creative Economy', CURRENT_DATE - INTERVAL '7 days',
  'Agriculture as a creative industry. How IP protection drives economic development.',
  'Software platforms like AgriPio are more effective than traditional methods for teaching IP in Africa.'
WHERE NOT EXISTS (SELECT 1 FROM public.club_sessions WHERE title = 'Session 3: IP and the Creative Economy');
