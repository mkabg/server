import { supabase } from "../db/playersDB.js";
export async function getPlayerByUsernameFromDB(username) {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) throw new Error(error.message);
  console.log("Fetched from DB:", data);

  return data;
}
