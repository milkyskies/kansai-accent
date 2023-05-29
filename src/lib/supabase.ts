import { createClient } from "@supabase/supabase-js";
import type { Database } from "$lib/types/supabase";

const SUPABASE_URL = "https://guikyjhuhkasvqtfnmmt.supabase.co";
const SUPABASE_KEY =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1aWt5amh1aGthc3ZxdGZubW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQxOTY3MzMsImV4cCI6MTk4OTc3MjczM30.ysqq8JarsCLgLoAEHDMQav6dVh3sMmstVy6aUrp0i9k";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
