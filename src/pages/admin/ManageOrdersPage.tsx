import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/constants";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { Search, Check } from "lucide-react";
import "../admin/NewBorrowingPage";

interface BookOrder {
  id: string;
  name: string;
  bookname: string;
  dateborrowed: string;
  datetobereturned: string;
  status: string;
  daysRemaining?: number;
  isOverdue?: boolean;
}

const ManageOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<BookOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("dateborrowed");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/orders`);

      // Process orders to add calculated fields
      const processedOrders = response.data.map((order: BookOrder) => {
        const returnDate = new Date(order.datetobereturned);
        const today = new Date();
        const diffTime = returnDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          ...order,
          daysRemaining: diffDays,
          isOverdue:
            diffDays < 0 && order.status.toLowerCase() === "not returned",
        };
      });

      setOrders(processedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load borrowing records. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const markAsReturned = async (orderId: string) => {
    try {
      await axios.patch(`${API_URL}/admin/orders/${orderId}`, {
        status: "Returned",
      });

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, status: "Returned", isOverdue: false }
            : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.bookname.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "overdue"
        ? order.isOverdue
        : order.status.toLowerCase() === selectedStatus.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "daysRemaining") {
      return sortOrder === "asc"
        ? (a.daysRemaining || 0) - (b.daysRemaining || 0)
        : (b.daysRemaining || 0) - (a.daysRemaining || 0);
    }

    if (sortBy === "dateborrowed" || sortBy === "datetobereturned") {
      const dateA = new Date(a[sortBy]);
      const dateB = new Date(b[sortBy]);
      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    const aValue = a[sortBy as keyof BookOrder];
    const bValue = b[sortBy as keyof BookOrder];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        Manage Borrowing Records
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/admin/newborrowing")} // Changed from "../admin/newborrowing" to "/admin/newborrowing"
            className="btn-primary"
          >
            + New Borrowing
          </button>
        </div>
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name or book title..."
                className="input pl-10"
              />
            </div>
            <div className="flex">
              <button type="submit" className="btn-primary flex-shrink-0">
                Search
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input"
              >
                <option value="all">All Records</option>
                <option value="returned">Returned</option>
                <option value="not returned">Not Returned</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="sortBy"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sort By
              </label>
              <select
                id="sortBy"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [col, order] = e.target.value.split("-");
                  setSortBy(col);
                  setSortOrder(order as "asc" | "desc");
                }}
                className="input"
              >
                <option value="dateborrowed-desc">
                  Date Borrowed (Newest)
                </option>
                <option value="dateborrowed-asc">Date Borrowed (Oldest)</option>
                <option value="datetobereturned-asc">
                  Return Date (Soonest)
                </option>
                <option value="datetobereturned-desc">
                  Return Date (Latest)
                </option>
                <option value="daysRemaining-asc">
                  Days Remaining (Fewest)
                </option>
                <option value="name-asc">Student Name (A-Z)</option>
                <option value="bookname-asc">Book Title (A-Z)</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-error-600 mb-4">{error}</p>
          <button onClick={fetchOrders} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Student {getSortIcon("name")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("bookname")}
                  >
                    Book {getSortIcon("bookname")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("dateborrowed")}
                  >
                    Borrowed {getSortIcon("dateborrowed")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("datetobereturned")}
                  >
                    Return By {getSortIcon("datetobereturned")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("daysRemaining")}
                  >
                    Status {getSortIcon("daysRemaining")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No borrowing records found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  sortedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className={
                        order.isOverdue
                          ? "bg-error-50 hover:bg-error-100"
                          : "hover:bg-gray-50"
                      }
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.bookname}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.dateborrowed)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.datetobereturned)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {order.status.toLowerCase() === "returned" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-50 text-success-700">
                            Returned
                          </span>
                        ) : order.isOverdue ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-50 text-error-700">
                            Overdue by {Math.abs(order.daysRemaining || 0)} days
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-50 text-accent-700">
                            {order.daysRemaining} days remaining
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {order.status.toLowerCase() !== "returned" && (
                          <button
                            onClick={() => markAsReturned(order.id)}
                            className="text-success-700 hover:text-success-900 flex items-center justify-end gap-1"
                          >
                            <Check className="h-4 w-4" />
                            <span>Mark Returned</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrdersPage;
