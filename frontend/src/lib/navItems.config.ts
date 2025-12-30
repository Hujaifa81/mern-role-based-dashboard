import { NavSection } from "@/types/dashboard.interface";
import { getDefaultDashboardRoute, UserRole } from "./auth-utils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);

    return [
        {
            items: [
                {
                    title: "Dashboard",
                    href: defaultDashboard,
                    icon: "LayoutDashboard",
                    roles: ["USER", "ADMIN"],
                },
            ]
        },
        {
            title: "Profile Overview",
            items:[
                {
                    title: "My Profile",
                    href: "/profile",
                    icon: "UserCircle",
                    roles: ["USER", "ADMIN"],
                }
            ]
        },
        {
            title: "Settings",
            items: [
                {
                    title: "Change Password",
                    href: "/change-password",
                    icon: "Settings",
                    roles: ["USER", "ADMIN"],
                },
            ],
        },
    ]
}

export const getUserNavItems = (): NavSection[] => {
    return [
        {
            title: "Activity",
            items: [
                {
                    title: "My Activity Logs",
                    href: "/dashboard/my-activity",
                    icon: "Activity",
                    roles: ["USER"],
                },
            ],
        },
    ]
}

export const adminNavItems: NavSection[] = [
    {
        title: "User Management",
        items: [
            {
                title: "All Users",
                href: "/admin/dashboard/users-management",
                icon: "Users",
                roles: ["ADMIN"],
            },
        ],
    },
    {
        title: "Analytics",
        items: [
            {
                title: "Dashboard Overview",
                href: "/admin/dashboard/analytics",
                icon: "BarChart",
                roles: ["ADMIN"],
            },
            {
                title: "User Statistics",
                href: "/admin/dashboard/user-stats",
                icon: "TrendingUp",
                roles: ["ADMIN"],
            },
            {
                title: "Registration Trends",
                href: "/admin/dashboard/registration-trends",
                icon: "LineChart",
                roles: ["ADMIN"],
            },
        ],
    },
    {
        title: "Activity Logs",
        items: [
            {
                title: "All Activity Logs",
                href: "/admin/dashboard/activity-logs",
                icon: "FileText",
                roles: ["ADMIN"],
            },
            {
                title: "Recent Activities",
                href: "/admin/dashboard/recent-activities",
                icon: "Clock",
                roles: ["ADMIN"],
            },
        ],
    }
]

export const getNavItemsByRole = async (role: UserRole): Promise<NavSection[]> => {
    const commonNavItems = getCommonNavItems(role);

    switch (role) {
        case "ADMIN":
            return [...commonNavItems, ...adminNavItems];
        case "USER":
            return [...commonNavItems, ...getUserNavItems()];
        default:
            return [];
    }
}