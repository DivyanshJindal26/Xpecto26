"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconLoader2,
  IconCheck,
  IconX,
  IconClock,
  IconCreditCard,
  IconSearch,
  IconFilter,
  IconDownload,
  IconEye,
  IconRefresh,
  IconAlertCircle,
} from "@tabler/icons-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVerified, setFilterVerified] = useState("all");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/leads`, {
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setLeads(result.leads);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/stats`, {
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setStats(result);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleUpdateLead = async (leadId, updates) => {
    try {
      setUpdating(true);
      const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      const result = await response.json();
      if (result.success) {
        await fetchLeads();
        await fetchStats();
        setShowModal(false);
        alert("Lead updated successfully");
      } else {
        alert(result.message || "Failed to update lead");
      }
    } catch (error) {
      console.error("Failed to update lead:", error);
      alert("Failed to update lead");
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickApprove = async (lead) => {
    if (!confirm(`Approve payment for ${lead.name}?`)) return;
    await handleUpdateLead(lead._id, {
      paymentStatus: "completed",
      paymentVerified: true,
    });
  };

  const handleQuickDeny = async (lead) => {
    if (!confirm(`Mark payment as failed for ${lead.name}?`)) return;
    await handleUpdateLead(lead._id, {
      paymentStatus: "failed",
      paymentVerified: false,
    });
  };

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || lead.paymentStatus === filterStatus;

    const matchesVerified =
      filterVerified === "all" ||
      (filterVerified === "verified" && lead.paymentVerified) ||
      (filterVerified === "unverified" && !lead.paymentVerified);

    return matchesSearch && matchesStatus && matchesVerified;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-500/10 border-green-500/30";
      case "pending":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "failed":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "refunded":
        return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      default:
        return "text-white/60 bg-white/5 border-white/10";
    }
  };

  const escapeCSV = (value) => {
    if (value == null) return "";
    const stringValue = String(value);
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "College",
      "Pass Type",
      "Amount",
      "Payment Status",
      "Verified",
      "Transaction ID",
      "Created At",
      "Notes",
    ];

    const rows = filteredLeads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone || "",
      lead.collegeName || "",
      lead.passType,
      lead.amount,
      lead.paymentStatus,
      lead.paymentVerified ? "Yes" : "No",
      lead.transactionId || "",
      new Date(lead.createdAt).toLocaleString(),
      lead.notes || "",
    ]);

    const csv = [headers, ...rows].map((row) => row.map(escapeCSV).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Leads"
            value={stats.totalLeads}
            icon={IconUsers}
            color="blue"
          />
          <StatCard
            title="Verified"
            value={stats.verifiedLeads}
            icon={IconCheck}
            color="green"
          />
          <StatCard
            title="Pending"
            value={
              stats.stats.find((s) => s._id === "pending")?.count || 0
            }
            icon={IconClock}
            color="yellow"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${stats.stats.reduce((acc, s) => acc + s.totalAmount, 0).toLocaleString()}`}
            icon={IconCreditCard}
            color="orange"
          />
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search by name, email, phone, transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500/50"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Verified Filter */}
          <select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500/50"
          >
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>

          {/* Action Buttons */}
          <button
            onClick={exportToCSV}
            className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-lg px-4 py-2.5 text-white transition-colors flex items-center gap-2"
          >
            <IconDownload className="w-5 h-5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => {
              fetchLeads();
              fetchStats();
            }}
            className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-lg px-4 py-2.5 text-white transition-colors flex items-center gap-2"
          >
            <IconRefresh className="w-5 h-5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        <div className="mt-3 text-sm text-white/60">
          Showing {filteredLeads.length} of {leads.length} leads
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.03] border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/80">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/80">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/80">
                  Pass Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/80">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/80">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/80">
                  Verified
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/80">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-white/80">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center text-white/60"
                  >
                    No leads found
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-white">
                      {lead.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-white/80">
                      {lead.email}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          lead.passType === "early_bird"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                            : "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                        }`}
                      >
                        {lead.passType === "early_bird"
                          ? "Early Bird"
                          : "Regular"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-medium">
                      ₹{lead.amount}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                          lead.paymentStatus
                        )}`}
                      >
                        {lead.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {lead.paymentVerified ? (
                        <IconCheck className="w-5 h-5 text-green-400" />
                      ) : (
                        <IconX className="w-5 h-5 text-white/40" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-white/60">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(lead)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <IconEye className="w-4 h-4" />
                        </button>
                        {!lead.paymentVerified && (
                          <>
                            <button
                              onClick={() => handleQuickApprove(lead)}
                              className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <IconCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleQuickDeny(lead)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Deny"
                            >
                              <IconX className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details Modal */}
      <AnimatePresence>
        {showModal && selectedLead && (
          <LeadDetailsModal
            lead={selectedLead}
            onClose={() => {
              setShowModal(false);
              setSelectedLead(null);
            }}
            onUpdate={handleUpdateLead}
            updating={updating}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    green:
      "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400",
    yellow:
      "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400",
    orange:
      "from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/60 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <Icon className="w-8 h-8 opacity-50" />
      </div>
    </div>
  );
}

function LeadDetailsModal({ lead, onClose, onUpdate, updating }) {
  const [formData, setFormData] = useState({
    paymentStatus: lead.paymentStatus,
    paymentVerified: lead.paymentVerified,
    transactionId: lead.transactionId || "",
    notes: lead.notes || "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpecto.org/api";

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(lead._id, formData);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0a0a0f] border border-white/10 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white">Lead Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <IconX className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Information */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-white/60 mb-3">
              User Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Name" value={lead.name} />
              <InfoItem label="Email" value={lead.email} />
              <InfoItem label="Phone" value={lead.phone || "N/A"} />
              <InfoItem label="College" value={lead.collegeName || "N/A"} />
              <InfoItem
                label="Pass Type"
                value={
                  lead.passType === "early_bird" ? "Early Bird" : "Regular"
                }
              />
              <InfoItem label="Amount" value={`₹${lead.amount}`} />
              <InfoItem
                label="Created At"
                value={new Date(lead.createdAt).toLocaleString()}
              />
              <InfoItem
                label="Updated At"
                value={new Date(lead.updatedAt).toLocaleString()}
              />
            </div>
          </div>

          {/* Payment Proof */}
          {lead.paymentProof && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-white/60 mb-3">
                Payment Proof
              </h4>
              <div className="rounded-lg border border-white/10 overflow-hidden">
                <img
                  src={`${API_BASE_URL}/leads/payment-proof/${lead.paymentProof}`}
                  alt="Payment Proof"
                  crossOrigin="use-credentials"
                  className="w-full h-auto max-h-96 object-contain bg-white/5"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}

          {/* Update Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="text-sm font-medium text-white/60 mb-3">
              Update Payment Status
            </h4>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Payment Status
              </label>
              <select
                value={formData.paymentStatus}
                onChange={(e) =>
                  setFormData({ ...formData, paymentStatus: e.target.value })
                }
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500/50"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Payment Verified */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="paymentVerified"
                checked={formData.paymentVerified}
                onChange={(e) =>
                  setFormData({ ...formData, paymentVerified: e.target.checked })
                }
                className="w-4 h-4 bg-white/[0.03] border-white/10 rounded focus:ring-orange-500 focus:ring-offset-0"
              />
              <label
                htmlFor="paymentVerified"
                className="text-sm font-medium text-white/80"
              >
                Payment Verified
              </label>
            </div>

            {/* Transaction ID */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Transaction ID
              </label>
              <input
                type="text"
                value={formData.transactionId}
                onChange={(e) =>
                  setFormData({ ...formData, transactionId: e.target.value })
                }
                placeholder="Enter transaction ID"
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Admin Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Add any notes..."
                rows={3}
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={updating}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <IconLoader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <IconCheck className="w-5 h-5" />
                    Update Lead
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-lg text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}

function IconUsers({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}
