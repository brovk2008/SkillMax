-- ============================================================================
-- SkillMax Protocol — Supabase Auto Keep-Alive Database Function
-- Prevents Supabase project pausing/deletion during long inactivity periods
-- ============================================================================

CREATE OR REPLACE FUNCTION public.keep_alive_ping()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    profile_count integer;
BEGIN
    SELECT count(*) INTO profile_count FROM public.profiles;
    RETURN jsonb_build_object(
        'status', 'alive',
        'profiles_count', profile_count,
        'pinged_at', now()
    );
END;
$$;

-- Grant execution to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.keep_alive_ping() TO anon, authenticated, service_role;
