import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ckswnigjsktuqwkrcnrp.supabase.co";
const SUPABASE_KEY = "sb_publishable_syuYd1_YoThDW6_MDInMEA_241tgA5D";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
