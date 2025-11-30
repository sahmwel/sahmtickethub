'use client';

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CreditCard, Mail, User, Loader2, CheckCircle, Smartphone, Building2 } from "lucide-react";

// --- PAYSTACK TYPES ---
interface PaystackResponse {
  reference: string;
  status: string;
  message?: string;
  [key: string]: unknown;
}

interface PaystackHandler {
  openIframe: () => void;
}

interface PaystackOptions {
  key?: string;
  email: string;
  amount: number;
  channels?: string[];
  logo?: string;
  title?: string;
  metadata?: {
    custom_fields?: { display_name: string; variable_name: string; value: string | number }[];
  };
  reference: string;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

interface PaystackPop {
  setup: (options: PaystackOptions) => PaystackHandler;
}

declare global {
  interface Window {
    PaystackPop?: PaystackPop;
  }
}

export default function Checkout() {
  const router = useRouter();
  const { orderId } = useParams();
  const searchParams = useSearchParams();

  // Parse query params
  const eventIdStr = searchParams.get("event") || "";
  const ticketTypeStr = decodeURIComponent(searchParams.get("type") || "");
  const priceStr = decodeURIComponent(searchParams.get("price") || "0");
  const qty = parseInt(searchParams.get("qty") || "1", 10);
  const priceStrClean = priceStr.replace(/[^0-9]/g, "") || "0";

  const [orderIdStr] = useState(() => Array.isArray(orderId) ? orderId[0] : orderId || `ORD-${Date.now()}`);
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const cleanPrice = parseInt(priceStr.replace(/[^0-9]/g, "") || "0", 10);
  const totalAmount = cleanPrice * qty;

  const formattedTotal = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(totalAmount);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Load Paystack script
  useEffect(() => {
    if (!document.getElementById("paystack-script")) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.id = "paystack-script";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const payWithPaystack = () => {
  if (!window.PaystackPop) {
    alert("Paystack is not loaded yet. Try again.");
    setLoading(false);
    return;
  }

  // Async function to send the ticket via API
  const sendTicketEmail = async () => {
    try {
      await fetch('/api/send-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          orderId: orderIdStr,
          ticketDetails: {
            eventTitle: ticketTypeStr,
            ticketType: ticketTypeStr,
            tickets: qty,
            totalPaid: formattedTotal
          }
        })
      });
    } catch (err) {
      console.error("Failed to send ticket email", err);
    } finally {
      // Redirect to ticket page after sending
      router.push(
        `/bag/${orderIdStr}?event=${eventIdStr}&type=${encodeURIComponent(ticketTypeStr)}&price=${encodeURIComponent(priceStr)}&qty=${qty}`
      );
    }
  };

  // Set up Paystack payment
  const handler = window.PaystackPop.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_KEY!,
    email: formData.email || "customer@sahmtickethub.online",
    amount: totalAmount * 100,
    channels: ["card", "bank_transfer", "ussd", "mobile_money", "opay", "qr", "bank"],
    metadata: {
      custom_fields: [
        { display_name: "Event ID", variable_name: "event_id", value: eventIdStr },
        { display_name: "Ticket Type", variable_name: "ticket_type", value: ticketTypeStr },
        { display_name: "Quantity", variable_name: "quantity", value: qty },
        { display_name: "Customer Name", variable_name: "customer_name", value: formData.fullName },
        { display_name: "Phone", variable_name: "phone", value: formData.phone },
      ],
    },
    reference: orderIdStr,
    logo: "https://sahmtickethub.online/logo-white.png",
    
    callback: function(response) {
      console.log("Payment response:", response);
      void sendTicketEmail(); // Call async function
    },
    
    onClose: () => setLoading(false),
  });

  handler.openIframe();
};


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert("Please fill in all fields");
      return;
    }
    if (!formData.email.includes("@")) {
      alert("Enter a valid email");
      return;
    }

    setLoading(true);
    payWithPaystack();
  };

  if (!eventIdStr || !ticketTypeStr || !priceStr || totalAmount === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <p className="text-3xl font-black text-red-600 mb-6">Invalid Ticket</p>
          <Link href="/events" className="text-purple-600 font-bold text-xl underline">← Back to Events</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 pt-4 lg:pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900">Checkout</h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 mt-2">{ticketTypeStr}</p>
          <p className="text-lg text-gray-600 mt-1">Quantity: {qty}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl sm:text-3xl font-black mb-6 flex items-center gap-3">
                <User className="text-purple-600" /> Your Details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-3 text-lg font-bold text-gray-700 mb-2">
                    <User size={22} /> Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Chinedu Okonkwo"
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none text-lg transition"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-3 text-lg font-bold text-gray-700 mb-2">
                    <Mail size={22} /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="chinedu@example.com"
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none text-lg transition"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-3 text-lg font-bold text-gray-700 mb-2">
                    <Smartphone size={22} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08012345678"
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none text-lg transition"
                    required
                  />
                </div>

                {/* Payment Methods */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 sm:p-8 text-center">
                  <p className="text-lg font-bold text-gray-700 mb-4">Pay with any method</p>
                  <div className="grid grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-white p-4 rounded-2xl shadow-lg"> <CreditCard className="mx-auto mb-1 text-purple-600" size={32} />
                      <span className="text-sm font-black">Card</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-lg">
                      <Building2 className="mx-auto mb-1 text-purple-600" size={32} />
                      <span className="text-sm font-black">Bank</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-lg">
                      <Smartphone className="mx-auto mb-1 text-purple-600" size={32} />
                      <span className="text-sm font-black">USSD</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-purple-200">
                      <div className="w-10 h-10 mx-auto mb-2 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-xl">O</div>
                      <span className="text-sm font-black text-orange-600">OPAY</span>
                    </div>
                  </div>
                </div>

                {/* Pay Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-2xl py-4 sm:py-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all disabled:opacity-70 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>Opening Paystack <Loader2 className="animate-spin" size={28} /></>
                  ) : (
                    <>Pay {formattedTotal} Now <CreditCard size={28} /></>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 sticky top-24">
              <h2 className="text-2xl sm:text-3xl font-black mb-6">Order Summary</h2>
              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket</span>
                  <span className="font-black">{ticketTypeStr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-black">{qty} ticket{qty > 1 ? "s" : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit Price</span>
                  <span className="font-black">{priceStrClean}</span>
                </div>

                <div className="border-t-4 border-dashed border-purple-200 pt-4">
                  <div className="flex justify-between text-2xl sm:text-3xl font-black">
                    <span>Total</span>
                    <span className="text-purple-600">{formattedTotal}</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-3 text-base sm:text-lg">
                <div className="flex items-center gap-2"><CheckCircle size={20} className="text-green-500" /> Instant ticket delivery</div>
                <div className="flex items-center gap-2"><CheckCircle size={20} className="text-green-500" /> 100% secure via Paystack</div>
                <div className="flex items-center gap-2"><CheckCircle size={20} className="text-green-500" /> Verified events only</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}