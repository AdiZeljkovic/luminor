"use client";

import { Check, X, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface SeoHelperProps {
    title: string;
    content: string; // HTML content
    keyword?: string; // Focus keyword (optional)
}

interface CheckItem {
    id: string;
    label: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
}

export default function SeoHelper({ title, content, keyword = '' }: SeoHelperProps) {
    const [checks, setChecks] = useState<CheckItem[]>([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const newChecks: CheckItem[] = [];
        let passed = 0;
        let total = 0;

        // 1. Title Length
        const titleLen = title.length;
        if (titleLen === 0) {
            newChecks.push({ id: 'title', label: 'Title Length', status: 'fail', message: 'Title is empty' });
        } else if (titleLen < 40) {
            newChecks.push({ id: 'title', label: 'Title Length', status: 'warning', message: 'Title is too short (< 40 chars)' });
        } else if (titleLen > 60) {
            newChecks.push({ id: 'title', label: 'Title Length', status: 'warning', message: 'Title is too long (> 60 chars)' });
        } else {
            newChecks.push({ id: 'title', label: 'Title Length', status: 'pass', message: 'Perfect length (40-60 chars)' });
            passed++;
        }
        total++;

        // 2. Content Length (Word Count)
        const strippedContent = content.replace(/<[^>]*>?/gm, ''); // Remove HTML tags
        const wordCount = strippedContent.trim().split(/\s+/).length;

        if (wordCount < 10) {
            newChecks.push({ id: 'content', label: 'Content Length', status: 'fail', message: 'Content is effectively empty' });
        } else if (wordCount < 300) {
            newChecks.push({ id: 'content', label: 'Content Length', status: 'warning', message: `Too short (${wordCount}/300 words)` });
        } else {
            newChecks.push({ id: 'content', label: 'Content Length', status: 'pass', message: `Good length (${wordCount} words)` });
            passed++;
        }
        total++;

        // 3. Keyword Checks (Only if keyword provided)
        if (keyword.trim()) {
            const k = keyword.toLowerCase();
            const t = title.toLowerCase();
            const c = strippedContent.toLowerCase();

            // Keyword in Title
            if (t.includes(k)) {
                newChecks.push({ id: 'key_title', label: 'Keyword in Title', status: 'pass', message: 'Keyword found in title' });
                passed++;
            } else {
                newChecks.push({ id: 'key_title', label: 'Keyword in Title', status: 'fail', message: 'Keyword missing from title' });
            }
            total++;

            // Keyword Density (Simple)
            const count = (c.match(new RegExp(k, 'g')) || []).length;
            if (count === 0) {
                newChecks.push({ id: 'key_density', label: 'Keyword Density', status: 'fail', message: 'Keyword not found in content' });
            } else {
                newChecks.push({ id: 'key_density', label: 'Keyword Density', status: 'pass', message: `Found ${count} times` });
                passed++;
            }
            total++;
        }

        setChecks(newChecks);
        setScore(Math.round((passed / total) * 100) || 0);

    }, [title, content, keyword]);

    const getIcon = (status: string) => {
        switch (status) {
            case 'pass': return <Check size={16} className="text-green-600" />;
            case 'fail': return <X size={16} className="text-red-500" />;
            case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
            default: return null;
        }
    };

    return (
        <div className="card-brutal p-5 bg-white space-y-4 sticky top-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-bold font-display text-[#0F172A]">SEO Score</h3>
                <div className={`text-xl font-extrabold ${score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                    {score}%
                </div>
            </div>

            <div className="space-y-3">
                {checks.map(check => (
                    <div key={check.id} className="flex items-start gap-3 text-sm">
                        <div className="mt-0.5 shrink-0">{getIcon(check.status)}</div>
                        <div>
                            <p className="font-bold text-gray-700">{check.label}</p>
                            <p className="text-xs text-gray-500">{check.message}</p>
                        </div>
                    </div>
                ))}
            </div>

            {!keyword && (
                <p className="text-xs text-gray-400 italic text-center mt-2">
                    Enter a "Focus Keyword" to enable more checks.
                </p>
            )}
        </div>
    );
}
