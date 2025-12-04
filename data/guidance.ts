import { EventPhase } from "../utils/eventCategorization.ts";

type TipsContent = {
    title: string;
    tips: string[];
};

type ResourcesContent = {
    title: string;
    isResource: true;
    resources: Array<{
        name: string;
        contact?: string;
        links?: string[];
    }>;
    disclaimer: string;
};

export const guidanceContent: {
    'Awareness': TipsContent;
    'Engagement': TipsContent;
    'Seeking Help': ResourcesContent;
} = {
    'Awareness': {
        title: "Understanding Your Inner World",
        tips: [
            "Practice mindful check-ins: Take 60 seconds to just notice your breath and how your body feels.",
            "Try the 5-4-3-2-1 grounding technique when you feel overwhelmed.",
            "Journal for five minutes without judgment. Write whatever comes to mind.",
            "Notice your physical responses to emotions (e.g., tight chest when anxious).",
        ]
    },
    'Engagement': {
        title: "Connecting and Expressing",
        tips: [
            "Join a group activity, even if it feels a bit daunting at first.",
            "Express yourself through a creative outlet like painting, music, or dance.",
            "Share something you're grateful for with a friend or family member.",
            "Practice active listening when someone is talking to you. It builds stronger connections.",
        ]
    },
    'Seeking Help': {
        title: "Resources for Support",
        isResource: true,
        resources: [
            { name: "Campus Counseling Center (Mock)", contact: "(555) 123-4567 | counseling@bkbirlacollege.edu" },
            { name: "National Helpline (Mock)", contact: "Call or Text 988" },
            { name: "Online Resources (Examples)", links: ["mindful.org", "nami.org", "thetrevorproject.org"] },
        ],
        disclaimer: "These are example resources. If you are in crisis, please contact a real local emergency service."
    }
};