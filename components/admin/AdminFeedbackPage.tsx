import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiMessageSquare, FiUser, FiCalendar, FiClock } from 'react-icons/fi';

const AdminFeedbackPage: React.FC = () => {
    const { getAllSurveyResponses } = useAuth();

    const responses = useMemo(() => getAllSurveyResponses(), [getAllSurveyResponses]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2 flex items-center"><FiMessageSquare /></span> User Feedback
                </h1>
                <div className="text-sm text-gray-500">
                    Total Responses: {responses.length}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                                <th className="p-4">User</th>
                                <th className="p-4">Date & Time</th>
                                <th className="p-4">Responses</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {responses.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-gray-500">
                                        No feedback responses found.
                                    </td>
                                </tr>
                            ) : (
                                responses.map(({ user, response }) => (
                                    <tr key={response.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 align-top">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-brand-passport-primary/10 flex items-center justify-center text-brand-passport-primary mr-3">
                                                    <FiUser />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.fullName}</div>
                                                    <div className="text-xs text-gray-500">{user.contact}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top whitespace-nowrap text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <span className="mr-1.5 text-gray-400 flex items-center"><FiCalendar /></span>
                                                {new Date(response.timestamp).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <span className="mr-1.5 text-gray-400 flex items-center"><FiClock /></span>
                                                {new Date(response.timestamp).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="space-y-2">
                                                {Object.entries(response.answers).map(([question, answer], idx) => (
                                                    <div key={idx} className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                        <div className="text-xs font-medium text-gray-500 mb-1">
                                                            Q: {question}
                                                        </div>
                                                        <div className="text-sm text-gray-800">
                                                            {String(answer)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminFeedbackPage;