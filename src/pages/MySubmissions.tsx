import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Clock, Users, Flame, Calendar, CheckCircle, XCircle, Clock3, Trash2, Eye, Plus } from "lucide-react";
import { fetchMySubmissions, deleteSubmission } from "../redux/slices/submissionSlice";
import type { RootState, AppDispatch } from "../redux/store";
import toast from "react-hot-toast";

const MySubmissions: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { mySubmissions, loading } = useSelector((state: RootState) => state.submissions);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

    useEffect(() => {
        dispatch(fetchMySubmissions());
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Bạn có chắc muốn xóa đề xuất này?")) {
            try {
                await dispatch(deleteSubmission(id)).unwrap();
                toast.success("Đã xóa đề xuất thành công");
            } catch (error) {
                toast.error("Lỗi khi xóa đề xuất");
            }
        }
    };

    const filteredSubmissions = mySubmissions.filter((sub) => {
        if (filter === "all") return true;
        return sub.status === filter;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock3 className="w-5 h-5 text-yellow-500" />;
            case "approved":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "rejected":
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending":
                return "Đang chờ duyệt";
            case "approved":
                return "Đã duyệt";
            case "rejected":
                return "Bị từ chối";
            default:
                return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "approved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const pendingCount = mySubmissions.filter((sub) => sub.status === "pending").length;
    const approvedCount = mySubmissions.filter((sub) => sub.status === "approved").length;
    const rejectedCount = mySubmissions.filter((sub) => sub.status === "rejected").length;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 Đề Xuất Của Tôi</h1>
                        <p className="text-gray-600">Quản lý các đề xuất công thức của bạn</p>
                    </div>
                    <button
                        onClick={() => navigate("/my-suggest-recipe")}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Đề Xuất Món Mới
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Tất cả</p>
                                <p className="text-2xl font-bold">{mySubmissions.length}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Chờ duyệt</p>
                                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <Clock3 className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Đã duyệt</p>
                                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Bị từ chối</p>
                                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-full">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="flex border-b overflow-x-auto">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-6 py-3 font-medium transition-colors ${
                                filter === "all"
                                    ? "border-b-2 border-orange-500 text-orange-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Tất cả ({mySubmissions.length})
                        </button>
                        <button
                            onClick={() => setFilter("pending")}
                            className={`px-6 py-3 font-medium transition-colors ${
                                filter === "pending"
                                    ? "border-b-2 border-orange-500 text-orange-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Chờ duyệt ({pendingCount})
                        </button>
                        <button
                            onClick={() => setFilter("approved")}
                            className={`px-6 py-3 font-medium transition-colors ${
                                filter === "approved"
                                    ? "border-b-2 border-orange-500 text-orange-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Đã duyệt ({approvedCount})
                        </button>
                        <button
                            onClick={() => setFilter("rejected")}
                            className={`px-6 py-3 font-medium transition-colors ${
                                filter === "rejected"
                                    ? "border-b-2 border-orange-500 text-orange-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Bị từ chối ({rejectedCount})
                        </button>
                    </div>
                </div>

                {/* Submissions List */}
                <div className="space-y-4">
                    {filteredSubmissions.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <p className="text-gray-500 text-lg">Chưa có đề xuất nào</p>
                          
                        </div>
                    ) : (
                        filteredSubmissions.map((submission) => (
                            <div
                                key={submission._id}
                                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Image */}
                                    <div className="md:w-1/4 h-48 md:h-auto">
                                        <img
                                            src={submission.image}
                                            alt={submission.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {submission.name}
                                            </h3>
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                    submission.status
                                                )}`}
                                            >
                                                {getStatusIcon(submission.status)}
                                                <span className="ml-2">{getStatusText(submission.status)}</span>
                                            </span>
                                        </div>

                                        <p className="text-gray-600 mb-4 line-clamp-2">{submission.short}</p>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {submission.time} phút
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 mr-1" />
                                                {submission.size} người
                                            </div>
                                            <div className="flex items-center">
                                                <Flame className="w-4 h-4 mr-1" />
                                                {submission.calories} kcal
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {new Date(submission.createdAt).toLocaleDateString("vi-VN")}
                                            </div>
                                        </div>

                                        {/* Rejection Reason */}
                                        {submission.status === "rejected" && submission.rejectionReason && (
                                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-sm font-medium text-red-800">
                                                    ❌ Lý do từ chối:
                                                </p>
                                                <p className="text-sm text-red-700 mt-1">
                                                    {submission.rejectionReason}
                                                </p>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            {submission.status === "approved" && submission.recipeId && (
                                                <button
                                                    onClick={() => navigate(`/recipes/${submission.recipeId}`)}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Xem Công Thức
                                                </button>
                                            )}

                                            {submission.status === "pending" && (
                                                <button
                                                    onClick={() => handleDelete(submission._id)}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MySubmissions;
