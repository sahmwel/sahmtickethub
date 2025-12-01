'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";

export default function CreateOrganizer() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // now used
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!name || !email || !password) {
    toast.error("Name, Email, and Password are required");
    return;
  }

  setLoading(true);

  try {
    // Insert into Supabase organizers table
    const { error } = await supabase
      .from("organizers")
      .insert([{ name, email, password }]);

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Organizer created successfully!");
    router.push("/admin/organizers");
  } catch (err: unknown) {
    // Narrow the error type safely
    if (err instanceof Error) {
      toast.error(err.message);
    } else {
      toast.error("Something went wrong");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-lg">
        <h1 className="text-4xl font-black mb-8 text-gray-900">Create Organizer</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-xl mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-purple-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-xl mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-purple-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-xl mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-purple-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-xl hover:scale-105 transition shadow-2xl"
          >
            {loading ? "Creating..." : "Create Organizer"}
          </button>
        </form>
      </div>
    </div>
  );
}
