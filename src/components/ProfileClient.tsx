"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Settings, UserCircle, Phone, Save } from "lucide-react";
import { updateProfileAction } from "@/app/actions/profile";

export default function ProfileClient({ initialProfile, orders }: { initialProfile: any, orders: any[] }) {
  const [activeTab, setActiveTab] = useState<"history" | "settings">("history");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await updateProfileAction(formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update' });
    }
    
    setIsSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Profile Header */}
      <div className="flex items-center space-x-4 bg-white p-6 rounded-3xl border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <UserCircle className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-sora leading-tight">{initialProfile.full_name || 'Guest User'}</h2>
          <span className="inline-block mt-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-wider">
            {initialProfile.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 p-1 bg-gray-100 rounded-2xl">
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
            activeTab === 'history' ? 'bg-white shadow-sm text-[#f46919]' : 'text-gray-500 hover:bg-gray-200'
          }`}
        >
          <Package className="w-4 h-4 mr-2" />
          Order History
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
            activeTab === 'settings' ? 'bg-white shadow-sm text-[#f46919]' : 'text-gray-500 hover:bg-gray-200'
          }`}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          
          {/* ORDER HISTORY TAB */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {orders.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-gray-50 shadow-sm text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">No orders yet</h3>
                  <p className="text-gray-500 text-sm">When you place orders, they will appear here.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white p-5 rounded-3xl border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 group">
                    <div>
                      <h3 className="font-bold text-gray-900">Order #{order.id.slice(0,6).toUpperCase()}</h3>
                      <p className="text-sm text-gray-500 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-[#f46919]">${order.total.toFixed(2)}</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 
                        order.status === 'PENDING' ? 'bg-gray-100 text-gray-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-3xl border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
                
                {message && (
                  <div className={`p-4 rounded-xl font-medium text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      name="fullName"
                      defaultValue={initialProfile.full_name}
                      type="text" 
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#f46919] transition"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      name="phone"
                      defaultValue={initialProfile.phone_number}
                      type="tel" 
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#f46919] transition"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-[#f46919] text-white py-4 rounded-2xl font-bold text-lg shadow-md hover:bg-[#d65510] transition disabled:opacity-50 flex items-center justify-center mt-4"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
