import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
    Clock, 
    Users, 
    Flame, 
    Calendar, 
    CheckCircle, 
    XCircle,
    Eye,
    Search,
    X
} from "lucide-react";
import {
    fetchAllSubmissions,
    fetchPendingCount,
    approveSubmission,
    rejectSubmission,
} from "../redux/slices/submissionSlice";
import { fetchRecipes } from "../redux/slices/recipeSlice";
import type { RootState, AppDispatch } from "../redux/store";
import type { Submission } from "../redux/slices/submissionSlice";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

const PendingRecipes: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { allSubmissions, loading } = useSelector((state: RootState) => state.submissions);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
    const [searchTerm, setSearchTerm] = useState("");
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        dispatch(fetchAllSubmissions(filter === "all" ? undefined : filter));
        dispatch(fetchPendingCount());
    }, [dispatch, filter]);

    const handleApprove = async (id: string) => {
        if (window.confirm("Bạn có chắc muốn duyệt đề xuất này?")) {
            try {
                await dispatch(approveSubmission(id)).unwrap();
                toast.success("✅ Đã duyệt đề xuất thành công!");
                // Refresh submissions list
                dispatch(fetchAllSubmissions(filter === "all" ? undefined : filter));
                dispatch(fetchPendingCount());
                // Refresh recipes list để hiển thị ở tab Công thức
                dispatch(fetchRecipes());
            } catch (error) {
                toast.error("❌ Lỗi khi duyệt đề xuất");
            }
        }
    };

    const handleRejectClick = (submission: Submission) => {
        setSelectedSubmission(submission);
        setRejectModalOpen(true);
    };

    const handleDetailClick = async (submission: Submission) => {
        setSelectedSubmission(submission);
        setDetailModalOpen(true);
        
        try {
            // Fetch ingredient details từ API riêng
            const response = await axiosInstance.get(`/ingredient-details/recipe/${submission._id}`);
            const ingredientDetails = response.data;
            
            // Map để có cấu trúc đúng với name
            const ingredientsWithDetails = ingredientDetails.map((detail: any) => ({
                ingredientId: detail.ingredientId._id || detail.ingredientId,
                name: detail.ingredientId.name || '',
                quantity: detail.quantity,
                unit: detail.unit
            }));
            
            // Update selectedSubmission với ingredientsWithDetails
            setSelectedSubmission({
                ...submission,
                ingredientsWithDetails
            });
        } catch (error) {
            // Nếu lỗi, vẫn giữ submission ban đầu
        }
    };

    const handleRejectSubmit = async () => {
        if (!selectedSubmission) return;
        
        if (!rejectionReason.trim()) {
            toast.error("Vui lòng nhập lý do từ chối");
            return;
        }

        try {
            await dispatch(
                rejectSubmission({
                    id: selectedSubmission._id,
                    reason: rejectionReason,
                })
            ).unwrap();
            toast.success("✅ Đã từ chối đề xuất");
            setRejectModalOpen(false);
            setRejectionReason("");
            setSelectedSubmission(null);
            dispatch(fetchAllSubmissions(filter === "all" ? undefined : filter));
            dispatch(fetchPendingCount());
        } catch (error) {
            toast.error("❌ Lỗi khi từ chối đề xuất");
        }
    };

    const filteredSubmissions = allSubmissions.filter((sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pendingCount = allSubmissions.filter((sub) => sub.status === "pending").length;

    if (loading && allSubmissions.length === 0) {
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        ⚡ Quản Lý Đề Xuất Món Ăn
                    </h1>
                    <p className="text-gray-600">
                        Xem xét và phê duyệt các đề xuất từ người dùng
                    </p>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow mb-6 p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên món ăn..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="flex border-b overflow-x-auto">
                        <button
                            onClick={() => setFilter("pending")}
                            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                                filter === "pending"
                                    ? "border-b-2 border-orange-500 text-orange-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Chờ duyệt ({pendingCount})
                        </button>
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                                filter === "all"
                                    ? "border-b-2 border-orange-500 text-orange-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => setFilter("approved")}
                            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                                filter === "approved"
                                    ? "border-b-2 border-orange-500 text-orange-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Đã duyệt
                        </button>
                        <button
                            onClick={() => setFilter("rejected")}
                            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                                filter === "rejected"
                                    ? "border-b-2 border-orange-500 text-orange-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Đã từ chối
                        </button>
                    </div>
                </div>

                {/* Submissions List */}
                <div className="space-y-4">
                    {filteredSubmissions.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <p className="text-gray-500 text-lg">
                                {searchTerm
                                    ? "Không tìm thấy đề xuất nào"
                                    : "Chưa có đề xuất nào"}
                            </p>
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
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                {submission.name}
                                            </h3>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    submission.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : submission.status === "approved"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {submission.status === "pending"
                                                    ? "⏳ Chờ duyệt"
                                                    : submission.status === "approved"
                                                    ? "✅ Đã duyệt"
                                                    : "❌ Đã từ chối"}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {submission.short}
                                        </p>

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

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {submission.tags.slice(0, 3).map((tag) => (
                                                <span
                                                    key={tag._id}
                                                    className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full"
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                            {submission.tags.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                    +{submission.tags.length - 3}
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            {submission.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleDetailClick(submission)}
                                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Chi Tiết
                                                    </button>
                                                    <button
                                                        onClick={() => handleApprove(submission._id)}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Duyệt
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectClick(submission)}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Từ Chối
                                                    </button>
                                                </>
                                            )}

                                            {submission.status === "approved" && submission.recipeId && (
                                                <button
                                                    onClick={() => navigate(`/recipes/${submission.recipeId}`)}
                                                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Xem Công Thức
                                                </button>
                                            )}

                                            {(submission.status === "rejected" || submission.status === "approved") && (
                                                <button
                                                    onClick={() => handleDetailClick(submission)}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Chi Tiết
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

            {/* Reject Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            ❌ Từ Chối Đề Xuất
                        </h3>

                        <p className="text-gray-600 mb-4">
                            Đề xuất: <strong>{selectedSubmission?.name}</strong>
                        </p>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lý do từ chối:
                        </label>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Nhập lý do từ chối..."
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        />

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => {
                                    setRejectModalOpen(false);
                                    setRejectionReason("");
                                    setSelectedSubmission(null);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleRejectSubmit}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Xác Nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {detailModalOpen && selectedSubmission && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Chi Tiết Đề Xuất</h2>
                            <button
                                onClick={() => {
                                    setDetailModalOpen(false);
                                    setSelectedSubmission(null);
                                }}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Image */}
                            <img
                                src={selectedSubmission.image}
                                alt={selectedSubmission.name}
                                className="w-full h-64 object-cover rounded-lg mb-6"
                            />

                            {/* Title & Status */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                        {selectedSubmission.name}
                                    </h3>
                                    <p className="text-gray-600">{selectedSubmission.short}</p>
                                </div>
                                <span
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                                        selectedSubmission.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : selectedSubmission.status === "approved"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {selectedSubmission.status === "pending"
                                        ? "⏳ Chờ duyệt"
                                        : selectedSubmission.status === "approved"
                                        ? "✅ Đã duyệt"
                                        : "❌ Đã từ chối"}
                                </span>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <Clock className="w-6 h-6 mx-auto text-orange-500 mb-2" />
                                    <p className="text-sm text-gray-600">Thời gian</p>
                                    <p className="font-bold">{selectedSubmission.time} phút</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <Users className="w-6 h-6 mx-auto text-orange-500 mb-2" />
                                    <p className="text-sm text-gray-600">Khẩu phần</p>
                                    <p className="font-bold">{selectedSubmission.size} người</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <Flame className="w-6 h-6 mx-auto text-orange-500 mb-2" />
                                    <p className="text-sm text-gray-600">Calo</p>
                                    <p className="font-bold">{selectedSubmission.calories} kcal</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <Calendar className="w-6 h-6 mx-auto text-orange-500 mb-2" />
                                    <p className="text-sm text-gray-600">Độ khó</p>
                                    <p className="font-bold capitalize">{selectedSubmission.difficulty}</p>
                                </div>
                            </div>

                            {/* Ingredients */}
                            <div className="mb-6">
                                <h4 className="text-xl font-bold text-gray-800 mb-3">Nguyên liệu</h4>
                                <ul className="space-y-2">
                                    {(() => {
                                        if (selectedSubmission.ingredientsWithDetails && selectedSubmission.ingredientsWithDetails.length > 0) {
                                            return selectedSubmission.ingredientsWithDetails.map((detail, index) => {
                                                // Tìm tên nguyên liệu từ ingredients array
                                                const ingredient = selectedSubmission.ingredients.find(
                                                    (ing: any) => String(ing._id) === String(detail.ingredientId)
                                                );
                                                const ingredientName = ingredient?.name || detail.name || `Ingredient ${index + 1}`;
                                                
                                                return (
                                                    <li key={index} className="flex items-center gap-2">
                                                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                                        <span>
                                                            {ingredientName}: <strong>{detail.quantity} {detail.unit}</strong>
                                                        </span>
                                                    </li>
                                                );
                                            });
                                        } else if (selectedSubmission.ingredients && selectedSubmission.ingredients.length > 0) {
                                            return selectedSubmission.ingredients.map((ingredient, index) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                                    <span>{ingredient.name}</span>
                                                </li>
                                            ));
                                        } else {
                                            return <p className="text-gray-500">Chưa có thông tin nguyên liệu</p>;
                                        }
                                    })()}
                                </ul>
                            </div>

                            {/* Instructions */}
                            <div className="mb-6">
                                <h4 className="text-xl font-bold text-gray-800 mb-3">Các bước thực hiện</h4>
                                {selectedSubmission.instructions && selectedSubmission.instructions.length > 0 ? (
                                    <div className="space-y-4">
                                        {selectedSubmission.instructions.map((instruction, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start gap-3 mb-2">
                                                    <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                                                        {index + 1}
                                                    </span>
                                                    <h5 className="font-bold text-lg">{instruction.title || `Bước ${index + 1}`}</h5>
                                                </div>
                                                {instruction.images && instruction.images.length > 0 && (
                                                    <div className="flex gap-2 mb-2 ml-11">
                                                        {instruction.images.map((img, imgIdx) => (
                                                            <img
                                                                key={imgIdx}
                                                                src={img}
                                                                alt={`Bước ${index + 1} - Hình ${imgIdx + 1}`}
                                                                className="w-24 h-24 object-cover rounded"
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                {instruction.subTitle && instruction.subTitle.length > 0 && (
                                                    <ul className="ml-11 space-y-1">
                                                        {instruction.subTitle.map((sub, subIdx) => (
                                                            <li key={subIdx} className="text-gray-700">• {sub}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Chưa có hướng dẫn</p>
                                )}
                            </div>

                            {/* Tags */}
                            {selectedSubmission.tags && selectedSubmission.tags.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-xl font-bold text-gray-800 mb-3">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSubmission.tags.map((tag) => (
                                            <span
                                                key={tag._id}
                                                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                                            >
                                                #{tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Category & Cuisine */}
                            <div className="mb-6 grid grid-cols-2 gap-4">
                                {selectedSubmission.category && (
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-2">Danh mục</h4>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                            {selectedSubmission.category.name}
                                        </span>
                                    </div>
                                )}
                                {selectedSubmission.cuisine && (
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-2">Quốc gia</h4>
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                            {selectedSubmission.cuisine.name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Rejection Reason */}
                            {selectedSubmission.status === "rejected" && selectedSubmission.rejectionReason && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <h4 className="text-lg font-bold text-red-800 mb-2">❌ Lý do từ chối</h4>
                                    <p className="text-red-700">{selectedSubmission.rejectionReason}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            {selectedSubmission.status === "pending" && (
                                <div className="flex gap-4 pt-4 border-t">
                                    <button
                                        onClick={() => {
                                            setDetailModalOpen(false);
                                            handleRejectClick(selectedSubmission);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition-colors"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Từ chối
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDetailModalOpen(false);
                                            handleApprove(selectedSubmission._id);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition-colors"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Duyệt món ăn
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingRecipes;
