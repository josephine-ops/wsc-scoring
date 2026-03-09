import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://snzgucatulndhysqznrp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrc3duaWdqc2t0dXF3a3JjbnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNzU5OTMsImV4cCI6MjA4ODY1MTk5M30.tizgWR5dX-MMvGmfoN1rqKEnqbCdrcL-cCCLZsSo40g";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
