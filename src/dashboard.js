import {createClient} from "@supabase/supabase-js"; import {createIcons,LogOut} from "lucide";
const supabase=createClient(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
async function protect(){const {data:{session}}=await supabase.auth.getSession();if(!session){location.href="/auth.html";return}const user=session.user,meta=user.user_metadata||{},name=meta.full_name||meta.name||user.email?.split("@")[0]||"Student";document.getElementById("welcomeTitle").textContent=`Welcome back, ${name} 👋`;document.getElementById("target").textContent=`🎯 Target: ${meta.exam||"Not set"}`}
document.getElementById("logout").addEventListener("click",async()=>{await supabase.auth.signOut();location.href="/auth.html"});createIcons({icons:{LogOut}});protect();
