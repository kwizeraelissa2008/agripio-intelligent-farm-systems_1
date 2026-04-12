-- Fix ip_pledges: allow users to delete their own pledge (needed for upsert pattern)
CREATE POLICY IF NOT EXISTS "Users can delete own pledge" ON public.ip_pledges
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix farmer_works: ensure INSERT policy uses auth.uid()
-- (The FOR ALL policy already covers this, but be explicit)
-- No change needed — FOR ALL with auth.uid() = user_id covers INSERT/SELECT/UPDATE/DELETE

-- Fix learning_progress: ensure upsert works (needs INSERT + UPDATE)
-- FOR ALL policy already covers this

-- Fix session_attendance: allow SELECT for all authenticated
CREATE POLICY IF NOT EXISTS "Anyone can read attendance" ON public.session_attendance
  FOR SELECT TO authenticated USING (true);

-- Fix quiz_attempts: allow SELECT for leaderboard
CREATE POLICY IF NOT EXISTS "Anyone can read quiz attempts for leaderboard" ON public.quiz_attempts
  FOR SELECT TO authenticated USING (true);

-- Fix scenario_attempts: allow SELECT for leaderboard  
CREATE POLICY IF NOT EXISTS "Anyone can read scenario attempts for leaderboard" ON public.scenario_attempts
  FOR SELECT TO authenticated USING (true);
