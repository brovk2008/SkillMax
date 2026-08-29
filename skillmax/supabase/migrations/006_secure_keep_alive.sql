-- Enable RLS on _keep_alive and add policies
ALTER TABLE public._keep_alive ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = '_keep_alive' AND policyname = 'Allow public read on keep_alive'
  ) THEN
    CREATE POLICY "Allow public read on keep_alive" ON public._keep_alive FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = '_keep_alive' AND policyname = 'Allow service role update on keep_alive'
  ) THEN
    CREATE POLICY "Allow service role update on keep_alive" ON public._keep_alive FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
